export const EMAIL = 'daniel.sebastian.mehler@gmail.com';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/daniel-mehler-536630305',
  github: 'https://github.com/Wichkey',
  oblivion: 'https://oblivion.vision',
  axo: 'https://axocapital.mx',
  dlife: 'https://dasp.mx',
  voralio: 'https://voralio.com',
  findpint: 'https://findpint.app',
};

export const NAV_LINKS = [
  { label: 'education', href: '#education' },
  { label: 'skills', href: '#skills' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
];

export const HERO = {
  notes: [
    ['software built', 'by talking', 'to agents.'],
    ['processes', 'automated end', 'to end.'],
    ['ai reduced to', 'what pays off.'],
  ],
  eyebrow: 'Tech Lead & AI Enthusiast',
  title: ['AI for', 'Businesses'],
  tags: ['full-stack builds', 'ai agents', 'only what pays off'],
};

export const ABOUT = {
  headline: 'I build the software companies run on, ',
  headlineAccent: 'and the agents that run it for them.',
  intro:
    'Cognitive scientist by training, engineer by trade. As Co-founder & CTO of Oblivion I own the technology and build Overmind, the agent pipeline that builds, hosts and runs client software, with a senior engineer reviewing every change.',
  pillars: [
    {
      icon: 'monitor',
      title: 'Full-stack builds',
      text: 'Web apps, platforms and internal tools we build at Oblivion, from the database to the screen people actually use.',
    },
    {
      icon: 'agent',
      title: 'AI agents',
      text: 'Agents that take over real processes end to end: reading documents, answering calls, moving data.',
    },
    {
      icon: 'compass',
      title: 'Advisory',
      text: "An honest look at where AI pays off in a business, and where it doesn't, before anything gets built.",
    },
  ],
  facts: [
    { icon: 'pin', text: 'Barcelona · Mexico City' },
    { icon: 'chat', text: 'German, English, Spanish' },
    { icon: 'briefcase', text: 'Co-founder & CTO, Oblivion' },
  ],
};

export const WORK = {
  intro:
    'Oblivion, the company I co-founded, and the client platforms we build and run there, a bank research project, and where it started. Newest first.',
  oblivion: {
    meta: '2026 → now · Mexico City',
    title: 'Oblivion',
    role: 'Co-founder & CTO',
    link: { href: LINKS.oblivion, label: 'oblivion.vision' },
    text: 'Most software goes dark the day the agency leaves. We started Oblivion to be the ones who stay up. AI agents build, host, operate and evolve production software for our clients, a senior engineer reviews every change, and the same team does all of it.',
    quote: 'You run the business. We run the software.',
    statements: [
      {
        label: 'Vision',
        text: 'Leading the next technological revolution, making software as scalable, accessible and automated as manufacturing made physical goods.',
      },
      {
        label: 'Mission',
        text: 'Powering company growth with an intelligent system and a dedicated team that builds, runs and scales complete software from any idea.',
      },
    ],
    projects: [
      {
        icon: 'nodes',
        title: 'Overmind',
        status: 'in build',
        text: 'Agent pipeline that plans, designs and ships client applications from a single brief.',
      },
      {
        icon: 'bank',
        title: 'Axo Capital',
        status: 'in build',
        link: { href: LINKS.axo, label: 'axocapital.mx' },
        text: 'Lending platform for a Mexican lender financing importers and exporters, with credit analysis automated from invoice data.',
      },
      {
        icon: 'pulse',
        title: 'Dlife',
        status: 'built',
        link: { href: LINKS.dlife, label: 'dasp.mx' },
        text: 'Diabetes care platform for patients, doctors and pharma: AWS infrastructure, role-based sign-in and CI/CD.',
      },
      {
        icon: 'drop',
        title: 'FlowSight',
        status: 'in build',
        text: 'Contrast-media intelligence for hospitals: tracks every injection and runs on site, next to the scanners.',
      },
    ],
  },
  earlier: [
    {
      icon: 'shield',
      meta: '2026 · Barcelona',
      title: 'Money-mule detection',
      by: 'with MyInvestor',
      text: 'Machine learning that flags money-mule accounts in real banking transactions, built with the Spanish neobank MyInvestor.',
    },
    {
      icon: 'target',
      meta: 'Feb → May 2025 · Salzburg',
      title: 'Medphoton',
      by: 'a Brainlab company',
      muted: true,
      role: 'AI software developer',
      text: 'Voice commands for CT scanners with speech recognition and LLMs. Sole developer: prototype in three months, 50-page technical report.',
    },
  ],
};

export const PROJECTS = {
  intro: 'Products of my own, side builds, and the research behind them.',
  products: [
    {
      icon: 'mic',
      title: 'YAPP AI',
      status: 'in build',
      live: true,
      text: 'Dictation, live meeting translation and notes for teams, as a macOS app.',
      tags: ['macOS', 'Swift', 'LLMs', 'Speech to text'],
    },
    {
      icon: 'pint',
      title: 'FindPint',
      status: 'shipped',
      text: 'A map of pint prices at bars, with nights out planned together.',
      tags: ['React', 'Supabase', '2026'],
      link: { href: LINKS.findpint, label: 'findpint.app' },
    },
  ],
  sideBuilds: [
    {
      icon: 'wave',
      title: 'Voralio',
      status: 'past',
      text: 'A platform where oral exams are held by a real-time AI voice interviewer.',
      meta: 'Next.js · Vapi · OpenAI · 2026',
      link: { href: LINKS.voralio, label: 'voralio.com' },
    },
    {
      icon: 'receipt',
      title: 'Receipt Scanner',
      status: 'shipped',
      text: 'Scan receipts, track household spending and split the bill.',
      meta: 'Next.js · Supabase · 2026',
    },
    {
      icon: 'leaf',
      title: 'NutriPilot',
      status: 'shipped',
      text: 'An offline-first nutrition planner as an installable web app.',
      meta: 'JavaScript · PWA · 2025',
    },
    {
      icon: 'board',
      title: 'Oblivion CRM',
      status: 'in build',
      text: "The studio's own board for clients, milestones and agent work logs.",
      meta: 'React · Supabase · 2026',
    },
  ],
  research: [
    {
      icon: 'heart',
      title: 'Cardiomegaly detection',
      text: 'Spotting enlarged hearts on chest X-rays, built in five days at a datathon.',
      stack: 'PyTorch · CNNs',
      year: '2026',
    },
    {
      icon: 'scan',
      title: 'CT voice commands',
      text: 'Hands-free control of CT scanners by speech, at Medphoton.',
      stack: 'Python · ASR · LLMs',
      year: '2025',
    },
    {
      icon: 'nodes',
      title: 'Disease diagnosis',
      text: 'A machine-learning system that diagnoses disease from patient data.',
      stack: 'MATLAB · SVMs',
      year: '2023',
    },
    {
      icon: 'wave',
      title: 'Speech commands',
      text: 'Recognising 34 spoken commands with 95% accuracy.',
      stack: 'PyTorch · CNNs',
      year: '2023',
    },
  ],
};

export const SKILLS = {
  groups: [
    {
      icon: 'network',
      title: 'AI & machine learning',
      daily: ['AI agents', 'LLMs & fine-tuning', 'RAG', 'Voice AI'],
      regular: ['CNNs · Transformers', 'Gradient boosting · SVMs', 'MLOps'],
    },
    {
      icon: 'code',
      title: 'Languages',
      daily: ['Python', 'TypeScript · JavaScript', 'SQL'],
      regular: ['Ruby', 'R · MATLAB', 'Java', 'HTML · CSS'],
    },
    {
      icon: 'grid',
      title: 'Frameworks',
      daily: ['React · Next.js', 'Ruby on Rails', 'PyTorch', 'Scikit-learn · Pandas'],
      regular: ['Supabase · Firebase', 'Tailwind', 'MLflow · Flask · Pytest'],
    },
    {
      icon: 'cloud',
      title: 'Cloud & tools',
      daily: ['AWS', 'Oracle Cloud', 'Vercel', 'Git · CI/CD'],
      regular: ['EC2 · Lambda · RDS · S3', 'Cognito · Amplify', 'REST APIs', 'Figma · Paper'],
    },
  ],
  languages: [
    { name: 'German', level: 'native', bars: 4 },
    { name: 'English', level: 'C1', bars: 3 },
    { name: 'Spanish', level: 'B2', bars: 2 },
  ],
};

export const EDUCATION = [
  {
    featured: true,
    icon: 'cap',
    years: '2025 → 2026',
    place: 'Barcelona',
    school: 'Master · EADA Business School',
    degree: 'AI for Business',
    grades: [
      { label: 'DE 1.2', primary: true },
      { label: 'ES 9.1 / 10' },
      { label: 'US 4.0 / 4.0' },
    ],
    thesisGrade: '1.3 · 9.5 / 10',
    thesis:
      'An explainable money-mule model at a Spanish digital bank, retrained when the data drifts and checked by a human compliance team.',
  },
  {
    icon: 'brain',
    years: '2021 → 2024',
    place: 'Tübingen',
    school: 'Bachelor · University of Tübingen',
    degree: 'Cognitive Science',
    grades: [{ label: 'DE 1.7' }, { label: 'US 3.5 / 4.0' }],
    thesisGrade: '1.3 · 3.8 / 4.0',
    thesis: 'How AI writing tools like ChatGPT change the way people come up with ideas.',
  },
];

export const MODERNIZE = {
  title: ['Keep up with', 'the speed of AI.'],
  text: 'We bring companies up to date: modernize old systems, ship new software with agents, and keep it running. If you want AI speed, work with Oblivion.',
};

export const CONTACT = {
  title: ["Let's build", 'something together.'],
  text: "An AI agent, a proof of concept or a full product. Tell me what you have in mind and I'll answer within a day. If your setup feels like the old site above, we rebuild it. With Oblivion we don't just build the software, we run it.",
};
