export const MAX_DOCUMENT_FILES = 7;

export function documentFilesValue(value: unknown, fallback?: string | null): string[] {
  const files = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.startsWith('/uploads/'))
    : [];

  if (files.length > 0) {
    return Array.from(new Set(files)).slice(0, MAX_DOCUMENT_FILES);
  }

  return fallback && fallback.startsWith('/uploads/') ? [fallback] : [];
}

export function parseDocumentFilesInput(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    return documentFilesValue(JSON.parse(value));
  } catch {
    return [];
  }
}

export function primaryDocumentFilePath(value: unknown, fallback?: string | null) {
  return documentFilesValue(value, fallback)[0] ?? null;
}
