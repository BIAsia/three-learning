import * as THREE from '../lib/three.module.js';
import { OBJLoader } from '../lib/OBJLoader.js';

var canvas, renderer, camera, scene;
var effect, controls, loader;
var object, sphere, manager, group, circle;
var texture, textureLoader;

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
    25, 
    window.innerWidth/window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 200);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#9DC8C8');
    scene.fog = new THREE.FogExp2(0x9DC8C8, 0.002);
    //scene.fog = new THREE.fog(0xffffff, 1, 10000);
}

function createLight(){
  const light1 = new THREE.PointLight(0x58C9B9);
  light1.position.set(500, 500, 500);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xD1B6E1, 0.25);
  light2.position.set(-500, -500, -500);
  scene.add(light2);

  const light3 = new THREE.AmbientLight(0x519D9E, 0.7);
  scene.add(light3);
}


function createOthers(){
    // create Controls / Effects / Stats ...
  
}

function loadModel(){
  object.traverse( function(child){
    if (child.isMesh) child.material.map = texture;
  });
  object.position.y = 0;
  scene.add(object);
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

function import_obj(){
  manager = new THREE.LoadingManager(loadModel);
  manager.onProgress = function(item, loaded, total){
    console.log(item, loaded, total);
  }

  loader = new OBJLoader(manager);
  loader.load('../model/adasdasd.obj', function(obj){
    object = obj;
  }, onProgress, onError);
}

function createSceneContent(){
  
  sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(10, 200, 200),
        new THREE.MeshPhongMaterial({flatShading: true, map: texture}));
  scene.add(sphere);

  circle = new THREE.Mesh(
    new THREE.TorusBufferGeometry(20,0.1,20,100),
    new THREE.MeshStandardMaterial({roughness:0, metalness:0, emissive:0x9DC8C8, opacity:0.4, transparent:true})
  );
  //scene.add(circle);
  
  
  group = new THREE.Group();
  for (var i = 20; i < 200; i+=20){
    object = new THREE.Points(
      new THREE.TorusBufferGeometry(i,0.3,1,i*2),
      new THREE.PointsMaterial({color:0xffffff, size:(Math.sqrt(i/20))})
    );
    object.name = i;
    group.add(object);
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

  camera.position.x += (mouseX - camera.position.x)*0.03;
  camera.position.y += (-mouseY - camera.position.y)*0.03;
  camera.lookAt(scene.position);
  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
  circle.rotation.x = -timer*0.0001;
  group.getObjectByName(20).rotation.x = timer*0.0003;
  group.getObjectByName(40).rotation.y = timer*0.0003;
  group.getObjectByName(60).rotation.z = timer*0.0003;
  group.getObjectByName(80).rotation.z = -timer*0.0001;
  group.getObjectByName(100).rotation.z = timer*0.00005;
  group.getObjectByName(120).rotation.z = -timer*0.00001;
  group.getObjectByName(140).rotation.z = timer*0.000005;
  group.getObjectByName(160).rotation.z = -timer*0.000001;
  group.getObjectByName(180).rotation.z = timer*0.0000001;

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