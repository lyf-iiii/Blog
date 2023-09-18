# koa 源码学习

## Application 分析

### 创建服务

```js
// application.js
listen(...args) {
  debug("listen");
  // 使用http创建服务
  const server = http.createServer(this.callback());
  return server.listen(...args);
}
```

```js
// application.js
callback() {
  const fn = this.compose(this.middleware); // 组合所有中间件 并将结果fn赋值给fn变量

  if (!this.listenerCount("error")) this.on("error", this.onerror); // 判断的是否有error时间的监听器 如果不存在则调用this.onerror处理错误

  const handleRequest = (req, res) => {
    const ctx = this.createContext(req, res); // 创建新的ctx对象
    if (!this.ctxStorage) {
      return this.handleRequest(ctx, fn);
    }
    // 如果存在this.ctxStorage对象表示外部指定使用上下文存储，那么使用ctxStorage.run(ctx, async()) 来确保重写this.ctx属性的时候不会影响到请求相关的context数据
    return this.ctxStorage.run(ctx, async () => {
      return await this.handleRequest(ctx, fn);
    });
  };

  return handleRequest;
}
```

### 中间件实现原理

```js
// application.js
use(fn) {
  // 入参必须是函数
  if (typeof fn !== "function")
    throw new TypeError("middleware must be a function!");
  debug("use %s", fn._name || fn.name || "-");
  // koa注册中间件的时候 会不断的向里面push
  this.middleware.push(fn);
  return this;
}
```

```js
function compose(middleware) {
  // 入参必须是一个数组
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  // 数组中的每一项必须是函数
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  // 返回闭包
  return function (context, next) {
    // last called middleware #
    // 初始化数组执行的下标
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      // 上次中间件执行的下标不能大于这次的下标
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      // 如果下标等于中间件的长度 说明执行完毕
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        // 用递归方法执行await next() 后面的逻辑
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

### koa 如何封装 ctx

```js
module.exports = class Application extends Emitter {
  constructor(options) {
    super();
    // ...
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
};
```

- 继续翻 callback 代码，可以看到在 handleRequest 里面创建了 ctx 对象，通过 createContext 来创建的。

```js
createContext(req, res) {
  /** @type {Context} */
  const context = Object.create(this.context);
  /** @type {KoaRequest} */
  const request = (context.request = Object.create(this.request));
  /** @type {KoaResponse} */
  const response = (context.response = Object.create(this.response));
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.originalUrl = request.originalUrl = req.url;
  context.state = {};
  return context;
}
```

- createContext 中的 context 对象是 从 this.context 来的 而 构造器中的 context 是从 lib 中的 context 继承的

### handleRequest 实现

- handleRequest 在 callback 函数中被调用 引用了 this.handleRequest

```js
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res;
  res.statusCode = 404;
  const onerror = (err) => ctx.onerror(err);
  const handleResponse = () => respond(ctx);
  onFinished(res, onerror);
  return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}
```

- respond 做了什么事

```js
function respond(ctx) {
  // allow bypassing koa
  // 允许跳出koa
  if (ctx.respond === false) return;
  // 检查是否为原生的可写入流
  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  // 如果相应的statuses是body为空的类型，这个时候直接将body设置为空
  if (statuses.empty[code]) {
    // strip headers
    // 带响应头
    ctx.body = null;
    return res.end();
  }

  if (ctx.method === 'HEAD') {
    // headersSent属性是Node原生的response对象上的，用于检查HTTP响应头是否被发送
    // 如果头未被发送，并且响应头没有Content-Length属性，那么添加length头
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // 如果body为null
  if (body == null) {
    if (ctx.response._explicitNullBody) {
      // 移出Content-Type 和 Transfer-Encoding 并返回结果
      ctx.response.remove('Content-Type');
      ctx.response.remove('Transfer-Encoding');
      ctx.length = 0;
      return res.end();
    }
    // Http为2+的版本的时候，设置body为对应的http状态码
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    // 如果headersSent不为真，直接返回ctx.type为text,txt.length为Buffer.byteLength(body)
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  // body为Buffer或者string类型的时候
  if (Buffer.isBuffer(body)) return res.end(body);
  if (typeof body === 'string') return res.end(body);
  // body为Stream时，开启管道body.pipe
  if (body instanceof Stream) return body.pipe(res);
  // body为json的时候，转化为字符串，并设置ctx.length后返回结果。
  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

- respond 方法的主要任务是根据请求处理的结果生成合适的响应报文，并将其发送给客户端
  - 设置响应头部信息
    - content-type Cache-control Last-Modified 等标准头部信息 或自定义的头部信息
  - 根据请求处理的结果生成响应内容：使用模版引擎渲染 html 页面、序列化 json 数据、直接输出文本、调用静态文件等方式得到最终的响应内容
  - 将响应报文发送给客户端 将响应状态码、http 头部信息和征文一起作为响应报文发送给浏览器端

### 异常处理

```js
onerror(err) {
  // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
  // See https://github.com/koajs/koa/issues/1466
  // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
  // 首先进行错误类型检测，只有 Error 对象或者其子类才能被处理
  const isNativeError =
    Object.prototype.toString.call(err) === "[object Error]" ||
    err instanceof Error;
  if (!isNativeError)
    throw new TypeError(util.format("non-error thrown: %j", err));
  // 如果错误对象的 status 属性值为 404 或者 expose 为 true，则表示该不需要输出详细的错误信息，则直接返回。
  if (err.status === 404 || err.expose) return;
  if (this.silent) return; // 如果设置了 silent 选项，则仅返回，不输出错误信息。

  const msg = err.stack || err.toString();
  console.error(`\n${msg.replace(/^/gm, "  ")}\n`); // 否则，将错误信息打印出来，并在行首添加两个空格进行缩进，使得错误信息更清晰。
}
```

## context 的实现

### 委托机制

- symbol 的应用

```js
// context.js
const delegate = require('delegates');
const COOKIES = Symbol('context#cookies');
```

- 创建实例的过程是典型的单例模式

```js
// delegates
function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}
```

```js
// delegates
Delegator.prototype.method = function (name) {
  var proto = this.proto;
  var target = this.target;
  //    存入 methods 数组
  this.methods.push(name);
  //  以闭包的形式，将对proto方法的调用转为this[target]上相关方法的调用
  proto[name] = function () {
    //    applay改变this指向
    return this[target][name].apply(this[target], arguments);
  };
  //    返回delegator实例对象，从而实现链式调用。
  return this;
};
```
