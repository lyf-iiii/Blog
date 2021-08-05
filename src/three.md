# three

## 创建一个场景

- 场景

```javascript
var scene = new THREE.Scene();
```

- 相机
  - 正投影摄像机 OrthographicCamera
  - PersoectiveCamera （透视摄像机）
  - 正投影摄像机在什么角度看缩放都是一样的
  - 透视摄像机 可以变化缩放

```javascript
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
```

    - 第一个属性是 **视野角度**
    - 第二个值是 **长宽比（aspect ratio）**
    - 远剪切面
    - 近剪切面

- 渲染器 webRenderer

```javascript
var renderer = new THREE.WebGLRenderer();
//
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
```

    - 如果你希望保持你的应用程序的尺寸，但是以较低的分辨率来渲染，你可以在调用setSize时，给updateStyle（第三个参数）传入false

- 立方体 BoxGeometry
  - CubeGeometry(width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, sides)
- 材质 MeshBasicMaterial
- 网格 Mesh
- 渲染场景
  - 进行`渲染`或者`动画循环`
  - requestAnimationFrame 用户切换到其他的标签页的时候会暂停，因此不会浪费用户的处理器资源
  ```javascript
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  ```

## 在 threejs 中定义一个点

```javascript
THREE.Vector3 = function(x,y,z) { this.x = x || 0 this.y = y || 0 this.z = z ||
0 }
```

## 绘制一个坐标系

```javascript
function initObject() {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
  geometry.vertices.push(new THREE.Vector3(500, 0, 0));
  for (var i = 0; i <= 20; i++) {
    var line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 }),
    );
    line.position.z = i * 50 - 500;
    scene.add(line);

    var line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 }),
    );
    line.position.x = i * 50 - 500;
    line.rotation.y = (90 * Math.PI) / 180;
    scene.add(line);
  }
}
```

## 性能监视器 Stats

```javascript
  - 在Three.js中，性能监视器被封装在一个类中，这个类叫做Stats
var stats = new Stats();
stats.setMode(1);
//将stats的界面对应左上角
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
setInterval(function () {
  stats.begin();
  stats.end();
}, 1000 / 60);
```

- setMode
  - 参数为 0 的时候，表示显示的是 FPS 界面，参数为 1 的时候，表示显示的是 MS 界面
- domElement
  - stats 的 domElement 表示绘制的目的地（DOM），波形图就绘制在这上面
- begin 函数
  - begin，在你要测试的代码前面调用 begin 函数，在你代码执行完后调用 end()函数，这样就能够统计出这段代码执行的平均帧数了

```javascript
//new 一个stats对象
stats = new Stats();
//将这个对象加入到html网页中去
stats.domElement.style.position = 'absolute';

stats.domElement.style.left = '0px';

stats.domElement.style.top = '0px';
//调用stats.update()函数来统计时间和帧数
stats.update();
```

## 动画引擎 Tween

- to 函数 第一个参数接收一个 map 键代表 mesh.position.x 值-400，第二个参数是完成动画需要的时间这里是 3000ms
- repeat 接收动画执行的次数 Infinity 表示执行无穷次
- start() 表示开始动画 默认情况下动画执行是匀速执行
- TWEEN.update() 执行达到让动画动起来的目的

```javascript
function initTween() {
  new TWEEN.Tween(mesh.position).to({ x: -400 }, 3000).repeat(Infinity).start();
}
```

## 光源 Light

### 光源基类

- THREE.Light(hex)
  - hex 接收一个 16 进制的颜色值

### 派生光源

- AmbientLight 环境光
- AreaLight 区域光
- DirectionalLight 方向光
- SpotLight 聚光灯
- PointLight 点光源
