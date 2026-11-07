import { CURSOR_PATH, pickSwarm } from './swarm';
import { isSmallScreen } from './motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MOVE_EASE = 'cubic-bezier(0.45, 0, 0.2, 1)';
const FRAME_PAD = 6;
// Stretches every build timing so a viewer can follow the cursors placing frames.
const PACE = 1.32;
// Cursor visits run in real time, independent of PACE, so they never linger on slow builds.
const ENTER_MS = 260;
const EXIT_DELAY_MS = 90;
const EXIT_MS = 380;
const IDLE_MAX = 900;

function make(tag, className, parent) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function guessKind(node) {
  if (node.dataset.buildKind) return node.dataset.buildKind;
  if (/^H[1-3]$/.test(node.tagName)) return 'heading';
  if (node.tagName === 'IMG') return 'image';
  return 'text';
}

function measureFrames(scope, overlayBox) {
  return [...scope.querySelectorAll('[data-build]')]
    .map((node) => {
      const r = node.getBoundingClientRect();
      return {
        node,
        label: node.dataset.build,
        kind: guessKind(node),
        reveals: node.dataset.buildReveals
          ? scope.querySelector(`[data-build-id="${node.dataset.buildReveals}"]`)
          : null,
        x: r.left - overlayBox.left - FRAME_PAD,
        y: r.top - overlayBox.top - FRAME_PAD,
        w: r.width + FRAME_PAD * 2,
        h: r.height + FRAME_PAD * 2,
      };
    })
    .filter((f) => f.w > FRAME_PAD * 2 && f.h > FRAME_PAD * 2);
}

function addPlaceholders(fill, frame) {
  const { kind, w, h } = frame;
  if (kind === 'image') {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'bf__x');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    [[0, 0, w, h], [w, 0, 0, h]].forEach(([x1, y1, x2, y2]) => {
      const line = document.createElementNS(SVG_NS, 'line');
      Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => line.setAttribute(k, v));
      svg.appendChild(line);
    });
    fill.appendChild(svg);
    return [svg];
  }

  if (kind === 'chips') {
    fill.classList.add('bf__fill--row');
    const count = Math.max(2, Math.min(7, Math.round(w / 110)));
    return Array.from({ length: count }, () => {
      const chip = make('span', 'bf__chip', fill);
      chip.style.width = `${random(46, 104)}px`;
      return chip;
    });
  }

  if (kind === 'heading') {
    const count = Math.max(1, Math.min(3, Math.round(h / 72)));
    const thick = Math.max(12, Math.min(44, (h - 20) / count - 12));
    return Array.from({ length: count }, (_, i) => {
      const bar = make('span', 'bf__bar', fill);
      bar.style.height = `${thick}px`;
      bar.style.borderRadius = '8px';
      bar.style.width = `${i === count - 1 ? random(40, 70) : random(70, 96)}%`;
      return bar;
    });
  }

  const count = Math.max(1, Math.min(kind === 'card' ? 4 : 5, Math.floor((h - 14) / 16)));
  return Array.from({ length: count }, (_, i) => {
    const bar = make('span', 'bf__bar', fill);
    if (kind === 'card' && i === 0) {
      bar.style.height = '14px';
      bar.style.width = `${random(30, 50)}%`;
    } else {
      bar.style.width = `${random(38, 94)}%`;
    }
    return bar;
  });
}

function buildCursor(overlay, agent) {
  const cursor = make('div', `bc${agent.main ? ' bc--main' : ''}`, overlay);
  cursor.style.setProperty('--c', agent.color);
  if (agent.text) cursor.style.setProperty('--t', agent.text);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '22');
  svg.setAttribute('viewBox', '0 0 20 22');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CURSOR_PATH);
  svg.appendChild(path);
  cursor.appendChild(svg);
  make('span', 'bc__pill', cursor).textContent = agent.name;
  return cursor;
}

// Full-width scopes would push the overlay's side bleed past the screen edge.
function fitToViewport(overlay) {
  const box = overlay.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  if (box.left >= 0 && box.right <= vw) return box;
  const style = getComputedStyle(overlay);
  overlay.style.left = `${parseFloat(style.left) - Math.min(0, box.left)}px`;
  overlay.style.right = `${parseFloat(style.right) + Math.max(0, box.right - vw)}px`;
  return overlay.getBoundingClientRect();
}

function connectorPoints(a, b) {
  const overlapX = b.x < a.x + a.w - 24 && b.x + b.w > a.x + 24;
  if (overlapX || b.y > a.y + a.h) {
    const start = { x: a.x + Math.min(24, a.w / 3), y: a.y + a.h };
    const end = { x: b.x, y: b.y + Math.min(18, b.h / 2) };
    if (end.y <= start.y) return null;
    return [start, { x: start.x, y: end.y }, end];
  }
  const start = { x: a.x + a.w, y: a.y + Math.min(18, a.h / 2) };
  const end = { x: b.x + Math.min(28, b.w / 3), y: b.y };
  return [start, { x: end.x, y: start.y }, end];
}

/**
 * Plays the blueprint build over `scope`: frames, connectors and a swarm of
 * cursors, then fades the real content in. Content never leaves the DOM;
 * only opacity and transform are animated.
 */
export function runBuild(scope, { speed = 1, stretch = 1, origin = null, onDone } = {}) {
  const pace = speed * PACE * stretch;
  const ms = (value) => value * PACE * stretch;
  const animations = [];
  const anim = (node, keyframes, options) => {
    const a = node.animate(keyframes, { fill: 'both', easing: EASE, ...options });
    animations.push(a);
    return a;
  };

  const overlay = make('div', 'build-overlay', scope);
  overlay.setAttribute('aria-hidden', 'true');
  const box = fitToViewport(overlay);
  const frames = measureFrames(scope, box);
  const small = isSmallScreen();

  const n = Math.max(frames.length, 1);
  const frameStagger = Math.min(90, 620 / n) * pace;
  const frameAt = (i) => 140 * pace + i * frameStagger;
  const fillStart = frameAt(Math.floor(n * 0.6)) + 220 * pace;
  const fillStagger = Math.min(80, 620 / n) * pace;
  const revealAt = (i) => fillStart + i * fillStagger;
  const fadeAt = revealAt(n - 1) + 520 * pace;
  const total = fadeAt + ms(480);

  const swarm = pickSwarm(frames.length, small);
  const owner = frames.map((_, i) => (i === 0 ? 0 : 1 + ((i - 1) % (swarm.length - 1))));

  frames.forEach((f, i) => {
    const agent = swarm[owner[i]];
    const frame = make('div', 'bf', overlay);
    frame.style.cssText = `left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px`;
    frame.style.setProperty('--c', agent.main ? 'var(--accent)' : agent.color);
    const tab = make('span', 'bf__tab', frame);
    tab.textContent = f.label;
    if (agent.main) tab.classList.add('bf__tab--main');
    const fill = make('div', 'bf__fill', frame);
    const pieces = addPlaceholders(fill, f);

    if (i === 0 && !small && f.w > 120) {
      ['tl', 'tr', 'bl', 'br'].forEach((corner) => make('span', `bf__handle bf__handle--${corner}`, frame));
      make('span', 'bf__dims', frame).textContent = `${Math.round(f.w)} × ${Math.round(f.h)}`;
    }

    anim(frame, [{ opacity: 0, transform: 'scale(0.97)' }, { opacity: 1, transform: 'none' }], {
      duration: ms(260),
      delay: frameAt(i),
    });
    pieces.forEach((piece, p) => {
      anim(piece, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: ms(320),
        delay: frameAt(i) + ms(120 + p * 45),
      });
    });
    anim(fill, [{ opacity: 1 }, { opacity: 0 }], { duration: ms(240), delay: revealAt(i) });

    anim(f.node, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], {
      duration: ms(480),
      delay: revealAt(i) + ms(60),
      fill: 'backwards',
    });
    if (f.reveals) {
      anim(f.reveals, [{ opacity: 0 }, { opacity: 1 }], {
        duration: ms(900),
        delay: revealAt(i),
        fill: 'backwards',
      });
    }
  });

  const connectorCount = Math.min(frames.length - 1, small ? 2 : 6);
  for (let i = 0; i < connectorCount; i += 1) {
    const points = connectorPoints(frames[i], frames[i + 1]);
    if (!points) continue;
    const color = swarm[owner[i + 1]].main ? 'var(--accent)' : swarm[owner[i + 1]].color;
    const startAt = frameAt(i + 1) + 120 * pace;
    points.slice(0, -1).forEach((p, s) => {
      const q = points[s + 1];
      const horizontal = p.y === q.y;
      const length = horizontal ? Math.abs(q.x - p.x) : Math.abs(q.y - p.y);
      if (length < 2) return;
      const line = make('span', 'bl', overlay);
      line.style.setProperty('--c', color);
      line.style.cssText += horizontal
        ? `left:${Math.min(p.x, q.x)}px;top:${p.y}px;width:${length}px;height:1px;transform-origin:${q.x > p.x ? 'left' : 'right'}`
        : `left:${p.x}px;top:${Math.min(p.y, q.y)}px;width:1px;height:${length}px;transform-origin:${q.y > p.y ? 'top' : 'bottom'}`;
      anim(line, [{ transform: horizontal ? 'scaleX(0)' : 'scaleY(0)' }, { transform: 'none' }], {
        duration: ms(220),
        delay: startAt + ms(s * 200),
      });
    });
    [points[0], points[points.length - 1]].forEach((p, d) => {
      const dot = make('span', 'bn', overlay);
      dot.style.setProperty('--c', color);
      dot.style.left = `${p.x - 3}px`;
      dot.style.top = `${p.y - 3}px`;
      anim(dot, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'none' }], {
        duration: ms(200),
        delay: startAt + ms(d * 400),
      });
    });
  }

  const startPoint = origin
    ? { x: origin.x - box.left, y: origin.y - box.top }
    : { x: (frames[0]?.x ?? 40) + 20, y: Math.max(20, (frames[0]?.y ?? 40) - 30) };

  swarm.forEach((agent, c) => {
    const actions = [];
    frames.forEach((f, i) => {
      if (owner[i] !== c) return;
      actions.push({ t: frameAt(i) - ms(30), x: f.x, y: f.y });
      actions.push({ t: frameAt(i) + 240 * pace, x: f.x + Math.min(f.w, 520), y: f.y + Math.min(f.h, 300) });
    });
    frames.forEach((f, i) => {
      if (owner[i] !== c) return;
      actions.push({ t: revealAt(i) + ms(20), x: f.x + Math.min(f.w * 0.6, 220), y: f.y + Math.min(f.h * 0.5, 80) });
    });
    if (!actions.length) return;
    actions.sort((a, b) => a.t - b.t);

    // A cursor is only on screen while it has work: long waits split its timeline into separate visits.
    const visits = [];
    actions.forEach((a) => {
      const visit = visits[visits.length - 1];
      if (visit && a.t - visit[visit.length - 1].t <= IDLE_MAX) visit.push(a);
      else visits.push([a]);
    });

    const cursor = buildCursor(overlay, agent);
    // Cursors are clamped so the name pill never runs past the overlay's edges.
    const pill = cursor.querySelector('.bc__pill');
    const maxX = Math.max(0, box.width - pill.offsetLeft - pill.offsetWidth - 4);
    const maxY = Math.max(0, box.height - pill.offsetTop - pill.offsetHeight - 4);

    const points = [];
    visits.forEach((visit, v) => {
      const first = visit[0];
      const last = visit[visit.length - 1];
      const enterAt = Math.max(0, first.t - ENTER_MS);
      const from = v === 0
        ? { x: startPoint.x + (c === 0 ? 0 : random(-60, 60)), y: startPoint.y + (c === 0 ? 0 : random(-30, 50)) }
        : { x: first.x - random(30, 60), y: first.y - random(20, 40) };
      points.push({ t: enterAt, x: from.x, y: from.y, o: 0, s: 0.6 });
      points.push(...visit.map((a) => ({ ...a, t: Math.max(a.t, enterAt + 60) })));
      const driftX = random(20, 50);
      const driftY = random(10, 30);
      points.push({ t: last.t + EXIT_DELAY_MS, x: last.x + driftX * 0.3, y: last.y + driftY * 0.3, o: 1 });
      points.push({ t: last.t + EXIT_DELAY_MS + EXIT_MS, x: last.x + driftX, y: last.y + driftY, o: 0, s: 0.6 });
    });
    const end = points[points.length - 1];
    if (end.t < total) points.push({ ...end, t: total });
    const span = Math.max(total, end.t);

    const keyframes = points.map((p) => ({
      offset: Math.min(1, Math.max(0, p.t / span)),
      transform: `translate3d(${Math.min(Math.max(p.x, 0), maxX)}px, ${Math.min(Math.max(p.y, 0), maxY)}px, 0) scale(${p.s ?? 1})`,
      opacity: p.o ?? 1,
      easing: MOVE_EASE,
    }));
    for (let k = 1; k < keyframes.length; k += 1) {
      if (keyframes[k].offset < keyframes[k - 1].offset) keyframes[k].offset = keyframes[k - 1].offset;
    }
    keyframes[0].offset = 0;
    keyframes[keyframes.length - 1].offset = 1;
    anim(cursor, keyframes, { duration: span, easing: 'linear' });
  });

  anim(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: ms(420), delay: fadeAt, fill: 'forwards' });
  scope.classList.remove('is-pending');

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    animations.forEach((a) => a.cancel());
    overlay.remove();
    onDone?.();
  };
  const timer = window.setTimeout(finish, total + 60);

  return () => {
    window.clearTimeout(timer);
    finish();
  };
}
