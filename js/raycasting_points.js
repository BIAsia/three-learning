import * as THREE from '../lib/three.module.js';

var canvas, renderer, camera, scene;
//var effect, controls;
var raycaster, mouse;

var pointclouds, spheres = [], spheresIndex = 0, intersection = null;


const threshold = 0.1, pointSize = 0.05, width = 80, length = 160;
const fgColor = "#F4ECE0";
const bgColor = "#84A2BE";

const start = Date.now();

init();
render();

function createCamera(){
  camera = new THREE.PerspectiveCamera(
    27, 
    window.innerWidth/window.innerHeight,
    1,
    3500
  );
  camera.position.set(10, 10, 10);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 2000, 3500);
}

function createLight(){
  scene.add(new THREE.AmbientLight(fgColor));

  var light1 = new THREE.PointLight(0xffffff, 0.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  var light2 = new THREE.PointLight(0xffffff, 1.25);
  light2.position.set(-1, -1, -1);
  scene.add(light2);
}


function createOthers(){
    // create Controls / Effects / Stats ...
    //stats = new Stats();
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    mouse = new THREE.Vector2();
}

function createSceneContent(){
  pointclouds = generatePointObject(fgColor, width, length);
  scene.add(pcBuffer);

  var geometry = new THREE.SphereBufferGeometry(0.1, 32,32);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  for (var i = 0; i < 40; i++){
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    spheres.push(sphere);
  }

}

function init(){
  //canvas = document.querySelector('#c');
  
  
  createCamera();
  
  createScene();
  
  createLight();
  createSceneContent();

  createOthers();

  //document.body.appendChild(effect.domElement);
  renderer = new THREE.WebGLRenderer({antialias: true});
  // antialias 反锯齿/平滑化
  renderer.setPixelRatio( window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onMouseMove, false);
}

function render(){
  requestAnimationFrame(render);
  var timer = Date.now() - start;

  // 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera( mouse, camera );

	// 计算物体和射线的焦点
	var intersects = raycaster.intersectObjects( pointclouds );

  animate(timer);

  controls.update();

  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){

  sphere.position.y = Math.abs(Math.sin(timer*0.002))*150;
  sphere.rotation.x = timer*0.03;
  sphere.rotation.z = timer*0.02;

}


//----------------------------------------------------------

function onMouseMove( event ) {
  event.preventDefault();
	// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

//------------------------------------------------------------
function generatePointCloudGeometry(color, width, length){
  var positions = new Float32Array(width*length*3);
  var colors = new Float32Array(width*length*3);

  var npoint = 0;
  for (var i = 0; i < width; i++){
    for (var j = 0; j < length; j++){
      var x = i/width;
      var y = Math.cos(x*Math.PI*4);
      var z = j/length;
      
      positions[npoint*3] = x;
      positions[npoint*3+1] = y;
      positions[npoint*3+2] = z;

      colors[npoint*3] = color.r;
      colors[npoint*3+1] = color.g;
      colors[npoint*3+2] = color.b;

      k++;
    }
  }
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingBox();

  return geometry;
}

function generatePointObject(color, width, length){
  var geometry = generatePointCloudGeometry(color, width, length);
  var material = new THREE.PointsMaterial({size:0.2});
  material.color.set(fgColor);

  return new THREE.Points(geometry, material);
}