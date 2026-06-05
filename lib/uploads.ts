import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export function getUploadRoot() {
  const configured = process.env.UPLOAD_DIR;

  if (!configured) {
    return path.join(process.cwd(), "public", "uploads");
  }

  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}

export function publicUploadPathToFilePath(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return null;
  }

  const relativePath = filePath.replace(/^\/uploads\//, "");
  return path.join(getUploadRoot(), relativePath);
}

const allowedMimeTypes = {
  covers: new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  documents: new Set(["application/pdf"]),
};

const maxFileSize = {
  covers: 10 * 1024 * 1024,
  documents: 50 * 1024 * 1024,
};

function extensionFor(file: File) {
  const original = file.name.split(".").pop()?.toLowerCase();
  if (original && /^[a-z0-9]+$/.test(original)) {
    return original;
  }

  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/avif") return "avif";
  return "jpg";
}

export async function saveUpload(file: File | null, folder: "covers" | "documents") {
  if (!file || file.size === 0) {
    return null;
  }

  if (!allowedMimeTypes[folder].has(file.type)) {
    throw new Error(folder === "covers" ? "Unsupported cover image type." : "The document must be a PDF.");
  }

  if (file.size > maxFileSize[folder]) {
    throw new Error(folder === "covers" ? "Cover image must be 10MB or smaller." : "PDF must be 50MB or smaller.");
  }

  const directory = path.join(getUploadRoot(), folder);
  await mkdir(directory, { recursive: true });

  const filename = `${randomUUID()}.${extensionFor(file)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, filename), bytes);

  return `/uploads/${folder}/${filename}`;
}
