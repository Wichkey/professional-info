import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { prefersReducedMotion } from '../../build/motion';
import { lockBodyScroll } from '../../intro/scrollLock';
import ContactTerminal from './ContactTerminal';
import './ContactDialog.css';

// Matches the exit animation in ContactDialog.css.
const EXIT_MS = 220;

const FOCUSABLE = 'a[href], button, input, textarea, select, iframe, [tabindex]';

export default function ContactDialog({ onClose, onSent }) {
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const sentName = useRef(null);

  const close = useCallback(() => setClosing(true), []);

  const handleSent = useCallback((name) => {
    sentName.current = name;
    setClosing(true);
  }, []);

  useEffect(lockBodyScroll, []);

  useEffect(() => {
    if (!closing) return undefined;
    const timer = window.setTimeout(
      () => (sentName.current === null ? onClose() : onSent(sentName.current)),
      prefersReducedMotion() ? 0 : EXIT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [closing, onClose, onSent]);

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
      if (e.key !== 'Tab') return;
      const items = tabbable();
      if (items.length === 0) return;
      const edge = items[e.shiftKey ? 0 : items.length - 1];
      if (document.activeElement === edge || !panelRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        items[e.shiftKey ? items.length - 1 : 0].focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [close]);

  return createPortal(
    <div className={`cdialog${closing ? ' is-closing' : ''}`}>
      <div className="cdialog__backdrop" onMouseDown={close} />
      <div
        ref={panelRef}
        className="cdialog__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Contact Daniel"
      >
        <ContactTerminal autoFocus onClose={close} onSent={handleSent} />
      </div>
    </div>,
    document.body,
  );
}
