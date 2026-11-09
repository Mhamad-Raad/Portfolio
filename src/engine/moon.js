// The red moon (About and Contact). Same crimson palette as before, with a believable surface:
// darker maria and brighter highlands from layered noise, fine grain, craters of many sizes with a lit rim and a
// shadowed side (light from the upper left), a few ray craters, and limb darkening toward the edge.
// Generated once on a canvas and shared by every scene that shows the moon.

let cache = null;

function noise2(seed) {
  const P = new Uint8Array(512);
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  const g = (h) => P[h] / 255;
  const fade = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const a = g(P[(xi & 255)] + (yi & 255)), b = g(P[((xi + 1) & 255)] + (yi & 255));
    const c = g(P[(xi & 255)] + ((yi + 1) & 255)), d = g(P[((xi + 1) & 255)] + ((yi + 1) & 255));
    const u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function fbm(n, x, y, oct) { let v = 0, a = .5, f = 1; for (let i = 0; i < oct; i++) { v += a * n(x * f, y * f); f *= 2.03; a *= .5; } return v; }

/** the moon's face as a canvas (transparent outside the disc) */
export function moonCanvas(size = 1024) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), img = x.createImageData(size, size), d = img.data;
  const n1 = noise2(7), n2 = noise2(31), R = size / 2 - 1;
  // the original palette: bright crimson toward the light (upper left), deep blood at the edge
  const C0 = [0xb3, 0x17, 0x2f], C1 = [0x7a, 0x0e, 0x20], C2 = [0x3a, 0x06, 0x10];
  const lx = size * .45, ly = size * .43;
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    const dx = px - size / 2, dy = py - size / 2, r = Math.hypot(dx, dy) / R;
    const i = (py * size + px) * 4;
    if (r > 1.004) { d[i + 3] = 0; continue; }
    // base gradient (as before)
    const t = Math.min(1, Math.hypot(px - lx, py - ly) / (size * .5));
    const k = t < .7 ? t / .7 : (t - .7) / .3, A = t < .7 ? C0 : C1, B = t < .7 ? C1 : C2;
    let col = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k];
    // surface: maria (large dark seas) and highlands, plus grain
    const u = px / size, v = py / size;
    const m0 = fbm(n1, u * 2.3 + 2, v * 2.3 + 5, 5);
    const maria = Math.min(1, Math.max(0, (m0 - .45) * 3.6));                            // 0..1 where the dark seas are
    const grain = fbm(n2, u * 48, v * 48, 3) - .5;
    const mottled = fbm(n2, u * 11 + 9, v * 11 + 3, 4) - .5;
    let lum = 1 - maria * .5 + mottled * (.1 + .08 * (1 - maria)) + grain * .07;
    // limb darkening: a real full moon falls off toward its edge
    lum *= .78 + .22 * Math.sqrt(Math.max(0, 1 - r * r));
    col = col.map(ch => Math.max(0, Math.min(255, ch * lum)));
    const edge = Math.min(1, (1.004 - r) * R / 1.5);                                    // soft antialiased rim
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255 * edge;
  }
  x.putImageData(img, 0, 0);

  // craters, power-law sizes; light from the upper left: rim lit on the lower right inside, shadow on the upper left
  x.save(); x.beginPath(); x.arc(size / 2, size / 2, R, 0, Math.PI * 2); x.clip();
  let s = 99; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // a crater is a bowl: the side facing the light (upper left) falls into shadow inside, the far side catches light
  const crater = (cx, cy, cr, depth) => {
    const o = cr * .35;
    let g = x.createRadialGradient(cx - o, cy - o, 0, cx - o, cy - o, cr * 1.05);
    g.addColorStop(0, `rgba(30,3,8,${.30 * depth})`); g.addColorStop(.7, `rgba(30,3,8,${.12 * depth})`); g.addColorStop(1, 'rgba(30,3,8,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, cr, 0, Math.PI * 2); x.fill();
    g = x.createRadialGradient(cx + o, cy + o, 0, cx + o, cy + o, cr * .9);
    g.addColorStop(0, `rgba(255,110,120,${.10 * depth})`); g.addColorStop(1, 'rgba(255,110,120,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, cr, 0, Math.PI * 2); x.fill();
  };
  for (let k = 0; k < 160; k++) {
    const cr = size * (.002 + Math.pow(rnd(), 6) * .045);
    const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (R - cr);
    crater(size / 2 + Math.cos(a) * rr, size / 2 + Math.sin(a) * rr, cr, .45 + rnd() * .55);
  }
  // two young ray craters: faint bright splashes thrown across the surface
  for (let k = 0; k < 2; k++) {
    const a = rnd() * Math.PI * 2, rr = rnd() * R * .6, cx = size / 2 + Math.cos(a) * rr, cy = size / 2 + Math.sin(a) * rr;
    for (let j = 0; j < 18; j++) {
      const ang = rnd() * Math.PI * 2, len = size * (.05 + rnd() * .14);
      const g = x.createLinearGradient(cx, cy, cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
      g.addColorStop(0, 'rgba(255,140,150,.07)'); g.addColorStop(1, 'rgba(255,140,150,0)');
      x.strokeStyle = g; x.lineWidth = 2 + rnd() * 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len); x.stroke();
    }
    crater(cx, cy, size * .011, 1);
  }
  x.restore();
  return c;
}

/** a smooth glow texture, generated large so faint gradients do not band into rings */
export function glowCanvas(rgb, stops, size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, a]) => g.addColorStop(o, `rgba(${rgb},${a})`));
  x.fillStyle = g; x.fillRect(0, 0, size, size);   // no grain: the bloom pass magnifies per-pixel noise into a dotted halo
  return c;
}

/** the moon texture, built once */
export function moonTexture(T) {
  if (!cache) { cache = new T.CanvasTexture(moonCanvas()); cache.encoding = T.sRGBEncoding; cache.anisotropy = 8; }
  return cache;
}
