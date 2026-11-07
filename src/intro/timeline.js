
// Four escalating bursts with calm gaps; the last one tears the old site away.
export const BURSTS = [
  { from: 1200, to: 1520 },
  { from: 1900, to: 2400 },
  { from: 2750, to: 3450 },
  { from: 3700, to: 4900 },
];

export const GLITCH_END = BURSTS[BURSTS.length - 1].to;
export const SPAWN_AT = GLITCH_END + 3700;
export const REVEAL_AT = SPAWN_AT + 900;
export const END_AT = REVEAL_AT + 520;

const TYPE_MS = 240;

export const LINES = [
  { stamp: '00.04', at: 0, text: '> initializing workspace…', ok: true },
  { stamp: '00.31', at: 320, text: '> downloading assets', progress: { from: 480, to: 1150 } },
  { stamp: '00.58', at: 1200, text: '> resolving dependencies…', ok: true },
  { stamp: '00.82', at: 1520, text: '> loading portfolio: ', strong: 'daniel-mehler.com', ok: true },
  { stamp: '01.06', at: 1880, text: '> initializing new website…', ok: true },
  { stamp: '01.24', at: 2240, text: '> spawning agent…', ok: true, okAt: 3000, caret: true },
  { stamp: '01.30', at: 3050, text: '> This site just rebuilt itself. Yours can too.', signoff: true, typeMs: 560 },
];

/** 1-based burst level at `t`, or 0 while the old site sits still between bursts. */
export function burstAt(t) {
  const index = BURSTS.findIndex((b) => t >= b.from && t < b.to);
  return index + 1;
}

/** How many bursts have already finished by `t`. */
export function burstsDone(t) {
  return BURSTS.filter((b) => t >= b.to).length;
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Everything the terminal shows `t` ms after it opened. */
export function lineState(line, t) {
  const typeMs = line.typeMs ?? TYPE_MS;
  const full = line.text + (line.strong ?? '');
  const typed = Math.floor(full.length * clamp01((t - line.at) / typeMs));
  const visible = t >= line.at;
  const typedDone = t >= line.at + typeMs;
  const okAt = line.okAt ?? line.at + typeMs + 90;
  const progress = line.progress ? clamp01((t - line.progress.from) / (line.progress.to - line.progress.from)) : null;
  return {
    visible,
    shownText: full.slice(0, Math.min(typed, line.text.length)),
    shownStrong: line.strong ? full.slice(line.text.length, typed) : '',
    typedDone,
    ok: line.ok && t >= okAt,
    progress: typedDone ? progress : null,
    caret: line.caret && typedDone && t < okAt,
  };
}
