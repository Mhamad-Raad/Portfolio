// The seven torii gates of 02 The stack. Each technology lists the stack names it counts,
// so "React · 11 projects" is always computed from projects.js, never typed by hand.
import { PROJECTS } from './projects.js';
import { ROLES } from './about.js';

const DEF = [
  { k: '表', name: 'Frontend', sub: 'The surface people touch', tech: [['React', ['React']], ['Next.js', ['Next.js']], ['TypeScript', ['TypeScript']], ['JavaScript', ['JavaScript']], ['Tailwind', ['Tailwind']], ['Kurdish, Arabic & RTL', ['i18n', 'RTL']], ['SCSS', ['SCSS', 'Sass']], ['Material UI', ['Material UI']]] },
  { k: '動', name: '3D & motion', sub: 'Things that move', tech: [['Three.js', ['React Three Fiber']], ['Framer Motion', ['Framer Motion']], ['Chart.js', ['Chart.js']]] },
  { k: '蔵', name: 'Data & state', sub: 'Where it is kept', tech: [['Redux', ['Redux', 'NgRx']], ['Firebase', ['Firebase']], ['SQL', ['MySQL', 'PostgreSQL', 'SQLite']], ['MongoDB', ['MongoDB']], ['Prisma', ['Prisma']]] },
  { k: '基', name: 'Backend', sub: 'What it stands on', tech: [['NestJS', ['NestJS']], ['Django & Python', ['Django']], ['Node & Express', ['Express']], ['Laravel & PHP', ['Laravel', 'PHP']], ['Ruby on Rails', ['Ruby on Rails']], ['Electron', ['Electron']], ['SignalR', ['SignalR']], ['Celery & Redis', ['Celery', 'Redis']], ['OCR', ['OCR']]] },
  { k: '枠', name: 'Frameworks', sub: 'Other schools I trained in', tech: [['Remix', ['Remix']], ['Vue & Nuxt', ['Vue', 'Nuxt']], ['Angular', ['Angular']], ['Flutter', ['Flutter']]] },
  { k: '届', name: 'Shipping', sub: 'How it reaches people', tech: [['Automated tests', ['Playwright', 'Vitest', 'Django tests', 'Jest', 'RSpec']], ['Docker', ['Docker']], ['GitHub Actions', ['CI']], ['Vercel', ['Vercel']], ['AWS', ['AWS']]] },
  { k: '台', name: 'Platforms', sub: 'Open-source systems I build on', tech: [['Medusa', ['Medusa']], ['Pimcore', ['Pimcore']], ['Odoo', ['Odoo']], ['Strapi', ['Strapi']]] },
];

// A project counts for a technology through its stack, its extra tools, or (for Vercel) where it is hosted.
const skillsOf = p => [...p.stack, ...(p.tools ?? []), ...(/vercel\.app/.test(p.live) ? ['Vercel'] : [])];
const usedBy = keys => PROJECTS.filter(p => skillsOf(p).some(s => keys.includes(s))).length;
// Skills used in a job (ROLES tags and extra skills) count too: shown as "at work" when no project uses them.
const atWork = keys => ROLES.some(r => [...r.s, ...(r.k ?? [])].some(s => keys.includes(s)));

// A technology with no project yet (e.g. Flutter before a mobile project is added) is left out.
export const GATES = DEF.map(g => ({ ...g, tech: g.tech.map(([n, keys]) => ({ n, c: usedBy(keys), w: atWork(keys) })).filter(t => t.c > 0 || t.w) }));
export const TECH_TOTAL = GATES.reduce((a, g) => a + g.tech.length, 0);
