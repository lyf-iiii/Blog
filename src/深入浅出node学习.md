# 深入浅出 node.js 学习记录

## 第一章 node 简介

- 浏览器通过事件驱动来服务界面上的交互
- node 通过事件驱动来服务 I/O
- node 特点
  - 异步 I/O
    - 发起读取文件事件 在未来的某个时间里读取完成
  - 事件与回调函数
  - 单线程
  - 跨平台
- node 的应用场景
  - I/O 密集型 优势是 node 利用事件循环处理能力 而不是启动每个线程为每个请求服务资源占用极少
  - cpu 密集型 js 单线程 大循环长时间计算 导致 cpu 时间片不能释放 是的后续 I/O 无法发起 可以分解任务 不阻塞 I/O 又能并行异步 I/O 又能充分利用 cpu ，node 通过 c++扩展 做一些 v8 做不了的优化，还可以开启子进程 专门用于计算
- js 文件编译 commonjs 规范
  - require
  - module.exports
- c/c++模块的编译
  - process.dlopen()方法
- json 文件编译
  - 通过 fs
- node 把 js 代码转存成 c/c++ 到内存中 运行起来更快
- buffer crypto evals fs os 等模块都用 c/c++编写
- npm
  - 注册包仓库账号
    - npm adduser
  - 上传包
    - npm publish .
  - 管理包权限
  - npm owner ls eventproxy
  - npm owner ls
  - npm owner add <user> <packcage name>
  - npm owner rm <user> <packcage name>
- 阻塞 I/O 与 非阻塞 I/O
  - 阻塞 I/O 造成 CPU 等待 I/O，浪费等待时间，CPU 的处理能力不能得到充分利用。为了提高性能，内核提供了非阻塞 I/O。非阻塞 I/O 跟阻塞 I/O 的差别为调用之后会立即返回
  - 非阻塞 I/O 并没有完全执行 I/O 需要 cpu 去轮询确认数据获取
- 事件循环
  - 观察者 厨师做菜 收银小妹是观察者 收到点单是事件 一个观察者有多个事件 可能有多个观察者
  - 事件循环是典型的生产者消费者模型
    - 异步 I/O、网络请求 是事件的生产者
    - 事件循环从观察者那边去取出事件消费
  - 请求对象
    - 是异步 I/O 过程中的重要中间产物，所有的状态都保存在这个对象中，包括送入线程池等待执行以及 I/O 操作完毕后的回调处理
- 在 Node 中，除了 JavaScript 是单线程外，Node 自身其实是多线程的，只是 I/O 线程使用的 CPU 较少。另一个需要重视的观点则是，除了用户代码无法并行执行外，所有的 I/O（磁盘 I/O 和网络 I/O 等）则是可以并行起来的
- 非 I/O 的异步 API
  - setTimeout setInterval setImmediate process.nextTick()
  - process.nextTick() 用于立即异步执行任务
  - process.nextTick() 先于 setImmediate 执行

## 第四章 异步编程

### 4.1 函数式编程

#### 4.1.1 高阶函数

定义 把函数作为参数 或是将函数作为返回值的函数
在 node 自定义事件实例中通过为相同时间注册不同的回调函数可以很灵活的处理业务逻辑

```js
var emitter = new events.EventEmitter();
emitter.on('event_foo', function () {});
```

#### 4.1.2 偏函数用法

```js
var isType = function (type) {
  return function (obj) {
    return toString.call(obj) === '[object ' + type + ']';
  };
};

var isString = isType('String');
var isFunction = isType('Function');
```

### 4.2 异步编程的优势与难点

- node 利用 js 及其内部异步库 将异步直接提升到业务层面 这是一种创新

#### 4.2.1 优势

- node 优势是机遇事件驱动的异步非阻塞 I/O node 的优势是处理 I/O 密集型任务 对于 cpu 密集型任务 就要看硬件支持了

#### 4.2.2 难点

- 异常处理
  - 将异常作为回调函数的第一个实参传回，如果为空值，则表明异步调用没有异常抛出
  - 自行编写的异步方法的原则
    - 必须执行调用者传入的回调函数
    - 正确传递回异常供调用者判断
- 函数嵌套过深
- 阻塞代码
- 多线程编程
  - child_process 是其基础 api cluster 模块是更深层次的应用
- 异步转同步

### 4.3 异步编程的解决方案

- 事件发布/订阅模式

  - node 自身提供的 event 模块是发布订阅的一个简单实现 node 中部分模块都继承它 这个模块比前端大量 dom 事件简单 不存在事件冒泡 也不存在 preventDefault stopPropagation 和 stopImmediatePropagation 等控制事件传递的方法 具有 addListener on once removeListener removeAllListeners emit
  - 继承 events 模块

  ```js
  var events = require('events');
  function Stream() {
    event.EventEmitter(this);
  }
  util.inherits(Stream, events.EventEmitter);
  ```

  ```

  ```

- 利用事件队列解决雪崩问题

  - 雪崩问题 就是在高访问量 大病发量的情况下缓存失效的情景 此时大量请求涌入数据库中 数据库无法同时承受如此大的查询请求 进而王倩影响到网站整体的响应速度

  ```js
  // 此时大量 sql 涌入数据库中
  var select = function (callback) {
    db.select('SQL', function (results) {
      callback(results);
    });
  };
  // 增加状态控制 缺点连续的 select 只有第一次生效 后续的没有数据服务
  var status = 'ready';
  var select = function (callback) {
    if (status === 'ready') {
      status = 'pending';
      db.select('SQL', function (results) {
        status = 'ready';
        callback(results);
      });
    }
  };

  // 引入事件队列 第一次查询的结果会被后续公用
  var proxy = new events.EventEmitter();
  var status = 'ready';
  var select = function (callback) {
    proxy.once('selected', callback); // once 方法 保证查询开始到结束的过程永远只有一次
    if (status === 'ready') {
      status = 'pending';
      db.select('SQL', function (results) {
        proxy.emit('selected', results);
        status = 'ready';
      });
    }
  };
  ```

- 多异步之间的协作方案
  - 偏函数
  - 发布订阅模式（推荐）
  - EventProxy all tail after not any 方法
- Promise/Deferred 模式
  - promises/A

```js
var Deferred = function () {
  this.state = 'unfulfilled';
  this.promise = new Promise();
};

Deferred.prototype.resolve = function (obj) {
  this.state = 'fulfilled';
  this.promise.emit('success', obj);
};

Deferred.prototype.reject = function (err) {
  this.state = 'failed';
  this.promise.emit('error', err);
};

Deferred.prototype.progress = function (data) {
  this.promise.emit('progress', data);
};
```

- npm run q 将 readFile 封装成 promise

- promise 中的多异步协作 all 方法
- promise 的进阶知识
  - 要让 promise 支持链式执行 主要通过以下两个步骤
    - 将所有的回调都存到队列中
    - promise 完成时 逐个执行回调 一旦检测到返回了新的 promise 对象 停止执行 然后将当然 deferred 对象的 promise 引用改变为新的 promise 对象 并将队列中余下的回调转交给它
- 流程控制库
  - 尾触发与 next
    - 中间件机制使得在处理网络请求时 可以像面向切面编程一样进行过滤 验证 日志等功能 而不与具体业务逻辑产生关联 以致产生耦合
    - 在中间件尾触发模式中，当请求通过所有中间件时，最后一个中间件负责向客户端发送响应。这种方式可以确保响应是由最终执行的中间件生成的，并且可以对响应进行统一处理。
    - connect 核心实现

```js
function createServer() {
  function app(req, res) {
    app.handle(req, res);
  }
  utils.merge(app, proto);
  utils.merge(app, EventEmitter.prototype);
  app.route = '/';
  app.stack = [];
  for (var i = 0; i < arguments.length; ++i) {
    app.use(arguments[i]);
  }
  return app;
}
app.use = function (route, fn) {
  // some code
  this.stack.push({ route: route, handle: fn });

  return this;
};
app.listen = function () {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
app.handle = function (req, res, out) {
  // some code
  next();
};
function next(err) {
  // some code
  // next callback
  layer = stack[index++];

  layer.handle(req, res, next);
}
```

- async
  - series 串行执行方法 （无法满足前一个结果是后一个的调用）

```js
async.series(
  [
    function (callback) {
      fs.readFile('file1.txt', 'utf-8', callback);
    },
    function (callback) {
      fs.readFile('file2.txt', 'utf-8', callback);
    },
  ],
  function (err, results) {
    // results => [file1.txt, file2.txt]
  },
);
```

- parallel 并行执行方法
- waterfall 满足 前后结果传递需求的 串行执行方法
- step
- wind

### 4.4 异步并发控制

异步 I/O 需要一定的过载保护 因此有几种解决方案

- bagpipe push full 方法
- async 的解决方案 parallelLimit

## 第五章 内存控制

#### 5.1.2 v8 的内存限制

- V8 的这套内存管理机制在浏览器的应用场景下使用起来绰绰有余，足以胜任前端页面中的所有需求。但在 Node 中，这却限制了开发者随心所欲使用大内存的想法。

#### 5.1.3 v8 的对象分配

```shell
node --max-old-space-size=1700 test.js // 单位为 MB 老生代内存大小
// 或者
node --max-new-space-size=1024 test.js // 单位为 KB 新生代内存大小
```

`scavenge` 算法是新生代的 采用复制的方式复制存活的变量 并留下
`标记清除` 对所有的变量循环做标记 最后释放被标记的失活变量 缺点是会有内存碎片问题
`标记整理`解决内存碎片问题 将变量循环做标记 标记的同时将存活变量移到一边将另一边失活变量清除 移动导致执行速度没有标记清除快 所以 v8 中标记清除和标记整理是结合使用的
老生代容易造成全停顿 为了降低停顿时间 v8 从标记阶段入手增加了 `增量标记` 也就是拆分为许多小步进 每做完一步进就让 js 应用逻辑执行一小会儿
后序还引入了`延迟清理` `增量式整理`

### 5.2 高效实用内存

#### 5.2.1 作用域

- 在 JavaScript 中，实现外部作用域访问内部作用域中变量的方法叫做闭包（closure）

#### 5.3.2 堆外内存

通过 process.memoryUsage()的结果可以看到，堆中的内存用量总是小于进程的常驻内存用量，这意味着 Node 中的内存使用并非都是通过 V8 进行分配的。我们将那些不是通过 V8 分配的内存称为堆外内存。
这其中的原因是 Buffer 对象不同于其他对象，它不经过 V8 的内存分配机制，所以也不会有堆内存的大小限制。这意味着利用堆外内存可以突破内存限制的问题

### 5.4 内存泄漏

- 缓存
- 在 node 中 任何试图拿内存当缓存的行为都应当被限制 当然并不是不允许使用
- 采用 LRU 算法的缓存
- 归根结底使用 redis 就完事了
- 队列消费不及时
- 给异步任务设置执行超时
- 作用域未释放

### 5.5 内存泄漏排查

内存检查时检查堆快照

- node-heapdump
- node-memwatch

### 5.6 大内存应用

- node 处理大文件的方案时 stream 模块
- fs createReadStream createWriteStream 方法分别用于创建文件的可读流和可写流
- process 模块中的 stdin 和 stdout 分别是可读流和可写流的示例
- 可读流提供了管道方法 pipe 封装了 data 事件和写入操做

## 第六章 buffer

- node 中需要处理网络协议 操作数据库 处理图片 接收上传文件等 网络流和文件的操作中 需要处理大量二进制数据 于是 buffer 对象应运而生
- buffer 所占用的内存 不是通过 v8 分配的 属于堆外内存
- 值是 0-256 超过 就是值-256 小于 0 就是值+256 小数会被舍弃
- buffer 所使用的内存是 slab 一块申请号的固定大小的内存区域
- full 完全分配至状态
- partial 部分分配状态
- empty 没有被分配状态
- node 以 8kb 为界限来区分 buffer 是大对象还是小对象
- 需要超过 8kb 的 buffer 对象 将会直接分配一个 SlowBuffer 对象作为 slab 单元
- buffer 的转换
- 支持 ASCII UTF-8 UTF-16 Base64 Binary Hex
- isEncoding 判断是否可以转换
- buffer 的拼接
- setEncoding 解决拼接乱码
- 正确的拼接是用数组存储所有 buffer 片段 然后使用 buffer.concat 合并
- buffer 的传输性能是字符串的两倍
- fs.createReadStream(path, opts) 可以传入 highWaterMark 设置缓冲区 提高性能 值越大 读取速度越快

## 第七章 网络编程

- node 提供了 net dgram http https 这四个模块 分别处理 tcp udp http https
- tcp 服务器 面向连接

```js
  var net = require('net');

var server = net.createServer(function (socket) {
// 新的连接
socket.on('data', function (data) {
socket.write("你好");
});

socket.on('end', function () {
console.log(’连接断开’);
});
socket.write("欢迎光临《深入浅出 Node.js》示例：\n");
});

server.listen(8124, function () {
console.log('server bound');
});
```

- 除了监听以外 还可以堆 domain socketi 进行监听
- udp 服务器 不是面向传输面向传输 会丢包 常用于会丢包但不影响的场景 音频视频等

```js
var dgram = require('dgram');

var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
  console.log(
    'server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port,
  );
});

server.on('listening', function () {
  var address = server.address();
  console.log('server listening ' + address.address + ':' + address.port);
});

server.bind(41234);
```

- HTTP 服务器
- websocket 服务
- websocket 客户端基于事件的编程模型与 node 中自定义事件相差无几
- websocket 实现了客户端与服务端之间的长连接 而 node 事件驱动的方式十分擅长与大量的客户端保持高并发连接
- websocket 是基于 tcp 传输 但是基于 http 连接
- TLS/SSL
- 采用公私钥的方式进行加密
- node 底层采用 openssl 实现 TLS/SSL
- 中间人攻击 中间人对客户端扮演服务端角色 对服务端扮演客户端角色因此客户端和服务端几乎感受不到中间人的存在 为了解决这个问题 数据传输过程中还需要对的得到的公钥进行认证 以确认得到公钥是出自目标服务器。如果不能认证中间人可能会伪造站点相应给用户从而造成经济损失。（引入数字证书才进行认证 证书包含 服务器名称主机名 服务器公钥和签名颁发机构名称 来自签名颁发机构的签名）颁发机构有 CA
- 证书备齐后 node 的 tls 模块创建一个安全的 tcp 服务
- 与的 TCP 服务端客端相，TLS 的服务端客端仅仅只在书的上有，余部分本相同

## 第八章 构建 web 应用

- http_parser 会解析 http 请求返回的报文
- req.method 是 http 报文的开头通常是大写
  - GET 表示查看一个资源
  - POST 表示更新一个资源
  - DELETE 表示删除一个资源
  - PUT 表示新建一个资源
- req.url 是 http 报文的 第一行

```js
  // 根据路径进行业务处理的应用是静态文件的服务器 他会根据路径去查找磁盘中的文件 然后将其相应给客户端
  function (req, res) {
  var pathname = url.parse(req.url).pathname
  fs.readFile(path.join(ROOT, pathname), function (err, file) {
  if(err) {
  res.writeHead(404)
  res.end('找不到相关文件。- -')
  return
  }
  res.writeHead(200)
  res.end(file)
  }
  function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var paths = pathname.split('/');
  var controller = paths[1] || 'index';
  var action = paths[2] || 'index';
  var args = paths.slice(3);
  if (handles[controller] && handles[controller][action]) {
  handles[controller][action].apply(null, [req, res].concat(args)); } else {
  res.writeHead(500);
  res.end('不响应控制器');
  }
  }
```

- querystring 解析查询字符串

```js
  var url = require('url');
  var querystring = require('querystring');
  var query = querystring.parse(url.parse(req.url).query);
  // 更简洁的方法是给 url.parse()传递第二个参数，如下所示
  var query = url.parse(req.url, true).query;
  // 它会 foo=bar&baz=val 解为一个 JSON 对象，如下所示
  {
  foo: 'bar',
  baz: 'val'
  }
```

- req.headers
- cookie
- expires 表示过期时间
- cache-control 强缓存标志
- eTags 表示写上缓存 计算文件的 hash 值
- last-modified 计算文件修改的时间
- req.rawBody 请求体当中的数据
- req.body 得到表单中提交的数据
- req.files 文件上传
- 数据上传与安全
- 内存限制
  - 限制上传内容大小 一旦超过限制 停止接受不了数据 并相应 400 状态码
  - 通过流式解析 将数据流导向到磁盘中 node 只保留文件路径等小数据
- csrf 跨站脚本伪造
  - a 网站等留言 b 网站构造表单提交到 a 网站 a 网站的登录用户 访问 b 网站 就会自动提交留言并且包含用户的个人信息
  - 在服务器端对请求进行验证，确保请求来源合法，包括验证 Referer 头和 Origin 头
  - 表单提交二次验证
  - 敏感操作禁止使用 get get 会存在浏览器记录中 容易被利用
- mvc
- controller 控制器 一组行为的集合
- model 模型 数据相关的操作和封装
- view 视图 视图的渲染
- 路由解析 根据 url 寻找到对应的控制器和行为
- 行为调用相关的模型 进行数据操作
- 数据操作结束后 调用视图和相关数据进行页面渲染 输出到客户端
- RestFul
- 普通的 http 请求
  POST /user/add?username=jacksontian
  GET /user/remove?username=jacksontian
  POST /user/update?username=jacksontian
  GET /user/get?username=jacksontian
- RESTFul 请求
  POST /user/jacksontian
  DELETE /user/jacksontian
  PUT /user/jacksontian
  GET /user/jacksontian
- 中间件
- 从响应 hello world 和到实际项目 有太多琐碎的细节工作要完成 我们希望不用接触到这么多细节性的处理为此引入终极爱年间 middleware 来简化和隔离这些基础设施与业务逻辑之间的细节，让开发者能够关注业务上的开发以达到提升开发效率的目的
- 类似于 java 的 filter 过滤器 在进入具体业务处理之前 先让过滤器处理
- use 方法将所有的中间件组织起来

```js
app.use = function (path) {
  var handle = {
    // 第一个参数作为路径
    path: pathRegExp(path),
    // 其他的都是处理单元
    stack: Array.prototype.slice.call(arguments, 1),
  };
  routes.all.push(handle);
};
```

- 通过 next 传递异常
- 性能
  - 编写高效的中间件 必要时通过 jsperf.com 测试
  - 合理使用路由 提高路由的命中率
- 页面渲染 浏览器根据 content-type 不同的值渲染不同的内容
- 附件下载 content-type 是 content-disposition ： attackment
- 响应 json content-type application/json
- 相应跳转 res.setHeader('Location', url) res.writeHead(302) res.end('Redirect to' + url)
- 视图渲染

## 第九章 玩转进程

- 如何充分利用多核 cpu 服务器
- 如何保证进程的健壮性和稳定性
- 进程发展史
- 同步进程 一个进程一次解决一个请求 容易阻塞
- 复制进程 一个进程一次解决一个请求 可以复制进程状态解决 代价太大
- 多线程 cpu 通过切片为时间片处理不同线程的请求 线程池可以避免线程创建销毁的开销 线程共享数据节省内存 但是高并发多线程结构还是无法做到强大的伸缩性
- 事件驱动 node nginx 均是基于事件驱动的方式实现的 采用单线程避免了不必要的内存开销和上文切换开销
  - 由于有都在线程上，事驱动服务性能的在于 CPU 的能，它的上决定这服务的性能上，它不多程多线程中源上的，可性前者高。解决多 CPU 的用问题，的性能上是可的。
- 多进程架构

```js
  // 以下代码是 workers 通过 node workers.js 启动
  var http = require('http');
  http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  }).listen(Math.round((1 + Math.random()) \* 1000), '127.0.0.1');
  //workers 启动它 监听 1000 到 2000 之间的一个随机端口
  // 以下代码是 master 通过 node master.js 启动
  var fork = require('child_process').fork; var cpus = require('os').cpus();
  for (var i = 0; i < cpus.length; i++) {
  fork('./worker.js');
  }
```

- master 是主进程 每个 worker 都是工作进程 master 执行会复制进程
- 创建子进程
- spawn 启动一个子进程来执行命令 后面三种都是 spawn 的延申
- exec 启动一个子进程来执行命令 并提供一个回调函数 timeout 时限 超时杀死子进程
- execFile 启动一个子进程来执行可执行文件 timeout 时限 超时杀死子进程
- fork 与 spawn 类似 不同点在于它创建 Node 的子进程只需指定要执行的 js 文件模块即可
- 进程间通信
- web worker 为了防止 js 运行耗时阻塞 ui 渲染 html5 提出了 web Worker api
- 主线程与工作线程之间通过 onmessage postMessage 进行通信 子进程对象则由 send()方法实现主进程向子进程发送数据
- 句柄 解决文件描述符浪费的问题
- 端口共用
- 由于独立启动的进程互相之间并不知道文件描述符 所以监听相同端口时就会失败 但对于 send 发送的句柄还原出来的服务而言 他们的文件描述符时相同的 所以监听相同端口不会引起异常
- 至此已经成功搭建了集群 但是还有一些细节需要考虑
- 性能问题
- 多个工作进程的存货状态管理
- 工作进程的平滑重启
- 配置或者静态数据的动态重新载入
- 其他细节
- 进程事件
- error 当子进程无法被复制创建、无法被杀死、无法发送消息时会触发该事件
- exit 子进程退出时会触发 第二个参数是退出码是正常退出 如果是 null 是被杀死的
- close 在子进程的标准输入输出流种植时触发该事件 参数与 exit 相同
- disconnect 在父进程或子进程调用 disconnecct 方法时触发该事件
- 自动重启 当一个进程被杀死的时候 立即重启一个
- 限量重启 当进程重启频繁的时候 限制频繁重启的次数
- 负载均衡
- 轮叫调度 Round-robin 可以避免 cpu 和 I/O 繁忙差异导致的负载不均衡 Round-Robin 策略也可以通过代理服务器来实现 但是它会导致服务器上小号的文件描述符是平时方式的两倍
- 状态共享
- node 不允许在多个进程之间共享数据
- 第三方数据存储
  - 数据库
  - 磁盘文件
  - 缓存服务
- 第三方数据变化通知
  - 子进程定时轮询
- 主动通知
  - 设置一个通知进程专门进行数据改变轮询 发现数据更新及时推送到各个子进程中
- cluster 模块
- 事实上 cluster 模块就是 child_process 和 net 模块的组合应用 通过 so_reuseaddr 端口重用实现子进程共享端口
- cluster 事件
- fork 复制一个工作进程后触发该事件
- online 复制好一个工作进程后 工作进程主动发送一个 online 消息给主进程 主进程收到后触发
- listening 工作进程中调用 listen 后 发送一条 listening 消息给主进程 主进程收到消息后 触发该事件
- disconnect 主进程和工作进程之间 ipc 通道断开后会触发该事件
- exit 有工作进程退出时触发该事件
- setup cluster.setupMaster()执行后触发该事件

## 第十章 单元测试

- 编写可测试代码
- 单一职责
- 接口抽象
- 层次分离
- 断言
- 就是单元测试中用来保证最小单元是否正常的检测方法
- 断言用于检查程序在运行时是否满足期望
- 检测方法
  - ok() 判断结果是否为真
  - equal 判断实际值与期望值是否相等
  - notEqual 判断实际值与期望值是否不相等
  - deepEqual 判断实际值与期望值是否深度相等（对象或数组的元素是否相等）
  - notDeepEquel 判断是机制与期望值是否不深度相等
  - strictEqual 判断实际值与期望值是否严格相等
  - notStrictEqual 判断实际值与期望值是否不严格相等
  - throws 判断代码块是否抛出异常
  - doesNotThrow 判断代码块是否没有抛出异常
  - ifError 判断实际值是否为一个假值
- 测试框架
- mocha
- 测试风格
- TDD 测试驱动开发
  - 关注 所有功能是否被正确实现 每个功能都具备对应的测试用例
  - 表达 TDD 的表述方式偏向于功能说明书的风格
- BDD 行为驱动开发
  - 关注 整体行为是否符合预期 适合自顶向下的设计方式
  - 表达 更新接近于自然语言的习惯
- 测试用例
- 测试覆盖率
- jscover
- blacket
- mock
- muk muk.restore
- 私有方法的测试
- rewire
