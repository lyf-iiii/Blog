# Js 函数式编程
## Hello world
- task 
  - Write a function that takes an input string and returns it uppercased.
  - 编写一个接受输入字符串并以大写形式返回的函数。
```javascript
function upperCaser (input) {
  return input.toUpperCase()
}
module.exports = upperCaser
```
## Higher Order Functions
- task
  - Implement a function that takes a function as its first argument, a number num as its second argument, then executes the passed in function num times. Use the boilerplate code given to you below to get started. Most/all future exercises will provide boilerplate.
  - 实现一个函数，该函数将一个函数作为第一个参数，一个num作为第二个参数，然后执行传入的函数num次。
```javascript
// 我的答案
function repeat (operation, num) {
  // SOLUTION GOES HERE
  let n = 0
  let timer = setInterval(() => {
    operation()
    n++
  }, 100)
  n === num && clearInterval(timer)
}
// Do not remove the line below
module.exports = repeat
```
```javascript
// 官方答案
function repeat(operation, num) {
  if (num <= 0) return
  operation()
  return repeat(operation, --num)
}
module.exports = repeat
```

## map 
- Convert the following code from a for-loop to Array#map:
- numbers: An Array of 0 to 20 Integers between 0 and 9
- Your solution should use Array.prototype.map()
  * Do not use any for/while loops or Array.prototype.forEach.
  * Do not create any unnecessary functions e.g. helpers.
```javascript
// 我的答案
function doubleAll (numbers) {
  var result = []
  numbers.map(item => {
    result.push(item * 2)
  })
  return result
}
module.exports = doubleAll
```
```javascript
// 官方答案
module.exports = function doubleAll (numbers) {
  return numbers.map(item => {
    return item * 2
  })
}
```

## Filter
- task
  - Use Array#filter to write a function called getShortMessages.

  - getShortMessages takes an array of objects with '.message' properties and returns an array of messages that are less than < 50 characters long.
  - GetShortMessages占有一系列具有“.message”属性的对象，并返回长度为<50个字符的消息数组。
  - The function should return an array containing the messages themselves, without their containing object.
  - GetShortMessages占有一系列具有“.message”属性的对象，并返回长度为<50个字符的消息数组。
```javascript
// 我的答案
function getShortMessages (messages) {
  // SOLUTION GOES HERE
  return messages.filter(item => {
    return item.message.length < 50
  }).map(item => {
    return item.message
  })
}
module.exports = getShortMessages
```
```javascript
// 官方答案
module.exports = function getShortMessages(messages) {
  return messages.filter(function(item) {
    return item.message.length < 50
  }).map(function(item) {
    return item.message
  })
}
```

##  Basic: Every Some
- task  
  - Return a function that takes a list of valid users, and returns a function that returns true if all of the supplied users exist in the original list of users.
  - You only need to check that the ids match.
- argyments
  - goodUsers: a list of valid users

  - Use array#some and Array#every to check every user passed to your returned function exists in the array passed to the exported function.
```javascript
// 我的答案
function checkUsersValid (goodUsers) {
  return function allUsersValid (submittedUsers) {
    // SOLUTION GOES HERE
    return submittedUsers.every(item => {
      return goodUsers.some(g => {
        return g.id === item.id
      })
      return item
    })
  };
}
module.exports = checkUsersValid
```
```javascript
// 官方答案
module.exports = function checkUsersValid(goodUsers) {
  return function allUsersValid(submittedUsers) {
    return submittedUsers.every(function(submittedUser) {
      return goodUsers.some(function(goodUser) {
        return goodUser.id === submittedUser.id
      })
    })
  }
}
```
## reduce
- task
  - Given an Array of strings, use Array#reduce to create an object that contains the number of times each string occured in the array. Return the object directly (no need to console.log).
```javascript
// 我的答案
function countWords (inputWords) {
  // SOLUTION GOES HERE
  return inputWords.reduce((a, b) => {
    b in a ? a[b]++ : a[b] = 1
    return a
  }, {})
}

module.exports = countWords
```
```javascript
// 官方答案
module.exports = function checkUsersValid(goodUsers) {
  return function allUsersValid(submittedUsers) {
    return submittedUsers.every(function(submittedUser) {
      return goodUsers.some(function(goodUser) {
        return goodUser.id === submittedUser.id
      })
    })
  }
}
```

## Basic：Recursion
- task  
  - Implement Array#reduce using recursion.

  - To test your reduction works correctly we will use your reduce implementation to execute our solution to the previous basic_reduce problem. i.e. your reduce function will be passed an array of words, and a function, and an initial value which will return an object containing the counts for each word found in the array. You don't need to implement this functionality, it will be supplied to your reduce implementation.

  - For simplicity, your implementation of reduce need not replicate the behaviour of a reduce missing an initial value. You may assume the initial value will always be supplied.
```javascript
// 官方答案
 function reduce(arr, fn, initial) {
  return (function reduceOne(index, value) {
    if (index > arr.length - 1) return value // end condition
    return reduceOne(index + 1, fn(value, arr[index], index, arr)) // calculate & pass values to next step
  })(0, initial) // IIFE. kick off recursion with initial values
}

module.exports = reduce
```

## Basic: Call
JavaScript implements 'duck' typing. Duck typing is a style of dynamic typing in which an object's methods and properties determine the valid semantics, rather than its inheritance from a particular class or implementation of a specific interface. The name of the concept refers to the duck test, attributed to James Whitcomb Riley, which may be phrased as follows:

  "When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck"

In JavaScript, in order to write robust programs we sometimes need to check an object conforms to the type that we need.

We can use Object#hasOwnProperty to detect if an object 'has' a property defined on itself (i.e. not inherited from its prototype):

    var duck = {
      quack: function() {
        console.log('quack')
      }
    }
    
    duck.hasOwnProperty('quack') // => true

We didn't give the duck a .hasOwnProperty method, where did it come from?

Duck was created with the {} syntax, and as such it inherits from Object.prototype:

    var object = {quack: true}
    
    Object.getPrototypeOf(object) === Object.prototype // => true
    object.hasOwnProperty('quack')                     // => true

But what if an object doesn't inherit from Object.prototype?

    // create an object with 'null' prototype.
    var object = Object.create(null)
    object.quack = function() {
      console.log('quack')
    }
    
    Object.getPrototypeOf(object) === Object.prototype // => false
    Object.getPrototypeOf(object) === null             // => true
    
    object.hasOwnProperty('quack')
    // => TypeError: Object object has no method 'hasOwnProperty'

We can still use hasOwnProperty from the Object.prototype though, if we call it with the this value set to something that 'looks like an object'. Function#call allows us to invoke any function with an altered this value.

    // the first argument to call becomes the value of `this`
    // the rest of the arguments are passed to the function as per
    
    Object.prototype.hasOwnProperty.call(object, 'quack') // => true
- task
  - Write a function duckCount that returns the number of arguments passed to it which have a property 'quack' defined directly on them. Do not match values inherited from prototypes.
  - 写一个函数duckcount，返回传递给它的参数的数量，它具有直接定义的属性“Quack”。 不匹配从原型继承的值。
```javascript
// 官方答案
function duckCount () {
  // SOLUTION GOES HERE
  return Array.prototype.slice.call(arguments).filter(item => {
    return Object.prototype.hasOwnProperty.call(item, 'quack')
  }).length
}

module.exports = duckCount
```

##  Partial Application without Bind
Partial application allows you to create new functions from existing functions, while fixing some number of arguments. After setting the arguments to be partially applied, you get a new function ready to take the rest of the arguments and perhaps execute the original function.

More formally: Partial application refers to the process of fixing a number of arguments to a function, producing another function of smaller arity.

As an example, say we have a function add, that takes 2 arguments and adds them together:

    
    function add(x, y) {
      return x + y
    }
    
    add(10, 20) // => 30
    

Now, pretend we have a function partiallyApply. partiallyApply takes a function, and some arguments to 'partially apply'.

Here we 'partially apply' the first parameter, x, of our add function:

    
    var addTen = partiallyApply(add, 10) // fix `x` to 10
    

addTen is a new function that takes the y parameter of add. add has not yet been called!

Once we pass the argument for y, we can execute the original add function:

    
    addTen(20) // => 30
    addTen(100) // => 110
    addTen(0) // => 10
    
    // etc
    

All of the above examples are same as calling add(10, y), where y was supplied in the call to the appropriately named addTen.
- task
  - Use partial application to create a function that fixes the first argument to console.log.  i.e. Implement a logging function that prepends a namespace string to its output.
  - 使用局部应用程序创建一个将第一个参数修复到console.log的函数。 即，实现将命名空间字符串添加到其输出的日志记录函数。
  - Your implementation should take a namespace String and return a function that prints messages to the console with the namespace prepended.
  - 您的实现应采取命名空间字符串并返回一个函数，将消息打印到控制台，并使用命名空间添加到控制台。
  - You should use Function#apply to implement the partial application.
  - 您应该使用Function#apply以实现柯里化
  - Make sure all arguments passed to the returned logging function are printed.
  - 确保打印传递给返回的日志记录功能的所有参数。
  - Print the output to the console directly 
  - 直接将输出打印到控制台

```javascript
// 官方答案

var slice = Array.prototype.slice

function logger (namespace) {
  // SOLUTION GOES HERE
  return function () {
    console.log.apply(
      console,
      [namespace].concat(slice.call(arguments)) // slice.call() 把一个含有length的对象变成数组
    )
  }
}

module.exports = logger

```

##  Partial Application with Bind
- task
  - Use Function#bind to implement a logging function that allows you to namespace messages.

  - Your implementation should take a namespace string, and return a function that prints messages to the console with the namespace prepended.

  - Make sure all arguments passed to the returned logging function are printed.

  - Print the output to the console directly 
```javascript
// 官方答案

module.exports = function (namespace) {
  return console.log.bind(console, namespace)
}

```

##  Implement Map with Reduce
- task
  - Use Array#reduce to implement a simple version of Array#map.
  - A function map that applies a function to each item in an array and collects the results in a new Array.

```javascript
// 官方答案

module.exports = function arrayMap (arr, fn, thisArg) {
  return arr.reduce((acc, item, index, arr) => {
    acc.push(fn.call(thisArg, item, index, arr))
    return acc
  }, [])
}

```

##  Function Spies
- task 
  - Override a specified method of an object with new functionality while still maintaining all of the old behaviour.

  - Create a spy that keeps track of how many times a function is called.
- Tint
  - Functions have context, input and output. Make sure you consider the context, input to *and output from* the function you are spying on.

```javascript
// 官方答案

function Spy(target, method) {
  var originalFunction = target[method]

  // use an object so we can pass by reference, not value
  // i.e. we can return result, but update count from this scope
  var result = {
    count: 0
  }

  // replace method with spy method
  target[method] = function() {
    result.count++ // track function was called
    return originalFunction.apply(this, arguments) // invoke original function 调用原始功能
  }

  return result
}

module.exports = Spy

```

##  Blocking Event Loop

- Task
  - Modify the recursive repeat function provided in the boilerplate, such that it does not block the event loop (i.e. Timers and IO handlers can fire).  This necessarily requires repeat to be asynchronous.

  - A timeout is queued to fire after 100 milliseconds, which will print the results of the test and exit the process. repeat should release control of the event loop to allow the timeout to interrupt before all of the operations complete.

  - Try to perform as many operations as you can before the timeout fires!
  - 修改位板中提供的递归重复功能，使得它不会阻止事件循环（即计时器和IO处理程序可以射击）。 这必然需要重复才能异步。

  - 超时在100毫秒后排队射击，这将打印测试结果并退出该过程。 重复应该释放对事件循环的控制，以允许在所有操作完成之前中断时断。

  - 尝试在超时火灾之前执行尽可能多的操作！

- hints 
  - If your program takes a long time to run, something is probably wrong.Use Control - C to kill the node process.


```javascript
// 官方答案
function repeat(operation, num) {
  if (num <= 0) return
  operation()
  if(num % 10 === 0){
    setTimeout(()=>{
      return repeat(operation, --num)
    })
  }else{
    return repeat(operation, --num)
  }
} 
module.exports = repeat
```

##  Trampoline
The boilerplate includes a definition of repeat. repeat will take a Function operation, and a Number num, and invoke operation num times:

    var count = 0
    repeat(function() {
      count++
    }, 100)
    
    console.log('executed %d times.', count)
    // => executed 100 times.

BUT note that executing repeat with a large num causes a stack overflow:

    var count = 0
    repeat(function() {
      count++
    }, 100000)
    
    console.log('executed %d times', count)
    // => RangeError: Maximum call stack size exceeded

- task
  - Modify the boilerplate below such that it uses a trampoline to continuously call itself synchronously.
  - 修改下面的样板，使得它使用蹦床同步地连续呼叫。
  - You can assume that the operation passed to repeat does not take arguments (or they are already bound to the function) and the return value is not important.
  - 您可以假设传递给重复的操作不接受参数（或者它们已绑定到函数），返回值并不重要。
- Hints
  * Modify `repeat` so it returns the 'next step', if there is one.
  * A trampoline continues to synchronously execute steps, getting new steps, until there are no more steps. You can use a loop here!
  * If your program takes a long time to run, something is probably wrong.  Use Control - C to kill the node process.

- Boilerplate
```javascript
function repeat(operation, num) {
  // Modify this so it doesn't cause a stack overflow!
  if (num <= 0) return
  operation()
  return repeat(operation, --num)
}

function trampoline(fn) {
  // You probably want to implement a trampoline!
}

module.exports = function(operation, num) {
  // You probably want to call your trampoline here!
  return repeat(operation, num)
}
```
```javascript
// 官方答案
function repeat (operation, num) {
  // Modify this so it doesn't cause a stack overflow!
  return function () {
    if (num <= 0) return
    operation()
    return repeat(operation, --num)
  }

}

function trampoline (fn) {
  // You probably want to implement a trampoline!
  while (fn && typeof fn === 'function') {
    fn = fn()
  }
}

module.exports = function (operation, num) {
  // You probably want to call your trampoline here!
  trampoline(function () {
    return repeat(operation, num)
  })
}
```
## Async Loops
This code is broken!

A Java developer has committed this terrible code to our codebase and didn't test it!

    function loadUsers(userIds, load, done) {
      var users = []
      for (var i = 0; i < userIds.length; i++) {
        users.push(load(userIds[i]))
      }
      return users
    }

    module.exports = loadUsers
- task 
  - Fix this code! The callback should be called with all the users loaded.
  - 修复此代码！ 应该随叫随到的所有用户调用回调
  - The order of the users should match the order of supplied user ids. Because this function is asynchronous, we do not care about its return value.
  - 用户的顺序应匹配提供的用户ID的顺序。 因为这个函数是异步的，我们不关心其返回值
- Arguments

  * userIds: an Array of numeric user ids.
  * load: a Function used to load user objects. Expects a numeric id and a callback. The callback will be called with the result of loading the user with the specified id (either a user object or null).
  * done: a Function that expects an Array of user objects (as retrieved from `load`).
- Hint
  - You don't need to use a sort to maintain ordering.
  - Using `console.log` will affect verification. Only use `console.log` when using `functional-javascript run`
- Boilerplate
```javascript
  function loadUsers(userIds, load, done) {
    var users = []
    for (var i = 0; i < userIds.length; i++) {
      users.push(load(userIds[i]))
    }
    return users
  }
  
  module.exports = loadUsers
```
```javascript
// 官方答案

function loadUsers(userIds, load, done) {
  var completed = 0
  var users = []
  userIds.forEach(function(id, index) {
    load(id, function(user) {
      users[index] = user
      if (++completed === userIds.length) return done(users) // 确保每个用户都可以正常通过
    })
  })
}

module.exports = loadUsers
```

## Recursion
- task 
  - Implement a recursive function that returns all of the unique dependencies, and sub-dependencies of a module, sorted alphabetically. Dependencies should be printed as dependency@version e.g. []()'.
  - 实现递归函数，返回所有唯一依赖项和模块的子依赖性，按字母顺序排序。 依赖项应打印为依赖性@version e.g. '.
  - Multiple versions of the same module are allowed, but duplicates modules of the same version should be removed.
  - 允许多个版本的同一模块，但应删除同一版本的复制模块。
  - SOLUTION GOES HERE
  - Note: Feel free to add additional arguments
  - to this function for use with recursive calls.
  - Or not! There are many ways to recurse.
```javascript
// 我的答案
function getDependencies (tree, result) {
  // 存放结果数组
  var result = result || []
  // 储存每次接收的依赖 tree｜｜ subTree
  var dependencies = tree && tree.dependencies || []
  // 遍历依赖的key 
  Object.keys(dependencies).forEach(dep => {
    // 拼接所要传入result的字符串
    var key = dep + '@' + tree.dependencies[dep].version
    // 若result里没有字符串 则加入
    if (result.indexOf(key) === -1) result.push(key)
    // 对 subTree 递归操作
    getDependencies(tree.dependencies[dep], result)
  })
  return result.sort() // 对最后对结果进行排序
}

module.exports = getDependencies
```
##  Currying
This is an example implementation of curry3, which curries up to 3 arguments:

    function curry3(fun){
      return function(one){
        return function(two){
          return function (three){
            return fun(one, two, three)
          }
        }
      }
    }

If we were to use this implementation with this sample function:

    function abc(one, two, three) {
      return one/two/three
    }

It would work like so:

    var curryC = curry3(abc)
    var curryB = curryC(6)
    var curryA = curryB(3)
    
    console.log(curryA(2)) // => 1

- Task
  - In this challenge, we're going to implement a 'curry' function for an arbitrary number of arguments.
  - curryN will take two parameters:
  * fn: The function we want to curry.
  * n: Optional number of arguments to curry. If not supplied, `curryN` should use the fn's arity as the value for `n`.
- Example
```javascript
function add3(one, two, three) {
  return one + two + three
}

var curryC = curryN(add3)
var curryB = curryC(1)
var curryA = curryB(2)
console.log(curryA(3)) // => 6
console.log(curryA(10)) // => 13

console.log(curryN(add3)(1)(2)(3)) // => 6
```
- Hint
  - You can detect the number of expected arguments to a function (it's arity) by checking a function's .length property.
```javascript
// 官方答案
function curryN (fn, n) {
  // SOLUTION GOES HERE
  n = n || fn.length
  return function curriedN (arg) {
    if (n <= 1) return fn(arg)
    return curryN(fn.bind(this, arg), n - 1)
  }
}
module.exports = curryN
```
##  Function Call
- task
  - Write a function that allows you to use Array.prototype.slice without using slice.call or slice.apply to invoke it.

Normally you have to use slice with call or apply:

    var slice = Array.prototype.slice
    
    function() {
      var args = slice.call(arguments) // this works
    }

We want this to work:

    var slice = yourFunction
    
    function() {
      var args = slice(arguments) // this works
    }
    
- Hints
  * This is absolutely a one liner.
  * Every JavaScript Function inherits methods such as call, apply and bind from the object `Function.prototype`.
  * Function#call executes the value of `this` when it is invoked.  Inside `someFunction.call()`, the value of `this` will be `someFunction`.
  * Function.call itself is a function thus it inherits from `Function.prototype`

function myFunction() {
  console.log('called my function')
}

Function.prototype.call.call(myFunction) // => "called my function"

```javascript
// 官方答案
// Explained:
// The value of `this` in Function.call is the function
// that will be executed.
//
// Bind returns a new function with the value of `this` fixed
// to whatever was passed as its first argument.
//
// Every function 'inherits' from Function.prototype,
// thus every function, including call, apply and bind 
// have the methods call apply and bind.
//
// Function.prototype.call === Function.call
module.exports = Function.call.bind(Array.prototype.slice)
```