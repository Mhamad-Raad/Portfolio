// Ported from the approved draft about/dojo.html.
// The original code runs inside mount() with a scoped document, gated listeners and a pausable rAF.
import { THREE, MeshoptDecoder } from '../../engine/three.js';
import { createScope } from '../../engine/scope.js';
import { liveStars } from '../../engine/stars.js';
import { moonTexture, glowCanvas } from '../../engine/moon.js';
import { esc } from '../../engine/text.js';
import { samuraiBytes } from '../../engine/model.js';
import { makeInkEnvironment, dressSamurai } from '../../engine/samuraiLook.js';
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
const lerp = (a,b,t) => a + (b-a)*t, clamp = (x,a,b) => Math.min(b, Math.max(a, x)), sstep = f => f*f*(3-2*f);
const KN = d => String(d).split('').map(c => '〇一二三四五六七八九'[+c]).join('');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- real content from the current site (listed oldest first, shown newest first) ---------- */
const BIO = DATA.BIO;
const ROLES = DATA.ROLES.slice();
const RECS = DATA.RECOMMENDATIONS;
ROLES.reverse();                             // newest first: the path walks back in time to where it started
const N = ROLES.length, STOPS = N + 2;       // 0 intro · 1..N lanterns · N+1 the samurai
$('#bio').textContent = BIO;



/* ---------- renderer ---------- */
const canvas = $('#gl');
const LOW = innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;
const portrait = () => innerWidth / innerHeight < .8;
const narrow = () => innerWidth <= 820;
const R = new T.WebGLRenderer({ canvas, antialias:true }); R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2)); R.outputEncoding = T.sRGBEncoding;
const lin = h => new T.Color(h).convertSRGBToLinear();
const VOID = lin(0x050507);
function mk(w,h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function radialTex(stops){ const [c,x] = mk(128,128); const g = x.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col]) => g.addColorStop(o,col)); x.fillStyle = g; x.fillRect(0,0,128,128); return new T.CanvasTexture(c); }
const add = { transparent:true, depthWrite:false, blending:T.AdditiveBlending };
const DOT = radialTex([[0,'#fff'],[.3,'rgba(255,255,255,.7)'],[1,'rgba(255,255,255,0)']]);
const GLOW = radialTex([[0,'rgba(255,190,190,.9)'],[.18,'rgba(229,36,59,.5)'],[.5,'rgba(140,12,30,.12)'],[1,'rgba(110,13,28,0)']]);
const MIST = radialTex([[0,'rgba(255,255,255,.5)'],[.5,'rgba(255,255,255,.15)'],[1,'rgba(255,255,255,0)']]);
const STONE = new T.MeshStandardMaterial({ color:lin(0x1d1b22), roughness:.95, flatShading:true });
const STONE2 = new T.MeshStandardMaterial({ color:lin(0x121116), roughness:1, flatShading:true });

const MOON = moonTexture(T);                 // engine/moon.js: the shared, realistic red moon

const STARS = [];   // star fields that twinkle and turn (engine/stars.js)
function stars(scene, n, spread){
  const g = new T.BufferGeometry(), p = new Float32Array(n*3), col = new Float32Array(n*3);
  for (let k=0;k<n;k++){ const u = Math.random()*2 - 1, a = Math.random()*Math.PI*2, r = spread*(.6 + Math.random()*.4), s = Math.sqrt(1 - u*u);
    p[k*3] = Math.cos(a)*s*r; p[k*3+1] = u*r*.7 + spread*.15; p[k*3+2] = Math.sin(a)*s*r;
    const q = Math.random(), v = q < .05 ? [.9,.14,.23] : q < .16 ? [.55,.36,.96] : [.93,.92,.96], b = .25 + Math.random()*.6; col.set(v.map(z => z*b), k*3); }
  g.setAttribute('position', new T.BufferAttribute(p,3)); g.setAttribute('color', new T.BufferAttribute(col,3));
  const m = new T.Points(g, new T.PointsMaterial({ size:1.1, map:DOT, vertexColors:true, fog:false, ...add })); scene.add(m); STARS.push(liveStars(m)); return m;
}
function embers(scene, n, box){
  const g = new T.BufferGeometry(), p = new Float32Array(n*3), sp = new Float32Array(n);
  for (let k=0;k<n;k++){ p[k*3] = box.min.x + Math.random()*(box.max.x - box.min.x); p[k*3+1] = box.min.y + Math.random()*(box.max.y - box.min.y); p[k*3+2] = box.min.z + Math.random()*(box.max.z - box.min.z); sp[k] = .2 + Math.random()*.5; }
  g.setAttribute('position', new T.BufferAttribute(p,3));
  const m = new T.Points(g, new T.PointsMaterial({ size:.09, map:DOT, color:0xe5243b, ...add })); scene.add(m);
  return dt => { const a = g.attributes.position; for (let k=0;k<n;k++){ a.array[k*3+1] += sp[k]*dt; a.array[k*3] += Math.sin(a.array[k*3+1]*.8 + k)*dt*.12; if (a.array[k*3+1] > box.max.y) a.array[k*3+1] = box.min.y; } a.needsUpdate = true; };
}
// rough flat stepping stone
const stoneGeo = (() => { const g = new T.DodecahedronGeometry(1, 1); const p = g.attributes.position; for (let k=0;k<p.count;k++){ const v = new T.Vector3().fromBufferAttribute(p, k); const n = 1 + Math.sin(v.x*4.1 + v.z*2.3)*.08 + Math.cos(v.z*5.2)*.06; p.setXYZ(k, v.x*n, v.y > 0 ? v.y*.18 : v.y*.55, v.z*n); } g.computeVertexNormals(); return g; })();
function stone(scene, x, y, z, s, rot){ const m = new T.Mesh(stoneGeo, Math.random() < .5 ? STONE : STONE2); m.position.set(x, y, z); m.scale.set(s*(1 + Math.random()*.3), s*(.8 + Math.random()*.4), s*(.8 + Math.random()*.3)); m.rotation.y = rot ?? Math.random()*7; scene.add(m); return m; }

// candlelight: warm paper windows with a kumiko lattice, a soft warm halo, and a pool of light on the stone
const WARM = radialTex([[0,'rgba(255,226,190,.95)'],[.12,'rgba(255,150,90,.55)'],[.4,'rgba(214,52,40,.14)'],[1,'rgba(150,20,30,0)']]);
const POOL = radialTex([[0,'rgba(255,170,110,.75)'],[.35,'rgba(230,80,50,.3)'],[.7,'rgba(160,25,30,.08)'],[1,'rgba(120,10,20,0)']]);
const PAPER = (() => { const [c,x] = mk(128,112);
  const g = x.createRadialGradient(64,64,4,64,56,78); g.addColorStop(0,'#fff1d6'); g.addColorStop(.35,'#ffb46e'); g.addColorStop(.75,'#e0532e'); g.addColorStop(1,'#7a1414'); x.fillStyle = g; x.fillRect(0,0,128,112);
  for (let k=0;k<500;k++){ x.fillStyle = `rgba(90,30,10,${Math.random()*.06})`; x.fillRect(Math.random()*128, Math.random()*112, 1 + Math.random()*3, 1); }   // paper fibre
  x.fillStyle = '#1a0a06'; [42, 86].forEach(v => x.fillRect(v - 2, 0, 4, 112)); x.fillRect(0, 54, 128, 4);                                                   // lattice
  x.lineWidth = 8; x.strokeStyle = '#140805'; x.strokeRect(0, 0, 128, 112);
  const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; })();
// a stone tōrō lantern: base, post, firebox with four glowing windows, roof and finial
const L = { base:new T.CylinderGeometry(.42,.5,.2,6), post:new T.CylinderGeometry(.13,.16,1.05,6), plat:new T.CylinderGeometry(.46,.34,.14,6), box:new T.BoxGeometry(.48,.42,.48), win:new T.PlaneGeometry(.26,.22), roof:new T.ConeGeometry(.7,.42,6), top:new T.SphereGeometry(.09,8,6) };
function lantern(scene, pos, k){
  const g = new T.Group(); g.position.copy(pos); scene.add(g);
  const part = (geo, y, mat = STONE) => { const m = new T.Mesh(geo, mat); m.position.y = y; g.add(m); return m; };
  part(L.base, .1); part(L.post, .72); part(L.plat, 1.31); part(L.box, 1.59); const roof = part(L.roof, 2.01); roof.rotation.y = Math.PI/6; part(L.top, 2.27);
  const winMat = new T.MeshBasicMaterial({ map:PAPER, color:new T.Color(.05,.05,.05) });
  for (let j=0;j<4;j++){ const w = new T.Mesh(L.win, winMat); const a = j*Math.PI/2; w.position.set(Math.sin(a)*.245, 1.59, Math.cos(a)*.245); w.rotation.y = a; g.add(w); }
  const glow = new T.Sprite(new T.SpriteMaterial({ map:WARM, ...add, opacity:0 })); glow.position.y = 1.6; glow.scale.setScalar(1.6); g.add(glow);
  const haze = new T.Sprite(new T.SpriteMaterial({ map:GLOW, ...add, opacity:0 })); haze.position.y = 1.6; haze.scale.setScalar(4.2); g.add(haze);
  g.scale.setScalar(1.25);
  const pool = new T.Mesh(new T.PlaneGeometry(2.5, 2.5), new T.MeshBasicMaterial({ map:POOL, ...add, opacity:0, polygonOffset:true, polygonOffsetFactor:-2 })); pool.rotation.x = -Math.PI/2; pool.position.set(pos.x, pos.y + .1, pos.z); scene.add(pool);
  return { g, winMat, glow, haze, pool, k, lit:0, fire:new T.Vector3(pos.x, pos.y + 1.6*1.25, pos.z) };
}
async function loadSamurai(){
  const buf = new Uint8Array(await samuraiBytes());
  const loader = new T.GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder); const gltf = await new Promise((ok, err) => loader.parse(buf.buffer, '', ok, err));
  const m = gltf.scene; let bb = new T.Box3().setFromObject(m), s = new T.Vector3(); bb.getSize(s); if (s.z > s.y*1.2){ m.rotation.x = -Math.PI/2; m.updateMatrixWorld(true); bb.setFromObject(m); bb.getSize(s); }
  m.scale.multiplyScalar(2.3/s.y); m.updateMatrixWorld(true); bb.setFromObject(m); const c = new T.Vector3(); bb.getCenter(c); m.position.x -= c.x; m.position.z -= c.z; m.position.y -= bb.min.y;
  dressSamurai(m, makeInkEnvironment(T, R));                               // the chosen samurai look, same as the hero
  return m;
}
const samuraiP = loadSamurai().catch(e => (console.warn(e), null));

function baseScene(fog){
  const scene = new T.Scene(); scene.background = VOID; scene.fog = new T.FogExp2(VOID.getHex(), fog);
  scene.add(new T.HemisphereLight(lin(0x6d6880), lin(0x050203), .55));
  const key = new T.DirectionalLight(0xdcd8ff, .55); key.position.set(-4, 8, 6); scene.add(key);
  const fire = [0,1,2].map(() => { const l = new T.PointLight(0xff6a3a, 0, 9, 2); scene.add(l); return l; });
  return { scene, fire };
}
function addMoon(scene, pos, r){
  const m = new T.Mesh(new T.CircleGeometry(r, 96), new T.MeshBasicMaterial({ map:MOON, fog:false, color:0xb4b4b4 })); m.position.copy(pos); scene.add(m);
  const c = new T.Sprite(new T.SpriteMaterial({ map:new T.CanvasTexture(glowCanvas('229,36,59', [[0,.16],[.45,.05],[1,0]])), ...add, fog:false })); c.scale.setScalar(r*4.6); c.position.copy(pos).multiplyScalar(1.25); scene.add(c); m.lookAt(0, pos.y*.3, 0);
  const rim = new T.DirectionalLight(0xe5243b, 1.3); rim.position.copy(pos); scene.add(rim);
  return m;
}
function addMist(scene, pts, size){ return []; return pts.map(p => { const s = new T.Sprite(new T.SpriteMaterial({ map:MIST, color:0x3a2a66, opacity:.05, ...add })); s.position.copy(p); s.scale.set(size, size*.35, 1); scene.add(s); return s; }); }

/* =========================================================
   A · INTO THE DEPTH — a stone path through space, lanterns on alternating sides, the samurai at the far end
   ========================================================= */
const depth = (() => {
  const { scene, fire } = baseScene(.016);
  stars(scene, LOW ? 2500 : 5000, 260);
  const GAP = 11, zOf = k => -8 - k*GAP, END = zOf(N) - 4;
  const lanterns = ROLES.map((r, k) => lantern(scene, new T.Vector3(k%2 ? 2.7 : -2.7, -.05, zOf(k)), k));
  // the path: pairs of stepping stones winding gently forward
  for (let z = 10; z > END + 2; z -= 1.55){ const x = Math.sin(z*.08)*.35; stone(scene, x + (Math.random()-.5)*.5, -.12, z, .62 + Math.random()*.2); if (Math.random() < .35) stone(scene, (Math.random() < .5 ? -1 : 1)*(1.6 + Math.random()*2), -.3 - Math.random()*.6, z, .3 + Math.random()*.3); }
  // under each lantern a slab, and loose rocks drifting beneath the path
  lanterns.forEach(L => stone(scene, L.g.position.x, -.2, L.g.position.z, 1.05));
  for (let k=0;k<70;k++) stone(scene, (Math.random()-.5)*26, -3 - Math.random()*14, 10 - Math.random()*(10 - END + 30), .3 + Math.random()*1.4);
  // the samurai's rock at the end, the moon behind him
  const rockG = new T.DodecahedronGeometry(2.2, 2); { const p = rockG.attributes.position; for (let k=0;k<p.count;k++){ const v = new T.Vector3().fromBufferAttribute(p, k); const n = 1 + Math.sin(v.x*2.1)*Math.cos(v.z*1.7)*.12; p.setXYZ(k, v.x*n*1.3, v.y > .2 ? .2 + (v.y - .2)*.1 : v.y*1.5, v.z*n*1.3); } rockG.computeVertexNormals(); }
  const rock = new T.Mesh(rockG, STONE2); rock.position.set(0, -.25, END - 2); scene.add(rock);
  const hero = new T.Group(); hero.position.set(0, 0, END - 2); hero.rotation.y = -.25; scene.add(hero);
  samuraiP.then(m => m && hero.add(m));
  addMoon(scene, new T.Vector3(3, 11, END - 60), 17);
  addMist(scene, Array.from({ length:14 }, (_, k) => new T.Vector3((Math.random()-.5)*14, -.9 + Math.random()*.6, 4 - k*(10 - END)/14)), 18);
  const emb = embers(scene, LOW ? 120 : 260, new T.Box3(new T.Vector3(-8, -2, END - 6), new T.Vector3(8, 6, 10)));
  // camera poses per stop
  const pose = i => {
    if (i === 0) return { px:0, py:2.4, pz:12, lx:0, ly:1.2, lz:-40 };
    if (i === N + 1) return portrait()
      ? { px:.5, py:2.3, pz:END + 4.6, lx:-.1, ly:.35, lz:END - 2 }        // phones: the samurai sits in the top half, above the letter
      : { px:1.6, py:1.65, pz:END + 3.2, lx:-.6, ly:1.55, lz:END - 2 };
    const L = lanterns[i - 1], s = Math.sign(L.g.position.x);
    // portrait screens see a narrow slice, so the camera turns toward the lantern instead of past it
    if (portrait()) return { px:-s*.2, py:2.1, pz:L.g.position.z + 7.4, lx:s*2.1, ly:1.25, lz:L.g.position.z - 1.2 };
    return { px:-s*.9, py:1.85, pz:L.g.position.z + 6.4, lx:s*1.2, ly:1.6, lz:L.g.position.z - 3.5 };
  };
  return { scene, fire, lanterns, hero, pose, update:(dt) => emb(dt), side:L => L.g.position.x > 0 ? 1 : -1, intro:'Scroll · walk the way' };
})();

/* =========================================================
   B · UP THE MOUNTAIN — a spiral stair around a rock spire, a lantern on each landing, the samurai on the summit
   ========================================================= */

/* ---------- shell: one step per gesture, eased camera between stops ---------- */
const cam = new T.PerspectiveCamera(42, 1, .05, 600);
const composer = new T.EffectComposer(R);
const rp = new T.RenderPass(depth.scene, cam); composer.addPass(rp);
composer.addPass(new T.UnrealBloomPass(new T.Vector2(innerWidth*(LOW ? .5 : 1), innerHeight*(LOW ? .5 : 1)), .38, .45, .74));
let W = depth, stop = 0, prog = 0;
const card = $('#card'), rail = $('#rail'), intro = $('#intro'), letter = $('#letter'), words = $('#words');
rail.innerHTML = [`<button type="button" data-i="0" aria-label="Start"><span>序</span><i></i></button>`, ...ROLES.map((r, k) => `<button type="button" data-i="${k + 1}" aria-label="${esc(r.t)}, ${esc(r.o)}"><span>${r.y}</span><i></i></button>`), `<button type="button" data-i="${N + 1}" aria-label="Contact"><span>結</span><i></i></button>`].join('');
const railBtns = [...rail.children];
rail.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
function go(i){ stop = clamp(i, 0, STOPS - 1); railBtns.forEach((b, k) => { b.classList.toggle('on', k === stop); b.classList.toggle('done', k < stop); }); }
// hard stop per gesture; a fresh gesture is a pause, or a rising delta over trackpad momentum
let lastT = 0, lastAbs = 0, lockUntil = 0;
const edge = createEdge(api);
const atStart = () => stop === 0, atEnd = () => stop === STOPS - 1 && prog > STOPS - 1.06;
api.onEnter = dir => { if (dir < 0) { go(STOPS - 1); prog = STOPS - 1; } };
addEventListener('wheel', e => {
  if (edge.wheel(e, atStart, atEnd)) return;
  if (e.target.closest && e.target.closest('#letter')) return;
  const now = performance.now(), abs = Math.abs(e.deltaY); if (abs < 2) return;
  const fresh = now - lastT > 260 || abs > lastAbs*1.6 + 4; lastT = now; lastAbs = abs;
  if (fresh && now > lockUntil){ go(stop + Math.sign(e.deltaY)); lockUntil = now + 650; }
}, { passive:true });
let ty = null; addEventListener('touchstart', e => { ty = e.touches[0].clientY; edge.touchstart(e); }, { passive:true });
addEventListener('touchend', e => { if (edge.touchend(e, atStart, atEnd)) { ty = null; return; } if (ty == null || (e.target.closest && e.target.closest('#letter'))) return; const d = ty - e.changedTouches[0].clientY; if (Math.abs(d) > 40) go(stop + Math.sign(d)); ty = null; }, { passive:true });
addEventListener('keydown', e => { if (e.target.closest && e.target.closest('form')) return; if (edge.key(e, atStart, atEnd)) { e.preventDefault(); return; } if (['ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); go(stop + 1); } if (['ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); go(stop - 1); } });
const ptr = { nx:0, ny:0, sx:0, sy:0 }; addEventListener('pointermove', e => { ptr.nx = e.clientX/innerWidth*2 - 1; ptr.ny = -(e.clientY/innerHeight)*2 + 1; });

function route(){
  W = depth; rp.scene = W.scene;
  $('#goTxt').textContent = W.intro; go(0); prog = 0; shown = -1;
}

function resize(){ R.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.fov = cam.aspect < .8 ? 58 : 42; cam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// camera from a fractional stop: ease between the two neighbouring poses (angles for the spiral, so it never cuts through the rock)
const tmp = new T.Vector3(), look = new T.Vector3();
function camAt(p){
  const i0 = Math.floor(p), i1 = Math.min(STOPS - 1, i0 + 1), f = sstep(p - i0);
  const a = W.pose(i0), b = W.pose(i1);
  if (W.angular){
    const pol = q => ({ a:Math.atan2(q.pz, q.px), r:Math.hypot(q.px, q.pz), y:q.py, la:Math.atan2(q.lz, q.lx), lr:Math.hypot(q.lx, q.lz), ly:q.ly });
    const A = pol(a), B = pol(b); let da = B.a - A.a; da = Math.atan2(Math.sin(da), Math.cos(da));
    const an = A.a + da*f, r = lerp(A.r, B.r, f) + Math.sin(f*Math.PI)*1.5*(i0 > 0 && i1 < STOPS - 1 ? 1 : 0);
    tmp.set(Math.cos(an)*r, lerp(A.y, B.y, f), Math.sin(an)*r);
    let dl = B.la - A.la; dl = Math.atan2(Math.sin(dl), Math.cos(dl)); const la = A.la + dl*f, lr = lerp(A.lr, B.lr, f);
    look.set(Math.cos(la)*lr, lerp(A.ly, B.ly, f), Math.sin(la)*lr);
  } else {
    tmp.set(lerp(a.px, b.px, f), lerp(a.py, b.py, f) + Math.sin(f*Math.PI)*.25, lerp(a.pz, b.pz, f));
    look.set(lerp(a.lx, b.lx, f), lerp(a.ly, b.ly, f), lerp(a.lz, b.lz, f));
  }
}

// the role card: pinned beside its lantern with a leader line
let shown = -1;
function fillCard(k){
  const r = ROLES[k];
  card.querySelector('.no').textContent = `Lantern ${String(k + 1).padStart(2, '0')} / ${N}`;
  card.querySelector('.yr b').textContent = r.y; card.querySelector('.yr i').textContent = KN(r.y);
  card.querySelector('h3').textContent = r.t; card.querySelector('.org').textContent = r.o; card.querySelector('.when').textContent = r.d;
  card.querySelector('ul').innerHTML = r.s.map(x => `<li>${esc(x)}</li>`).join('');
}
const scr = new T.Vector3();
let qi = 0, qt = 0, qHold = 0;
const dots = words.querySelector('.dots');
dots.innerHTML = RECS.map((r, k) => `<button type="button" aria-label="Words from ${esc(r.n)}" data-k="${k}"></button>`).join('');
function showQuote(k = qi + 1){
  qi = (k + RECS.length) % RECS.length; const r = RECS[qi], bq = words.querySelector('blockquote');
  [...dots.children].forEach((d, j) => d.classList.toggle('on', j === qi));
  words.querySelector('.count').textContent = `${String(qi + 1).padStart(2, '0')} / ${String(RECS.length).padStart(2, '0')}`;
  bq.style.opacity = 0;
  setTimeout(() => { bq.querySelector('p').textContent = r.q; bq.querySelector('footer').innerHTML = `<b>${esc(r.n)}</b><span>${esc(r.p)}</span>`; bq.style.opacity = 1; }, 350);
}
qi = -1; showQuote(0);
words.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b){ if (narrow() && e.target.closest('blockquote')){ showQuote(qi + 1); qt = 0; qHold = 14; } return; }
  if (b.dataset.k) showQuote(+b.dataset.k); else showQuote(qi + (b.classList.contains('prev') ? -1 : 1));
  qt = 0; qHold = 14;                        // the visitor took over: wait longer before turning again
});


const clock = new T.Clock();
route();
const ld = $('#loader'); samuraiP.finally(() => { ld.style.opacity = 0; setTimeout(() => ld.remove(), 850); });
(function loop(){
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  STARS.forEach(f => f(t));
  prog = reduce ? stop : lerp(prog, stop, 1 - Math.pow(.12, dt));
  if (Math.abs(prog - stop) < .0005) prog = stop;
  ptr.sx = lerp(ptr.sx, ptr.nx, .04); ptr.sy = lerp(ptr.sy, ptr.ny, .04);
  camAt(prog);
  cam.position.copy(tmp); cam.lookAt(look);
  cam.rotateY(-ptr.sx*.04); cam.rotateX(ptr.sy*.03);                      // a small parallax from the pointer
  // lanterns: every candle burns low so the way glows ahead; the one you stand at burns full, passed ones settle back
  const cur = prog - 1;
  W.lanterns.forEach(L => {
    const target = Math.max(L.k < cur - .5 ? .5 : .26, 1 - Math.abs(L.k - cur)*1.3);
    L.lit = lerp(L.lit, target, .06);
    // candle flicker: layered slow sways plus a fast shiver, different for every lantern
    L.fl = .86 + Math.sin(t*5.3 + L.k*1.7)*.06 + Math.sin(t*11.9 + L.k*4.1)*.04 + Math.sin(t*27 + L.k*2.3)*.025 + Math.sin(t*1.3 + L.k)*.03;
    const v = .06 + L.lit*1.05*L.fl;
    L.winMat.color.setRGB(v, v, v);
    L.glow.material.opacity = L.lit*.6*L.fl; L.glow.scale.setScalar(1.15 + L.lit*.55 + (L.fl - .86)*.6);
    L.haze.material.opacity = 0;
    L.pool.material.opacity = L.lit*.45*L.fl;
  });
  // hand the three real lights to the nearest burning lanterns, so the stones and roofs catch the glow
  const near3 = W.lanterns.slice().sort((a, b) => a.fire.distanceToSquared(cam.position) - b.fire.distanceToSquared(cam.position)).slice(0, 3);
  W.fire.forEach((l, j) => { const L = near3[j]; l.position.copy(L.fire); l.intensity = 2.6*L.lit*L.fl; });
  W.hero.children[0] && (W.hero.children[0].rotation.y = Math.sin(t*.4)*.04);
  W.update(dt, t);
  // DOM: intro, card, letter, recommendations
  intro.classList.toggle('off', prog > .35);
  const onRole = stop >= 1 && stop <= N, near = 1 - Math.abs(prog - stop)*2.2;
  card.classList.toggle('sheet', narrow());
  if (onRole && narrow()){
    // phones: the card is a panel at the bottom, under its lantern, instead of a label pinned beside it
    const k = stop - 1; if (shown !== k){ shown = k; fillCard(k); }
    card.style.transform = ''; card.style.opacity = clamp(near, 0, 1);
  } else if (onRole){
    const k = stop - 1; if (shown !== k){ shown = k; fillCard(k); }
    scr.copy(W.lanterns[k].fire).project(cam);
    const sx = (scr.x*.5 + .5)*innerWidth, sy = (-scr.y*.5 + .5)*innerHeight;
    const leftSide = sx > innerWidth*.55, cw = card.offsetWidth, gap = 70;
    let x = leftSide ? sx - gap - cw : sx + gap; x = clamp(x, 34, innerWidth - cw - 110);
    const y = clamp(sy - 70, 80, innerHeight - card.offsetHeight - 30);
    card.classList.toggle('left', leftSide);
    const lead = card.querySelector('.lead'), lw = leftSide ? Math.max(0, sx - (x + cw)) : Math.max(0, x - sx);
    lead.style.width = lw + 'px'; lead.style.top = (sy - y) + 'px'; lead.style.left = leftSide ? cw + 'px' : -lw + 'px';
    card.style.transform = `translate(${x}px, ${y}px)`; card.style.opacity = clamp(near, 0, 1);
  } else card.style.opacity = 0;
  const atEnd = stop === N + 1 && prog > N + .7;
  letter.classList.toggle('on', atEnd); words.classList.toggle('on', atEnd);
  if (atEnd){ qt += dt; if (qt > 8 + qHold){ qt = 0; qHold = 0; showQuote(); } }
  composer.render();
})();

  /* ======== /original ======== */
}
