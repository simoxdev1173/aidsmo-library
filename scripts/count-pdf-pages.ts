import "dotenv/config";
import { readFile } from "fs/promises";
import { documentFilesValue } from "@/lib/document-files";
import { prisma } from "@/lib/prisma";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

type PdfDocument = {
  numPages: number;
  destroy?: () => Promise<void>;
  cleanup?: () => Promise<void>;
};

type FileResult = {
  entryId: string;
  title: string;
  publicPath: string;
  absolutePath: string | null;
  pages: number | null;
  error: string | null;
};

async function readPdfPageCount(absolutePath: string) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const bytes = await readFile(absolutePath);
  const loadingTask = getDocument({
    data: new Uint8Array(bytes),
    disableFontFace: true,
    useSystemFonts: true,
  });
  const pdf = (await loadingTask.promise) as unknown as PdfDocument;

  try {
    return pdf.numPages;
  } finally {
    if (pdf.destroy) {
      await pdf.destroy();
    } else if (pdf.cleanup) {
      await pdf.cleanup();
    }
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function resultKey(result: Pick<FileResult, "publicPath">) {
  return result.publicPath;
}

async function main() {
  const entries = await prisma.libraryEntry.findMany({
    select: {
      id: true,
      title: true,
      filePath: true,
      documentFiles: true,
      pageCount: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const files = entries.flatMap((entry) =>
    documentFilesValue(entry.documentFiles, entry.filePath).map((file) => ({
      entryId: entry.id,
      title: entry.title,
      publicPath: file.path,
      manualPageCount: entry.pageCount,
    })),
  );

  const manualEntries = entries.filter((entry) => entry.pageCount !== null);
  const manualTotalPages = manualEntries.reduce((sum, entry) => sum + (entry.pageCount ?? 0), 0);
  const uniqueFiles = Array.from(new Map(files.map((file) => [file.publicPath, file])).values());
  const results: FileResult[] = [];

  for (const [index, file] of uniqueFiles.entries()) {
    const absolutePath = await resolvePublicUploadFilePath(file.publicPath);

    if (!absolutePath) {
      results.push({
        entryId: file.entryId,
        title: file.title,
        publicPath: file.publicPath,
        absolutePath: null,
        pages: null,
        error: "File was not found in the configured upload roots.",
      });
      continue;
    }

    try {
      results.push({
        entryId: file.entryId,
        title: file.title,
        publicPath: file.publicPath,
        absolutePath,
        pages: await readPdfPageCount(absolutePath),
        error: null,
      });
    } catch (error) {
      results.push({
        entryId: file.entryId,
        title: file.title,
        publicPath: file.publicPath,
        absolutePath,
        pages: null,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if ((index + 1) % 25 === 0) {
      console.log(`Scanned ${index + 1}/${uniqueFiles.length} unique PDF path(s)...`);
    }
  }

  const pagesByPath = new Map(results.map((item) => [resultKey(item), item.pages]));
  const totalPagesUniqueFiles = results.reduce((sum, item) => sum + (item.pages ?? 0), 0);
  const totalPagesByEntryReferences = files.reduce((sum, file) => sum + (pagesByPath.get(file.publicPath) ?? 0), 0);
  const failed = results.filter((item) => item.error);
  const parsed = results.length - failed.length;

  console.log("");
  console.log("PDF page count report");
  console.log("=====================");
  console.log(`Database entries: ${formatNumber(entries.length)}`);
  console.log(`Entries with PDF files: ${formatNumber(new Set(files.map((file) => file.entryId)).size)}`);
  console.log(`PDF file references from entries: ${formatNumber(files.length)}`);
  console.log(`Unique PDF paths scanned: ${formatNumber(uniqueFiles.length)}`);
  console.log(`Successfully parsed PDFs: ${formatNumber(parsed)}`);
  console.log(`Missing or unreadable PDFs: ${formatNumber(failed.length)}`);
  console.log(`Total pages from unique PDFs: ${formatNumber(totalPagesUniqueFiles)}`);
  console.log(`Total pages counting every entry file reference: ${formatNumber(totalPagesByEntryReferences)}`);
  console.log(`Manual database pageCount total: ${formatNumber(manualTotalPages)} from ${formatNumber(manualEntries.length)} entrie(s)`);

  if (failed.length > 0) {
    console.log("");
    console.log("Missing or unreadable PDFs");
    console.log("--------------------------");

    for (const item of failed) {
      console.log(`- ${item.title} (${item.publicPath}): ${item.error}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
