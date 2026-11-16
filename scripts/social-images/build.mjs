// Regenerates the link preview images and favicons in public/.
// Needs Google Chrome and ImageMagick (`magick`) installed locally.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../..');
const pub = join(root, 'public');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const card = pathToFileURL(join(import.meta.dirname, 'card.html')).href;
const tmp = mkdtempSync(join(tmpdir(), 'social-images-'));

const magick = (...args) => execFileSync('magick', args);

// Rendered at 2x so the photo stays sharp when Google crops it into a thumbnail.
function render(layout, width, height, out) {
  const png = join(tmp, `${layout}.png`);
  execFileSync(chrome, [
    '--headless',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=2',
    '--virtual-time-budget=5000',
    `--window-size=${width},${height}`,
    `--screenshot=${png}`,
    `${card}?layout=${layout}`,
  ], { stdio: 'ignore' });
  magick(png, '-strip', '-quality', '90', join(pub, out));
}

render('wide', 1200, 630, 'og-image.jpg');
render('square', 1200, 1200, 'portrait-square.jpg');

const svg = join(pub, 'favicon.svg');
const icon = (size, out) =>
  magick('-background', 'none', '-density', '1200', svg, '-resize', `${size}x${size}`, join(pub, out));

icon(48, 'favicon-48.png');
icon(96, 'favicon-96.png');
icon(192, 'favicon-192.png');
icon(512, 'favicon-512.png');
icon(180, 'apple-touch-icon.png');
magick('-background', 'none', '-density', '1200', svg, '-define', 'icon:auto-resize=48,32,16', join(pub, 'favicon.ico'));

rmSync(tmp, { recursive: true });
