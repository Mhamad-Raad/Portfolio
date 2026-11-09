// The director joins the approved scenes into one site.
// Only one scene renders at a time. Moving between scenes is a blade cut: the next scene is revealed
// behind a glowing diagonal line that sweeps across the screen, then the previous one is paused.
// Scenes next to the current one stay built (paused) so going back is instant; scenes further away are
// released (listeners, loop and WebGL context) and rebuilt if the visitor returns.

export type SceneApi = {
  id: string;
  active: boolean;
  disposed: boolean;
  lockUntil: number;
  /** true when this scene was released earlier and is being built again (skip one-time intros) */
  revisit: boolean;
  next: () => void;
  prev: () => void;
  goto: (hash: string) => void;
  /** called by engine/edge.js while the visitor pushes past a scene's first/last position (p 0..1, dir ±1; 0 hides) */
  edgeProgress?: (p: number, dir: number) => void;
  /** set by a scene: called when it becomes active. dir = +1 arriving from above, -1 from below */
  onEnter?: (dir: number) => void;
  /** set by a scene: called when it stops being the active scene */
  onLeave?: () => void;
  _wake?: () => void;
  _dispose?: () => void;
};

type SceneDef = { id: string; hash: string; num: string; label: string; load: () => Promise<{ default: (root: HTMLElement, api: SceneApi) => Promise<void> }> };

export const SCENES: SceneDef[] = [
  { id: 'hero', hash: 'top', num: '00', label: 'Intro', load: () => import('./scenes/hero/scene.js') },
  { id: 'work', hash: 'work', num: '01', label: 'Work', load: () => import('./scenes/work/scene.js') },
  { id: 'archive', hash: 'archive', num: '01', label: 'Archive', load: () => import('./scenes/archive/scene.js') },
  { id: 'torii', hash: 'stack', num: '02', label: 'Stack', load: () => import('./scenes/torii/scene.js') },
  { id: 'dojo', hash: 'about', num: '03', label: 'About', load: () => import('./scenes/dojo/scene.js') },
  { id: 'lantern', hash: 'contact', num: '04', label: 'Contact', load: () => import('./scenes/lantern/scene.js') },
];

const ALIASES: Record<string, string> = { playground: 'stack', journey: 'about', '': 'top' };

type Slot = { def: SceneDef; root: HTMLElement; api: SceneApi; mounted: Promise<void> | null };
type Move = { i: number; dir: number; fromHistory: boolean };

/** how many scenes on each side of the current one stay built */
const KEEP = 1;

const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class Director {
  private slots: Slot[];
  index = -1;
  private busy = false;
  private queued: Move | null = null;
  private hint: HTMLElement;
  private listeners = new Set<(i: number) => void>();

  constructor(private host: HTMLElement, private cut: SVGSVGElement) {
    this.slots = SCENES.map((def, i) => ({ def, root: this.makeRoot(def), api: this.makeApi(i, false), mounted: null }));
    document.addEventListener('click', this.onLinkClick, true);
    addEventListener('popstate', this.onPopState);
    // "keep scrolling" hint shown while the visitor pushes past the end of a scene
    this.hint = document.createElement('div');
    this.hint.className = 'edgehint';
    this.hint.setAttribute('aria-hidden', 'true');
    this.hint.innerHTML = '<span></span><i><b></b></i>';
    host.after(this.hint);
  }

  private showEdge(i: number, p: number, dir: number) {
    const to = SCENES[i + dir];
    if (!dir || !to) { this.hint.classList.remove('on'); return; }
    this.hint.classList.add('on');
    this.hint.classList.toggle('up', dir < 0);
    (this.hint.firstChild as HTMLElement).textContent = `Keep scrolling · ${to.num} ${to.label} ${dir > 0 ? '↓' : '↑'}`;
    (this.hint.querySelector('b') as HTMLElement).style.transform = `scaleX(${p})`;
  }

  /** remove every listener and scene (used when React unmounts the shell, e.g. on hot reload) */
  destroy() {
    document.removeEventListener('click', this.onLinkClick, true);
    removeEventListener('popstate', this.onPopState);
    this.slots.forEach(s => this.release(s));
    this.listeners.clear();
    this.queued = null;
    this.hint.remove();
  }

  private onPopState = () => this.goHash(location.hash.slice(1), true);

  private makeRoot(def: SceneDef) {
    const root = document.createElement('div');
    root.className = 'scene sc-' + def.id;
    root.dataset.scene = def.id;
    root.setAttribute('aria-hidden', 'true');
    return root;
  }

  private makeApi(i: number, revisit: boolean): SceneApi {
    return {
      id: SCENES[i].id, active: false, disposed: false, lockUntil: 0, revisit,
      next: () => this.go(i + 1, 1),
      prev: () => this.go(i - 1, -1),
      goto: (h: string) => this.goHash(h),
      edgeProgress: (p: number, dir: number) => { if (this.index === i && !this.busy) this.showEdge(i, p, dir); },
    };
  }

  onChange(fn: (i: number) => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  start() {
    const h = location.hash.slice(1);
    const i = this.indexOf(h);
    this.go(i >= 0 ? i : 0, 1, true);
  }

  indexOf(hash: string) {
    const h = ALIASES[hash] ?? hash;
    return SCENES.findIndex(s => s.hash === h);
  }

  goHash(hash: string, fromHistory = false) {
    const i = this.indexOf(hash);
    if (i >= 0) this.go(i, i > this.index ? 1 : -1, false, fromHistory);
  }

  private ensure(slot: Slot) {
    if (!slot.mounted) {
      this.host.appendChild(slot.root);
      slot.mounted = slot.def.load().then(m => m.default(slot.root, slot.api)).catch(e => {
        console.error('[' + slot.def.id + '] failed to start', e);
        slot.root.insertAdjacentHTML('beforeend', `<p class="scene-error">This scene did not load: ${String(e?.message || e)}</p>`);
      });
    }
    return slot.mounted;
  }

  /** tear a far-away scene down completely; a fresh root and api are ready if the visitor comes back */
  private release(slot: Slot) {
    if (!slot.mounted) return;
    const old = slot.root, api = slot.api;
    api.disposed = true; api.active = false;
    api._dispose?.();
    // mount() may still be loading or awaiting fonts and create its renderer later: dispose again once it settles
    slot.mounted.then(() => api._dispose?.());
    old.remove();
    slot.root = this.makeRoot(slot.def);
    slot.api = this.makeApi(this.slots.indexOf(slot), true);
    slot.mounted = null;
  }

  /** warm the module of a neighbouring scene so the cut does not wait on the network */
  private prefetch(i: number) { const s = this.slots[i]; if (s) s.def.load().catch(() => {}); }

  go(i: number, dir: number, instant = false, fromHistory = false) {
    if (i < 0 || i >= this.slots.length) return;
    if (this.busy) { this.queued = { i, dir, fromHistory }; return; }    // taken as soon as the current cut lands
    if (i === this.index) return;
    const from = this.slots[this.index];
    const to = this.slots[i];
    this.busy = true;
    this.hint.classList.remove('on');

    to.root.classList.add('is-on');
    to.root.removeAttribute('aria-hidden');
    to.api.active = true;
    to.api.lockUntil = performance.now() + (instant ? 0 : 1500);
    const ready = this.ensure(to);
    to.api._wake?.();
    // a scene registers onEnter during mount(), which may still be running: tell it where it was entered from once ready
    const api = to.api;
    ready.then(() => { if (api.active) api.onEnter?.(dir); });

    this.index = i;
    this.listeners.forEach(fn => fn(i));
    const hash = '#' + to.def.hash;
    if (!fromHistory && location.hash !== hash) {
      if (instant) history.replaceState(null, '', i === 0 ? location.pathname + location.search : hash);
      else history.pushState(null, '', i === 0 ? location.pathname + location.search : hash);
    }
    document.title = i === 0 ? 'Mhamad Raad · Front-end developer' : `${to.def.label} · Mhamad Raad`;

    const finish = () => {
      if (from) {
        from.api.active = false;
        from.api.onLeave?.();
        from.root.classList.remove('is-on');
        from.root.setAttribute('aria-hidden', 'true');
      }
      to.root.style.clipPath = '';
      to.root.style.zIndex = '';
      this.cut.style.opacity = '0';
      this.busy = false;
      this.slots.forEach((s, k) => { if (Math.abs(k - i) > KEEP) this.release(s); });
      this.prefetch(i + 1); this.prefetch(i - 1);
      const q = this.queued; this.queued = null;
      if (q && q.i !== this.index) this.go(q.i, q.i > this.index ? 1 : -1, false, q.fromHistory);
    };

    if (!from || instant) { finish(); return; }
    if (from) from.api.lockUntil = Infinity;
    this.sweep(to.root, dir, finish);
  }

  /** the blade cut: a slanted line sweeps across; behind it the next scene is already alive */
  private sweep(el: HTMLElement, dir: number, done: () => void) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reduced ? 10 : 1150;
    const line = this.cut.querySelectorAll('line');
    el.style.zIndex = '3';
    this.cut.style.opacity = '1';
    const t0 = performance.now();
    const tick = (now: number) => {
      const W = innerWidth, H = innerHeight, s = Math.min(W * .32, H * .55);
      const k = easeInOut(Math.min(1, (now - t0) / dur));
      // a = x of the line at the bottom edge; top edge is at a + s
      const a = dir > 0 ? (W + 10) - k * (W + s + 20) : (-s - 10) + k * (W + s + 20);
      el.style.clipPath = dir > 0
        ? `polygon(${a + s}px 0, ${W + 2}px 0, ${W + 2}px ${H + 2}px, ${a}px ${H + 2}px)`
        : `polygon(-2px 0, ${a + s}px 0, ${a}px ${H + 2}px, -2px ${H + 2}px)`;
      line.forEach(l => { l.setAttribute('x1', String(a + s)); l.setAttribute('y1', '0'); l.setAttribute('x2', String(a)); l.setAttribute('y2', String(H)); });
      this.cut.style.opacity = String(Math.min(1, Math.sin(k * Math.PI) * 3));
      if (k < 1) requestAnimationFrame(tick); else done();
    };
    requestAnimationFrame(tick);
  }

  private onLinkClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const h = a.getAttribute('href')!.slice(1);
    if (!h) return;                         // href="#" buttons belong to the scenes
    const i = this.indexOf(h);
    if (i < 0) return;
    e.preventDefault();
    e.stopPropagation();
    this.go(i, i > this.index ? 1 : -1);
  };
}
