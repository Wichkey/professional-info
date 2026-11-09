import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyTheme, readStoredTheme } from './theme/theme-storage';
import './theme/tokens.css';
import './styles/base.css';
import './styles/glitch.css';

// Applied before the first render so a stored pink theme never flashes blue.
applyTheme(readStoredTheme());

const root = document.getElementById('root');
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build prerenders the page into #root, so there is markup to
// hydrate. `npm run dev` serves an empty container and renders from scratch.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
