import { useCallback, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { applyTheme, readStoredTheme, storeTheme } from './theme-storage';

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyTheme(next);
    storeTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
