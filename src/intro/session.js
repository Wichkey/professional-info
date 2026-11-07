const KEY = 'dm-intro-played';

export function introAlreadyPlayed() {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    // Without storage the intro simply plays again on the next load.
  }
}
