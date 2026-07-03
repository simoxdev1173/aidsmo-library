// Copies the PDF.js web worker from the installed package into /public so the
// browser can load it as a static asset (no CDN, no bundler worker plumbing).
// Runs on postinstall so the worker file always matches the installed
// pdfjs-dist version and can never drift out of sync.
import { copyFile, mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs");
const destination = resolve(projectRoot, "public/pdf.worker.min.mjs");

try {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  console.log(`Copied PDF.js worker -> ${destination}`);
} catch (error) {
  // Do not fail the install if pdfjs-dist is not present yet; the app degrades
  // gracefully (page counting just falls back to manual entry).
  console.warn("Could not copy PDF.js worker:", error instanceof Error ? error.message : error);
}
