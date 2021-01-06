import * as THREE from '../lib/three.module.js';
import Stats from '../lib/stats.module.js';
import {MarchingCubes} from '../lib/MarchingCubes.js';

var canvas, renderer, camera, scene;
var surroundlight, light1, light2;
var stats, root, geometry, material;

var effect;
var ballx, bally, ballz;
const resolution = 60;
var amount = 10, distance = 20;
var subtract = 12;
const strength = 1.2 / ( ( Math.sqrt( amount ) - 1 ) / 4 + 1 );


var mouseX = 0, mouseY = 0;


var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

const bgColor = "#111011";
const fgColor = "#ec7357";
const lightColor = "#Fbffb9"
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
  camera.position.set(windowHalfX, windowHalfY, 800);
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
  var texture = new THREE.TextureLoader().load('../texture/fiveTone.jpg');
  material = new THREE.MeshToonMaterial({color: fgColor, gradientMap: texture});
  material.shininess = 1;
  material.specular = new THREE.Color(fgColor);

  
  geometry = new THREE.SphereBufferGeometry(2, 2, 2);
  //geometry = new THREE.IcosahedronBufferGeometry(40);
  root = new THREE.Object3D();
  //root = new THREE.Mesh(geometry, material);
  root.position.x = 0;
  scene.add(root);
  for (var i = 0; i < amount; i++){
    var object = new THREE.Mesh(geometry, material);
    root.add(object);
  }
  

  //createObjectMatrix(root);
  //createObjectChain(root, 1,1);
  //createObjectChain(root, 1,-1);
  //createObjectChain(root, 2,1);
  //createObjectChain(root, 2,-1);
  //createObjectChain(root, 3,1);
  //createObjectChain(root, 3,-1);
  effect = new MarchingCubes(resolution, material, true, true);
  effect.position.set(0,0,0);
  effect.scale.set(700,700,700);
  effect.enableUvs = false;
  effect.enableColors = true;
  scene.add(effect);

  

}



function createBallMatrix(time){
  effect.reset();
  for (var i = 0; i < amount; i++){
    ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
		bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
		ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
    effect.addBall(ballx, bally, ballz, strength, subtract);
  }
}


function createObjectMatrix(parent){
  for (var i = 0; i < amount; i++){
    var object = new THREE.Mesh(geometry, material);
    object.position.x = distance;
    parent.add(object);
    parent = object;
    for (var j = 0; j < amount; j++){
      var subobject = new THREE.Mesh(geometry, material);
      subobject.position.z = j * distance;
      parent.add(subobject);
      //object = subobject;
    }
  }
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
  var timer = Date.now()*0.001;
  createBallMatrix(timer);
  animate(timer);
  
  stats.update();

  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
  if (subtract < 2) subtract += 2;
  //if (subtract > 30) subtract -= 10;
  subtract += (mouseY/100-subtract/10)*0.005;
  //subtract -= (mouseY/10-subtract/10)*0.005;
  console.log(subtract);
  //camera.position.z += (mouseY/100-camera.position.z)*0.005;
  for (var i = 0; i < amount; i++){
    var x = Math.sin(i + 1.26 * timer * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5,
        y = Math.abs( Math.cos( i + 1.12 * timer * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77, // dip into the floor
        z = Math.cos( i + 1.32 * timer * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
    root.children[i].position.set(x*700,y*700,z*700);
  }
  
  //scene.rotation.x = -Math.PI/2;
  //scene.rotation.y = Math.PI/2;

  root.position.set(x,y,z);
    var rx = Math.sin( timer * 0.3 ) * 0.1,
        ry = Math.sin( timer * 0.3 ) * 0.1,
        rz = Math.sin( timer * 0.3 ) * 0.1;
    //camera.position.x += (mouseX - camera.position.x)*0.05;
    //camera.position.z += ((mouseY-windowHalfY/2) - camera.position.y)*0.05;
    camera.lookAt(effect.position);

    /*
    root.traverse(function(object){
      object.rotation.set(rx, ry, rz);
      object.position.y = ry*100;
    })*/
    
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