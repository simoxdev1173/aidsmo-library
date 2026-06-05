import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getUploadRoot, resolvePublicUploadFilePath } from "@/lib/uploads";

type PdfPageViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport(args: { scale: number }): PdfPageViewport;
  render(args: { canvasContext: unknown; viewport: PdfPageViewport }): { promise: Promise<void> };
};

type PdfDocument = {
  getPage(pageNumber: number): Promise<PdfPage>;
  destroy?: () => Promise<void>;
  cleanup?: () => Promise<void>;
};

function coverFilename() {
  return `${randomUUID()}.png`;
}

async function renderPdfCover(bytes: Uint8Array) {
  let createCanvas: typeof import("@napi-rs/canvas").createCanvas;

  try {
    ({ createCanvas } = await import("@napi-rs/canvas"));
  } catch (error) {
    console.error("PDF cover canvas import failed", {
      platform: process.platform,
      arch: process.arch,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = getDocument({
    data: bytes,
    disableFontFace: true,
    useSystemFonts: true,
  });

  const pdf = (await loadingTask.promise) as unknown as PdfDocument;

  try {
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = 900;
    const scale = Math.min(2.2, targetWidth / baseViewport.width);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const directory = path.join(getUploadRoot(), "covers");
    await mkdir(directory, { recursive: true });

    const filename = coverFilename();
    await writeFile(path.join(directory, filename), await canvas.encode("png"));

    return `/uploads/covers/${filename}`;
  } finally {
    if (pdf.destroy) {
      await pdf.destroy();
    } else if (pdf.cleanup) {
      await pdf.cleanup();
    }
  }
}

export async function createPdfCoverFromBytes(bytes: ArrayBuffer | Uint8Array | Buffer) {
  return renderPdfCover(new Uint8Array(bytes));
}

export async function createPdfCoverFromFile(file: File | null | undefined) {
  if (!file || file.size === 0 || file.type !== "application/pdf") {
    return null;
  }

  return createPdfCoverFromBytes(await file.arrayBuffer());
}

export async function createPdfCoverFromFilePath(pdfFilePath: string) {
  return renderPdfCover(new Uint8Array(await readFile(pdfFilePath)));
}

export async function createPdfCoverFromPublicPath(filePath: string | null | undefined) {
  const absoluteFilePath = await resolvePublicUploadFilePath(filePath);

  if (!absoluteFilePath) {
    return null;
  }

  return createPdfCoverFromFilePath(absoluteFilePath);
}
