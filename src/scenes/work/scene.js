// Ported from the approved draft work/index.html.
// The original code runs inside mount() with a scoped document, gated listeners and a pausable rAF.
import { THREE, MeshoptDecoder } from '../../engine/three.js';
import { createScope } from '../../engine/scope.js';
import { liveStars } from '../../engine/stars.js';
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
const lerp = (a,b,t) => a + (b-a)*t, clamp = (x,a,b) => Math.min(b, Math.max(a, x));
const ease = f => f*f*(3-2*f);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const P = DATA.FEATURED.map(p => ({ a:p.split[0], b:p.split[1] || '', k:p.kind, d:p.about, s:p.stack, live:p.live, code:p.code, img:p.img, sfx:p.sfx }));
const KANJI = ['壱','弐','参','肆','伍','陸','漆','捌','玖','拾','十一','十二'];
const N = P.length, src = p => 'img/' + p.img + '.jpg';
const T_MIN = -1, T_MAX = N;   // -1 intro, 0..N-1 stars, N = the ink map
const wide = () => innerWidth > 820;

/* ---------- manga page ---------- */
const mp = $('#mp');
function pageHTML(p, i){
  const links = (p.live ? `<a class="btn primary" href="${p.live}" target="_blank" rel="noopener">Live ↗</a>` : `<span class="btn" aria-disabled="true">No live site</span>`) +
                (p.code ? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Code ↗</a>` : `<span class="btn" aria-disabled="true">Private code</span>`);
  return `
    <div class="pn hero"><div class="shot" style="background-image:url(${src(p)})" role="img" aria-label="Screenshot of ${esc(p.a+' '+p.b)}"></div><div class="halftone"></div><div class="sfx" aria-hidden="true">${p.sfx}</div></div>
    <div class="pn title"><div class="pnum">Chapter ${pad(i+1)} · ${esc(p.k)}</div><h3 class="ptitle${Math.max(p.a.length, p.b.length) > 8 ? ' long' : ''}">${esc(p.a)}${p.b ? '<em>'+esc(p.b)+'</em>' : ''}</h3></div>
    <div class="pn bubble"><div class="speech"><small>The mission</small>${esc(p.d)}</div></div>
    <div class="pn strip">
      <div class="crop"><span class="lbl">Close-up</span><div class="shot" style="background-image:url(${src(p)})"></div></div>
      <div class="stackp"><span class="lbl">Weapons used</span><div class="chips">${p.s.map(s => '<span>'+esc(s)+'</span>').join('')}</div></div>
      <div class="links"><span class="lbl">Go</span>${links}</div>
    </div>`;
}
let pageI = -1, pageOpen = false;
function openPage(i){
  if (pageI !== i){ mp.innerHTML = pageHTML(P[i], i); pageI = i; void mp.offsetWidth; }
  if (!pageOpen){ mp.classList.add('open'); pageOpen = true; burst(i); }
}
function closePage(){ if (!pageOpen) return; mp.classList.remove('open'); pageOpen = false; }
mp.addEventListener('pointermove', e => {
  const pn = e.target.closest('.pn'); if (!pn) return;
  const r = pn.getBoundingClientRect();
  pn.style.setProperty('--fx', ((e.clientX - r.left)/r.width*100) + '%');
  pn.style.setProperty('--fy', ((e.clientY - r.top)/r.height*100) + '%');
});

/* ---------- renderer & scene ---------- */
const canvas = $('#gl');
const R = new T.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
const LOW = innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;
R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2)); R.outputEncoding = T.sRGBEncoding;
const scene = new T.Scene(); scene.background = new T.Color(0x050507).convertSRGBToLinear(); scene.fog = new T.FogExp2(0x050507, .013);
const cam = new T.PerspectiveCamera(55, 1, .1, 1600);
scene.add(new T.HemisphereLight(0xb9b0d0, 0x120608, .55));
const key = new T.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 8); scene.add(key);
const rimV = new T.DirectionalLight(0x8b5cf6, 1.1); rimV.position.set(-6, 2, -5); scene.add(rimV);
const rimR = new T.DirectionalLight(0xe5243b, .9); rimR.position.set(2, -5, 3); scene.add(rimR);

function cv(w, h, draw){ const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return new T.CanvasTexture(c); }
function radialTex(stops){ return cv(128, 128, x => { const g = x.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col]) => g.addColorStop(o,col)); x.fillStyle = g; x.fillRect(0,0,128,128); }); }
const add = { transparent:true, depthWrite:false, blending:T.AdditiveBlending };

/* ---------- the route: the strokes of 道, in stroke order ---------- */
const S = 15;                                    // figure units → scene units (bigger = more room between projects)
const SK = S/5;
const WAY = [
  { r:.2,  p:[[-1.6,6.4],[-1.05,5.85],[-.8,5.3]] },
  { r:.2,  p:[[2.7,6.5],[2.25,5.9],[1.85,5.35]] },
  { r:.17, p:[[-3.2,4.6],[0,4.75],[4.4,4.85]] },
  { r:.15, p:[[.9,4.6],[.55,4.1],[.15,3.6]] },
  { r:.17, p:[[-1.9,3.4],[-1.95,.4],[-1.9,-2.7]] },
  { r:.17, p:[[-1.9,3.4],[1.2,3.45],[3.4,3.45],[3.35,.4],[3.3,-2.7],[2.85,-2.35]] },
  { r:.13, p:[[-1.7,1.75],[.7,1.8],[3.1,1.8]] },
  { r:.13, p:[[-1.7,.05],[.7,.1],[3.1,.1]] },
  { r:.14, p:[[-1.7,-2.45],[.7,-2.4],[3.1,-2.4]] },
  { r:.2,  p:[[-6.4,4.8],[-5.85,4.25],[-5.4,3.75]] },
  { r:.15, p:[[-7.3,1.9],[-5.6,1.85],[-5.1,1.7],[-6.1,-.4],[-5.6,-1.2],[-5.2,-2.2]] },
  { r:.24, p:[[-5.2,-2.2],[-4.6,-3.9],[-2.5,-5.0],[1.5,-5.35],[5.5,-5.4],[8.2,-5.2]] },
];
// where each project's planet sits: [stroke, u], in flight order
const STOPS = P.length === 7 ? [[11,.07],[11,.21],[11,.35],[11,.49],[11,.63],[11,.79],[11,.95]]   // the approved spacing
  : P.map((_, i) => [11, P.length === 1 ? .5 : .07 + i*(.88/(P.length - 1))]);   // all on the calm final sweep

function strokeMat(radius, seed, len){
  return new T.ShaderMaterial({
    uniforms:{ painted:{ value:0 }, R:{ value:radius }, seed:{ value:seed }, len:{ value:len }, mapK:{ value:0 }, glow:{ value:0 } }, transparent:true, depthWrite:false, side:T.DoubleSide,
    vertexShader:`varying vec2 vUv; varying float vW; uniform float R, seed, mapK;
      void main(){ vUv = uv; float u = uv.x;
        float taper = pow(sin(3.14159*clamp(u*.94 + .03, 0., 1.)), .38) * (1.15 - .35*u);
        float w = taper * (.62 + .38*(.5 + .5*sin(u*19. + seed))*(.6 + .4*sin(u*7.3 + seed*2.)));
        vW = w;
        vec3 p = position + normal * R * (w*(1. + mapK*9.5) - 1.);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
    fragmentShader:`varying vec2 vUv; varying float vW; uniform float painted, seed, len, glow;
      float h(float n){ return fract(sin(n)*43758.5453); }
      void main(){ float u = vUv.x;
        if (u > painted){
          // faint dotted guide just ahead of the brush only, so the full character stays a surprise
          float ahead = (u - painted) * len;
          float d = step(.55, fract(u*len*1.6));
          discard;
        }
        float lane = floor(vUv.y*22.);
        float n = h(lane*12.9 + floor(u*len*3.)*.7 + seed);
        float dry = smoothstep(.2, .95, 1. - vW) + smoothstep(.8, 1., u)*.5;
        float hair = step(n, 1. - dry*.7);
        float edge = .7 + .3*h(lane*3.1 + seed);
        vec3 ink = mix(vec3(.28,.015,.05), vec3(.74,.045,.11), edge);
        float tip = smoothstep(1.6/len, 0., painted - u) * step(painted, .999);
        ink = mix(ink, vec3(1.6,.55,.6), tip);
        ink += vec3(.7,.05,.12)*glow;
        gl_FragColor = vec4(ink, hair); }`
  });
}
const route = [];          // segments: strokes (painted) and lifts (brush in the air)
const strokes = WAY.map((w, k) => {
  const pts = w.p.map(([x,y]) => new T.Vector3(x*S, y*S, 0));
  const curve = new T.CatmullRomCurve3(pts, false, 'centripetal');
  const len = curve.getLength();
  const mat = strokeMat(w.r*5*.24, k*1.7 + 1, len);
  scene.add(new T.Mesh(new T.TubeGeometry(curve, Math.max(60, Math.round(len*10)), w.r*5*.24, 10, false), mat));
  return { curve, len, mat };
});
// you fly only the final sweep of 道; the brush writes every other stroke once you zoom out
const SWEEP = strokes[strokes.length-1];
route.push({ lift:false, st:SWEEP, d0:0, len:SWEEP.len }); SWEEP.d0 = 0;
strokes.forEach(st => { st.w = 0; });
const WRITE = strokes.slice(0, -1);              // real stroke order, written on the map
let writeT = 0;
const LTOT = SWEEP.len;
function routeAt(d, out){
  d = clamp(d, 0, LTOT);
  let seg = route[route.length-1];
  for (const sg of route){ if (d <= sg.d0 + sg.len){ seg = sg; break; } }
  const k = clamp((d - seg.d0)/seg.len, 0, 1);
  if (seg.lift){ const e = ease(k); out.lerpVectors(seg.a, seg.b, e); out.z += Math.sin(k*Math.PI)*seg.h; }
  else seg.st.curve.getPointAt(k, out);
  return out;
}
function routeTangent(d, out){ const a = routeAt(d - .3, new T.Vector3()), b = routeAt(d + .3, new T.Vector3()); return out.subVectors(b, a).normalize(); }
const stopD = STOPS.map(([si, u]) => strokes[si].d0 + strokes[si].len*u);
const stars = STOPS.map(([si, u]) => strokes[si].curve.getPointAt(u).clone());
function dAt(t){
  if (t <= 0) return lerp(0, stopD[0], ease(clamp(t+1, 0, 1)));
  if (t >= N-1) return lerp(stopD[N-1], LTOT, ease(clamp(t-(N-1), 0, 1)));
  const i = Math.floor(t), f = t - i; return lerp(stopD[i], stopD[i+1], ease(f));
}
const tipGlow = new T.Sprite(new T.SpriteMaterial({ map: radialTex([[0,'rgba(255,255,255,1)'],[.15,'rgba(255,140,150,.9)'],[.5,'rgba(229,36,59,.25)'],[1,'rgba(229,36,59,0)']]), ...add }));
tipGlow.scale.setScalar(1.1); scene.add(tipGlow);
// a fude (calligraphy brush) that rides the tip and paints as you scroll
const brush = new T.Group(); scene.add(brush);
const brushBody = new T.Group(); brush.add(brushBody);
const bamboo = new T.MeshStandardMaterial({ color:0x1b1419, roughness:.55, metalness:.1 });
const handle = new T.Mesh(new T.CylinderGeometry(.042, .05, 1.55, 20), bamboo); handle.position.y = 1.12; brushBody.add(handle);
[.55, 1.0, 1.72].forEach(y => { const b = new T.Mesh(new T.CylinderGeometry(.054, .054, .035, 20), new T.MeshStandardMaterial({ color:0x8e0f22, roughness:.5 })); b.position.y = y; brushBody.add(b); });
const cap = new T.Mesh(new T.SphereGeometry(.045, 16, 8), bamboo); cap.position.y = 1.9; brushBody.add(cap);
const cord = new T.Mesh(new T.TorusGeometry(.05, .008, 8, 24), new T.MeshBasicMaterial({ color:new T.Color(1.4,.2,.3) })); cord.position.y = 1.96; cord.rotation.x = Math.PI/2; brushBody.add(cord);
const ferrule = new T.Mesh(new T.CylinderGeometry(.062, .056, .2, 20), new T.MeshStandardMaterial({ color:0x2a2530, roughness:.45, metalness:.5 })); ferrule.position.y = .3; brushBody.add(ferrule);
const tuftPivot = new T.Group(); tuftPivot.position.y = .22; brushBody.add(tuftPivot);
const prof = [[0,-.42],[.012,-.4],[.03,-.33],[.052,-.2],[.068,-.08],[.07,0],[.06,.04]].map(([x,y]) => new T.Vector2(x, y));
const tuftGeo = new T.LatheGeometry(prof, 28);
{ const pos = tuftGeo.attributes.position, col = new Float32Array(pos.count*3);
  for (let k=0;k<pos.count;k++){ const y = pos.getY(k), w = clamp((-y - .18)/.22, 0, 1); col[k*3] = lerp(.06, 1.0, w); col[k*3+1] = lerp(.05, .1, w); col[k*3+2] = lerp(.07, .18, w); }
  tuftGeo.setAttribute('color', new T.BufferAttribute(col, 3)); }
const tuft = new T.Mesh(tuftGeo, new T.MeshStandardMaterial({ vertexColors:true, roughness:.85 })); tuftPivot.add(tuft);
brushBody.position.y = .2;   // tip sits at the brush origin
let brushPress = 0, brushLift = 1, brushOnEnso = 0; const ePt = new T.Vector3(), ePt2 = new T.Vector3();
const bUp = new T.Vector3(), bTan = new T.Vector3(), bQ = new T.Quaternion(), Y = new T.Vector3(0,1,0);
// ink drops shed by the brush as it travels
const DROPS = 220, dg = new T.BufferGeometry(), dpos = new Float32Array(DROPS*3), dlife = new Float32Array(DROPS);
dg.setAttribute('position', new T.BufferAttribute(dpos, 3));
const dot = radialTex([[0,'#fff'],[.25,'rgba(255,255,255,.8)'],[1,'rgba(255,255,255,0)']]);
const dropMat = new T.PointsMaterial({ size:.14, map:dot, color:0xc8142f, transparent:true, opacity:.9, depthWrite:false });
scene.add(new T.Points(dg, dropMat));
let dropI = 0;

// star field
const SC = LOW ? 3500 : 8000, sg = new T.BufferGeometry(), sp = new Float32Array(SC*3), sc = new Float32Array(SC*3);
for (let k=0;k<SC;k++){
  { const r = 280 + Math.random()*320, th = Math.random()*6.283, ph = Math.acos(2*Math.random() - 1); sp[k*3] = r*Math.sin(ph)*Math.cos(th); sp[k*3+1] = r*Math.sin(ph)*Math.sin(th); sp[k*3+2] = r*Math.cos(ph); if (sp[k*3+2] > 0 && Math.random() < .5) sp[k*3+2] *= -1; }
  const r = Math.random(), col = r < .07 ? [.9,.14,.23] : r < .22 ? [.55,.36,.96] : [.93,.92,.96]; const b = .35 + Math.random()*.6;
  sc.set(col.map(v => v*b), k*3);
}
sg.setAttribute('position', new T.BufferAttribute(sp,3)); sg.setAttribute('color', new T.BufferAttribute(sc,3));
// the sky sits far beyond the fog (which is for the planets and the thread), so it must not be fogged to black
const sky = new T.Points(sg, new T.PointsMaterial({ size:2.1, map:dot, vertexColors:true, fog:false, ...add })); scene.add(sky);
const skyLive = liveStars(sky, { spin:.0015 });
const neb = radialTex([[0,'rgba(255,255,255,.5)'],[.45,'rgba(255,255,255,.14)'],[1,'rgba(255,255,255,0)']]);
for (let k=0;k<16;k++){
  const s = new T.Sprite(new T.SpriteMaterial({ map:neb, color: k%3 ? 0x6d3fe0 : 0x9e1027, opacity:.045 + Math.random()*.05, fog:false, ...add }));
  { const a = Math.random()*6.283, r = 160 + Math.random()*110; s.position.set(Math.cos(a)*r, Math.sin(a)*r*.7, -10 + Math.random()*30); } s.scale.setScalar(40 + Math.random()*50); scene.add(s);
}
// faint star-chart grid that shows up on the map
const grid = new T.GridHelper(700, 90, 0x8b5cf6, 0x8b5cf6);
grid.material.transparent = true; grid.material.opacity = 0; grid.material.depthWrite = false;
grid.rotation.x = Math.PI/2; grid.position.set(0, 0, -1.2); scene.add(grid);

/* ---------- shared orb assets ---------- */
const ensoTex = cv(512, 512, (x) => {
  let sd = 11; const r = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  x.lineCap = 'round';
  // wet pool where the brush first lands
  x.fillStyle = 'rgba(255,255,255,.95)';
  { const a = -1.2, rr = 190; x.beginPath(); x.ellipse(256 + Math.cos(a)*rr, 256 + Math.sin(a)*rr, 24, 17, a + 1.2, 0, 7); x.fill(); }
  for (let pass=0; pass<3; pass++){
    for (let k=0;k<140;k++){
      const t = k/140, a0 = -1.2 + t*5.5, a1 = a0 + .05;
      if (t > .62 && r() < (t - .62)*1.9) continue;                    // dry-brush breakup near the end
      const rad = 188 + 13*Math.sin(t*6.1 + pass*.8) + 7*Math.sin(t*15.3) + (pass - 1)*7 + (r()-.5)*3;
      const cx = 256 + Math.sin(t*3.1)*7, cy = 256 + Math.cos(t*2.3)*7;
      x.strokeStyle = `rgba(255,255,255,${pass ? .22 + r()*.3 : .6 + .4*Math.sin(t*Math.PI)})`;
      x.lineWidth = pass ? 2 + r()*5 : 5 + 30*Math.sin(Math.min(1, t*1.25)*Math.PI*.92) * (.65 + r()*.7);
      x.beginPath(); x.arc(cx, cy, rad, a0, a1); x.stroke();
    }
  }
  // flicked tail and spatter
  for (let k=0;k<70;k++){ const a = -1.2 + 5.5 + r()*.45, rr = 190 + (r()-.5)*44; x.fillStyle = `rgba(255,255,255,${r()*.8})`; x.beginPath(); x.arc(256+Math.cos(a)*rr, 256+Math.sin(a)*rr, r()*3.4+.6, 0, 7); x.fill(); }
});
const coronaBrush = cv(512, 512, (x) => {
  let sd = 23; const r = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  x.lineCap = 'round';
  for (let k=0;k<190;k++){
    const a = r()*6.283, r0 = 96 + r()*10, r1 = r0 + 16 + r()*r()*95;
    x.strokeStyle = `rgba(255,255,255,${.15 + r()*.55})`; x.lineWidth = 1.2 + r()*5;
    x.beginPath(); x.moveTo(256 + Math.cos(a)*r0, 256 + Math.sin(a)*r0);
    x.quadraticCurveTo(256 + Math.cos(a + .06)*(r0+r1)/2, 256 + Math.sin(a + .06)*(r0+r1)/2, 256 + Math.cos(a + .1)*r1, 256 + Math.sin(a + .1)*r1); x.stroke();
  }
});
const blotTex = cv(256, 256, (x) => {
  let sd = 41; const r = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  x.fillStyle = '#030205';
  x.beginPath(); for (let k=0;k<=48;k++){ const a = k/48*6.283, rr = 96 + Math.sin(a*5)*4 + (r()-.5)*7; k ? x.lineTo(128+Math.cos(a)*rr, 128+Math.sin(a)*rr) : x.moveTo(128+Math.cos(a)*rr, 128+Math.sin(a)*rr); } x.fill();
  for (let k=0;k<26;k++){ const a = r()*6.283, d = 92 + r()*22, rr = 2 + r()*7; x.beginPath(); x.arc(128+Math.cos(a)*d, 128+Math.sin(a)*d, rr, 0, 7); x.fill(); }
});
const ensoMat = (color, opacity, additive) => new T.ShaderMaterial({
  uniforms:{ map:{ value:ensoTex }, color:{ value:new T.Color(color) }, prog:{ value:0 }, opacity:{ value:opacity } },
  transparent:true, depthWrite:false, side:T.DoubleSide, blending: additive ? T.AdditiveBlending : T.NormalBlending,
  vertexShader:'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader:`uniform sampler2D map; uniform vec3 color; uniform float prog, opacity; varying vec2 vUv;
    void main(){ vec2 c = vec2(vUv.x - .5, .5 - vUv.y); float th = atan(c.y, c.x);
      float rel = mod(th + 1.2, 6.28318) / 5.5;
      float a = texture2D(map, vUv).a;
      if (prog < .999) a *= smoothstep(prog + .015, prog, rel);
      gl_FragColor = vec4(color, a * opacity); }`
});
const corona = radialTex([[0,'rgba(229,36,59,0)'],[.36,'rgba(229,36,59,0)'],[.4,'rgba(255,150,160,1)'],[.47,'rgba(229,36,59,.75)'],[.7,'rgba(139,92,246,.18)'],[1,'rgba(139,92,246,0)']]);
const redGlow = radialTex([[0,'rgba(255,120,130,1)'],[.2,'rgba(229,36,59,.85)'],[.55,'rgba(160,16,40,.25)'],[1,'rgba(160,16,40,0)']]);
const flare = radialTex([[0,'rgba(255,255,255,1)'],[.12,'rgba(255,230,235,.9)'],[.4,'rgba(229,36,59,.25)'],[1,'rgba(229,36,59,0)']]);

const planetMat = new T.ShaderMaterial({
  uniforms:{ time:{ value:0 }, seed:{ value:0 }, heat:{ value:0 }, shot:{ value:null }, useShot:{ value:0 } },
  vertexShader:`varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv;
    void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }`,
  fragmentShader:`varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; uniform float time, seed, heat, useShot; uniform sampler2D shot;
    float hash(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
    float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
      return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z); }
    float fbm(vec3 p){ float a = .5, s = 0.; for (int k=0;k<5;k++){ s += a*noise(p); p = p*2.03 + 1.7; a *= .5; } return s; }
    void main(){
      vec3 q = vP*2.1 + seed;
      float land = fbm(q + fbm(q*1.3)*.8);                       // warped ink-wash continents
      if (useShot > .5){ vec3 sc = texture2D(shot, vec2(vUv.x, vUv.y*.9 + .05)).rgb; float lum = dot(sc, vec3(.3,.59,.11)); land = mix(land, 1. - lum*.85, .55); }   // the project's screenshot, as ink
      float lam = max(dot(vN, normalize(vec3(-.45,.55,.7))), 0.);
      vec3 sea = vec3(.018,.016,.026), ground = vec3(.085,.07,.095);
      vec3 base = mix(sea, ground, smoothstep(.42, .62, land));
      base += vec3(.05,.035,.07) * smoothstep(.66, .8, land);   // pale ridges
      base *= .35 + lam*.9;
      // glowing crimson fissures, brighter as you approach (heat)
      float r = 1. - abs(noise(vP*5. + seed*1.7)*2. - 1.);
      float crack = smoothstep(.93, .985, r) * smoothstep(.45, .6, land);
      float pulse = .6 + .4*sin(time*2.2 + seed);
      vec3 col = base + vec3(1.2,.12,.2) * crack * (.25 + heat*1.1) * pulse;
      // storm band + rim light
      col += vec3(.5,.34,1.) * .06 * smoothstep(.02, 0., abs(vP.y - .25*sin(vP.x*3. + seed))) ;
      float f = smoothstep(.35, 1., pow(1. - max(dot(vN, vV), 0.), 2.0));
      col += vec3(.9,.08,.16)*pow(f,1.6)*.85 + vec3(.5,.34,1.)*pow(f,7.)*.5;
      gl_FragColor = vec4(col, 1.); }`
});
const ringTex = cv(512, 512, (x) => {
  let sd = 5; const r = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  x.lineCap = 'round';
  for (let k=0;k<46;k++){
    const rad = 256*(.66 + r()*.33), a0 = r()*6.283, len = 1.5 + r()*4.5;
    x.strokeStyle = `rgba(255,255,255,${.15 + r()*.55})`; x.lineWidth = 1 + r()*7;
    x.beginPath(); x.arc(256, 256, rad, a0, a0 + len); x.stroke();
  }
});
const kanjiTex = KANJI.map(ch => cv(256, 256, (x) => {
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '800 200px "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif'; x.fillText(ch, 128, 140);
}));
const moonGeo = new T.SphereGeometry(1, 24, 16);
const magma = new T.MeshBasicMaterial({ color: new T.Color(1.25, .12, .22), side:T.DoubleSide });
const hemiGeo = [new T.SphereGeometry(.95, 64, 48, 0, Math.PI), new T.SphereGeometry(.95, 64, 48, Math.PI, Math.PI)];
const capGeo = new T.CircleGeometry(.95, 64);
const slashGeo = new T.PlaneGeometry(.05, 3.6);

function tsubaGeo(){
  const sh = new T.Shape(); sh.absarc(0, 0, 1, 0, Math.PI*2, false);
  const slot = new T.Path(); slot.moveTo(0, .36); slot.quadraticCurveTo(.12, 0, 0, -.36); slot.quadraticCurveTo(-.12, 0, 0, .36); sh.holes.push(slot);
  [-1, 1].forEach(s => { const h = new T.Path(); h.absellipse(s*.47, 0, .09, .24, 0, Math.PI*2, true); sh.holes.push(h); });
  for (let k=0;k<4;k++){ const a = Math.PI/4 + k*Math.PI/2; const h = new T.Path(); h.absarc(Math.cos(a)*.72, Math.sin(a)*.72, .085, 0, Math.PI*2, true); sh.holes.push(h); }
  for (let k=0;k<8;k++){ const a = k*Math.PI/4 + Math.PI/8; const h = new T.Path(); h.absarc(Math.cos(a)*.86, Math.sin(a)*.86, .035, 0, Math.PI*2, true); sh.holes.push(h); }
  const g = new T.ExtrudeGeometry(sh, { depth:.1, bevelEnabled:true, bevelThickness:.035, bevelSize:.03, bevelSegments:2, curveSegments:56 });
  g.center(); return g;
}
const TSUBA = tsubaGeo();
const tsubaMat = new T.MeshStandardMaterial({ color:0x17141b, metalness:.45, roughness:.62 });
const tsubaRim = new T.Mesh(new T.TorusGeometry(1.02, .03, 12, 96), new T.MeshBasicMaterial({ color:new T.Color(1.8,.25,.38) }));

// burst sprites
const quad = new T.PlaneGeometry(1, 1);
const streakTex = cv(256, 32, (x, w, h) => {
  const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(229,36,59,0)'); g.addColorStop(.6, 'rgba(229,36,59,.9)'); g.addColorStop(.9, 'rgba(255,170,180,1)'); g.addColorStop(1, 'rgba(255,255,255,1)');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, h/2); x.quadraticCurveTo(w*.7, h*.18, w*.97, h*.32); x.quadraticCurveTo(w, h/2, w*.97, h*.68); x.quadraticCurveTo(w*.7, h*.82, 0, h/2); x.fill();
});
const inkTex = cv(128, 128, (x) => {
  x.fillStyle = '#fff'; let sd = 7; const r = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  x.beginPath(); for (let k=0;k<=24;k++){ const a = k/24*6.283, rr = 34 + r()*14; k ? x.lineTo(64+Math.cos(a)*rr, 64+Math.sin(a)*rr) : x.moveTo(64+Math.cos(a)*rr, 64+Math.sin(a)*rr); } x.fill();
  for (let k=0;k<9;k++){ const a = r()*6.283, d = 46 + r()*14, rr = 2 + r()*5; x.beginPath(); x.arc(64+Math.cos(a)*d, 64+Math.sin(a)*d, rr, 0, 7); x.fill(); }
});
const shardTex = cv(64, 128, (x, w, h) => {
  const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(139,92,246,.5)'); g.addColorStop(.5, 'rgba(240,235,255,1)'); g.addColorStop(1, 'rgba(139,92,246,.5)');
  x.fillStyle = g; x.beginPath(); x.moveTo(w/2, 0); x.lineTo(w*.9, h*.55); x.lineTo(w/2, h); x.lineTo(w*.1, h*.55); x.closePath(); x.fill();
});
const fxMat = (map, color) => new T.MeshBasicMaterial({ map, color, opacity:0, side:T.DoubleSide, ...add });

/* ---------- stars: three orb styles ---------- */
const nodes = stars.map((s,i) => {
  const g = new T.Group(); g.position.copy(s); scene.add(g);

  // A · blade-cut planet
  const planet = new T.Group(); g.add(planet);
  const tilt = new T.Group(); tilt.rotation.z = -.62 + (i%2)*1.1; planet.add(tilt);
  const inner = new T.Group(); inner.rotation.y = Math.PI/2; tilt.add(inner);
  const pm = planetMat.clone(); pm.uniforms.seed.value = i*7.31 + 2.;
  const halves = [0,1].map(k => {
    const h = new T.Group(); inner.add(h);
    h.add(new T.Mesh(hemiGeo[k], pm));
    const cap = new T.Mesh(capGeo, magma); h.add(cap);
    return h;
  });
  const slash = new T.Mesh(slashGeo, new T.MeshBasicMaterial({ color:new T.Color(3,1.2,1.3), ...add, opacity:0 })); tilt.add(slash); slash.position.z = 1.2;
  const pGlow = new T.Sprite(new T.SpriteMaterial({ map:redGlow, ...add, opacity:.0 })); pGlow.scale.setScalar(2.4); planet.add(pGlow);
  // brush-stroke ring system
  const ringPivot = new T.Group(); ringPivot.rotation.set(1.18 + (i%3)*.12, i*.7, (i%2 ? .35 : -.3)); planet.add(ringPivot);
  const kind = P[i].k.toLowerCase();
  const RINGS = kind.includes('commerce') ? [[1.25,1.75,0xe5243b],[1.9,2.35,0x8b5cf6]]           // shop: twin rings
              : kind.includes('company')  ? [[1.25,2.3,0xe5243b]]                                // company site: one broad ring
              : kind.includes('desktop')  ? []                                                   // desktop app: orbit band instead
              : kind.includes('crypto')   ? [[1.3,1.55,0xe5243b],[1.7,1.85,0x8b5cf6],[2.0,2.1,0xe5243b]]   // crypto: thin coin bands
              : [[1.25,1.45,0x8b5cf6],[1.6,1.8,0x8b5cf6],[1.95,2.2,0xe5243b]];                // web app: segmented rings
  const pRings = RINGS.map(([a, b, c]) => { const m = new T.Mesh(new T.RingGeometry(a, b, 128, 1), new T.MeshBasicMaterial({ map:ringTex, color:c, transparent:true, opacity:.75, depthWrite:false, side:T.DoubleSide, blending:T.AdditiveBlending })); ringPivot.add(m); return m; });
  if (!RINGS.length){ const band = new T.Mesh(new T.TorusGeometry(1.7, .025, 8, 160), new T.MeshBasicMaterial({ color:new T.Color(1.2,.15,.28) })); ringPivot.add(band); const band2 = band.clone(); band2.material = new T.MeshBasicMaterial({ color:0x8b5cf6 }); band2.rotation.y = 1.1; ringPivot.add(band2); }
  // moons
  const moons = P[i].s.map((tech, k) => { const mm = planetMat.clone(); mm.uniforms.seed.value = i*3.1 + k*9.; const mo = new T.Mesh(moonGeo, mm); mo.scale.setScalar(.15 - k*.015); planet.add(mo); return { mo, r: 2.5 + k*.42, sp: (k%2 ? -.5 : .36) * (1 - k*.08), tilt: .45 + k*.55, ph: i + k*2.4 }; });   // one moon per technology
  // the project's kanji numeral, brushed beside its planet
  const kj = new T.Sprite(new T.SpriteMaterial({ map:kanjiTex[i], color:0xe5243b, transparent:true, opacity:0, depthWrite:false })); kj.scale.setScalar(1.15); planet.add(kj);

  // B · ink eclipse
  const eclipse = new T.Group(); g.add(eclipse);
  const cor = new T.Sprite(new T.SpriteMaterial({ map:corona, ...add, opacity:.45 })); cor.scale.setScalar(4.1); eclipse.add(cor);
  const cor2 = new T.Sprite(new T.SpriteMaterial({ map:coronaBrush, color:0xe5243b, ...add })); cor2.scale.setScalar(4.3); eclipse.add(cor2);
  const disc = new T.Mesh(quad, new T.MeshBasicMaterial({ map:blotTex, alphaTest:.4, side:T.DoubleSide })); disc.scale.setScalar(2.05); eclipse.add(disc);
  const enso1 = new T.Mesh(quad, ensoMat(0xe5243b, 1, false)); enso1.scale.setScalar(3.1); eclipse.add(enso1);
  const enso2 = new T.Mesh(quad, ensoMat(0x8b5cf6, .6, true)); enso2.scale.setScalar(3.75); eclipse.add(enso2);
  const bE = new T.Mesh(quad, new T.MeshBasicMaterial({ map:ringTex, color:0xc8142f, opacity:0, side:T.DoubleSide, ...add })); bE.visible = false; g.add(bE);
  const diamond = new T.Sprite(new T.SpriteMaterial({ map:flare, ...add })); diamond.scale.setScalar(.9); eclipse.add(diamond);

  // C · sword guard (tsuba), lit red from inside
  const guard = new T.Group(); g.add(guard);
  const back = new T.Sprite(new T.SpriteMaterial({ map:redGlow, ...add })); back.scale.setScalar(2.5); guard.add(back);
  const spin = new T.Group(); guard.add(spin);
  spin.add(new T.Mesh(TSUBA, tsubaMat));
  const rim = tsubaRim.clone(); spin.add(rim);

  // near-indicator rings (all styles)
  const ring = new T.Mesh(new T.RingGeometry(1.45, 1.465, 96), new T.MeshBasicMaterial({ color:0xe5243b, opacity:0, side:T.DoubleSide, ...add })); g.add(ring);
  const ring2 = new T.Mesh(new T.RingGeometry(1.75, 1.758, 96, 1, 0, Math.PI*1.25), new T.MeshBasicMaterial({ color:0x8b5cf6, opacity:0, side:T.DoubleSide, ...add })); g.add(ring2);

  // mini constellation
  let seed = i*31+7; const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
  const cp = [new T.Vector3()]; for (let k=0;k<5;k++){ const a = rnd()*6.28, r = 1.7 + rnd()*1.5; cp.push(new T.Vector3(Math.cos(a)*r, Math.sin(a)*r*.8, (rnd()-.5)*1.2)); }
  const lm = new T.LineBasicMaterial({ color:0x8b5cf6, opacity:0, ...add });
  g.add(new T.Line(new T.BufferGeometry().setFromPoints(cp), lm));
  const small = new T.Points(new T.BufferGeometry().setFromPoints(cp.slice(1)), new T.PointsMaterial({ size:.26, map:dot, color:0xe1d6ff, opacity:0, ...add }));
  g.add(small);

  // burst
  const bm = (c) => new T.MeshBasicMaterial({ color:c, opacity:0, side:T.DoubleSide, ...add });
  const bR1 = new T.Mesh(new T.RingGeometry(.95, 1, 128), bm(0xc8142f));
  const bR2 = new T.Mesh(new T.RingGeometry(.975, 1, 128), bm(0x8b5cf6));
  const bfx = new T.Group(), sMat = fxMat(streakTex, 0xffffff), iMat = fxMat(inkTex, 0xc8142f), shMat = fxMat(shardTex, 0xffffff), parts = [];
  for (let k=0;k<30;k++){ const m = new T.Mesh(quad, sMat); parts.push({ m, kind:0, a:Math.random()*6.283, sp:.75 + Math.random()*.55, len:.7 + Math.random()*1.1, w:.06 + Math.random()*.06 }); bfx.add(m); }
  for (let k=0;k<14;k++){ const m = new T.Mesh(quad, iMat); parts.push({ m, kind:1, a:Math.random()*6.283, sp:.35 + Math.random()*.6, s:.18 + Math.random()*.32, rot:Math.random()*6.283 }); bfx.add(m); }
  for (let k=0;k<10;k++){ const m = new T.Mesh(quad, shMat); parts.push({ m, kind:2, a:Math.random()*6.283, sp:.5 + Math.random()*.7, s:.07 + Math.random()*.07, rot:Math.random()*6.283, spin:(Math.random()-.5)*14 }); bfx.add(m); }
  bR1.visible = bR2.visible = bfx.visible = false;
  g.add(bR1, bR2, bfx);

  return { st:-1, fired:false, g, planet, tilt, halves, slash, pGlow, pm, pRings, moons, kj, eclipse, cor, cor2, disc, enso1, enso2, diamond, bE, draw:0, drawing:false, guard, back, spin, ring, ring2, lm, small, bR1, bR2, bfx, parts, sMat, iMat, shMat, bt:-1, cut:0, open:0 };
});

/* ---------- orb style ----------
   The approved look is the blade-cut planet. The ink-eclipse and sword-guard orbs from the concept lab are still
   built (hidden, so they cost nothing to draw) because the per-frame code branches on `style`. */
const style = 'planet';
nodes.forEach(n => { n.planet.visible = true; n.eclipse.visible = false; n.guard.visible = false; });

const composer = new T.EffectComposer(R);
composer.addPass(new T.RenderPass(scene, cam));
const bloom = new T.UnrealBloomPass(new T.Vector2(innerWidth*(LOW ? .5 : 1), innerHeight*(LOW ? .5 : 1)), .6, .45, .55); composer.addPass(bloom);

/* ---------- fx overlay: tether line from star to page ---------- */
const fx = $('#fx'), fctx = fx.getContext('2d');
const starScreen = { x:0, y:0, on:false };
function burst(i){ if (reduce || !nodes[i]) return; if (style === 'planet'){ nodes[i].st = 0; nodes[i].fired = false; SND.swish(); } else nodes[i].bt = 0; }

/* ---------- the katana that cuts each planet ---------- */
const SW = 2.4;                                   // blade length in scene units
function bendK(geo){ const p = geo.attributes.position; for (let k=0;k<p.count;k++){ const x = p.getX(k); p.setY(k, p.getY(k) + .025*Math.pow(Math.max(0,x)/SW, 2)); } geo.computeVertexNormals(); }
const hamonTex = cv(512, 64, (x) => {
  x.fillStyle = '#4b4953'; x.fillRect(0,0,512,64);
  x.fillStyle = '#e9e7f0'; x.beginPath(); x.moveTo(0,64);
  for (let k=0;k<=512;k+=8) x.lineTo(k, 30 + Math.sin(k*.09)*5 + Math.sin(k*.031)*4);
  x.lineTo(512,64); x.fill(); x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(0,58,512,6);
});
const tsukaTex = cv(256, 32, (x) => {
  x.fillStyle = '#0a090c'; x.fillRect(0,0,256,32);
  for (let k=0;k<256;k+=22){ x.fillStyle = '#6e0d1c'; x.beginPath(); x.moveTo(k,16); x.lineTo(k+11,3); x.lineTo(k+22,16); x.lineTo(k+11,29); x.fill(); x.fillStyle = '#e5243b'; x.beginPath(); x.moveTo(k+6,16); x.lineTo(k+11,10); x.lineTo(k+16,16); x.lineTo(k+11,22); x.fill(); }
});
const swordMats = [];
const sm = (o) => { const m = new T.MeshStandardMaterial({ transparent:true, ...o }); swordMats.push(m); return m; };
const swordHolder = new T.Group(); swordHolder.visible = false;
const sword = new T.Group(); sword.rotation.z = -Math.PI/2; swordHolder.add(sword);   // blade points down
{
  const bg = new T.BoxGeometry(SW, .085, .016, 70, 1, 1); bg.translate(SW/2, 0, 0);
  const bp = bg.attributes.position;
  for (let v=0; v<bp.count; v++){ const x = bp.getX(v); if (x > SW - .26){ const f = clamp(1 - (x-(SW-.26))/.26, 0, 1); if (bp.getY(v) > 0) bp.setY(v, -.042 + .085*f); } }
  bendK(bg);
  sword.add(new T.Mesh(bg, sm({ map:hamonTex, metalness:.4, roughness:.3 })));
  const dark = sm({ color:0x24212a, metalness:.45, roughness:.5 });
  const tsuba = new T.Mesh(new T.CylinderGeometry(.15, .15, .03, 32), dark); tsuba.rotation.z = Math.PI/2; tsuba.position.x = -.03; sword.add(tsuba);
  const hab = new T.Mesh(new T.BoxGeometry(.07, .1, .035), dark); hab.position.x = .035; sword.add(hab);
  const tsuka = new T.Mesh(new T.BoxGeometry(.78, .095, .065), sm({ map:tsukaTex, roughness:.8 })); tsuka.position.x = -.44; sword.add(tsuka);
  const kash = new T.Mesh(new T.BoxGeometry(.05, .105, .075), dark); kash.position.x = -.85; sword.add(kash);
  const sageo = new T.Mesh(new T.TorusGeometry(.06, .012, 8, 20), new T.MeshBasicMaterial({ color:new T.Color(1.5,.2,.3), transparent:true })); sageo.position.x = -.88; swordMats.push(sageo.material); sword.add(sageo);
}
// edge glint that runs down the blade while it waits
const swGlint = new T.Mesh(new T.PlaneGeometry(.42, .09), new T.MeshBasicMaterial({ map: streakTex, color:0xffffff, opacity:0, ...add }));
swGlint.position.z = .012; sword.add(swGlint);
// afterimage streak left by the swing
const swTrail = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: cv(64, 256, (x, w, h) => { const g = x.createLinearGradient(0,0,w,0); g.addColorStop(0,'rgba(229,36,59,0)'); g.addColorStop(.35,'rgba(229,36,59,.55)'); g.addColorStop(.5,'rgba(255,235,240,1)'); g.addColorStop(.65,'rgba(229,36,59,.55)'); g.addColorStop(1,'rgba(229,36,59,0)'); x.fillStyle = g; x.fillRect(0,0,w,h); }), opacity:0, side:T.DoubleSide, ...add }));

const introTip = new T.Vector3();
function drawFx(near){
  const d = Math.min(devicePixelRatio, 2);
  fctx.clearRect(0,0,fx.width,fx.height);
  // the vertical red thread from the hero swings over and becomes the stroke you fly
  const k = clamp(t + 1, 0, 1);
  if (k < .995){
    introTip.copy(tipGlow.position).project(cam);
    const tx = (introTip.x*.5 + .5)*innerWidth, ty = (-introTip.y*.5 + .5)*innerHeight;
    const x0 = Math.max(16, parseFloat(getComputedStyle(document.documentElement).paddingLeft) || 16) + 4, H = innerHeight;
    const e = ease(clamp(k*1.15, 0, 1));
    const ax = lerp(x0, tx, e), ay = lerp(0, ty, e), bx = lerp(x0, tx, e), by = lerp(H, ty, e);
    fctx.save(); fctx.globalAlpha = 1 - ease(clamp((k - .6)/.4, 0, 1));
    const g = fctx.createLinearGradient(0, ay*d, 0, by*d); g.addColorStop(0, 'rgba(229,36,59,0)'); g.addColorStop(.2, 'rgba(229,36,59,.95)'); g.addColorStop(.8, 'rgba(229,36,59,.95)'); g.addColorStop(1, 'rgba(229,36,59,0)');
    fctx.strokeStyle = g; fctx.lineWidth = (1 + e*3)*d; fctx.shadowColor = '#e5243b'; fctx.shadowBlur = 12*d;
    fctx.beginPath(); fctx.moveTo(ax*d, ay*d); fctx.quadraticCurveTo(lerp(x0, (x0 + tx)/2, e)*d, lerp(H/2, ty - 60, e)*d, bx*d, by*d); fctx.stroke();
    fctx.restore();
  }
  if (near > .05 && starScreen.on){
    const r = mp.getBoundingClientRect();
    const tx = wide() ? r.left - 6 : r.left + r.width*.5, ty = wide() ? r.top + r.height*.45 : r.top - 6;
    const sx = starScreen.x, sy = starScreen.y;
    fctx.save(); fctx.globalAlpha = near;
    fctx.strokeStyle = 'rgba(229,36,59,.9)'; fctx.lineWidth = 1.5*d; fctx.shadowColor = '#e5243b'; fctx.shadowBlur = 14*d;
    fctx.beginPath(); fctx.moveTo(sx*d, sy*d);
    fctx.quadraticCurveTo(((sx + tx)/2)*d, (Math.min(sy, ty) - 40)*d, tx*d, ty*d); fctx.stroke();
    fctx.fillStyle = '#e5243b'; fctx.beginPath(); fctx.arc(tx*d, ty*d, 3.5*d, 0, 7); fctx.fill();
    fctx.restore();
  }
}

/* ---------- sound: all synthesised with WebAudio, off until the viewer turns it on ---------- */
const SND = { ctx:null, on:false, master:null, brush:null,
  init(){
    const c = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = c.createGain(); this.master.gain.value = 0; this.master.connect(c.destination);
    const noiseBuf = c.createBuffer(1, c.sampleRate*2, c.sampleRate), d = noiseBuf.getChannelData(0); for (let k=0;k<d.length;k++) d[k] = Math.random()*2 - 1;
    this.noiseBuf = noiseBuf;
    // low space hum
    const humG = c.createGain(); humG.gain.value = .05; humG.connect(this.master);
    [55, 82.4, 110.3].forEach((f, k) => { const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = k*4; const g = c.createGain(); g.gain.value = [.5,.3,.12][k]; o.connect(g); g.connect(humG); o.start(); });
    // brush hiss, level follows painting
    const bn = c.createBufferSource(); bn.buffer = noiseBuf; bn.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = .7;
    this.brush = c.createGain(); this.brush.gain.value = 0; bn.connect(bp); bp.connect(this.brush); this.brush.connect(this.master); bn.start();
  },
  toggle(){ if (!this.ctx) this.init(); this.on = !this.on; this.ctx.resume(); this.master.gain.setTargetAtTime(this.on ? .6 : 0, this.ctx.currentTime, .15); },
  swish(){ if (!this.on) return; const c = this.ctx, t = c.currentTime, s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4; f.frequency.setValueAtTime(5200, t); f.frequency.exponentialRampToValueAtTime(500, t + .28);
    const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .32);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t); s.stop(t + .4); },
  impact(){ if (!this.on) return; const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(32, t + .5);
    const g = c.createGain(); g.gain.setValueAtTime(.7, t); g.gain.exponentialRampToValueAtTime(.0001, t + .6); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + .65);
    const s = c.createBufferSource(); s.buffer = this.noiseBuf; const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
    const g2 = c.createGain(); g2.gain.setValueAtTime(.35, t); g2.gain.exponentialRampToValueAtTime(.0001, t + .12); s.connect(hp); hp.connect(g2); g2.connect(this.master); s.start(t); s.stop(t + .15); },
  brushLevel(v){ if (this.brush) this.brush.gain.setTargetAtTime(this.on ? v*.09 : 0, this.ctx.currentTime, .06); }
};
$('#snd').addEventListener('click', () => { SND.toggle(); $('#snd').setAttribute('aria-pressed', SND.on); $('#snd').textContent = SND.on ? '♪ Sound on' : '♪ Sound off'; });

/* ---------- mini 道 progress map ---------- */
{
  const fx2 = ([x, y]) => [((x + 7.8)*9.6).toFixed(1), ((7 - y)*8.6).toFixed(1)];
  const path = pts => 'M' + pts.map(fx2).map(q => q.join(' ')).join(' L');
  const strokesSvg = WAY.slice(0, -1).map(w => `<path d="${path(w.p)}" class="ghost"/>`).join('');
  const sweep = WAY[WAY.length-1].p;
  $('#minimap').innerHTML = `<svg viewBox="0 0 160 112" aria-hidden="true">${strokesSvg}<path d="${path(sweep)}" class="track"/><path d="${path(sweep)}" class="done" id="mmDone"/>${STOPS.map(([si,u],k) => { const c = strokes[si].curve.getPointAt(u); const [x,y] = fx2([c.x/S, c.y/S]); return `<circle cx="${x}" cy="${y}" r="3.2" data-i="${k}"/>`; }).join('')}</svg><span>道 · ${pad(N)} stops</span>`;
}
const mmDone = $('#mmDone'), mmLen = mmDone.getTotalLength(), mmDots = [...document.querySelectorAll('#minimap circle')];
mmDone.style.strokeDasharray = mmLen; mmDone.style.strokeDashoffset = mmLen;
$('#minimap').addEventListener('click', e => { const c = e.target.closest('circle'); if (c){ tT = +c.dataset.i; locked = false; } });
$('#skip').addEventListener('click', () => { tT = N; locked = false; });

/* ---------- map labels ---------- */
const labels = $('#maplabels');
labels.innerHTML = P.map((p,i) => `<button type="button" data-i="${i}"><b>${KANJI[i]}</b><span>${pad(i+1)}</span><em>${esc((p.a+' '+p.b).trim())}</em></button>`).join('');
const labelEls = [...labels.children]; labelEls.forEach((b,k) => { if (k % 2) b.classList.add('below'); });
labels.addEventListener('click', e => { const b = e.target.closest('button'); if (b) tT = +b.dataset.i; });

/* ---------- input ---------- */
let t = T_MIN, tT = T_MIN, snapTimer = 0, drag = null, painted = 0;
const ptr = { nx:0, ny:0, sx:0, sy:0 };
const snap = () => { clearTimeout(snapTimer); snapTimer = setTimeout(() => tT = Math.round(tT), 170); };
let wheelAcc = 0, lastWheel = 0, lastAbs = 0, locked = false;
function step(dir){ if (locked) return; const nt = clamp(Math.round(tT) + dir, T_MIN, T_MAX); if (nt === tT) return; tT = nt; locked = true; wheelAcc = 0; }
const edge = createEdge(api);
const atStart = () => tT === T_MIN && Math.abs(t - tT) < .05, atEnd = () => tT === T_MAX && Math.abs(t - tT) < .05;
api.onEnter = dir => { if (dir < 0) { t = tT = T_MAX; } };
// touch: a swipe anywhere (including over the manga page) steps one project, like one wheel gesture
let touch0 = null;
addEventListener('touchstart', e => { edge.touchstart(e); const p = e.touches[0]; touch0 = { x:p.clientX, y:p.clientY }; }, { passive:true });
addEventListener('touchend', e => {
  if (edge.touchend(e, atStart, atEnd)) { touch0 = null; return; }
  if (!touch0) return;
  const p = e.changedTouches[0], d = (touch0.y - p.clientY) + (touch0.x - p.clientX)*.6; touch0 = null;
  if (Math.abs(d) < 40) return;                                  // a tap: links and buttons handle it
  if (Math.abs(t - tT) < .3) locked = false;                    // the last move has (nearly) landed
  step(Math.sign(d));
}, { passive:true });
addEventListener('wheel', e => {
  if (edge.wheel(e, atStart, atEnd)) return;
  const now = performance.now(), abs = Math.abs(e.deltaY);
  const fresh = now - lastWheel > 260 || abs > lastAbs*1.6 + 4;   // a pause, or a new swipe rising out of fading momentum
  lastWheel = now; lastAbs = abs;
  if (fresh) wheelAcc = 0;
  if (locked){
    if (fresh && Math.abs(t - tT) < .05) locked = false;          // arrived and this is a new swipe
    else return;                                                   // still travelling, or momentum from the last swipe
  }
  wheelAcc += e.deltaY;
  if (Math.abs(wheelAcc) > 40) step(Math.sign(wheelAcc));
}, { passive:true });
canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; drag = { y:e.clientY, x:e.clientX }; canvas.setPointerCapture(e.pointerId); });   // touch is handled by the swipe above
canvas.addEventListener('pointerup', e => { if (!drag) return; const d = (drag.y - e.clientY) + (drag.x - e.clientX)*.6; drag = null; if (Math.abs(d) > 40){ lastWheel = 0; if (Math.abs(t - tT) < .3) locked = false; step(Math.sign(d)); } });
addEventListener('pointermove', e => { ptr.nx = e.clientX/innerWidth*2 - 1; ptr.ny = -(e.clientY/innerHeight)*2 + 1; });
addEventListener('keydown', e => {
  if (edge.key(e, atStart, atEnd)) return;
  if (['ArrowDown','ArrowRight','PageDown'].includes(e.key)){ e.preventDefault(); lastWheel = 0; step(1); }
  if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); lastWheel = 0; step(-1); }
});
const rail = $('#rail');
rail.innerHTML = P.map((p,i) => `<button type="button" data-i="${i}"><span>${pad(i+1)} ${esc(p.a+' '+p.b)}</span><i></i></button>`).join('') + `<button type="button" data-i="${N}"><span>The map</span><i></i></button>`;
const railBtns = [...rail.children];
rail.addEventListener('click', e => { const b = e.target.closest('button'); if (b) tT = +b.dataset.i; });
$('#toTop').addEventListener('click', e => { e.preventDefault(); tT = 0; });

function resize(){
  const w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio, 2);
  R.setSize(w, h, false); composer.setSize(w, h); cam.aspect = w/h; cam.updateProjectionMatrix();
  fx.width = w*d; fx.height = h*d;
}
addEventListener('resize', resize);

/* ---------- map camera ---------- */
const box = new T.Box3(); strokes.forEach(st => st.curve.getSpacedPoints(40).forEach(q => box.expandByPoint(q)));
const mapC = box.getCenter(new T.Vector3()), mapSize = box.getSize(new T.Vector3());
const fTan = new T.Vector3(), fSide = new T.Vector3(), ZUP = new T.Vector3(0,0,1), YUP = new T.Vector3(0,1,0);
// speed lines + ink flecks that live in camera space and stream past while travelling
scene.add(cam);
const SL = LOW ? 70 : 160, slPos = new Float32Array(SL*6), slSeed = [];
for (let k=0;k<SL;k++){ const a = Math.random()*6.283, r = 1.6 + Math.random()*4.5, z = -Math.random()*46, len = 1.5 + Math.random()*4; slSeed.push({ x:Math.cos(a)*r, y:Math.sin(a)*r*.7, z, len });
  slPos.set([slSeed[k].x, slSeed[k].y, z, slSeed[k].x, slSeed[k].y, z - len], k*6); }
const slGeo = new T.BufferGeometry(); slGeo.setAttribute('position', new T.BufferAttribute(slPos, 3));
const slMat = new T.LineBasicMaterial({ color:0xff6b7c, transparent:true, opacity:0, depthWrite:false, blending:T.AdditiveBlending });
const speedLines = new T.LineSegments(slGeo, slMat); speedLines.frustumCulled = false; cam.add(speedLines);
const FK = LOW ? 60 : 140, fkPos = new Float32Array(FK*3);
for (let k=0;k<FK;k++){ const a = Math.random()*6.283, r = 1.2 + Math.random()*5; fkPos.set([Math.cos(a)*r, Math.sin(a)*r*.7, -Math.random()*40], k*3); }
const fkGeo = new T.BufferGeometry(); fkGeo.setAttribute('position', new T.BufferAttribute(fkPos, 3));
const fkMat = new T.PointsMaterial({ size:.07, map:dot, color:0xe5243b, transparent:true, opacity:0, depthWrite:false, blending:T.AdditiveBlending });
const flecks = new T.Points(fkGeo, fkMat); flecks.frustumCulled = false; cam.add(flecks);
let prevDC = 0, speedK = 0;
const camPos = new T.Vector3(), camLook = new T.Vector3(), mapPos = new T.Vector3(), flyPos = new T.Vector3(), flyLook = new T.Vector3();

/* ---------- loop ---------- */
const v3 = new T.Vector3();
let lastI = -2;
function frame(dt, time){
  t = lerp(t, tT, 1 - Math.pow(.025, dt));
  if (locked && Math.abs(t - tT) < .03 && performance.now() - lastWheel > 260) locked = false;   // arrived and the gesture has ended
  ptr.sx = lerp(ptr.sx, ptr.nx, .06); ptr.sy = lerp(ptr.sy, ptr.ny, .06);
  const W = wide();
  const dC = dAt(t), p = routeAt(dC, new T.Vector3());
  const m = ease(clamp(t - (N-1), 0, 1));          // 0 flying → 1 full map

  // the brush paints ahead of the camera; ink never un-paints
  const prev = painted;
  painted = Math.max(painted, Math.min(LTOT, dC + 1.2));
  if (m > .6) painted = Math.min(LTOT, painted + dt*60);
  strokes.forEach(st => { st.mat.uniforms.painted.value = st === SWEEP ? clamp(painted/st.len, 0, 1) : st.w; st.mat.uniforms.mapK.value = m; st.mat.uniforms.glow.value = m*(.2 + .1*Math.sin(time*1.6)); });
  routeAt(painted, tipGlow.position); tipGlow.material.opacity = 1 - m;
  tipGlow.scale.setScalar(.55 + Math.sin(time*9)*.05);
  { // brush: presses down and leans back while painting, lifts and sways when you stop
    const speed = (painted - prev) / Math.max(dt, 1e-3);
    brushPress = lerp(brushPress, clamp(speed*60, 0, 1), 1 - Math.pow(.001, dt));
    brushLift = lerp(brushLift, brushPress > .15 ? 0 : 1, 1 - Math.pow(.02, dt));
    routeTangent(painted, bTan);
    bUp.set(0, 1, 0).addScaledVector(bTan, -.55 - brushPress*.5).add(v3.copy(cam.position).sub(tipGlow.position).normalize().multiplyScalar(.35)).normalize();
    bQ.setFromUnitVectors(Y, bUp); brush.quaternion.slerp(bQ, 1 - Math.pow(.003, dt));
    brush.position.copy(tipGlow.position).addScaledVector(bUp, brushLift*.28 + Math.sin(time*2.3)*.02*brushLift);
    brush.rotateY(Math.sin(time*1.3)*.15*brushLift);
    tuft.scale.set(1 + brushPress*.45, 1 - brushPress*.28, 1 + brushPress*.45);
    tuftPivot.rotation.z = Math.sin(time*3)*.05*brushLift; tuftPivot.rotation.x = brushPress*.45;
    // in eclipse mode the brush leaves the thread to paint the ensō around the current star
    const iC = clamp(Math.round(t), 0, N-1), nC = nodes[iC], nearC = clamp(1 - Math.abs(t - iC)*1.5, 0, 1);
    const want = ease(clamp((nearC - .3)/.55, 0, 1));
    nC.drawing = false;
    if (style === 'eclipse' && want > nC.draw + .001){ nC.draw = Math.min(want, nC.draw + dt*1.15); nC.drawing = true; }
    brushOnEnso = lerp(brushOnEnso, nC.drawing ? 1 : 0, 1 - Math.pow(nC.drawing ? .0005 : .02, dt));
    if (brushOnEnso > .01){
      nC.enso1.updateWorldMatrix(true, false);
      const th = -1.2 + nC.draw*5.5;
      const pe = nC.enso1.localToWorld(ePt.set(Math.cos(th)*.37, -Math.sin(th)*.37, .04));
      const toCam = v3.copy(cam.position).sub(pe).normalize();
      const out = ePt2.copy(pe).sub(nC.g.position).normalize();
      bUp.copy(toCam).multiplyScalar(.75).addScaledVector(out, .45).add(Y).normalize();
      bQ.setFromUnitVectors(Y, bUp); brush.quaternion.slerp(bQ, brushOnEnso);
      brush.position.lerp(pe, brushOnEnso);
      tuft.scale.set(lerp(tuft.scale.x, 1.45, brushOnEnso), lerp(tuft.scale.y, .72, brushOnEnso), lerp(tuft.scale.z, 1.45, brushOnEnso));
    }
    const bs = (W ? 1.65 : 1.8) * (1 - m); brush.scale.setScalar(Math.max(bs, .0001)); brush.visible = style === 'eclipse' && m < .98;
  }
  if (painted > prev + .0002 && !reduce){
    for (let k=0;k<2;k++){ const j = dropI++ % DROPS; dpos[j*3] = tipGlow.position.x + (Math.random()-.5)*.5; dpos[j*3+1] = tipGlow.position.y + (Math.random()-.5)*.5; dpos[j*3+2] = tipGlow.position.z + (Math.random()-.5)*.5; dlife[j] = 1; }
  }
  for (let j=0;j<DROPS;j++){ if (dlife[j] > 0){ dlife[j] -= dt*.6; dpos[j*3+1] -= dt*.25; if (dlife[j] <= 0) dpos[j*3+1] = 1e4; } }
  dg.attributes.position.needsUpdate = true;

  // flight camera, then blend out to the overview map
  // fly low over the ink, looking slightly ahead; lifts between strokes raise the camera like a brush
  // ride behind the planet, looking down the stroke (camera up = the page normal)
  routeTangent(Math.min(dC, LTOT - .4), fTan); fTan.z = 0; fTan.normalize();
  fSide.crossVectors(fTan, ZUP).normalize();
  if (W){
    flyPos.copy(p).addScaledVector(fTan, -8.2).addScaledVector(fSide, 2.9 + ptr.sx*.4).addScaledVector(ZUP, 2.0 + ptr.sy*.3);
    flyLook.copy(p).addScaledVector(fTan, 1.5).addScaledVector(fSide, 2.9).addScaledVector(ZUP, .35);
  } else {
    flyPos.copy(p).addScaledVector(fTan, -10).addScaledVector(ZUP, 3.0 + ptr.sy*.3);
    flyLook.copy(p).addScaledVector(fTan, 1).addScaledVector(ZUP, -1.9);
  }
  const fov = cam.fov*Math.PI/180, dW = (mapSize.x/2 + (wide() ? 9 : 15)*SK)/(Math.tan(fov/2)*cam.aspect)   /* phones: room for the right-hand labels */, dH = (mapSize.y/2 + 17*SK)/Math.tan(fov/2), dMap = Math.max(dW, dH);
  const par = wide() ? 1 : 0;                       // mouse parallax on the map; touch screens keep it centred
  mapPos.set(mapC.x + ptr.sx*4*par, mapC.y - dMap*.18 + ptr.sy*3*par, dMap);
  const mk = ease(m);
  camPos.lerpVectors(flyPos, mapPos, mk);
  camLook.lerpVectors(flyLook, v3.set(mapC.x, mapC.y + (W ? -9 : -14)*SK, 0), mk);
  { // travel speed drives the speed lines, ink flecks and a small FOV stretch
    const vel = Math.abs(dC - prevDC) / Math.max(dt, 1e-3); prevDC = dC;
    speedK = lerp(speedK, reduce ? 0 : clamp(vel/26, 0, 1) * (1 - m), 1 - Math.pow(.02, dt));
    slMat.opacity = speedK*.42; fkMat.opacity = speedK*.8;
    const flow = (6 + vel*1.1) * dt;
    for (let k=0;k<SL;k++){ const q = slSeed[k]; q.z += flow; if (q.z > 1) q.z -= 47; const L = q.len*(1 + speedK*2.5); slPos[k*6+2] = q.z; slPos[k*6+5] = q.z - L; }
    slGeo.attributes.position.needsUpdate = true;
    for (let k=0;k<FK;k++){ fkPos[k*3+2] += flow*.8; if (fkPos[k*3+2] > 1) fkPos[k*3+2] -= 41; }
    fkGeo.attributes.position.needsUpdate = true;
    const fov = 55 + speedK*13; if (Math.abs(cam.fov - fov) > .01){ cam.fov = fov; cam.updateProjectionMatrix(); }
  }
  cam.up.lerpVectors(ZUP, YUP, mk).normalize();
  cam.position.copy(camPos); cam.lookAt(camLook);
  scene.fog.density = lerp(.013, .0012, m);
  grid.material.opacity = m*.08;

  const i = clamp(Math.round(t), 0, N-1);
  const inStar = t > -.5 && t < N - .5;
  nodes.forEach((n,k) => {
    const near = clamp(1 - Math.abs(t - k)*1.5, 0, 1), passed = t > k - .5;
    const g = n.g;
    // keep orbs readable on the zoomed-out map
    g.scale.setScalar(1 + m*4);
    n.ring.quaternion.copy(cam.quaternion); n.ring2.quaternion.copy(cam.quaternion); n.ring2.rotateZ(time*.5 + k);
    n.ring.material.opacity = near*.8 + m*.5; n.ring2.material.opacity = near*.9;
    n.ring.visible = n.ring2.visible = style !== 'eclipse';
    n.lm.opacity = Math.max(near*.9, passed ? .22 : 0, m*.6); n.small.material.opacity = Math.max(near, passed ? .35 : 0, m*.7);
    const openK = (inStar && k === i) ? clamp(1 - Math.abs(t - k)*3.2, 0, 1) : 0;
    n.open = lerp(n.open, openK > .5 ? 1 : 0, 1 - Math.pow(.002, dt));

    if (style === 'planet'){
      n.tilt.lookAt(cam.position); n.tilt.rotateZ(-.62 + (k%2)*1.1);
      if (n.st >= 0){ n.st += dt; if (n.st >= .2 && !n.fired){ n.fired = true; n.bt = 0; SND.impact(); } }
      if (openK < .3 && n.st >= 0 && n.st > 1.2){ n.st = -1; n.fired = false; }
      const cutGo = openK > .5 && (reduce || n.fired);
      n.cut = lerp(n.cut, cutGo ? 1 : 0, 1 - Math.pow(.004, dt));
      const sep = ease(n.cut)*.62;
      n.halves[0].position.z = sep; n.halves[1].position.z = -sep;
      n.halves.forEach((h,j) => { h.rotation.z = time*.15*(j ? -1 : 1) + (j ? -1 : 1)*n.cut*.25; });
      n.pGlow.material.opacity = n.cut*.9; n.pGlow.scale.setScalar(1.6 + n.cut*1.4);
      n.pm.uniforms.time.value = time; n.pm.uniforms.heat.value = Math.max(near, n.cut);
      n.halves.forEach(h => h.children[0].material = n.pm);
      n.pRings.forEach((r, j) => { r.rotation.z = time*(.08 + j*.03)*(j%2 ? -1 : 1) + k; r.material.opacity = .55 + near*.3; });
      n.moons.forEach(o => { const a = time*o.sp + o.ph; o.mo.position.set(Math.cos(a)*o.r, Math.sin(a)*o.r*Math.sin(o.tilt), Math.sin(a)*o.r*Math.cos(o.tilt)); o.mo.material.uniforms.time.value = time; });
      const kjOff = new T.Vector3(-2.1, 1.5, 0).applyQuaternion(cam.quaternion); n.kj.position.copy(kjOff);
      n.kj.material.opacity = Math.max(near*.85, m*.0) * (1 - n.cut*.4);
      const sl = n.bt >= 0 ? clamp(n.bt/.35, 0, 1) : 1;
      n.slash.material.opacity = n.bt >= 0 ? (1 - sl) : 0; n.slash.scale.y = .2 + ease(sl)*1.1;
    } else if (style === 'eclipse'){
      n.enso1.quaternion.copy(cam.quaternion); n.enso1.rotateZ(k*.9 + n.draw*.0);
      n.enso1.material.uniforms.prog.value = n.draw; n.enso2.material.uniforms.prog.value = clamp(n.draw*1.25 - .25, 0, 1);
      n.disc.quaternion.copy(cam.quaternion); n.disc.position.copy(v3.copy(cam.position).sub(n.g.position).normalize().multiplyScalar(.12));
      n.cor2.material.rotation = k + time*.03; n.cor2.material.opacity = .35 + n.draw*.65;
      n.enso2.quaternion.copy(cam.quaternion); n.enso2.rotateX(Math.sin(time*.5 + k)*.9); n.enso2.rotateZ(-time*.3);
      n.enso1.scale.setScalar(3.1 + n.open*.35); n.enso2.scale.setScalar(3.75 + n.open*.7);
      n.cor.scale.setScalar(4.1 + n.open*1.2 + Math.sin(time*2 + k)*.06);
      const a = time*.4 + k; n.diamond.position.set(Math.cos(a)*.8, Math.sin(a)*.8, .2).applyQuaternion(cam.quaternion);
      n.diamond.material.opacity = .5 + .5*Math.sin(time*3 + k);
    } else {
      n.guard.quaternion.copy(cam.quaternion);
      n.spin.rotation.set(Math.sin(time*.6 + k)*.35 + n.open*.0, time*.35 + k + n.open*Math.PI*2*.0, time*.12);
      n.spin.rotation.y = Math.sin(time*.5 + k)*.6 + n.open*Math.PI;
      n.back.scale.setScalar(2.2 + n.open*1.5 + Math.sin(time*2.5 + k)*.08);
      n.back.material.opacity = .7 + n.open*.3;
    }

    // burst
    if (n.bt >= 0){
      n.bt += dt; const kk = n.bt / 1.1, on = kk < 1;
      n.bR1.visible = n.bR2.visible = on && style !== 'eclipse'; n.bfx.visible = on; n.bE.visible = on && style === 'eclipse';
      if (on && style === 'eclipse'){ const e2 = 1 - Math.pow(1 - kk, 3); n.bE.quaternion.copy(cam.quaternion); n.bE.rotateZ(k + kk*.6); n.bE.scale.setScalar((.6 + e2*3.6)*2); n.bE.material.opacity = (1 - kk)*.9; }
      if (!on) n.bt = -1;
      else {
        const e = 1 - Math.pow(1 - kk, 3), fade = 1 - kk;
        n.bR1.quaternion.copy(cam.quaternion); n.bR2.quaternion.copy(cam.quaternion); n.bfx.quaternion.copy(cam.quaternion);
        n.bR1.scale.setScalar(.3 + e*3.4); n.bR1.material.opacity = fade*.75;
        n.bR2.scale.setScalar(.2 + e*2.8); n.bR2.material.opacity = fade*.9;
        n.parts.forEach(q => {
          const dist = e*3.9*q.sp, cx = Math.cos(q.a), cy = Math.sin(q.a);
          if (q.kind === 0){ const L = q.len * (.35 + (1-e)*1.4); q.m.position.set(cx*(dist - L*.5), cy*(dist - L*.5), 0); q.m.rotation.z = q.a; q.m.scale.set(L, q.w*(1 - kk*.5), 1); }
          else if (q.kind === 1){ const sc = q.s * (.5 + e*.7) * (1 - kk*.45); q.m.position.set(cx*dist, cy*dist, 0); q.m.rotation.z = q.rot; q.m.scale.set(sc, sc, 1); }
          else { const sc = q.s * (1 - kk*.3); q.m.position.set(cx*dist, cy*dist, 0); q.m.rotation.z = q.rot + kk*q.spin; q.m.scale.set(sc, sc*2, 1); }
        });
        n.sMat.opacity = fade; n.iMat.opacity = fade*.85; n.shMat.opacity = Math.min(1, fade*1.4);
      }
    }
  });

  // katana: hovers above the current planet, drops through it, then fades out below
  if (style === 'planet' && inStar && m < .5){
    const n = nodes[i];
    if (swordHolder.parent !== n.tilt) n.tilt.add(swordHolder);
    if (swTrail.parent !== n.tilt) n.tilt.add(swTrail);
    const nearI = clamp(1 - Math.abs(t - i)*1.5, 0, 1);
    const top = 1.25 + SW, bottom = -1.45;
    let y, op, wob = 0;
    if (n.st < 0){ y = top + (1 - nearI)*2.6; op = ease(nearI); wob = Math.sin(time*7)*.012; }
    else if (n.st < .22){ const k = n.st/.22; y = lerp(top, bottom, k*k); op = 1; }
    else { const k = clamp((n.st - .22)/.8, 0, 1); y = bottom - k*.5; op = 1 - k; wob = Math.sin(k*12)*.06*(1-k); }
    swordHolder.visible = op > .01;
    swordHolder.position.set(.0, y, 1.35);
    swordHolder.rotation.z = 0; sword.rotation.y = wob*4;
    swordMats.forEach(mt => mt.opacity = op);
    // glint runs down the blade while it waits
    const gk = (time*.8) % 1; swGlint.position.x = gk*SW; swGlint.position.y = .09*Math.pow(gk, 2) - .01;
    swGlint.material.opacity = n.st < 0 ? Math.sin(gk*Math.PI)*nearI : 0;
    // afterimage from where the tip started to where it is now
    if (n.st >= 0 && n.st < .7){
      const tipStart = top - SW, tipNow = y - SW, len = Math.max(.01, tipStart - tipNow);
      swTrail.position.set(0, tipNow + len/2, 1.3); swTrail.scale.set(.32, len, 1);
      swTrail.material.opacity = n.st < .22 ? .95 : clamp(1 - (n.st - .22)/.48, 0, 1)*.95;
    } else swTrail.material.opacity = 0;
  } else { swordHolder.visible = false; swTrail.material.opacity = 0; }

  // star screen position for tether
  v3.copy(stars[i]).project(cam);
  starScreen.x = (v3.x*.5 + .5)*innerWidth; starScreen.y = (-v3.y*.5 + .5)*innerHeight; starScreen.on = v3.z < 1;

  const near = inStar ? clamp(1 - Math.abs(t - i)*3.2, 0, 1) : 0;
  if (near > .55) openPage(i); else if (near < .35) closePage();
  const travel = clamp((t - i)*1.2, -1, 1);
  // the page leans with the pointer on wide screens; on phones/tablets it lies flat (touch leaves the 'pointer' wherever you last tapped)
  mp.style.setProperty('--ry', W ? (-14 + ptr.sx*9 + travel*-25) + 'deg' : '0deg');
  mp.style.setProperty('--rx', W ? ptr.sy*-6 + 'deg' : '0deg');

  // the brush writes the rest of 道 on the zoomed-out map
  let writing = null, wk = 0, lifting = null, doneK = 0;
  if (m > .9) writeT += dt;
  {
    let tt = .35; const SPEED = 62*SK, GAP = .18;
    WRITE.forEach((st, k) => {
      const dur = st.len / SPEED, t0 = tt, t1 = tt + dur;
      st.w = Math.max(st.w, clamp((writeT - t0)/dur, 0, 1));
      if (writeT >= t0 && writeT < t1){ writing = st; wk = (writeT - t0)/dur; }
      const nx = WRITE[k+1];
      if (nx && writeT >= t1 && writeT < t1 + GAP) lifting = { a:st, b:nx, k:(writeT - t1)/GAP };
      if (k === 0 && writeT < t0) lifting = { a:null, b:st, k:writeT/t0 };
      tt = t1 + GAP;
    });
    doneK = clamp((writeT - tt)/.8, 0, 1);
  }
  const BS = 11*SK;                               // brush size on the far-away map
  if (m > .5 && (writing || lifting || doneK < 1)){
    brush.visible = true; brush.scale.setScalar(BS * clamp((m - .5)*4, 0, 1) * (1 - doneK));
    const camDir = v3.copy(cam.position).sub(mapC).normalize();
    if (writing){
      writing.curve.getPointAt(wk, brush.position);
      const tan = writing.curve.getTangentAt(wk);
      bUp.copy(camDir).multiplyScalar(.9).addScaledVector(tan, -.45).add(ePt2.set(.2, .3, 0)).normalize();
      tuft.scale.set(1.45, .72, 1.45);
      tipGlow.position.copy(brush.position); tipGlow.material.opacity = .9; tipGlow.scale.setScalar(5*SK);
    } else {
      const a = lifting && lifting.a ? lifting.a.curve.getPointAt(1) : ePt.set(mapC.x + 40*SK, mapC.y + 30*SK, 12*SK);
      const b = lifting ? lifting.b.curve.getPointAt(0) : WRITE[WRITE.length-1].curve.getPointAt(1).add(ePt2.set(10, 14, 20));
      const k = lifting ? ease(lifting.k) : doneK;
      brush.position.lerpVectors(a, b, k); brush.position.z += Math.sin(k*Math.PI)*6*SK;
      if (!lifting) brush.position.copy(WRITE[WRITE.length-1].curve.getPointAt(1)).add(ePt2.set(doneK*10, doneK*14, doneK*20));
      bUp.copy(camDir).multiplyScalar(.9).add(ePt2.set(.25, .35, 0)).normalize();
      tuft.scale.set(1, 1, 1); tipGlow.material.opacity = 0;
    }
    bQ.setFromUnitVectors(Y, bUp); brush.quaternion.slerp(bQ, 1 - Math.pow(.002, dt));
  } else if (m > .5) brush.visible = false;

  // map labels
  labels.style.opacity = m; labels.classList.toggle('on', m > .7);
  if (m > .01){
    nodes.forEach((n,k) => {
      v3.copy(stars[k]).project(cam);
      const lx = (v3.x*.5 + .5)*innerWidth;
      labelEls[k].style.transform = `translate(${lx}px, ${(-v3.y*.5 + .5)*innerHeight}px)`;
      labelEls[k].classList.toggle('flip', wide() && !labelEls[k].classList.contains('below') && lx + labelEls[k].offsetWidth + 24 > innerWidth);   // no room on the right: sit left of the planet
    });
  }
  $('#maptitle').style.opacity = m * doneK;
  $('#intro').style.opacity = clamp(-t*2.6 - 1.2, 0, 1);
  const outroK = clamp((m - .75)*4, 0, 1) * doneK;
  $('#outro').style.opacity = outroK; $('#outro').classList.toggle('on', outroK > .5);
  const key = inStar ? i : t < 0 ? -1 : N;
  if (key !== lastI){
    lastI = key;
    railBtns.forEach((b,k) => b.setAttribute('aria-current', k === key));
    $('#pNum').textContent = (inStar ? pad(i+1) : t < 0 ? '00' : pad(N)) + ' / ' + pad(N);
    $('#pName').textContent = inStar ? (P[i].a + ' ' + P[i].b).trim() : t < 0 ? 'Intro' : 'The map';
  }
  $('#pBar').style.transform = `scaleX(${clamp((t+1)/(N+1),0,1)})`;
  mmDone.style.strokeDashoffset = mmLen * (1 - painted/LTOT);
  mmDots.forEach((c, k) => c.classList.toggle('on', inStar && k === i));
  $('#minimap').style.opacity = 1 - clamp(m*3, 0, 1);
  $('#skip').style.opacity = 1 - clamp(m*3, 0, 1); $('#skip').style.pointerEvents = m > .3 ? 'none' : '';
  document.body.classList.toggle('on-map', m > .3);   // body is this scene's root (see engine/scope.js)
  SND.brushLevel(clamp(Math.max((painted - prev)/Math.max(dt,1e-3)/30, writing ? 1 : 0), 0, 1));
  drawFx(pageOpen ? near : 0);
}

async function boot(){
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]); } catch(_) {}
  const imgs = await Promise.all(P.map(p => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src(p); })));
  imgs.forEach((im, i) => { if (!im) return; const tx = new T.Texture(im); tx.needsUpdate = true; tx.wrapS = T.RepeatWrapping; nodes[i].pm.uniforms.shot.value = tx; nodes[i].pm.uniforms.useShot.value = 1; });
  resize();
  const ld = $('#loader'); ld.style.opacity = 0; setTimeout(() => ld.remove(), 650);
  const clock = new T.Clock();
  (function loop(){ requestAnimationFrame(loop); const dt = Math.min(clock.getDelta(), .05); frame(dt, clock.elapsedTime); skyLive(clock.elapsedTime); composer.render(); })();
}
boot();

  /* ======== /original ======== */
}
