export const AGENT = { name: 'Agent', color: 'var(--accent)', text: 'var(--on-accent)', main: true };

export const HELPERS = [
  { name: 'copy', color: '#7ee2a0' },
  { name: 'layout', color: '#f5d547' },
  { name: 'links', color: '#67e8f9' },
  { name: 'image', color: '#ff9a7a' },
  { name: 'pills', color: '#b69cff' },
  { name: 'icons', color: '#c6f26b' },
  { name: 'type', color: '#ffb35c' },
  { name: 'grid', color: '#8fb7ff' },
  { name: 'data', color: '#f9a8d4' },
  { name: 'a11y', color: '#9ef0d0' },
  { name: 'motion', color: '#fde68a' },
];

export function pickSwarm(frameCount, small) {
  const max = small ? 3 : 10;
  const helperCount = Math.max(2, Math.min(max, Math.ceil(frameCount * 0.8)));
  return [AGENT, ...HELPERS.slice(0, helperCount)];
}

export const CURSOR_PATH = 'M2 1.5 L2 18 L6.4 13.9 L9.5 20.6 L12.6 19.2 L9.6 12.6 L15.8 12.6 Z';
