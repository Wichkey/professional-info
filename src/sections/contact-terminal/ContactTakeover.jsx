import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { prefersReducedMotion } from '../../build/motion';
import { lockBodyScroll } from '../../intro/scrollLock';
import ContactTerminal from './ContactTerminal';
import { BLACKED_OUT, DONE, LEAVE, LEAVE_PLAIN, SENT, TEAR, TEAR_PLAIN, TEARING } from './takeover';
import './ContactTakeover.css';

const FOCUSABLE = 'a[href], button, input, textarea, select, iframe, [tabindex]';

export default function ContactTakeover({ onClose, onSent }) {
  const reduce = useMemo(prefersReducedMotion, []);
  const scripts = useMemo(
    () => ({
      tear: reduce ? TEAR_PLAIN : TEAR,
      leave: reduce ? LEAVE_PLAIN : LEAVE,
      sent: SENT,
    }),
    [reduce],
  );

  const [script, setScript] = useState('tear');
  const [phase, setPhase] = useState(scripts.tear[0].phase);
  const panelRef = useRef(null);
  const sentName = useRef(null);

  const close = useCallback(() => setScript((current) => (current === 'tear' ? 'leave' : current)), []);

  const handleSent = useCallback((name) => {
    sentName.current = name;
    setScript('sent');
  }, []);

  useEffect(lockBodyScroll, []);

  useEffect(() => {
    const steps = scripts[script];
    setPhase(steps[0].phase);
    const timers = steps.slice(1).map((step) => window.setTimeout(() => setPhase(step.phase), step.at));
    return () => timers.forEach(window.clearTimeout);
  }, [script, scripts]);

  useEffect(() => {
    if (!DONE.has(phase)) return;
    if (sentName.current === null) onClose();
    else onSent(sentName.current);
  }, [onClose, onSent, phase]);

  // The page itself is what glitches, so the phase has to reach it outside this tree.
  useEffect(() => {
    document.documentElement.dataset.ctake = phase;
  }, [phase]);

  useEffect(
    () => () => {
      // On the sent path the shutdown overlay takes the black screen over from here
      // and its reboot reloads the page, so only the escape path restores it.
      if (sentName.current === null) delete document.documentElement.dataset.ctake;
    },
    [],
  );

  useEffect(() => {
    const tabbable = () =>
      [...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(
        (el) => el.tabIndex >= 0 && !el.closest('.is-hidden') && el.getClientRects().length > 0,
      );

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = tabbable();
      if (items.length === 0) return;
      const edge = items[e.shiftKey ? 0 : items.length - 1];
      if (document.activeElement === edge || !panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        items[e.shiftKey ? items.length - 1 : 0].focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [close]);

  return createPortal(
    <div className={`ctake is-${phase}`}>
      <span className="ctake__void" aria-hidden="true" />
      {!reduce && TEARING.has(phase) && (
        <>
          <span className="glitch-scan is-burst ctake__scan" aria-hidden="true" />
          <span className="glitch-noise ctake__noise" aria-hidden="true" />
        </>
      )}

      {BLACKED_OUT.has(phase) && (
        <div ref={panelRef} className="ctake__panel" role="dialog" aria-modal="true" aria-label="Contact Daniel">
          <ContactTerminal autoFocus onClose={close} onSent={handleSent} />
        </div>
      )}
    </div>,
    document.body,
  );
}
