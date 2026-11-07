import { useTheme } from './ThemeContext';
import { THEMES } from './theme-storage';
import './ThemeSwitch.css';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switch" role="radiogroup" aria-label="Colour theme">
      {THEMES.map((name) => (
        <button
          key={name}
          type="button"
          role="radio"
          aria-checked={theme === name}
          className={`theme-switch__option theme-switch__option--${name}`}
          onClick={() => setTheme(name)}
        >
          <span className="theme-switch__dot" aria-hidden="true" />
          {name}
        </button>
      ))}
    </div>
  );
}
