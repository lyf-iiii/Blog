# canvas 动画

## 辅助方法封装

- arrow 类

```js
class Arrow {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.w = 60;
    this.h = 30;
    this.rotation = 0;
    this.fillStyle = 'rgba(57,119,224)';
    this.strokeStyle = 'rgba(0,0,0,0)';
    Object.assign(this, props);
    return this;
  }
  createPath(ctx) {
    let { w, h } = this;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 10, -h / 2);
    ctx.lineTo(w / 10, -h);
    ctx.lineTo(w / 2, 0);
    ctx.lineTo(w / 10, h);
    ctx.lineTo(w / 10, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    return this;
  }
  render(ctx) {
    let { fillStyle, strokeStyle, rotation, x, y } = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    this.createPath(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
}
```

- ball 类

```js
class Ball {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.x3d = 0;
    this.y3d = 0;
    this.z3d = 0;
    this.m = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.r = 20;
    this.scaleX = 1;
    this.scaleY = 1;
    this.strokeStyle = 'rgba(0,0,0,0)';
    this.fillStyle = 'rgb(57,119,224)';
    this.alpha = 1;
    Object.assign(this, props);
    return this;
  }
  render(ctx) {
    let { x, y, r, scaleX, scaleY, fillStyle, strokeStyle, alpha } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = alpha; // 透明度
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
  // 当前鼠标坐标点是否在小球绘制路径内
  isPoint(pos) {
    // return Math.pow(mouse.x - this.x) + Math.pow(mouse.y - this.y) < Math.pow(this.r)
    return this.r > Math.sqrt((pos.x - this.x) ** 2 + (pos.y - this.y) ** 2);
  }
}
```

- box 类

```js
class Box {
  constructor(opt) {
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 100;
    this.vx = 0;
    this.vy = 0;
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    this.fillStyle = 'rgb(57, 119, 224)';
    this.rotation = 0;
    this.lineWidth = 0;
    Object.assign(this, opt);
    return this;
  }
  render(ctx) {
    let { x, y, w, h, lineWidth, strokeStyle, fillStyle, rotation, scale } =
      this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
  isPoint(mouse) {
    let { x, y } = mouse;
    return (
      x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h
    );
  }
}
```

- line 类

```js
class Line {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.rotation = 0;
    this.strokeStyle = '#000';
    this.lineWidth = 1;
    Object.assign(this, props);
    return this;
  }
  render(ctx) {
    let { x, y, x1, y1, x2, y2, rotation, lineWidth, strokeStyle } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    return this;
  }
}
```

- utils

```js
let C = {};
// 获取鼠标相对canvas画布的位置
C.getOffset = function (ele) {
  let mouse = { x: 0, y: 0 };
  ele.addEventListener('mousemove', (e) => {
    let { x, y } = C.eventWrapper(e);
    mouse.x = x;
    mouse.y = y;
  });
  return mouse;
};

//
C.eventWrapper = function (ev) {
  let { pageX, pageY, target } = ev;
  let { top, left } = target.getBoundingClientRect();
  return {
    x: pageX - left,
    y: pageY - top,
  };
};
// rad 角度
// angel 弧度
// 角度转弧度
C.toRad = function (angle) {
  return (angle * Math.PI) / 180;
};

// 弧度转角度
C.toAngle = function (rad) {
  return (rad * 180) / Math.PI;
};

// 生成随机数
C.rp = function (arr, int) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return int ? Math.round(num) : num;
};

// 生成随机颜色
C.createColor = function () {
  return `rgb(${C.rp([55, 255], true)}, ${C.rp([55, 255], true)}, ${C.rp(
    [55, 255],
    true,
  )})`;
};

// 矩形之间的碰撞检测
C.rectDuang = function (rect1, rect2) {
  return (
    rect1.x + rect1.w >= rect2.x &&
    rect1.x <= rect2.x + rect2.w &&
    rect1.y + rect1.h >= rect2.y &&
    rect1.y <= rect2.y + rect2.h
  );
};

// 圆形之间的碰撞检测
C.ballDuang = function (ball1, ball2) {
  return (
    ball1.r + ball2.r >
    Math.sqrt((ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2)
  );
};

// 求两点间的距离
C.getDist = function (x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// 对小球进行边界反弹处理
C.checkBallBounce = function (ball, W, H, bounce) {
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.vx *= bounce;
  } else if (ball.x + ball.r >= W) {
    ball.x = W - ball.r;
    ball.vx *= bounce;
  }
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy *= bounce;
  } else if (ball.y + ball.r >= H) {
    ball.y = H - ball.r;
    ball.vy *= bounce;
  }
};
// 小球碰撞方法
C.checkBallHit = function checkMove(b1, b2) {
  let dx = b2.x - b1.x;
  let dy = b2.y - b1.y;
  let dist = Math.sqrt(dx ** 2 + dy ** 2);
  if (dist < b1.r + b2.r) {
    let angle = Math.atan2(dy, dx);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    // 以b1为参照物，设定b1的中心点为旋转基点
    let x1 = 0;
    let y1 = 0;
    let x2 = dx * cos + dy * sin;
    let y2 = dy * cos - dx * sin;

    // 旋转b1和b2的速度
    let vx1 = b1.vx * cos + b1.vy * sin;
    let vy1 = b1.vy * cos - b1.vx * sin;
    let vx2 = b2.vx * cos + b2.vy * sin;
    let vy2 = b2.vy * cos - b2.vx * sin;

    // 求出b1和b2碰撞之后的速度
    let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m);
    let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m);

    // 处理两个小球碰撞之后，将它们进行归位
    let lep = b1.r + b2.r - Math.abs(x2 - x1);

    x1 = x1 + (vx1Final < 0 ? -lep / 2 : lep / 2);
    x2 = x2 + (vx2Final < 0 ? -lep / 2 : lep / 2);

    b2.x = b1.x + (x2 * cos - y2 * sin);
    b2.y = b1.y + (y2 * cos + x2 * sin);
    b1.x = b1.x + (x1 * cos - y1 * sin);
    b1.y = b1.y + (y1 * cos + x1 * sin);

    b1.vx = vx1Final * cos - vy1 * sin;
    b1.vy = vy1 * cos + vx1Final * sin;
    b2.vx = vx2Final * cos - vy2 * sin;
    b2.vy = vy2 * cos + vx2Final * sin;
  }
};
```

## 一、运动和三角函数

- 1. 测试鼠标位置

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        position: absolute;
        left: 10%;
        top: 5%;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let pos = C.getOffset(canvas);
      canvas.onclick = function () {
        console.log(pos.x, pos.y);
      };
    </script>
  </body>
</html>
```

- 2. 测试 atan2 方法

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      canvas.onmousemove = function () {
        ctx.clearRect(0, 0, W, H);

        const dx = mouse.x - W / 2;
        const dy = mouse.y - H / 2;
        const angle = (Math.atan(dy / dx) * 180) / Math.PI;
        const angle1 = (Math.atan2(dy, dx) * 180) / Math.PI;

        drawSystem();
        ctx.beginPath();
        ctx.lineTo(mouse.x, mouse.y);
        ctx.lineTo(W / 2, H / 2);
        ctx.stroke();
        ctx.fillText(angle1, mouse.x, mouse.y);
      };

      drawSystem();
      function drawSystem() {
        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
        ctx.stroke();
        ctx.restore();
      }
    </script>
  </body>
</html>
```

- 3. arrow 跟随鼠标旋转

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./arrow.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const arrow = new Arrow({
        x: W / 2,
        y: H / 2,
        w: 180,
        h: 60,
      }).render(ctx);

      canvas.onmousemove = function () {
        let dx = mouse.x - arrow.x;
        let dy = mouse.y - arrow.y;
        arrow.rotation = Math.atan2(dy, dx);

        ctx.clearRect(0, 0, W, H);
        arrow.render(ctx);
      };
    </script>
  </body>
</html>
```

- 4. 平滑运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 50,
      }).render(ctx);
      let angle = 0;
      const SWING = 160;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ball.x = W / 2 + Math.sin(angle) * SWING;

        angle += 0.05;
        angle %= Math.PI * 2;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 5. 线性运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: 100,
        y: H / 2,
        r: 30,
      }).render(ctx);
      let angle = 0;
      let vx = 1;
      let vy = 0.5;
      const SWING = 60;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ball.x += vx;

        ball.y = H / 2 + Math.sin(angle) * SWING;

        angle += 0.05;
        angle %= Math.PI * 2;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 6. 脉冲运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 50,
      }).render(ctx);
      let angle = 0;
      let initScale = 1;

      const SWING = 0.5;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ball.scaleX = ball.scaleY = initScale + Math.sin(angle) * SWING;

        angle += 0.05;
        angle %= Math.PI * 2;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 7. 圆周运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 35,
      }).render(ctx);
      let angle = 0;
      let speed = 0.02;
      let r = 150;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
        ctx.stroke();

        ball.x = W / 2 + r * Math.cos(angle);
        ball.y = H / 2 + r * Math.sin(angle);

        angle += speed;
        angle %= Math.PI * 2;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 8. 椭圆运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 35,
      }).render(ctx);
      let angle = 0;
      let speed = 0.02;
      let rx = 200,
        ry = 80;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ball.x = W / 2 + rx * Math.cos(angle);
        ball.y = H / 2 + ry * Math.sin(angle);

        angle += speed;
        angle %= Math.PI * 2;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 35,
      }).render(ctx);
      let angle = 0;
      let speed = 0.02;
      let rx = 200,
        ry = 80;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ball.x = W / 2 + rx * Math.cos(angle);
        ball.y = H / 2 + ry * Math.sin(angle);

        angle += speed;
        angle %= Math.PI * 2;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 9. 单轴运动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      // let mouse = C.getOffset(canvas)

      const ball = new Ball({
        x: 50,
        y: H / 2,
        r: 40,
      }).render(ctx);

      let vx = 0.5;
      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        ball.x += vx;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 10. 速度的合成

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      // let mouse = C.getOffset(canvas)

      const ball = new Ball({
        x: 50,
        y: 50,
        r: 30,
      }).render(ctx);

      let vx = 0.5;
      let vy = 0.5;
      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        ball.x += vx;
        ball.y += vy;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 11. 速度的分解

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      // let mouse = C.getOffset(canvas)

      const ball = new Ball({
        x: 50,
        y: 50,
        r: 30,
      }).render(ctx);

      let speed = 2; // 速度
      let angle = (30 * Math.PI) / 180; //弧度

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        let vx = speed * Math.cos(angle);
        let vy = speed * Math.sin(angle);

        ball.x += vx;
        ball.y += vy;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 12. 箭头跟随鼠标移动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./arrow.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let arrow = new Arrow({
        x: W / 2,
        y: H / 2,
        w: 140,
        h: 60,
      }).render(ctx);

      let mouse = C.getOffset(canvas);
      let speed = 3;

      (function move() {
        window.requestAnimationFrame(move);

        let dx = mouse.x - arrow.x;
        let dy = mouse.y - arrow.y;

        let angle = Math.atan2(dy, dx);

        let vx = speed * Math.cos(angle);
        let vy = speed * Math.sin(angle);

        arrow.x += vx;
        arrow.y += vy;
        arrow.rotation = angle;

        ctx.clearRect(0, 0, W, H);
        arrow.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 13. 箭头自动旋转

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./arrow.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let arrow = new Arrow({
        x: W / 2,
        y: H / 2,
        w: 140,
        h: 60,
      }).render(ctx);

      let vr = (2 * Math.PI) / 180;

      (function move() {
        window.requestAnimationFrame(move);

        arrow.rotation += vr;

        ctx.clearRect(0, 0, W, H);
        arrow.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 14. 单轴加速度

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let ball = new Ball({
        x: 70,
        y: H / 2,
        r: 30,
      }).render(ctx);

      let vx = 0,
        ax = 0.1;
      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        ball.x += vx;
        vx += ax;
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 15. 任意方向上的加速度

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let ball = new Ball({
        x: 50,
        y: 50,
        r: 30,
      }).render(ctx);

      let angle = C.toRad(30),
        a = 0.1,
        vx = 0,
        vy = 0;
      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        let ax = Math.cos(angle) * a;
        let ay = Math.sin(angle) * a;

        ball.x += vx;
        ball.y += vy;

        vx += ax;
        vy += ay;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 16. 重力加速度

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let ball = new Ball({
        x: W / 2,
        y: 100,
        r: 30,
      }).render(ctx);

      let g = 0.2,
        vy = 0;

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        ball.y += vy;
        vy += g;

        // console.log(ball.y)
        if (ball.y + ball.r >= H) {
          ball.y = H - ball.r;
          vy *= -0.8;
          console.log(vy);
        }

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 17. 小球的掉落

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      class Ball2 extends Ball {
        constructor(opt) {
          super();
          this.vy = 0;
          this.g = 0;
          this.friction = 0.05;
          this.firstMode = true;
          Object.assign(this, opt);
          return this;
        }
        move() {
          if (!this.firstMode) {
            this.vy += this.g;
          }

          if (this.vy > 0 && this.vy - this.friction > 0) {
            this.vy -= this.friction;
          } else if (this.vy < 0 && this.vy + this.firstMode < 0) {
            this.vy += this.friction;
          } else {
            this.vy = 0;
          }

          this.y += this.vy;

          if (this.y + this.r >= H) {
            this.y = H - this.r;
            this.vy *= -1;
          }

          this.firstMode = false;

          return this;
        }
      }
      let balls = [];
      for (let i = 0; i < 100; i++) {
        const b = new Ball2({
          x: Math.random() * W,
          y: Math.random() * (H / 2),
          g: Math.random() * 0.2 + 0.1,
          r: Math.random() * 2 + 3,
          fillStyle:
            '#' + `00000 + ${(Math.random() * 0xffffff) | 0}`.substr(-6),
        });
        balls.push(b);
      }
      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        balls.forEach((ball) => {
          ball.move().render(ctx);
        });
      })();
    </script>
  </body>
</html>
```

## 二、边界和摩擦力

- 1. 超出边界移除

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let balls = [];

      for (let i = 0; i < 10; i++) {
        balls.push(
          new Ball({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 20 + 30,
            fillStyle: `rgb(${55 + Math.random() * 200},${
              55 + Math.random() * 200
            },${55 + Math.random() * 200})`,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            id: 'ball' + i,
          }),
        );
      }

      function ballMove(ball, index) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (
          ball.x - ball.r > W ||
          ball.x + ball.r < 0 ||
          ball.y - ball.r > H ||
          ball.y + ball.r < 0
        ) {
          balls.splice(index, 1);
          console.log(balls.length);
          if (balls.length) {
            console.log('ball:' + index + '被移除了');
          } else {
            console.log('所有小球被删除了');
          }
        }
        ball.render(ctx);
      }

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        let i = balls.length;
        while (i--) {
          ballMove(balls[i], i);
        }
      })();
    </script>
  </body>
</html>
```

- 2. 超出边界归位

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let balls = [],
        g = 0.05;

      for (let i = 0; i < 100; i++) {
        balls.push(
          new Ball({
            x: W / 2,
            y: H,
            r: Math.random() > 0.9 ? C.rp([25, 40]) : C.rp([15, 30]),
            fillStyle: C.createColor(),
            vx: C.rp([-3, 3]),
            vy: C.rp([0, -10]),
          }),
        );
      }

      function drawBall(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += g;
        //
        if (
          ball.x - ball.r >= W ||
          ball.x + ball.r <= 0 ||
          ball.y - ball.r >= H ||
          ball.y + ball.r <= 0
        ) {
          ball.x = W / 2;
          ball.y = H;
          ball.vx = C.rp([-3, 3]);
          ball.vy = C.rp([0, -10]);
        }

        ball.render(ctx);
      }
      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        balls.forEach(drawBall);
      })();
    </script>
  </body>
</html>
```

- 3. 出现在另外的一侧边界

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./arrow.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let vx = 0,
        vy = 0,
        vr = 0,
        a = 0,
        w = 46,
        h = 20,
        f = 0.95;

      const arrow = new Arrow({
        x: W / 2,
        y: H / 2,
        w,
        h,
      }).render(ctx);

      window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
          case 37:
            vr = -5;
            break;
          case 39:
            vr = 5;
            break;
          case 38:
            a = 0.5;
            break;
        }
      });

      window.addEventListener('keyup', function (e) {
        a = 0;
        vr = 0;
      });

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        arrow.rotation += C.toRad(vr);
        let angle = arrow.rotation;
        let ax = Math.cos(angle) * a;
        let ay = Math.sin(angle) * a;

        vx += ax;
        vy += ay;

        vx *= f;
        vy *= f;

        arrow.x += vx;
        arrow.y += vy;

        // 越界处理
        if (arrow.x - arrow.w / 2 >= W) {
          arrow.x = 0 - arrow.w / 2;
        } else if (arrow.x + arrow.w / 2 <= 0) {
          arrow.x = W + arrow.w / 2;
        }

        arrow.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 4. 边界反弹

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let balls = [];

      for (let i = 0; i < 10; i++) {
        balls.push(
          new Ball({
            x: W / 2,
            y: H / 2,
            fillStyle: C.createColor(),
            r: C.rp([30, 70]),
            vx: C.rp([-5, 5]),
            vy: C.rp([-6, 7]),
          }),
        );
      }

      function ballMove(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (ball.x + ball.r >= W || ball.x - ball.r < 0) {
          ball.vx *= -1;
        } else if (ball.y + ball.r >= H || ball.y - ball.r <= 0) {
          ball.vy *= -1;
        }
        ball.render(ctx);
      }
      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);

        balls.forEach(ballMove);
      })();
    </script>
  </body>
</html>
```

- 5. 满天星效果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let balls = [];

      for (let i = 0; i < 200; i++) {
        balls.push(
          new Ball({
            x: Math.random() * W,
            y: 0,
            r: Math.random() * 2 + 2,
            fillStyle: `rgb(255, 255, 255)`,
            vx: C.rp([-1, 1]),
            vy: C.rp([1, 3]),
            id: 'ball' + i,
          }),
        );
      }

      function ballMove(ball, index) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (
          ball.x - ball.r > W ||
          ball.x + ball.r < 0 ||
          ball.y - ball.r > H ||
          ball.y + ball.r < 0
        ) {
          ball.x = Math.random() * W;
          ball.y = 0;
          ball.vx = C.rp([-1, 1]);
          ball.vy = C.rp([1, 3]);
        }

        ball.render(ctx);
      }

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        let i = balls.length;
        while (i--) {
          ballMove(balls[i], i);
        }
      })();
    </script>
  </body>
</html>
```

- 6. 摩擦力

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let angle = C.toRad(30),
        speed = C.rp([30, 50]),
        friction = 2.5;

      let ball = new Ball({
        x: 80,
        y: 80,
        r: 40,
        fillStyle: C.createColor(),
      });

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);

        speed = speed > friction ? speed - friction : 0;

        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;

        ball.x += vx;
        ball.y += vy;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 7. 摩擦力简单方法

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let vx = C.rp([20, 40]),
        friction = 0.9;

      let ball = new Ball({
        x: 80,
        y: H / 2,
        r: 40,
        fillStyle: C.createColor(),
      });

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);

        ball.x += vx;
        vx *= friction;
        if (Math.abs(vx) > 0.001) {
          console.log(vx);
        }

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

## 三、鼠标和绘制对象的交互

- 1. 拖拽对象

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas),
        dx = 0,
        dy = 0;

      let ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 40,
      }).render(ctx);

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        if (ball.isPoint(mouse)) {
          dx = mouse.x - ball.x;
          dy = mouse.y - ball.y;
          canvas.addEventListener('mousemove', moveBallFn);
          canvas.addEventListener('mouseup', upBallFn);
        }
      });

      function moveBallFn(e) {
        ball.x = mouse.x - dx;
        ball.y = mouse.y - dy;
      }
      function upBallFn(e) {
        canvas.removeEventListener('mousemove', moveBallFn);
        canvas.removeEventListener('mouseup', upBallFn);
      }

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 带运动的拖拽

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas),
        dx = 0,
        dy = 0,
        isMouseMove = false,
        vx = C.rp([-10, 10]),
        vy = -10,
        g = 0.2,
        bounce = -0.7;

      let ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 40,
      }).render(ctx);

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        if (ball.isPoint(mouse)) {
          isMouseMove = true;
          dx = mouse.x - ball.x;
          dy = mouse.y - ball.y;
          canvas.addEventListener('mousemove', moveBallFn);
          canvas.addEventListener('mouseup', upBallFn);
        }
      });

      function moveBallFn(e) {
        ball.x = mouse.x - dx;
        ball.y = mouse.y - dy;
      }
      function upBallFn(e) {
        isMouseMove = false;
        canvas.removeEventListener('mousemove', moveBallFn);
        canvas.removeEventListener('mouseup', upBallFn);
      }

      function bounceMove() {
        vy += g; // 解决小球不断弹跳问题 原理：？将 vy += g 移到 ball.x += Vx 和 ball.y += vy 之前确保了小球在每一帧更新时都正确地考虑了重力，从而提高了边界处理和反弹模拟的准确性
        ball.x += vx;
        ball.y += vy;
        if (ball.x + ball.r > W) {
          ball.x = W - ball.r;
          vx *= bounce;
        } else if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          vx *= bounce;
        }
        if (ball.y + ball.r > H) {
          ball.y = H - ball.r;
          vy *= bounce;
        } else if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          vy *= bounce;
        }
      }

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        if (!isMouseMove) {
          bounceMove();
        }
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 3. 投掷物体

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas),
        dx = 0,
        dy = 0,
        isMouseMove = false,
        vx = C.rp([-10, 10]),
        vy = -10,
        g = 0.2,
        bounce = -0.7,
        startX = 0,
        startY = 0;

      let ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 40,
      }).render(ctx);

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        if (ball.isPoint(mouse)) {
          isMouseMove = true;
          dx = mouse.x - ball.x;
          dy = mouse.y - ball.y;
          startX = ball.x;
          startY = ball.y;
          canvas.addEventListener('mousemove', moveBallFn);
          canvas.addEventListener('mouseup', upBallFn);
        }
      });

      function moveBallFn(e) {
        ball.x = mouse.x - dx;
        ball.y = mouse.y - dy;
      }
      function upBallFn(e) {
        isMouseMove = false;
        canvas.removeEventListener('mousemove', moveBallFn);
        canvas.removeEventListener('mouseup', upBallFn);
      }

      function bounceMove() {
        vy += g; // 解决小球不断弹跳问题 原理：？将 vy += g 移到 ball.x += Vx 和 ball.y += vy 之前确保了小球在每一帧更新时都正确地考虑了重力，从而提高了边界处理和反弹模拟的准确性
        ball.x += vx;
        ball.y += vy;
        if (ball.x + ball.r > W) {
          ball.x = W - ball.r;
          vx *= bounce;
        } else if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          vx *= bounce;
        }
        if (ball.y + ball.r > H) {
          ball.y = H - ball.r;
          vy *= bounce;
        } else if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          vy *= bounce;
        }
      }

      function setSpeed() {
        // 速度响亮 = 最后一帧的结束位置 - 最后一针的起始位置
        vx = ball.x - startX;
        vy = ball.y - startY;
        startX = ball.x;
        startY = ball.y;
      }

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        if (!isMouseMove) {
          bounceMove();
        } else {
          // 拖拽操作
          setSpeed();
        }
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

## 四、缓动与弹动

- 1. 缓动的基本原理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 1200);
      let H = (canvas.height = 800);
      // 1.为运动确定一个比例系数 这个系数是一个0到1之间的小数
      let easing = 0.05,
        targetX = W / 2,
        targetY = H / 2;

      const ball = new Ball({
        x: 80,
        y: 80,
        r: 40,
      }).render(ctx);

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        // // 2.计算物体与目标点之间的距离
        // const dx = targetX - ball.x
        // const dy = targetY - ball.y
        // // 3.计算速度 速度 = 距离 * 比例系数
        // vx = dx * easing
        // vy = dy * easing
        // // 4.用当前的位置加上速度来计算新的位置
        // ball.x += vx
        // ball.y += vy

        // 简写
        ball.x += (targetX - ball.x) * easing;
        ball.Y += (targetY - ball.y) * easing;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 以鼠标为目标点

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./arrow.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let easing = 0.05,
        mouse = C.getOffset(canvas);

      let arrow = new Arrow({
        x: W / 2,
        y: H / 2,
        w: 120,
        h: 50,
      }).render(ctx);

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        let dx = mouse.x - arrow.x;
        let dy = mouse.y - arrow.y;
        let angle = Math.atan2(dy, dx);

        arrow.x += dx * easing;
        arrow.y += dy * easing;
        arrow.rotation = angle;

        arrow.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 3. 和鼠标交互的缓动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let easing = 0.05,
        mouse = C.getOffset(canvas);
      let isMouseMove = false;
      let targetX = W / 2,
        targetY = H / 2;

      let ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 40,
      }).render(ctx);

      function moveBallFn() {
        ball.x = mouse.x;
        ball.y = mouse.y;
      }
      function upBallFn() {
        isMouseMove = false;
        canvas.removeEventListener('mousemove', moveBallFn);
        canvas.removeEventListener('mouseup', upBallFn);
      }

      canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isMouseMove = true;
        if (ball.isPoint(mouse)) {
          canvas.addEventListener('mousemove', moveBallFn);
          canvas.addEventListener('mouseup', upBallFn);
        }
      });

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);
        if (!isMouseMove) {
          // 脱离鼠标回到圆心
          let vx = (targetX - ball.x) * easing;
          let vy = (targetY - ball.y) * easing;
          ball.x += vx;
          ball.y += vy;
        }
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 4. 弹动的基本原理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let string = 0.05;
      let targetX = W / 2;
      let friction = 0.95;

      let ball = new Ball({
        x: 80,
        y: H / 2,
        r: 40,
      }).render(ctx);

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        let ax = (targetX - ball.x) * string;
        ball.vx += ax;
        ball.vx *= friction;
        ball.x += ball.vx;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 5. 绳子吊球弹动效果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let spring = 0.03; // 弹动系数
      let friction = 0.95;
      let mouse = C.getOffset(canvas);
      let g = 2.5;

      let ball = new Ball({
        x: W / 2,
        y: H / 2,
        r: 40,
      }).render(ctx);

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        let dx = mouse.x - ball.x;
        let dy = mouse.y - ball.y;

        let ax = dx * spring;
        let ay = dy * spring;

        ball.vx += ax;
        ball.vy += ay;
        ball.vy += g;

        ball.vx *= friction;
        ball.vy *= friction;

        ball.x += ball.vx;
        ball.y += ball.vy;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.lineTo(mouse.x, mouse.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 6. 多物体弹动效果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);
      let mouse = C.getOffset(canvas);

      let spring = 0.03;
      let ball1_draging = false;
      let ball2_draging = false;
      let ball3_draging = false;
      let springLength = 200;
      let friction = 0.9;

      let ball1 = new Ball({
        x: C.rp([50, W - 50]),
        y: C.rp([50, H - 50]),
        r: 20,
      }).render(ctx);

      let ball2 = new Ball({
        x: C.rp([50, W - 50]),
        y: C.rp([50, H - 50]),
        r: 20,
      }).render(ctx);

      let ball3 = new Ball({
        x: C.rp([50, W - 50]),
        y: C.rp([50, H - 50]),
        r: 20,
      }).render(ctx);

      canvas.addEventListener('mousedown', function () {
        if (ball1.isPoint(mouse)) {
          ball1_draging = true;
        }
        if (ball2.isPoint(mouse)) {
          ball2_draging = true;
        }
        if (ball3.isPoint(mouse)) {
          ball3_draging = true;
        }
      });
      canvas.addEventListener('mousemove', function () {
        if (ball1_draging) {
          ball1.x = mouse.x;
          ball1.y = mouse.y;
        }
        if (ball2_draging) {
          ball2.x = mouse.x;
          ball2.y = mouse.y;
        }
        if (ball3_draging) {
          ball3.x = mouse.x;
          ball3.y = mouse.y;
        }
      });
      canvas.addEventListener('mouseup', function () {
        ball1_draging = false;
        ball2_draging = false;
        ball3_draging = false;
      });

      function springTo(b1, b2) {
        let dx = b2.x - b1.x;
        let dy = b2.y - b1.y;
        let angle = Math.atan2(dy, dx);

        let targetX = b2.x - springLength * Math.cos(angle);
        let targetY = b2.y - springLength * Math.sin(angle);

        b1.vx += (targetX - b1.x) * spring;
        b1.vy += (targetY - b1.y) * spring;

        b1.vx *= friction;
        b1.vy *= friction;

        b1.x += b1.vx;
        b1.y += b1.vy;
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        if (!ball1_draging) {
          springTo(ball1, ball2);
          springTo(ball1, ball3);
        }
        if (!ball2_draging) {
          springTo(ball2, ball1);
          springTo(ball2, ball3);
        }
        if (!ball3_draging) {
          springTo(ball3, ball1);
          springTo(ball3, ball2);
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255,0,0)';

        ctx.lineTo(ball1.x, ball1.y);
        ctx.lineTo(ball2.x, ball2.y);
        ctx.lineTo(ball3.x, ball3.y);

        ctx.closePath();

        ctx.stroke();

        ball1.render(ctx);
        ball2.render(ctx);
        ball3.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 7. 多物体弹动效果\_封装

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);
      let mouse = C.getOffset(canvas);

      let spring = 0.03; // 弹动系数
      let draggedBall = null; // 保存当前增在被拖拽的ball
      let springLength = 200; // 弹动间距
      let friction = 0.9; // 摩擦系数

      let balls = [];
      for (let i = 0; i < 8; i++) {
        balls.push(
          new Ball({
            x: C.rp([50, W - 50]),
            y: C.rp([50, H - 50]),
            r: 20,
          }),
        );
      }

      canvas.addEventListener('mousedown', function () {
        for (let ball of balls) {
          if (ball.isPoint(mouse)) {
            ball.dragged = true;
            draggedBall = ball;
          }
        }
      });
      canvas.addEventListener('mousemove', function () {
        if (draggedBall) {
          draggedBall.x = mouse.x;
          draggedBall.y = mouse.y;
        }
      });
      canvas.addEventListener('mouseup', function () {
        draggedBall.dragged = false;
        draggedBall = null;
      });

      function springTo(b1, b2) {
        let dx = b2.x - b1.x;
        let dy = b2.y - b1.y;
        let angle = Math.atan2(dy, dx);

        let targetX = b2.x - springLength * Math.cos(angle);
        let targetY = b2.y - springLength * Math.sin(angle);

        b1.vx += (targetX - b1.x) * spring;
        b1.vy += (targetY - b1.y) * spring;

        b1.vx *= friction;
        b1.vy *= friction;

        b1.x += b1.vx;
        b1.y += b1.vy;
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255,0,0)';
        balls.forEach((ball) => {
          ctx.lineTo(ball.x, ball.y);
        });

        ctx.closePath();

        ctx.stroke();

        balls.forEach((ball, i) => {
          if (!ball.dragged) {
            let arrTemp = balls.slice();
            arrTemp.splice(i, 1);
            for (let item of arrTemp) {
              springTo(ball, item);
            }
          }
          ball.render(ctx);
        });
      })();
    </script>
  </body>
</html>
```

## 五、碰撞检测

- 1. 矩形碰撞检测原理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./box.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 900);
      let H = (canvas.height = 700);

      let mouse = C.getOffset(canvas);

      let drag1 = false,
        drag2 = false,
        disX = 0,
        disY = 0;

      let box1 = new Box({
        x: C.rp([0, 1000]),
        y: H / 2,
        w: 100,
        h: 100,
        fillStyle: C.createColor(),
      });
      let box2 = new Box({
        x: C.rp([0, 1000]),
        y: H / 2,
        w: 50,
        h: 50,
        fillStyle: C.createColor(),
      });

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        if (box1.isPoint(mouse)) {
          drag1 = true;
          disX = mouse.x - box1.x;
          disY = mouse.y - box1.y;
        }
        if (box2.isPoint(mouse)) {
          drag2 = true;
          disX = mouse.x - box2.x;
          disY = mouse.y - box2.y;
        }
      });
      canvas.addEventListener('mousemove', function (e) {
        if (drag1) {
          box1.x = mouse.x - disX;
          box1.y = mouse.y - disY;
        }
        if (drag2) {
          box2.x = mouse.x - disX;
          box2.y = mouse.y - disY;
        }
      });

      canvas.addEventListener('mouseup', function (e) {
        drag1 = false;
        drag2 = false;
      });

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        if (C.rectDuang(box1, box2)) {
          console.log('碰撞了');
        }

        box1.render(ctx);
        box2.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 简易俄罗斯方块

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./box.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);
      let boxes = [],
        g = 0.1,
        activeBox = createBox();

      function createBox() {
        const box = new Box({
          x: C.rp([0, W], true),
          w: C.rp([20, 50]),
          h: C.rp([20, 50]),
          fillStyle: C.createColor(),
        });
        boxes.push(box);
        return box;
      }
      function keydownFn(e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
          case 37:
            activeBox.x -= 10;
            break;
          case 39:
            activeBox.x += 10;
            break;
          case 40:
            g = 0.02;
        }
      }

      document.addEventListener('keydown', keydownFn);
      document.addEventListener('keyup', function (e) {
        g = 0.02;
      });

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        activeBox.vy += g;
        activeBox.y += activeBox.vy;

        if (activeBox.y + activeBox.h >= H) {
          activeBox.y = H - activeBox.h;
          activeBox = createBox();
        }

        boxes.forEach((item) => {
          if (item != activeBox && C.rectDuang(activeBox, item)) {
            activeBox.y = item.y - activeBox.h;
            activeBox = createBox();
          }
          item.render(ctx);
        });
      })();
    </script>
  </body>
</html>
```

- 3. 圆形碰撞检测原理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 900);
      let H = (canvas.height = 700);

      let mouse = C.getOffset(canvas);
      let activeBall = null;

      let ball1 = new Ball({
        x: 50,
        y: H / 2,
        r: 40,
        fillStyle: C.createColor(),
      });
      let ball2 = new Ball({
        x: 300,
        y: H / 2,
        r: 50,
        fillStyle: C.createColor(),
      });
      canvas.addEventListener('mousedown', function (e) {
        if (ball1.isPoint(mouse)) {
          activeBall = ball1;
        }
        if (ball2.isPoint(mouse)) {
          activeBall = ball2;
        }
      });
      canvas.addEventListener('mousemove', function (e) {
        if (activeBall) {
          activeBall.x = mouse.x;
          activeBall.y = mouse.y;
        }
      });
      canvas.addEventListener('mouseup', function (e) {
        activeBall = null;
      });
      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        if (
          C.getDist(ball1.x, ball1.y, ball2.x, ball2.y) <=
          ball1.r + ball2.r
        ) {
          console.log('撞上了');
        }

        ball1.render(ctx);
        ball2.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 4. 多球体碰撞

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 900);
      let H = (canvas.height = 700);

      let mouse = C.getOffset(canvas);

      let firstBallR = 100,
        bigBall = false;

      let balls = [],
        num = 300,
        bounce = -0.5,
        spring = 0.02;

      for (let i = 0; i < num; i++) {
        balls.push(
          new Ball({
            x: C.rp([0, W]),
            y: C.rp([0, H]),
            r: !i ? firstBallR : 10,
            fillStyle: C.createColor(),
            vx: C.rp([-3, 3]),
            vy: C.rp([-3, 3]),
          }),
        );
      }

      canvas.addEventListener('mousemove', function (e) {
        balls[0].x = mouse.x;
        balls[0].y = mouse.y;
      });
      canvas.addEventListener('click', function (e) {
        firstBallR = firstBallR <= H / 2 ? firstBallR + 50 : 100;
        balls[0].r = firstBallR;
      });
      canvas.addEventListener('mouseover', function (e) {
        bigBall = true;
      });
      canvas.addEventListener('mouseout', function (e) {
        bigBall = false;
      });
      // 小球与小球之间的碰撞处理
      function checkHit(ballA, i) {
        // 鼠标移出进行鼠标和小球的碰撞处理
        if (!i && !bigBall) return;
        for (let j = i + 1; j < num; j++) {
          const ballB = balls[j];
          const dx = ballB.x - ballA.x,
            dy = ballB.y - ballA.y;
          const dist = C.getDist(ballA.x, ballA.y, ballB.x, ballB.y);
          const minDist = ballA.r + ballB.r;
          if (dist < minDist) {
            const tx = ballA.x + (dx * minDist) / dist;
            const ty = ballA.y + (dy * minDist) / dist;

            const ax = (tx - ballB.x) * spring;
            const ay = (ty - ballB.y) * spring;

            ballA.vx -= ax;
            ballA.vy -= ay;
            ballB.vx += ax;
            ballB.vy += ay;
          }
        }
      }
      // 用来对小球进行运动处理
      function moveBall(ball, i) {
        if (!i) return;
        // 边界处理
        C.checkBallBounce(ball, W, H, bounce);
        // 设置每个小球的最新坐标点
        ball.x += ball.vx;
        ball.y += ball.vy;
      }
      function renderBall(ball, i) {
        if (!i) return;
        ball.render(ctx);
      }
      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        balls.forEach(checkHit);
        balls.forEach(moveBall);
        balls.forEach(renderBall);
      })();
    </script>
  </body>
</html>
```

- 5. 光线投影法

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./Ball.js"></script>
    <script src="./box.js"></script>
    <script src="./utils.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 900);
      let H = (canvas.height = 700);

      let mouse = C.getOffset(canvas);
      let friction = 0.98,
        g = 0.3;
      let easing = 0.03;
      let moving = false;
      let lastX = 0,
        lastY = 0;

      let ball = new Ball({
        x: 50,
        y: 500,
        r: 30,
        fillStyle: C.createColor(),
      });
      let box = new Box({
        x: 620,
        y: 480,
        w: 120,
        h: 70,
      });
      function checkHit() {
        const k1 = (ball.y - lastY) / (ball.x - lastX);
        const b1 = lastY - k1 * lastX;
        const k2 = 0;
        const b2 = ball.y;
        // k1*x + b1 = k2*x + b2
        const cx = (b2 - b1) / (k1 - k2);
        const cy = k1 * cx + b1;
        if (
          cx - ball.r / 2 > box.x &&
          cx + ball.r / 2 < box.x + box.w &&
          ball.y - ball.r > box.y
        ) {
          console.log('小球进去了！');
          return true;
        }
      }
      function ballMove() {
        ball.vx *= friction;
        ball.vy *= friction;
        ball.vy += g;

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (
          checkHit() ||
          ball.x - ball.r >= W ||
          ball.x + ball.x <= 0 ||
          ball.y - ball.r >= H ||
          ball.y + ball.r < 0
        ) {
          moving = false;
          ball.x = 50;
          ball.y = 500;
        }
        lastX = ball.x;
        lastY = ball.y;
      }
      function drawLine() {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.lineWidth = 2;
        ctx.lineTo(mouse.x, mouse.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.closePath();
        ctx.stroke();
      }
      canvas.addEventListener('click', function (e) {
        moving = true;
        ball.vx = (mouse.x - ball.x) * easing;
        ball.vy = (mouse.y - ball.y) * easing;
        lastX = ball.x;
        lastY = ball.y;
      });

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        if (moving) {
          ballMove();
        } else {
          drawLine();
        }

        ball.render(ctx);
        box.render(ctx);
      })();
    </script>
  </body>
</html>
```

## 六、高级坐标旋转和斜面反弹

- 1. 高级坐标旋转

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
        /* position: absolute;
      left: 10%;
      top: 5% */
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);

      const ball = new Ball({
        x: C.rp([50, W - 50]),
        y: C.rp([50, W - 50]),
        r: 25,
      }).render(ctx);

      let cx = W / 2,
        cy = H / 2,
        vr = 0.05,
        cos = Math.cos(vr),
        sin = Math.sin(vr);

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        // ctx.beginPath()
        // ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2)
        // ctx.stroke()

        const dx = ball.x - cx;
        const dy = ball.y - cy;

        const x = dx * cos - dy * sin;
        const y = dy * cos + dx * sin;

        ball.x = cx + x;
        ball.y = cy + y;

        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 旋转多个物体

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background: #000;
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let mouse = C.getOffset(canvas);
      let balls = [];

      for (let i = 0; i < 20; i++) {
        balls.push(
          new Ball({
            x: C.rp([50, W - 50]),
            y: C.rp([50, W - 50]),
            r: Math.random() * 20 + 10,
            fillStyle: C.createColor(),
          }),
        );
      }

      let cx = W / 2,
        cy = H / 2,
        vr = 0.05,
        cos = Math.cos(vr),
        sin = Math.sin(vr),
        direction = false;
      canvas.addEventListener('mousemove', function (e) {
        if (cx - mouse.x) {
          direction = true;
          vr = (cx - mouse.x) / 1000;
        } else {
          direction = false;
          vr = (cx - mouse.x) / 1000;
        }
        cos = Math.cos(vr);
        sin = Math.sin(vr);
        console.log(vr);
      });

      function ballMove(ball, direction = false) {
        const dx = ball.x - cx;
        const dy = ball.y - cy;
        let x, y;
        if (direction) {
          x = dx * cos - dy * sin;
          y = dy * cos + dx * sin;
        } else {
          x = dx * cos + dy * sin;
          y = dy * cos - dx * sin;
        }

        ball.x = cx + x;
        ball.y = cy + y;
      }

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        balls.forEach((ball) => {
          ballMove(ball, direction);
          ball.render(ctx);
        });
      })();
    </script>
  </body>
</html>
```

- 3. 小球和斜面反弹

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background: #000;
        box-shadow: 0.25rem 0.25rem 0.75rem #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./line.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 800);
      let H = (canvas.height = 600);

      let line = new Line({
        x: 100,
        y: 250,
        strokeStyle: C.createColor(),
        rotation: C.toRad(10),
        x1: 0,
        y1: 0,
        x2: 400,
        y2: 0,
        lineWidth: 2,
      });

      let ball = new Ball({
        x: 130,
        y: 100,
        fillStyle: C.createColor(),
        r: 60,
      });

      let g = 0.2,
        bounce = -0.9; // 反弹系数
      let cos = Math.cos(line.rotation),
        sin = Math.sin(line.rotation);

      function checkBallMove() {
        // 获取小球相对于中心点的坐标
        let rx = ball.x - line.x;
        let ry = ball.y - line.y;
        // 对小球的坐标点进行旋转
        let x1 = rx * cos + ry * sin;
        let y1 = ry * cos - rx * sin;
        // 对小球的速度进行旋转
        let vx1 = ball.vx * cos + ball.vy * sin;
        let vy1 = ball.vy * cos - ball.vx * sin;
        // 检测小球和水平直线的碰撞
        if (x1 + ball.r > line.x1 && x1 - ball.r < line.x2) {
          // 斜面之下不走碰撞检测vy1 > y1
          if (y1 + ball.r > 0 && vy1 > y1) {
            y1 = -ball.r;
            vy1 *= bounce;
          }
          // 与斜面下发生碰撞
          if (y1 - ball.r < 0 && vy1 < y1) {
            y1 = ball.r;
            vy1 *= bounce;
          }
        }
        // 将整个系统旋转回初始的位置
        rx = x1 * cos - y1 * sin;
        ry = y1 * cos + x1 * sin;

        ball.vx = vx1 * cos - vy1 * sin;
        ball.vy = vy1 * cos + vx1 * sin;

        ball.x = rx + line.x;
        ball.y = ry + line.y;
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, W, H);

        ball.vy += g;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // 处理小球与横线间的反弹
        checkBallMove();
        // 处理小球与边界之间的反弹
        C.checkBallBounce(ball, W, H, bounce);

        console.log(line);
        line.render(ctx);
        ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

## 七、撞球物理

- 1. 检测碰撞

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script src="./line.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 900);
      let H = (canvas.height = 700);

      let mouse = C.getOffset(canvas);

      let b1 = new Ball({
        x: 100,
        y: H / 2,
        fillStyle: 'rgb(226,62,111)',
        r: 50,
        m: 2,
        vx: 3,
      });

      let b2 = new Ball({
        x: W - 100,
        y: H / 2,
        fillStyle: 'rgb(26,259,208)',
        r: 30,
        m: 1,
        vx: -4,
      });

      let line = new Line({
        x: 0,
        y: 0,
        lineWidth: 2,
        strokeStyle: '#000',
        x1: 0,
        y1: H / 2,
        x2: W,
        y2: H / 2,
      });

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        b1.x += b1.vx;
        b2.x += b2.vx;

        let dist = Math.abs(b1.x - b2.x); // 两球之间的距离
        // 拥有质量之后 两球相撞 动能守恒 模拟相撞后的速度
        if (dist < b1.r + b2.r) {
          let lep = b1.r + b2.r - dist;
          b1.x = b1.x - lep / 2;
          b2.x = b2.x - lep / 2;

          let v1Final =
            ((b1.m - b2.m) * b1.vx + 2 * b2.m * b2.vx) / (b1.m + b2.m);
          let v2Final =
            ((b2.m - b1.m) * b2.vx + 2 * b1.m * b1.vx) / (b1.m + b2.m);

          b1.vx = v1Final;
          b2.vx = v2Final;
        }

        C.checkBallBounce(b1, W, H, -1);
        C.checkBallBounce(b2, W, H, -1);

        line.render(ctx);
        b1.render(ctx);
        b2.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 二维碰撞

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script src="./line.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 600);
      let H = (canvas.height = 400);

      let mouse = C.getOffset(canvas);

      let b1 = new Ball({
        x: C.rp([0, W], true),
        y: C.rp([0, H], true),
        fillStyle: 'rgb(226,62,111)',
        r: 50,
        m: 2,
        vx: C.rp([-5, 5]),
        vy: C.rp([-5, 5]),
      });

      let b2 = new Ball({
        x: C.rp([0, W], true),
        y: C.rp([0, H], true),
        fillStyle: 'rgb(26,259,208)',
        r: 30,
        m: 1,
        vx: C.rp([-5, 5]),
        vy: C.rp([-5, 5]),
      });

      function checkMove(b1, b2) {
        let dx = b2.x - b1.x;
        let dy = b2.y - b1.y;
        let dist = Math.sqrt(dx ** 2 + dy ** 2);
        if (dist < b1.r + b2.r) {
          let angle = Math.atan2(dy, dx);
          let sin = Math.sin(angle);
          let cos = Math.cos(angle);

          // 以b1为参照物，设定b1的中心点为旋转基点
          let x1 = 0;
          let y1 = 0;
          let x2 = dx * cos + dy * sin;
          let y2 = dy * cos - dx * sin;

          // 旋转b1和b2的速度
          let vx1 = b1.vx * cos + b1.vy * sin;
          let vy1 = b1.vy * cos - b1.vx * sin;
          let vx2 = b2.vx * cos + b2.vy * sin;
          let vy2 = b2.vy * cos - b2.vx * sin;

          // 求出b1和b2碰撞之后的速度
          let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m);
          let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m);

          // 处理两个小球碰撞之后，将它们进行归位
          let lep = b1.r + b2.r - Math.abs(x2 - x1);

          x1 = x1 + (vx1Final < 0 ? -lep / 2 : lep / 2);
          x2 = x2 + (vx2Final < 0 ? -lep / 2 : lep / 2);

          b2.x = b1.x + (x2 * cos - y2 * sin);
          b2.y = b1.y + (y2 * cos + x2 * sin);
          b1.x = b1.x + (x1 * cos - y1 * sin);
          b1.y = b1.y + (y1 * cos + x1 * sin);

          b1.vx = vx1Final * cos - vy1 * sin;
          b1.vy = vy1 * cos + vx1Final * sin;
          b2.vx = vx2Final * cos - vy2 * sin;
          b2.vy = vy2 * cos + vx2Final * sin;
        }
      }

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);

        b1.x += b1.vx;
        b1.y += b1.vy;
        b2.x += b2.vx;
        b2.y += b2.vy;

        checkMove(b1, b2);

        const dist = C.getDist();

        C.checkBallBounce(b1, W, H, -1);
        C.checkBallBounce(b2, W, H, -1);

        b1.render(ctx);
        b2.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 3. 多物体碰撞检测

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script src="./line.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 600);
      let H = (canvas.height = 400);

      let mouse = C.getOffset(canvas);

      let balls = [];

      for (let i = 0; i < 100; i++) {
        balls.push(
          new Ball({
            x: C.rp([0, W], true),
            y: C.rp([0, H], true),
            fillStyle: C.createColor(),
            r: Math.random() > 0.1 ? 5 : 10,
            m: C.rp([2, 8], true),
            vx: C.rp([-2, 2]),
            vy: C.rp([-2, 2]),
          }),
        );
      }

      (function move() {
        window.requestAnimationFrame(move);

        ctx.clearRect(0, 0, W, H);
        for (let ball of balls) {
          ball.x += ball.vx;
          ball.y += ball.vy;
        }

        balls.forEach((ball, i) => {
          let arr = balls.slice();
          arr.splice(i, 1);
          for (let item of arr) {
            C.checkBallHit(ball, item);
          }
          C.checkBallBounce(ball, W, H, -1);
          ball.render(ctx);
        });
      })();
    </script>
  </body>
</html>
```

## 八、粒子和万有引力

- 1. 弹弓效应

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W = (canvas.width = 600);
      let H = (canvas.height = 400);

      let mouse = C.getOffset(canvas);

      let particles = [],
        num = 100;

      for (let i = 0; i < num; i++) {
        const size = C.rp([3, 10]);
        particles.push(
          new Ball({
            x: C.rp([0, W], true),
            y: C.rp([0, H], true),
            r: size,
            fillStyle: C.createColor(),
            m: size,
          }),
        );
      }
      function move(ball, i) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        for (let j = i + 1; j < num; j++) {
          const target = particles[j];
          gravitate(ball, target);
          C.checkBallHit(ball, target);
        }
      }

      function gravitate(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSQ = dx ** 2 + dy ** 2;
        const dist = Math.sqrt(distSQ);

        const force = (p1.m * p2.m) / distSQ;

        const ax = (force * dx) / dist;
        const ay = (force * dy) / dist;

        p1.vx += ax / p1.m;
        p1.vy += ay / p1.m;
        p2.vx += ax / p2.m;
        p2.vy += ay / p2.m;
      }

      function draw(ball, i) {
        ball.render(ctx);
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        particles.forEach(move);
        particles.forEach(draw);
      })();
    </script>
  </body>
</html>
```

- 2. 粒子花园

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        height: 100%;
      }

      #canvas {
        background: #000;
        box-shadow: 4px 4px 12px #ccc;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let W, H;

      let mouse = C.getOffset(canvas);

      let particles = [],
        spring = 0.0001;
      // 窗口变化 重新创建粒子
      window.onresize = function () {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        createParticles((W * H) / 15000);
      };

      window.onresize();
      // 创建粒子函数
      function createParticles(num) {
        if (num != particles.length) {
          particles.length = 0;
          for (let i = 0; i < num; i++) {
            const size = C.rp([3, 10]);
            particles.push(
              new Ball({
                x: C.rp([0, W]),
                y: C.rp([0, H]),
                fillStyle: '#fff',
                vx: C.rp([-2, 2]),
                vy: C.rp([-2, 2]),
                r: size,
                m: size,
              }),
            );
          }
        }
      }
      // 粒子移动函数
      function move(p, i) {
        p.x += p.vx;
        p.y += p.vy;

        for (let j = i + 1; j < particles.length; j++) {
          const target = particles[j];
          checkSpring(p, target);
          C.checkBallHit(p, target);
        }

        if (p.x - p.r > W) {
          p.x = -p.r;
        } else if (p.x + p.r < 0) {
          p.x = W - p.r;
        }

        if (p.y - p.r > H) {
          p.y = -p.r;
        } else if (p.y + p.r < 0) {
          p.y = H - p.r;
        }
      }
      // 处理粒子碰撞
      function checkSpring(current, target) {
        let dx = target.x - current.x;
        let dy = target.y - current.y;
        let dist = Math.sqrt(dx ** 2 + dy ** 2);
        let minDist = W > H ? W / 10 : H / 5;
        if (dist < minDist) {
          drawLine(current, target, dist, minDist);

          let ax = dx * spring;
          let ay = dy * spring;
          current.vx += ax / current.m;
          current.vy += ay / current.m;
          target.vx -= ax / target.m;
          target.vy -= ay / target.m;
        }
      }
      //相邻粒子画线效果
      function drawLine(current, target, dist, minDist) {
        ctx.save();
        ctx.lineWidth = 2 * Math.max(0, 1 - dist / minDist);
        ctx.globalAlpha = Math.max(0, 1 - dist / minDist);
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.restore();
      }

      function draw(p) {
        p.render(ctx);
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        particles.forEach(move);
        particles.forEach(draw);
      })();
    </script>
  </body>
</html>
```

## 九、从 2D 到 3D

- 1. 模拟基本的三维环境

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      canvas {
        background: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = 800);
      let H = (canvas.height = 600);
      let x = 0,
        y = 0,
        z = 0;
      let f1 = 200;
      let hx = W / 2,
        hy = H / 2;

      const ball = new Ball({
        r: 80,
      });

      const mouse = C.getOffset(canvas);

      window.addEventListener('keydown', function (e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
          case 38:
            z += 10;
            break;
          case 40:
            z -= 10;
            break;
        }
      });

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        if (z > -f1) {
          let scale = f1 / (f1 + z);

          x = mouse.x - hx;
          y = mouse.y - hy;

          ball.scaleX = ball.scaleY = scale;

          ball.x = hx + x * scale;
          ball.y = hy + y * scale;
          ball.show = true;
        } else {
          ball.show = false;
        }

        ball.show && ball.render(ctx);
      })();
    </script>
  </body>
</html>
```

- 2. 三维环境下的简单动画

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      canvas {
        background: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W = (canvas.width = window.innerWidth);
      let H = (canvas.height = window.innerHeight);

      let balls = [],
        num = 200,
        g = 0.2,
        bounce = -0.8,
        floor = 300;
      let f1 = 250, // 焦距
        hx = W / 2,
        hy = H / 2; // 消失点

      const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
      ballColor.addColorStop(0, 'rgb(255,255,255)');
      ballColor.addColorStop(0.3, 'rgb(0,255,240,1)');
      ballColor.addColorStop(0.5, 'rgb(0,240,255,1)');
      ballColor.addColorStop(0.8, 'rgb(0,110,255,0.8)');
      ballColor.addColorStop(1, 'rgb(0,0,0,0.2)');

      for (let i = 0; i < num; i++) {
        balls.push(
          new Ball({
            y3d: -200,
            r: 10,
            fillStyle: ballColor,
            vx: C.rp([-6, 6]),
            vy: C.rp([-3, 6]),
            vz: C.rp([-5, 5]),
          }),
        );
      }

      const mouse = C.getOffset(canvas);

      function move(ball) {
        ball.vy += g;
        ball.x3d += ball.vx;
        ball.y3d += ball.vy;
        ball.z3d += ball.vz;

        if (ball.y3d > floor) {
          ball.y3d = floor;
          ball.vy *= bounce;
        }

        if (ball.z3d > -f1) {
          let scale = f1 / (f1 + ball.z3d);

          ball.scaleX = ball.scaleY = scale;

          ball.x = hx + ball.x3d * scale;
          ball.y = hy + ball.y3d * scale;
          ball.show = true;
        } else {
          ball.show = false;
        }
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        balls.forEach(move);
        balls.sort((a, b) => b.z3d - a.z3d);
        balls.forEach((ball) => ball.show && ball.render(ctx));
      })();
    </script>
  </body>
</html>
```

- 3. 3d 动画基础

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      canvas {
        background: #000;
      }
    </style>
  </head>

  <body>
    <canvas id="canvas"></canvas>
    <script src="./utils.js"></script>
    <script src="./Ball.js"></script>
    <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      let W,
        H,
        hx,
        hy,
        maxZ = 1200,
        particles = [],
        f = 0.8,
        f1 = 250;
      const mouse = C.getOffset(canvas);
      const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
      ballColor.addColorStop(0, 'rgb(255,255,255)');
      ballColor.addColorStop(0.3, 'rgb(0,255,240,1)');
      ballColor.addColorStop(0.5, 'rgb(0,240,255,1)');
      ballColor.addColorStop(0.8, 'rgb(0,110,255,0.8)');
      ballColor.addColorStop(1, 'rgb(0,0,0,0.2)');

      window.onresize = function () {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        hx = W / 2;

        hy = H / 2;
        createParticles((W * H) / 3200);
      };
      window.onresize();

      function createParticles(num) {
        if (particles.length !== num) {
          particles.length = 0;
        }
        for (let i = 0; i < num; i++) {
          particles.push(
            new Ball({
              x3d: C.rp([-1.5 * W, 2 * W]),
              y3d: C.rp([-1.5 * H, 2 * H]),
              z3d: C.rp([0, maxZ]),
              r: 10,
              fillStyle: ballColor,
              vz: C.rp([-2, 2]),
              // az: C.rp([-2, -1]),
              az: C.rp([1, 2]),
            }),
          );
        }
      }

      function move(p) {
        p.vz += p.az;
        p.vz *= f;
        p.z3d += p.vz;
        // 小球小时的时候
        if (p.z3d < -f1) {
          p.z3d += maxZ;
        }

        if (p.z3d > maxZ - f1) {
          p.z3d -= maxZ;
        }

        let scale = f1 / (f1 + p.z3d);

        p.scaleX = p.scaleY = scale;
        p.x = hx + p.x3d * scale;
        p.y = hy + p.y3d * scale;
        p.alpha = Math.min(Math.abs(scale) * 1.5, 1);
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        particles.forEach(move);
        particles.sort((a, b) => b.z3d - a.z3d);
        particles.forEach((ball) => ball.render(ctx));
      })();
    </script>
  </body>
</html>
```

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
