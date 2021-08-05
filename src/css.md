# CSS
## 清除浮动
  - 给下一个节点的dom 添加clear:both
  - 给父级添加 overflow:hidden 或者 overflow:auto
  -  通用
    .clearfix { *zoom: 1;}

    .clearfix: after { content: ' '; display: table;  clear: both; }
## 盒模型
  - 一个盒子的主要的属性为width、height、padding、border、margin
  - 在标准盒子模型中，width 和 height 指的是内容区域的宽度和高度。增加内边距、边框和外边距不会影响内容区域的尺寸，但是会增加元素框的总尺寸。
  - IE盒子模型中，width 和 height 指的是内容区域+border+padding的宽度和高度。
  ![image-20210317231622089](./img/1622022928043.jpg)

## transition 和animation的区别
  - 相同点 随时间改变元素对属性值
  - 不同点 
    - transition需要触发一个事件才能改变属性，而animation不需要触发任何事件的情况下才会随时间改变属性值
    - transition为2祯，从from到to，而animation可以一祯一祯的
## BFC
- 是web页面的可视css渲染的一部分 是块盒子的布局过程发生的区域。也是浮动元素与其他元素交互的区域
```html
<style>
    .father {
      /* float: left;
      position: absolate;
      display: inline-block; */
      overflow: hidden
    }

    .son {
      width: 300px;
      height: 300px;
      background-color: blue;
      float: left;
    }
  </style>
  <!-- 块级格式化上下文，他是指一个独立的块级渲染区域，只有Block-level BOX参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关 -->
  <!-- 如何创建bfc
  方法1 float 不是node
  方法2 position 不是 static 或者relative
  方法3 display的值是inline-bloc、flex、或者inline-flex
  方法4 overflow:hidden 这个比较友好不会影响其他标签 -->
  <div class="father">
    <div class="son"></div>
    <div class="son"></div>
    <div class="son"></div>
  </div>
```
### BFC的理解
  - 块级格式化上下文 ， 他是指一个独立的块级渲染区域，只有Block-level BOX参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关
### 规则
- 垂直方向上的距离由margin决定，属于同一个BFC的两个相邻的标签的margin会发生重叠
  - 解决了 外边距重叠
- 每个标签的左外边距与包含块的左外边界相接触（从左向右），即使浮动标签也是如此。
  - 解决了 自适应两栏或三栏布局
- BFC的区域不会与浮动的标签区域重叠
  - 解决了 防止字体环绕
- 计算BFC高度的时候，浮动子元素也参与计算
  - 解决了 清除浮动
### BFC中的盒子对齐
  - 特性的第一条是：内部的Box会在垂直方向上一个接一个的放置。
  - 浮动的元素也是这样，box3浮动，他依然接着上一个盒子垂直排列，并且所有的盒子都左对齐
### 外边距重叠
  - 特性的第二条：垂直方向上的距离由margin决定 在常规文档流中，两个兄弟盒子之间的垂直距离是由他们的外边距所决定的，但不是他们的两个外边距之和，而是以较大的为准。
## Flex
  - flex-direction
  - flex-wrap
  - flex-flow
  - justify-content
  - align-items
  - order
  - flex-grow

## 解决css阻塞污染的问题
- 解决办法 link标签添加media 媒体类型或查询
```javascript
<link href="style.css" rel="stylesheet"> 
<link href="style.css" rel="stylesheet" media="all"> 
<link href="portrait.css" rel="stylesheet" media="orientation:portrait"> 
<link href="print.css" rel="stylesheet" media="print">
```
- 第一个声明阻塞渲染，适用于所有情况。
- 第二个声明同样阻塞渲染：“all”是默认类型，如果您不指定任何类型，则隐式设置为“all”。因此，第一个声明和第二个声明实际上是等效的。
- 第三个声明具有动态媒体查询，将在网页加载时计算。根据网页加载时设备的方向，portrait.css 可能阻塞渲染，也可能不阻塞渲染。
- 最后一个声明只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染。
- 最后，请注意“阻塞渲染”仅是指浏览器是否需要暂停网页的首次渲染，直至该资源准备就绪。无论哪一种情况，浏览器仍会下载 CSS 资产，只不过不阻塞渲染的资源优先级较低罢了。
  
## css 的缩放、渐变、旋转和平移
- 渐变 transition：all 3s ease   
  - all代表渐变所有元素（all可以用样式中有的width、height、background之类的代替）
  - 1s代表渐变时间
  - ease代表匀速渐变 
    - linear:匀速运动
    - ease:从初始状态过渡到终止状态，由快到慢，逐渐变慢
    - ease-in:从初始到终止速度越来越快，呈一种加速状态
    - ease-out:从初始到终止速度越来越慢，呈一种减速状态
    - ease-in-out:先加速再减速
  - 含不含：hover都要加transition：all 3s ease 保证鼠标移入和移出都有动画效果
- transform里有缩小(scale)，旋转(rotate)，平移(translate)，倾斜(skew)
  - rotate 有三个方向 X、Y、Z轴 
  - translate(x,y) 接收两个参数 x代表水平方向偏移量 y代表垂直方向偏移量
  - shew 代表倾斜
- 旋转
```html
<style>
.turn {
  animation: turn 2s linear infinite;
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
```

## 三栏布局 的5种方案
  - float 中间margin-left margin-right 需要注意清除浮动
  - position 定位 不适合页面布局
  - flex 只能兼容ie9+
  - grid 兼容性差
  - table 兼容性好 使用方便 不利于搜索引擎爬取
## 圣杯布局 的三种方案
  - position 
  - flex
  - float

## 吸顶布局
- 第一种 `position:sticky`
  - 使用条件：
    - 父元素不能 overflow:hidden 或者 overflow:auto 属性
    - 必须指定 top、bottom、left、right 4 个值之一，否则只会处于相对定位
    - 父元素的高度不能低于 sticky 元素的高度
    - sticky 元素仅在其父元素内生效
```html
<style>
.sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}
</style>
```
- 第二种 基于jq `offset().top` 返回相对于文档的偏移量
```javascript
...
window.addEventListener('scroll', self.handleScrollOne);
...
handleScrollOne: function() {
    let self = this;
    let scrollTop = $('html').scrollTop();
    let offsetTop = $('.title_box').offset().top;
    self.titleFixed = scrollTop > offsetTop;
}
...
```
- 第三种 使用原生的`offsetTop`实现
```javascript
getOffset: function(obj,direction){
    let offsetL = 0;
    let offsetT = 0;
    while( obj!== window.document.body && obj !== null ){
        offsetL += obj.offsetLeft;
        offsetT += obj.offsetTop;
        obj = obj.offsetParent;
    }
    if(direction === 'left'){
        return offsetL;
    }else {
        return offsetT;
    }
}
...
window.addEventListener('scroll', self.handleScrollTwo);
...
handleScrollTwo: function() {
    let self = this;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    let offsetTop = self.getOffset(self.$refs.pride_tab_fixed);
    self.titleFixed = scrollTop > offsetTop;
}
...
```
