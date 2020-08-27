import * as THREE from './lib/three.module.js';
import Stats from './lib/stats.module.js';

var canvas, renderer, camera, scene;
var surroundlight, light1, light2;
var stats, root, geometry, material;
var objects = [];
const amount = 400, distance = 200;


var mouseX = 0, mouseY = 0;


var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

const bgColor = "#FFCE95";
const fgColor = "#FF4C24";
const lightColor = "#FF9595"
const transColor = "#FFB84D"
const start = Date.now();

init();
render();

function createCamera(){
  camera = new THREE.PerspectiveCamera(
    70, 
    window.innerWidth/window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 500);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.0002);
}

function createLight(){
    surroundlight = new THREE.AmbientLight(fgColor, 1);
    scene.add(surroundlight);
    light1 = new THREE.PointLight(lightColor,0.1);
    light1.position.set(1000, 1000, 1000);
    scene.add(light1);
    light2 = new THREE.PointLight(lightColor, 0.5);
    light2.position.set(-1000, -1000, -1000);
    scene.add(light2);
}

function createOthers(){
  // create Controls / Effects / Stats ...
  stats = new Stats();
  //document.body.appendChild(stats.dom);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function createSceneContent(){
  geometry = new THREE.SphereBufferGeometry(40, 40, 40);
  //geometry = new THREE.IcosahedronBufferGeometry(40);
  material = new THREE.MeshPhongMaterial(fgColor);
  material.shininess = 1;
  material.specular = new THREE.Color(fgColor);

  root = new THREE.Mesh(geometry, material);
  root.position.x = 1000;
  scene.add(root);


  createObjectChain(root, 1,1);
  createObjectChain(root, 1,-1);
  createObjectChain(root, 2,1);
  createObjectChain(root, 2,-1);
  createObjectChain(root, 3,1);
  createObjectChain(root, 3,-1);

}

function createObjectChain(parent, pos, istrans){
  for (var i = 0; i < amount; i++){
    var object = new THREE.Mesh(geometry, material);
    if (pos == 1) object.position.x = istrans*distance;
    if (pos == 2) object.position.y = istrans*distance;
    if (pos == 3) object.position.z = istrans*distance;
    parent.add(object);
    parent = object;
    //objects.push(object);
  }
}

function init(){
  //canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  createCamera();
  
  createScene();
  
  createLight();
  createSceneContent();


  //document.body.appendChild(effect.domElement);
  document.body.appendChild(renderer.domElement);
  createOthers();

  window.addEventListener('resize', onWindowResize, false);
}

function render(){
  requestAnimationFrame(render);
  var timer = Date.now()*0.001 + 10000;

  animate(timer);
  stats.update();

  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
    var rx = Math.sin( timer * 0.3 ) * 0.1,
        ry = Math.sin( timer * 0.3 ) * 0.1,
        rz = Math.sin( timer * 0.3 ) * 0.1;
    camera.position.x += (mouseX - camera.position.x)*0.05;
    camera.position.y += (-mouseY - camera.position.y)*0.05;
    camera.lookAt(scene.position);

    root.traverse(function(object){
      object.rotation.set(rx, ry, rz);
    })

    //group.rotation.set(rx, ry, rz);

}


//----------------------------------------------------------
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  //effect.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event){
    mouseX = ( event.clientX - windowHalfX ) * 2;
	  mouseY = ( event.clientY - windowHalfY ) * 2;
}