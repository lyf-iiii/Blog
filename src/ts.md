# TypeScript
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