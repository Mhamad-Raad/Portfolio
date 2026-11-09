// Content entry point. Scenes import from here; markup placeholders like {{featured}} are filled by fill().
import { PROJECTS, FEATURED, ARCHIVE } from './projects.js';
import { TECH_TOTAL, GATES } from './stack.js';
import { LINKS } from './about.js';

export * from './projects.js';
export * from './stack.js';
export * from './about.js';

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
export const inWords = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
const cap = s => s[0].toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(2, '0');

const VALUES = {
  total: PROJECTS.length,
  featured: FEATURED.length,
  featured2: pad(FEATURED.length),
  archive: ARCHIVE.length,
  Archive: cap(inWords(ARCHIVE.length)),
  tech: TECH_TOTAL,
  gates: inWords(GATES.length),
  ...LINKS,
};

/** replaces {{name}} placeholders in a scene's markup with live content values */
export const fill = html => html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in VALUES ? String(VALUES[k]) : m));
