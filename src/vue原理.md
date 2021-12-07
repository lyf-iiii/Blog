# vue 原理
## 响应性
```js
// 响应性
function convert(Obj) {
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    Object.defineProperties(obj, key, {
      get() {
        console.log(`getting key "${key}":${internalValue}`)
        return internalValue
      },
      set(newValue) {
        console.log(`setting key "${key}" to: ${newValue}`)
        internalValue = newValue
      }
    })
  })
}
```
## 依赖跟踪
```js
window.Dep = class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() { // 表示当前正在执行的代码  收集依赖项
    if (acriveUpdata) { // 当依赖发生更新
      this.subscribers.add(activeUpdate) // 把这个依赖加入到订阅者列表中
    }
  }

  notify() { // 表示依赖发生改变

    this.subscribers.forEach(sub => sub())// 获取订阅函数然后执行它
  }
}
let activeUpdate // 

function autorun(update) { //接收一个更新函数或者表达式
  //
  function wrappedUpdate() { // 当依赖关系发生改变 依然执行update
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}
autorun(() => {
  Dep.depend()
})
```

## 迷你观察者
```js
// 实质是创建了一个对象，当我们访问一个属性，它收集依赖，调用dep.depend,当我们通过赋值改变属性值，他调用deo.notify触发改变
class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() {  // 表示当前正在执行的代码  收集依赖项
    if (activeUpdate) { // 当依赖发生更新
      this.subscribers.add(activeUpdate)  // 把这个依赖加入到订阅者列表中
    }
  }

  notify() { // 表示依赖发生改变
    this.subscribers.forEach(sub => sub()) // 获取订阅函数然后执行它
  }
}

function observe(obj) {
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]

    const dep = new Dep()
    Object.defineProperty(obj, key, {
      // 在getter收集依赖项，当出发notify时重新运行
      get() {
        dep.depend()
        return internalValue
      },

      // setter用于调用notify
      set(newVal) {
        const changed = internalValue !== newVal
        internalValue = newVal
        if (changed) {
          dep.notify()
        }
      }
    })
  })
  return obj
}
let activeUpdate = null
function autorun(update) { // 接收一个更新函数或者表达式
  const wrappedUpdate = () => { // 当依赖关系发生改变 依然执行update
    activeUpdate = wrappedUpdate 
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}
```
## 插件 Vue.use()
- 插件的本质是一个函数 
```js
  function(Vue,options){
    // ...plugin code
  }
```
- 编写插件涉及到 `Vue.mixin API`
  - `Vue.mixin(options)` mixin的本质上是可重复使用的代码片段 是一个全局api
- $.options属性 
  - 很多人可能不太清楚$.options属性，其实每个组件都有$.options属性它表示实例组件的配置项，配置项可以是组件自身的配置也可以是继承过来的配置项或者是vue.mixin混入的。
