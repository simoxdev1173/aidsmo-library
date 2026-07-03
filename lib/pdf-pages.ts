import { readFile } from "fs/promises";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

type PdfDocument = {
  numPages: number;
  destroy?: () => Promise<void>;
  cleanup?: () => Promise<void>;
};

// Reading the number of pages only parses the PDF document structure (the page
// tree / xref), it does not render anything, so it stays fast even for large
// files. Any failure is swallowed and reported as null so a broken or unusual
// PDF never blocks saving an entry.
export async function countPdfPagesFromBytes(
  bytes: ArrayBuffer | Uint8Array | Buffer,
): Promise<number | null> {
  try {
    // Import the worker module before getDocument so the bundler (Turbopack)
    // includes it and PDF.js can resolve its worker. Without this, PDF.js falls
    // back to a "fake worker" whose dynamic import fails at runtime, which also
    // poisons later PDF.js calls in the same process (e.g. cover generation).
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = getDocument({
      data: new Uint8Array(bytes),
      disableFontFace: true,
      useSystemFonts: true,
    });
    const pdf = (await loadingTask.promise) as unknown as PdfDocument;

    try {
      return Number.isFinite(pdf.numPages) && pdf.numPages > 0 ? pdf.numPages : null;
    } finally {
      if (pdf.destroy) {
        await pdf.destroy();
      } else if (pdf.cleanup) {
        await pdf.cleanup();
      }
    }
  } catch (error) {
    console.error("PDF page count failed", error);
    return null;
  }
}

export async function countPdfPagesFromPublicPath(
  filePath: string | null | undefined,
): Promise<number | null> {
  const absolutePath = await resolvePublicUploadFilePath(filePath);
  if (!absolutePath) {
    return null;
  }

  try {
    return await countPdfPagesFromBytes(await readFile(absolutePath));
  } catch (error) {
    console.error("PDF page count from file failed", { filePath, error });
    return null;
  }
}
