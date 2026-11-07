export const THEMES = ['blue', 'pink'];
export const DEFAULT_THEME = 'blue';
const STORAGE_KEY = 'dm-theme';

export function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this visit only.
  }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
