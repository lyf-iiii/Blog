# canvas

## 获取 canvas 对象

```JS
const canvas = document.querySelector('#canvas')
```

## 获取绘图工具

```js
const ctx = myCanvas.getContext('2d');
```

## 画布属性

- save() 保存当前环境的状态
- restore() 返回之前保存过的路径状态和属性
- translate() 设置中心点
- cleatRect(x,y,width,height) 清空画布
  - x 中心点横坐标
  - y 中心点纵坐标
  - width 宽度
  - height 高度
- fillStyle 画布颜色
- shadowBlur 阴影 模糊级数
- shadowColor 阴影颜色
- lineWidth 线宽度
- strikeStyle 绘制出的线的颜色
- fill() 填充方法

## 绘制 api

- beginPath() -> 开始绘画
- closePath() -> 结束绘画
- stroke() 执行画线操作

- ctx.arc(x,y,r,startA,endA) ->画圆

  - x 中心点横坐标
  - y 中心点纵坐标
  - r 半径
  - startA 起始角度
  - endA 结束角度

- rect() 绘制矩形

- moveTo( ) 设置出发点
- lineTo() 从出发点连到指定点
- rotate 旋转角度 正角度为顺时针旋转

- getImageDate(x,y,width,height) 获取当前画布数据
- putImageData(x,y,dirtyX,dirtyY,width,height) 获取当前画布数据
  - dirtyX 以像素计，在画布上放置图像的位置。
  - dirtyY 以像素计，在画布上放置图像的位置。

## 案例

### 绘制折线

```vue
<template>
  <div>
    <canvas id="myCanvas" width="400" height="400"></canvas>
  </div>
</template>

<script>
export default {
  name: '',
  component: {},
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {
    function drawPoints(data) {
      /* 获取元素 */
      const myCanvas = document.querySelector('#myCanvas');
      /* 获取绘图工具 */
      const ctx = myCanvas.getContext('2d');

      /*
      1. 设置坐标点的中心圆点位置（x0，y0）
      2. 设置坐标点的大小  dotSize
      3. 计算坐标点的上下左右四角的点坐标
      */

      // 设置坐标点的大小  dotSize
      // const dotSize = 10;

      // 4.遍历点的坐标,以及绘画点
      data.forEach(function (item, i) {
        // console.log("i = " + i + ", x = " + item.x + ", y = " + item.y);

        // 1. 设置坐标点的中心圆点位置（x0，y0）
        const x0 = item.x;
        const y0 = item.y;

        // 3.绘画坐标点
        ctx.beginPath();
        ctx.arc(x0, y0, 5, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'red';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // 4.填充以及描边y轴
        ctx.fill();
      });
    }

    function drawLine(data) {
      /* 获取元素 */
      const myCanvas = document.querySelector('#myCanvas');
      /* 获取绘图工具 */
      const ctx = myCanvas.getContext('2d');

      // 设置坐标系与边界的间隙大小
      const space = 20;

      // 2. 获取Canvas的width、height
      // const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;

      // 3.计算坐标系的原点坐标(x0,y0)
      const x0 = space;
      const y0 = canvasHeight - space;

      /*
      遍历绘画多点连接的折线
      1. 第一个点与坐标系原点连成一条线
      2. 从第二个点开始与上一个点连成一条线，所以需要记录上一个点的坐标
      */

      // 记录上一个点坐标
      let prevPointX = null;
      let prevPointY = null;

      data.forEach(function (item, i) {
        console.log(
          '绘制折线: i = ' + i + ', x = ' + item.x + ', y = ' + item.y,
        );

        if (i === 0) {
          console.log('坐标系的原点坐标：x0 = ' + x0 + ', y0 = ' + y0);
          console.log('第一个点的坐标: x = ' + item.x + ', y = ' + item.y);

          // 第一个点与坐标系原点连成一条线
          ctx.beginPath();
          ctx.strokeStyle = 'red';
          ctx.moveTo(x0, y0); // 坐标系原点
          // ctx.lineTo(item.x, item.y); // 第一个点
          ctx.stroke();

          // 记录当前的点为下一个点的坐标的出发点坐标
          prevPointX = item.x;
          prevPointY = item.y;
        } else {
          // 从第二个点开始与上一个点连成一条线，所以需要记录上一个点的坐标

          ctx.beginPath();
          ctx.moveTo(prevPointX, prevPointY); // 设置上一个点的坐标为出发点
          ctx.lineTo(item.x, item.y); // 设置当前点为终点
          ctx.stroke();

          // 记录当前的点为下一个点的坐标的出发点坐标
          prevPointX = item.x;
          prevPointY = item.y;
        }
      });
    }

    // 定义需要绘制的点坐标
    const points = [
      {
        x: 20,
        y: 80,
      },
      {
        x: 40,
        y: 120,
      },
      {
        x: 100,
        y: 200,
      },
      {
        x: 150,
        y: 300,
      },
      {
        x: 250,
        y: 100,
      },
      {
        x: 300,
        y: 380,
      },
      {
        x: 350,
        y: 50,
      },
    ];

    drawLine(points);
    drawPoints(points);
  },
};
</script>

<style scoped lang="less">
canvas {
  border: 1px solid #cccccc;
  margin-top: 100px;
  margin-left: 100px;
}
</style>
```

### 绘制时钟

```vue
<template>
  <div>
    <canvas id="canvas" width="600" height="600" />
  </div>
</template>

<script>
export default {
  name: '',
  component: {},
  props: {},
  computed: {},
  data() {
    return {
      canvas: '',
      ctx: '',
    };
  },
  methods: {
    init() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, 600, 600);
      // 设置中心点 此时300，300 变成了坐标的0，0
      this.ctx.translate(300, 300);
      this.ctx.save();

      this.ctx.beginPath();
      // 画圆线使用arc(中心点X，中心点Y，半径，起始角度，结束角度)
      this.ctx.arc(0, 0, 100, 0, 2 * Math.PI);

      // 执行画线段的操作
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.closePath();

      // 获取当前 时 分 秒
      const time = new Date();
      const hour = time.getHours() % 12;
      const min = time.getMinutes();
      const sec = time.getSeconds();

      // 时针
      // 2 * Math.PI 是一圈
      // 2 * Math.PI / 12 是一小时的格
      // 减去 Math.PI /2 是 逆时针旋转90度
      this.ctx.rotate(
        ((2 * Math.PI) / 12) * hour +
          ((2 * Math.PI) / 12) * (min / 60) -
          Math.PI / 2,
      );
      this.ctx.beginPath();
      // moveTo设置画线起点
      this.ctx.moveTo(-10, 0);
      // lineTo设置画线经过点
      this.ctx.lineTo(40, 0);
      // 设置线宽
      this.ctx.lineWidth = 10;
      this.ctx.stroke();
      this.ctx.closePath();
      // 回复成上一次save的状态
      this.ctx.restore();
      // 恢复完再保存一次
      this.ctx.save();

      // 分针
      this.ctx.rotate(
        ((2 * Math.PI) / 60) * min +
          ((2 * Math.PI) / 60) * (sec / 60) -
          Math.PI / 2,
      );
      this.ctx.beginPath();
      this.ctx.moveTo(-10, 0);
      this.ctx.lineTo(60, 0);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = 'blue';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      this.ctx.save();

      // 秒针
      this.ctx.rotate(((2 * Math.PI) / 60) * sec - Math.PI / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(-10, 0);
      this.ctx.lineTo(80, 0);
      this.ctx.strokeStyle = 'red';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      this.ctx.save();

      // 绘制刻度，也是跟绘制时分秒针一样，只不过刻度是死的
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        this.ctx.rotate((2 * Math.PI) / 60);
        this.ctx.beginPath();
        this.ctx.moveTo(90, 0);
        this.ctx.lineTo(100, 0);
        this.ctx.stroke();
        this.ctx.closePath();
      }

      this.ctx.restore();
      this.ctx.save();
      this.ctx.lineWidth = 5;
      for (let i = 0; i < 12; i++) {
        this.ctx.rotate((2 * Math.PI) / 12);
        this.ctx.beginPath();
        this.ctx.moveTo(85, 0);
        this.ctx.moveTo(100, 0);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      this.ctx.restore();
      this.ctx.restore();
    },
  },
  mounted() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    setInterval(this.init, 1000);
  },
};
</script>

<style scoped lang="less"></style>
```

### 绘制刮刮乐

```vue
<template>
  <div>
    <canvas id="canvas" width="600" height="600" />
  </div>
</template>

<script>
export default {
  name: '',
  component: {},
  props: {},
  computed: {},
  data() {
    return {
      canvas: '',
      ctx: '',
    };
  },
  methods: {
    init() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, 600, 600);
      // 设置中心点 此时300，300 变成了坐标的0，0
      this.ctx.translate(300, 300);
      this.ctx.translate(300, 300);
      this.ctx.save();

      this.ctx.beginPath();
      // 画圆线使用arc(中心点X，中心点Y，半径，起始角度，结束角度)
      this.ctx.arc(0, 0, 100, 0, 2 * Math.PI);

      // 执行画线段的操作
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.closePath();

      // 获取当前 时 分 秒
      const time = new Date();
      const hour = time.getHours() % 12;
      const min = time.getMinutes();
      const sec = time.getSeconds();

      // 时针
      // 2 * Math.PI 是一圈
      // 2 * Math.PI / 12 是一小时的格
      // 减去 Math.PI /2 是 逆时针旋转90度
      this.ctx.rotate(
        ((2 * Math.PI) / 12) * hour +
          ((2 * Math.PI) / 12) * (min / 60) -
          Math.PI / 2,
      );
      this.ctx.beginPath();
      // moveTo设置画线起点
      this.ctx.moveTo(-10, 0);
      // lineTo设置画线经过点
      this.ctx.lineTo(40, 0);
      // 设置线宽
      this.ctx.lineWidth = 10;
      this.ctx.stroke();
      this.ctx.closePath();
      // 回复成上一次save的状态
      this.ctx.restore();
      // 恢复完再保存一次
      this.ctx.save();

      // 分针
      this.ctx.rotate(
        ((2 * Math.PI) / 60) * min +
          ((2 * Math.PI) / 60) * (sec / 60) -
          Math.PI / 2,
      );
      this.ctx.beginPath();
      this.ctx.moveTo(-10, 0);
      this.ctx.lineTo(60, 0);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = 'blue';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      this.ctx.save();

      // 秒针
      this.ctx.rotate(((2 * Math.PI) / 60) * sec - Math.PI / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(-10, 0);
      this.ctx.lineTo(80, 0);
      this.ctx.strokeStyle = 'red';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      this.ctx.save();

      // 绘制刻度，也是跟绘制时分秒针一样，只不过刻度是死的
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        this.ctx.rotate((2 * Math.PI) / 60);
        this.ctx.beginPath();
        this.ctx.moveTo(90, 0);
        this.ctx.lineTo(100, 0);
        this.ctx.stroke();
        this.ctx.closePath();
      }

      this.ctx.restore();
      this.ctx.save();
      this.ctx.lineWidth = 5;
      for (let i = 0; i < 12; i++) {
        this.ctx.rotate((2 * Math.PI) / 12);
        this.ctx.beginPath();
        this.ctx.moveTo(85, 0);
        this.ctx.moveTo(100, 0);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      this.ctx.restore();
      this.ctx.restore();
    },
  },
  mounted() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    setInterval(this.init, 1000);
  },
};
</script>

<style scoped lang="less"></style>
```

### 制作画板 并保存当前画布

```VUE
<template>
  <div>
    <div style="margin-bottom: 10px; display: flex; align-items: center">
      <el-button @click="changeType('huabi')" type="primary">画笔</el-button>
      <el-button @click="changeType('rect')" type="success">正方形</el-button>
      <el-button @click="changeType('arc')" type="warning" style="margin-right: 10px">
        圆形
      </el-button>
      <div>颜色：</div>
      <el-color-picker v-model="color"></el-color-picker>
      <el-button @click="clear">清空</el-button>
      <el-button @click="saveImg">保存</el-button>
    </div>
    <canvas
      id="canvas"
      width="800"
      height="400"
      @mousedown="canvasDown"
      @mousemove="canvasMove"
      @mouseout="canvasUp"
      @mouseup="canvasUp"
    ></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'huabi',
      isDraw: false,
      canvasDom: null,
      ctx: null,
      beginX: 0,
      beginY: 0,
      color: '#000',
      imageData: null,
    }
  },
  mounted() {
    this.canvasDom = document.getElementById('canvas')
    this.ctx = this.canvasDom.getContext('2d')
  },
  methods: {
    changeType(type) {
      this.type = type
    },
    canvasDown(e) {
      this.isDraw = true
      const canvas = this.canvasDom
      this.beginX = e.pageX - canvas.offsetLeft
      this.beginY = e.pageY - canvas.offsetTop
    },
    canvasMove(e) {
      if (!this.isDraw) return
      const canvas = this.canvasDom
      const ctx = this.ctx
      const x = e.pageX - canvas.offsetLeft
      const y = e.pageY - canvas.offsetTop
      this[`${this.type}Fn`](ctx, x, y)
    },
    canvasUp() {
      this.imageData = this.ctx.getImageData(0, 0, 800, 400)
      this.isDraw = false
    },
    huabiFn(ctx, x, y) {
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.closePath()
    },
    rectFn(ctx, x, y) {
      const beginX = this.beginX
      const beginY = this.beginY
      ctx.clearRect(0, 0, 800, 400)
      this.imageData && ctx.putImageData(this.imageData, 0, 0, 0, 0, 800, 400)
      ctx.beginPath()
      ctx.strokeStyle = this.color
      ctx.rect(beginX, beginY, x - beginX, y - beginY)
      ctx.stroke()
      ctx.closePath()
    },
    arcFn(ctx, x, y) {
      const beginX = this.beginX
      const beginY = this.beginY
      this.isDraw && ctx.clearRect(0, 0, 800, 400)
      this.imageData && ctx.putImageData(this.imageData, 0, 0, 0, 0, 800, 400)
      ctx.beginPath()
      ctx.strokeStyle = this.color
      ctx.arc(
        beginX,
        beginY,
        Math.round(Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY))),
        0,
        2 * Math.PI
      )
      ctx.stroke()
      ctx.closePath()
    },
    saveImg() {
      const url = this.canvasDom.toDataURL()
      const a = document.createElement('a')
      a.download = 'sunshine'
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    clear() {
      this.imageData = null
      this.ctx.clearRect(0, 0, 800, 400)
    },
  },
}
</script>

<style lang="less" scoped>
#canvas {
  border: 1px solid black;
}
</style>

```

## 贪吃蛇

- 画蛇头与蛇身
  - 整只蛇是由 蛇头 与蛇身组成的 蛇头是一个方格 蛇身是若干个方格
- 让蛇运动起来
  - 蛇运动的关键是将蛇头原先的位置拼到蛇身的头部然后从蛇身的尾部去掉一个
- 随机投放食物
  - 需要避免出现食物的地方与蛇头蛇身重叠
- 蛇吃食物
  - 运动时要检测蛇头是否与食物重叠（食物存在时比较食物与蛇头的横纵坐标是否一致）
  - 没吃到食物还需要去尾让蛇继续运动 吃到了 需要再生成一个食物
- 边缘检测与撞自己检测
  - 碰到 canvas 的左右边界
  - 碰到 canvas 的上下边界
  - 碰到自己的蛇身

```vue
<template>
  <div>
    <canvas id="canvas" width="800" height="800"></canvas>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
  mounted() {
    function draw() {
      const canvas = document.getElementById('canvas');

      const ctx = canvas.getContext('2d');

      // 定义一个全局的是否吃到食物的一个变量
      let isEatFood = false;

      // 小方格的构造函数
      function Rect(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
      }

      Rect.prototype.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
      };

      // 蛇的构造函数
      function Snake(length = 0) {
        this.length = length;
        // 蛇头
        this.head = new Rect(
          canvas.width / 2,
          canvas.height / 2,
          40,
          40,
          'red',
        );

        // 蛇身
        this.body = [];

        let x = this.head.x - 40;
        const y = this.head.y;

        for (let i = 0; i < this.length; i++) {
          const rect = new Rect(x, y, 40, 40, 'yellow');
          this.body.push(rect);
          x -= 40;
        }
      }

      Snake.prototype.drawSnake = function () {
        // 如果碰到了
        if (isHit(this)) {
          // 清除定时器
          clearInterval(timer);
          const con = confirm(
            `总共吃了${this.body.length - this.length}个食物，重新开始吗`,
          );

          // 是否重开
          if (con) {
            draw();
          }
          return;
        }
        // 绘制蛇头
        this.head.draw();
        // 绘制蛇身
        for (let i = 0; i < this.body.length; i++) {
          this.body[i].draw();
        }
      };

      function isHit(snake) {
        const head = snake.head;
        // 是否碰到左右边界
        const xlimit = head.x < 0 || head.x >= canvas.width;
        // 是否碰到上下边界
        const ylimit = head.y < 0 || head.y >= canvas.height;
        // 是否撞到蛇身
        const hitSelf = snake.body.find(
          ({ x, y }) => head.x === x && head.y === y,
        );
        // 三者中其中一个
        return xlimit || ylimit || hitSelf;
      }

      Snake.prototype.moveSnake = function () {
        // 将蛇头上一次状态，拼到蛇身首部
        const rect = new Rect(
          this.head.x,
          this.head.y,
          this.head.width,
          this.head.height,
          'yellow',
        );
        // 咱们上面在蛇身首部插入方格
        this.body.unshift(rect);

        // 判断蛇头是否与食物重叠 重叠就是吃到了， 没重叠就是没吃到
        isEatFood = food && this.head.x === food.x && this.head.y === food.y;

        if (!isEatFood) {
          // 没吃到就要去尾 相当于整条蛇就没变长
          this.body.pop();
        } else {
          // 吃到了就不去尾 相当于整条蛇延长一个方格

          // 并且吃到了 就要重新生成一个随机食物

          food = randomFood(this);
          food.draw();
          isEatFood = false;
        }

        // 根据方向，控制蛇头的坐标
        switch (this.direction) {
          case 0:
            this.head.x -= this.head.width;
            break;
          case 1:
            this.head.y -= this.head.height;
            break;
          case 2:
            this.head.x += this.head.width;
            break;
          case 3:
            this.head.y += this.head.height;
            break;
        }
      };

      document.onkeydown = function (e) {
        // 键盘事件
        e = e || window.event;
        // 左37  上38  右39  下40
        switch (e.keyCode) {
          case 37:
            console.log(37);
            // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
            snake.direction = snake.direction === 2 ? 2 : 0;
            snake.moveSnake();
            break;
          case 38:
            console.log(38);
            snake.direction = snake.direction === 3 ? 3 : 1;
            break;
          case 39:
            console.log(39);
            snake.direction = snake.direction === 0 ? 0 : 2;
            break;
          case 40:
            console.log(40);
            snake.direction = snake.direction === 1 ? 1 : 3;
            break;
        }
      };

      function randomFood(snake) {
        let isInSnake = true;
        let rect;
        while (isInSnake) {
          const x = Math.round((Math.random() * (canvas.width - 40)) / 40) * 40;
          const y =
            Math.round((Math.random() * (canvas.height - 40)) / 40) * 40;

          console.log(x, y);

          // 保证是40的倍数
          rect = new Rect(x, y, 40, 40, 'blue');
          // 判断食物是否与蛇头蛇身重叠
          if (
            (snake.head.x === x && snake.head.y === y) ||
            snake.body.find((item) => item.x === x && item.y === y)
          ) {
            isInSnake = true;
            continue;
          } else {
            isInSnake = false;
          }
        }
        return rect;
      }

      const snake = new Snake(3);
      // 默认direction为2，也就是右
      snake.direction = 2;
      let food = randomFood(snake);
      food.draw();
      snake.drawSnake();

      function animate() {
        // 先清空
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 移动
        snake.moveSnake();
        // 再画
        snake.drawSnake();
        food.draw();
      }

      const timer = setInterval(() => {
        animate();
      }, 300);
    }
    draw();
  },
};
</script>

<style scoped lang="less"></style>
```

## xingxinglianxian

- 画星星
  - 实际上是画实心圆
- 星星连线
  - 冒泡排序两两计算横纵坐标之间的距离
- 鼠标连线
  - 让一个点实时跟随鼠标 达到鼠标靠近点进行连线的操作
- 鼠标点击加点
  - 点击时 往星星数组中加点

```vue
<template>
  <div>
    <canvas id="canvas" width="800" height="800"></canvas>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
  mounted() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // 获取当前视图的宽度和高度
    let aw = document.documentElement.clientWidth || document.body.clientWidth;
    let ah =
      document.documentElement.clientHeight || document.body.clientHeight;
    // 赋值给canvas
    canvas.width = aw;
    canvas.height = ah;

    // 屏幕变动时也要监听实时宽高
    window.onresize = function () {
      aw = document.documentELement.clientWidth || document.body.clientWidth;
      ah = document.documentELement.clientHeight || document.body.clientHeight;
      // 赋值给canvas
      canvas.width = aw;
      canvas.height = ah;
    };

    // 实心圆、线条 色调都是白色的
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    function Star(x, y, r) {
      // x y 是坐标 r是半径
      this.x = x;
      this.y = y;
      this.r = r;
      // speed参数 在 -3 ～ 3 之间取值
      this.speedX = Math.random() * 3 * Math.pow(-1, Math.round(Math.random()));
      this.speedY = Math.random() * 3 * Math.pow(-1, Math.round(Math.random()));
    }

    Star.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };

    Star.prototype.move = function () {
      this.x -= this.speedX;
      this.y -= this.speedY;
      // 碰到边界时，反弹，只需要把speed取反就行
      if (this.x < 0 || this.x > aw) this.speedX *= -1;
      if (this.y < 0 || this.x > ah) this.speedY *= -1;
    };

    const stars = [];
    for (let i = 0; i < 100; i++) {
      // 随机在canvas范围内找一个坐标画星星
      stars.push(new Star(Math.random() * aw, Math.random() * ah, 3));
    }

    function drawLine(startX, startY, endX, endY) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.closePath();
    }

    const mouseStar = new Star(0, 0, 3);

    canvas.onmousemove = function (e) {
      mouseStar.x = e.clientX;
      mouseStar.y = e.clientY;
    };
    window.onclick = function (e) {
      for (let i = 0; i < 5; i++) {
        stars.push(new Star(e.clientX, e.clientY, 3));
      }
    };

    // 星星的移动
    setInterval(() => {
      ctx.clearRect(0, 0, aw, ah);
      // 鼠标星星的渲染
      mouseStar.draw();
      // 遍历移动渲染
      stars.forEach((star) => {
        star.move();
        star.draw();
      });
      stars.forEach((star, index) => {
        // 类似于冒泡排序那样，去比较，确保所有星星两两之间都比较到
        for (let i = index + 1; i < stars.length; i++) {
          if (
            Math.abs(star.x - stars[i].x) < 50 &&
            Math.abs(star.y - stars[i].y) < 50
          ) {
            drawLine(star.x, star.y, stars[i].x, stars[i].y);
          }
        }
        // 判断鼠标星星连线
        if (
          Math.abs(mouseStar.x - star.x) < 50 &&
          Math.abs(mouseStar.y - star.y) < 50
        ) {
          drawLine(mouseStar.x, mouseStar.y, star.x, star.y);
        }
      });
    }, 50);
  },
};
</script>

<style scoped lang="less">
#canvas {
  background: #000;
}
</style>
```

## 五子棋

- 画棋盘
- 落子
  - 二维数组管理棋盘交叉线坐标
  - 点击时判断点击位置并取最近的交叉点坐标作为落子区域并进行画圆
  - 黑子执完再白子
- 判断五连

```vue
<template>
  <div>
    <canvas id="canvas" width="600" height="600"></canvas>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
  mounted() {
    play();

    function play() {
      const canvas = document.getElementById('canvas');

      const ctx = canvas.getContext('2d');

      // 绘制棋盘

      // 水平，总共15条线
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(20, 20 + i * 40);
        ctx.lineTo(580, 20 + i * 40);
        ctx.stroke();
        ctx.closePath();
      }

      // 垂直，总共15条线
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(20 + i * 40, 20);
        ctx.lineTo(20 + i * 40, 580);
        ctx.stroke();
        ctx.closePath();
      }

      // 是否下黑棋
      // 黑棋先走
      let isBlack = true;

      // 棋盘二维数组
      const cheeks = [];

      for (let i = 0; i < 15; i++) {
        cheeks[i] = new Array(15).fill(0);
      }

      canvas.onclick = function (e) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        // 对40进行取整，确保棋子落在交叉处
        const x = Math.round((clientX - 20) / 40) * 40 + 20;
        const y = Math.round((clientY - 20) / 40) * 40 + 20;
        // cheeks二维数组的索引
        // 这么写有点冗余，这么写你们好理解一点
        const cheeksX = (x - 20) / 40;
        const cheeksY = (y - 20) / 40;
        // 对应元素不为0说明此地方已有棋，返回
        if (cheeks[cheeksY][cheeksX]) return;
        // 黑棋为1，白棋为2
        cheeks[cheeksY][cheeksX] = isBlack ? 1 : 2;
        ctx.beginPath();
        // 画圆
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        // 判断走黑还是白
        ctx.fillStyle = isBlack ? 'black' : 'white';
        ctx.fill();
        ctx.closePath();

        // canvas画图是异步的，保证画出来再去检测输赢
        setTimeout(() => {
          if (isWin(cheeksX, cheeksY)) {
            const con = confirm(
              `${isBlack ? '黑棋' : '白棋'}赢了！是否重新开局？`,
            );
            // 重新开局
            ctx.clearRect(0, 0, 600, 600);
            con && play();
          }
          // 切换黑白
          isBlack = !isBlack;
        }, 0);
      };
      // 判断是否五连子
      function isWin(x, y) {
        const flag = isBlack ? 1 : 2;
        // 上和下
        if (upDown(x, y, flag)) {
          return true;
        }

        // 左和右
        if (leftRight(x, y, flag)) {
          return true;
        }
        // 左上和右下
        if (luRd(x, y, flag)) {
          return true;
        }

        // 右上和左下
        if (ruLd(x, y, flag)) {
          return true;
        }

        return false;
      }

      function upDown(x, y, flag) {
        let num = 1;
        // 向上找
        for (let i = 1; i < 5; i++) {
          const tempY = y - i;
          console.log(x, tempY);
          if (tempY < 0 || cheeks[tempY][x] !== flag) break;
          if (cheeks[tempY][x] === flag) num += 1;
        }
        // 向下找
        for (let i = 1; i < 5; i++) {
          const tempY = y + i;
          console.log(x, tempY);
          if (tempY > 14 || cheeks[tempY][x] !== flag) break;
          if (cheeks[tempY][x] === flag) num += 1;
        }
        return num >= 5;
      }

      function leftRight(x, y, flag) {
        let num = 1;
        // 向左找
        for (let i = 1; i < 5; i++) {
          const tempX = x - i;
          if (tempX < 0 || cheeks[y][tempX] !== flag) break;
          if (cheeks[y][tempX] === flag) num += 1;
        }
        // 向右找
        for (let i = 1; i < 5; i++) {
          const tempX = x + i;
          if (tempX > 14 || cheeks[y][tempX] !== flag) break;
          if (cheeks[y][tempX] === flag) num += 1;
        }
        return num >= 5;
      }

      function luRd(x, y, flag) {
        let num = 1;
        // 向左上找
        for (let i = 1; i < 5; i++) {
          const tempX = x - i;
          const tempY = y - i;
          if (tempX < 0 || tempY < 0 || cheeks[tempY][tempX] !== flag) break;
          if (cheeks[tempY][tempX] === flag) num += 1;
        }
        // 向右下找
        for (let i = 1; i < 5; i++) {
          const tempX = x + i;
          const tempY = y + i;
          if (tempX > 14 || tempY > 14 || cheeks[tempY][tempX] !== flag) break;
          if (cheeks[tempY][tempX] === flag) num += 1;
        }

        return num >= 5;
      }

      function ruLd(x, y, flag) {
        let num = 1;
        // 向右上找
        for (let i = 1; i < 5; i++) {
          const tempX = x - i;
          const tempY = y + i;
          if (tempX < 0 || tempY > 14 || cheeks[tempY][tempX] !== flag) break;
          if (cheeks[tempY][tempX] === flag) num += 1;
        }
        // 向左下找
        for (let i = 1; i < 5; i++) {
          const tempX = x + i;
          const tempY = y - i;
          if (tempX > 14 || tempY < 0 || cheeks[tempY][tempX] !== flag) break;
          if (cheeks[tempY][tempX] === flag) num += 1;
        }

        return num >= 5;
      }
    }
  },
};
</script>

<style scoped lang="less">
#canvas {
  background: #e3cdb0;
}
</style>
```
