// Ported from the approved draft playground/torii.html.
// The original code runs inside mount() with a scoped document, gated listeners and a pausable rAF.
import { THREE, MeshoptDecoder } from '../../engine/three.js';
import { createScope } from '../../engine/scope.js';
import { esc } from '../../engine/text.js';
import { createEdge } from '../../engine/edge.js';
import markup from './markup.html?raw';
import * as DATA from '../../data/index.js';
import './style.css';

export default async function mount(root, api) {
  root.innerHTML = DATA.fill(markup);
  const { document, addEventListener, removeEventListener, requestAnimationFrame, cancelAnimationFrame, fetch } = createScope(root, api);
  const scrollTo = () => {};
  /* ======== original ======== */

try { await Promise.race([Promise.all(['400 100px Anton','600 24px "JetBrains Mono"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 1800))]); } catch(_) {}
const $ = s => document.querySelector(s), T = THREE;
const lerp = (a,b,t) => a + (b-a)*t, clamp = (x,a,b) => Math.min(b, Math.max(a, x)), ease = f => f*f*(3-2*f);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- the stack, counted from the real project list ---------- */
const GATES = DATA.GATES;
const TOTAL = DATA.TECH_TOTAL;
$('#outro h2').innerHTML = `${TOTAL} <em>technologies</em>`;
$('#hint ol').innerHTML = GATES.map(g => `<li>${g.k}</li>`).join('');
const hintLis = [...$('#hint ol').children];
const MAXC = Math.max(...GATES.flatMap(g => g.tech.map(t => t.c)));

/* ---------- renderer ---------- */
const canvas = $('#gl');
const LOW = innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;
const R = new T.WebGLRenderer({ canvas, antialias:true }); R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2)); R.outputEncoding = T.sRGBEncoding;
const ANISO = R.capabilities.getMaxAnisotropy();
const VOID = new T.Color(0x050507).convertSRGBToLinear();
// distant gates fade into the sky's own dusk colour instead of black
const DUSK = new T.Color(0x09071a).convertSRGBToLinear();
const scene = new T.Scene(); scene.background = VOID; scene.fog = new T.FogExp2(DUSK.getHex(), .022);
const cam = new T.PerspectiveCamera(50, 1, .1, 400);
function mk(w,h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function ctex(c){ const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = ANISO; return t; }
function radialTex(stops){ const [c,x] = mk(128,128); const g = x.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col]) => g.addColorStop(o,col)); x.fillStyle = g; x.fillRect(0,0,128,128); return new T.CanvasTexture(c); }
const add = { transparent:true, depthWrite:false, blending:T.AdditiveBlending };
// a smooth, dithered radial pool texture (a 128px gradient at low alpha bands into visible steps)
const POOL = (() => { const [c, x] = mk(256, 256); const g = x.createRadialGradient(128,128,0,128,128,128);
  g.addColorStop(0,'rgba(229,36,59,.42)'); g.addColorStop(.35,'rgba(229,36,59,.2)'); g.addColorStop(.7,'rgba(120,20,60,.06)'); g.addColorStop(1,'rgba(229,36,59,0)');
  x.fillStyle = g; x.fillRect(0,0,256,256);
  const d = x.getImageData(0,0,256,256); for (let k=0;k<d.data.length;k+=4){ const n = (Math.random()-.5)*3; d.data[k]+=n; d.data[k+1]+=n; d.data[k+2]+=n; } x.putImageData(d,0,0);
  return new T.CanvasTexture(c); })();
const dot = radialTex([[0,'#fff'],[.3,'rgba(255,255,255,.7)'],[1,'rgba(255,255,255,0)']]);
// the sky: deep indigo overhead, a dusky crimson glow on the horizon behind the gates, faint violet nebula wisps
const sky = new T.Mesh(new T.SphereGeometry(300, 48, 24), new T.ShaderMaterial({
  side:T.BackSide, depthWrite:false, fog:false, uniforms:{ uTime:{ value:0 } },
  vertexShader:'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader:`varying vec3 vD; uniform float uTime;
    float h(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
    float n(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
      return mix(mix(mix(h(i), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z); }
    float fbm(vec3 p){ float v = 0., a = .5; for (int k=0;k<5;k++){ v += a*n(p); p = p*2.03 + 1.7; a *= .5; } return v; }
    void main(){
      vec3 d = normalize(vD); float y = d.y;
      vec3 c = mix(vec3(.012,.010,.032), vec3(.004,.004,.011), smoothstep(-.05, .7, y));            // indigo dusk → night overhead
      float ahead = smoothstep(.2, 1., -d.z);                                                     // the way forward, behind the gates
      c += vec3(.30,.012,.03) * exp(-abs(y + .02)*9.) * (.3 + .7*ahead) * .32;                  // crimson horizon glow
      float w = fbm(d*3.2 + vec3(0., uTime*.006, 0.)), w2 = fbm(d*6.5 + 4.1);
      c += vec3(.12,.06,.34) * pow(smoothstep(.45, .85, w), 2.) * smoothstep(-.1, .5, y) * .4;     // violet nebula wisps
      c += vec3(.26,.015,.04) * pow(smoothstep(.55, .9, w2), 2.) * smoothstep(.6, .0, abs(y - .15)) * .18;
      gl_FragColor = vec4(c, 1.); }`
}));
sky.renderOrder = -10; scene.add(sky);
{ const C = LOW ? 2500 : 5500, g = new T.BufferGeometry(), p = new Float32Array(C*3), col = new Float32Array(C*3);
  for (let k=0;k<C;k++){ p[k*3] = (Math.random()-.5)*240; p[k*3+1] = (Math.random()-.3)*120; p[k*3+2] = 20 - Math.random()*220; const q = Math.random(), v = q < .06 ? [.9,.14,.23] : q < .18 ? [.55,.36,.96] : [.93,.92,.96], b = .3 + Math.random()*.6; col.set(v.map(z => z*b), k*3); }
  g.setAttribute('position', new T.BufferAttribute(p,3)); g.setAttribute('color', new T.BufferAttribute(col,3));
  scene.add(new T.Points(g, new T.PointsMaterial({ size:.45, map:dot, vertexColors:true, ...add }))); }
scene.add(new T.HemisphereLight(0xb9b0d0, 0x120608, .5));
const key = new T.DirectionalLight(0xffffff, 1.0); key.position.set(-5, 8, 6); scene.add(key);
const lacquer = new T.MeshStandardMaterial({ color:0x0c0a0f, roughness:.4, metalness:.15 });
const rimMat = new T.MeshBasicMaterial({ color:new T.Color(.75,.04,.1), side:T.BackSide });
const cordMat = new T.MeshBasicMaterial({ color:0x8e0f22 });
const SPACE = 24;

/* ---------- one ema plaque per technology ---------- */
function plaqueTex(t){
  const [c,x] = mk(320, 220);
  // a pentagon tablet, dark wood with a crimson border
  x.fillStyle = '#17121a'; x.beginPath(); x.moveTo(20, 60); x.lineTo(160, 8); x.lineTo(300, 60); x.lineTo(300, 210); x.lineTo(20, 210); x.closePath(); x.fill();
  x.strokeStyle = '#e5243b'; x.lineWidth = 6; x.stroke();
  x.strokeStyle = 'rgba(243,241,245,.12)'; x.lineWidth = 2; x.beginPath(); x.moveTo(40, 72); x.lineTo(160, 28); x.lineTo(280, 72); x.lineTo(280, 192); x.lineTo(40, 192); x.closePath(); x.stroke();
  x.fillStyle = '#050507'; x.beginPath(); x.arc(160, 40, 7, 0, 7); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  let fs = 62; x.font = `400 ${fs}px Anton, Impact, sans-serif`; while (x.measureText(t.n.toUpperCase()).width > 240 && fs > 30){ fs -= 2; x.font = `400 ${fs}px Anton, Impact, sans-serif`; }
  x.fillStyle = '#f3f1f5'; x.fillText(t.n.toUpperCase(), 160, 118);
  x.font = '600 18px "JetBrains Mono", monospace'; x.fillStyle = '#e5243b'; x.fillText(`${t.c} PROJECT${t.c === 1 ? '' : 'S'}`, 160, 170);
  return ctex(c);
}
const plaqueGeo = new T.PlaneGeometry(2.05, 1.41);

/* ---------- gates ---------- */
function gateMesh(){
  const g = new T.Group();
  const pillarG = new T.CylinderGeometry(.42, .5, 11, 24);
  [-4.6, 4.6].forEach(x => { const p = new T.Mesh(pillarG, lacquer); p.position.set(x, -1, 0); const r = new T.Mesh(pillarG, rimMat); r.scale.set(1.06, 1, 1.06); p.add(r); g.add(p); const base = new T.Mesh(new T.CylinderGeometry(.62, .7, .7, 24), lacquer); base.position.set(x, -6.3, 0); g.add(base); });
  const kg = new T.BoxGeometry(13.4, .55, .9, 60, 1, 1); { const p = kg.attributes.position; for (let k=0;k<p.count;k++){ const x = p.getX(k); p.setY(k, p.getY(k) + Math.pow(Math.abs(x)/6.7, 2.4)*.8); } kg.computeVertexNormals(); }
  const kasagi = new T.Mesh(kg, lacquer); kasagi.position.y = 5.2; const kr = new T.Mesh(kg, rimMat); kr.scale.set(1.01, 1.18, 1.18); kasagi.add(kr); g.add(kasagi);
  const shimaki = new T.Mesh(new T.BoxGeometry(12.2, .42, .7), lacquer); shimaki.position.y = 4.6; g.add(shimaki);
  const nuki = new T.Mesh(new T.BoxGeometry(11.2, .38, .5), lacquer); nuki.position.y = 2.9; const nr = new T.Mesh(nuki.geometry, rimMat); nr.scale.set(1.01, 1.2, 1.2); nuki.add(nr); g.add(nuki);
  const plaque = new T.Mesh(new T.BoxGeometry(1.1, 1.4, .2), lacquer); plaque.position.y = 3.75; g.add(plaque);
  return g;
}
const gates = GATES.map((def, i) => {
  const g = gateMesh(); g.position.set(0, 0, -i*SPACE - 8); scene.add(g);
  const [c, x] = mk(256, 256); x.font = '800 190px "Hiragino Mincho ProN","Yu Mincho",serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e5243b'; x.shadowColor = '#e5243b'; x.shadowBlur = 18; x.fillText(def.k, 128, 140);
  const kan = new T.Sprite(new T.SpriteMaterial({ map:ctex(c), transparent:true, depthWrite:false })); kan.scale.setScalar(1.2); kan.position.set(0, 3.75, .2); g.add(kan);
  // the plaques hang under the lower beam, evenly across the opening
  const n = def.tech.length, crowd = n >= 4, ps = n > 4 ? .82 : .9;
  // outer plaque edges stay inside the pillars (inner face at x = ±4.1), with room to sway
  const span = Math.min(2*(3.7 - 1.03*ps), (n - 1)*2.3);
  const plaques = def.tech.map((t, j) => {
    const front = crowd && j%2 === 1;                 // the lower row hangs a little in front of the upper one
    const pivot = new T.Group(); pivot.position.set(n === 1 ? 0 : -span/2 + j*span/(n - 1), 2.68, front ? .62 : .2); g.add(pivot);
    const len = crowd ? (j%2 ? 1.85 : .4) : .5 + (j%2)*.28;     // two rows when a gate holds many
    const cord = new T.Mesh(new T.CylinderGeometry(.012, .012, len, 5), cordMat); cord.position.y = -len/2; pivot.add(cord);
    const mat = new T.MeshStandardMaterial({ map:plaqueTex(t), roughness:.6, metalness:.05, transparent:true, emissive:new T.Color(0xe5243b), emissiveIntensity:0, side:T.DoubleSide });
    const m = new T.Mesh(plaqueGeo, mat); m.scale.setScalar(ps); m.position.y = -len - .7*ps; pivot.add(m);
    return { pivot, m, mat, seed:Math.random()*6, lit:0 };
  });
  // the gate opening stays clear (it used to hold a faint red haze sprite that banded into a blotchy 'wall');
  // instead a soft pool of crimson light lies on the ground under the gate
  const pool = new T.Mesh(new T.PlaneGeometry(15, 8), new T.MeshBasicMaterial({ map:POOL, ...add, opacity:.55, fog:false }));
  pool.rotation.x = -Math.PI/2; pool.position.set(0, -6.45, .4); g.add(pool);
  const ring = new T.Mesh(new T.RingGeometry(.96, 1, 96), new T.MeshBasicMaterial({ color:0xe5243b, ...add, opacity:0, side:T.DoubleSide })); ring.position.set(0, -.5, 0); g.add(ring);
  // stone lanterns at the foot of each pillar
  [-6.3, 6.3].forEach(x => { const l = new T.Sprite(new T.SpriteMaterial({ map:radialTex([[0,'rgba(255,170,180,.9)'],[.25,'rgba(229,36,59,.45)'],[1,'rgba(229,36,59,0)']]), ...add })); l.scale.setScalar(1.4); l.position.set(x, -5.2, .6); g.add(l); const post = new T.Mesh(new T.BoxGeometry(.5, 1.6, .5), lacquer); post.position.set(x, -6.1, .6); g.add(post); });
  return { g, def, plaques, ring, rt:9, passed:false };
});
const lastZ = gates[gates.length - 1].g.position.z;
// the red thread through every gate
const curve = new T.CatmullRomCurve3(Array.from({ length:18 }, (_, i) => new T.Vector3(Math.sin(i*.9)*1.4, -5.3 + Math.cos(i*.7)*.25, 16 - i*9)));
scene.add(new T.Mesh(new T.TubeGeometry(curve, 500, .045, 8, false), new T.MeshBasicMaterial({ color:new T.Color(.9,.05,.13) })));
const water = new T.Mesh(new T.PlaneGeometry(260, 360), new T.MeshStandardMaterial({ color:0x07060a, roughness:.15, metalness:.9 })); water.rotation.x = -Math.PI/2; water.position.set(0, -6.65, -80); scene.add(water);
// drifting embers along the path
const EM = LOW ? 200 : 450, eg = new T.BufferGeometry(), ep = new Float32Array(EM*3); for (let k=0;k<EM;k++) ep.set([(Math.random()-.5)*26, -6 + Math.random()*14, 14 - Math.random()*(-lastZ + 30)], k*3);
eg.setAttribute('position', new T.BufferAttribute(ep, 3)); scene.add(new T.Points(eg, new T.PointsMaterial({ size:.08, map:dot, color:0xff5468, ...add })));

/* ---------- scroll ---------- */
let prog = 0, progT = 0;
const edge = createEdge(api);
const atStart = () => progT <= .001 && prog < .01, atEnd = () => progT >= .999 && prog > .99;
api.onEnter = dir => { if (dir < 0) prog = progT = 1; };
addEventListener('touchend', e => edge.touchend(e, atStart, atEnd), { passive:true });
addEventListener('wheel', e => { if (edge.wheel(e, atStart, atEnd)) return; progT = clamp(progT + e.deltaY*.0006, 0, 1); }, { passive:true });
let touchY = null; addEventListener('touchstart', e => { touchY = e.touches[0].clientY; edge.touchstart(e); }, { passive:true }); addEventListener('touchmove', e => { if (touchY == null) return; progT = clamp(progT + (touchY - e.touches[0].clientY)*.0016, 0, 1); touchY = e.touches[0].clientY; }, { passive:true });
addEventListener('keydown', e => { if (edge.key(e, atStart, atEnd)) return; if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') progT = clamp(progT + .07, 0, 1); if (e.key === 'ArrowUp' || e.key === 'PageUp') progT = clamp(progT - .07, 0, 1); });
const ptr = { nx:0, ny:0, sx:0, sy:0 }; addEventListener('pointermove', e => { ptr.nx = e.clientX/innerWidth*2 - 1; ptr.ny = -(e.clientY/innerHeight)*2 + 1; });
$('#next').addEventListener('click', e => { e.preventDefault(); api.next(); });

/* ---------- loop ---------- */
const composer = new T.EffectComposer(R);
composer.addPass(new T.RenderPass(scene, cam));
composer.addPass(new T.UnrealBloomPass(new T.Vector2(innerWidth*(LOW ? .5 : 1), innerHeight*(LOW ? .5 : 1)), .34, .4, .7));
function resize(){ R.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const capEl = $('#gate'), outro = $('#outro'), head = $('#head');
const clock = new T.Clock();
const ld = $('#loader'); ld.style.opacity = 0; setTimeout(() => ld.remove(), 650);
(function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  prog = lerp(prog, progT, 1 - Math.pow(.03, dt));
  ptr.sx = lerp(ptr.sx, ptr.nx, .05); ptr.sy = lerp(ptr.sy, ptr.ny, .05);
  const zc = lerp(14, lastZ - 14, ease(prog));
  cam.position.set(Math.sin(t*.2)*.4 + ptr.sx*.9, -2.7 + ptr.sy*.35, zc);
  cam.lookAt(ptr.sx*.4, .9, zc - 20);
  sky.position.copy(cam.position); sky.material.uniforms.uTime.value = t;
  let best = null, bd = 1e9;
  gates.forEach((G, i) => {
    const d = G.g.position.z - zc;                       // negative = gate ahead
    if (d < 0 && -d < bd){ bd = -d; best = G; }
    if (!G.passed && zc < G.g.position.z){ G.passed = true; G.rt = 0; }
    if (zc > G.g.position.z + .5) G.passed = false;
    G.rt += dt; const k = clamp(G.rt/1.2, 0, 1); G.ring.scale.setScalar(1 + k*14); G.ring.material.opacity = (1 - k)*.75;
    const near = clamp(1 - (-d - 4)/20, 0, 1) * (d < 2 ? 1 : 0);
    G.plaques.forEach((P, j) => {
      P.lit = lerp(P.lit, near, .08);
      P.pivot.rotation.z = Math.sin(t*1.3 + P.seed)*.022*(1 + P.lit*.8);      // a gentle sway that never reaches a neighbour
      P.pivot.rotation.y = Math.sin(t*.7 + P.seed)*.12;
      P.mat.emissiveIntensity = P.lit*.35 + (P.lit > .5 ? Math.max(0, Math.sin(t*3 - j*.7))*.15 : 0);
    });
    hintLis[i].classList.toggle('done', G.passed); hintLis[i].classList.toggle('on', best === G);
  });
  // caption for the gate ahead
  if (best && bd < 27){
    capEl.style.opacity = clamp((27 - bd)/7, 0, 1)*clamp((bd - 1)/2.5, 0, 1);
    if (capEl.dataset.k !== best.def.k){ const d = best.def; capEl.dataset.k = d.k;
      capEl.querySelector('.k').textContent = d.k; capEl.querySelector('small').textContent = `Gate ${gates.indexOf(best) + 1} / ${gates.length} · ${d.sub}`;
      capEl.querySelector('h2').textContent = d.name;
      capEl.querySelector('ul').innerHTML = d.tech.map(x => `<li><i style="width:${Math.round(10 + x.c/MAXC*70)}px"></i>${esc(x.n)} <span>${x.c}</span></li>`).join(''); }
  } else capEl.style.opacity = 0;
  const end = clamp((prog - .9)/.08, 0, 1);
  outro.style.opacity = end; outro.classList.toggle('on', end > .5); head.style.opacity = 1 - clamp(prog*4, 0, 1)*.7;
  for (let k=0;k<EM;k++){ ep[k*3+1] += dt*.3; if (ep[k*3+1] > 8) ep[k*3+1] = -6; } eg.attributes.position.needsUpdate = true;
  composer.render();
})();

  /* ======== /original ======== */
}
