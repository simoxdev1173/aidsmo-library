export type DocumentFile = {
  path: string;
  title: string | null;
};

function cleanTitle(value: unknown) {
  if (typeof value !== 'string') return null;
  const title = value.trim();
  return title.length > 0 ? title : null;
}

function documentFileFromValue(value: unknown): DocumentFile | null {
  if (typeof value === 'string') {
    return value.startsWith('/uploads/') ? { path: value, title: null } : null;
  }

  if (!value || typeof value !== 'object') return null;

  const item = value as { path?: unknown; title?: unknown };
  if (typeof item.path !== 'string' || !item.path.startsWith('/uploads/')) {
    return null;
  }

  return {
    path: item.path,
    title: cleanTitle(item.title),
  };
}

export function documentFilesValue(value: unknown, fallback?: string | null): DocumentFile[] {
  const files = Array.isArray(value)
    ? value.map(documentFileFromValue).filter((item): item is DocumentFile => Boolean(item))
    : [];

  const uniqueFiles = files.filter((file, index, list) => {
    return list.findIndex((item) => item.path === file.path) === index;
  });

  if (uniqueFiles.length > 0) {
    return uniqueFiles;
  }

  return fallback && fallback.startsWith('/uploads/') ? [{ path: fallback, title: null }] : [];
}

export function documentFilePathsValue(value: unknown, fallback?: string | null) {
  return documentFilesValue(value, fallback).map((file) => file.path);
}

export function createDocumentFile(path: string, title?: unknown): DocumentFile | null {
  return documentFileFromValue({ path, title });
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
  return documentFilesValue(value, fallback)[0]?.path ?? null;
}
