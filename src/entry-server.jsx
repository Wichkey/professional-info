import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/**
 * Renders the finished page for scripts/prerender.mjs. There is no window here,
 * so `canAnimate()` is false: no intro overlay, no build placeholders, no
 * scroll lock and no `inert` — exactly the settled state a crawler should read.
 * The same tree is what the client hydrates.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
