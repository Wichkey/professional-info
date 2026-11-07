// Renders cv/cv.html to src/assets/resume.pdf with headless Chrome, then sets the PDF metadata.
// Usage: npm run cv   (override the browser with CHROME_PATH=/path/to/chrome)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PDFDocument, PDFName } from 'pdf-lib';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'cv.html');
const target = resolve(here, '../src/assets/resume.pdf');

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) {
  console.error('Chrome not found. Set CHROME_PATH.');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'cv-'));
const rawPdf = join(work, 'raw.pdf');

try {
  // A throwaway profile keeps headless Chrome away from the everyday browser profile;
  // the time budget lets the fonts load before printing.
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${join(work, 'profile')}`,
      '--no-pdf-header-footer',
      '--virtual-time-budget=15000',
      `--print-to-pdf=${rawPdf}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'ignore' },
  );

  const pdf = await PDFDocument.load(readFileSync(rawPdf), { updateMetadata: false });
  pdf.setTitle('Daniel Mehler CV');
  pdf.setAuthor('Daniel Mehler');
  pdf.setSubject('Curriculum vitae of Daniel Mehler');
  pdf.setCreationDate(new Date());
  pdf.setModificationDate(new Date());
  const info = pdf.getInfoDict();
  info.delete(PDFName.of('Creator'));
  info.delete(PDFName.of('Producer'));

  writeFileSync(target, await pdf.save());
  console.log(`CV written to ${target} (${pdf.getPageCount()} pages)`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
