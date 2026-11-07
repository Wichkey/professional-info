import { clearIntroPlayed } from '../intro/session';

/** Reloads the page at the top so the intro boots the site again. */
export function reboot() {
  clearIntroPlayed();
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    // Older browsers keep their own scroll restoration; the intro scrolls up anyway.
  }
  window.scrollTo(0, 0);
  window.location.reload();
}
