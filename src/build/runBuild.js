import { CURSOR_PATH, pickSwarm } from './swarm';
import { isSmallScreen } from './motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MOVE_EASE = 'cubic-bezier(0.45, 0, 0.2, 1)';
const FRAME_PAD = 6;

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
export function runBuild(scope, { speed = 1, origin = null, onDone } = {}) {
  const animations = [];
  const anim = (node, keyframes, options) => {
    const a = node.animate(keyframes, { fill: 'both', easing: EASE, ...options });
    animations.push(a);
    return a;
  };

  const overlay = make('div', 'build-overlay', scope);
  overlay.setAttribute('aria-hidden', 'true');
  const box = overlay.getBoundingClientRect();
  const frames = measureFrames(scope, box);
  const small = isSmallScreen();

  const n = Math.max(frames.length, 1);
  const frameStagger = Math.min(90, 620 / n) * speed;
  const frameAt = (i) => 140 * speed + i * frameStagger;
  const fillStart = frameAt(Math.floor(n * 0.6)) + 220 * speed;
  const fillStagger = Math.min(80, 620 / n) * speed;
  const revealAt = (i) => fillStart + i * fillStagger;
  const fadeAt = revealAt(n - 1) + 520 * speed;
  const total = fadeAt + 480;

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
      duration: 260,
      delay: frameAt(i),
    });
    pieces.forEach((piece, p) => {
      anim(piece, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: 320,
        delay: frameAt(i) + 120 + p * 45,
      });
    });
    anim(fill, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, delay: revealAt(i) });

    anim(f.node, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], {
      duration: 480,
      delay: revealAt(i) + 60,
      fill: 'backwards',
    });
    if (f.reveals) {
      anim(f.reveals, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 900,
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
    const startAt = frameAt(i + 1) + 120 * speed;
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
        duration: 220,
        delay: startAt + s * 200,
      });
    });
    [points[0], points[points.length - 1]].forEach((p, d) => {
      const dot = make('span', 'bn', overlay);
      dot.style.setProperty('--c', color);
      dot.style.left = `${p.x - 3}px`;
      dot.style.top = `${p.y - 3}px`;
      anim(dot, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'none' }], {
        duration: 200,
        delay: startAt + d * 400,
      });
    });
  }

  const startPoint = origin
    ? { x: origin.x - box.left, y: origin.y - box.top }
    : { x: (frames[0]?.x ?? 40) + 20, y: Math.max(20, (frames[0]?.y ?? 40) - 30) };

  swarm.forEach((agent, c) => {
    const cursor = buildCursor(overlay, agent);
    const spread = c === 0 ? { x: 0, y: 0 } : { x: random(-60, 60), y: random(-30, 50) };
    const points = [{ t: 0, x: startPoint.x, y: startPoint.y, o: 0, s: 0.4 }];
    points.push({ t: 90 + c * 40, x: startPoint.x + spread.x, y: startPoint.y + spread.y, o: 1, s: 1 });

    frames.forEach((f, i) => {
      if (owner[i] !== c) return;
      points.push({ t: frameAt(i) - 30, x: f.x, y: f.y });
      points.push({ t: frameAt(i) + 240 * speed, x: f.x + Math.min(f.w, 520), y: f.y + Math.min(f.h, 300) });
    });
    frames.forEach((f, i) => {
      if (owner[i] !== c) return;
      points.push({ t: revealAt(i) + 20, x: f.x + Math.min(f.w * 0.6, 220), y: f.y + Math.min(f.h * 0.5, 80) });
    });
    const last = points[points.length - 1];
    points.push({ t: fadeAt, x: last.x + random(20, 60), y: last.y + random(10, 40), o: 1 });
    points.push({ t: total, x: last.x + random(40, 90), y: last.y + random(20, 60), o: 0, s: 0.6 });

    points.sort((a, b) => a.t - b.t);
    const keyframes = points
      .filter((p, idx) => idx === 0 || p.t - points[idx - 1].t > 50 || idx === points.length - 1)
      .map((p) => ({
        offset: Math.min(1, Math.max(0, p.t / total)),
        transform: `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.s ?? 1})`,
        opacity: p.o ?? 1,
        easing: MOVE_EASE,
      }));
    for (let k = 1; k < keyframes.length; k += 1) {
      if (keyframes[k].offset < keyframes[k - 1].offset) keyframes[k].offset = keyframes[k - 1].offset;
    }
    keyframes[0].offset = 0;
    keyframes[keyframes.length - 1].offset = 1;
    anim(cursor, keyframes, { duration: total, easing: 'linear' });
  });

  anim(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: 420, delay: fadeAt, fill: 'forwards' });
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
