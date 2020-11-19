import * as THREE from '../lib/three.module.js';
import * as dat from '../lib/dat.gui.module.js';
import { OBJLoader } from '../lib/OBJLoader.js';

var canvas, renderer, camera, scene;
var effect, controls, loader;
var object, sphere, manager, line, group;
var texture, textureLoader,mesh;
var gui = new dat.GUI();

var guicontrols = new function(){
  this.rotationx = 0;
  this.rotationy = 0;
  this.rotationz = 0;
};

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

const fgColor = "#F4ECE0";
const bgColor = "#84A2BE";
const start = Date.now();

init();
render();

function createCamera(){
  camera = new THREE.PerspectiveCamera(
    20, 
    window.innerWidth/window.innerHeight,
    1,
    5000
  );
  camera.position.set(0, 0, 100);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#E54B4B');
    scene.fog = new THREE.FogExp2(0xE54B4B, 0.002);
}

function createLight(){
  const light1 = new THREE.PointLight(0x2EC4B6);
  light1.position.set(500, 500, 500);
  //scene.add(light1);

  const light2 = new THREE.PointLight(0x2EC4B6, 0.25);
  light2.position.set(-500, -500, -500);
  scene.add(light2);

  const light3 = new THREE.AmbientLight(0x383A3F, 1);
  scene.add(light3);
}


function createOthers(){
    // create Controls / Effects / Stats ...
  
}

function createGUI(){
  
  gui.add(guicontrols, 'rotationx', 0, 2*Math.PI).step(0.1*Math.PI);
  gui.add(guicontrols, 'rotationy', 0, 2*Math.PI).step(0.1*Math.PI);
  gui.add(guicontrols, 'rotationz', 0, 2*Math.PI).step(0.1*Math.PI);

}

function loadModel(){
  let material = new THREE.PointsMaterial({color:0xFFFFFF, size:0.01, opacity:0.4, transparent:true});
    
    object.traverse(child=> {
      if (child.isMesh){
        mesh = new THREE.Points(child.geometry, material);
        group.add(mesh);
      }
    });
    group.position.y = 0;
    group.rotation.x = 90;
    group.rotation.y = 5;
    //mesh = new THREE.Points(obj.children[0].geometry, material);
    //mesh.position.y = -15;
    scene.add(group);
/*
  object.traverse( function(child){
    if (child.isMesh) child.material.map = texture;
    child.color = 0xffffff;
  });
  object.position.y = 0;
  object.position.x = 0;
  scene.add(object);*/
}

function onProgress( xhr ) {
  if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

  }
}
function onError() {}


function importTexture(){
  textureLoader = new THREE.TextureLoader( manager );
	texture = textureLoader.load( '../texture/kandao3_depthmap.jpg' );
}

function createSceneContent(){
  group = new THREE.Group();
  manager = new THREE.LoadingManager(loadModel);
  manager.onProgress = function(item, loaded, total){
    console.log(item, loaded, total);
  }

  loader = new OBJLoader(manager);
  line = new THREE.Group();
  
  loader.load('../model/Controller.obj', function(obj){
    object = obj;
  }, onProgress, onError);

    /*sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(10, 100, 100),
        new THREE.MeshPhongMaterial({flatShading: true, map: texture}));
    scene.add(sphere);*/
}

function init(){
  //canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  createGUI();
  createCamera();
  
  createScene();
  
  
  createLight();

  importTexture();
  createSceneContent();
  

  createOthers();
  controls = new THREE.LoadingManager(loadModel);
  

  //document.body.appendChild(effect.domElement);
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function render(){
  requestAnimationFrame(render);
  var timer = Date.now() - start;

  animate(timer);
  //controls.update();

  //camera.position.x += (mouseX - camera.position.x)*0.0003;
  //camera.position.y += (-mouseY - camera.position.y)*0.0003;
  //camera.lookAt(scene.position);
  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
  
  group.rotation.x = guicontrols.rotationx;
  group.rotation.y = guicontrols.rotationy;
  group.rotation.z = guicontrols.rotationz;
  /*
  group.rotation.x = timer*0.0001;
  group.rotation.y = timer*0.0001;
  group.rotation.z = timer*0.0001;*/

  //sphere.position.y = Math.abs(Math.sin(timer*0.002))*150;
  //sphere.rotation.x = timer*0.03;
  //sphere.rotation.z = timer*0.02;

}


//----------------------------------------------------------
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event){
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}