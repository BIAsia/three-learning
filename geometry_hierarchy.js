import * as THREE from './lib/three.module.js';
import Stats from './lib/stats.module.js';

var canvas, renderer, camera, scene;
var surroundlight, light1, light2;
var stats, group;


var mouseX = 0, mouseY = 0;
const d=2000, r=1000;
var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

const fgColor = "#236FE1";
const bgColor = "#403DD3";
const lightColor = "#0DA6D7"
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
    scene.fog = new THREE.FogExp2(bgColor, 0.002);
}

function createLight(){
    surroundlight = new THREE.AmbientLight(fgColor, 1);
    scene.add(surroundlight);
    light1 = new THREE.PointLight(lightColor,0.1);
    light1.position.set(1000, 1000, 1000);
    scene.add(light1);
    light2 = new THREE.PointLight(lightColor, 0.5);
    light2.position.set(-500, -500, -500);
    //scene.add(light2);
}

function createOthers(){
  // create Controls / Effects / Stats ...
  stats = new Stats();
  //document.body.appendChild(stats.dom);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function createSceneContent(){
    var geometry = new THREE.BoxBufferGeometry(100,100,100);
    var material = new THREE.MeshPhongMaterial(fgColor);

    group = new THREE.Group();
    for (var i = 0; i < 1000; i++){
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.random()*d - r,
            Math.random()*d - r,
            Math.random()*d - r
        );
        mesh.rotation.x = Math.random()*2*Math.PI;
        mesh.rotation.y = Math.random()*2*Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
    }

    scene.add(group);
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
  var timer = Date.now()*0.001;

  animate(timer);
  stats.update();

  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
    var rx = Math.sin( timer * 0.7 ) * 0.5,
        ry = Math.sin( timer * 0.3 ) * 0.5,
        rz = Math.sin( timer * 0.2 ) * 0.5;
    camera.position.x += (mouseX - camera.position.x)*0.05;
    camera.position.y += (-mouseY - camera.position.y)*0.05;
    camera.lookAt(scene.position);

    group.rotation.set(rx, ry, rz);

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