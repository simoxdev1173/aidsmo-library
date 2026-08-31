import { mkdir } from "fs/promises";
import path from "path";
import type { Worker } from "tesseract.js";
import { selectSamplePages } from "@/lib/document-ai/sampling";
import type { ExtractedDocumentPage, OcrMode } from "@/lib/document-ai/types";

type PdfTextItem = {
  str?: string;
  hasEOL?: boolean;
};

type PdfPage = {
  getTextContent(): Promise<{ items: unknown[] }>;
  getViewport(args: { scale: number }): { width: number; height: number };
  render(args: { canvasContext: unknown; viewport: unknown }): { promise: Promise<void> };
  cleanup?: () => void;
};

type PdfDocument = {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPage>;
  destroy?: () => Promise<void>;
  cleanup?: () => Promise<void>;
};

let ocrWorkerPromise: Promise<Worker> | null = null;

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function usefulCharacterCount(value: string) {
  return (value.match(/[\p{L}\p{N}]/gu) ?? []).length;
}

function hasUsefulText(value: string) {
  return usefulCharacterCount(value) >= 80;
}

function getPdfJsWasmUrl() {
  // PDF.js expects a trailing forward slash even when running on Windows.
  // Its Node binary-data loader then appends files such as `jbig2.wasm`.
  const wasmDirectory = path.join(process.cwd(), "node_modules", "pdfjs-dist", "wasm");
  return `${wasmDirectory.replaceAll("\\", "/")}/`;
}

async function getOcrWorker() {
  if (ocrWorkerPromise) return ocrWorkerPromise;

  ocrWorkerPromise = (async () => {
    const { createWorker } = await import("tesseract.js");
    const cachePath = process.env.TESSERACT_CACHE_PATH?.trim()
      || path.join(process.cwd(), ".cache", "tesseract");
    await mkdir(cachePath, { recursive: true });

    return createWorker(["ara", "eng"], undefined, {
      cachePath,
      ...(process.env.TESSERACT_LANG_PATH?.trim()
        ? { langPath: process.env.TESSERACT_LANG_PATH.trim() }
        : {}),
    });
  })();

  try {
    return await ocrWorkerPromise;
  } catch (error) {
    ocrWorkerPromise = null;
    throw error;
  }
}

async function extractTextLayer(page: PdfPage) {
  const content = await page.getTextContent();
  let text = "";

  for (const rawItem of content.items) {
    const item = rawItem as PdfTextItem;
    if (typeof item.str !== "string" || !item.str) continue;
    text += item.str;
    text += item.hasEOL ? "\n" : " ";
  }

  return normalizeText(text);
}

async function ocrPage(page: PdfPage) {
  const { createCanvas } = await import("@napi-rs/canvas");
  const baseViewport = page.getViewport({ scale: 1 });
  const targetWidth = 1800;
  const scale = Math.min(3, Math.max(1.5, targetWidth / baseViewport.width));
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;

  const worker = await getOcrWorker();
  const result = await worker.recognize(await canvas.encode("png"));
  return normalizeText(result.data.text);
}

export async function extractSampledPdfText(
  input: Uint8Array,
  ocrMode: OcrMode = "auto",
  onPage?: (current: number, total: number, pageNumber: number, method: "pdf-text" | "ocr") => void,
) {
  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = getDocument({
    data: new Uint8Array(input),
    disableFontFace: true,
    useSystemFonts: true,
    wasmUrl: getPdfJsWasmUrl(),
  });
  const pdf = (await loadingTask.promise) as unknown as PdfDocument;

  try {
    const sampledPages = selectSamplePages(pdf.numPages);
    const textLayerPages: Array<{ pageNumber: number; text: string }> = [];

    for (const pageNumber of sampledPages) {
      const page = await pdf.getPage(pageNumber);
      try {
        textLayerPages.push({ pageNumber, text: await extractTextLayer(page) });
      } finally {
        page.cleanup?.();
      }
    }

    const usefulPages = textLayerPages.filter((page) => hasUsefulText(page.text)).length;
    const usefulTotal = textLayerPages.reduce((sum, page) => sum + usefulCharacterCount(page.text), 0);
    const looksScanned = usefulPages / textLayerPages.length < 0.3 || usefulTotal < 1_000;
    const shouldOcrSparsePages = ocrMode === "always" || (ocrMode === "auto" && looksScanned);
    const pages: ExtractedDocumentPage[] = [];

    for (const [index, extracted] of textLayerPages.entries()) {
      if (hasUsefulText(extracted.text) || !shouldOcrSparsePages) {
        pages.push({ ...extracted, method: "pdf-text" });
        onPage?.(index + 1, sampledPages.length, extracted.pageNumber, "pdf-text");
        continue;
      }

      const page = await pdf.getPage(extracted.pageNumber);
      try {
        const ocrText = await ocrPage(page);
        pages.push({
          pageNumber: extracted.pageNumber,
          text: ocrText || extracted.text,
          method: ocrText ? "ocr" : "pdf-text",
        });
        onPage?.(index + 1, sampledPages.length, extracted.pageNumber, ocrText ? "ocr" : "pdf-text");
      } finally {
        page.cleanup?.();
      }
    }

    return { pageCount: pdf.numPages, sampledPages, pages };
  } finally {
    if (pdf.destroy) await pdf.destroy();
    else await pdf.cleanup?.();
  }
}

export function serializeExtractedPages(pages: ExtractedDocumentPage[]) {
  return pages
    .filter((page) => page.text.trim())
    .map((page) => `[PAGE ${page.pageNumber}]\n${page.text}`)
    .join("\n\n");
}

export async function terminateDocumentOcr() {
  if (!ocrWorkerPromise) return;
  const worker = await ocrWorkerPromise.catch(() => null);
  ocrWorkerPromise = null;
  await worker?.terminate();
}
