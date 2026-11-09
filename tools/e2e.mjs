// End-to-end check of the joined site, driven only by scroll gestures and nav, like a visitor.
// Needs the dev server (it exposes window.__dir) and a local Google Chrome:
//   npm run dev        # in one terminal
//   npm run test:e2e   # in another (BASE=http://localhost:5180 to point elsewhere)
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://localhost:5173';
const ORDER = ['hero', 'work', 'archive', 'torii', 'dojo', 'lantern'];
let failed = 0;
const check = (ok, msg) => { console.log((ok ? '  ✓ ' : '  ✗ ') + msg); if (!ok) failed++; };

// a real GPU; software rendering is far too slow for the hero's ink shader
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const current = () => page.evaluate(() => window.__dir.slots[window.__dir.index].def.id);
const built = () => page.evaluate(() => [...document.querySelectorAll('.stage > .scene')].map(e => e.dataset.scene));
// one scroll gesture, like a trackpad swipe or a few wheel ticks: a ~1.2s stream of wheel events, then a pause.
// Inside a scene it moves one step; at a scene's end it is long enough to push through the hard stop.
const gesture = async (dy, steps = 20) => {
  await page.evaluate(([dy, n]) => new Promise(done => { let k = 0; const id = setInterval(() => { window.dispatchEvent(new WheelEvent('wheel', { deltaY: dy })); if (++k >= n) { clearInterval(id); done(); } }, 60); }), [dy, steps]);
  await page.waitForTimeout(1500);
};
const deltaFor = id => (id === 'archive' ? 40 : id === 'torii' ? 35 : 60);

console.log('1. walk the whole site with scroll gestures');
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForFunction(() => document.querySelector('.sc-hero')?.dataset.phase === 'hero', null, { timeout: 30000 });
const seen = ['hero'];
for (let i = 0; i < 80 && seen.at(-1) !== 'lantern'; i++) {
  await gesture(deltaFor(seen.at(-1)));
  const id = await current();
  if (id !== seen.at(-1)) seen.push(id);
}
check(JSON.stringify(seen) === JSON.stringify(ORDER), 'visited in order: ' + seen.join(' → '));
check((await built()).every(id => ['dojo', 'lantern'].includes(id)), 'only the current scene and its neighbour stay built: ' + (await built()).join(', '));

console.log('2. scrolling up from contact lands at the end of the dojo path');
await page.waitForTimeout(1600);
await gesture(-60);
check(await current() === 'dojo', 'back in the dojo');
await page.waitForTimeout(1500);
check(await page.evaluate(() => { const b = [...document.querySelectorAll('.sc-dojo #rail button')]; return b.at(-1).classList.contains('on'); }), 'standing at the samurai, not the intro');

console.log('3. entering a scene that has to load from scratch, from below');
await page.goto(BASE + '/#contact', { waitUntil: 'load' });
await page.waitForTimeout(4000);
await gesture(-60);
await page.waitForTimeout(6000);
check(await current() === 'dojo', 'freshly built dojo is active');
check(await page.evaluate(() => { const b = [...document.querySelectorAll('.sc-dojo #rail button')]; return b.at(-1).classList.contains('on'); }), 'it opens at its end');

console.log('4. a jump requested mid-cut is queued, not dropped');
await page.evaluate(() => { window.__dir.goHash('stack'); window.__dir.goHash('work'); });
await page.waitForTimeout(4000);
check(await current() === 'work', 'ended on work after stack');

console.log('5. back button');
await page.goBack(); await page.waitForTimeout(2500);
check(await current() === 'torii', 'back returns to the stack');

console.log('6. back then forward during a cut ends where the address bar says');
await page.evaluate(() => window.__dir.goHash('work')); await page.waitForTimeout(2500);
await page.evaluate(() => window.__dir.goHash('stack'));
await page.goBack(); await page.goForward();
await page.waitForTimeout(4500);
check(await current() === 'torii' && (await page.evaluate(() => location.hash)) === '#stack', 'scene and URL agree: ' + await current() + ' ' + await page.evaluate(() => location.hash));

console.log('7. keyboard');
await page.evaluate(() => window.__dir.goHash('archive')); await page.waitForTimeout(5000);
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.press('ArrowDown'); await page.waitForTimeout(400); await page.keyboard.press('Enter'); await page.waitForTimeout(2500);
check(await page.evaluate(() => document.querySelector('.sc-archive').classList.contains('open') || !!document.querySelector('.sc-archive #detail.on, .sc-archive #detail[aria-hidden="false"]')), 'Enter opens a blade in the archive');
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
await page.evaluate(() => window.__dir.goHash('top')); await page.waitForTimeout(5000);
await page.waitForFunction(() => document.querySelector('.sc-hero')?.dataset.phase === 'hero', null, { timeout: 20000 });
await page.focus('.sc-hero .cta'); await page.keyboard.press('Space'); await page.waitForTimeout(1800);
check(await current() === 'hero', 'Space on a focused link does not leave the scene');
await page.evaluate(() => document.activeElement?.blur());
await page.waitForTimeout(6500);
await page.evaluate(() => window.__dir.goHash('contact')); await page.waitForTimeout(5000);
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.press('PageUp'); await page.waitForTimeout(2500);
check(await current() === 'dojo', 'PageUp leaves contact for the dojo');

console.log('8. releasing a scene that is still loading leaks no WebGL context');
await page.goto(BASE + '/', { waitUntil: 'load' }); await page.waitForTimeout(3000);
await page.evaluate(() => { window.__lost = 0; window.__made = 0; const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...r) { const c = g.call(this, t, ...r); if (c && /webgl/.test(t) && !this.__counted) { this.__counted = 1; window.__made++; const ext = c.getExtension('WEBGL_lose_context'); const l = ext.loseContext.bind(ext); ext.loseContext = () => { window.__lost++; l(); }; } return c; }; });
for (const h of ['stack', 'top', 'contact', 'work', 'top']) { await page.evaluate(h => window.__dir.goHash(h), h); await page.waitForTimeout(1400); }
await page.waitForTimeout(6000);
const live = await page.evaluate(() => window.__made - window.__lost);
check(live <= 2, `live WebGL contexts after rapid jumps: ${live} (made ${await page.evaluate(() => window.__made)})`);

console.log('11. the end of a scene is a hard stop; scrolling on moves to the next one');
await page.goto(BASE + '/?hs=1#stack', { waitUntil: 'load' }); await page.waitForTimeout(4000);
await page.evaluate(() => { const d = window.__dir; d.slots[d.index].api.onEnter(1); });
for (let i = 0; i < 40 && await page.evaluate(() => !document.querySelector('.sc-torii #outro.on')); i++) await gesture(35);
await page.waitForTimeout(1500);
await gesture(60, 3);                                     // a short flick at the end
check(await current() === 'torii', 'a short flick at the end stays put');
check(await page.evaluate(() => document.querySelector('.edgehint').classList.contains('on')), 'the "keep scrolling" hint shows');
await gesture(60, 24);                                    // keep scrolling
check(await current() === 'dojo', 'scrolling on crosses to About');

console.log('9. phones down to 375px: nothing runs off the screen');
const phone = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
phone.on('pageerror', e => errors.push('[375] ' + e.message));
for (const h of ['', 'work', 'archive', 'stack', 'about', 'contact']) {
  await phone.goto(BASE + '/' + (h ? '#' + h : ''), { waitUntil: 'load' });
  await phone.waitForTimeout(h ? 5000 : 9000);
  const off = await phone.evaluate(() => {
    const root = document.querySelector('.scene.is-on'), W = innerWidth, bad = [];
    root.querySelectorAll('h1,h2,h3,p,a,button,li,label,input,textarea').forEach(el => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      let o = 1; for (let n = el; n && n !== root; n = n.parentElement) o *= +getComputedStyle(n).opacity;
      if (!r.width || cs.visibility === 'hidden' || o < .1 || el.closest('.lookpick')) return;
      for (let n = el.parentElement; n && n !== root; n = n.parentElement) if (/auto|scroll/.test(getComputedStyle(n).overflowX)) return;   // swipeable rows scroll on purpose
      if (r.left < -2 || r.right > W + 2) bad.push((el.id || el.className || el.tagName) + ' ' + Math.round(r.left) + '→' + Math.round(r.right));
    });
    return bad;
  });
  check(off.length === 0, `${h || 'hero'} fits 375px` + (off.length ? ': ' + off.slice(0, 4).join(', ') : ''));
}
console.log('10. phones: swiping steps through the work, even on top of the manga page');
await phone.goto(BASE + '/?fresh=1#work', { waitUntil: 'load' });   // a real load, not a hash change (that would enter work from below, at the map)
await phone.waitForTimeout(5000);
const swipe = (x, y0, y1) => phone.evaluate(([x, y0, y1]) => {
  const target = document.elementFromPoint(x, y0) || document.body;
  const t = (y) => new Touch({ identifier: 1, target, clientX: x, clientY: y });
  target.dispatchEvent(new TouchEvent('touchstart', { touches: [t(y0)], changedTouches: [t(y0)], bubbles: true }));
  target.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(y1)], bubbles: true }));
}, [x, y0, y1]);
for (let i = 0; i < 3; i++) { await swipe(190, 500, 300); await phone.waitForTimeout(1800); }
const prog = await phone.evaluate(() => document.querySelector('.sc-work #pNum').textContent);
check(prog.startsWith('03'), 'three swipes (two over the manga page) reach project 03: ' + prog);
await phone.close();

check(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
