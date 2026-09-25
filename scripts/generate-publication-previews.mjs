// Static, matching interior pages for the homepage books. No database writes.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const publications = [
  // Linked by aidsmo.org/مجلة-التنمية-الصناعية-العربية.html (issue 88).
  { name: 'industry-88', driveId: '1nLzqQY8-bOu0m6LKQrjFkuYziDxTtgGW' },
  // Linked by https://www.smc-aidsmo.org/ under publications / guides.
  { name: 'conformity-guide', driveId: '1ja0v35KExs24F96f1tODJ6w2IB3eKPAQ' },
  // Embedded in https://aidsmo.org/aidmo-mining-studies/1924-aidsmo_mining_guiding_system_for_arab_countries_2026-4.html
  { name: 'mine-rehabilitation', driveId: '12HOhQlIrjFqFOfPaa9dXmGuyyzabK4ce' },
];
const output = path.resolve('public/latest-cover/previews');
const cache = path.resolve('.local/publication-pdfs');
await mkdir(output, { recursive: true });
await mkdir(cache, { recursive: true });
for (const publication of publications) {
  const cached = path.join(cache, `${publication.name}.pdf`);
  let bytes;
  try { bytes = await readFile(cached); } catch {
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${publication.driveId}`, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`${publication.name}: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error(`${publication.name}: download is not a PDF`);
    await writeFile(cached, bytes);
  }
  const task = getDocument({ data: new Uint8Array(bytes), disableFontFace: true, useSystemFonts: true,
    standardFontDataUrl: `${path.resolve('node_modules/pdfjs-dist/standard_fonts').replaceAll('\\', '/')}/`,
    cMapUrl: `${path.resolve('node_modules/pdfjs-dist/cmaps').replaceAll('\\', '/')}/`, cMapPacked: true,
  });
  const pdf = await task.promise;
  try {
    // Skip blank endpapers; retain the first two genuine interior pages.
    let saved = 0;
    for (let pageNumber = 2; pageNumber <= Math.min(pdf.numPages, 12) && saved < 2; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const text = await page.getTextContent();
      const characters = text.items.map(item => 'str' in item ? item.str : '').join(' ').trim();
      if (characters.length < 60) continue;
      const viewport = page.getViewport({ scale: 900 / page.getViewport({ scale: 1 }).width });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      await writeFile(path.join(output, `${publication.name}-${++saved}.webp`), await canvas.encode('webp', 90));
      console.log(`${publication.name}: preview ${saved} from PDF page ${pageNumber}`);
    }
    if (saved !== 2) throw new Error(`${publication.name}: could not find two readable pages`);
  } finally { await task.destroy(); }
}
