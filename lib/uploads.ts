import { randomUUID } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { uploadBytesToDrive, type DriveFolder } from "@/lib/google-drive";

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

export type UploadFolder = DriveFolder;

const allowedMimeTypes: Record<UploadFolder, Set<string>> = {
  covers: new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  documents: new Set(["application/pdf"]),
  events: new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]),
};

const maxImageFileSize = 10 * 1024 * 1024;

const maxFileSize: Partial<Record<UploadFolder, number>> = {
  covers: maxImageFileSize,
  events: maxImageFileSize,
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

function isPdfUpload(file: File, bytes: Buffer) {
  const hasPdfMime = file.type === "application/pdf";
  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const hasPdfSignature = bytes.subarray(0, 5).toString("ascii") === "%PDF-";

  return hasPdfSignature && (hasPdfMime || hasPdfExtension || !file.type || file.type === "application/octet-stream");
}

function validateUpload(file: File, folder: UploadFolder, bytes: Buffer) {
  if (folder === "documents") {
    if (!isPdfUpload(file, bytes)) {
      throw new Error("يرجى اختيار ملف PDF صالح. تأكد من أن الملف يفتح بشكل طبيعي وأن امتداده PDF.");
    }
  } else if (!allowedMimeTypes[folder].has(file.type)) {
    throw new Error("نوع الصورة غير مدعوم. الصيغ المسموحة هي JPG أو PNG أو WebP أو AVIF.");
  }

  const maxSize = maxFileSize[folder];
  if (maxSize && file.size > maxSize) {
    throw new Error("حجم الصورة يتجاوز 10MB. يرجى ضغط الصورة أو اختيار صورة أصغر.");
  }
}

export async function readUpload(file: File | null, folder: UploadFolder) {
  if (!file || file.size === 0) {
    return null;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  validateUpload(file, folder, bytes);

  return {
    file,
    bytes,
    extension: folder === "documents" ? "pdf" : extensionFor(file),
  };
}

export async function saveUploadBytes(
  upload: Awaited<ReturnType<typeof readUpload>>,
  folder: UploadFolder,
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

export async function saveUpload(file: File | null, folder: UploadFolder) {
  return saveUploadBytes(await readUpload(file, folder), folder);
}

export async function saveUploadCopies(
  upload: Awaited<ReturnType<typeof readUpload>>,
  folder: UploadFolder,
) {
  const localPath = await saveUploadBytes(upload, folder);
  if (!upload || !localPath) {
    return { localPath: null, driveFile: null };
  }

  const driveFile = await uploadBytesToDrive({
    bytes: upload.bytes,
    folder,
    mimeType: upload.file.type || (folder === "documents" ? "application/pdf" : "application/octet-stream"),
    name: upload.file.name || path.basename(localPath),
    sourcePath: localPath,
  });

  return { localPath, driveFile };
}

function mimeTypeForUploadPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".pdf") return "application/pdf";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  return "image/jpeg";
}

export async function mirrorPublicUploadToDrive(filePath: string, folder: UploadFolder) {
  const absolutePath = await resolvePublicUploadFilePath(filePath);
  if (!absolutePath) {
    throw new Error(`Local backup file is missing: ${filePath}`);
  }

  return uploadBytesToDrive({
    bytes: await readFile(absolutePath),
    folder,
    mimeType: mimeTypeForUploadPath(filePath),
    name: path.basename(filePath),
    sourcePath: filePath,
  });
}
