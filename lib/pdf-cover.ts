import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getUploadRoot, publicUploadPathToFilePath } from "@/lib/uploads";

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

export async function createPdfCoverFromFilePath(pdfFilePath: string) {
  const { createCanvas } = await import("@napi-rs/canvas");
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  GlobalWorkerOptions.workerSrc = "";

  const bytes = await readFile(pdfFilePath);
  const loadingTask = getDocument({
    data: new Uint8Array(bytes),
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

export async function createPdfCoverFromPublicPath(filePath: string | null | undefined) {
  const absoluteFilePath = publicUploadPathToFilePath(filePath);

  if (!absoluteFilePath) {
    return null;
  }

  return createPdfCoverFromFilePath(absoluteFilePath);
}
