import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../build/motion';
import { lockBodyScroll } from '../intro/scrollLock';
import { reboot } from './reboot';
import {
  BLACK_AT,
  CRT_AT,
  DOT_AT,
  FINAL_AT,
  SECTIONS,
  TYPE_MS_PER_CHAR,
  UNMOUNT_START,
  UNMOUNT_STEP,
} from './timeline';
import './shutdown.css';

const BLOCKS = 8;
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']);

function stageAt(t) {
  if (t < CRT_AT) return 'unmount';
  if (t < DOT_AT) return 'crt';
  if (t < BLACK_AT) return 'dot';
  if (t < FINAL_AT) return 'black';
  return 'final';
}

function typed(text, t) {
  return text.slice(0, Math.max(0, Math.floor(t / TYPE_MS_PER_CHAR)));
}

export default function Shutdown({ name }) {
  const [t, setT] = useState(() => (prefersReducedMotion() ? Infinity : 0));
  const rebootRef = useRef(null);
  const stage = stageAt(t);
  const isFinal = stage === 'final';

  useEffect(lockBodyScroll, []);

  useEffect(() => {
    if (t === Infinity) return undefined;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - start;
      setT(elapsed);
      if (elapsed > FINAL_AT + 3000) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
    // The clock starts once, when the overlay opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFinal) return undefined;
    rebootRef.current?.focus();
    const onKey = (e) => {
      if (MODIFIER_KEYS.has(e.key)) return;
      e.preventDefault();
      reboot();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFinal]);

  const unmounted = Math.min(SECTIONS.length, Math.max(0, Math.floor((t - UNMOUNT_START) / UNMOUNT_STEP) + 1));
  const filled = Math.round((unmounted / SECTIONS.length) * BLOCKS);
  const closing = `session closed · message delivered · thanks, ${name || 'friend'}`;
  const prompt = window.matchMedia?.('(pointer: coarse)').matches ? '> tap to reboot' : '> press any key to reboot';
  const finalT = t - FINAL_AT;
  const line1 = typed(closing, finalT);
  const line2 = typed(prompt, finalT - closing.length * TYPE_MS_PER_CHAR - 300);

  return (
    <div
      className={`shutdown is-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-label="Message sent, session closed"
      onPointerDown={isFinal ? reboot : undefined}
    >
      {(stage === 'unmount' || stage === 'crt') && (
        <div className="shutdown__screen">
          <span className="shutdown__glow" aria-hidden="true" />
          <div className="shutdown__head">
            <span className="shutdown__dot" />
            daniel-mehler.com · shutdown
          </div>
          <p className="shutdown__log" aria-hidden="true">
            &gt; unmounting sections{' '}
            <span className="shutdown__bar">
              {'█'.repeat(filled)}
              <span className="shutdown__bar-empty">{'░'.repeat(BLOCKS - filled)}</span>
            </span>
            <span className="shutdown__count">
              {unmounted} / {SECTIONS.length}
            </span>
          </p>
          <ol className="shutdown__sections" aria-hidden="true">
            {SECTIONS.map((label, i) => (
              <li key={label} className={`shutdown__section${i < unmounted ? ' is-flat' : ''}`}>
                <span className="shutdown__tab">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {(stage === 'crt' || stage === 'dot') && <span className="shutdown__beam" aria-hidden="true" />}

      {isFinal && (
        <div className="shutdown__final">
          <p className="shutdown__closing">{t === Infinity ? closing : line1}</p>
          <button ref={rebootRef} type="button" className="shutdown__reboot" onClick={reboot}>
            {t === Infinity ? prompt : line2}
            <span className="shutdown__caret" aria-hidden="true" />
          </button>
        </div>
      )}

      <p className="visually-hidden" aria-live="assertive">
        {isFinal ? `${closing}. Press any key to reload the site.` : ''}
      </p>
    </div>
  );
}
