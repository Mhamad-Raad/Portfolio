// Runs a ported scene as if it owned the page, while letting the director pause and release it.
//
// Inside a scene's mount():
// - document.querySelector & co. resolve inside the scene root, and document.body / documentElement ARE the root
//   (so `document.body.dataset.phase` is the scene's own state, and `body[...]` CSS was scoped to `.sc-<id>[...]`).
// - window/document listeners only fire while the scene is active. Resize is replayed on wake if the window changed.
// - requestAnimationFrame callbacks are queued and flushed once per frame, only while the scene is active.
// - every WebGL context the scene creates is recorded, so release() can hand the GPU memory back.

// record WebGL contexts per canvas (getContext on a canvas that never had one would create one, so we can't just ask later)
const GL = new WeakMap();
const origGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
  const ctx = origGetContext.call(this, type, ...rest);
  if (ctx && /webgl/.test(type)) GL.set(this, ctx);
  return ctx;
};

// input that drives scene progress is ignored right after a cut, so trackpad momentum from the last scene does not skip ahead
const LOCKABLE = new Set(['wheel', 'touchstart', 'touchmove', 'touchend', 'keydown']);

export function createScope(root, api) {
  const listeners = [];
  let seenW = innerWidth, seenH = innerHeight;
  const gate = (fn, type) => e => {
    if (!api.active || api.disposed) return;
    if (LOCKABLE.has(type) && performance.now() < api.lockUntil) return;
    if (type === 'resize') { seenW = innerWidth; seenH = innerHeight; }
    return typeof fn === 'function' ? fn(e) : fn.handleEvent(e);
  };
  const on = target => (type, fn, opts) => {
    const w = gate(fn, type);
    listeners.push({ target, type, fn, w, opts });
    target.addEventListener(type, w, opts);
  };
  const off = target => (type, fn, opts) => {
    const i = listeners.findIndex(l => l.target === target && l.type === type && l.fn === fn);
    if (i >= 0) { target.removeEventListener(type, listeners[i].w, opts); listeners.splice(i, 1); }
  };

  const doc = new Proxy(document, {
    get(t, k) {
      if (k === 'querySelector') return s => root.querySelector(s);
      if (k === 'querySelectorAll') return s => root.querySelectorAll(s);
      if (k === 'getElementById') return id => root.querySelector('#' + CSS.escape(id));
      if (k === 'body' || k === 'documentElement') return root;
      // nothing focused means the real <body>; inside a scene that reads as the scene root, so `activeElement === document.body` keeps working
      if (k === 'activeElement') { const a = t.activeElement; return !a || a === t.body ? root : a; }
      if (k === 'addEventListener') return on(document);
      if (k === 'removeEventListener') return off(document);
      const v = Reflect.get(t, k);
      return typeof v === 'function' ? v.bind(t) : v;
    }
  });

  // exactly one browser rAF per frame per scene: callbacks queued during a flush wait for the next frame
  let seq = 0, loop = 0, flushing = false;
  const queue = new Map();
  const flush = now => {
    loop = 0;
    if (!api.active || api.disposed) return;
    const run = [...queue.values()]; queue.clear();
    flushing = true;
    for (const cb of run) { try { cb(now); } catch (e) { console.error('[' + api.id + ']', e); } }
    flushing = false;
    if (queue.size && !loop) loop = window.requestAnimationFrame(flush);
  };
  const raf = cb => { const i = ++seq; queue.set(i, cb); if (!loop && !flushing && api.active) loop = window.requestAnimationFrame(flush); return i; };
  const caf = i => { queue.delete(i); };

  api._wake = () => {
    if (innerWidth !== seenW || innerHeight !== seenH) {       // the window changed while we slept
      seenW = innerWidth; seenH = innerHeight;
      listeners.filter(l => l.type === 'resize').forEach(l => l.w(new Event('resize')));
    }
    if (!loop && queue.size && api.active) loop = window.requestAnimationFrame(flush);
  };
  api._dispose = () => {
    api.disposed = true; api.active = false;
    listeners.forEach(l => l.target.removeEventListener(l.type, l.w, l.opts)); listeners.length = 0;
    queue.clear(); if (loop) window.cancelAnimationFrame(loop); loop = 0;
    root.querySelectorAll('canvas').forEach(c => { const gl = GL.get(c); gl?.getExtension('WEBGL_lose_context')?.loseContext(); });
  };

  return { document: doc, addEventListener: on(window), removeEventListener: off(window), requestAnimationFrame: raf, cancelAnimationFrame: caf, fetch: window.fetch.bind(window) };
}
