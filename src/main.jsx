import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyTheme, readStoredTheme } from './theme/theme-storage';
import './theme/tokens.css';
import './styles/base.css';
import './styles/glitch.css';

// Applied before the first render so a stored pink theme never flashes blue.
applyTheme(readStoredTheme());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
