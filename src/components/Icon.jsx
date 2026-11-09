const ICONS = {
  monitor: { box: 24, shape: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M8 21h8M12 18v3M9 12.5l-2 1.5 2 1.5M15 12.5l2 1.5-2 1.5" /></> },
  agent: { box: 24, shape: <path d="M5 3v15l4-3.7 2.8 6 2.8-1.3-2.7-5.9H17.5ZM17 3.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" /> },
  compass: { box: 24, shape: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5Z" /></> },
  pin: { box: 24, shape: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></> },
  chat: { box: 24, shape: <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2Z" /> },
  briefcase: { box: 24, shape: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18" /></> },
  layers: { box: 24, shape: <path d="M12 3l9 5-9 5-9-5ZM3 13l9 5 9-5" /> },
  nodes: { box: 24, shape: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M7.2 6.6 11 12M16.8 6.6 13 12M12 12v5" /></> },
  bank: { box: 24, shape: <path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" /> },
  pulse: { box: 24, shape: <path d="M3 12h4l2-4 3 9 2-5h7" /> },
  drop: { box: 24, shape: <><path d="M12 3.5s-6 6.4-6 10.5a6 6 0 0 0 12 0c0-4.1-6-10.5-6-10.5Z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></> },
  shield: { box: 24, shape: <><path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6Z" /><path d="M9 12l2 2 4-4" /></> },
  target: { box: 24, shape: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></> },
  mic: { box: 24, shape: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" /></> },
  wave: { box: 24, shape: <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" /> },
  pint: { box: 24, shape: <><path d="M6 4h12l-1.5 16h-9Z" /><path d="M6.6 9h10.8" /></> },
  receipt: { box: 24, shape: <><path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21Z" /><path d="M9 8h6M9 12h6M9 16h3" /></> },
  leaf: { box: 24, shape: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-4 6-6.5 9-8" /></> },
  board: { box: 24, shape: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16M5.5 8h1.5M11.5 8h1.5M11.5 11h1.5M17.5 8h1.5" /></> },
  heart: { box: 24, shape: <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" /> },
  scan: { box: 24, shape: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><circle cx="12" cy="12" r="3.5" /></> },
  check: { box: 24, shape: <path d="M5 12.5l4.5 4.5L19 7.5" /> },
  network: { box: 28, shape: <><circle cx="14" cy="14" r="4" /><circle cx="5" cy="6" r="2" /><circle cx="23" cy="6" r="2" /><circle cx="5" cy="22" r="2" /><circle cx="23" cy="22" r="2" /><path d="M6.6 7.4 11 11M21.4 7.4 17 11M6.6 20.6 11 17M21.4 20.6 17 17" /></> },
  code: { box: 28, shape: <path d="M10 8 4 14l6 6M18 8l6 6-6 6M15.5 6l-3 16" /> },
  grid: { box: 28, shape: <><rect x="4" y="4" width="8" height="8" rx="1.5" /><rect x="16" y="4" width="8" height="8" rx="1.5" /><rect x="4" y="16" width="8" height="8" rx="1.5" /><rect x="16" y="16" width="8" height="8" rx="1.5" /></> },
  cloud: { box: 28, shape: <path d="M8 21h12.5a4.5 4.5 0 0 0-.5-9 6.5 6.5 0 0 0-12.5 1.5A3.8 3.8 0 0 0 8 21Z" /> },
  speech: { box: 22, shape: <path d="M3 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4a2 2 0 0 1-2-2Z" /> },
  cap: { box: 30, shape: <><path d="M3 11 15 5l12 6-12 6Z" /><path d="M8 13.5V20c0 2 3.5 4 7 4s7-2 7-4v-6.5M27 11v7" /></> },
  brain: { box: 30, shape: <><path d="M15 25c-6 0-9-4-9-8.5 0-3.5 2-5.5 4-6 0-3.5 2.5-5.5 5-5.5s5 2 5 5.5c2 .5 4 2.5 4 6 0 4.5-3 8.5-9 8.5Z" /><path d="M15 5v20M10 14c2 0 3.5 1.5 5 3M20 14c-2 0-3.5 1.5-5 3" /></> },
  doc: { box: 22, shape: <><path d="M5 2.5h8l4 4v13H5Z" /><path d="M13 2.5v4h4M8 11h6M8 14.5h6" /></> },
  mail: { box: 24, shape: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7 12 13l8.5-6" /></> },
  linkedin: { box: 24, shape: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5v6M8 7.5v.1M12 16.5v-6M12 13c0-1.5 1-2.5 2.5-2.5S16.5 11.5 16.5 13v3.5" /></> },
  github: { box: 24, shape: <path d="M9 19c-4 1.5-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6 0-1.2-.4-2.3-1.2-3.2.4-1.1.3-2.3-.1-3.3 0 0-1.1-.3-3.6 1.4a12 12 0 0 0-6.2 0C6.4 2.7 5.3 3 5.3 3c-.4 1-.5 2.2-.1 3.3C4.4 7.2 4 8.3 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /> },
  download: { box: 24, shape: <><path d="M6 2.5h8l4.5 4.5v14.5H6Z" /><path d="M14 2.5V7h4.5M12.25 10.5V17M9.5 14.5l2.75 2.75L15 14.5" /></> },
  arrowUpRight: { box: 16, shape: <path d="M4 12 12 4M6 4h6v6" /> },
  arrowRight: { box: 28, shape: <path d="M4 14h19M16 7l7 7-7 7" /> },
  arrowDown: { box: 16, shape: <path d="M8 3v10M4 9l4 4 4-4" /> },
  arrowUp: { box: 14, shape: <path d="M7 12V2M3 6l4-4 4 4" /> },
  external: { box: 10, shape: <path d="M3 7 7 3M3.8 3H7v3.2" /> },
};

export default function Icon({ name, size, className, strokeWidth = 1.5 }) {
  const entry = ICONS[name];
  if (!entry) return null;
  const { box, shape } = entry;
  const px = size ?? box;
  return (
    <svg
      className={className}
      width={px}
      height={px}
      viewBox={`0 0 ${box} ${box}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shape}
    </svg>
  );
}
