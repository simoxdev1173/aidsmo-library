import "dotenv/config";
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { documentFilesValue } from "@/lib/document-files";
import { extractSampledPdfText, serializeExtractedPages, terminateDocumentOcr } from "@/lib/document-ai/pdf-extraction";
import { generateDocumentContent } from "@/lib/document-ai/providers";
import type { GenerationProvider, OcrMode } from "@/lib/document-ai/types";
import { downloadDriveFileBySourcePath, isGoogleDriveConfigured } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

type Options = {
  apply: boolean;
  force: boolean;
  fillDescriptions: boolean;
  provider: GenerationProvider;
  model?: string;
  ocr: OcrMode;
  entryId?: string;
  sourcePath?: string;
  limit?: number;
  delayMs: number;
};

function optionValue(argument: string, name: string) {
  return argument.startsWith(`${name}=`) ? argument.slice(name.length + 1).trim() : null;
}

function positiveInteger(value: string | null, name: string, allowZero = false) {
  if (value == null) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || (allowZero ? parsed < 0 : parsed < 1)) {
    throw new Error(`${name} must be ${allowZero ? "zero or " : ""}a positive integer.`);
  }
  return parsed;
}

function parseOptions(arguments_: string[]): Options & { help: boolean } {
  const providerValue = arguments_.map((arg) => optionValue(arg, "--provider")).find(Boolean) ?? "gemini";
  if (providerValue !== "gemini" && providerValue !== "ollama") {
    throw new Error("--provider must be gemini or ollama.");
  }
  const ocrValue = arguments_.map((arg) => optionValue(arg, "--ocr")).find(Boolean) ?? "auto";
  if (ocrValue !== "auto" && ocrValue !== "always" && ocrValue !== "off") {
    throw new Error("--ocr must be auto, always, or off.");
  }

  return {
    help: arguments_.includes("--help") || arguments_.includes("-h"),
    apply: arguments_.includes("--apply"),
    force: arguments_.includes("--force"),
    fillDescriptions: arguments_.includes("--fill-descriptions"),
    provider: providerValue,
    model: arguments_.map((arg) => optionValue(arg, "--model")).find(Boolean) ?? undefined,
    ocr: ocrValue,
    entryId: arguments_.map((arg) => optionValue(arg, "--entry-id")).find(Boolean) ?? undefined,
    sourcePath: arguments_.map((arg) => optionValue(arg, "--source-path")).find(Boolean) ?? undefined,
    limit: positiveInteger(arguments_.map((arg) => optionValue(arg, "--limit")).find(Boolean) ?? null, "--limit"),
    delayMs: positiveInteger(
      arguments_.map((arg) => optionValue(arg, "--delay-ms")).find(Boolean) ?? "1000",
      "--delay-ms",
      true,
    ) ?? 1_000,
  };
}

function printHelp() {
  console.log(`Arabic document analysis batch

Dry-run inventory (default):
  npm run documents:analyze

Process documents with Gemini's free tier:
  npm run documents:analyze -- --apply --provider=gemini --limit=10

Process entirely on the local machine with Ollama:
  npm run documents:analyze -- --apply --provider=ollama --model=qwen3:8b

Options:
  --apply                  Download, extract, call the model, and write results
  --provider=gemini|ollama Generation provider (default: gemini)
  --model=NAME             Override GEMINI_MODEL or OLLAMA_MODEL
  --ocr=auto|always|off    Local Arabic/English OCR policy (default: auto)
  --entry-id=ID            Process one LibraryEntry
  --source-path=/uploads/  Process one attached PDF
  --limit=N                Stop after N eligible PDFs
  --delay-ms=N             Delay between PDFs for quota pacing (default: 1000)
  --force                  Reprocess completed PDFs
  --fill-descriptions      Fill only empty entry descriptions from the primary PDF
  --help                   Show this message
`);
}

function desiredModel(options: Options) {
  if (options.model?.trim()) return options.model.trim();
  return options.provider === "ollama"
    ? process.env.OLLAMA_MODEL?.trim() || "qwen3:8b"
    : process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";
}

async function loadPdfBytes(sourcePath: string) {
  const localPath = await resolvePublicUploadFilePath(sourcePath);
  if (localPath) return { bytes: await readFile(localPath), storage: "local" as const };

  if (!isGoogleDriveConfigured()) {
    throw new Error(`PDF is not local and Google Drive is not configured: ${sourcePath}`);
  }
  const download = await downloadDriveFileBySourcePath(sourcePath);
  if (!download) throw new Error(`PDF was not found in Google Drive: ${sourcePath}`);
  if (!download.response.ok) {
    throw new Error(`Google Drive returned ${download.response.status} for ${sourcePath}`);
  }
  return {
    bytes: Buffer.from(await download.response.arrayBuffer()),
    storage: "google-drive" as const,
  };
}

function analysisMode(methods: Array<"pdf-text" | "ocr">) {
  const unique = new Set(methods);
  if (unique.size > 1) return "mixed";
  return unique.has("ocr") ? "ocr" : "pdf-text";
}

function safeError(error: unknown) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 2_000);
}

async function pause(milliseconds: number) {
  if (milliseconds <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const entries = await prisma.libraryEntry.findMany({
    where: options.entryId ? { id: options.entryId } : undefined,
    select: {
      id: true,
      title: true,
      description: true,
      filePath: true,
      documentFiles: true,
      documentAnalyses: {
        select: {
          sourcePath: true,
          status: true,
          sourceChecksum: true,
          provider: true,
          model: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });

  const documents = entries.flatMap((entry) => {
    const files = documentFilesValue(entry.documentFiles, entry.filePath);
    return files.map((file, fileIndex) => ({
      entry,
      file,
      fileIndex,
      existing: entry.documentAnalyses.find((analysis) => analysis.sourcePath === file.path) ?? null,
    }));
  }).filter((item) => !options.sourcePath || item.file.path === options.sourcePath);

  const completed = documents.filter((item) => item.existing?.status === "COMPLETED").length;
  const failed = documents.filter((item) => item.existing?.status === "FAILED").length;
  const eligible = documents.filter((item) => options.force || item.existing?.status !== "COMPLETED");
  const selected = options.limit ? eligible.slice(0, options.limit) : eligible;

  console.log("Document AI inventory");
  console.log("=====================");
  console.log(`Catalog entries matched: ${entries.length}`);
  console.log(`Attached PDFs matched: ${documents.length}`);
  console.log(`Already completed: ${completed}`);
  console.log(`Previously failed: ${failed}`);
  console.log(`Eligible this run: ${eligible.length}`);
  console.log(`Selected this run: ${selected.length}`);
  console.log(`Provider/model: ${options.provider}/${desiredModel(options)}`);
  console.log(`OCR policy: ${options.ocr}`);

  if (!options.apply) {
    console.log("\nDry run only. Add --apply to download PDFs, call the model, and write the database.");
    return;
  }

  let succeeded = 0;
  let failureCount = 0;

  for (const [index, item] of selected.entries()) {
    const label = `[${index + 1}/${selected.length}] ${item.entry.title} (${item.file.path})`;
    console.log(`\n${label}`);

    await prisma.documentAnalysis.upsert({
      where: { entryId_sourcePath: { entryId: item.entry.id, sourcePath: item.file.path } },
      create: {
        entryId: item.entry.id,
        sourcePath: item.file.path,
        sourceTitle: item.file.title,
        status: "PROCESSING",
        provider: options.provider,
        model: desiredModel(options),
      },
      update: {
        sourceTitle: item.file.title,
        status: "PROCESSING",
        provider: options.provider,
        model: desiredModel(options),
        error: null,
      },
    });

    try {
      console.log("  Loading PDF...");
      const loaded = await loadPdfBytes(item.file.path);
      const checksum = createHash("sha256").update(loaded.bytes).digest("hex");
      console.log(`  Loaded ${(loaded.bytes.length / 1024 / 1024).toFixed(1)} MB from ${loaded.storage}.`);

      console.log("  Extracting sampled pages...");
      const extraction = await extractSampledPdfText(
        loaded.bytes,
        options.ocr,
        (current, total, pageNumber, method) => {
          if (method === "ocr" || current === total || current % 10 === 0) {
            console.log(`  Page ${pageNumber} (${current}/${total}): ${method}`);
          }
        },
      );
      const extractedText = serializeExtractedPages(extraction.pages);
      if (extractedText.length < 200) {
        throw new Error("Fewer than 200 usable characters were extracted from the sampled pages.");
      }

      console.log(`  Generating Arabic summary and four Q&As from ${extraction.sampledPages.length} sampled pages...`);
      const generated = await generateDocumentContent({
        provider: options.provider,
        model: options.model,
        title: item.entry.title,
        sourceTitle: item.file.title,
        pages: extraction.pages,
      });

      await prisma.documentAnalysis.update({
        where: { entryId_sourcePath: { entryId: item.entry.id, sourcePath: item.file.path } },
        data: {
          status: "COMPLETED",
          summary: generated.summary,
          questions: generated.questions,
          extractedText,
          sampledPages: extraction.sampledPages,
          pageCount: extraction.pageCount,
          extractionMode: analysisMode(extraction.pages.map((page) => page.method)),
          provider: options.provider,
          model: generated.model,
          sourceChecksum: checksum,
          error: null,
          generatedAt: new Date(),
        },
      });

      if (options.fillDescriptions && item.fileIndex === 0 && !item.entry.description?.trim()) {
        await prisma.libraryEntry.update({
          where: { id: item.entry.id },
          data: { description: generated.summary },
        });
        console.log("  Filled the empty catalog description from the primary PDF summary.");
      }

      succeeded += 1;
      console.log("  Completed and saved.");
    } catch (error) {
      failureCount += 1;
      const message = safeError(error);
      console.error(`  FAILED: ${message}`);
      await prisma.documentAnalysis.update({
        where: { entryId_sourcePath: { entryId: item.entry.id, sourcePath: item.file.path } },
        data: { status: "FAILED", error: message },
      });
    }

    if (index < selected.length - 1) await pause(options.delayMs);
  }

  console.log("\nRun summary");
  console.log("===========");
  console.log(`Completed: ${succeeded}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`Remaining eligible before this run: ${Math.max(0, eligible.length - selected.length)}`);

  if (failureCount > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(safeError(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await terminateDocumentOcr();
    await prisma.$disconnect();
  });
