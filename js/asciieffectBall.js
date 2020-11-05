import * as THREE from '../lib/three.module.js';
import {AsciiEffect} from '../lib/AsciiEffect.js';
import { TrackballControls } from '../lib/TrackballControls.js';

var canvas, renderer, camera, scene, effect, controls;
var sphere;
const fgColor = "#F4ECE0";
const bgColor = "#84A2BE";
var start = Date.now();

init();
animate();

function createCamera(){
  camera = new THREE.PerspectiveCamera(
    70, 
    window.innerWidth/window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 150, 500);
}

function createEffect(){
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', {invert: true});
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color=fgColor;
  effect.domElement.style.backgroundColor=bgColor;
}


function init(){
  //canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  createCamera();
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#000000');
  
  // light
  const light1 = new THREE.PointLight(0xffffff);
  light1.position.set(500, 500, 500);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xffffff, 0.25);
  light2.position.set(-500, -500, -500);
  scene.add(light2);

  sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(200, 200, 100),
    new THREE.MeshPhongMaterial({flatShading: true}));
  scene.add(sphere);
  
  createEffect();
  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.
  
  document.body.appendChild(effect.domElement);
  controls = new TrackballControls(camera, effect.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function animate(){
  requestAnimationFrame(animate);
  render();
}
function render(){
  var timer = Date.now() - start;
  sphere.position.y = Math.abs(Math.sin(timer*0.002))*150;
  sphere.rotation.x = timer*0.03;
  sphere.rotation.z = timer*0.02;

  controls.update();

  effect.render(scene, camera);
}


//-----------------------------
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}