# TypeScript 学习
  - 任何变量都声明类型
  - 不到万不得已不要用any
  - 给你的对象声明接口
## 什么是TyprScript
  - TypeScript是一种微软开发的自由和开源的编程语言，它是javaScript的一个超集，扩展了javascript的语法
  - 在编译时进行类型检测
## tsc 命令
  - 把ts文件编译译成js文件
## 类型批注
  - 通过类型批注提供静态类型以在编译时启动类型检查
```javascript
function area(shape: string, width: number, height: number) {
  var area = width * height;
  return "I'm a " + shape + " with an area of " + area + " cm squared.";
}
document.body.innerHTML = area("rectangle", 30, 15);
```

## interface
  - 声明一个对象类型推荐只用接口
  - 接口作为一个类型批注
  - 如果接口中设置的参数缺失会报错
```javascript
interface Shape{
  name:string;//必须的
  width:number;
  height:number;
  color?:string//加了？不是必须的
}
```
## lambda函数表达式
  - lambda表达式()=>{something},好处是可以自动将函数中的this附加到上下文中
```javascript
var shape = {
    name: "rectangle",
    popup: function() {
 
        console.log('This inside popup(): ' + this.name);
 
        setTimeout( () => {
            console.log('This inside setTimeout(): ' + this.name);
            console.log("I'm a " + this.name + "!");
        }, 3000);
 
    }
};
 
shape.popup();
```
  - 在以上实例编译后端 js 文件中，我们可以看到一行 var _this = this;，_this 在 setTimeout() 的回调函数引用了 name 属性。
## class类
  - 类中的constructor的变量是局部变量 外部无法访问 需要在变量前加public可访问
  - 如果设置类中的某个变量为类外部无法访问可以这只为private
```javascript
class Shape {
  area: number;
  color?: string;

  constructor(public name: string, public width: number, public height: number) {
    this.area = width * height;
    this.color = "pink"
  };

  shoutout() {
    return "I'm " + this.color + " " + this.name + " with an area of " + this.area + " cm squared.";
  }
}

var square = new Shape('square', 30, 30)
console.log(square.shoutout())
console.log('Area of Shape ' + square.area);
console.log('Name of Shape ' + square.name);
console.log('Color of Shape ' + square.color);
console.log('Width of Shape ' + square.width);
console.log('Height of Shape ' + square.height);
```
## 继承
  - 派生类 继承父类 同时继承父类的属性
  - super方法调用基类的构造函数，并传递构造函数的参数
  - 派生类可以写基类的方法 也可以继承基类的方法到一个新方法当中
```javascript
class Shape3D extends Shape {
 
    volume: number;
 
    constructor ( public name: string, width: number, height: number, length: number ) {
        super( name, width, height );
        this.volume = length * this.area;
    };
 
    shoutout() {
        return "I'm " + this.name +  " with a volume of " + this.volume + " cm cube.";
    }
 
    superShout() {
        return super.shoutout();
    }
}
 
var cube = new Shape3D("cube", 30, 30, 30);
console.log( cube.shoutout() );
console.log( cube.superShout() );
```
## any 类型
  - 任意值是ts针对编程时类型不明确的变量使用的一中数据类型
    - 变量的值会动态改变时，比如来自用户的输入，任意值类型可以让这些变量跳过编译阶段的类型检查
    - 任意变量可以通过any 开启或关闭类型检查
    - 定义各种数据类型的数组时 
```javascript
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```
## null undefined 
  - 当一个对象的值可能为null 或者 undefined的时候 在设置类型批注时应该或运算上null 或者 undefined
```javascript
// 启用 --strictNullChecks
let x: number | null | undefined;
x = 1; // 运行正确
x = undefined;    // 运行正确
x = null;    // 运行正确

```
## naver 类型
  - never 是其它类型（包括 null 和 undefined）的子类型，代表从不会出现的值。这意味着声明为 never 类型的变量只能被 never 类型所赋值，在函数中它通常表现为抛出异常或无法执行到终止点（例如无限循环）
```javascript

// 运行错误，数字类型不能转为 never 类型
x = 123;

// 运行正确，never 类型可以赋值给 never类型
x = (()=>{ throw new Error('exception')})();

// 运行正确，never 类型可以赋值给 数字类型
y = (()=>{ throw new Error('exception')})();

// 返回值为 never 的函数可以是抛出异常的情况
function error(message: string): never {
    throw new Error(message);
}

// 返回值为 never 的函数可以是无法被执行到的终止点的情况
function loop(): never {
    while (true) {}
}
```
## 变量声明
  - 变量名称可以包含数字和字母
  - 变量名称只能包含_和$ 这两个特殊符号
  - 变量名不可以以数字开头
## 类型推断
  - ts根据首次被赋的值来进行类型推断
  - 如果缺乏声明不能推断出类型 将会给变量一个any类型
```javascript
var num = 2;    // 类型推断为 number
console.log("num 变量的值为 "+num); 
num = "12";    // 编译错误
console.log(num);
```
## 变量作用域
  - 全局作用域 
  - 类作用域 变量声明在一个类当中 可以通过类对访问 类变量也可以是静态的，静态的变量可以通过类名直接访问
  - 局部作用域 - 局部变量 局部变量只能在声明它的一个代码块中使用
  
```javascript
var global_num = 12          // 全局变量
class Numbers { 
   num_val = 13;             // 实例变量
   static sval = 10;         // 静态变量
   
   storeNum():void { 
      var local_num = 14;    // 局部变量
   } 
} 
console.log("全局变量为: "+global_num)  
console.log(Numbers.sval)   // 静态变量
var obj = new Numbers(); 
console.log("实例变量: "+obj.num_val)
```
## tsconfig.json 的作用
- 编译待编译文件 定义编译选项
## 如何配置typescript编译器
- vscode在项目中写配置文件
## typescript 的 数据类型 
  - any
    - 可以被任何数据类型赋值 也可以赋值给任何数据类型
  - unknown
    - 可以被任意数据类型复制 但是只可赋值给any和unknown
  - void
    - 当一个函数没有返回值的时候 可以设置void类型
  - naver
    - 可以用来监督函数是否对可接收的数据类型做处理
  ```js
    function gandleMessage(message:string|number|boolean){
      switch(typeof message){
        case 'string':
          console.log("string处理方式处理message“)
          break
        case ‘number’:
          console.log("number处理方式处理message“)
          break
        case 'boolean':
          console.log("boolean处理方式处理message“)
          break
        default:
          const check:never = message
      }
    }
  ```
  - tuple
    - 元组类型
  ```js
  // tuple 的应用场景
  // react hook useState
  // const [couter, setCounter] = useState(10)
    function useState(state:any){
      let currentState = state
      
      const changeState = (newState : any)=>{
        currentState = newState
      }

      const tuple:[any,(newState:any)=>void] = [currentState,changeState]

      return tuple
    }

    const [counter, setCounter] = useState(10)
    setCounter(1000)

    const [title,setTitle] = useState('abc')
  // 优化 加泛型
    function useStateB<T>(state:T){
      let currentState = state
      
      const changeState = (newState : T)=>{
        currentState = newState
      }

      const tuple:[T,(newState:T)=>void] = [currentState,changeState]

      return tuple
    }

    const [counter, setCounter] = useState(10)
    setCounter(1000)

    const [title,setTitle] = useState('abc')
```

## 对象类型

```js
// point 是行参
function printPoint(point:{x:number,y:number}){
  console.log(point.x)
  console.log(point.y)
}
printPoint({x:123,y:123}) // 里面的对象是个实参

// 可选类型
function printPoint(point:{x:number,y:number,z?:number}){ //z加了？之后是一个可选类型
  console.log(point.x)  
  console.log(point.y)
}
printPoint({x:123,y:123}) // 里面的对象是个实参
printPoint({x:123,y:123,z:123}) // 里面的对象是个实参
```
## 联合类型
```js
// number|string 就是一个联合类型
function printID(id:number|string){
  // 使用联合类型的值时 需要特别的小心
  // narrow L：缩小
  if(typeof id === 'string'){
    // TypeSvript 帮助确定id 一定是string 类型
    console.log(id.toUpperCase())
  }else{
    console.log(id)
  }
}
```
## 类型别名
  - type ID = number | String
## 类型断言
  - 通过类型断言把普遍点的类型变成一个具体类型
```js

// 断言1
const el =  document.getElementById('why') // 此时el的类型为htmlElement
el.src = "url地址" // 此时el不具备htmlImageElement这个类型的属性src 所以会报错

const el = document.getElementById('why') as htmlImageElement // 此时el的类型因为类型断言变成了一个具体的类型 htmlImageElement

// ---------------------------

// 断言2
class Person{

}

class Student extends Person{
  studying(){}
}

function sayHello(p:Person){
  // p.studying() 报错 因为Person类中没有stuudying方法
  (p as Student).studying() // 类型断言之后 转化了类型
}

const stu = new Student()
sayHello(stu)

// ----------------------------

// 断言3
const message = "Hello World"
// const num:number = (message as unknown) as number 容易造成类型混乱

```

## 非空类型断言
```js
function printMessageLength(message?:string){
  // if(message){
    // console.log(message.length)
  // }
  console.log(message!.length) // ! 表示message 一定有值
}

printMessageLength('aaa')
printMessageLength('hello world')
```
## 可选链 属于ecmascript 2020 不是属于typescript
```js
  type Person = {
    name:String
    friend:{
      name:String
      age?:number
    }
  }

  const info:Person = {
    name:'why'
  }

  // 另一个文件中
  console.log(this.info.name) // 可能会报错
  console.log(this.info?.name) // 变成一个可选链
```

## !!运算符
  - 将js 基础类型变成布尔值

## ??运算符
  - 当某个值为null 给一个默认值

## 字面量类型
```js
  const message:'Hello World' = 'Hello World'
  let num:123 = 123
  // num = 321 会报错

  // 字面量类型的意义 就是必须结合联合类型
  type Alignment = 'left' | 'right' | 'center'

  let align : Alignment = 'left'
  align = 'right'
  align = 'center'

```

## 字面量推理
```js
 type Method = 'GET' | 'POST'
 function request(url:string,method:Method){}

 type Request = {
   url:string,
   method:Method
 }

 const options:Request = {
   url:"http://www.coderwhy.org/abc",
   method:"POST" // 如果options不使用Request 那么传入的method 会被推理为String类型 这样不符合Method类型 会 报错
 }

 request(options.url,options.method) // 或者给传入options.method 加上 as Method 的类型断言
 export {}
```

## 函数类型
```js
function calc(n1:number,n2:number,fn:(num1:number,num2:number)=>{
  return fn(n1,n2)
})

calc(20,30, function(a1,a2){
  return a1+a2
})

calc(20,30,function(a1,a2){
  return a1*a2
})
```

## 函数的重载
 - 含义：函数的名称相同，但是参数不同的几个函数，就是函数的重载
```js
  // 实现方式一：联合类型
    function getLength(args:string | any[]){
      return args.length
    }
    console.log(getLength("abc"))
    console.log(getLength([123,321,123]))

    // 实现方式二：函数的重载
    function getLength(args:string):number
    function getLength(args:any[]):number

    function getLength(args:any):number{
      return args.length
    }
```

## 类
```js
class Person {
  name:string
  age:number
  
  constructor(name:string,age:number){
    this.name = name
    this.age = age
  }

  eating(){
    console.log('eating')
  }
}
class Student extends Person{
  sno:string

  constructor(sno:string){
    super() // 相当于调用了父类的constructor
    this.sno = sno
  }

  studying(){
    console.log('studying')
  }
}
```

## 类的多态
```js
  class Animal{
    action(){
      console.log('animal action')
    }
  }

  class Dog extends Animal{
    action(){
      console.log('dog running!')
    }
  }

  class Fish extends Animal {
    action(){
      console.log("fish swimming")
    }
  }

  function makeActions(animals:Animal[]){
    animals.forEach(animal => {
      // 此时传进来的对象会调用子类的action 
      // 父类引用指向子类对象
      // const animal1:Animal = new Dog()
      // 每次调用父类但是新建了一个子类的实例来去调用的这个过程 叫做多态
      animal.action() 
    })
  }

  makeActions([new Dog(),new Fish()])
```

## 类修饰符
  - privated 私有的 在类的内部可以访问 外界无法访问
  - protected 在类内部和子类中可以访问
```js
  class Person{
    protected name:string = '123'
  }

  class Student extends Person{
    getName(){
      return this.name
    }
  }

  const stu = new Student()
  consle.log(stu.getName())
```

## setter/getter 访问器
```js
class Person {
  private _name:string

  constructor(name:string){
    this._name = name
  }

  // 访问器setter/getter
  // setter
  set name(newName){
    this._name = newName
  }
  // getter 访问器
  get name() {
    return this._name
  }
}

const p = new Person("why")
p.name = "coderlyf"
console.log(p.name) 
```

## 类的静态成员
- 访问属性或者方法的时候可以不通过对象实例 直接通过 对象.属性 对象.方法 来访问
```js
class Student {
  static time:string = "20:00"

  static attendClass(){
    console.log("去学习～")
  }
}

console.log(Student.time)
Student.attendClass()
```

## 抽象类abstract
- 抽象函数必须存放在抽象类中 抽象类实例化会报错 因为抽象类不可以被实例化
- 抽象函数可以没有实现体 例如 
- 抽象类当中的抽象方法 必须要被子类实现
- 抽象类的方法 如果有实现体 那么可以不加 abstract
```js
class Shape {
  abstract getArea()
}
```
```js
function makeArea(shape:Shape){
  return shape.getArea()
}
abstract class Shape{
  abstract getArea()
}
class Rectangle extends Shape{
  private width:number
  private height:number

  constructor(width:number,height:number){
    super()
    this.width = width
    this.height = height
  }

  getArea(){
    return this.width *this.height
  }
}

class Circle extends Shape{
  private r:number 

  constructor(r:number){
    super()
    return this.r = r
  }

  getArea(){
    return this.r*this.r*3.14
  }
}
```

## 类的类型
```js
class Persom {
  name:String = "123"
  eating(){}
}

const p = new Person()

const p1 : Person = {
  name: "why",
  eating(){

  }
}

function printPerson(p:Person){
  console.log(p.name)
}

printPerson(new Person())
printPerson({name:"kobe",eating:function(){}})
```

## 索引类型
```js
// 定义一个索引类型的接口
interface IndexLanguage {
  [index:number]:string
}
const frontLanguage:IndexLanguage = {
  0:"html",
  1:"css",
  2:"js",
  3:"vue",\
  // "abd":"dbc" // 报错
}
```
## 接口的继承
```js
  interface ISwin {
    swimming:()=> void
  }

  interface IFly {
    flying:()=> void
  }

  interface IAction extends ISwim,IFly {

  }

  const action:IAction = {
    swimming(){

    },
    fiying(){}
  }

```

## 交叉类型
```js
// 一种组合类型的方式：联合类型
type WhyType = number | string
type Direction = "left" | "right" | "center"

// 另一种组建类型的方式：交叉类型
type WType = number & string

interface ISwim {
  swimming:() => void
}

interface IFly {
  flying:() => void
}

type MyType1 = ISwim | IFly
type MyType2 = ISwim & IFly
```

## 接口的实现
```js
  interface ISwim {
    swimming:()=> void
  }

  interface IEat {
    eating :()=>void
  }

  const a:ISwim = {
    swmming(){

    }
  }

  // 类实现接口
  class Animal {

  }

  // 继承： 只能实现单继承
  // 实现：实现接口，类可以实现多个接口
  class Fish extends Animal implements ISwim,IEat{
    swimming(){
      console.log("Fish Swimming")
    }

    eating(){
      console.log("Fish Eating")
    }
  }

  class Person implements ISwim{
    swimming(){
      console.log("Person swimming")
    }
  }

  // 编写一些公共的API：面向接口编程
  function swimAction（swimable:ISwim){
    swimable.swimming()
  }

  // 1.所有实现了接口的类对应的对象，都是可以传入
  swimAction(new Fish())
  swimAction(new Person())
```
## 接口的合并

```js
interface IFoo {
  name:string
}

interface IFoo{
  age:number
}

const foo : IFoo = {
  name :"why",
  age:18
}
```

## type 和 interface 的区别
- type 是不可以重复定义的 但是interface是可以的而且相同的接口会合并

## 字面量赋值
```js
  interface IPerson {
    name:String,
    age:number,
    height:number
  }

 // const p:IPerson = {
   // name:'why',
   // age:18,
   // height:'1.88',
   // address:"广州市"
 // } 会报错因为IPerson 里面 没有 address属性

 const info = {
   name:'why',
   age:18,
   height:1.88,
   address:"广州市"
 }
 // freshness擦除
 const p : IPerson = info 
```

## 枚举的类型
```js
enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

function turnDirention(direction:Direction){
  console.log(direction)
  switch(direction){
    case Direction.LEFT:
      console.log("改变角色的方向向左")
      break
    case Direction.RIGHT:
      console.log("改变角色的方向向右")
      break
    case Direction.TOP:
      console.log("改变角色的方向向上")
      break
    case Direction.BOTTOM:
      console.log("改变角色的方向向下")
      break
  }
}
```
## 泛型

- 传入一个 T 来做类型参数 根据 ts 的类型推导传入的参数是什么类型

```js
// 使用泛型
function loggingIdentity<T>(arg: T) {
  console.log(arg.length) // 如果传入的参数是个number类型 那么就不具备length属性 就会报错
  return arg
}

// 使用泛型变量  如果我们想操作的是T类型的数组 那么我们
function loggingIdentity<T>(arg: T[]):T[] {
  console.log(arg.length)
  return arg
}

// 泛型类型
fuction identity<T>(arg:T):T{ //创建一个泛型函数
  return arg
}

let myIdentity:<T>(arg:T) => T = identity // 箭头方式创建一个泛型函数

let myIdentity:{<T>(arg:T):T} = identity // 带有调用签名的对象字面量来定义泛型函数

// 创建一个泛型接口
interface GenericIdentityFn {
  <T>(arg:T):T
}

function identity<T>(arg:T):T{
  return arg
}

let myIdentity: GenericIdentityFn = identity
// ------------------------------------- 

```
