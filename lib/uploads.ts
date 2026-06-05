import { randomUUID } from "crypto";
import { access, mkdir, writeFile } from "fs/promises";
import path from "path";

export function getUploadRoot() {
  const configured = process.env.UPLOAD_DIR;

  if (!configured) {
    return path.join(process.cwd(), "public", "uploads");
  }

  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}

export function getUploadRoots() {
  const roots = [
    getUploadRoot(),
    path.join(process.cwd(), "public", "uploads"),
    "/app/public/uploads",
    "/app/.next/standalone/public/uploads",
  ];

  return Array.from(new Set(roots.map((root) => path.resolve(root))));
}

export function publicUploadPathToFilePath(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return null;
  }

  const relativePath = filePath.replace(/^\/uploads\//, "");
  return path.join(getUploadRoot(), relativePath);
}

function safeUploadPath(rootPath: string, parts: string[]) {
  const root = path.resolve(rootPath);
  const requested = path.resolve(root, ...parts);

  if (requested !== root && requested.startsWith(`${root}${path.sep}`)) {
    return requested;
  }

  return null;
}

export async function resolvePublicUploadFilePath(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return null;
  }

  const parts = filePath.replace(/^\/uploads\//, "").split("/").filter(Boolean);

  for (const root of getUploadRoots()) {
    const candidate = safeUploadPath(root, parts);

    if (!candidate) {
      continue;
    }

    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keep checking known deployment roots.
    }
  }

  return null;
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

function validateUpload(file: File, folder: "covers" | "documents") {
  if (!allowedMimeTypes[folder].has(file.type)) {
    throw new Error(folder === "covers" ? "Unsupported cover image type." : "The document must be a PDF.");
  }

  if (file.size > maxFileSize[folder]) {
    throw new Error(folder === "covers" ? "Cover image must be 10MB or smaller." : "PDF must be 50MB or smaller.");
  }
}

export async function readUpload(file: File | null, folder: "covers" | "documents") {
  if (!file || file.size === 0) {
    return null;
  }

  validateUpload(file, folder);

  return {
    file,
    bytes: Buffer.from(await file.arrayBuffer()),
    extension: extensionFor(file),
  };
}

export async function saveUploadBytes(
  upload: Awaited<ReturnType<typeof readUpload>>,
  folder: "covers" | "documents",
) {
  if (!upload) {
    return null;
  }

  const directory = path.join(getUploadRoot(), folder);
  await mkdir(directory, { recursive: true });

  const filename = `${randomUUID()}.${upload.extension}`;
  await writeFile(path.join(directory, filename), upload.bytes);

  return `/uploads/${folder}/${filename}`;
}

export async function saveUpload(file: File | null, folder: "covers" | "documents") {
  return saveUploadBytes(await readUpload(file, folder), folder);
}
