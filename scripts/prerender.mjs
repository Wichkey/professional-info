// Renders the real React app to HTML and writes it into dist/index.html, so the
// deployed page carries its copy without JavaScript. Googlebot renders JS
// eventually, Bingbot unreliably, and the AI search crawlers not at all.
//
// Runs after both Vite builds: the client build produces dist/index.html, the
// SSR build produces dist-ssr/entry-server.js.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const indexPath = fileURLToPath(new URL('dist/index.html', root));
const serverEntry = new URL('dist-ssr/entry-server.js', root);
const PLACEHOLDER = '<div id="root"></div>';

// react-dom warns once per useLayoutEffect it meets on the server. The app uses
// them to measure and animate in the browser; none of them run here.
const realError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('useLayoutEffect does nothing on the server')) return;
  realError(...args);
};

const { render } = await import(serverEntry.href);
const body = render();
console.error = realError;

if (!body.trim()) throw new Error('prerender: the app rendered nothing');

const html = await readFile(indexPath, 'utf8');
if (!html.includes(PLACEHOLDER)) {
  throw new Error(`prerender: ${PLACEHOLDER} not found in dist/index.html`);
}

await writeFile(indexPath, html.replace(PLACEHOLDER, `<div id="root">${body}</div>`), 'utf8');
await rm(fileURLToPath(new URL('dist-ssr', root)), { recursive: true, force: true });

console.log(`prerender: wrote ${(body.length / 1024).toFixed(1)} kB of markup into dist/index.html`);
