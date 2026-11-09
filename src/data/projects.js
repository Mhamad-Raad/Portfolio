// Every project on the site, in one place. Work (the 道 planets), the Katana Archive and the
// Torii Stack counts all read from this list.
//
//   featured  → flies as a planet in 01 Work (in this order); everything else hangs in the archive
//   split     → how the title breaks over two lines on the manga page (second part is crimson)
//   kind, sfx → manga page chapter label and its sound-effect word
//   chapter   → archive chapter (index into CHAPTERS)
//   about     → one line about the project; archive entries without one get "Built with …"
//   stack     → technologies used; the Stack section counts projects from these names
//   img       → screenshot file name in public/img (without .jpg)

export const CHAPTERS = [
  { k: '壱', name: 'Training steel', line: 'Where it started: the Microverse curriculum and my first courses.' },
  { k: '弐', name: 'Sharpening', line: 'React, Remix and Firebase reps: small apps built to get fast.' },
  { k: '参', name: 'Duels', line: 'Hiring challenges and the capstone, built against a deadline.' },
  { k: '肆', name: 'Experiments', line: 'Trying new tools: 3D, Angular, Next.js and design builds.' },
];

const GH = 'https://github.com/Mhamad-Raad/';

export const PROJECTS = [
  // ---------- featured: the seven planets ----------
  { id: 'brand-bazzar', name: 'Brand Bazzar', featured: true, split: ['Brand', 'Bazzar'], kind: 'E-commerce', sfx: 'ドン',
    about: 'E-commerce site with payment integration, user accounts, and an admin and vendor panel for managing products and orders.',
    stack: ['Laravel', 'PHP', 'MySQL', 'GoDaddy'], live: 'https://brandbazzarr.com/', code: GH + 'E-Commerce', img: 'BrandBazzar' },
  { id: 'telenet-pro', name: 'Telenet Pro', featured: true, split: ['Telenet', 'Pro'], kind: 'Company website', sfx: 'ゴゴゴ',
    about: 'Website for a telecommunications and IT services company, with a 3D scene built in React Three Fiber.',
    stack: ['Next.js', 'React Three Fiber', 'Tailwind', 'AWS'], live: 'https://telle-net.vercel.app/', code: GH + 'TelleNet', img: 'TelenetPro' },
  { id: 'dohrnii', name: 'Dohrnii', featured: true, split: ['Dohrnii'], kind: 'Crypto & investment', sfx: 'キラッ',
    about: 'Website for a company working in crypto and investment.',
    stack: ['Next.js', 'Tailwind'], live: 'https://dohrnii.io/', code: '', img: 'DhorniW' },
  { id: 'order-management', name: 'Order Management', featured: true, split: ['Order', 'Management'], kind: 'Web app · Hiring challenge', sfx: 'ズバッ',
    about: 'A Trello-style board for managing orders with drag and drop, built for the Akkoo hiring challenge.',
    stack: ['TypeScript', 'React', 'Redux', 'Material UI', 'Vite'], live: 'https://order-management-akkoo-challenge.vercel.app/', code: GH + 'Order-Management-Akkoo-Challenge', img: 'OrderManagement' },
  { id: 'warehouse', name: 'Warehouse Management', featured: true, split: ['Warehouse', 'Management'], kind: 'Web app', sfx: 'ドドド',
    about: 'Warehouse item management with three user roles, localization and a dark theme.',
    stack: ['React', 'Tailwind', 'i18n'], live: 'https://mini-market-three.vercel.app/', code: GH + 'MiniMarket', img: 'WareHouse' },
  { id: 'aone', name: 'AOne', featured: true, split: ['AOne'], kind: 'Desktop app', sfx: 'バン',
    about: 'Windows desktop app for warehouse management across multiple vendors.',
    stack: ['Electron', 'Express', 'Tailwind'], live: '', code: 'https://github.com/A-One-Org/A1-Frontend', img: 'AOne' },
  { id: 'glacier', name: 'Glacier', featured: true, split: ['Glacier'], kind: 'Crypto · Demo', sfx: 'シーン',
    about: 'Demo website for a company that trades in cryptocurrency.',
    stack: ['Next.js', 'Tailwind'], live: 'https://glacier-nine.vercel.app/', code: GH + 'Glacier', img: 'Glacier' },

  // ---------- archive: the katana rack, in rack order ----------
  { id: 'awesome-books', name: 'Awesome Books', chapter: 0, stack: ['JavaScript'], live: 'https://mhamad-raad.github.io/Awesome-Books/', code: GH + 'Awesome-Books', img: 'AwesomeB' },
  { id: 'hitex', name: 'Hitex', chapter: 0, stack: ['JavaScript'], live: 'https://mhamad-raad.github.io/Hitex/', code: GH + 'Hitex', img: 'Hitex' },
  { id: 'portfolio-template', name: 'Portfolio Template', chapter: 0, stack: ['JavaScript'], live: 'https://mhamad-raad.github.io/Microverse-Portfolio/', code: GH + 'Microverse-Portfolio', img: 'PortfolioT' },
  { id: 'free-games', name: 'Free Games', chapter: 0, stack: ['JavaScript', 'API'], live: 'https://mhamad-raad.github.io/Capstone-API/', code: GH + 'Capstone-API', img: 'FreeGames' },
  { id: 'todo', name: 'Todo App', chapter: 0, stack: ['React'], live: 'https://mhamad-raad.github.io/ToDo-React/', code: GH + 'ToDo-React', img: 'Todo' },
  { id: 'tindog', name: 'TinDog', chapter: 0, stack: ['Bootstrap'], live: 'https://mhamad-raad.github.io/tindogAngelaYu-project/', code: GH + 'tindogAngelaYu-project', img: 'Tindog' },
  { id: 'meals', name: 'Meals', chapter: 1, stack: ['React', 'Context'], live: 'https://mhamad-raad.github.io/React-Meals/', code: GH + 'React-Meals', img: 'Meals' },
  { id: 'cash-flow', name: 'Cash Flow', chapter: 1, stack: ['React', 'Local Storage'], live: 'https://mhamad-raad.github.io/React-Cash-Flow/', code: GH + 'React-Cash-Flow', img: 'Cash' },
  { id: 'random-quote', name: 'Random Quote', chapter: 1, stack: ['React', 'API'], live: 'https://random-quote-seven-tan.vercel.app/', code: GH + 'random-quote', img: 'RandomQ' },
  { id: 'markdown', name: 'Markdown Previewer', chapter: 1, stack: ['React'], live: 'https://tiny-salamander-d87f32.netlify.app/', code: GH + 'MarkDown', img: 'MarkDown' },
  { id: 'notes', name: 'Notes', chapter: 1, stack: ['Remix', 'Firebase'], live: 'https://note-collector-jtl0kbpkm-mhamad-raad.vercel.app/Notes', code: GH + 'Remix-Notes', img: 'Notes' },
  { id: 'finance', name: 'Finance Manager', chapter: 1, stack: ['Remix', 'Firebase', 'SCSS'], live: 'https://money-management-zeta.vercel.app/', code: GH + 'PFM-With-Remix', img: 'PFM' },
  { id: 'naas', name: 'Naas Challenge', chapter: 2, stack: ['Next.js', 'React', 'Tailwind', 'Chart.js'], live: 'https://naas-project.vercel.app/', code: GH + 'Naas-Project', img: 'Naas' },
  { id: 'miswag', name: 'Miswag Challenge', chapter: 2, stack: ['Vue', 'Nuxt', 'Tailwind'], live: 'https://miswag.vercel.app/', code: GH + 'Miswag', img: 'Miswag' },
  { id: 'travel', name: 'Travel Reservation', chapter: 2, stack: ['React', 'Redux', 'Ruby on Rails', 'RSpec', 'JWT'], live: 'https://remarkable-buttercream-3be0d2.netlify.app', code: GH + 'final-capstone-frontend', img: 'reserve-travel' },
  { id: 'life-struggles', name: 'Life Struggles', chapter: 3, stack: ['React', 'React Three Fiber', 'Framer Motion'], live: 'https://life-struggles.vercel.app/', code: GH + 'Life-Struggles', img: 'LifeStruggles' },
  { id: 'task-manager', name: 'Task Manager', chapter: 3, stack: ['Angular', 'NgRx', 'Local Storage'], live: 'https://task-manager-angular-blond.vercel.app/', code: GH + 'task-manager-angular', img: 'TaskTracker' },
  { id: 'meetups', name: 'Meetups', chapter: 3, stack: ['Next.js', 'MongoDB'], live: 'https://next-js-news-odq1sgkbk-mhamad-raad.vercel.app/', code: GH + 'NextJS-News', img: 'Meetups' },
  { id: 'landing', name: 'Landing Page', chapter: 3, stack: ['React', 'TypeScript', 'Tailwind', 'SCSS'], live: 'https://company-website1-ashy.vercel.app/', code: GH + 'company-website1', img: 'Landing1' },
];

export const FEATURED = PROJECTS.filter(p => p.featured);
export const ARCHIVE = PROJECTS.filter(p => !p.featured);
export const shot = p => '/img/' + p.img + '.jpg';
