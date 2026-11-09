/*
 * The contact takeover tears the live page away with the intro's glitch, but as a
 * transition rather than a show: two bursts and a roll instead of the intro's four
 * escalating ones. Each entry is the phase and the milliseconds it starts at.
 */

export const TEAR = [
  { phase: 'burst-1', at: 0 },
  { phase: 'calm', at: 170 },
  { phase: 'burst-2', at: 250 },
  { phase: 'roll', at: 450 },
  { phase: 'open', at: 630 },
];

export const LEAVE = [
  { phase: 'power-off', at: 0 },
  { phase: 'back', at: 170 },
  { phase: 'closed', at: 450 },
];

// After a sent message the screen stays black: the shutdown sequence continues there.
export const SENT = [
  { phase: 'power-off', at: 0 },
  { phase: 'gone', at: 200 },
];

// Under reduced motion the page just fades out and back, with no glitch at all.
export const TEAR_PLAIN = [
  { phase: 'fade', at: 0 },
  { phase: 'open', at: 220 },
];

export const LEAVE_PLAIN = [
  { phase: 'back', at: 0 },
  { phase: 'closed', at: 220 },
];

/** True while the page is still on screen and being glitched. */
export const TEARING = new Set(['burst-1', 'calm', 'burst-2', 'roll', 'fade', 'back']);

/** True once the page is gone and the terminal owns the screen. */
export const BLACKED_OUT = new Set(['open', 'power-off']);

/** The last phase of either script: 'closed' hands the page back, 'gone' keeps it black. */
export const DONE = new Set(['closed', 'gone']);
