const LOCK_CLASS = 'is-intro-locked';
const OVERLAY_LOCK_CLASS = 'is-locked';
const LINE_PX = 16;
const ARROW_PX = 60;

/**
 * Freezes the page where it stands while an overlay is open. Unlike the intro lock
 * below it keeps the scroll position, so closing the overlay returns to the section.
 * Returns the function that releases the page.
 */
export function lockBodyScroll() {
  const root = document.documentElement;
  root.classList.add(OVERLAY_LOCK_CLASS);
  return () => root.classList.remove(OVERLAY_LOCK_CLASS);
}

const isEditable = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName));

const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

function wheelPixels(e) {
  if (e.deltaMode === 1) return e.deltaY * LINE_PX;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

/**
 * Pins the page at the top while the intro plays. Wheel, touch and scroll keys never
 * reach the page; they go to `sink` instead (the old-site capture while it is shown).
 * Returns the function that releases the page, again at the very top.
 */
export function lockPageScroll(sink) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    // Without it the scroll listener below still pulls a restored page back to the top.
  }
  const root = document.documentElement;
  root.classList.add(LOCK_CLASS);
  jumpToTop();

  const send = (dy) => sink.current?.by(dy);
  let touchY = null;

  const onWheel = (e) => {
    e.preventDefault();
    send(wheelPixels(e));
  };
  const onTouchStart = (e) => {
    touchY = e.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    const y = e.touches[0]?.clientY;
    if (y == null || touchY == null) return;
    send(touchY - y);
    touchY = y;
  };
  const onKey = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const page = window.innerHeight * 0.85;
    const steps = {
      ArrowDown: ARROW_PX,
      ArrowUp: -ARROW_PX,
      PageDown: page,
      PageUp: -page,
      ' ': e.shiftKey ? -page : page,
      End: Infinity,
      Home: -Infinity,
    };
    if (!(e.key in steps)) return;
    if (e.key === ' ' && isEditable(e.target)) return;
    e.preventDefault();
    send(steps[e.key]);
  };
  const onScroll = () => {
    if (window.scrollY !== 0 || window.scrollX !== 0) jumpToTop();
  };

  const active = { passive: false, capture: true };
  window.addEventListener('wheel', onWheel, active);
  window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
  window.addEventListener('touchmove', onTouchMove, active);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('wheel', onWheel, active);
    window.removeEventListener('touchstart', onTouchStart, { capture: true });
    window.removeEventListener('touchmove', onTouchMove, active);
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('scroll', onScroll);
    root.classList.remove(LOCK_CLASS);
    jumpToTop();
  };
}
