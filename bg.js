// bg.js - animated background (particles + moving lights) on bgCanvas
import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const canvas = document.getElementById('bgCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 1, 1000);
camera.position.z = 100;

const particleCount = 800;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
for(let i=0;i<particleCount;i++){
  positions[i*3+0] = (Math.random()-0.5)*400;
  positions[i*3+1] = (Math.random()-0.5)*400;
  positions[i*3+2] = (Math.random()-0.5)*200;
  const c = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
  colors[i*3+0] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({ size: 3.5, vertexColors: true, transparent: true, opacity: 0.85 });
const points = new THREE.Points(geometry, mat);
scene.add(points);

function resize(){ renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize);

let t = 0;
function animate(){
  t += 0.01;
  const pos = geometry.attributes.position.array;
  for(let i=0;i<particleCount;i++){
    pos[i*3+1] += Math.sin(t + i) * 0.15;
    pos[i*3+0] += Math.cos(t*0.7 + i) * 0.1;
    if(pos[i*3+1] > 250) pos[i*3+1] = -250;
  }
  geometry.attributes.position.needsUpdate = true;
  points.rotation.y = t*0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
