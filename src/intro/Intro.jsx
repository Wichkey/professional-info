import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CURSOR_PATH } from '../build/swarm';
import OldSite from './OldSite';
import Terminal from './Terminal';
import { lockPageScroll } from './scrollLock';
import { END_AT, GLITCH_END, REVEAL_AT, SPAWN_AT, burstAt, burstsDone } from './timeline';
import './intro.css';

function cursorOrigin(node) {
  if (!node) return null;
  const r = node.getBoundingClientRect();
  return { x: r.left + 4, y: r.top + 4 };
}

export default function Intro({ onReveal, onFinish }) {
  const [t, setT] = useState(0);
  const cursorRef = useRef(null);
  const revealed = useRef(false);
  const finished = useRef(false);
  const oldSiteScroll = useRef(null);

  const reveal = useCallback(
    (origin) => {
      if (revealed.current) return;
      revealed.current = true;
      onReveal(origin);
    },
    [onReveal],
  );

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    reveal(null);
    onFinish();
  }, [onFinish, reveal]);

  // Layout effect so the page is pinned before the first frame can be scrolled.
  useLayoutEffect(() => lockPageScroll(oldSiteScroll), []);

  useEffect(() => {
    const start = performance.now();
    let frame;
    let done = false;
    const step = () => {
      if (done) return;
      const elapsed = performance.now() - start;
      setT(elapsed);
      if (elapsed >= REVEAL_AT && !revealed.current) reveal(cursorOrigin(cursorRef.current));
      if (elapsed >= END_AT) {
        done = true;
        finish();
      }
    };
    const loop = () => {
      step();
      if (!done) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    // Frames can stall (hidden tab, throttled renderer); the timer keeps the
    // intro from holding the page locked.
    const fallback = window.setInterval(step, 200);
    return () => {
      done = true;
      cancelAnimationFrame(frame);
      window.clearInterval(fallback);
    };
  }, [finish, reveal]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  const phase = t < GLITCH_END ? 'old' : 'terminal';
  const termT = t - GLITCH_END;
  const spawned = t >= SPAWN_AT;
  const leaving = t >= REVEAL_AT;

  return (
    <div className={`intro${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Intro animation">
      {phase !== 'terminal' && <OldSite burst={burstAt(t)} done={burstsDone(t)} scrollRef={oldSiteScroll} />}

      {phase === 'terminal' && (
        <div className="intro-term">
          <div className="intro-term__head">
            <span className={`intro-term__dot${spawned ? ' is-online' : ''}`} />
            <span>daniel-mehler.com · {spawned ? 'agent online' : 'boot'}</span>
          </div>
          <Terminal t={termT} dimmed={spawned} />
          {spawned && (
            <div className="intro-agent" ref={cursorRef}>
              <span className="intro-agent__ring intro-agent__ring--a" />
              <span className="intro-agent__ring intro-agent__ring--b" />
              <svg className="intro-agent__cursor" viewBox="0 0 18 22" width="26" height="32" aria-hidden="true">
                <path d={CURSOR_PATH} />
              </svg>
              <span className="intro-agent__pill">Agent</span>
            </div>
          )}
        </div>
      )}

      <button type="button" className="intro__skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
