import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME, applyTheme, readStoredTheme, storeTheme } from './theme-storage';

export default function ThemeProvider({ children }) {
  // Starts at the default so the prerendered HTML and the first client render
  // agree; a stored choice is picked up before the first paint. The theme the
  // page is painted with comes from the attribute main.jsx sets, not from here.
  const [theme, setThemeState] = useState(DEFAULT_THEME);

  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored !== DEFAULT_THEME) setThemeState(stored);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyTheme(next);
    storeTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
