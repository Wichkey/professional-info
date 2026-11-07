export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

export function canAnimate() {
  return (
    typeof window !== 'undefined' &&
    typeof Element !== 'undefined' &&
    typeof Element.prototype.animate === 'function' &&
    !prefersReducedMotion()
  );
}

export function isSmallScreen() {
  return window.innerWidth < 768;
}
