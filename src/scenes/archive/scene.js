// Ported from the approved draft archive/index.html.
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

const T = THREE, $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2,'0');
const lerp = (a,b,t) => a + (b-a)*t, clamp = (x,a,b) => Math.min(b, Math.max(a, x)), ease = f => f*f*(3-2*f);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- chapters + projects (in rack order) ---------- */
const CH = DATA.CHAPTERS;
const A = DATA.ARCHIVE.map(p => ({ c:p.chapter, t:p.name, s:p.stack, live:p.live, code:p.code, img:p.img, about:p.about }));
const N = A.length, src = p => 'img/' + p.img + '.jpg';
const num = i => pad(i + DATA.FEATURED.length + 1);   // continues after the featured planets
const wide = () => innerWidth > 820;
const lineFor = p => p.about || `${CH[p.c].name}. Built with ${p.s.length > 1 ? p.s.slice(0,-1).join(', ') + ' and ' + p.s[p.s.length-1] : p.s[0]}.`;

/* ---------- filters + chapter nav ---------- */
const counts = {}; A.forEach(p => p.s.forEach(s => counts[s] = (counts[s] || 0) + 1));
const TECH = Object.keys(counts).filter(k => counts[k] >= 2).sort((a,b) => counts[b] - counts[a]);
let filter = 'All';
$('#chips').innerHTML = [`<button type="button" data-f="All" aria-pressed="true">All<span>${N}</span></button>`, ...TECH.map(k => `<button type="button" data-f="${esc(k)}" aria-pressed="false">${esc(k)}<span>${counts[k]}</span></button>`)].join('');
$('#chips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; filter = b.dataset.f; document.querySelectorAll('#chips button').forEach(x => x.setAttribute('aria-pressed', x === b)); applyFilter(); });
$('#chapters').innerHTML = CH.map((c,k) => `<button type="button" data-c="${k}"><b>${c.k}</b><span>${esc(c.name)}</span><i></i></button>`).join('');
$('#chapters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.classList.contains('off')) return; const lab = labels[+b.dataset.c]; scrollT = clamp(-lab.yT - .6, 0, maxScroll()); });

/* ---------- renderer ---------- */
const canvas = $('#gl');
const LOW = innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;
const R = new T.WebGLRenderer({ canvas, antialias:true, alpha:true }); R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2)); R.outputEncoding = T.sRGBEncoding; R.setClearColor(0, 0);
const ANISO = R.capabilities.getMaxAnisotropy();
const scene = new T.Scene(); scene.fog = new T.Fog(0x050507, 12, 32);
const cam = new T.PerspectiveCamera(32, 1, .1, 200);
scene.add(new T.HemisphereLight(0xc9c2e0, 0x1a0a10, .65));
const key = new T.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 7); scene.add(key);
const rimL = new T.DirectionalLight(0x8b5cf6, 1.2); rimL.position.set(-4, 2, -5); scene.add(rimL);
const lantern = new T.PointLight(0xe5243b, 2.6, 18); scene.add(lantern);
function mk(w,h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function ctex(c){ const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = ANISO; return t; }
function radialTex(stops){ const [c,x] = mk(128,128); const g = x.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col]) => g.addColorStop(o,col)); x.fillStyle = g; x.fillRect(0,0,128,128); return new T.CanvasTexture(c); }
const dot = radialTex([[0,'#fff'],[.3,'rgba(255,255,255,.7)'],[1,'rgba(255,255,255,0)']]);
{ const C = LOW ? 300 : 800, g = new T.BufferGeometry(), p = new Float32Array(C*3), col = new Float32Array(C*3);
  for (let k=0;k<C;k++){ p[k*3] = (Math.random()-.5)*44; p[k*3+1] = (Math.random()-.5)*60 - 8; p[k*3+2] = -12 + Math.random()*16; const v = Math.random() < .2 ? [.9,.14,.23] : Math.random() < .3 ? [.55,.36,.96] : [.8,.78,.85]; col.set(v.map(q => q*(.3 + Math.random()*.5)), k*3); }
  g.setAttribute('position', new T.BufferAttribute(p,3)); g.setAttribute('color', new T.BufferAttribute(col,3));
  scene.add(new T.Points(g, new T.PointsMaterial({ size:.06, map:dot, vertexColors:true, transparent:true, depthWrite:false, blending:T.AdditiveBlending }))); }

/* ---------- sword parts ---------- */
const SL = 3.0, RR = (SL*SL)/(2*.11);           // blade length, radius of its arc
const bendY = x => { x = Math.max(0, x); return RR - Math.sqrt(RR*RR - x*x); };
function bend(geo){ const p = geo.attributes.position; for (let k=0;k<p.count;k++){ p.setY(k, p.getY(k) + bendY(p.getX(k))); } geo.computeVertexNormals(); }
function sayaTex(p, i){
  const [c,x] = mk(2048, 100);
  const g = x.createLinearGradient(0,0,0,100); g.addColorStop(0,'#1d1a22'); g.addColorStop(.45,'#0c0b0f'); g.addColorStop(1,'#050407');
  x.fillStyle = g; x.fillRect(0,0,2048,100);
  x.fillStyle = '#e5243b'; x.fillRect(60,0,14,100); x.fillRect(84,0,4,100);
  x.textBaseline = 'middle';
  x.font = '600 34px "JetBrains Mono", monospace'; x.fillStyle = '#8c8a96'; x.fillText(num(i), 116, 52);
  x.font = '400 62px Anton, Impact, sans-serif'; x.fillStyle = '#f3f1f5';
  const words = p.t.toUpperCase().split(' '); const first = words.shift(); x.fillText(first, 210, 54);
  if (words.length){ const w = x.measureText(first + ' ').width; x.fillStyle = '#e5243b'; x.fillText(words.join(' '), 210 + w, 54); }
  x.font = '600 26px "JetBrains Mono", monospace'; x.fillStyle = 'rgba(139,92,246,.95)'; x.textAlign = 'right';
  x.fillText(p.s.slice(0,3).join(' · ').toUpperCase(), 1960, 52);
  return ctex(c);
}
function tagTex(i){
  const [c,x] = mk(96, 192);
  x.fillStyle = '#6e0d1c'; x.beginPath(); x.moveTo(10,24); x.lineTo(48,4); x.lineTo(86,24); x.lineTo(86,182); x.lineTo(10,182); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(243,241,245,.35)'; x.lineWidth = 2; x.strokeRect(18,34,60,140);
  x.fillStyle = '#050507'; x.beginPath(); x.arc(48,22,6,0,7); x.fill();
  x.fillStyle = '#f3f1f5'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '400 46px Anton, Impact, sans-serif'; x.fillText(num(i), 48, 82);
  x.font = '800 34px "Hiragino Mincho ProN","Yu Mincho",serif'; x.fillStyle = '#ffb3bc'; x.fillText(CH[A[i].c].k, 48, 140);
  return ctex(c);
}
function chapterTex(c, raw){
  const [cv,x] = mk(1024, 128);
  x.textBaseline = 'middle';
  x.font = '800 86px "Hiragino Mincho ProN","Yu Mincho",serif'; x.fillStyle = '#e5243b'; x.fillText(CH[c].k, 6, 66);
  x.font = '400 58px Anton, Impact, sans-serif'; x.fillStyle = '#f3f1f5'; x.fillText(CH[c].name.toUpperCase(), 118, 70);
  const w = x.measureText(CH[c].name.toUpperCase()).width;
  x.strokeStyle = 'rgba(229,36,59,.7)'; x.lineWidth = 3; x.beginPath(); x.moveTo(140 + w, 70); x.lineTo(1010, 70); x.stroke();
  x.font = '600 17px "JetBrains Mono", monospace'; x.fillStyle = '#8c8a96'; x.fillText(CH[c].line.toUpperCase(), 120, 112);
  return raw ? rawTex(cv) : ctex(cv);
}
// one blade finish per chapter: wooden practice sword → plain steel → crimson-tempered → violet-edged
function finishTex(kind){
  const [c,x] = mk(512, 64);
  if (kind === 0){                               // bokken: pale ash wood with grain
    x.fillStyle = '#6a625e'; x.fillRect(0,0,512,64);
    for (let k=0;k<26;k++){ x.strokeStyle = `rgba(30,24,22,${.12 + Math.random()*.2})`; x.lineWidth = .8 + Math.random()*1.6; x.beginPath(); const y = Math.random()*64; x.moveTo(0, y); for (let q=0;q<=512;q+=32) x.lineTo(q, y + Math.sin(q*.02 + k)*2.5); x.stroke(); }
    return ctex(c);
  }
  const edge = ['#e7e5ee', '#e7e5ee', '#ffd7dc', '#ebe2ff'][kind];
  x.fillStyle = '#5d5b66'; x.fillRect(0,0,512,64);
  x.fillStyle = edge; x.beginPath(); x.moveTo(0,64); for (let k=0;k<=512;k+=8) x.lineTo(k, 30 + Math.sin(k*.09)*5 + Math.sin(k*.031)*4); x.lineTo(512,64); x.fill();
  x.fillStyle = kind === 2 ? 'rgba(229,36,59,.95)' : kind === 3 ? 'rgba(139,92,246,.95)' : 'rgba(255,255,255,.6)'; x.fillRect(0,56,512,8);
  return ctex(c);
}
function edgeMask(){ const [c,x] = mk(512, 64); x.fillStyle = '#000'; x.fillRect(0,0,512,64); const g = x.createLinearGradient(0,40,0,64); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(1,'#fff'); x.fillStyle = g; x.fillRect(0,40,512,24); return new T.CanvasTexture(c); }
const FINISH = [0,1,2,3].map(finishTex), EDGE = edgeMask();
const EDGE_COL = [null, null, new T.Color(0xe5243b), new T.Color(0x8b5cf6)];
const bladeTex = (() => { const [c,x] = mk(512, 64); x.fillStyle = '#5d5b66'; x.fillRect(0,0,512,64); x.fillStyle = '#e7e5ee'; x.beginPath(); x.moveTo(0,64); for (let k=0;k<=512;k+=8) x.lineTo(k, 30 + Math.sin(k*.09)*5 + Math.sin(k*.031)*4); x.lineTo(512,64); x.fill(); x.fillStyle = 'rgba(255,255,255,.6)'; x.fillRect(0,58,512,6); return ctex(c); })();
const wrapTex = (() => { const [c,x] = mk(256, 32); x.fillStyle = '#0a090c'; x.fillRect(0,0,256,32); for (let k=0;k<256;k+=22){ x.fillStyle = '#6e0d1c'; x.beginPath(); x.moveTo(k,16); x.lineTo(k+11,3); x.lineTo(k+22,16); x.lineTo(k+11,29); x.fill(); x.fillStyle = '#e5243b'; x.beginPath(); x.moveTo(k+6,16); x.lineTo(k+11,10); x.lineTo(k+16,16); x.lineTo(k+11,22); x.fill(); } return ctex(c); })();
const glintTex = (() => { const [c,x] = mk(256,16); const g = x.createLinearGradient(0,0,256,0); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.45,'rgba(255,80,100,.7)'); g.addColorStop(.5,'rgba(255,255,255,1)'); g.addColorStop(.55,'rgba(255,80,100,.7)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0,0,256,16); return new T.CanvasTexture(c); })();
const sayaGeo = (() => { const g = new T.BoxGeometry(SL + .12, .15, .075, 60, 1, 1); g.translate(SL/2 + .08, 0, 0); bend(g); return g; })();
const bladeGeo = (() => { const g = new T.BoxGeometry(SL, .1, .018, 80, 1, 1); g.translate(SL/2, 0, 0); const bp = g.attributes.position;
  for (let v=0; v<bp.count; v++){ const x = bp.getX(v); if (x > SL - .32){ const f = clamp(1 - (x-(SL-.32))/.32, 0, 1); if (bp.getY(v) > 0) bp.setY(v, -.05 + .1*f); } } bend(g); return g; })();
const tsubaGeo = new T.CylinderGeometry(.17, .17, .035, 32), habGeo = new T.BoxGeometry(.08, .12, .04), tsukaGeo = new T.BoxGeometry(.95, .11, .075), kashGeo = new T.BoxGeometry(.06, .12, .085);

/* ---------- the stand ---------- */
const SP = .64, GAP = .9;                         // spacing between swords, extra room for a chapter label
const OFFX = -1.35, POSTS = [-.75, 1.65];
const rack = new T.Group(); scene.add(rack);
const lacq = new T.MeshStandardMaterial({ color:0x09080b, roughness:.32, metalness:.15 });
const cordMat = new T.MeshStandardMaterial({ color:0x8e0f22, roughness:.6, emissive:0x2a0308 });
const posts = POSTS.map(px => { const m = new T.Mesh(new T.BoxGeometry(.16, 1, .16), lacq); m.position.set(px, 0, -.18); rack.add(m); return m; });
const capTop = new T.Mesh(new T.BoxGeometry(3.3, .14, .26), lacq), capBot = capTop.clone(); rack.add(capTop, capBot);
const cords = [];   // red cord wraps on the posts
for (let k=0;k<40;k++){ POSTS.forEach(px => { const r = new T.Mesh(new T.TorusGeometry(.115, .018, 6, 20), cordMat); r.rotation.x = Math.PI/2; r.position.set(px, 0, -.18); rack.add(r); cords.push(r); }); }
const pegGeo = new T.BoxGeometry(.12, .06, .34), cordGeo = new T.CylinderGeometry(.006, .006, .14, 4);
const swords = A.map((p, i) => {
  const k = new T.Group(); rack.add(k);
  const mats = [];
  const m = o => { const mt = new T.MeshStandardMaterial({ transparent:true, ...o }); mats.push(mt); return mt; };
  const lac = m({ color:0x0b0a0e, roughness:.42, metalness:.1 });
  const saya = new T.Mesh(sayaGeo, [lac, lac, lac, lac, m({ map:sayaTex(p, i), roughness:.4, metalness:.1 }), lac]); k.add(saya);
  const pivot = new T.Group(); pivot.position.y = RR; k.add(pivot);
  const steel = new T.Group(); steel.position.y = -RR; pivot.add(steel);
  const ch = p.c;
  const bladeM = ch === 0 ? m({ map:FINISH[0], metalness:0, roughness:.85, emissive:0x000000 })
                          : m({ map:FINISH[ch], metalness:.38, roughness:.28, emissive:EDGE_COL[ch] || 0x000000, emissiveMap:EDGE_COL[ch] ? EDGE : null, emissiveIntensity:EDGE_COL[ch] ? .6 : 0 });
  steel.add(new T.Mesh(bladeGeo, bladeM));
  const dark = m({ color:0x2a2830, metalness:.4, roughness:.5 });
  const tsuba = new T.Mesh(tsubaGeo, dark); tsuba.rotation.z = Math.PI/2; tsuba.position.x = -.03; steel.add(tsuba);
  const hab = new T.Mesh(habGeo, dark); hab.position.x = .04; steel.add(hab);
  if (ch === 0){ tsuba.scale.set(.55, 1, .55); hab.visible = false; }      // practice swords: just a small guard ring
  const tsuka = new T.Mesh(tsukaGeo, m({ map:wrapTex, roughness:.8 })); tsuka.position.x = -.53; steel.add(tsuka);
  const kash = new T.Mesh(kashGeo, dark); kash.position.x = -1.02; steel.add(kash);
  const glint = new T.Mesh(new T.PlaneGeometry(.55, .1), new T.MeshBasicMaterial({ map:glintTex, color: ch === 3 ? 0xc9b5ff : 0xffffff, transparent:true, blending:T.AdditiveBlending, depthWrite:false, opacity:0 })); glint.position.z = .012; steel.add(glint);
  POSTS.forEach(px => { const peg = new T.Mesh(pegGeo, lacq); peg.position.set(px - OFFX, -.11, 0); k.add(peg); });
  // a numbered tag hanging off the end of the scabbard
  const tagPivot = new T.Group(); tagPivot.position.set(SL - .15, bendY(SL - .15) - .07, .06); k.add(tagPivot);
  const cord = new T.Mesh(cordGeo, cordMat); cord.position.y = -.07; tagPivot.add(cord);
  const tag = new T.Mesh(new T.PlaneGeometry(.13, .26), m({ map:tagTex(i), roughness:.7, side:T.DoubleSide })); tag.position.y = -.27; tagPivot.add(tag);
  const hit = new T.Mesh(new T.BoxGeometry(4.6, SP*.92, .5), new T.MeshBasicMaterial({ visible:false })); hit.position.x = 1.0; hit.userData.i = i; k.add(hit);
  return { ch, lift:0, p, i, k, pivot, steel, glint, hit, mats, bladeM, tagPivot, tag, draw:0, vis:0, visT:1, y:0, yT:0, drop:1, dropDelay:0, gt:Math.random()*2, sw:Math.random()*6 };
});
const labelMat = map => new T.ShaderMaterial({
  uniforms:{ map:{ value:map }, reveal:{ value:0 }, opacity:{ value:0 } }, transparent:true, depthWrite:false,
  vertexShader:'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader:`uniform sampler2D map; uniform float reveal, opacity; varying vec2 vUv;
    float h(float n){ return fract(sin(n)*43758.5453); }
    void main(){ vec4 c = texture2D(map, vUv);
      float ragged = (h(floor(vUv.y*40.)) - .5)*.035;                 // a dry, uneven brush front
      float a = smoothstep(0., .025, reveal*1.08 - vUv.x + ragged);
      gl_FragColor = vec4(c.rgb, c.a * a * opacity); }`
});
const rawTex = cv => { const t = new T.CanvasTexture(cv); t.anisotropy = ANISO; return t; };
const labels = CH.map((c, k) => { const mesh = new T.Mesh(new T.PlaneGeometry(2.9, .36), labelMat(null)); rack.add(mesh); return { mesh, yT:0, y:0, vis:0, visT:1, rev:0, seen:false }; });

let visible = swords.slice(), scrollY = 0, scrollT = 0, hover = -1, sel = -1, focusI = 0, rackBottom = 0;
function applyFilter(){
  visible = swords.filter(s => filter === 'All' || s.p.s.includes(filter));
  swords.forEach(s => s.visT = visible.includes(s) ? 1 : 0);
  let y = 0, lastC = -1;
  const chapCount = CH.map(() => 0);
  visible.forEach(s => {
    if (s.p.c !== lastC){ if (lastC >= 0) y -= GAP*.5; labels[s.p.c].yT = y - .05; y -= GAP; lastC = s.p.c; }
    s.yT = y; y -= SP; chapCount[s.p.c]++;
  });
  labels.forEach((l, k) => l.visT = chapCount[k] ? 1 : 0);
  rackBottom = y + SP;
  document.querySelectorAll('#chapters button').forEach((b, k) => { b.classList.toggle('off', !chapCount[k]); b.querySelector('i').textContent = chapCount[k] || '–'; });
  $('#count').innerHTML = `<b>${visible.length}</b>${visible.length === 1 ? 'blade' : 'blades'} on the rack${filter === 'All' ? '' : ' · ' + esc(filter)}`;
  scrollT = 0; hover = -1; focusI = 0;
  if (booted) SND.clack();
}
let booted = false;
applyFilter(); swords.forEach(s => { s.y = s.yT; }); labels.forEach(l => { l.y = l.yT; });
swords.forEach((s, j) => { s.dropDelay = .35 + j*.07; });   // the drop-in on load

/* ---------- sound (WebAudio, off by default) ---------- */
const SND = { ctx:null, on:false, master:null,
  init(){ const c = this.ctx = new (window.AudioContext || window.webkitAudioContext)(); this.master = c.createGain(); this.master.gain.value = 0; this.master.connect(c.destination);
    const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0); for (let k=0;k<d.length;k++) d[k] = Math.random()*2 - 1; this.noise = b;
    const hum = c.createGain(); hum.gain.value = .04; hum.connect(this.master); [55, 82.4].forEach((f,k) => { const o = c.createOscillator(); o.frequency.value = f; const g = c.createGain(); g.gain.value = k ? .3 : .5; o.connect(g); g.connect(hum); o.start(); }); },
  toggle(){ if (!this.ctx) this.init(); this.on = !this.on; this.ctx.resume(); this.master.gain.setTargetAtTime(this.on ? .6 : 0, this.ctx.currentTime, .15); },
  burst(f0, f1, dur, gain, type){ if (!this.on) return; const c = this.ctx, t = c.currentTime, s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(f); f.connect(g); g.connect(this.master); s.start(t); s.stop(t + dur + .05); },
  shing(){ if (!this.on) return; this.burst(6000, 9000, .35, .12, 'bandpass'); const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(2400, t); o.frequency.exponentialRampToValueAtTime(3100, t + .3); const g = c.createGain(); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + .45); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + .5); },
  swish(){ this.burst(5200, 400, .3, .5); },
  impact(){ if (!this.on) return; const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(30, t + .5); const g = c.createGain(); g.gain.setValueAtTime(.7, t); g.gain.exponentialRampToValueAtTime(.0001, t + .6); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + .65); this.burst(2500, 1800, .1, .3, 'highpass'); },
  clack(){ this.burst(1400, 700, .07, .25); }
};
$('#snd').addEventListener('click', () => { SND.toggle(); $('#snd').setAttribute('aria-pressed', SND.on); $('#snd').textContent = SND.on ? '♪ Sound on' : '♪ Sound off'; });

/* ---------- interaction ---------- */
const ray = new T.Raycaster(), ptr = { x:0, y:0, nx:0, ny:0, sx:0, sy:0, in:false };
const peek = $('#peek');
let phase = 'rack', phaseT = 0;                  // rack | open
function pick(){ ray.setFromCamera({ x:ptr.nx, y:ptr.ny }, cam); const h = ray.intersectObjects(visible.map(s => s.hit))[0]; return h ? h.object.userData.i : -1; }
function maxScroll(){ return Math.max(0, -rackBottom - (wide() ? 3.0 : 2.0)); }
addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.nx = e.clientX/innerWidth*2 - 1; ptr.ny = -(e.clientY/innerHeight)*2 + 1; ptr.in = e.target === canvas; });
canvas.addEventListener('pointerleave', () => { ptr.in = false; });
const edge = createEdge(api);
const atStart = () => phase !== 'open' && scrollT <= .02 && scrollY <= .3, atEnd = () => phase !== 'open' && scrollT >= maxScroll() - .02 && Math.abs(scrollY - scrollT) < .3;
api.onEnter = dir => { if (dir < 0) { requestAnimationFrame(() => { scrollT = scrollY = maxScroll(); }); } };
addEventListener('touchstart', e => edge.touchstart(e), { passive:true });
addEventListener('touchend', e => edge.touchend(e, atStart, atEnd), { passive:true });
addEventListener('wheel', e => { if (edge.wheel(e, atStart, atEnd)) return; scrollT = clamp(scrollT + e.deltaY*.004, 0, maxScroll()); }, { passive:true });
let drag = null;
// drag the rack like a phone list: it follows the finger (pull up to see the swords below), a flick glides on.
// A tap picks the sword under the finger where it touched (touch has no hover, so aim from the tap itself).
const aimAt = e => { ptr.nx = e.clientX/innerWidth*2 - 1; ptr.ny = -(e.clientY/innerHeight)*2 + 1; };
canvas.addEventListener('pointerdown', e => { aimAt(e); drag = { y:e.clientY, x:e.clientX, s:scrollT, moved:false, ly:e.clientY, lt:performance.now(), v:0, touch:e.pointerType !== 'mouse' }; });
addEventListener('pointermove', e => {
  if (!drag) return;
  const dy = e.clientY - drag.y, slop = drag.touch ? 12 : 6;
  if (!drag.moved && Math.hypot(dy, e.clientX - drag.x) > slop) drag.moved = true;
  if (!drag.moved) return;
  scrollT = clamp(drag.s - dy*.012, 0, maxScroll());
  const now = performance.now(), dt = Math.max(1, now - drag.lt);
  drag.v = lerp(drag.v, -(e.clientY - drag.ly)*.012/dt, .4); drag.ly = e.clientY; drag.lt = now;   // scroll units per ms
});
addEventListener('pointerup', e => {
  if (!drag) return;
  if (!drag.moved && e.target === canvas){
    if (phase === 'open') sheathe();                                  // a tap outside the open blade's card puts it back on the rack
    else { aimAt(e); const h = pick(); if (h >= 0) choose(h); }
  }
  else if (drag.moved && performance.now() - drag.lt < 90) scrollT = clamp(scrollT + drag.v*260, 0, maxScroll());   // flick: glide on a little
  drag = null;
});
addEventListener('pointercancel', () => { drag = null; });
addEventListener('keydown', e => {
  if (['PageDown','PageUp',' '].includes(e.key) && edge.key(e, atStart, atEnd)) return;
  if (phase === 'open' && e.key === 'Escape'){ sheathe(); return; }
  if (phase === 'open' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){ e.preventDefault(); (e.key === 'ArrowDown' ? $('#dNext') : $('#dPrev')).click(); return; }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); focusI = clamp(focusI + (e.key === 'ArrowDown' ? 1 : -1), 0, visible.length - 1); hover = visible[focusI].i; scrollT = clamp(-visible[focusI].yT - 1.4, 0, maxScroll()); }
  if (e.key === 'Enter' && (document.activeElement === document.body || document.activeElement === canvas)) choose(hover >= 0 ? hover : visible[focusI] && visible[focusI].i);
});
$('#sheathe').addEventListener('click', () => sheathe());
$('#nextBtn').addEventListener('click', e => { e.preventDefault(); api.next(); });

const SPK = 70, spGeo = new T.BufferGeometry(), spPos = new Float32Array(SPK*3), spVel = [], spCol = new Float32Array(SPK*3);
for (let k=0;k<SPK;k++){ spPos[k*3+1] = 1e4; spVel.push({ x:0, y:0, z:0, life:0 }); }
spGeo.setAttribute('position', new T.BufferAttribute(spPos, 3)); spGeo.setAttribute('color', new T.BufferAttribute(spCol, 3));
const sparks = new T.Points(spGeo, new T.PointsMaterial({ size:.07, map:dot, vertexColors:true, transparent:true, depthWrite:false, blending:T.AdditiveBlending })); sparks.frustumCulled = false; scene.add(sparks);
function sparkBurst(q){
  if (reduce) return;
  q.k.updateWorldMatrix(true, false);
  const mouth = new T.Vector3(.1, .02, .05).applyMatrix4(q.k.matrixWorld);
  const col = q.ch === 3 ? [.6,.45,1] : q.ch === 0 ? [.9,.75,.6] : [1,.35,.4];
  for (let k=0;k<SPK;k++){ const v = spVel[k]; v.life = .4 + Math.random()*.5; const a = Math.random()*6.283, sp = 1 + Math.random()*3.2;
    v.x = -Math.abs(Math.cos(a))*sp - .5; v.y = Math.sin(a)*sp*.7 + .8; v.z = (Math.random()-.5)*sp;
    spPos.set([mouth.x, mouth.y, mouth.z], k*3); const w = Math.random() < .35 ? [1,1,1] : col; spCol.set(w, k*3); }
  spGeo.attributes.color.needsUpdate = true;
  q.gt = 1.6/.9*(.2/3.4);                         // start the glint right at the mouth
}
function stepSparks(dt){
  for (let k=0;k<SPK;k++){ const v = spVel[k]; if (v.life <= 0) continue; v.life -= dt; v.y -= 6*dt;
    spPos[k*3] += v.x*dt; spPos[k*3+1] += v.y*dt; spPos[k*3+2] += v.z*dt; if (v.life <= 0) spPos[k*3+1] = 1e4; }
  spGeo.attributes.position.needsUpdate = true;
}
function choose(i){
  if (i == null || i < 0 || (phase === 'open' && i === sel)) return;
  const switching = phase === 'open';
  sel = i; phase = 'open'; phaseT = 0; peek.classList.remove('on'); SND.shing(); sparkBurst(swords[i]);
  if (switching) snapshotOld();
  fill(A[i], i);
  document.body.classList.add('open');
  if (switching) cutOld(); else SND.clack();
  const j = visible.findIndex(q => q.i === i); if (j >= 0){ focusI = j; scrollT = clamp(-visible[j].yT - (wide() ? 1.4 : 1), 0, maxScroll()); }
  if (!switching) setTimeout(() => $('#sheathe').focus({ preventScroll:true }), 350);
}
// the cut line across the panel, in panel-relative fractions: from the left edge low to the right edge high
const CUT = { ax:0, ay:.72, bx:1, by:.22 };
let halves = null, cutRect = null;
function snapshotOld(){
  // two styled copies of the current project, stacked exactly over it inside the panel, one per side of the cut
  const det = $('#detail'), inner = det.querySelector('.inner'), dr = det.getBoundingClientRect(), r = inner.getBoundingClientRect();
  if (halves) halves.forEach(h => h.remove());
  halves = [0, 1].map(k => {
    const glow = document.createElement('div'); glow.className = 'half-glow';
    glow.style.cssText = `position:absolute;left:${r.left - dr.left}px;top:${r.top - dr.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:2;will-change:transform,opacity`;
    const clip = document.createElement('div');
    clip.style.cssText = `width:100%;height:100%;clip-path:${k ? `polygon(0 ${CUT.ay*100}%,100% ${CUT.by*100}%,100% 100%,0 100%)` : `polygon(0 0,100% 0,100% ${CUT.by*100}%,0 ${CUT.ay*100}%)`}`;
    const c = inner.cloneNode(true); c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id')); c.style.cssText = 'width:100%;height:100%;';
    clip.appendChild(c); glow.appendChild(clip);
    // a glowing edge only along the cut itself
    const y0 = CUT.ay*r.height, y1 = CUT.by*r.height, len = Math.hypot(r.width, y1 - y0), ang = Math.atan2(y1 - y0, r.width);
    const edge = document.createElement('div');
    edge.style.cssText = `position:absolute;left:0;top:${y0 - 1}px;width:${len}px;height:2px;background:#fff;transform-origin:0 50%;transform:rotate(${ang}rad);box-shadow:0 0 6px #fff, 0 0 16px rgba(229,36,59,.95), 0 0 34px rgba(229,36,59,.6);border-radius:2px`;
    glow.appendChild(edge);
    det.appendChild(glow); return glow;
  });
  cutRect = r;
}
function cutOld(){
  slashT = 0; SND.swish(); setTimeout(() => SND.impact(), 110);
  const inner = $('#detail .inner'); inner.getAnimations().forEach(a => a.cancel());
  // hide the new project until the halves have cleared it
  inner.animate([{ opacity:0, transform:'translateY(10px)' }, { opacity:0, transform:'translateY(10px)', offset:.58 }, { opacity:1, transform:'none' }], { duration:900, easing:'cubic-bezier(.2,.8,.2,1)' });
  const w = cutRect.width, h = cutRect.height;
  const dx = (CUT.bx - CUT.ax)*w, dy = (CUT.by - CUT.ay)*h, L = Math.hypot(dx, dy), tx = dx/L, ty = dy/L, nx = ty, ny = -tx;   // along the cut / away from it
  const hs = halves;
  hs.forEach((el, k) => {
    const s = k ? -1 : 1;                       // 0 = upper piece, 1 = lower piece
    const slide = 26, gap = 8;
    el.animate([
      { transform:'translate(0,0) rotate(0deg)', opacity:1 },
      { transform:`translate(${s*tx*slide + s*nx*gap}px, ${s*ty*slide + s*ny*gap}px) rotate(0deg)`, opacity:1, offset:.22 },      // the clean slip along the cut
      { transform:`translate(${s*tx*slide*1.6 + s*nx*gap*3}px, ${s*ty*slide*1.6 + s*ny*gap*3 + (k ? 150 : 70)}px) rotate(${s*(k ? -4 : 3)}deg)`, opacity:0 }   // then they fall away
    ], { duration:1050, easing:'cubic-bezier(.5,0,.6,1)', fill:'forwards' });
  });
  setTimeout(() => hs.forEach(el => el.remove()), 1100);
}
function fill(p, i){
  $('#dChap').innerHTML = `<b>${CH[p.c].k}</b>${esc(CH[p.c].name)} · ${num(i)} / ${pad(DATA.PROJECTS.length)}`;
  const words = p.t.split(' '); $('#dTitle').innerHTML = esc(words[0]) + (words.length > 1 ? ' <em>' + esc(words.slice(1).join(' ')) + '</em>' : '');
  $('#dImg').src = src(p); $('#dImg').alt = 'Screenshot of ' + p.t; $('#dNum').textContent = 'Blade ' + num(i);
  $('#dLine').textContent = lineFor(p);
  $('#dStack').innerHTML = p.s.map(s => '<span>' + esc(s) + '</span>').join('');
  $('#dLinks').innerHTML = (p.live ? `<a class="btn primary" href="${p.live}" target="_blank" rel="noopener">Live site ↗</a>` : '') + (p.code ? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Source ↗</a>` : '');
}
function sheathe(){
  if (phase !== 'open') return;
  phase = 'rack'; SND.clack(); sel = -1;
  document.body.classList.remove('open');
  if (halves){ halves.forEach(h => h.remove()); halves = null; }
}
$('#dPrev').addEventListener('click', () => { const j = visible.findIndex(q => q.i === sel); if (j > 0) choose(visible[j-1].i); });
$('#dNext').addEventListener('click', () => { const j = visible.findIndex(q => q.i === sel); if (j >= 0 && j < visible.length - 1) choose(visible[j+1].i); });
// a quick slash across the left column as the project cuts in
const cutfx = $('#cutfx'), cctx = cutfx.getContext('2d');
let slashT = 9;
function drawCut(dt){
  slashT += dt;
  const d = Math.min(devicePixelRatio, 2);
  cctx.clearRect(0, 0, cutfx.width, cutfx.height);
  if (slashT > .6 || reduce) return;
  const r = $('#detail').getBoundingClientRect();
  const R0 = cutRect || r, ax = R0.left - 40, ay = R0.top + R0.height*CUT.ay + (CUT.ay - CUT.by)*R0.height*(40/R0.width), bx = R0.right + 70, by = R0.top + R0.height*CUT.by - (CUT.ay - CUT.by)*R0.height*(70/R0.width);
  const k = ease(clamp(slashT/.14, 0, 1)), fade = 1 - clamp((slashT - .14)/.46, 0, 1);
  cctx.save(); cctx.globalAlpha = fade; cctx.lineCap = 'round';
  cctx.strokeStyle = 'rgba(229,36,59,.9)'; cctx.lineWidth = 12*d; cctx.shadowColor = '#e5243b'; cctx.shadowBlur = 34*d;
  cctx.beginPath(); cctx.moveTo(ax*d, ay*d); cctx.lineTo(lerp(ax, bx, k)*d, lerp(ay, by, k)*d); cctx.stroke();
  cctx.strokeStyle = '#fff'; cctx.lineWidth = 2.5*d; cctx.shadowBlur = 0; cctx.stroke();
  cctx.restore();
}

/* ---------- loop ---------- */
function resize(){ const d = Math.min(devicePixelRatio, 2); R.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix(); cutfx.width = innerWidth*d; cutfx.height = innerHeight*d; }
addEventListener('resize', resize);
const camHome = new T.Vector3(), camAim = new T.Vector3(), lookHome = new T.Vector3(), lookAim = new T.Vector3(), tmp = new T.Vector3();
let camK = 0, time0 = 0, rackX = 1.6, giantCh = -1, giantT = 0;
function frame(dt, time){
  phaseT += dt; stepSparks(dt);
  ptr.sx = lerp(ptr.sx, ptr.nx, .06); ptr.sy = lerp(ptr.sy, ptr.ny, .06);
  scrollY = lerp(scrollY, scrollT, 1 - Math.pow(.004, dt));
  const W = wide();
  rackX = lerp(rackX, W ? (phase === 'open' ? 3.5 : 1.6) : .5, 1 - Math.pow(.005, dt));   // slide right to make room for the project panel
  rack.position.set(rackX, (W ? 2.6 : 1.4) + scrollY, 0);
  rack.rotation.y = lerp(rack.rotation.y, (phase === 'rack' ? -.24 : -.12) + ptr.sx*.1*(phase === 'rack' ? 1 : .2), .06);
  rack.rotation.x = lerp(rack.rotation.x, ptr.sy*.05*(phase === 'rack' ? 1 : .2), .06);
  // the stand grows with the swords on it
  const top = .5, bot = rackBottom - .45, h = top - bot;
  posts.forEach(p => { p.scale.y = h + .5; p.position.y = (top + bot)/2; });
  capTop.position.set(.45, top + .25, -.18); capBot.position.set(.45, bot - .25, -.18);
  cords.forEach((r, k) => { const row = Math.floor(k/2), y = top - row*1.3 - .3; r.visible = y > bot; r.position.y = y; });
  lantern.position.set(-2.5, -scrollY + 1.2, 3);
  lantern.intensity = 2.4 + Math.sin(time*7)*.15 + Math.sin(time*13)*.1;

  // camera: home view of the rack, or dolly onto the chosen sword
  camHome.set(W ? 1.1 : .35, W ? .1 : -1.1, W ? 10.5 : 16); lookHome.set(W ? 1.1 : .35, W ? .1 : -1.1, 0);
  const s = sel >= 0 ? swords[sel] : null;
  const wantCam = phase === 'open' ? .18 : 0;
  camK = lerp(camK, wantCam, 1 - Math.pow(.01, dt));
  if (s){ s.k.updateWorldMatrix(true, false); tmp.set(.4, 0, 0).applyMatrix4(s.k.matrixWorld); camAim.copy(tmp).add(new T.Vector3(.6, .25, 4.2)); lookAim.copy(tmp); }
  cam.position.lerpVectors(camHome, s ? camAim : camHome, ease(camK));
  cam.lookAt(tmp.lerpVectors(lookHome, s ? lookAim : lookHome, ease(camK)));

  if (ptr.in && !drag){ const h = pick(); if (h !== hover && h >= 0){ focusI = visible.findIndex(q => q.i === h); SND.shing(); } hover = h; }
  canvas.style.cursor = hover >= 0 ? 'pointer' : (drag ? 'grabbing' : 'grab');

  const kk = 1 - Math.pow(.0005, dt);
  swords.forEach(q => {
    const t0 = q.dropDelay; q.drop = booted ? clamp(1 - (time - time0 - t0)/.55, 0, 1) : 1;
    if (q.drop === 0 && !q.landed){ q.landed = true; if (q.visT) SND.clack(); }
    const dropY = q.drop > 0 ? (q.drop*q.drop)*5 : 0;
    q.vis = lerp(q.vis, q.visT * (1 - q.drop*.9), 1 - Math.pow(.003, dt));
    q.y = lerp(q.y, q.yT, 1 - Math.pow(.004, dt));
    const dim = (phase === 'open' && sel !== q.i) ? .45 : 1;
    q.lift = lerp(q.lift, sel === q.i ? 1 : 0, 1 - Math.pow(.008, dt));
    const L = ease(q.lift);
    q.k.position.set(OFFX + L*.55, q.y + dropY + L*(.38 + Math.sin(time*1.6)*.05), lerp(-2.4, 0, q.visT ? 1 : q.vis) + (hover === q.i && !L ? .38 : 0) + L*.95);
    q.k.rotation.set(L*(.3 + Math.sin(time*.8)*.16), L*(.22 + Math.sin(time*.6)*.1), L*(-.05 + Math.sin(time*1.1)*.03));   // turns to show the blade, floats
    q.k.visible = q.vis > .02;
    q.mats.forEach(mt => mt.opacity = q.vis * dim);
    const target = sel === q.i ? 1.35 : hover === q.i ? .7 : 0;
    q.draw = lerp(q.draw, target, sel === q.i ? 1 - Math.pow(.0002, dt) : kk);
    q.pivot.rotation.z = -q.draw/RR;
    if (EDGE_COL[q.ch]) q.bladeM.emissiveIntensity = (.45 + .25*Math.sin(time*2 + q.i)) * (q.draw > .1 ? 1.8 : 1);
    else if (q.ch === 1) q.bladeM.emissive.setRGB(sel === q.i ? .1 : 0, 0, 0);
    q.gt += dt; const gx = ((q.gt*.9) % 1.6)/1.6*3.4 - .2;
    q.glint.position.x = gx; q.glint.position.y = bendY(gx) - .01; q.glint.material.opacity = q.draw > .2 && q.ch > 0 ? Math.sin(clamp(gx/3,0,1)*Math.PI)*q.vis : 0;
    q.tagPivot.rotation.z = Math.sin(time*1.4 + q.sw)*.06 + (hover === q.i ? Math.sin(time*9)*.12 : 0);
  });
  labels.forEach(l => { l.vis = lerp(l.vis, l.visT * (booted ? clamp((time - time0 - .2)/.6, 0, 1) : 0), 1 - Math.pow(.01, dt)); l.y = lerp(l.y, l.yT, 1 - Math.pow(.004, dt)); l.mesh.position.set(OFFX + 1.5, l.y, .05); l.mesh.material.uniforms.opacity.value = l.vis * (phase === 'open' ? .5 : 1); l.mesh.visible = l.vis > .02;
    // brush the label in the first time it comes on screen
    if (!l.seen && l.vis > .3){ l.mesh.updateWorldMatrix(true, false); tmp.setFromMatrixPosition(l.mesh.matrixWorld).project(cam); if (tmp.y < .9 && tmp.y > -1) l.seen = true; }
    if (l.seen) l.rev = Math.min(1, l.rev + dt*(reduce ? 99 : 1.1));
    l.mesh.material.uniforms.reveal.value = l.rev; });

  // hover preview pinned to the hovered sword's tag
  if (hover >= 0 && hover !== sel && W){
    const q = swords[hover], p = A[hover];
    if (peek.dataset.i != hover){ peek.dataset.i = hover; peek.querySelector('img').src = src(p); peek.querySelector('small').textContent = CH[p.c].k + ' ' + CH[p.c].name + ' · ' + num(hover); peek.querySelector('b').textContent = p.t; peek.querySelector('p').textContent = p.s.join(' · '); }
    q.tag.updateWorldMatrix(true, false); tmp.setFromMatrixPosition(q.tag.matrixWorld).project(cam);
    const x = (tmp.x*.5 + .5)*innerWidth + 30, y = clamp((-tmp.y*.5 + .5)*innerHeight - 30, 70, innerHeight - 240);
    peek.style.transform = `translate(${Math.min(x, innerWidth - 260)}px, ${y}px)`; peek.classList.add('on');
  } else peek.classList.remove('on');

  // chapter nav highlight, scroll bar, ending
  let cur = 0; labels.forEach((l, k) => { if (l.visT && -l.yT - 1.6 <= scrollY) cur = k; });
  document.querySelectorAll('#chapters button').forEach((b, k) => b.setAttribute('aria-current', k === cur));
  const ms = maxScroll(), bar = $('#scroll i');
  const hpct = ms ? clamp(3.2/(-rackBottom + 1), .12, 1)*100 : 100; bar.style.height = hpct + '%'; bar.style.top = (ms ? (scrollY/ms)*(100 - hpct) : 0) + '%';
  $('#ending').classList.toggle('on', ms === 0 || scrollY > ms - .25);
  // the big backdrop character becomes the current chapter's numeral, brushed in each time it changes
  if (cur !== giantCh){ giantCh = cur; giantT = time; $('#giant').textContent = CH[cur].k; }
  $('#giant').style.setProperty('--ink', clamp((time - giantT)/1.4, 0, 1));
}

(async function boot(){
  try { await Promise.race([Promise.all(['400 62px Anton','600 34px "JetBrains Mono"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2000))]); } catch(_) {}
  swords.forEach(s => { const m = s.k.children[0].material[4]; m.map.dispose(); m.map = sayaTex(s.p, s.i); m.needsUpdate = true; s.tag.material.map.dispose(); s.tag.material.map = tagTex(s.i); s.tag.material.needsUpdate = true; });
  labels.forEach((l, k) => { l.mesh.material.uniforms.map.value = chapterTex(k, true); });
  resize();
  const ld = $('#loader'); ld.style.opacity = 0; setTimeout(() => ld.remove(), 650);
  const clock = new T.Clock();
  booted = true; time0 = 0; if (reduce) swords.forEach(s => s.dropDelay = -10);
  (function loop(){
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05);
    frame(dt, clock.elapsedTime);
    R.render(scene, cam);
    drawCut(dt);
  })();
})();

  /* ======== /original ======== */
}
