# Mhamad Raad · Portfolio

An ink-and-blade portfolio: one continuous WebGL journey through six scenes, joined by blade cuts.

**Hero** → **01 Work** (the red thread past seven blade-cut planets on 道) → **Katana Archive** → **02 The stack** (torii gates) → **03 About** (the moonlit dojo path) → **04 Contact** (set a lantern adrift).

Live: https://portfolio-mhamad-raad.vercel.app/

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run test:e2e   # with the dev server running; needs Google Chrome (BASE=… to change the URL)
```

## Editing the content

Everything visitors read lives in `src/data/`. Change it there, and every section updates, including the counts.

| File | What it holds |
| --- | --- |
| `src/data/projects.js` | All projects. `featured: true` makes a planet in 01 Work (in list order); the rest hang in the archive under a `chapter`. Add `about` to give an archive project its own line. Screenshots go in `public/img/<img>.jpg`. |
| `src/data/stack.js` | The five torii gates and which stack names each technology counts. "React · 11 projects" is computed from `projects.js`. |
| `src/data/about.js` | Bio, roles (oldest first), recommendations, LinkedIn/GitHub/resume links, EmailJS ids. |

Scene markup can use `{{featured}}`, `{{archive}}`, `{{total}}`, `{{tech}}`, `{{linkedin}}` … (see `fill()` in `src/data/index.js`).

## How it is built

- **Vite + React + TypeScript** for the shell, **three.js 0.147** for every scene.
- `src/director.ts` decides which scene is on screen. Only one renders at a time, and moving between scenes is a diagonal blade cut. The scenes on either side of the current one stay built (paused). Further ones are released, WebGL context included, and rebuilt on return. Each scene has its own URL hash (`#work`, `#stack`, `#about`, `#contact`), and the back button works.
- `src/scenes/<id>/` holds one scene each: `markup.html`, `style.css` (scoped to `.sc-<id>`) and `scene.js` exporting `mount(root, api)`.
- `src/engine/scope.js` runs a scene as if it owned the page. Inside a scene, `document.querySelector` searches the scene, and `document.body` **is the scene root**. Listeners only fire while the scene is active, and `requestAnimationFrame` pauses with it.
- `src/engine/edge.js`: when a scene is at its first or last position, a new scroll gesture crosses to the neighbouring scene. Momentum from the gesture that reached the edge never crosses.
- `src/engine/model.js` downloads the samurai (`public/samurai.glb`) once for the hero and the dojo.
- `src/engine/mail.js` sends the contact letter through EmailJS.

## Author

**Mhamad Raad** · [GitHub](https://github.com/Mhamad-Raad) · [LinkedIn](https://www.linkedin.com/in/mhamad-raad)

## License

MIT, see [LICENSE](LICENSE).
