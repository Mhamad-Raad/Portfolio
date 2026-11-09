// Crossing from one scene to the next.
//
// Wheel / trackpad: when a scene reaches its first or last position it makes a hard stop. After a short hold,
// scrolling on in the same direction fills a "keep scrolling" meter (shown by the director); when it is full the
// director cuts to the neighbouring scene. Stop pushing and the meter drains, so a stray flick never skips a scene.
// Touch: a swipe at the edge crosses straight away. Keys: PageDown/ArrowDown/Space (or Up) at the edge cross.

const HOLD = 420;       // ms of hard stop before pushing counts
const NEED = 650;       // px of scrolling needed to cross (a mouse wheel tick is ~100, a trackpad flick several hundred)
const DRAIN = 1400;     // ms for a full meter to drain once the pushing stops
const IDLE = 180;       // ms without wheel events before the meter starts draining

export function createEdge(api) {
  let ty = null, armedAt = 0, armedDir = 0, acc = 0, lastSeen = 0, drainTimer = 0;
  const show = (p, dir) => api.edgeProgress?.(p, dir);
  const reset = () => { armedAt = 0; armedDir = 0; acc = 0; clearTimeout(drainTimer); show(0, 0); };
  const cross = dir => { reset(); dir > 0 ? api.next() : api.prev(); return true; };
  const atEdge = (dir, atStart, atEnd) => (dir > 0 ? atEnd() : dir < 0 ? atStart() : false);

  // once the pushing stops, the meter drains on its own (it never drains while the visitor is still scrolling)
  const drain = () => {
    clearTimeout(drainTimer);
    let lastTick = 0;
    drainTimer = setTimeout(function tick() {
      const now = performance.now();
      if (now - lastSeen >= IDLE) { acc = Math.max(0, acc - (lastTick ? now - lastTick : 50) * NEED / DRAIN); lastTick = now; show(acc / NEED, armedDir); }
      if (acc > 0 || now - lastSeen < IDLE) drainTimer = setTimeout(tick, 50);
      else if (now - lastSeen > 2500) reset();                // long idle at the edge: hide the hint
      else drainTimer = setTimeout(tick, 300);
    }, IDLE);
  };

  return {
    /** call first in the scene's wheel handler; true means the scene was left */
    wheel(e, atStart, atEnd) {
      const now = performance.now();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      const dir = Math.sign(dy);
      if (!dir) return false;
      if (!atEdge(dir, atStart, atEnd)) { if (armedAt) reset(); return false; }
      if (!armedAt || armedDir !== dir) { reset(); armedAt = now; armedDir = dir; lastSeen = now; show(0, dir); drain(); return false; }   // the hard stop
      lastSeen = now;
      if (now - armedAt >= HOLD) acc += Math.abs(dy);
      if (acc >= NEED) return cross(dir);
      show(acc / NEED, dir); drain();
      return false;
    },
    touchstart(e) { ty = e.touches[0].clientY; },
    touchend(e, atStart, atEnd) {
      if (ty == null) return false;
      const d = ty - e.changedTouches[0].clientY; ty = null;
      return Math.abs(d) > 50 && atEdge(Math.sign(d), atStart, atEnd) && cross(Math.sign(d));
    },
    key(e, atStart, atEnd) {
      // Space/arrows on a focused button, link or field belong to that control, not to the scene
      if (e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,[contenteditable]')) return false;
      const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
      return dir !== 0 && atEdge(dir, atStart, atEnd) && cross(dir);
    },
  };
}
