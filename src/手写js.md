# 手写 Js 练习

## Proxy 表单验证

```js
// 验证规则
const validators = {
  name: {
    validate(value) {
      return value.length > 6;
    },
    message: '用户名长度不能小于6',
  },
  password: {
    validate(value) {
      return value.length > 10;
    },
    message: '密码长度不能小于十',
  },
  mobile: {
    validate(value) {
      return /^1(3|5|7|8|9)[0-9]{0}$/.test(value);
    },
    message: '手机号格式错误',
  },
};

// 验证方法
function validator(obj, validators) {
  return new Proxy(obj, {
    set(target, key, value) {
      const validator = validators[key];
      if (!validator) {
        target[key] = value;
      } else if (validator.validate(value)) {
        target[key] = value;
      } else {
        alert(validator.message || '');
      }
    },
  });
}
let form = {};
form = validator(form, validators);
form.name = '666';
form.password = '1sfdrfserwer13';
```

## 双向绑定 Object.defineProperty

```html
<input type="text" id="input" />
<p id="p"></p>
<script>
  var input = document.getElementById('input');
  var p = document.getElementById('p');
  var obj = {
    name: '',
  };

  Object.defineProperty(obj, 'name', {
    get: function (val) {
      return val;
    },
    set: function (val) {
      input.value = val;
      p.innerHTML = val;
    },
  });
  input.addEventListener('input', function (e) {
    obj.name = e.target.value;
  });
</script>
```

## 双向绑定 Proxy

```html
<input type="text" id="input" />
<h2>您输入的内容是：<i id="Txt"></i></h2>
<script>
  let oInput = document.getElementById('input');
  let oTxt = document.getElementById('Txt');

  let obj = {
    name: '',
  };

  let newProxy = new Proxy(obj, {
    get: (target, key, receiver) => {
      return Reflect.get(target, key, receiver);
    },
    set: (target, key, value, receiver) => {
      if (key === 'text') {
        oTxt.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
  oInput.addEventListener('keyup', (e) => {
    newProxy.text = e.target.value;
  });
</script>
```

## ajax

```js
function ajax(url, methods, body, headers) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open(methods, url);
    for (let key in headers) {
      req.setRequestHeader(key, headers[key]);
    }
    req.onreadystatechange(() => {
      if (req.readystate == 4) {
        if (req.status >= '200' && req.status <= 300) {
          resolve(req.responseText);
        } else {
          reject(req);
        }
      }
    });
    req.send(body);
  });
}
```

## 寄生式组合继承

```js
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  Parent.call(this, '蔡大大');
}
Child.prototype = Parent.prototype; // 缺点 对子类原型对操作会影响到父类对原型操作
Child.prototype.constructor = Child;
const child1 = new Child();
const child2 = new Child();
child1.name[0] = '鹿晗';
console.log(child1.name);
console.log(child2.name);
console.log(child2.getName());

// 五、寄生式组合继承  改良版
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  Parent.call(this, '蔡大大');
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
const child1 = new Child();
const child2 = new Child();
child1.name[0] = '鹿晗';
console.log(child1.name);
console.log(child2.name);
console.log(child2.getName());

const parent = new Parent();
console.log(parent.getName()); // undefined 因为浅拷贝 所以 Child对构造函数没有对Parent的原型直接操作
```

## new 操作符

```js
function myNew(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw 'myNew function the first param must be a function';
  }
  // 新建一个对象 将此对象原型绑定到构造函数到prototype上
  var newObj = Object.create(ctor.prototype);
  // this绑定
  const ctorRerurnResult = newObj.apply(this, args);
  // 若newObj 是一个不为空的 对象
  var isObject =
    typeof ctorRerurnResult === 'Object' && ctorRerurnResult != null;
  // 若 newObj 是一个 函数
  var isFunction = typeof ctorRerurnResult === 'Function';
  // 如果
  if (isFunction || isObject) {
    return ctorRerurnResult;
  }
  return newObj;
}
```

## Object.assign()

```js
Object.assign2 = function (target, ...source) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  let ret = Object(target);
  source.forEach(function (obj) {
    if (obj !== null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
    }
  });
};
function objectAssign(target, ...sources) {
  if (target == null || target == undefined) {
    throw Error();
  }
  target = Object(target);

  for (let source of sources) {
    if (source == null) continue;
    merge(Object.keys(source), source);
    merge(Object.getOwnPropertySymbols(source), source);
  }

  function merge(keys = [], source) {
    for (let key of keys) {
      target[key] = source[key];
      if (target[key] !== source[key]) {
        throw Error();
      }
    }
  }
  return target;
}
```

## Object.create()

```js
function myCreate(obj) {
  // 新声明一个函数
  function C() {}
  // 将函数的原型指向obj
  C.prototype = obj;
  // 返回这个函数的实例化对象
  return new C();
}
```

## 数组扁平化

```js
// 方法一  flat
let arr = [1, 2, [3, 4, [5, [6]]]];
console.log(arr.flat(Infinity)); //flat参数为指定要提取嵌套数组的结构深度，默认值为 1

// 方法二 reduce
function fn(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? fn(cur) : cur);
  }, []);
}
// 方法三
const res2 = JSON.stringify(arr).replace(/\[|\]/g, '').split(',');
// 弊端 他会把所有元素的数据类型变成字符串
// 方法三 改良版
const res3 = JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');

// 方法四  函数递归
const res5 = [];
const fn = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      fn(arr[i]);
    } else {
      res5.push(arr[i]);
    }
  }
};
fn(arr);
```

## 浅拷贝

```js
function shallowCopy(obj) {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
}
var person1 = shallowCopy(person);
person1.name = '王小星';
person1.hobby[0] = '玩耍';
console.log(perosn);
console.log(person1);
```

## 深拷贝

```js
// 1.深拷贝
function deepClone(obj) {
  var cloneObj = new obj.constructor();
  // var cloneObj = {}
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== 'object' || obj === null) return obj;
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      closeObj[i] = deepClone(obj[i]);
    }
  }
  return cloneObj;
}
// 2.深拷贝
var person1 = JSON.parse(JSON.stringify(person));
// 缺点 不能拷贝 正则 function函数
```

## 防抖

```js
function debounce(fn, delay) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}
```

## 节流

```js
function throttle(fn, delay) {
  const timeout = null;
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn();
        timeout = null;
      }, delay);
    }
  };
}
```

## 使用迭代的方式实现 flatten 函数

```js
var arr = [1, 2, 3, [4, 5], [6, [7, [8]]]];

function wrap() {
  let ret = [];
  return function flat(a) {
    for (var item of a) {
      if (item.construstor === Array) {
        ret.concat(flat(item));
      } else {
        ret.push(item);
      }
    }
    return ret;
  };
}

console.log(wrap()(arr));
```

## 事件循环 browser

```js
// 题目1
console.log('script start');
setTimeout(() => {
  console.log('setTimeout');
}, 1000);
Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });
async function errorFunc() {
  try {
    await Promise.reject('error!!!');
  } catch (e) {
    console.log('error caught');
  }
  console.log('errorFunc');
  return Promise.resolve('errorFunc success');
}
errorFunc().then((res) => console.log('errorFunc then res'));

console.log('script end');

// 1. 脚本先执行同步代码, 宏任务, 顺序是 "script start", setTimeout, "script end", 由于 setTimeout 是异步任务, 所以程序不会等待它完成, 所以 setTimeout 的回调函数会被挂起, 在将来等待时间完成之后就会把它重新调入回调队列, 第一轮执行完成之后, 此时微任务有 Promise.resolve(), errorFunc(), 它们会被加入回调队列, 顺序是 Promise.resolve() = errorFunc()
// 2. 此时主线程处于空闲状态, 需要从回调队列中提取任务, 队列是先进先出, 所以取出来的是 Promise.resolve(), 此时它就会进入调用栈, 接着主线程就从调用栈中取出它运行, 所以现在就会输出 promise1, 与此同时, 产生了下一个微任务, 这个微任务接着也会被加入回调队列, 此时回调队列的顺序是 errorFunc() = Promise.resolve() 产生的微任务(PR)
// 3. 接下来同理, errorFunc() 会被处理, 因为 await 会阻塞异步操作, 所以这个 await 后面的 Promise 不会去回调队列排队, 而是等待完成, 所以 "error caught" 就会被输出, 接着是一段同步代码, 所以就会输出 "errorFunc", 同理, 异步函数返回的 Promise 会被加入回调队列中排队, 此时回调队列是 PR = errorFunc 返回的回调
// 4. 同理, 此时会执行 "promise 2", 接着就会执行 "errorFunc then res"
// 5. 接着就是 setTimeout 的等待时间到了, 其回调函数加入回调队列, 执行 "setTimeout", 因为宏任务一次只执行一次, 然后是执行所有的微任务, 所有微任务执行完之后, 再执行下一次宏任务, 所以就算 setTimeout 计时时间为 0, 也是最后执行
// 6. 最后的运行结果为 "script start", "script end", "promise 1", "error caught", "errorFunc", "promise 2", "errorFunc then res", "setTimeout"

// 题目2

console.log('start');
setTimeout(() => {
  // 宏1
  console.log('children2');
  Promise.resolve().then(() => {
    // 微1
    console.log('children3');
  });
}, 0);

new Promise(function (resolve, reject) {
  console.log('children4');
  setTimeout(function () {
    // 宏2
    console.log('children5');
    resolve('children6');
  }, 0);
}).then((res) => {
  // 微2
  console.log('children7');
  setTimeout(() => {
    // 宏3
    console.log(res);
  }, 0);
});

//start ，children4，children2，children3，children5，children7 ，children 6

// 题目3
const p = function () {
  return new Promise((resolve, reject) => {
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 宏1
        resolve(1);
      }, 0);
      resolve(2);
    });
    p1.then((res) => {
      // 微1
      console.log(res);
    });
    console.log(3); // 主程序
    resolve(4);
  });
};
p().then((res) => {
  // 微2
  console.log(res);
});
console.log('end'); // 主程序
// 3 end 2 4

//题目4
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start'); // 主程序
setTimeout(function () {
  console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end'); // 主程序
// script start，async1 start,async2,promise1,script end,async1 end,promise2 ,setTimeout

//题目5
//
let resolvePromise = new Promise((resolve) => {
  let resolvedPromise = Promise.resolve();
  resolve(resolvedPromise);
  // 提示：resolve(resolvedPromise) 等同于：
  // Promise.resolve().then(() => resolvedPromise.then(resolve));
});
resolvePromise.then(() => {
  // 微1
  console.log('resolvePromise resolved');
});
let resolvedPromiseThen = Promise.resolve().then((res) => {
  // 微2
  console.log('promise1');
});
resolvedPromiseThen
  .then(() => {
    // 微3
    console.log('promise2');
  })
  .then(() => {
    // 微4
    console.log('promise3');
  });
//promise1，promise2，resolvePromise resolved，promise3

// 题目6
console.log('script start');

setTimeout(() => {
  console.log('Gopal');
}, 1 * 2000);

Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

async function foo() {
  await bar();
  console.log('async1 end');
}
foo();

async function errorFunc() {
  try {
    // Tips:参考：https://zh.javascript.info/promise-error-handling：隐式 try…catch
    // Promise.reject()方法返回一个带有拒绝原因的Promise对象
    // Promise.reject('error!!!') === new Error('error!!!')
    await Promise.reject('error!!!');
  } catch (e) {
    console.log(e);
  }
  console.log('async1');
  return Promise.resolve('async1 success');
}
errorFunc().then((res) => console.log(res));

function bar() {
  console.log('async2 end');
}

console.log('script end');
// script start，async2 end，script end ，promise1，async1 end，error!!!,async1,promise2,async success

// 题目7
new Promise((resolve, reject) => {
  console.log(1);
  resolve();
})
  .then(() => {
    console.log(2);
    new Promise((resolve, reject) => {
      console.log(3);
      setTimeout(() => {
        reject();
      }, 3 * 1000);
      resolve();
    })
      .then(() => {
        console.log(4);
        new Promise((resolve, reject) => {
          console.log(5);
          resolve();
        })
          .then(() => {
            console.log(7);
          })
          .then(() => {
            console.log(9);
          });
      })
      .then(() => {
        console.log(8);
      });
  })
  .then(() => {
    console.log(6);
  });
// 1，2，3，4，5，6，7，8，9

// 题目8
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
  new Promise((resolve) => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5');
  });
});

Promise.reject().then(
  () => {
    console.log('13');
  },
  () => {
    console.log('12');
  },
);

new Promise((resolve) => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8');
});

setTimeout(() => {
  console.log('9');
  Promise.resolve().then(() => {
    console.log('10');
  });
  new Promise((resolve) => {
    console.log('11');
    resolve();
  }).then(() => {
    console.log('12');
  });
});
// 1，7，12，8，2，4，3，5，9，11，10，12
```

## 闭包 每隔 1s 打印 1，2，3，4

```js
for (var i = 1; i < 5; i++) {
  (function (i) {
    // 自执行函数触发闭包
    setTimeout(() => console.log(i), 1000 * i);
  })(i);
}
```

## 模版引擎

```js
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18,
};
render(template, data); // 我是姓名，年龄18，性别undefined

function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模版字符串正则
  if (reg.test(template)) {
    const name = reg.exec(template)[1]; // 查找当前模版里第一个模版字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模版字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模版没有模版字符串直接返回
}
```

## sleep

```js
// sleep函数作用是让线程休眠，等到指定时间再重新唤起
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}
function test() {
  console.log('111');
  sleep(2000);
  console.log('222');
}

test();

// promise方式
function sleep(ms) {
  return new Promise((resolve) => {
    console.log(111);
    setTimeout(resolve, ms);
  });
}
sleep(500).then(() => console.log(222));
```

## Promise

```js
function myPromise(constructor){
  let self = this;//谁调用 this 就指向谁
  self.status = "pending" //定义状态改变前的初始状态
  //定义状态为resolved的时候的状态
  self.value = undefined
  //定义状态为rejected的时候的状态
  self.reason = undefined
  function resolved(value) {
    if(self.status === "pending"){
      self.value = value;
      self.status = "resolved"
    }
  }
  function rejected(reason) {
    if(self.status === "pending"){
      self.reason = reason;
      self.status = "rejected"
    }
  }
  //捕获构造异常
  try{
    constructor(resolved,rejected)
  }catch(e){
    reject(e)
  }
}
//在myPromise的原型上定义脸是调用的then方法
myPromise.prototype.then = function(onFullfilled,onRejeccted){
  let self = this
  switch(self.status){
    case "resolved"
      onFullfilled(self.value)
      break
    case "rejected"
      onRejeccted(self.reason)
      break
    default
  }
}
```

## Promise.all()

```js
Promise.all = function (promiseArr) {
  let index = 0,
    result = [];
  promiseArr.forEach((p, i) => {
    Promise.resolve(p).then(
      (val) => {
        index++;
        result[i] = val;
        if (promiseArr.length === index) {
          resolve(result);
        }
      },
      (err) => {
        reject(err);
      },
    );
  });
};
```

## Promise.race()

```js
// Promise.race()会返回一个由所有可迭代实例中第一个fulfilled或rejected的实例包装后的新实例
// Promse.race就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态
Promise.race = function (promiseArr) {
  promiseArr.forEach((p, i) => {
    Promise.resolve(p).then(
      (val) => {
        resolve(val);
      },
      (err) => {
        reject(err);
      },
    );
  });
};
```

## Promise.allSettled

```js
Promise.allSettled = function (promiseArr) {
  const arr = [];
  promiseArr.forEach((p, i) => {
    Promise.resolve(p)
      .then(
        (val) => {
          arr.push({ status: 'fullfilled', value: val });
        },
        (reason) => {
          arr.push({ status: 'rejected', reason });
        },
      )
      .finally(() => {
        if (i >= promiseArr.length - 1) {
          resolve(arr);
        }
      });
  });
};
```

## 瀑布流

```html
<div id="box">
  <ul></ul>
  <ul></ul>
  <ul></ul>
  <ul></ul>
</div>
<script>
  var box = document.getElementById('box');
  var ul = box.children;
  // //加载图片的方法
  function insert() {
    var x = 0;
    var srcNum = Math.floor(Math.random() * 35); //35是35张图片，可改成任意数，我这里总共是35张图片。
    var newli = document.createElement('li');
    newli.innerHTML = '<img src="https://robohash.org/' + srcNum + '" alt="">'; //这是图片的文件名，要求是统一。
    var minH = Math.min(
      ul[0].clientHeight,
      ul[1].clientHeight,
      ul[2].clientHeight,
      ul[3].clientHeight,
    );
    for (var i = 0; i < ul.length; i++) {
      if (ul[i].clientHeight == minH) {
        x = i;
        break;
      }
    }
    ul[x].appendChild(newli);
  }
  for (var i = 0; i < 20; i++) {
    insert();
  }
  document.onscroll = function () {
    var viewH =
      document.body.clientHeight || document.documentElement.clientHeight; // 浏览器视窗高度
    var winH = document.documentElement.scrollHeight; //body实际高度
    var scrollT = document.body.scrollTop || document.documentElement.scrollTop; // 滚动条下滑距离
    console.log(scrollT);
    if (winH - scrollT - viewH < 500) {
      for (var i = 0; i < 20; i++) {
        insert();
      }
    }
  };
</script>
```

## call

```js
/*
  第一个参数为null或者undefined时，this指向全局对象window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
  为了避免函数名与上下文(context)的属性发生冲突，使用Symbol类型作为唯一值
  将函数作为传入的上下文(context)属性执行
  函数执行完成后删除该属性
  返回执行结果
*/
Function.prototype.myCall = function (context, ...args) {
  let cxt = context || window;
  // 将当前被调用的方法定义在cxt.func上。（为了能以对象调用形式绑定this）
  // 新建一个唯一的Symbol变量避免重复
  let func = Symbol();
  cxt[func] = this;
  args = args ? args : [];
  // 以对象调用形式调用func，此时this指向cxt 也就是传入的需要绑定的this指向
  const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
  //删除该方法，不然会对传入对象造成污染（添加该方法）
  delete cxt[func];
  return res;
};
```

## apply

```js
Function.prototype.myApply = function (context, args = []) {
  let cxt = context || window;
  let func = Symbol();
  cxt[func] = this;
  const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
  delete cxt[func];
  return res;
};
```

## bind

```js
Function.prototype.myBind = function (context, ...args) {
  // 新建一个变量赋值为this，表示当前函数
  const fn = this;
  // debugger
  // 判断有没有传参进来，若为空则赋值[]
  args = args ? args : [];
  // 返回一个newFn函数，在里面调用fn
  return function newFn(...newFnArgs) {
    if (this instanceof newFn) {
      return new fn(...args, ...newFnArgs);
    }
    return fn.apply(context, [...args, ...newFnArgs]);
  };
};
```

## instanceof

```js
function myInstanecOf(left, right) {
  // 获取left的原型
  let proto = Object.getPrototypeOf(left);
  // 获取 right的prototype属性
  let prototype = right.prototype;
  // 设置while循环 循环条件为true
  while (true) {
    // 当原型不存在时跳出while循环
    if (!proto) return false;
    // 当监测到原型时返回true
    if (prototype === proto) return true;
    // proto赋值为上级原型
    proto = Object.getPrototypeOf(proto);
  }
}
```

## 数组随机排序

```js
let arr = [2, 3, 454, 34, 324, 32];
arr.sort(() => {
  return Math.random() > 0.5 ? -1 : 1;
});
// function randomSort(a, b) {
//   return Math.random() > 0.5 ? -1 : 1;
// }
console.log(arr);
```

## 拖拽

```html
<style>
  .box {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: red;
    cursor: move;
  }
</style>
<div class="box" id="drag"></div>
<script>
  window.onload = function () {
    var drag = document.getElementById('drag');
    drag.onmousedown = function (event) {
      var event = event || window.event;
      var diffX = event.clientX - drag.offsetLeft; //按下时鼠标跟div左侧的距离
      var diffY = event.clientY - drag.offsetTop; //按下时鼠标跟div上侧的距离
      if (typeof drag.setCapture !== 'undefined') {
        drag.setCapture(); //开启鼠标捕获
      }
      document.onmousemove = function (event) {
        var event = event || window.event;
        var moveX = event.clientX - diffX; //水平坐标
        var moveY = event.clientY - diffY; //垂直坐标
        if (moveX < 0) {
          moveX = 0;
        } else if (moveX > window.innerWidth - drag.offsetWidth) {
          moveX = window.innerWidth - drag.offsetWidth;
        }
        if (moveY < 0) {
          moveY = 0;
        } else if (moveY > window.innerHeight - drag.offsetHeight) {
          moveY = window.innerHeight - drag.offsetHeight;
        }
        // console.log(moveX, moveY)
        drag.style.left = moveX + 'px';
        drag.style.top = moveY + 'px';
      };
      document.onmouseup = function (event) {
        this.onmousemove = null;
        this.onmouseup = null;
        if (typeof drag.releaseCapture != 'undefined') {
          drag.releaseCapture();
        }
      };
    };
  };
</script>
```

## 轮播

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  .container {
    position: relative;
    width: 600px;
    height: 400px;
    margin: 100px auto 0 auto;
    box-shadow: 0 0 5px green;
    overflow: hidden;
  }

  .container .wrap {
    position: absolute;
    width: 4200px;
    height: 400px;
    z-index: 1;
  }

  .container .wrap img {
    float: left;
    width: 600px;
    height: 400px;
  }

  .container .buttons {
    position: absolute;
    right: 5px;
    bottom: 40px;
    width: 150px;
    height: 10px;
    z-index: 2;
  }

  .container .buttons span {
    margin-left: 5px;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: green;
    text-align: center;
    color: white;
    cursor: pointer;
  }

  .container .buttons span.on {
    background-color: red;
  }

  .container .arrow {
    position: absolute;
    top: 35%;
    color: green;
    padding: 0px 14px;
    border-radius: 50%;
    font-size: 50px;
    z-index: 2;
    display: none;
  }

  .container .arrow_left {
    left: 10px;
  }

  .container .arrow_right {
    right: 10px;
  }

  .container:hover .arrow {
    display: block;
  }

  .container .arrow:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
<div class="container">
  <div class="wrap" style="left: -600px;">
    <img src="./img/e.jpg" alt="" />
    <img src="./img/a.jpg" alt="" />
    <img src="./img/b.jpg" alt="" />
    <img src="./img/c.jpg" alt="" />
    <img src="./img/d.jpg" alt="" />
    <img src="./img/e.jpg" alt="" />
    <img src="./img/a.jpg" alt="" />
  </div>
  <div class="buttons">
    <span class="on">1</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
    <span>5</span>
  </div>
  <a
    href="javascript:;"
    rel="external nofollow"
    rel="external nofollow"
    rel="external nofollow"
    rel="external nofollow"
    class="arrow arrow_left"
    >&lt;</a
  >
  <a
    href="javascript:;"
    rel="external nofollow"
    rel="external nofollow"
    rel="external nofollow"
    rel="external nofollow"
    class="arrow arrow_right"
    >&gt;</a
  >
</div>
<script>
  var wrap = document.querySelector('.wrap');
  var next = document.querySelector('.arrow_right');
  var prev = document.querySelector('.arrow_left');
  next.onclick = function () {
    next_pic();
  };
  prev.onclick = function () {
    prev_pic();
  };
  function next_pic() {
    index++;
    if (index > 4) {
      index = 0;
    }
    showCurrentDot();
    var newLeft;
    if (wrap.style.left === '-3600px') {
      newLeft = -1200;
    } else {
      newLeft = parseInt(wrap.style.left) - 600;
    }
    wrap.style.left = newLeft + 'px';
  }
  function prev_pic() {
    index--;
    if (index < 0) {
      index = 4;
    }
    showCurrentDot();
    var newLeft;
    if (wrap.style.left === '0px') {
      newLeft = -2400;
    } else {
      newLeft = parseInt(wrap.style.left) + 600;
    }
    wrap.style.left = newLeft + 'px';
  }
  var timer = null;
  function autoPlay() {
    timer = setInterval(function () {
      next_pic();
    }, 2000);
  }
  autoPlay();

  var container = document.querySelector('.container');
  container.onmouseenter = function () {
    clearInterval(timer);
  };
  container.onmouseleave = function () {
    autoPlay();
  };

  var index = 0;
  var dots = document.getElementsByTagName('span');
  function showCurrentDot() {
    for (var i = 0, len = dots.length; i < len; i++) {
      dots[i].className = '';
    }
    dots[index].className = 'on';
  }

  for (var i = 0, len = dots.length; i < len; i++) {
    (function (i) {
      dots[i].onclick = function () {
        var dis = index - i;
        if (index == 4 && parseInt(wrap.style.left) !== -3000) {
          dis = dis - 5;
        }
        //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
        if (index == 0 && parseInt(wrap.style.left) !== -600) {
          dis = 5 + dis;
        }
        wrap.style.left = parseInt(wrap.style.left) + dis * 600 + 'px';
        index = i;
        showCurrentDot();
      };
    })(i);
  }
</script>
```

## 图片懒加载

```js
let imgList = [...document.querySelectorAll('img')];
let length = imgList.length;

const imgLazyLoad = function () {
  let count = 0;
  return (function () {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // 代表图片出现在 视窗中
        img.src = img.dataset.src; // 给img的src属性赋值
        deleteIndexList.push(index);
        count++;
        if (count === length) {
          // 如果所有图片已经全部加载 那么清除事件监听
          document.removeEventListener('scroll', imgLazyLoad);
        }
      }
    });
    imgList = imgList.filter((img, index) => !deleteIndexList.includes(index)); // 更新待加载待图片数组
  })();
};

// 这里最好加上防抖处理
document.addEventListener('scroll', imgLazyLoad);
```

## 模拟数组迭代器

```js
const arr = [1, 2, 3, 4, 5];
arr[Symbol.iterator] = function () {
  const target = this;
  const len = target.length;
  let index = 0;

  return {
    next() {
      return {
        value: index < len ? target[index] : undefined,
        done: index++ >= len,
      };
    },
  };
};
```

## range reserve

```html
<!--  将 1234 4个节点 变成 4321  -->
<div id="a">
  <span>1</span>
  <p>2</p>
  <a>3</a>
  <div>4</div>
</div>

<script>
  let element = document.getElementById('a');

  /* 普通解法 */
  function reverseChildren(element) {
    let children = Array.prototype.slice.call(element.childNodes);
    for (let child of children) {
      element.removeChild(child);
    }

    children.reverse();
    for (let child of children) {
      element.appendChild(child);
    }
  }
  /* 熟悉dom api后的解法 因为 insert一个node的时候 如果这个弄的本身存在dom 会自动remove */
  function reverseChildren(element) {
    var l = element.childNodes.length;
    while (l-- > 0) {
      element.appendChild(element.childNodes[l]);
    }
  }

  /* range 解法 */
  function reverseChildren(element) {
    let range = new Range(); // 创建range对象实例
    range.selectNodeContents(element); // 得到element节点的内容

    let fragment = range.extractContents(); // 拿出range中的内容 并产生一个fragment对象 node api会造成重排 fragment不会 此时fragment是一个空标签集合
    var l = fragment.childNodes.length;
    while (l-- > 0) {
      fragment.appendChild(fragment.childNodes[l]); // 往fragment的空标签中填值
    }
    element.appendChild(fragment);
  }

  reverseChildren(element);
</script>
```

## babel 插件 如何实现 jsx 到 js 到编译

```js
module.exports = function (babel) {
  var t = babel.types;
  return {
    name: 'custom-jsx-plugin',
    visitor: {
      JSXElement(path) {
        var openingElement = path.node.openingElement;
        var tagName = openingElement.name.name;
        var args = [];
        args.push(t.stringLiteral(tagName));
        var attribs = t.nullLiteral();
        args.push(attribs);
        var reactidentifier = t.identifier('React');
        var createElementIdentifier = t.identifier('createElement');
        var callee = t.memberExpression(
          reactidentifier,
          createElementIdentifier,
        );
        var callExpression = t.callExpression(callee, args);
        callExpression.arguments = callExpression.arguments.concat(
          path.node.children,
        );
        path.replaceWith(vallExpression, path.node);
      },
    },
  };
};
```
