import * as THREE from '../lib/three.module.js';
import { OBJLoader } from '../lib/OBJLoader.js';
import { MeshSurfaceSampler } from '../lib/MeshSurfaceSampler.js';
import * as dat from '../lib/dat.gui.module.js';

// import vertex from '../shader/particle_load/vertexShader.glsl'
// import fragment from '../shader/particle_load/fragmentShader.glsl'

var canvas, renderer, camera, scene;
var effect, controls;
var sphere;
var sphereChain = []

var gui, controls;

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
    gui = new dat.GUI();
    controls = new function(){
      this.levelNum = 20;
    }
    gui.add(controls, 'levelNum', 0, 20).step(1);
}

function createSampleGeometry(mesh, particleNum){
  const sampler = new MeshSurfaceSampler(mesh).build()
  var particleGeometry = new THREE.BufferGeometry()
  const particlePosition = new Float32Array(particleNum * 3)
  const particleRandomness = new Float32Array(particleNum*3)

  for (let i = 0; i < particleNum; i++){
      const newPosition = new THREE.Vector3()
      sampler.sample(newPosition)
      particlePosition.set([
          newPosition.x,
          newPosition.y,
          newPosition.z
      ], i*3)

      particleRandomness.set([
          Math.random()*2-1,
          Math.random()*2-1,
          Math.random()*2-1
      ], i*3)
  }
  particleGeometry.setAttribute( 
    'position', 
    new THREE.BufferAttribute( particlePosition, 3 ) 
  );
  particleGeometry.setAttribute( 
    'aRandom', 
    new THREE.BufferAttribute( particleRandomness, 3 ) 
);

  return particleGeometry;
}


function createSceneContent(){
  
  const material = new THREE.PointsMaterial( { 
    color: 0x888888, 
    size: 0.01
  } );

//   const particalMaterial = new THREE.ShaderMaterial( {
//     uniforms: {
//         // uColor1: {value: new THREE.Color(this.color1)},
//         // uColor2: {value: new THREE.Color(this.color2)},
//         uTime: {value: 0},
//         // uSize: {value: 6.0},
//         // uScale: {value: 0}
//     },
//     vertexShader: vertex,
//     fragmentShader: fragment

// } );


  let levelNum = 20;
  
  for (let i = 0; i < levelNum; i++){
    //const geometry = new THREE.SphereBufferGeometry()
    const tempSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(500*Math.sin(i), 20, 20),
      new THREE.MeshPhongMaterial({flatShading: true}));
    const pointGeometry = createSampleGeometry(tempSphere, 10000);
    
    var pointSphere = new THREE.Points(pointGeometry, material)
    sphereChain.push(pointSphere);
  }

  for (let i = 0; i < sphereChain.length; i++){
    console.log(sphereChain[i].geometry)
    scene.add(sphereChain[i])
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

  //createOthers();

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

  camera.position.x += (mouseX - camera.position.x)*0.05;
  camera.position.y += (-mouseY - camera.position.y)*0.05;
  camera.lookAt(scene.position);
  //effect.render(scene, camera);
  renderer.render(scene, camera);
}

function animate(timer){
  console.log(controls.levelNum + " " + scene.children.length)
  if (controls.levelNum-1 > scene.children.length-2){
    // for (let i = scene.children.length; i < controls.levelNum; i++){
    //   //scene.children[i].visible = true;
    //   scene.add(sphereChain[i]);
    // }
  } else if (controls.levelNum-1 < scene.children.length-3){
    for (let i = scene.children.length; i > controls.levelNum; i++){
      scene.remove(scene.children[i]); 
    }
  }
  // sphere.position.y = Math.abs(Math.sin(timer*0.002))*150;
  // sphere.rotation.x = timer*0.03;
  // sphere.rotation.z = timer*0.02;

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