// Bring a static star cloud to life: every star twinkles at its own pace, and the field turns very slowly
// around the vertical axis, like the night sky. Works on a THREE.Points with a vertex-coloured PointsMaterial.
export function liveStars(points, { spin = .003, depth = .45 } = {}) {
  const geo = points.geometry, n = geo.attributes.position.count;
  const phase = new Float32Array(n); for (let i = 0; i < n; i++) phase[i] = Math.random();
  geo.setAttribute('aPhase', new geo.attributes.position.constructor(phase, 1));   // a BufferAttribute, without importing three here
  const uTime = { value: 0 };
  const mat = points.material;
  mat.onBeforeCompile = sh => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = 'attribute float aPhase;\nuniform float uTime;\n' + sh.vertexShader.replace('#include <color_vertex>',
      `#include <color_vertex>
       #ifdef USE_COLOR
         float tw = sin(uTime * (.45 + fract(aPhase * 7.31) * 1.9) + aPhase * 6.2831);
         vColor *= ${(1 - depth).toFixed(2)} + ${depth.toFixed(2)} * (.5 + .5 * tw);
       #endif`);
  };
  mat.customProgramCacheKey = () => 'liveStars';
  mat.needsUpdate = true;
  return t => { uTime.value = t; points.rotation.y = t * spin; };
}
