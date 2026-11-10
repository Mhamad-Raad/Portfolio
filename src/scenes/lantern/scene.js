// Ported from the approved draft about/lantern.html.
// The original code runs inside mount() with a scoped document, gated listeners and a pausable rAF.
import { THREE, MeshoptDecoder } from '../../engine/three.js';
import { createScope } from '../../engine/scope.js';
import { liveStars } from '../../engine/stars.js';
import { moonTexture, glowCanvas } from '../../engine/moon.js';
import { createEdge } from '../../engine/edge.js';
import { sendLetter } from '../../engine/mail.js';
import markup from './markup.html?raw';
import * as DATA from '../../data/index.js';
import './style.css';

export default async function mount(root, api) {
  root.innerHTML = DATA.fill(markup);
  const { document, addEventListener, removeEventListener, requestAnimationFrame, cancelAnimationFrame, fetch } = createScope(root, api);
  const scrollTo = () => {};
  /* ======== original ======== */

try { await Promise.race([Promise.all(['400 100px Anton','500 24px "Shippori Mincho"','800 24px "Shippori Mincho"','600 24px "JetBrains Mono"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2000))]); } catch(_) {}
const $ = s => document.querySelector(s), T = THREE;
const lerp = (a,b,t) => a + (b-a)*t, clamp = (x,a,b) => Math.min(b, Math.max(a, x));
const LOW = innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;
const rnd = (a, b) => a + Math.random()*(b - a);

// today's date in kanji numerals for the letter's closing column
{ const d = new Date(), K = n => String(n).split('').map(c => '〇一二三四五六七八九'[+c]).join(''); $('#date').textContent = `${K(d.getFullYear())}年${K(d.getMonth() + 1)}月${K(d.getDate())}日`; }

const canvas = $('#gl');
const R = new T.WebGLRenderer({ canvas, antialias:true }); R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2)); R.outputEncoding = T.sRGBEncoding;
const lin = h => new T.Color(h).convertSRGBToLinear();
const VOID = lin(0x050507);
function mk(w,h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function ctex(c){ const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = R.capabilities.getMaxAnisotropy(); return t; }
function radialTex(stops){ const [c,x] = mk(128,128); const g = x.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col]) => g.addColorStop(o,col)); x.fillStyle = g; x.fillRect(0,0,128,128); return new T.CanvasTexture(c); }
const add = { transparent:true, depthWrite:false, blending:T.AdditiveBlending };
const DOT = radialTex([[0,'#fff'],[.3,'rgba(255,255,255,.7)'],[1,'rgba(255,255,255,0)']]);
// the light around a lantern: a faint, smooth spill that fades out with no edge (no ring, no disc).
// Each frame it sits just in front of its own lantern (toward the camera), so it never slices through the walls,
// while nearer lanterns still hide it.
const HALO = radialTex(Array.from({ length:12 }, (_, k) => { const r = k/11, a = Math.exp(-r*r*5.5)*(1 - r); return [r, `rgba(255,${Math.round(160 - r*110)},${Math.round(100 - r*60)},${(a*.3).toFixed(3)})`]; }));
const WARM = radialTex([[0,'rgba(255,226,190,.95)'],[.12,'rgba(255,150,90,.55)'],[.4,'rgba(214,52,40,.14)'],[1,'rgba(150,20,30,0)']]);
function wrapLines(x, text, maxW, max){ const out = []; let line = ''; for (const w of String(text).split(/\s+/)){ if (!w) continue; const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line){ out.push(line); line = w; if (out.length >= max) break; } else line = t; } if (out.length < max && line) out.push(line); return out; }

/* ---------- the lake ---------- */
const scene = new T.Scene(); scene.background = VOID; scene.fog = new T.FogExp2(VOID.getHex(), .006);
const STARS = [];   // star fields that twinkle and turn (engine/stars.js)
{ const n = LOW ? 2500 : 5000, g = new T.BufferGeometry(), p = new Float32Array(n*3), col = new Float32Array(n*3);
  for (let k=0;k<n;k++){ const u = .02 + Math.random()*.98, a = Math.random()*Math.PI*2, s = Math.sqrt(1 - u*u), r = 300*(.7 + Math.random()*.3); p.set([Math.cos(a)*s*r, u*r, Math.sin(a)*s*r], k*3);
    const q = Math.random(), v = q < .05 ? [.9,.14,.23] : q < .16 ? [.55,.36,.96] : [.93,.92,.96], b = .25 + Math.random()*.6; col.set(v.map(z => z*b), k*3); }
  g.setAttribute('position', new T.BufferAttribute(p,3)); g.setAttribute('color', new T.BufferAttribute(col,3));
  const sky = new T.Points(g, new T.PointsMaterial({ size:1.3, map:DOT, vertexColors:true, fog:false, ...add })); scene.add(sky); STARS.push(liveStars(sky)); }
scene.add(new T.HemisphereLight(lin(0x6d6880), lin(0x050203), .5));
const MOON = moonTexture(T);                 // engine/moon.js: the shared, realistic red moon
const moonPos = new T.Vector3(0, 15, -160);
{ const m = new T.Mesh(new T.CircleGeometry(26, 96), new T.MeshBasicMaterial({ map:MOON, fog:false, color:0xb4b4b4 })); m.position.copy(moonPos); m.lookAt(0, 2, 10); scene.add(m);
  const c = new T.Sprite(new T.SpriteMaterial({ map:new T.CanvasTexture(glowCanvas('229,36,59', [[0,.16],[.45,.05],[1,0]])), ...add, fog:false })); c.scale.setScalar(115); c.position.set(0, 18, -195); scene.add(c); }
const rim = new T.DirectionalLight(0xff5060, 1.1); rim.position.copy(moonPos); scene.add(rim);
const key = new T.DirectionalLight(0xd8d4ff, .45); key.position.set(-3, 6, 10); scene.add(key);
[[-118, 15, 0x09080c, 1], [-96, 9, 0x060508, 2], [-70, 5, 0x040306, 3]].forEach(([z, h, col, sd]) => {
  const s = new T.Shape(); s.moveTo(-320, -6);
  for (let x = -320; x <= 320; x += 6){ const y = h*(.45 + .3*Math.sin(x*.021 + sd) + .18*Math.sin(x*.067 + sd*2) + .07*Math.sin(x*.19 + sd*5)); s.lineTo(x, Math.max(0, y)); }
  s.lineTo(320, -6); s.closePath();
  const m = new T.Mesh(new T.ShapeGeometry(s), new T.MeshBasicMaterial({ color:lin(col), fog:false })); m.position.z = z; scene.add(m);
});
// water: the moon's broken reflection, plus every lantern's own broken streak and warm pool
const NL = 16;
const water = new T.Mesh(new T.PlaneGeometry(700, 700), new T.ShaderMaterial({
  uniforms:{ time:{ value:0 }, camPos:{ value:new T.Vector3() }, voidCol:{ value:VOID }, moonCol:{ value:new T.Color(.55, .03, .06) }, wind:{ value:0 }, lp:{ value:Array.from({ length:NL }, () => new T.Vector4(0, 999, 0, 0)) } },
  vertexShader:'varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }',
  fragmentShader:`uniform float time, wind; uniform vec3 camPos, voidCol, moonCol; uniform vec4 lp[${NL}]; varying vec3 vW;
    float h(vec2 p){ return sin(p.x*1.7 + time*.7 + wind)*.5 + sin(p.y*2.3 - time*.9 + p.x*.6)*.5 + sin((p.x + p.y)*3.7 + time*1.4)*.25; }
    void main(){
      vec2 p = vW.xz; float z = -p.y;
      float rip = h(p*vec2(1., 2.2));
      float w = .7 + max(z, 0.)*.11;
      float xs = (p.x + rip*.22*(1. + z*.03))/w;
      float s = exp(-xs*xs);
      float bands = smoothstep(.15, .95, sin(p.y*2.4 + rip*2.4 + time*.5)*.5 + .5);
      s *= mix(.18, 1., bands)*smoothstep(-8., 40., z);
      vec3 col = vec3(.005, .004, .009) + moonCol*s*.85;
      col += vec3(.008, .005, .016)*smoothstep(.6, 1., rip*.5 + .5);
      vec3 warm = vec3(1., .42, .2);
      for (int i = 0; i < ${NL}; i++){
        vec4 L = lp[i]; if (L.z <= 0.001) continue;
        vec2 d = p - L.xy; float r = length(d);
        float pool = exp(-r*r*1.1);
        float dz = d.y; float streak = exp(-pow(d.x + rip*.08*abs(dz), 2.)*7.)*exp(-dz*dz*(dz > 0. ? .05 : 1.6));
        pool *= mix(.35, 1., bands)*(.75 + rip*.25);
        col += warm*L.z*(pool*.5 + streak*.45*mix(.35, 1., bands));
      }
      col = mix(col, voidCol, smoothstep(80., 190., length(vW - camPos)));
      gl_FragColor = vec4(col, 1.);
      #include <encodings_fragment>
    }` }));
water.rotation.x = -Math.PI/2; scene.add(water);
const LP = water.material.uniforms.lp.value;
// red maple leaves
const leafS = new T.Shape(); { const pts = 10; for (let i=0;i<=pts*2;i++){ const a = i/(pts*2)*Math.PI*2 - Math.PI/2, r = i%2 ? .45 : (i%4 === 0 ? 1 : .85); const x = Math.cos(a)*r*.12, y = Math.sin(a)*r*.12 + .02; i ? leafS.lineTo(x, y) : leafS.moveTo(x, y); } }
const LN = LOW ? 40 : 80;
const leaves = new T.InstancedMesh(new T.ShapeGeometry(leafS), new T.MeshStandardMaterial({ color:lin(0x6e0d1c), emissive:lin(0x1a0205), roughness:.85, side:T.DoubleSide }), LN); scene.add(leaves);
const LD = Array.from({ length:LN }, () => ({ p:new T.Vector3((Math.random()-.5)*18, Math.random()*9, 6 - Math.random()*40), r:new T.Euler(Math.random()*7, Math.random()*7, 0), s:.35 + Math.random()*.35, fall:.35 + Math.random()*.4, float:0, ph:Math.random()*7 }));
const dm = new T.Object3D();
function leafStep(dt, t, wind){ LD.forEach((L, i) => {
  if (L.float <= 0){ L.p.y -= L.fall*dt; L.p.x += (Math.sin(t*.8 + L.ph)*.35 + wind*.6)*dt; L.r.x += dt*1.3; L.r.y += dt*.9; if (L.p.y <= .02){ L.p.y = .02; L.float = 10 + Math.random()*8; L.r.set(-Math.PI/2, 0, Math.random()*7); } }
  else { L.float -= dt; L.p.x += (.08 + wind*.2)*dt; L.p.y = .02 + Math.sin(t*1.4 + L.p.z)*.015; if (L.float <= 0){ L.p.set((Math.random()-.5)*18, 9, 6 - Math.random()*40); L.r.set(Math.random()*7, Math.random()*7, 0); } }
  dm.position.copy(L.p); dm.rotation.copy(L.r); dm.scale.setScalar(L.s); dm.updateMatrix(); leaves.setMatrixAt(i, dm.matrix); });
  leaves.instanceMatrix.needsUpdate = true; }

/* ---------- lanterns ---------- */
/* ---------- lanterns ----------
   Washi paper lit by a candle from inside: a hot spot low in the middle fading to deep red at the top and corners,
   long paper fibres and soft creases, the candle's shadow showing through, a wooden frame. The visitor's words are
   written in ink on the front paper. Side panels carry a shoji (kumiko) lattice. */
function paperDraw(x, d, W, H, side = false){
  let s = 7; const r = () => (s = (s*16807) % 2147483647) / 2147483647;
  x.fillStyle = '#4e1208'; x.fillRect(0,0,W,H);
  const g = x.createRadialGradient(W/2, H*.78, W*.015, W/2, H*.6, W*.82);
  g.addColorStop(0,'#fff4da'); g.addColorStop(.1,'#ffd89a'); g.addColorStop(.32,'#f39446'); g.addColorStop(.62,'#c24a22'); g.addColorStop(1,'#561309');
  x.fillStyle = g; x.fillRect(0,0,W,H);
  // the candle standing behind the paper: a faint darker stem under the bright core
  const cg = x.createLinearGradient(0, H*.84, 0, H); cg.addColorStop(0,'rgba(110,35,10,0)'); cg.addColorStop(.25,'rgba(110,35,10,.22)'); cg.addColorStop(1,'rgba(90,25,8,.28)');
  x.fillStyle = cg; x.fillRect(W*.465, H*.84, W*.07, H*.16);
  // washi fibres: long, thin, slightly curved strands, some lighter, some darker
  for (let k = 0; k < W*1.1; k++){
    const x0 = r()*W, y0 = r()*H, len = W*(.03 + r()*r()*.2), a = r()*Math.PI*2, bend = (r() - .5)*len*.5;
    const x1 = x0 + Math.cos(a)*len, y1 = y0 + Math.sin(a)*len;
    x.strokeStyle = r() < .55 ? `rgba(255,236,205,${.035 + r()*.07})` : `rgba(100,32,12,${.03 + r()*.05})`;
    x.lineWidth = (.4 + r()*1.1)*W/512;
    x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo((x0 + x1)/2 + bend, (y0 + y1)/2 - bend, x1, y1); x.stroke();
  }
  // a few soft creases
  for (let k = 0; k < 4; k++){
    const y0 = r()*H, y1 = y0 + (r() - .5)*H*.5, lg = x.createLinearGradient(0, y0, 0, y0 + 6);
    x.lineWidth = W*.006; x.strokeStyle = `rgba(255,230,200,${.05 + r()*.05})`;
    x.beginPath(); x.moveTo(0, y0); x.bezierCurveTo(W*.3, y0 + (r() - .5)*40, W*.7, y1 + (r() - .5)*40, W, y1); x.stroke();
  }
  // the paper is darker where it meets the frame
  const vg = x.createRadialGradient(W/2, H*.58, W*.3, W/2, H*.55, W*.78); vg.addColorStop(0,'rgba(40,8,4,0)'); vg.addColorStop(1,'rgba(40,8,4,.45)');
  x.fillStyle = vg; x.fillRect(0,0,W,H);
  if (side){
    // shoji lattice: thin wooden kumiko bars with their shadow on the paper
    const bar = (x0, y0, w, h) => { x.fillStyle = 'rgba(20,7,4,.35)'; x.fillRect(x0 + W*.006, y0 + W*.006, w, h); x.fillStyle = '#22110a'; x.fillRect(x0, y0, w, h); };
    const t = W*.022;
    [1/3, 2/3].forEach(f => bar(W*f - t/2, 0, t, H));
    [.27, .54, .8].forEach(f => bar(0, H*f - t/2, W, t));
  }
  if (d){
    x.fillStyle = 'rgba(32,8,5,.9)'; x.textAlign = 'center';
    x.font = `500 ${W*.07}px "Shippori Mincho", serif`;
    wrapLines(x, d.message || '', W*.74, 7).forEach((l, i) => x.fillText(l, W/2, H*.2 + i*W*.09));
    if (d.name){ x.font = `700 ${W*.065}px "Shippori Mincho", serif`; x.fillText('— ' + d.name, W/2, H*.88); }
  }
  x.lineWidth = W*.05; x.strokeStyle = '#1a0a06'; x.strokeRect(0,0,W,H);
}
const SIDE = (() => { const [c,x] = mk(256,256); paperDraw(x, null, 256, 256, true); return ctex(c); })();
// looking down into the open top: the glowing inside of the paper walls and the candle's flame
const INSIDE = (() => { const [c,x] = mk(256,256);
  const g = x.createRadialGradient(128,128,4,128,128,150); g.addColorStop(0,'#ffe6b0'); g.addColorStop(.18,'#ff9a4a'); g.addColorStop(.55,'#a93418'); g.addColorStop(1,'#3a0c06');
  x.fillStyle = g; x.fillRect(0,0,256,256);
  const f = x.createRadialGradient(128,132,0,128,132,18); f.addColorStop(0,'rgba(255,255,240,1)'); f.addColorStop(.5,'rgba(255,210,140,.8)'); f.addColorStop(1,'rgba(255,150,60,0)');
  x.fillStyle = f; x.beginPath(); x.ellipse(128,132,12,18,0,0,7); x.fill();
  return ctex(c); })();
// lacquered wood with a visible grain
const WOODTEX = (() => { const [c,x] = mk(128,512); x.fillStyle = '#2a170e'; x.fillRect(0,0,128,512);
  let s = 3; const r = () => (s = (s*16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 90; k++){ const x0 = r()*128, w = .5 + r()*2.5; x.strokeStyle = r() < .5 ? `rgba(70,40,24,${.25 + r()*.3})` : `rgba(12,6,3,${.25 + r()*.35})`; x.lineWidth = w;
    x.beginPath(); x.moveTo(x0, 0); for (let y = 0; y <= 512; y += 32) x.lineTo(x0 + Math.sin(y*.012 + k)*3*r(), y); x.stroke(); }
  const t = ctex(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t; })();
const WOOD = new T.MeshStandardMaterial({ map:WOODTEX, color:0xffffff, roughness:.72, metalness:0 });
const GEO = { box:new T.BoxGeometry(.62, .66, .62), base:new T.BoxGeometry(.86, .08, .86), rim:new T.BoxGeometry(.7, .045, .05), post:new T.BoxGeometry(.05, .74, .05) };
const TOPMAT = new T.MeshBasicMaterial({ map:INSIDE, color:new T.Color(1,1,1) });
const FLAME = radialTex([[0,'rgba(255,255,235,1)'],[.25,'rgba(255,215,140,.85)'],[.6,'rgba(255,140,60,.25)'],[1,'rgba(255,120,40,0)']]);
function makeLantern(scale, writable){
  const g = new T.Group();
  let ftex = null, fx = null; if (writable){ const [fc, x] = mk(512, 512); paperDraw(x, null, 512, 512); ftex = ctex(fc); fx = x; }
  const front = new T.MeshBasicMaterial({ map:writable ? ftex : SIDE, color:new T.Color(1,1,1) }), side = writable ? new T.MeshBasicMaterial({ map:SIDE, color:new T.Color(1,1,1) }) : front;
  const inside = TOPMAT.clone();                                         // each lantern's inside glows with its own candle
  const box = new T.Mesh(GEO.box, [side, side, inside, WOOD, front, side]); box.position.y = .41; g.add(box);
  const base = new T.Mesh(GEO.base, WOOD); base.position.y = .04; g.add(base);
  // an open top: a thin wooden rim around the opening instead of a solid lid
  [0, 1, 2, 3].forEach(k => { const b = new T.Mesh(GEO.rim, WOOD); const a = k*Math.PI/2; b.position.set(Math.sin(a)*.325, .76, Math.cos(a)*.325); b.rotation.y = a; g.add(b); });
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a, b]) => { const p = new T.Mesh(GEO.post, WOOD); p.position.set(a*.315, .41, b*.315); g.add(p); });
  const flame = new T.Sprite(new T.SpriteMaterial({ map:FLAME, ...add, opacity:0 })); flame.position.y = .62; flame.scale.set(.09, .16, 1); g.add(flame);
  const glow = new T.Sprite(new T.SpriteMaterial({ map:HALO, ...add, opacity:0 })); glow.position.y = .41; glow.scale.setScalar(1.7); g.add(glow);
  g.scale.setScalar(scale); scene.add(g);
  return { g, front, side, inside, flame, glow, ftex, fx, ph:Math.random()*7, lit:0, fade:1, vx:0, vz:0 };
}
// keep a lantern's halo between it and the camera (local space, so spin and tilt don't matter)
const _v = new T.Vector3();
function faceHalo(L, cam){ L.g.updateMatrixWorld(); _v.copy(cam.position); L.g.worldToLocal(_v); _v.y -= .41; _v.normalize().multiplyScalar(.6); L.glow.position.set(_v.x, .41 + _v.y, _v.z); }
// candle flicker: slow sways plus a fast shiver, each lantern its own
// kept gentle: a candle behind paper breathes, it does not strobe
const flick = (t, ph) => .9 + Math.sin(t*1.3 + ph)*.035 + Math.sin(t*2.9 + ph*2)*.025 + Math.sin(t*7.1 + ph*3)*.012;
// the current: a slow flow field that bends every path differently, plus a wind that comes and goes
const flow = (x, z, t) => Math.sin(z*.045 + t*.08) *.32 + Math.sin(x*.11 - z*.02 + t*.05)*.18;
let wind = 0;
const FAR = LOW ? 8 : 15;
// half the width of the view at depth z (the camera sits at z = 10), so lanterns can come and go out of sight
const CAMZ = 10, view = { fov:42, aspect:innerWidth/innerHeight };
view.fov = view.aspect < .8 ? 60 : 42;
const halfW = z => Math.tan(view.fov*Math.PI/360)*(CAMZ - z)*view.aspect;
const far = Array.from({ length:FAR }, () => {
  const L = makeLantern(1, false); L.lit = 1;
  // every lantern is already burning: it floats in from beyond the edge of the view (or sits somewhere on the lake at the start)
  L.spawn = (first) => {
    L.scale = rnd(.62, 1.05); L.g.scale.setScalar(L.scale);
    L.speed = rnd(.16, .5); L.spin = rnd(-.12, .12); L.bright = rnd(.75, 1); L.ph = Math.random()*7; L.ring = Math.random()*7;
    const z = -(Math.random() < .45 ? rnd(5, 28) : rnd(28, 85));
    if (first){ L.g.position.set(rnd(-.9, .9)*halfW(z), 0, z); L.drift = rnd(-.25, .25); }
    else { const s = Math.random() < .5 ? -1 : 1; L.g.position.set(s*(halfW(z) + 1.5), 0, z); L.drift = -s*rnd(.3, .55); }   // carried in from the side
    L.vx = L.drift; L.vz = -L.speed*.7; L.fade = 1;
    L.g.rotation.y = rnd(-.6, .6);
  };
  L.spawn(true); return L;
});

// yours, on the shallows, waiting for words
const HOME = new T.Vector3(1.4, 0, 4.9);
let mine = makeLantern(1.15, true); mine.g.position.copy(HOME); mine.g.rotation.y = -.35;
const light = new T.PointLight(0xff6a3a, 0, 6, 2); scene.add(light);
let typing = 0, sendT = -1, draft = { name:'', message:'', email:'' }, dirty = true;
function writeOn(){ paperDraw(mine.fx, draft, 512, 512); mine.ftex.needsUpdate = true; }

/* ---------- camera + render ---------- */
const cam = new T.PerspectiveCamera(42, 1, .05, 800);
const composer = new T.EffectComposer(R); composer.addPass(new T.RenderPass(scene, cam));
composer.addPass(new T.UnrealBloomPass(new T.Vector2(innerWidth*(LOW ? .5 : 1), innerHeight*(LOW ? .5 : 1)), .4, .45, .72));
function resize(){ R.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.fov = cam.aspect < .8 ? 60 : 42; cam.updateProjectionMatrix(); view.fov = cam.fov; view.aspect = cam.aspect; }
addEventListener('resize', resize); resize();
const ptrS = { x:0, y:0 }, ptrT = { x:0, y:0 };
addEventListener('pointermove', e => { ptrT.x = e.clientX/innerWidth*2 - 1; ptrT.y = -(e.clientY/innerHeight)*2 + 1; });

/* ---------- the letter ---------- */
const form = $('#form'), scroll = $('#scroll'), sent = $('#sent');
function sync(){ form.querySelectorAll('[data-k]').forEach(el => draft[el.dataset.k] = el.value.trim()); dirty = true; }
form.querySelectorAll('[data-k]').forEach(el => { el.addEventListener('input', () => { sync(); typing = 1; }); el.addEventListener('focus', () => typing = Math.max(typing, .5)); });
const note = form.querySelector('.note'), NOTE = note.textContent;
form.addEventListener('submit', e => {
  e.preventDefault(); if (sendT >= 0) return;
  sync();
  // a real letter needs words and somewhere to write back to
  const missing = [];
  if (draft.message.length < 2) missing.push($('#m'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) missing.push($('#e'));
  form.querySelectorAll('.miss').forEach(el => el.classList.remove('miss'));
  if (missing.length){
    missing.forEach(el => el.classList.add('miss')); missing[0].focus();
    note.textContent = missing[0].id === 'm' ? 'The lantern needs a few words before it can float' : 'Add an address so I can write back';
    note.classList.add('warn'); return;
  }
  note.textContent = NOTE; note.classList.remove('warn');
  if (!draft.name) draft.name = 'A visitor';
  const p = $('#sent p'); p.textContent = 'The current is carrying it to me…';
  sendLetter({ name: draft.name, email: draft.email, message: draft.message })
    .then(() => { p.textContent = 'It reached me. I usually reply within a couple of days.'; })
    .catch(err => { console.error(err); p.innerHTML = `The current turned it back, so it did not reach me. Please try again, or message me on <a href="${DATA.LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>.`; });
  writeOn(); dirty = false; sendT = 0;
  setOpen(false); scroll.classList.add('away');                      // the scroll rolls itself up
});
$('#again').addEventListener('click', () => {
  form.querySelectorAll('[data-k]').forEach(el => el.value = ''); sync();
  sendT = -1; sent.classList.remove('on'); scroll.classList.remove('away');
  if (mine.g.position.distanceTo(HOME) > .5){ scene.remove(mine.g); mine = makeLantern(1.15, true); }
  mine.g.position.copy(HOME).setY(-.6); mine.g.rotation.set(0, -.35, 0); mine.lit = 0; dirty = true;
  setTimeout(() => setOpen(true), 400);
});
form.querySelectorAll('[data-k]').forEach(el => el.addEventListener('input', () => el.classList.remove('miss')));
// the lake is the last place; scrolling up walks back to the dojo (but not while writing)
const edge = createEdge(api), atStart = () => !document.activeElement || !document.activeElement.closest || !document.activeElement.closest('form'), never = () => false;
addEventListener('wheel', e => { if (e.target.closest && e.target.closest('textarea')) return; edge.wheel(e, atStart, never); }, { passive:true });
addEventListener('touchstart', e => edge.touchstart(e), { passive:true });
addEventListener('touchend', e => { if (e.target.closest && e.target.closest('form')) return; edge.touchend(e, atStart, never); }, { passive:true });
addEventListener('keydown', e => { if (edge.key(e, atStart, never)) e.preventDefault(); });

const clock = new T.Clock();
const ld = $('#loader'); ld.style.opacity = 0; setTimeout(() => ld.remove(), 750);
// the scroll starts rolled up so the lake and the lanterns have the stage; the visitor unrolls it to write
const unroll = $('#unroll'), roll = scroll.querySelector('.roll');
// animate the roll between 0 and the paper's measured height; once open it lets go (auto) so the paper can still grow
function setRoll(on){
  roll.style.height = roll.getBoundingClientRect().height + 'px';
  void roll.offsetHeight;
  roll.style.height = (on ? roll.firstElementChild.scrollHeight : 0) + 'px';
}
roll.addEventListener('transitionend', e => { if (e.target === roll && e.propertyName === 'height' && scroll.classList.contains('open')) roll.style.height = 'auto'; });
function setOpen(on, focus = true){
  if (on !== scroll.classList.contains('open')) setRoll(on);
  scroll.classList.toggle('open', on); unroll.setAttribute('aria-expanded', on);
  if (on && focus) setTimeout(() => $('#m').focus({ preventScroll:true }), 900);
  if (!on && scroll.contains(document.activeElement)) document.activeElement.blur();
}
unroll.addEventListener('click', () => setOpen(true));
$('#rollup').addEventListener('click', () => setOpen(false));
// a tap on the lake rolls it back up (the draft stays, on the paper and on your lantern)
let downAt = null;
canvas.addEventListener('pointerdown', e => { downAt = { x:e.clientX, y:e.clientY }; });
canvas.addEventListener('pointerup', e => { if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 10 && scroll.classList.contains('open') && sendT < 0) setOpen(false); downAt = null; });
addEventListener('keydown', e => { if (e.key === 'Escape' && scroll.classList.contains('open')) setOpen(false); });
let redrawT = 0;
(function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  STARS.forEach(f => f(t));
  ptrS.x = lerp(ptrS.x, ptrT.x, .04); ptrS.y = lerp(ptrS.y, ptrT.y, .04);
  cam.position.set(ptrS.x*.5, 1.45 + ptrS.y*.2, 10); cam.lookAt(0, 3.6, -60);
  // wind comes and goes in gusts
  wind = Math.sin(t*.11)*.55 + Math.sin(t*.047 + 1.3)*.35 + Math.max(0, Math.sin(t*.031 + 2))*Math.sin(t*.9)*.25;
  water.material.uniforms.time.value = t; water.material.uniforms.wind.value = wind; water.material.uniforms.camPos.value.copy(cam.position);
  leafStep(dt, t, wind);
  // everyone else's lanterns: each on its own path, speed, spin and bob; new ones set adrift nearby, old ones fade into the distance
  far.forEach((L, i) => {
    const p = L.g.position;
    const tvx = flow(p.x, p.z, t + L.ph)*(.45 + L.speed*.6) + wind*.14 + L.drift, tvz = -L.speed*(.7 + .3*Math.sin(t*.17 + L.ph*2));
    L.vx = lerp(L.vx, tvx, dt*.6); L.vz = lerp(L.vz, tvz, dt*.6);
    p.x += L.vx*dt; p.z += L.vz*dt;
    p.y = Math.sin(t*1.1 + L.ph)*.03 + Math.sin(t*2.3 + L.ph*2)*.012;
    L.g.rotation.y += (L.spin + wind*.04)*dt; L.g.rotation.z = Math.sin(t*.9 + L.ph)*.04 + wind*.03; L.g.rotation.x = Math.sin(t*.7 + L.ph)*.03;
    // far away the candle slowly burns down into the mist; off the sides it is out of sight, so it can be set adrift again
    L.fade = clamp((p.z + 122)/34, 0, 1);
    if (L.fade <= 0 || Math.abs(p.x) > halfW(p.z) + 2.5) L.spawn(false);
    const f = flick(t, L.ph)*L.bright*L.fade, v = .04 + L.lit*.86*f;
    L.front.color.setScalar(v); L.inside.color.setScalar(.06 + .94*f); faceHalo(L, cam); L.glow.material.opacity = L.lit*.6*f;                                   // far away the flame is hidden: only the paper and its spill glow
    LP[i + 1].set(p.x, p.z, L.lit*f*.42*Math.min(1, L.scale), L.ring);
  });
  for (let i = far.length + 1; i < NL; i++) LP[i].z = 0;
  // yours: your words appear as you write
  redrawT -= dt; if (dirty && redrawT <= 0 && sendT < 0){ writeOn(); dirty = false; redrawT = .08; }
  typing = Math.max(0, typing - dt*.4);
  const g = mine.g, f = flick(t, 1.3);
  mine.lit = lerp(mine.lit, sendT < 0 ? .2 + typing*.18 : 1, sendT < 0 ? .06 : .03);
  if (sendT < 0){ g.position.y = lerp(g.position.y, Math.sin(t*1.2)*.03, .05); g.rotation.y = -.35 + Math.sin(t*.4)*.05; }
  else {
    sendT += dt; const p = g.position;
    if (sendT > 1.6){                                                                     // pushed off: it joins the current
      const sp = Math.min(.9, (sendT - 1.6)*.25);
      mine.vx = lerp(mine.vx, flow(p.x, p.z, t)*.5 + wind*.12 - p.x*.09, dt*.5); mine.vz = lerp(mine.vz, -sp, dt*.8);
      p.x += mine.vx*dt; p.z += mine.vz*dt; g.rotation.y += (.05 + wind*.04)*dt;
    }
    p.y = Math.sin(t*1.2)*.035 + Math.sin(t*2.5)*.012; g.rotation.z = Math.sin(t*1.1)*.03 + wind*.03;
    if (sendT > 2.4) sent.classList.add('on');
    if (p.z < -118){ scene.remove(g); mine = makeLantern(1.15, true); mine.g.position.copy(HOME).setZ(40); }
  }
  const v = .12 + mine.lit*.95*f;
  mine.front.color.setScalar(v); mine.side.color.setScalar(v); faceHalo(mine, cam); mine.glow.material.opacity = mine.lit*mine.lit*.8*f;   // dim until it is really burning
  mine.inside.color.setScalar(.15 + mine.lit*.95*f); mine.flame.material.opacity = mine.lit*f; mine.flame.scale.set(.09, .15 + (f - .9)*.35, 1);
  light.position.set(g.position.x, g.position.y + .7, g.position.z); light.intensity = mine.lit*2.4*f;
  LP[0].set(g.position.x, g.position.z, mine.lit*.62*f, 0);
  composer.render();
})();

  /* ======== /original ======== */
}
