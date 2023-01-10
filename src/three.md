# ThreeJS 知识点

## 创建一个场景

### 场景

```javascript
var scene = new THREE.Scene();
```

#### 属性

- fog（雾化）：雾化效果是：场景中的物体离摄像机越远就会变得越模糊
- overrideMaterial（材质覆盖）

#### 方法

- THREE.Scene.Add：用于向场景中添加对象
- THREE.Scene.Remove：用于移除场景中的对象
- THREE.Scene.children：用于获取场景中所有的子对象列表
- THREE.Scene.getObjectByName：利用 name 属性，用于获取场景中特定的对象
- THREE.Scene.traverse(Fn) ：传入一个函数 会在 scene 对象深度遍历每一个子对象上运行

### 几何体

- THREE.CylinderGeometry(1, 4, 4): 三围圆柱
- THREE.BoxGeometry(2, 2, 2)：基本立方体
- THREE.SphereGeometry(2)：基本领域
- THREE.IcosahedronGeometry(4)：二十面缓冲几何体
- THREE.ConvexGeometry(points：array)：凸面体
- THREE.LatheGeometry(pts, 12)： 扫描几何体
- THREE.OctahedronGeometry(3)：八面体
- THREE.ParametricGeometry：根据公式创建几何体
- THREE.TetrahedronGeometry(3)：四面缓冲几何体
- THREE.TorusGeometry(3, 1, 10, 10)：三围圆环
- THREE.TorusKnotGeometry(3, 0.5, 50, 20)：三围环面纽结

### 几何体的属性

- scale 沿着指定轴缩放
- position 空间定位
- rotation 沿着指定轴旋转
- translate 沿着制定轴平移

## 相机

- 正投影摄像机 OrthographicCamera ：正交投影摄像机 每个方格是一样大的 常用于二维游戏 模拟城市 文明
- PersoectiveCamera （透视摄像机）：本书示例常用摄像机 更加贴近真实
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

- 材质

  基础材质 MeshBasicMaterial

  网格材质 MeshLambertMaterial

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

### 基础光源

- AmbientLight 环境光：颜色会叠加到场景现有物体的颜色上

- PointLight 点光源：从空间的一点向所有方向发射光线，点光源不能用来创建阴影

- SpotLight 聚光灯：有聚光的效果，类似台灯天花板上的吊灯或者手电筒，这种光源可以投射阴影

  - ![image-20220811231933530](/Users/lianyafeng/Library/Application Support/typora-user-images/image-20220811231933530.png)

- DirectionalLight 方向光：也称为无限光，发出的光线可以看作是平行的，例如太阳光，可以创建阴影

  ![image-20220811230217359](/Users/lianyafeng/Library/Application Support/typora-user-images/image-20220811230217359.png)

### 特殊光源

- AreaLight 区域光：可以指定散发光线的平面，而不是一个点，不投射阴影
- LensFlare：不是光源，但是可以为光源添加镜头光晕效果
- HemisphereLight ：特殊光源 可以通过模拟反光面和光线微弱的天空来创建更加自然的室外光线， 不提供阴影

## 材质

## 粒子和精灵

## 高级几何体

## 动画和 摄像机移动

## 纹理

## 着色器

## 声音
