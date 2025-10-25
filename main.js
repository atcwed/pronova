// main.js - SuperGame Vivid PNG Edition (UI moderna)
// Uses Three.js modules via unpkg
import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// UI elements
const menu = document.getElementById('menu');
const btnStart = document.getElementById('btnStart');
const btnHow = document.getElementById('btnHow');
const how = document.getElementById('how');
const ui = document.getElementById('ui');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const end = document.getElementById('end');
const endTitle = document.getElementById('endTitle');
const endMessage = document.getElementById('endMessage');
const btnRestart = document.getElementById('btnRestart');
const playerNameInput = document.getElementById('playerName');

let playerName = 'Jugador';

// Renderer & Canvas
const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07102b);
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 400);
camera.position.set(0,6,12);

// Lighting
const hemi = new THREE.HemisphereLight(0xffffff, 0x444466, 0.8); scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.6); dir.position.set(10,20,10); dir.castShadow=true; scene.add(dir);

// Load textures (PNG)
const loader = new THREE.TextureLoader();
const groundTex = loader.load('assets/ground.png'); groundTex.wrapS=groundTex.wrapT=THREE.RepeatWrapping; groundTex.repeat.set(40,40); groundTex.anisotropy=16;
const crystalTex = loader.load('assets/crystal.png');
const skyTex = loader.load('assets/sky.png');

// Ground
const groundMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.9, metalness: 0.05 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200), groundMat); ground.rotation.x = -Math.PI/2; ground.receiveShadow=true; scene.add(ground);

// Player
const player = new THREE.Mesh(new THREE.SphereGeometry(0.9,64,64), new THREE.MeshStandardMaterial({color:0x42f5a1, metalness:0.5, roughness:0.12}));
player.position.set(0,1,0); player.castShadow=true; scene.add(player);

// Crystals
const crystals = []; let crystalsCollected = 0; const crystalCount = 5;
for(let i=0;i<crystalCount;i++){
  const g = new THREE.OctahedronGeometry(0.6,0);
  const m = new THREE.MeshStandardMaterial({map:crystalTex, emissive:0xa020ff, emissiveIntensity:0.6, roughness:0.1, metalness:0.2});
  const mesh = new THREE.Mesh(g,m);
  mesh.position.set((Math.random()-0.5)*30,1 + Math.random()*0.5, (Math.random()-0.5)*30);
  mesh.castShadow=true; mesh.userData.collectible=true;
  scene.add(mesh); crystals.push(mesh);
}

// Decorative boxes with vivid colors
const boxGeo = new THREE.BoxGeometry(2,2,2);
for(let i=0;i<8;i++){
  const m = new THREE.MeshStandardMaterial({color: new THREE.Color(`hsl(${Math.random()*360} 80% 60%)`), metalness:0.2, roughness:0.4});
  const box = new THREE.Mesh(boxGeo, m);
  box.position.set((Math.random()-0.5)*40,1,(Math.random()-0.5)*40);
  box.castShadow=true; scene.add(box);
}

// Sky (simple textured dome)
const skyGeo = new THREE.SphereGeometry(150,32,32);
const skyMat = new THREE.MeshBasicMaterial({map: skyTex, side: THREE.BackSide});
const sky = new THREE.Mesh(skyGeo, skyMat); sky.position.set(0,40,0); scene.add(sky);

// Controls
const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0,1,0); controls.enableDamping=true;

// Postprocessing (bloom)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.8, 0.6, 0.1));

// Resize
function resize(){ const w=innerWidth, h=innerHeight; renderer.setSize(w,h); composer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// Game state
let running = false; let startTime = 0; let elapsed = 0;

// Collision and collection
function checkCollection(){ crystals.forEach((c)=>{ if(!c.userData.collected){ const d = c.position.distanceTo(player.position); if(d < 1.6){ c.userData.collected=true; c.visible=false; crystalsCollected++; scoreEl.textContent = `Cristales: ${crystalsCollected} / ${crystalCount}`; } } }); if(crystalsCollected>=crystalCount) endGame(true); }

// UI handlers
btnHow.addEventListener('click', ()=>{ how.classList.toggle('hidden'); });
btnStart.addEventListener('click', ()=>{ const name = playerNameInput.value.trim(); if(name) playerName = name; startGame(); });
btnRestart.addEventListener('click', ()=>{ resetGame(); startGame(); });

function startGame(){ menu.classList.add('hidden'); ui.classList.remove('hidden'); end.classList.add('hidden'); running=true; startTime=performance.now(); crystalsCollected=0; scoreEl.textContent = `Cristales: 0 / ${crystalCount}`; crystals.forEach(c=>{ c.visible=true; c.userData.collected=false; }); animate(); }

function resetGame(){ running=false; elapsed=0; crystalsCollected=0; player.position.set(0,1,0); crystals.forEach(c=>{ c.visible=true; c.userData.collected=false; }); ui.classList.add('hidden'); menu.classList.remove('hidden'); end.classList.add('hidden'); }

function endGame(win){ running=false; ui.classList.add('hidden'); end.classList.remove('hidden'); endTitle.textContent = win ? `¡Felicidades, ${playerName}!` : 'Juego terminado'; endMessage.textContent = win ? `Has recolectado ${crystalCount} cristales en ${Math.round(elapsed/1000)}s.` : 'Intenta de nuevo.'; }

// Animation loop
const clock = new THREE.Clock();
function animate(){ if(!running) return; const dt = clock.getDelta(); elapsed = performance.now() - startTime; player.position.y = 1 + Math.sin(performance.now()/400)*0.06; player.rotation.y += dt*0.5; crystals.forEach((c,idx)=>{ if(c.visible){ c.rotation.y += dt*1.2; c.position.y = 1 + Math.sin(performance.now()/300 + idx)*0.12; } }); controls.update(); checkCollection(); composer.render(dt); timerEl.textContent = `Tiempo: ${Math.round(elapsed/1000)}s`; requestAnimationFrame(animate); }

// Initial safe render
try{ renderer.render(scene, camera); composer.setSize(innerWidth, innerHeight); }catch(e){ console.error('Init render failed', e); }

// Pointer interaction - move player by click on ground
const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
addEventListener('pointerdown', (ev)=>{ if(!running) return; mouse.x = (ev.clientX / innerWidth) * 2 - 1; mouse.y = -(ev.clientY / innerHeight) * 2 + 1; raycaster.setFromCamera(mouse, camera); const intersects = raycaster.intersectObject(ground); if(intersects.length){ const p = intersects[0].point; const duration = 600; const start = player.position.clone(); const end = p.clone(); end.y = 1; const startLocal = performance.now(); function moveStep(){ const t = Math.min(1, (performance.now()-startLocal)/duration); player.position.lerpVectors(start, end, t); if(t < 1) requestAnimationFrame(moveStep); } moveStep(); } });
