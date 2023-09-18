# js 权威指南学习记录

## 第四章 表达式与操作符

- eval 函数也存在安全风险，并且在大多数情况下都可以通过其他更安全的方式来替代
- 使用 Function 构造函数来替代
- const code = 'console.log("Hello, World!");';
- const fn = new Function(code);
- fn();
- 逗号操作符
- 逗号操作符唯一常见的使用场景就是有多个循环变量的 for 循环
- for(let i=0,j=10;i<j;i++,j--){console.log(i+j)}

## 第五章 语句

## 第六章 对象

## 第七章 数组

flatMap 可以将数组中的数组取出 并拍平

## 第八章 函数

JavaScript 使用词法作用域(lexical scoping)。这意味着函数执行时使用的是定义函数时生效的变量作用域，而不是调用函数时生效的变量作用域
JavaScript 函数对象的内部状态不仅要包括函数代码，还要包括对函数定义所在作用域的引用。这种函数对象与作用域(即一组变量绑定)组合起来解析函数变量的机制，在计算机科学文献中被称作闭包(closure)

## 第九章 类

## 第十章 模块

基于闭包的自动模块化

```js
const modules = {}
function require(moduleName) { return modules[moduleName] }

modules["set.js"] = (function() {
const exports = {}

// set.js 文件的内同在这里
export.BitSet = class BitSet { ... }
return exports
}())

modules["stats.js"] = (function() {
const exports = {}

// stats.js 文件的内容在这里
const sum = (x, y) => x + y
const square = x => x \* x
export.mean = function(data) { ... }
}())
// 把所有模块都打包到类似上面的单个文件中之后 可以像下面这样写代码来使用他们
// 取得对所需模块的引用
const stats = require("stats.js")
const BitSet = require("sets.js").BitSet

// 接下来写使用这些模块的代码
let s = new BitSet(100)
s.insert(10)
s.insert(20)
s.insert(30)
let average = stats.mean([...s])// 平均数是 20
```

以上代码展示了针对浏览器的代码打包工具的基本工作原理 也是对 node 程序中使用 require 函数的一个简单介绍

## 第十一章 js 标准库

- Set 类实现了 forEach 方法 但是没有索引
- Map 类 有 keys values entries 方法 也实现了 forEach((value,key)) 方法
- WeakMap 类是 Map 类的一个变体 它不会阻止键值被当作垃圾收集
- WeakMap 的键必须是对象或者数组
- WeakMap 不是可迭代对象 没有 keys values forEach 方法
- WeakMap 没有实现 size 属性
- WeakMap 的主要用途是实现值与对象的关联而不导致内存泄漏 使用 WeakMap 可以避免阻止对象被垃圾回收，因为 WeakMap 中的键是弱引用，当对象不再被引用时，垃圾回收器会自动回收对应的键值对。这样可以避免内存泄漏问题

## 第十二章 迭代器与生成器

生成器 是一种使用强大的新 es6 语法定义的迭代器 特别适合要迭代的值不是某个数据结构的元素 而是计算结果的场景
调用生成器函数并不会实际执行函数体 而是返回一个生成器对象。这个生成器对象是一个迭代器 调用它的 next()方法会导致生成器函数的函数体从头开始执行，直至遇见一个 yield 语句。yield 是 es6 新特性 类似于 return 语句 yield 语句的值会成为调用迭代器的 next()方法的返回值。

## 生成器函数 最常见的用途是创建迭代器

## 第十三章 异步 javascript

async 内部原理是把函数体变成一个生成器函数 await 利用生成器的暂停操作 等待 promise 执行完毕

```js
function async(fn) {
  return new Promise((resolve, reject) => {
    function onFulfilled(value) {
      try {
        const result = fn(value);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    function onRejected(error) {
      reject(error);
    }

    const generator = fn();

    function runGenerator(value) {
      const { value: promise, done } = generator.next(value);

      if (done) {
        resolve(promise);
      } else {
        promise.then(onFulfilled, onRejected).then(runGenerator, onRejected);
      }
    }

    runGenerator();
  });
}
```

for await 循环 也是基于 promise 的

```js
const fs = require("fs");
async function parseFile(filenane) {
let stream = fs.createReadStrean(filename, { encoding; "utf-8"});
for await (let chunk of strean) {
parseChunk(chunk); //假设 parseChunk()是在其他地方定义的
}
}
```

异步迭代器

- 区别 1 异步可迭代对象以符号名字 Symbol。asyncIterator 而非 Symbol.iterator
- 2 异步迭代器的 next 方法返回一个 promise 解决为一个迭代器结果对象 而不是直接返回一个迭代器结果对象

  ```js
  class AsyncQueue {
    constructor() {
      this.queue = [];
      this.isProcessing = false;
    }

    enqueue(item) {
      this.queue.push(item);
      if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      await item();
    }

    this.isProcessing = false;
  }

  [Symbol.asyncIterator]() {
    return {
      next: async () => {
        if (this.queue.length > 0) {
          const item = this.queue.shift();
          await item();
          return { value: undefined, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
  }
  // -----------------------------------------------
  const queue = new AsyncQueue();

  queue.enqueue(async () => {
    console.log('Task 1');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  queue.enqueue(async () => {
    console.log('Task 2');
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  (async () => {
    for await (const \_ of queue) {
      console.log('Task completed');
    }
  })();
  ```

异步生成器

## 第十四章 元编程

```js
  // 返回{value: 1, writable:true, enumerable:true, configurable:true)
  Object.getOwnPropertyDescriptor((x: 1}, "x");

  //这个对象有一个只读的访问器属性
  const random = {
  get octet() { return Math.floor(Math.randon()*256); },
  }
  // 返回{ get: /*func\*/, set:undefined, enumerable:true, configurable:true)
  Object.getOwnPropertyDescr-Lptor(random, "octet");

  //对继承的属性或不存在的属性返回 undefined
  Object.getOwnPropertyDescriptor({), "x") // => undefined；没有这个属性
  Object.getOwnPropertyDescriptorCf), "toStrlng") // => undefined：继承的属性
```

要设置属性的特性或者要创建一个具有指定特性的属性，可以调用 Object.defineProperty()方法
如果想一次性创建或修改多个属性，可以使用 Object.definePropertiesO.第一个参数是要修改的对象，第二个参数也是一个对象，该对象将要创建或修改的属性的名称映射到这些属性的属性描述符。例如：

```js
let p = Object.definePropertles({}, {
  X： { value: 1, writable: true, enumerable: true, configurable：true },
  y： { value: 1, writable: true, enunerable; true, configurable: true ),
  r： {
    get() ( return Math.sqrt(this.x _ this.x + this.y _ this.y); },
    enumerable: true,
    configurable: true
  }
));
p.r // => Math.SQRTZ
```

```js
/\*

- 定义一入新的 Object.assignDescriptorsO 函数
- 这个函数与 Obj 住 Ct.assign。类似，只不过会从源对象
- 向目标对象复制属性描述符，而不仅仅复制属性的值
- 这个函数会复制所有自有属性，包括可枚举和不可枚举的
- 因为是复制描述符，它也会从源对象复制获取方法并重写
- 目标对象的设置方法，而不是调用相应的获取方法和设置方法
- Object.assignDescriptorsO 会将自己代码中封装的
- Object.deflnePropertyO 抛出的 TypeError 传播出来
- 如果目标对象被封存或冻结，或者如果有任何来源属性尝试
- 修改目标对象上已有的不可配置属性，就会发生错误
- 注意，这里是使用 Object.deftneP「ope「ty()把属性
- asslgnDescriptors 添加给 Object 的，因此可以把这
- 个新函数像 Object.assignO 一样设置为不可枚举属性
  \*/
  Object.defineProperty(Object, "assignDescrlptors", (
    //与调用 Object.assign。时的特性保持一致
    writable: true,
    enumerable: false,
    configurable: true,
    //这个函数是 asslgnDescriptors 属性的值
    value: function(target, ...sources) {
      for(let source if sources){
        for(let name of Object.getOwnPropertyNames(source)) {
          let desc = Object.getOwnPropertyDescriptor(source, name);
          Object.defineProperty(target, nane, desc);
        }
        for(let symbol of Object.getOwnPropertySymbols(source)) {
          let desc = Object.getOwnPropertyDescriptor(source, symbol);
          Object.defineProperty(target, symbol, desc);
        }
      }
      return target;
    }
  })
  let q = Object.assignDescriptors((), o); // 复制属性描述符
```

- Object.seal() 类似 Object.preventExtensions(),但除了让对象不可扩展，它也
- 会让对象的所有自有属性不可扩展。这意味着不能给对象添加新属性，也不能删除
- 或配置已有属性。不过，可写的已有属性依然可写。没有办法“解封”已被“封存”
- 的对象。可以使用 Object.isSealed()确定对象是否被封存。
- Object.freeze()会更严密地“锁定”对象。除了让对象不可扩展，让它的属性不
- 可配置，该函数还会把对象的全部自有属性变成只读的(如果对象有访问器属性， 且该访问器属性有设置方法，则这些属性不会受影响，仍然可以调用它们给属性赋值)。使用 Object.isFroze()确定对象是否被冻结。
- Symbol.iterator 和 Symbol.asynciterator 符号可以让对象或类把自己变成可迭代对象和异步可迭代对象
- Symbol.hasinstance 意味着我们可以使用 instanceof 操作符对适当定义的伪类型对象去执行通用类型检查。
- Symbol.species 它是一个函数值，该函数用于创建派生对象的构造函数。

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array; // 将 Symbol.species 属性指向 Array 构造函数
  }
}

const myArr = new MyArray(1, 2, 3);
const filteredArr = myArr.filter((num) => num > 1);

console.log(filteredArr instanceof MyArray); // false
console.log(filteredArr instanceof Array); // true
```

- Symbol.isConcatSpreadable
- Symbol.toPrimitive
- Symbol.unscopables
- 第十五章 浏览器中的 javascript
- 同源策略指的是对 javascript 代码能够访问和操作说明 web 内容的一整套限制。通常在页面中包含 iframe 元素时就会涉及同源策略 此时 同源策略控制着一个窗格中的 js 与另一个窗格中的 js 的交互 脚本只能读取与包含他的文档同源 window 和 document 对象的属性
- shadowRoot 属性如果需要，JavaScript 可以通过这个属性来访问影子根节点的元素
- 类似地，应用给影子宿主元素的阳光 DOM 样式也不会影响影子根节点。影子 DOM 中的元素会从阳光 DOM 继承字体大小和背景颜色等，而影子 DOM
- 中的样式可以选择使用阳光 DOM 中定义的 CSS 变量。不过在大多数情况下，阳光 DOM 的样式与影子 DOM 的样式是完全独立的。因此 Web 组件的作者和 Web 组件的用户不用担心他们的样式会冲突或抵触。可以像这样限定 CSS 的范围或许是影子 DOM 最重要的特性。
- 影子 DOM 中发生的某些事件（如“load”）会被封闭在影子 DOM 中。另外一些事件，像 focus, mouse 和键盘事件则会向上冒泡，穿透影子 DOM。当一个发源于影子 DOM 内的事件跨过了边界开始向阳光 DOM 传播时，其 target 属性会变成影子宿主元素，就好像事件直接起源于该元素一样。
- EventSource 构造函数 SSE （Server-Sent Event,服务器发送事件）
- 可以检测服务端发送的消息

```js
let ticker = new EventSource("stockprices.php");
ticker.addEventListener("bid", (event) => (
dtspXayNewBid(event.data);
}
```

// bid 是服务端设置的类型 如果服务端没有设置事件类型 那么默认的 message

```html
<head>
  <tltle>S5E Chat</title>
  </head>
  <body>
  <!--聊天室的in只有一个文本输入字段-->
  <!--新聊天消息会插入这个输入字段前面 -->
  <input ld="input" style="wldth:100; padding:10px; border:solid black 2px" />
  <script>
  //注重一些UI的细节
  let nick = propipt("Enter your nickname"); 〃取得用户昵称
  let input = document.getElenentById("input"); // 找到输入字段
  input.focus(); //设置键盘焦点
  //使用EventSource 册新消息通知
  let chat = new EventSource("/chat");
  chat.addEventListener("chat", event => { // 收到聊天消息时
    let div = document.createElenent("div");//创建＜dlv＞元素
    div.append(event.data);//添加消息的文本
    input.before(div);//添加到输入字段前
    input. scrollIntoView();//确保输入元素可见
  })；

  //使用 fetch。把用户消息发送到服务器
  input.addEventListener("change", ()=>{ // 当用户按回车时
    fetch("/chat", { //发送 HTTP 请求
      method; "POST",//带主体的 POST
      body: nick + ": " + input.value//包含用户昵称和输入
    })
    .catch(e => console.error); //忽略响应，但打印错误
      input.value ="" //清除输入框
    })
  })
</scrlpt>

</body>

```
