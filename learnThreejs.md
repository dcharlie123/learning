有一个[效果炫酷的H5](http://up.qq.com/act/a20170301pre/index.html),通过查看资源发现用了webGL，但是webGL用在H5好像不太可能，所以想到**WebGL中的Jquery**...**three.js**

three.js是一个3d的js库，用于构建三维可视化页面，底层是基于WebGL；
虽然说之前看到一点点基础，但是忘得差不多了，three.js的官网还是一样不堪入目。。。
## three.js基础
##### 场景（照相前总要有拍摄地点的）
`var scene = new THREE.Scene()`
##### 照相机
~`var camera = new THREE.Camera()`~
> 在Threejs中相机的表示是THREE.Camera，它是相机的抽象基类，其子类有两种相机，分别是正投影相机THREE.OrthographicCamera和透视投影相机THREE.PerspectiveCamera。
- 所谓正交相机就是`物体不会被缩放，平行线永远保持平行`,`new OrthographicCamera(left, right, top, bottom, near, far)`;
![](http://www.hewebgl.com/attached/image/20130530/20130530145859_920.jpg)
<blockquote>
  
就是我们假设的相机中心点。下面介绍一下构造函数的参数：

1、 left参数left：左平面距离相机中心点的垂直距离。从图中可以看出，左平面是屏幕里面的那个平面。

2、 right参数right：右平面距离相机中心点的垂直距离。从图中可以看出，右平面是屏幕稍微外面一点的那个平面。

3、 top参数
top：顶平面距离相机中心点的垂直距离。上图中的顶平面，是长方体头朝天的平面。

4、 bottom参数
bottom：底平面距离相机中心点的垂直距离。底平面是头朝地的平面。

5、near参数
near：近平面距离相机中心点的垂直距离。近平面是左边竖着的那个平面。

6、far参数
far：远平面距离相机中心点的垂直距离。远平面是右边竖着的那个平面。

有了这些参数和相机中心点，我们这里将相机的中心点又定义为相机的位置。通过这些参数，我们就能够在三维空间中唯一的确定上图的一个长方体。这个长方体也叫做视景体。
投影变换的目的就是定义一个视景体，使得视景体外多余的部分裁剪掉，最终图像只是视景体内的有关部分。
好了，看一个简单的例子：
var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
scene.add( camera );
这个例子将浏览器窗口的宽度和高度作为了视景体的高度和宽度，相机正好在窗口的中心点上。这也是我们一般的设置方法，基本上为了方便，我们不会设置其他的值。
</blockquote>

- 透视投影相机就是由近及远看到越来越小，`近大远小的效果`,`new PerspectiveCamera( fov, aspect, near, far )`
   - fov角度，aspect宽高比，
   - <blockquote>近平面near：这个呢，表示你近处的裁面的距离。补充一下，也可以认为是眼睛距离近处的距离，假设为10米远，请不要设置为负值，Three.js就        傻了,不知道怎么算了,3、远平面far：这个呢，表示你远处的裁面</blockquote>
##### 坐标系
three.js 的坐标系符合右手定则。
##### 渲染器
```
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
```
##### 把要拍摄的东西放入场景中
`scene.add(XXX)//XXX是物体，threejs里面可以创建很多中形状的物体`
##### 把整个场景放入页面
例如：`document.getElementById('container').appendChild(renderer.domElement);`
##### 简单例子（一个正方体）
```javascript
  //创建场景
  let scene = new THREE.Scene();
  //创建相机
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  //设置相机位置
  camera.position.set(0, 0, 10);
  //创建渲染器
  var renderer = new THREE.WebGLRenderer();
  //设置渲染器大小及像素比
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  //添加到页面
  container = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
  //创建一个立方体1*1*1
  let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  //材质
  let cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    aoMapIntensity:0.5
    // wireframe:true
    // lights:true
  });
  //把形状和材质结合起来
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  //旋转
  cube.rotation.x=10;
  cube.rotation.y=10;
  //把正方体添加到场景中并渲染
  scene.add(cube);
  renderer.render(scene, camera);
```
##### 另外：
- 添加模型，添加JSON还是比较方便。。。可是three升级把这个方法删了？？？
例：
```
    var loader = new THREE.JSONLoader();
    loader.load('./untitled2.json', function (geo, materials) {
      //...
    })
```
- bleader软件obj文件转json文件：官方最新版本也把这个删除了。。。解决方法：在github中找的旧版本的three，安装bleader，把three文件夹中的bleader插件
复制到bleader插件目录下就好了，具体操作[传送门](https://www.cnblogs.com/Yimi/p/6474277.html)
- 要制作粒子动画three文件夹里面有TWEEN[传送门](http://www.createjs.cc/tweenjs/)
- 想做鼠标滚轮拉近拉远的效果踩了个坑。。。Firefox浏览器并不支持*mousewheel*方法，查了MDN和zoom.js的源码，查看zoom。js做的浏览器兼容，代码如下：
```javascript
function mousewheel(obj, upfun, downfun) {
  if (document.attachEvent) {
      obj.attachEvent("onmousewheel", scrollFn)
  } else {
      if (document.addEventListener) {
          obj.addEventListener("mousewheel", scrollFn, false);
          obj.addEventListener("DOMMouseScroll", scrollFn, false)
      }
  }

  function scrollFn(e) {
      var ev = e || window.event;
      var dir = ev.wheelDelta || ev.detail;
      if (ev.preventDefault) {
          ev.preventDefault()
      } else {
          ev.returnValue = false
      }
      if (dir == -3 || dir == 120) {
          upfun()
      } else {
          downfun()
      }
  }
}
```
#### 最终静态3d粒子模型代码大概如下（加入Tween可以实现动画）：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>three.js webgl - particles - billboards</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <style>
        body {
            background-color: #000000;
            margin: 0px;
            overflow: hidden;
            font-family: Monospace;
            font-size: 13px;
            text-align: center;
            font-weight: bold;
            text-align: center;
        }

        a {
            color: #0078ff;
        }

        #info {
            color: #fff;
            position: absolute;
            top: 0px;
            width: 100%;
            padding: 5px;
            z-index: 100;
        }
    </style>
</head>

<body>
    <script src="./build/three.js"></script>

    <script src="./examples/js/Detector.js"></script>
    <script src="./examples/js/libs/stats.min.js"></script>
    <script src="./examples/js/libs/tween.min.js"></script>
    <script>
        if (!Detector.webgl) Detector.addGetWebGLMessage();
        var flag = false; //是否开始变换
        var container, stats;
        var camera, scene, renderer, particles, geometry, material, glist = []; // glist 点阵数组
        var around, aroundMaterial, aroundPoints; // 环境点组
        var mouseX = 0,
            mouseY = 0;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        var objIndex = 0; // 当前点阵模型index
        init();
        animate();

        function init() {
            // renderer 的承载容器
            container = document.createElement('div');
            document.body.appendChild(container);
            // 初始化相机
            camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 10, 10000);
            camera.position.z = 100;
            // 初始化场景
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x000000, 0.001); // 雾化
            //初始化renderer
            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            geometry = new THREE.Geometry();
            // 初始化贴图
            var textureLoader = new THREE.TextureLoader();
            textureLoader.crossOrigin = '';
            var mapDot = textureLoader.load('http://game.gtimg.cn/images/up/act/a20170301pre/images/three/gradient.png'); // 圆点
            material = new THREE.PointsMaterial({
                size: 4,
                sizeAttenuation: true,
                color: 0xffffff,
                transparent: true,
                opacity: 1,
                map: mapDot
            });
            material.vertexColors = THREE.VertexColors;
            var loader = new THREE.JSONLoader();
            loader.load('http://game.gtimg.cn/images/up/act/a20170301pre/js/obj/cpac5.json', function (geo, materials) {
                console.log(geo)
                var colors = [];
                for (var i = 0; i < geo.vertices.length; i++) {
                    colors.push(new THREE.Color("rgb(255, 255, 255)"))
                }
                geo.colors = colors;
                geo.center();
                geo.normalize();

                geo.scale(500, 500, 500)
                geo.rotateX(Math.PI / 4)
                geo.rotateY(-Math.PI / 8)
                geometry = geo;

                particles = new THREE.Points(geo, material);
                scene.add(particles);
            })
            //添加状态监控面板
            stats = new Stats();
            container.appendChild(stats.dom);

            //事件监听
            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener("mousewheel", onDocumentMouseWheel, false);
            document.addEventListener("DOMMouseScroll", onDocumentMouseWheel, false);
            // document.addEventListener("keydown", onDocumentKeyDown, false);
            window.addEventListener('resize', onWindowResize, false);

        }

        function onDocumentMouseWheel(e) {
            var ev = e || window.event;
            var dir = ev.wheelDelta || ev.detail;
            if (ev.preventDefault) {
                ev.preventDefault()
            } else {
                ev.returnValue = false
            }
            camera.position.z += dir;
        }

        function onWindowResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        function onDocumentMouseDown(event) {
            event.preventDefault();
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mouseup', onDocumentMouseUp, false);
            document.addEventListener('mouseout', onDocumentMouseOut, false);

            mouseX = event.pageX;
            mouseY = event.pageY;

        }

        function onDocumentMouseMove(event) {
            geometry.rotateY((event.pageX - mouseX) / 1000 * 2 * Math.PI);
            geometry.rotateX((event.pageY - mouseY) / 500 * 2 * Math.PI);

            event.preventDefault();
            mouseX = event.pageX;
            mouseY = event.pageY;
        }

        function onDocumentMouseUp(event) { //释放鼠标键  

            document.removeEventListener('mousemove', onDocumentMouseMove, false);
            document.removeEventListener('mouseup', onDocumentMouseUp, false);
            document.removeEventListener('mouseout', onDocumentMouseOut, false);
        }

        function onDocumentMouseOut(event) { //移走鼠标  

            document.removeEventListener('mousemove', onDocumentMouseMove, false);
            document.removeEventListener('mouseup', onDocumentMouseUp, false);
            document.removeEventListener('mouseout', onDocumentMouseOut, false);
        }


        function animate(time) {
            requestAnimationFrame(animate);
            render();
            stats.update();
        }

        function render() {
            geometry.rotateY(Math.PI / 200)
            // TWEEN.update();
            camera.lookAt(scene.position);
            geometry.colors.forEach(function (color) {
                color.setRGB(Math.random() * 1, Math.random() * 1, Math.random() * 1);
            });
            // geometry.verticesNeedUpdate = true;
            // geometry.colorsNeedUpdate = true;
            renderer.render(scene, camera);

        }
    </script>
</body>

</html>
```
