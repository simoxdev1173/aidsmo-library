import type { DriveStoredFile } from "@/lib/google-drive";

export type DriveDocumentFile = DriveStoredFile & {
  title: string | null;
};

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function driveStoredFileFromValue(value: unknown): DriveStoredFile | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Record<string, unknown>;
  const fileId = cleanString(item.fileId);
  const path = cleanString(item.path);
  const sourcePath = cleanString(item.sourcePath);
  if (!fileId || !path || !sourcePath) return null;

  return {
    fileId,
    path,
    sourcePath,
    name: cleanString(item.name) ?? fileId,
    mimeType: cleanString(item.mimeType) ?? "application/octet-stream",
    size: typeof item.size === "number" && Number.isFinite(item.size) ? item.size : null,
    md5Checksum: cleanString(item.md5Checksum),
  };
}

export function driveStoredFilesValue(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map(driveStoredFileFromValue)
    .filter((file): file is DriveStoredFile => Boolean(file));
}

export function driveDocumentFilesValue(value: unknown): DriveDocumentFile[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const file = driveStoredFileFromValue(item);
    if (!file) return [];
    const title = item && typeof item === "object" ? cleanString((item as Record<string, unknown>).title) : null;
    return [{ ...file, title }];
  });
}

export function driveFileForSource(value: unknown, sourcePath: string) {
  return driveStoredFilesValue(value).find((file) => file.sourcePath === sourcePath) ?? null;
}
