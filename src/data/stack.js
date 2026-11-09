// The five torii gates of 02 The stack. Each technology lists the stack names it counts,
// so "React · 11 projects" is always computed from projects.js, never typed by hand.
import { PROJECTS } from './projects.js';

const DEF = [
  { k: '表', name: 'Frontend', sub: 'The surface people touch', tech: [['React', ['React']], ['Next.js', ['Next.js']], ['TypeScript', ['TypeScript']], ['JavaScript', ['JavaScript']], ['Tailwind', ['Tailwind']], ['SCSS', ['SCSS']], ['Material UI', ['Material UI']]] },
  { k: '動', name: '3D & motion', sub: 'Things that move', tech: [['Three.js', ['React Three Fiber']], ['Framer Motion', ['Framer Motion']], ['Chart.js', ['Chart.js']]] },
  { k: '蔵', name: 'Data & state', sub: 'Where it is kept', tech: [['Redux', ['Redux', 'NgRx']], ['Firebase', ['Firebase']], ['SQL', ['MySQL']], ['MongoDB', ['MongoDB']]] },
  { k: '基', name: 'Backend', sub: 'What it stands on', tech: [['Node & Express', ['Express']], ['Laravel & PHP', ['Laravel', 'PHP']], ['Ruby on Rails', ['Ruby on Rails']], ['Electron', ['Electron']]] },
  { k: '枠', name: 'Frameworks', sub: 'Other schools I trained in', tech: [['Remix', ['Remix']], ['Vue & Nuxt', ['Vue', 'Nuxt']], ['Angular', ['Angular']]] },
];

const usedBy = keys => PROJECTS.filter(p => p.stack.some(s => keys.includes(s))).length;

export const GATES = DEF.map(g => ({ ...g, tech: g.tech.map(([n, keys]) => ({ n, c: usedBy(keys) })) }));
export const TECH_TOTAL = GATES.reduce((a, g) => a + g.tech.length, 0);
