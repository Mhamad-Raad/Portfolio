// How the samurai's surface is shaded (hero and dojo). Chosen look: "satin + moody" (B3).
//
// The model ships with per-pixel maps saying which parts are cloth, leather or metal; we keep them, with three corrections:
// - no surface is glossier than satin (the maps mark some plates mirror-smooth, which glared under the key light)
// - cloth (the materials with no metal) is matte instead of the maps' wet-looking finish
// - the jacket is solid cut-out cloth (the model marks it as see-through glass)
// Metal reflects a dim crimson/violet sky, so it reads as steel instead of plastic.
export const LOOK = {
  minRough: .52,        // nothing shinier than satin
  cloth: .92,           // roughness for cloth
  env: .75,             // strength of the reflected sky
  glare: .35,           // brightness of the sky's soft front light (the white plates' highlight)
  outline: .0011,       // hero ink outline thickness, as a fraction of distance
  key: .5, rim: 1.05,   // hero light balance: dimmer front light, stronger crimson/violet rims
};

/** a tiny prefiltered sky for reflections: near-black, crimson glow behind-left, violet behind-right, a soft key in front */
export function makeInkEnvironment(T, renderer, glare = LOOK.glare) {
  const pmrem = new T.PMREMGenerator(renderer);
  const sky = new T.Scene();
  sky.add(new T.Mesh(new T.SphereGeometry(10, 48, 24), new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `varying vec3 vD;
      float lobe(vec3 d, float p){ return pow(max(0., dot(normalize(vD), normalize(d))), p); }
      void main(){
        vec3 c = mix(vec3(.012,.01,.02), vec3(.05,.042,.07), smoothstep(-.3, .9, vD.y));
        c += vec3(.95,.07,.16) * lobe(vec3(-.75,.25,-.6), 5.) * 1.5;
        c += vec3(.45,.30,1.0) * lobe(vec3(.75,.25,-.6), 5.) * 1.3;
        c += vec3(1.,.95,.92) * lobe(vec3(.3,.6,.8), 14.) * 2.2 * ${glare.toFixed(3)};
        gl_FragColor = vec4(c, 1.); }`,
  })));
  const rt = pmrem.fromScene(sky, .02);
  pmrem.dispose();
  return rt.texture;
}

const minRough = { value: LOOK.minRough };
function addMinRoughness(mt) {
  if (mt.userData.minRough) return;
  mt.userData.minRough = true;
  const prev = mt.onBeforeCompile;
  mt.onBeforeCompile = (sh, r) => {
    prev && prev.call(mt, sh, r);
    sh.uniforms.uMinRough = minRough;
    sh.fragmentShader = 'uniform float uMinRough;\n' + sh.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n\troughnessFactor = max(roughnessFactor, uMinRough);');
  };
  mt.customProgramCacheKey = () => 'minRough';
}

/** every unique material under a loaded model */
export function materialsOf(root) {
  const set = new Set();
  root.traverse(o => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m && set.add(m)); });
  return [...set];
}

/** apply the look to the loaded samurai */
export function dressSamurai(root, env) {
  for (const mt of materialsOf(root)) {
    addMinRoughness(mt);
    if (mt.metalness === 0 && 'roughness' in mt) { mt.roughnessMap = null; mt.roughness = LOOK.cloth; }
    if (mt.transparent) { mt.transparent = false; mt.alphaTest = .5; mt.depthWrite = true; }
    if ('clearcoat' in mt) mt.clearcoat = 0;
    if ('transmission' in mt) mt.transmission = 0;
    if ('specularIntensity' in mt) mt.specularIntensity = Math.min(mt.specularIntensity, .35);
    if (mt.emissive) mt.emissiveIntensity = .3;
    mt.envMap = env; mt.envMapIntensity = LOOK.env;
    mt.needsUpdate = true;
  }
}
