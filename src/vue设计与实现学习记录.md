# Vue.js 设计与实现

## 第一篇 框架设计

### 声明式与命令式

- 命令式：JQuery 注重过程
- 声明式：VUE 注重结果
- vue 让用户只需要声明想要的结果 而过程由 vue 来处理，所以 vue 内部实现是命令式的 但暴露给用户是声明式的
- 声明式代码的性能不优于命令式代码的性能
  - 原因是 声明式代码处理事件是 处理差异时间 A + 直接修改的时间 B
  - 命令式 只有 直接修改的时间 B
- 保证可维护性的同时让性能损失最小化

### 运行时 和 编译时

- 运行时（render）： 树形结构的数据对象（{tag:'div',children:[{}]}） 变成 dom 函数
- 编译时（compiler）：将 html 标签解析为 树形结构的数据对象 供 render 函数使用

### 编写自定义的 formatter 使 ref 展示更加直观

- vue-devTools 打开设置 选择“Enable custom formatters” 就可以更直观的打印 proxy 对象

### 利用 tree-shaking 缩小构建的体积

- 条件是模块必须是 ESM 模块

## rollup 执行 tree-shaking

- 由于静态分析代码是 dead code 很困难 所以 rollup 希望用 `/*__PURE__*/` 标记这段代码没有副作用
- 副作用：当函数调用时 会对函数外部产生影响

### 自执行函数的妙用

- 当我们引入一个插件 或者是 vue.global.js 全局变量 Vue 就已经可以使用了因为在 rollup 中我们可以通过配置 format：‘iife'来设置

### 直接使用<script type="module"> 标签的原因

- 是因为 vue 输出 vue.esm-brower.js 文件

### 服务端渲染使用 require 引入 vue

```js
const Vue = require('vue');
```

### Vue3 是可以关闭 2.x 的选项模式的

- 不支持选项模式之后打包的体积会变小

### 错误处理

- callWithErrorHandling 统一的错误处理函数
- registerErrorHandler 注册统一错误处理的函数

### 虚拟 dom 与 render 函数与 h 函数的关系

```js
import { h } from 'vue'

export default {
  render() {
    return h('h1', { onClick:handler }) // 虚拟dom
  }
}

// --------------------

export default{
  render() {
    return {
       tag:'h1',
       props:{ onClick:handler }
    }
  }
}

```

- h 函数的返回值就是一个对象 作用就是让编写虚拟 dom 变得更加轻松，如果把 h 函数的调用换成 js 对象就需要写更多内容

### 渲染器

- 渲染器就是把 vnode 变成 真实 DOM

```js
// 接收vnode 和 container
function renderer(vnode, container) {
  // 使用tag 为标签名创建DOM
  const el = document.createElement(vnode.tag);
  // 遍历 props 将属性、事件添加到DOM元素
  for (const key in vnode.props) {
    el.addEventListener(key.substr(2).toLowerCase(), vnode.props[key]);
  }
  // 处理children
  // 文本节点
  if (typeof vnode.children === 'String') {
    el.appendChild(createTextNode(vnode.children));
    // chilren数组 递归
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((item) => renderer(item, el));
  }

  // 将元素添加到挂在点上
  container.appendChild(el);
}
```

### 组件

- vnode.tag 是一个函数

- 组件就是一组 DOM 元素的封装
- 这组 DOM 元素就是组件要渲染的内容，因此我们可以定义一个函数来代表组件，返回值就是组件要渲染的内容

```js
const myComponent = function () {
  return {
    tag: 'div',
    props: {
      onClick: () => alert('hello'),
    },
    children: 'click me',
  };
};
```

```js
function renderer() {
  if (typeof vnode.tag === 'string') {
    // 说明 vnode描述的是标签
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    // 说明 vnode 描述的是组件
    mountComponent(vnode, container);
  }
}

function mountElement() {}
function mountComponent() {}
```

### 编译器

- 编译器的作用其实就是将模版编译为渲染函数 template -> render()

## 第二篇 响应系统

### 响应式数据

- 定义：当 A 变量被一个副作用函数用来给 B 变量赋值，当 A 变量的值变化时，重新执行副作用函数

### 如何做到响应式数据

- 当副作用函数被执行的时候 缓存到一个容器中
- 当副作用函数用到的变量被重新设置后 从容器中重新拿出副作用函数执行

```js
// 存储副作用函数
const bucket = new Set();

// 原始数据
const data = { text: 'hello world' };
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    //将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    bucket.forEach((fn) => fn());
    // 返回 true 代表设置操作成功
    return true;
  },
});

// 副作用函数
function effect() {
  document.body.innerText = obj.text;
}

//  执行副作用函数，触发读取
effect();
// 1秒后修改响应式数据
setTimeout(() => {
  obj.text = 'hello vue3';
}, 1000);
```

### 更完善的响应式系统

#### 定义一个注册副作用函数的地方

- 使用一个 activeEffect 变量作为被注册的副作用函数
- effect 函数 转变成 注册副作用函数的一个函数
- 当触发 proxy 的 get 时将 activeEffect 压入桶中
- 达到受副作用函数名称影响的目的
- 但这还会有问题 因为 proxy 对象中如果一个没有被副作用函数使用的属性变化了 也会调用 proxy 的 get 副作用函数将会被调用

#### 使用 WeakMap 代替 Set 作为桶的数据结构

```js
const obj = new Proxy(data, {
  //拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key)
    // 返回属性值
    return target[key]
  },
  set(target, key, newVal){
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    trigger(target, key)
  }
})

// 在get拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect， 直接 return
  if(!activeEffect) return
  // 从桶中获取
  let depsMap = bucket.get(target)
  // 如果桶中没有新建一个空的Map
  if(!depsMap) {
    bucket.set(target, (depsMap = new Map())
  }
  // 按照字段名称获取对应的副作用函数集
  let deps = depsMap.get(key)
  // 如果对应key的副作用函数集时空的 那么新建一个Set集
  if(!deps){
    depsMap.set(target, (deps = new Set()))
  }
  // 将注册好的副作用函数 压入 Set集
  deps.add(activeEffect)
}
function trigger (target, key) {
  // 获取对象的map
  const depsMap = bucket.get(target)
  if(!depsMap) return
  // 得到副作用函数集
  const effects = depsMap.get(key)
  effects.forEach(fn => fn())
}
```

#### 分支切换

- 需求场景 当使用三元时 某个分支使用到的字段不再被读取 但是她的 effects 还在桶中 在别处改这个字段属性还会触发这边副作用函数的调用
- 注册副作用函数的时候增加一个属性 deps 用于存放与当前副作用函数存在联系的依赖集合
- 当注册副作用函数的时候 调用 cleapup 函数清除与当前副作用函数没联系的依赖
- 处理死循环 将原来的 set 当作参数新建一个 Set 去遍历

#### 嵌套 effect 和 effect 栈

- 需求场景 当我们注册副作用函数 activeEffect 时 发生了嵌套 那么当 activeEffect 变成 effectFn2 时 再改变 effectFn1 相关的字段 也只会执行 effectFn2 这个副作用函数
- 解决方案 建立一个注册副作用函数栈 effectStack

#### 无限递归循环

- 需求场景 副作用函数执行时 发生了字段属性自增 obj.bar++ 导致 无限递归循环
- 解决方案 设置守卫 当 trigger 触发的副作用函数与当前正在执行的副作用函数相同那么不执行

#### 调度执行

- 调度性：当 trigger 动作触发副作用函数重新执行的时候，有能力决定 副作用函数执行的时机、次数以及方式。
- 在注册 effect 函数的时候 设置第二个参数 options 选项参数 当副作用函数被调用的时候添加 options
- 在执行 trigger 的时候 判断 options 选项当中的 Scheduler 函数是否存在 如果存在执行 这个函数由用户配置

#### 计算属性 computed 与 lazy

- 需求场景 计算属性 当需要的时候 effect 再执行传递进来的副作用函数

- 添加 lazy 参数 options.lazy

- effect 函数的返回值是 effectFn 在 effectFn 函数中返回传给 effect 函数的 fn 的执行结果 然后再手动执行 effect 函数的返回值

- 这样就实现计算属性了

- ```js
  function computed(getter) {
    // 把getter 作为副作用函数 ， 创建一个 lazy的 effect函数
    const effectFn = effect(getter, {
      lazy: true,
    });

    const obj = {
      // 当读取 value 时才执行effectFn
      get value() {
        return effectFn();
      },
    };
    return obj;
  }
  ```

- 添加 value 字段 作为缓存值

- 添加 dirty 字段 判断是否要重新计算

- 添加 options.调度函数 调度函数会在依赖的响应式数据变化的时候执行 把 dirty 属性变成 true

- 当某个 effect 内部饮用了一个计算属性时 将不会更新 因为计算属性接收一个 getter 表达式 而且是一个 lazy 加载的 所以里面没有副作用函数栈 所以不会收集外面的 effect

- 解决方法 计算属性依赖的响应式数据变化时手动触发 trigger 调用计算属性的时候手动 track

#### watch

```js
function watch(source, cb) {
  effect(() => source.foo, {
    scheduler() {
      //  数据发生变化执行cb
      cb();
    },
  });
}
```

- 当封装通用的读取操作

```js
function watch(source, cb) {
  effect(() => traverse(source), {
    scheduler() {
      cb();
    },
  });
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么说明都不做
  if (typeof value === 'Object' || value === null || seen.has(value)) return;
  // 将数据添加到seen 中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);
  // 暂时不考虑数组等其他结构
  // 假设 value 就是一个对象， 使用for in 读取对象的每一个值， 并递归地调用 traverse 进行处理
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
```

- 处理接受 getter

```js
function watch(source, cb) {
  let getter;

  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
}
```

- 处理 cb 新旧值

```js
function watch(source,cb){
  let getter
   if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  const effectFn = effect(
  	() => getter(),
   	{
      lazy;true,
      scheduler(){
        newValue = effectFn()
    		cb(newValue, oldValue)
    		oldValue = newValue
      }
    }
  )
  const oldValue = effectFn()
}
```

- 处理 immediate

```js
let newValue,oldValue
function job = () =>{
  newValue = effectFn()
  cb(newValue, oldValue)
  oldValue = newValue
}
function watch(source,cb){
  let getter
   if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  const effectFn = effect(
  	() => getter(),
   	{
      lazy;true,
      scheduler:job()
    }
  )
  if(options.immediate){
    job
  } else{
  	oldValue = effectFn()
  }
}
```

- 处理微任务中使用调度函数 promise

```js
let newValue,oldValue
function job = () =>{
  newValue = effectFn()
  cb(newValue, oldValue)
  oldValue = newValue
}
function watch(source,cb){
  let getter
   if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  const effectFn = effect(
  	() => getter(),
   	{
      lazy;true,
      scheduler:()=>{
        if(options.flush === 'post'){
          const p = Promise.resolve()
          p.then(job)
        }else{
             job()
        }
      }
    }
  )
  if(options.immediate){
    job
  } else{
  	oldValue = effectFn()
  }
}
```

- 过期问题 注册到过期的事件 让他在没过期的事件之前执行完

#### Proxy Reflect

- 当侦测一个代理对象的变化时 会侦测不到 原因是 代理对象内部的 this 指向被代理的对象 所以变化的时候变化的是被代理的对象
- 使用 Reflect.get(target, key, receiver) receiver 代表谁在读取 p.bar 说明 p 在读取 这时就能侦测到 p.bar++的变化了 3
