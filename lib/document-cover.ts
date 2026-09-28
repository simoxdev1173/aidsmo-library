import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { downloadDriveFileBySourcePath, isGoogleDriveConfigured } from "@/lib/google-drive";
import { createPdfCoverFromBytes } from "@/lib/pdf-cover";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

const execFileAsync = promisify(execFile);
const officeExtensions = new Set([".doc", ".docx", ".ppt", ".pptx"]);

async function officePdf(bytes: Uint8Array, extension: string) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "aidsmo-cover-"));
  const input = path.join(directory, `document${extension}`);
  const output = path.join(directory, "document.pdf");
  const profile = path.join(directory, "profile");

  try {
    await writeFile(input, bytes);
    try {
      await execFileAsync("soffice", [
        `-env:UserInstallation=file://${profile.replace(/\\/g, "/")}`,
        "--headless", "--convert-to", "pdf", "--outdir", directory, input,
      ], { timeout: 120_000, maxBuffer: 1024 * 1024 });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error("LibreOffice (soffice) is required to render Word/PowerPoint covers.");
      }
      throw error;
    }
    return await readFile(output);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export async function createDocumentCoverFromPublicPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension && extension !== ".pdf" && !officeExtensions.has(extension)) return null;

  const localPath = await resolvePublicUploadFilePath(filePath);
  let bytes: Uint8Array;
  if (localPath) {
    bytes = await readFile(localPath);
  } else if (isGoogleDriveConfigured()) {
    const download = await downloadDriveFileBySourcePath(filePath);
    if (!download) return null;
    bytes = new Uint8Array(await download.response.arrayBuffer());
  } else {
    return null;
  }

  const isPdf = Buffer.from(bytes.subarray(0, 5)).toString("ascii") === "%PDF-";
  if (!isPdf && !officeExtensions.has(extension)) return null;
  const pdfBytes = isPdf ? bytes : await officePdf(bytes, extension);
  return createPdfCoverFromBytes(pdfBytes);
}
