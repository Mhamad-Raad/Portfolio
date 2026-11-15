// Every project on the site, in one place. Work (the 道 planets), the Katana Archive and the
// Torii Stack counts all read from this list.
//
//   featured  → flies as a planet in 01 Work (in this order); everything else hangs in the archive
//   split     → how the title breaks over two lines on the manga page (second part is crimson)
//   kind, sfx → manga page chapter label and its sound-effect word
//   chapter   → archive chapter (index into CHAPTERS; each chapter's `blade` picks the sword finish)
//   about     → one line about the project; archive entries without one get "Built with …"
//   stack     → technologies used; the Stack section counts projects from these names
//   img       → screenshot file name in public/img (without .webp)
//   demo      → optional { user, pass } shown on the manga page for apps with a public demo login
//   tools     → optional extra skills the Stack section counts (tests, Docker, CI…); not shown as moons or chips

export const CHAPTERS = [
  { k: '壱', name: 'Duels', line: 'Hiring challenges and the capstone, built against a deadline.', blade: 1 },
  { k: '弐', name: 'Experiments', line: 'Trying new tools: 3D in React and Angular with NgRx.', blade: 2 },
];

const GH = 'https://github.com/Mhamad-Raad/';

export const PROJECTS = [
  // ---------- featured: the planets ----------
  { id: 'item-lending', name: 'Item Lending', featured: true, split: ['Item', 'Lending'], kind: 'Full-stack · Factory system', sfx: 'ガシャン',
    about: 'Pallet lending, stock and deposits for a factory, with append-only ledgers, roles and a full history, in three languages.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind'], live: 'https://zagros-pallets.vercel.app/', code: GH + 'zagros-pallets', img: 'ItemLending', tools: ['Docker', 'CI', 'Playwright', 'Vitest', 'RTL'],
    demo: { user: 'demo', pass: 'zagros-demo-2026' } },
  { id: 'mizan', name: 'Mizan', featured: true, split: ['Mizan'], kind: 'Full-stack · Factory system', sfx: 'ジャラッ',
    about: 'Warehouse, sales and accounts for a factory, in dinars and dollars, with Excel reports and a full history.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'i18n'], live: 'https://zagros-management.vercel.app/', code: GH + 'zagros-management', img: 'Mizan', tools: ['Docker', 'CI', 'Playwright', 'Vitest', 'RTL'],
    demo: { user: 'demo', pass: 'Zagros-demo-2026' } },
  { id: 'land-allocation', name: 'Land Allocation', featured: true, split: ['Land', 'Allocation'], kind: 'Full-stack · Offline office system', sfx: 'ドサッ',
    about: 'Case management for a land-allocation office: five-step cases, ID cards read by OCR, generated letters and a full audit trail. Runs fully offline.',
    stack: ['React', 'TypeScript', 'Redux', 'Django', 'PostgreSQL', 'Tailwind'], live: '', code: GH + 'land-allocation', img: 'LandAllocation', tools: ['Docker', 'Django tests', 'Vitest', 'Celery', 'Redis', 'OCR', 'i18n', 'RTL'] },
  { id: 'rent-tracker', name: 'Rent Tracker', featured: true, split: ['Rent', 'Tracker'], kind: 'Desktop app · In use', sfx: 'チャリン',
    about: 'Offline Windows app for rent across many places: paid months at a glance, receipts, reminders, printed reports and Excel. Try it in the browser.',
    stack: ['Electron', 'React', 'TypeScript', 'SQLite'], live: 'https://rent-tracker-demo.vercel.app/', code: GH + 'rent-tracker', img: 'RentTracker', tools: ['CI', 'Playwright', 'Vitest', 'i18n', 'RTL'] },
  { id: 'malldash', name: 'MallDash', featured: true, split: ['Mall', 'Dash'], kind: 'Web apps · Admin + vendor', sfx: 'ガヤガヤ',
    about: 'Two dashboards for a residential mall: admins run buildings, tenants and shops; shop owners handle orders, products and staff.',
    stack: ['React', 'TypeScript', 'Redux', 'Tailwind', 'i18n'], live: 'https://malldash-admin-demo.vercel.app/', code: GH + 'malldash-admin', img: 'MallDash', tools: ['SignalR', 'RTL'],
    demo: { user: 'admin@malldash.demo', pass: 'demo1234' } },
  { id: 'bloom', name: 'Bloom', featured: true, split: ['Bloom'], kind: 'Full-stack · Marketplace', sfx: 'パッ',
    about: 'A multi-store marketplace: a NestJS API, an admin console for stores, products, orders and coupons, and a Flutter shopping app for customers.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'Flutter', 'Tailwind'], live: 'https://bloom-admin-demo-ten.vercel.app/', code: '', img: 'Bloom', tools: ['i18n'],
    demo: { user: 'admin@bloom.demo', pass: 'demo1234' } },
  { id: 'telenet-pro', name: 'Telenet Pro', featured: true, split: ['Telenet', 'Pro'], kind: 'Company website', sfx: 'ゴゴゴ',
    about: 'Website for a telecommunications and IT services company, with a 3D scene built in React Three Fiber.',
    stack: ['Next.js', 'React Three Fiber', 'Tailwind', 'AWS'], live: 'https://telle-net.vercel.app/', code: GH + 'TelleNet', img: 'TelenetPro' },
  { id: 'dohrnii', name: 'Dohrnii', featured: true, split: ['Dohrnii'], kind: 'Crypto & investment', sfx: 'キラッ',
    about: 'Website for a company working in crypto and investment.',
    stack: ['Next.js', 'Tailwind'], live: 'https://dohrnii.io/', code: '', img: 'DhorniW' },

  // ---------- archive: the katana rack, in rack order ----------
  { id: 'naas', name: 'Naas Challenge', chapter: 0, stack: ['Next.js', 'React', 'Tailwind', 'Chart.js'], live: 'https://naas-project.vercel.app/', code: GH + 'Naas-Project', img: 'Naas' },
  { id: 'miswag', name: 'Miswag Challenge', chapter: 0, stack: ['Vue', 'Nuxt', 'Tailwind'], live: 'https://miswag.vercel.app/', code: GH + 'Miswag', img: 'Miswag' },
  { id: 'travel', name: 'Travel Reservation', chapter: 0, stack: ['React', 'Redux', 'Ruby on Rails', 'RSpec', 'JWT'], live: 'https://remarkable-buttercream-3be0d2.netlify.app', code: GH + 'final-capstone-frontend', img: 'reserve-travel' },
  { id: 'order-management', name: 'Order Management', chapter: 0,
    about: 'A Trello-style board for managing orders with drag and drop, built for the Akkoo hiring challenge.',
    stack: ['TypeScript', 'React', 'Redux', 'Material UI', 'Vite'], live: 'https://order-management-akkoo-challenge.vercel.app/', code: GH + 'Order-Management-Akkoo-Challenge', img: 'OrderManagement' },
  { id: 'life-struggles', name: 'Life Struggles', chapter: 1, stack: ['React', 'React Three Fiber', 'Framer Motion'], live: 'https://life-struggles.vercel.app/', code: GH + 'Life-Struggles', img: 'LifeStruggles' },
  { id: 'task-manager', name: 'Task Manager', chapter: 1, stack: ['Angular', 'NgRx', 'Local Storage'], live: 'https://task-manager-angular-blond.vercel.app/', code: GH + 'task-manager-angular', img: 'TaskTracker' },
];

export const FEATURED = PROJECTS.filter(p => p.featured);
export const ARCHIVE = PROJECTS.filter(p => !p.featured);
export const shot = p => '/img/' + p.img + '.webp';
