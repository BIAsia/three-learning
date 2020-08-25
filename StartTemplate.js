import * as THREE from './lib/three.module.js';
import {} from './lib/.js';

var canvas, renderer, camera, scene;
var effect, controls;
var light;
var sphere;
const fgColor = "#F4ECE0";
const bgColor = "#84A2BE";
const start = Date.now();

init();
render();

function createCamera(){
  camera = new THREE.PerspectiveCamera(
    70, 
    window.innerWidth/window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 150, 500);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    //scene.fog = new THREE.fog(0xffffff, 1, 10000);
}

function createLight(){
  const light1 = new THREE.PointLight(0xffffff);
  light1.position.set(500, 500, 500);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xffffff, 0.25);
  light2.position.set(-500, -500, -500);
  scene.add(light2);
}


function createOthers(){
    // create Controls / Effects / Stats ...
    stats = new Stats();
}

function createSceneContent(){
    sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(200, 200, 100),
        new THREE.MeshPhongMaterial({flatShading: true}));
      scene.add(sphere);
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

  createOthers();

  //document.body.appendChild(effect.domElement);
  document.body.appendChild(renderer.domElement);
  
  window.addEventListener('resize', onWindowResize, false);
}

function render(){
  requestAnimationFrame(render);
  var timer = Date.now() - start;

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
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}