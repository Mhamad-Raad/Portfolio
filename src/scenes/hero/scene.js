// Ported from the approved draft hero/index.html.
// The original code runs inside mount() with a scoped document, gated listeners and a pausable rAF.
import { THREE, MeshoptDecoder } from '../../engine/three.js';
import { createScope } from '../../engine/scope.js';
import { samuraiBytes, SAMURAI_BYTES } from '../../engine/model.js';
import { LOOK, makeInkEnvironment, dressSamurai } from '../../engine/samuraiLook.js';
import { createEdge } from '../../engine/edge.js';
import markup from './markup.html?raw';
import * as DATA from '../../data/index.js';
import './style.css';

export default async function mount(root, api) {
  root.innerHTML = DATA.fill(markup);
  const { document, addEventListener, removeEventListener, requestAnimationFrame, cancelAnimationFrame, fetch } = createScope(root, api);
  const scrollTo = () => {};
  /* ======== original ======== */

(() => {
const T = THREE;
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t) => a + (b-a)*t;
const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = t => t*t*(3-2*t);
const span = (s,a,b) => clamp01((s-a)/(b-a));
const easeIn = t => t*t*t;
const easeOut = t => 1 - Math.pow(1-t, 3);
const V = (x,y,z) => new T.Vector3(x,y,z);

/* story beats (seconds) */
const K = { summon:1.15, name:2.25, blade:3.35, hit:3.6, split:3.74, settle:4.7, end:5.5 };

/* ---------------- renderer + world ---------------- */
const canvas = $('#gl');
const renderer = new T.WebGLRenderer({ canvas, antialias:false, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputEncoding = T.sRGBEncoding;
renderer.toneMapping = T.NoToneMapping;
const scene = new T.Scene();
scene.fog = new T.FogExp2(0x050507, 0.03);
const camera = new T.PerspectiveCamera(40, 1, 0.1, 400);
scene.add(camera);

const bgMat = new T.ShaderMaterial({
  depthWrite:false, depthTest:false, fog:false, uniforms:{ uTime:{value:0} },
  vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader:`varying vec2 vUv; uniform float uTime;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
    void main(){ vec2 p=vUv;
      float a=fbm(p*2.6+vec2(uTime*.01,0.)); float b=fbm(p*5.+vec2(0.,uTime*.015)+a);
      vec3 c=vec3(.006,.005,.011);
      c+=vec3(.42,.02,.06)*pow(a*smoothstep(.9,.1,p.x+p.y*.3),2.6)*.9;
      c+=vec3(.20,.08,.55)*pow(b*smoothstep(.1,1.,p.x),2.6)*.9;
      gl_FragColor=vec4(c,1.); }`
});
const bg = new T.Mesh(new T.PlaneGeometry(2,2), bgMat);
bg.renderOrder = -10; bg.frustumCulled = false; bg.position.z = -150; camera.add(bg);
function fitBg(){ const h = 2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*150; bg.scale.set(h*camera.aspect/2*1.3, h/2*1.3, 1); }

const ground = new T.Mesh(new T.CircleGeometry(40, 64), new T.MeshStandardMaterial({ color:0x040306, roughness:.32, metalness:.95 }));
ground.rotation.x = -Math.PI/2; scene.add(ground);
scene.add(new T.HemisphereLight(0x7a6a90, 0x050307, .55));
const key = new T.DirectionalLight(0xfff1ee, 1.5); key.position.set(2,4,6); scene.add(key);
const fill = new T.DirectionalLight(0xd9d4ff, .6); fill.position.set(-3,2,5); scene.add(fill);
const rimR = new T.DirectionalLight(0xff2a45, 1.9); rimR.position.set(-5,3,-4); scene.add(rimR);
const rimV = new T.DirectionalLight(0x8b5cf6, 2.0); rimV.position.set(5,3,-4); scene.add(rimV);

const dot = (() => { const c=document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d');
  const r=g.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,'rgba(255,255,255,1)'); r.addColorStop(.3,'rgba(255,255,255,.6)'); r.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=r; g.fillRect(0,0,64,64); return new T.CanvasTexture(c); })();
const glowRing = new T.Mesh(new T.RingGeometry(1.1,1.16,96), new T.MeshBasicMaterial({ color:new T.Color(2.4,.25,.4), transparent:true, opacity:.9, side:T.DoubleSide, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false }));
glowRing.rotation.x = -Math.PI/2; glowRing.position.y = .01; scene.add(glowRing);

const EN = 420, ePos = new Float32Array(EN*3), eCol = new Float32Array(EN*3), eSpd = new Float32Array(EN);
for(let i=0;i<EN;i++){ ePos.set([(Math.random()-.5)*22, Math.random()*8, (Math.random()-.5)*14-2],i*3); eSpd[i]=.2+Math.random()*.6;
  eCol.set(Math.random()<.6?[1.6,.15,.25]:[.9,.5,2.2],i*3); }
const eGeo = new T.BufferGeometry(); eGeo.setAttribute('position', new T.BufferAttribute(ePos,3)); eGeo.setAttribute('color', new T.BufferAttribute(eCol,3));
scene.add(new T.Points(eGeo, new T.PointsMaterial({ size:.06, map:dot, vertexColors:true, transparent:true, opacity:.8, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false })));
const STN = 2200, stPos = new Float32Array(STN*3), stCol = new Float32Array(STN*3);
for(let i=0;i<STN;i++){ const u=Math.random()*.9+.05, a=Math.random()*Math.PI*2, r=Math.sqrt(1-u*u), R=90+Math.random()*40;
  stPos.set([r*Math.cos(a)*R, u*R*.7+2, r*Math.sin(a)*R],i*3); const w=Math.random(); const c = w<.08?[1.6,.3,.4]: w<.16?[.8,.6,1.8]:[1,1,1.1]; const b=.4+Math.random()*.8; stCol.set(c.map(v=>v*b),i*3); }
const stGeo = new T.BufferGeometry(); stGeo.setAttribute('position', new T.BufferAttribute(stPos,3)); stGeo.setAttribute('color', new T.BufferAttribute(stCol,3));
const stars = new T.Points(stGeo, new T.PointsMaterial({ size:.55, map:dot, vertexColors:true, transparent:true, opacity:1, depthWrite:false, fog:false, blending:T.AdditiveBlending, toneMapped:false }));
scene.add(stars);

/* giant name: a 3D plane in the world, and the same texture brushed onto the paper */
const nameMat = new T.MeshBasicMaterial({ transparent:true, depthWrite:false, fog:false, opacity:.95 });
const nameMesh = new T.Mesh(new T.PlaneGeometry(1,1), nameMat);
nameMesh.position.set(0,2.35,-3.2); scene.add(nameMesh);
let nameLayout = '', nameTex = null, nameBase = null;
function buildName(){
  const two = camera.aspect < .9; const layout = two ? 'two' : 'one'; if(layout===nameLayout) return; nameLayout = layout;
  const c=document.createElement('canvas'); c.width=4096; c.height=two?1800:820; const g=c.getContext('2d');
  const grd=g.createLinearGradient(0,0,0,c.height); grd.addColorStop(0,'#ff3b52'); grd.addColorStop(.6,'#c3142c'); grd.addColorStop(1,'#3a0610');
  g.fillStyle=grd; g.textAlign='center'; g.textBaseline='middle';
  if(two){ g.font='820px Anton, Impact, sans-serif'; g.fillText('MHAMAD',2048,470); g.fillText('RAAD',2048,1330); }
  else { g.font='720px Anton, Impact, sans-serif'; g.fillText('MHAMAD RAAD',2048,430); }
  nameTex=new T.CanvasTexture(c); nameTex.encoding=T.sRGBEncoding; nameTex.anisotropy=4;
  nameMat.map = nameTex; nameMat.needsUpdate = true;
  const w = two ? 6.6 : 11.6; nameMesh.scale.set(w, w*c.height/c.width, 1); nameBase = nameMesh.scale.clone();
  nameMesh.position.y = two ? 3.0 : 2.35;
  if (ink) ink.uniforms.tName.value = nameTex;
}

/* ---------------- samurai ---------------- */
const samurai = new T.Group(); scene.add(samurai);
samurai.position.set(1.05,0,.55); samurai.rotation.y = -.32;
const lean = new T.Group(); samurai.add(lean);
let samReady = false;
// ink outline: a black back-face shell pushed out along the normals; uOutline is its thickness (set by the look)
const outlineU = { value: LOOK.outline };
function outlineMat(){
  const m = new T.MeshBasicMaterial({ color:0x000000, side:T.BackSide });
  m.onBeforeCompile = sh => { sh.uniforms.uOutline = outlineU; sh.vertexShader = 'uniform float uOutline;\n' + sh.vertexShader.replace('#include <project_vertex>',
    `vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
     vec3 nv = normalize( normalMatrix * normal );
     mvPosition.xyz += nv * uOutline * (-mvPosition.z);
     gl_Position = projectionMatrix * mvPosition;`); };
  return m;
}
function mountSamurai(gltf){
  const m = gltf.scene;
  let bb = new T.Box3().setFromObject(m); const s = V(); bb.getSize(s);
  if (s.z > s.y*1.2) { m.rotation.x = -Math.PI/2; m.updateMatrixWorld(true); bb.setFromObject(m); bb.getSize(s); }
  m.scale.multiplyScalar(2.25 / s.y); m.updateMatrixWorld(true);
  bb.setFromObject(m); const c = V(); bb.getCenter(c);
  m.position.x -= c.x; m.position.z -= c.z; m.position.y -= bb.min.y;
  lean.add(m);
  const om = outlineMat();
  const meshes = []; m.traverse(o => { if (o.isMesh) meshes.push(o); });
  dressSamurai(m, makeInkEnvironment(T, renderer));
  meshes.forEach(o => { o.layers.enable(1); const ol = new T.Mesh(o.geometry, om); ol.layers.enable(1); o.add(ol); });
  samReady = true;
}
/* light balance for the chosen samurai look (engine/samuraiLook.js) */
rimR.intensity *= LOOK.rim; rimV.intensity *= LOOK.rim; key.intensity *= LOOK.key;

async function fetchModel(onBytes){
  const buf = await samuraiBytes(onBytes);
  const loader = new T.GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  return new Promise((ok,err)=> loader.parse(buf,'',ok,err));
}

/* ---------------- silhouette mask (samurai only, white on black) ---------------- */
const maskRT = new T.WebGLRenderTarget(2,2);
const white = new T.MeshBasicMaterial({ color:0xffffff, fog:false });
function renderMask(){
  const fog = scene.fog; scene.fog = null; scene.overrideMaterial = white;
  camera.layers.set(1);
  renderer.setRenderTarget(maskRT); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  camera.layers.set(0); scene.overrideMaterial = null; scene.fog = fog;
}

/* ---------------- ink trail simulation (ping-pong) ---------------- */
const simA = new T.WebGLRenderTarget(2,2,{ type:T.HalfFloatType }), simB = simA.clone();
let simRead = simA, simWrite = simB;
const simCam = new T.OrthographicCamera(-1,1,1,-1,0,1);
const simMat = new T.ShaderMaterial({
  uniforms:{ tPrev:{value:null}, uMouse:{value:new T.Vector2(-1,-1)}, uPrev:{value:new T.Vector2(-1,-1)}, uForce:{value:0}, uTime:{value:0}, uAspect:{value:1} },
  vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader:`varying vec2 vUv; uniform sampler2D tPrev; uniform vec2 uMouse,uPrev; uniform float uForce,uTime,uAspect;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    void main(){
      vec2 flow=vec2(n(vUv*4.+uTime*.15)-.5, n(vUv*4.+7.3-uTime*.15)-.5)*.006 + vec2(0.,.0009);
      float v=texture2D(tPrev, vUv-flow).r*.972;
      vec2 a=(vUv-uPrev)*vec2(uAspect,1.), b=(uMouse-uPrev)*vec2(uAspect,1.);
      float k=clamp(dot(a,b)/max(dot(b,b),1e-6),0.,1.); float d=length(a-b*k);
      v+=exp(-d*d/.00018)*uForce;
      gl_FragColor=vec4(min(v,2.5),0.,0.,1.);
    }`
});
const simScene = new T.Scene(); simScene.add(new T.Mesh(new T.PlaneGeometry(2,2), simMat));
const mouse = { x:-1, y:-1, px:-1, py:-1, tx:0, ty:0, sx:0, sy:0, moved:false };
addEventListener('pointermove', e => { mouse.x = e.clientX/innerWidth; mouse.y = 1 - e.clientY/innerHeight; mouse.moved = true;
  mouse.tx = e.clientX/innerWidth-.5; mouse.ty = e.clientY/innerHeight-.5; });
function stepSim(t, on){
  if (mouse.px < 0) { mouse.px = mouse.x; mouse.py = mouse.y; }
  const sp = Math.hypot(mouse.x-mouse.px, mouse.y-mouse.py);
  simMat.uniforms.tPrev.value = simRead.texture;
  simMat.uniforms.uMouse.value.set(mouse.x, mouse.y); simMat.uniforms.uPrev.value.set(mouse.px, mouse.py);
  simMat.uniforms.uForce.value = on ? Math.min(sp*30, 1.) : 0;
  simMat.uniforms.uTime.value = t;
  renderer.setRenderTarget(simWrite); renderer.render(simScene, simCam); renderer.setRenderTarget(null);
  [simRead, simWrite] = [simWrite, simRead];
  mouse.px = mouse.x; mouse.py = mouse.y;
}

/* ---------------- post: bloom on the world, then the paper/ink/blade composite ---------------- */
// the world is drawn into this buffer before the ink composite; 4× MSAA keeps the samurai's edges and highlights from stair-stepping
const rt = new T.WebGLRenderTarget(2,2,{ type:T.HalfFloatType, samples: innerWidth < 820 ? 2 : 4 });
const composer = new T.EffectComposer(renderer, rt);
composer.addPass(new T.RenderPass(scene, camera));
const bloom = new T.UnrealBloomPass(new T.Vector2(2,2), .7, .5, .92);
composer.addPass(bloom);
const ink = new T.ShaderPass({
  uniforms:{
    tDiffuse:{value:null}, tMask:{value:null}, tTrail:{value:null}, tName:{value:null},
    uTime:{value:0}, uAspect:{value:1}, uS:{value:0}, uLoad:{value:0}, uLoading:{value:1},
    uSil:{value:0}, uDrain:{value:0}, uReveal:{value:0}, uCut:{value:0}, uSplit:{value:0}, uImpact:{value:0}, uPaper:{value:1}, uHero:{value:0},
    uRect:{value:new T.Vector4(0,0,1,1)}
  },
  vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader:`
    varying vec2 vUv;
    uniform sampler2D tDiffuse,tMask,tTrail,tName;
    uniform float uTime,uAspect,uS,uLoad,uLoading,uSil,uDrain,uReveal,uCut,uSplit,uImpact,uPaper,uHero;
    uniform vec4 uRect;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.07;a*=.5;}return v;}
    vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
    vec3 toSRGB(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
    const vec2 DIR=vec2(-.85,-.527);          // the cut runs top-right → bottom-left
    vec2 NRM(){return vec2(-DIR.y,DIR.x);}

    // six main drops + small splatter; returns coverage, writes edge and red-ink amount
    float inkField(vec2 uv, float t, out float edge, out float red){
      vec2 p=vec2(uv.x*uAspect,uv.y); float ink=0.; edge=0.; red=0.;
      for(int i=0;i<22;i++){
        float fi=float(i); vec2 c; float t0; float R;
        if(i==0){c=vec2(.56,.52);t0=0.;R=.62;}
        else if(i==1){c=vec2(.16,.74);t0=.16;R=.34;}
        else if(i==2){c=vec2(.86,.28);t0=.28;R=.36;}
        else if(i==3){c=vec2(.28,.2);t0=.42;R=.3;}
        else if(i==4){c=vec2(.8,.84);t0=.52;R=.26;}
        else if(i==5){c=vec2(.04,.36);t0=.62;R=.22;}
        else { c=vec2(h(vec2(fi,1.)),h(vec2(fi,2.))); t0=.05+h(vec2(fi,3.))*.7; R=.006+h(vec2(fi,4.))*.028; }
        float tt=t-t0; if(tt<=0.) continue;
        float r=R*(1.-exp(-tt*2.8))*(1.+.1*sqrt(tt));
        vec2 q=p-vec2(c.x*uAspect,c.y);
        float d=length(q); float ang=atan(q.y,q.x);
        float w=(fbm(vec2(ang*1.6+fi*3.1, tt*.5+fi))-.5)*.55*r + (fbm(q*7.+fi)-.5)*.22*r + (fbm(q*38.+fi)-.5)*.012;
        float e=d-r-w-(n(uv*vec2(300.,34.))-.5)*.007;
        float m=smoothstep(.0045,-.0035,e);
        ink=max(ink,m);
        edge=max(edge, exp(-abs(e)*160.)*m);
        if(i==2||i==4||i==9||i==13) red=max(red,m);
      }
      return ink;
    }
    float blurMask(vec2 uv){ float s=0.; float j=h(uv*917.)*6.283; for(int i=0;i<24;i++){ float fi=float(i); float a=fi*2.39996+j; float r=.02+.1*sqrt(fract(fi*.618+.31));
      s+=texture2D(tMask, uv+vec2(cos(a),sin(a))*r*vec2(1./uAspect,1.)).r; } return s/24.; }

    vec3 paperAt(vec2 uv){
      vec3 col=vec3(.935,.926,.945);
      col+=(n(uv*vec2(620.,70.))-.5)*.022+(fbm(uv*9.)-.5)*.03;           // fibres + tone
      vec2 p=vec2(uv.x*uAspect,uv.y); vec2 C=vec2(.5*uAspect,.5);
      // the blade line drawn while loading
      float along=dot(p-C,DIR), across=dot(p-C,NRM());
      float L=length(vec2(uAspect,1.))*.5;
      float drawn=step(along,-L+2.*L*uLoad);
      float bl=smoothstep(.0028,.0008,abs(across))*drawn*uLoading;
      col=mix(col,vec3(.78,.07,.13),bl);
      // the name, brushed left → right
      vec2 nuv=(uv-uRect.xy)/(uRect.zw-uRect.xy);
      if(nuv.x>0.&&nuv.x<1.&&nuv.y>0.&&nuv.y<1.&&uReveal>0.){
        vec4 tx=texture2D(tName,nuv);
        float front=nuv.x-uReveal*1.2+(fbm(vec2(nuv.y*5.,2.))-.5)*.14;
        float m=smoothstep(.02,-.02,front);
        float streak=smoothstep(.25,.7,fbm(vec2(nuv.x*3.,nuv.y*70.)));
        m*=mix(streak,1.,smoothstep(-.02,-.3,front));
        vec3 pig=vec3(.8,.08,.14)*(.88+.24*fbm(nuv*vec2(30.,8.)));
        col=mix(col,pig,tx.a*m*.96);
      }
      // ink: bloom, drain toward the samurai, silhouette
      float edge,red; float I=inkField(uv,uS,edge,red);
      float bm=blurMask(uv);
      float keep=smoothstep(uDrain-.22,uDrain,bm*1.1+fbm(uv*4.+3.)*.45);
      I*=keep; edge*=keep; red*=keep;
      vec2 j=(vec2(fbm(uv*28.+uTime*.3),fbm(uv*28.+9.))-.5)*.007;
      float sil=texture2D(tMask,uv+j).r;
      float silInk=smoothstep(.32,.62,sil+bm*.22)*uSil;
      float g=fbm(uv*vec2(80.,60.));
      vec3 sumi=mix(vec3(.15,.11,.21),vec3(.02,.016,.03),.55+.45*smoothstep(.25,.75,g));
      vec3 inkCol=mix(sumi,vec3(.62,.04,.1),red*(1.-silInk));
      inkCol*=1.-edge*.55;
      col=mix(col,inkCol,max(I,silInk));
      return col;
    }

    void main(){
      vec2 uv=vUv; vec2 p=vec2(uv.x*uAspect,uv.y); vec2 C=vec2(.5*uAspect,.5); vec2 N=NRM();
      // world
      vec3 w=texture2D(tDiffuse,uv).rgb;
      float tr=texture2D(tTrail,uv).r; float silW=texture2D(tMask,uv).r;
      vec3 trailCol=mix(vec3(.16,.004,.02),vec3(.05,.01,.09),n(uv*2.5+uTime*.08));
      float ta=smoothstep(.05,.9,tr)*(1.-silW)*uHero;
      w=mix(w,trailCol,ta*.85);
      w+=vec3(.35,.01,.05)*exp(-abs(tr-.35)*9.)*ta*.25;
      vec3 col=toSRGB(aces(w*.95));
      if(uPaper>.5){
        float jag=(n(vec2(dot(p-C,DIR)*70.,3.))-.5)*.006;
        vec2 dA=(N*.95+DIR*.12)*uSplit;
        vec2 pa=p-dA, pb=p+dA;
        float sa=dot(pa-C,N)+jag, sb=dot(pb-C,N)+jag;
        if(sa>0.){ col=paperAt(vec2(pa.x/uAspect,pa.y)); col=mix(col,vec3(1.,.28,.22),exp(-sa*110.)*step(.001,uSplit)); }
        else if(sb<0.){ col=paperAt(vec2(pb.x/uAspect,pb.y)); col=mix(col,vec3(1.,.28,.22),exp(sb*110.)*step(.001,uSplit)); }
        else { col*=1.-.55*exp(-min(-sa,sb)*22.); }
        // the blade cut being drawn
        if(uCut>0.&&uSplit<.001){
          float along=dot(p-C,DIR), across=dot(p-C,N);
          float L=length(vec2(uAspect,1.))*.5;
          float front=-L+2.*L*uCut; float vis=step(along,front);
          float core=smoothstep(.003,.0005,abs(across))*vis;
          float glow=exp(-abs(across)*45.)*vis;
          float head=exp(-length(vec2(along-front,across))*30.)*step(uCut,.999);
          col=mix(col,vec3(.85,.05,.12),glow*.45);
          col=mix(col,vec3(1.),core+head);
        }
        if(uImpact>.5){ float lum=dot(col,vec3(.299,.587,.114)); float redness=smoothstep(.2,.45,col.r-max(col.g,col.b)); col=mix(vec3(1.-lum),vec3(.95,.1,.18),redness); }
      }
      gl_FragColor=vec4(clamp(col,0.,1.),1.);
    }`
});
composer.addPass(ink);

/* ---------------- state ---------------- */
let s = 0, playing = false, shake = 0, loadShown = 0, loadTarget = 0, loadT0 = performance.now();

const HERO = { pos:V(0,1.25,7.4), look:V(0,1.5,0) };
const camPos = V(), camLook = V(), tmpV = V(), sph = new T.Spherical();
let distK = 1;
const orbit = { yaw:0, pitch:0, ty:0, tp:0, zoom:1, tz:1, drag:false, lx:0, ly:0 };
canvas.addEventListener('pointerdown', e => { if (document.body.dataset.phase!=='hero') return; orbit.drag=true; orbit.lx=e.clientX; orbit.ly=e.clientY; canvas.classList.add('drag'); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if(!orbit.drag) return; const dx=e.clientX-orbit.lx, dy=e.clientY-orbit.ly; orbit.lx=e.clientX; orbit.ly=e.clientY;
  orbit.ty = Math.max(-1.3, Math.min(1.3, orbit.ty - dx*.006)); orbit.tp = Math.max(-.35, Math.min(.3, orbit.tp - dy*.004)); });
const endDrag = () => { orbit.drag=false; canvas.classList.remove('drag'); };
canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

function setPhase(p, chip){
  if (document.body.dataset.phase !== p) document.body.dataset.phase = p;
}
setPhase('loading','');

function skipToEnd(){ s = K.end; shake = 0; playing = true; loadShown = 1; }
// the intro plays once per visit; if the hero is rebuilt after the visitor wandered far, it opens on the samurai
if (api.revisit) skipToEnd();
$('#skip').addEventListener('click', skipToEnd);
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.dataset.phase !== 'hero') skipToEnd(); });
// once the samurai stands, scrolling on leaves for the work
const edge = createEdge(api), heroAtEnd = () => document.body.dataset.phase === 'hero', never = () => false;
addEventListener('wheel', e => { edge.wheel(e, never, heroAtEnd); }, { passive:true });
addEventListener('touchstart', e => edge.touchstart(e), { passive:true });
addEventListener('touchend', e => edge.touchend(e, never, heroAtEnd), { passive:true });
addEventListener('keydown', e => { edge.key(e, never, heroAtEnd); });

/* name rect in screen uv, from the 3D plane's corners */
const corners = [V(-.5,-.5,0),V(.5,-.5,0),V(.5,.5,0),V(-.5,.5,0)];
function nameRect(){
  nameMesh.updateMatrixWorld(); let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for (const c of corners){ tmpV.copy(c).applyMatrix4(nameMesh.matrixWorld).project(camera); const x=tmpV.x*.5+.5, y=tmpV.y*.5+.5; x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); }
  ink.uniforms.uRect.value.set(x0,y0,x1,y1);
}

/* ---------------- frame ---------------- */
const clock = new T.Clock();
function frame(){
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 1/20), t = clock.elapsedTime;
  if (document.body.dataset.phase === 'hero' && scrollY > innerHeight*1.15) return;   // hero off-screen: stop drawing it
  const U = ink.uniforms;

  // loading: blade line grows on the paper
  const cap = Math.min(1, (performance.now()-loadT0)/1400);
  loadShown += (Math.min(loadTarget, cap) - loadShown) * .08;
  $('#pct').textContent = Math.round(loadShown*100) + '%';
  if (!playing && loadShown > .995 && samReady) { playing = true; if (reduced) skipToEnd(); }
  if (playing) s += dt;

  // phase + chips
  if (!playing) setPhase('loading','');
  else if (s < K.summon) setPhase('ink','ink');
  else if (s < K.name) setPhase('summon','summon');
  else if (s < K.blade) setPhase('name','name');
  else if (s < K.settle) setPhase('cut','cut');
  else setPhase('hero','cut');

  // samurai idle
  if (samReady) { lean.rotation.x = Math.sin(t*1.3)*.012; lean.position.y = Math.sin(t*1.3)*.012; samurai.rotation.y = -.32 + (s>=K.settle ? mouse.sx*.0 : 0); }

  // camera: hero framing, slow push during the intro, orbit after
  camPos.copy(HERO.pos); camLook.copy(HERO.look);
  const push = 1 - smooth(span(s, 0, K.split))*.06;
  tmpV.subVectors(camPos, camLook).multiplyScalar(distK * (playing ? lerp(1.06, 1, smooth(span(s,0,K.split))) : 1.06));
  if (s >= K.split) {
    orbit.yaw += (orbit.ty-orbit.yaw)*.08; orbit.pitch += (orbit.tp-orbit.pitch)*.08; orbit.zoom += (orbit.tz-orbit.zoom)*.08;
    mouse.sx += (mouse.tx-mouse.sx)*.05; mouse.sy += (mouse.ty-mouse.sy)*.05;
    const k = smooth(span(s, K.split, K.end));
    sph.setFromVector3(tmpV); sph.theta += (orbit.yaw + mouse.sx*.12)*k; sph.phi = Math.max(.6, Math.min(1.75, sph.phi + (orbit.pitch + mouse.sy*.05)*k)); sph.radius *= lerp(1, orbit.zoom, k);
    tmpV.setFromSpherical(sph);
  }
  camera.position.copy(camLook).add(tmpV);
  if (shake > 0) { camera.position.x += (Math.random()-.5)*.25*shake; camera.position.y += (Math.random()-.5)*.25*shake; shake = Math.max(0, shake - dt*2.5); }
  camera.lookAt(camLook);

  // world ambience
  for (let i=0;i<EN;i++){ const j=i*3; ePos[j+1]+=eSpd[i]*dt; ePos[j]+=Math.sin(t*.7+i)*dt*.12; if(ePos[j+1]>8) ePos[j+1]=0; }
  eGeo.attributes.position.needsUpdate = true;
  stars.rotation.y = t*.004;
  bgMat.uniforms.uTime.value = t;
  glowRing.position.set(samurai.position.x, .01, samurai.position.z);
  glowRing.material.opacity = .5 + Math.sin(t*2)*.15;

  // composite uniforms
  U.uTime.value = t; U.uS.value = playing ? s : 0;
  U.uLoad.value = loadShown;
  U.uLoading.value = playing ? 1 - smooth(span(s, 0, .45)) : 1;
  U.uSil.value = smooth(span(s, K.summon-.15, K.summon+.6));
  U.uDrain.value = lerp(-.02, 1.4, smooth(span(s, K.summon, K.name+.35)));
  U.uReveal.value = easeOut(span(s, K.name, K.blade-.1));
  U.uCut.value = easeIn(span(s, K.blade, K.hit));
  const wasImpact = U.uImpact.value;
  U.uImpact.value = (s >= K.hit && s < K.split) ? 1 : 0;
  if (!wasImpact && U.uImpact.value) shake = 1;
  U.uSplit.value = easeOut(span(s, K.split, K.settle)) * 1.1;
  U.uPaper.value = s < K.settle ? 1 : 0;
  U.uHero.value = smooth(span(s, K.split, K.end));
  nameRect();

  stepSim(t, s >= K.split);
  U.tTrail.value = simRead.texture;
  if (samReady) renderMask();
  U.tMask.value = maskRT.texture;
  composer.render();
}

function resize(){
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
  const pr = renderer.getPixelRatio();
  maskRT.setSize(Math.round(w*pr*.5), Math.round(h*pr*.5));
  simA.setSize(Math.round(w*.5), Math.round(h*.5)); simB.setSize(Math.round(w*.5), Math.round(h*.5));
  camera.aspect = w/h; camera.updateProjectionMatrix(); fitBg();
  ink.uniforms.uAspect.value = w/h; simMat.uniforms.uAspect.value = w/h;
  // portrait phones: the samurai stands centred in front of the stacked name, closer, above the copy
  const tall = camera.aspect < .9;
  distK = tall ? 1 + (1-camera.aspect)*.55 : camera.aspect < 1 ? 1 + (1-camera.aspect)*1.5 : 1;
  samurai.position.x = tall ? .1 : 1.05; samurai.rotation.y = tall ? -.18 : -.32;
  HERO.look.y = tall ? 1.15 : 1.5;
  buildName();
  // the name never runs off the sides: fit it to the visible width at its depth
  const dist = HERO.pos.z*distK - nameMesh.position.z, visW = 2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*dist*camera.aspect;
  nameMesh.scale.copy(nameBase).multiplyScalar(Math.min(1, visW*1.18/nameBase.x));   // the texture has side margins; the letters themselves fill ~80%
}
addEventListener('resize', resize);

/* ---------------- boot ---------------- */
(async () => {
  try { await document.fonts.load('400 200px Anton'); } catch(e) {}
  resize(); ink.uniforms.tName.value = nameTex;
  frame();
  const SIZE = SAMURAI_BYTES;
  try {
    const gltf = await fetchModel(b => { loadTarget = Math.min(.97, b/SIZE); $('#mb').textContent = (b/1e6).toFixed(1); });
    mountSamurai(gltf);
    try { renderer.compile(scene, camera); } catch(e) {}
  } catch (e) {
    const el = $('#err'); el.style.display = 'block'; el.textContent = 'The samurai model did not load: ' + e.message + '.'; console.error(e);
    samReady = true;
  }
  loadTarget = 1;
})();
})();

  /* ======== /original ======== */
}
