'use client';

// Client-side PDF page counting. Runs entirely in the browser using PDF.js with
// its worker served as a static asset from /public (see scripts/copy-pdf-worker.mjs).
// Everything here is defensive: it never throws for an unreadable file, it
// returns a typed result instead, so a bad PDF can never crash the React tree or
// surface the Next.js error overlay.

const PDF_WORKER_SRC = '/pdf.worker.min.mjs';

type LoadedPdf = {
  numPages: number;
  destroy: () => Promise<void>;
};

type PdfModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (args: { data: Uint8Array; disableFontFace?: boolean; useSystemFonts?: boolean }) => {
    promise: Promise<unknown>;
    destroy: () => Promise<void>;
  };
};

let modulePromise: Promise<PdfModule> | null = null;

// Load PDF.js lazily and only in the browser, so it is code-split away from the
// initial bundle and never evaluated during server rendering (it touches DOM
// globals that do not exist on the server).
async function loadPdfModule(): Promise<PdfModule> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js is only available in the browser.');
  }

  if (!modulePromise) {
    modulePromise = (async () => {
      const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as unknown as PdfModule;
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
      return pdfjs;
    })().catch((error) => {
      // Reset so a transient failure (e.g. worker not yet copied) can be retried.
      modulePromise = null;
      throw error;
    });
  }

  return modulePromise;
}

export type PageCountResult =
  | { ok: true; pages: number }
  | { ok: false; error: string };

async function countPdfPagesFromBytes(bytes: Uint8Array, label: string): Promise<PageCountResult> {
  const pdfjs = await loadPdfModule();
  const loadingTask = pdfjs.getDocument({ data: bytes, disableFontFace: true, useSystemFonts: true });

  let pdf: LoadedPdf | null = null;
  try {
    pdf = (await loadingTask.promise) as LoadedPdf;
    const pages = pdf.numPages;

    if (!Number.isFinite(pages) || pages <= 0) {
      return { ok: false, error: `تعذر قراءة عدد صفحات الملف "${label}".` };
    }

    return { ok: true, pages };
  } finally {
    try {
      if (pdf) {
        await pdf.destroy();
      } else {
        await loadingTask.destroy();
      }
    } catch {
      // Ignore cleanup failures.
    }
  }
}

export async function countPdfPagesFromFile(file: File): Promise<PageCountResult> {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return await countPdfPagesFromBytes(bytes, file.name);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('Client PDF page count failed', { fileName: file.name, detail });
    return { ok: false, error: `تعذر تحليل الملف "${file.name}". تأكد أنه ملف PDF سليم.` };
  }
}

export async function countPdfPagesFromUrl(url: string): Promise<PageCountResult> {
  const label = url.split('/').pop() || url;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { ok: false, error: `تعذر تحميل الملف "${label}" لحساب صفحاته.` };
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    return await countPdfPagesFromBytes(bytes, label);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('Client PDF page count from URL failed', { url, detail });
    return { ok: false, error: `تعذر تحليل الملف "${label}".` };
  }
}
