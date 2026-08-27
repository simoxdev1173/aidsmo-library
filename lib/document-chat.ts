export type StoredDocumentQuestion = {
  question: string;
  answer: string;
  sourcePages: number[];
};

export type DocumentChatContext = {
  title: string;
  sourcePath: string;
  questions: StoredDocumentQuestion[];
};

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function documentQuestionsValue(value: unknown): StoredDocumentQuestion[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const item = raw as Record<string, unknown>;
    const question = cleanString(item.question);
    const answer = cleanString(item.answer);
    const sourcePages = Array.isArray(item.sourcePages)
      ? [...new Set(item.sourcePages.filter((page): page is number => Number.isInteger(page) && page > 0))]
      : [];

    return question && answer ? [{ question, answer, sourcePages }] : [];
  }).slice(0, 4);
}

export function documentChatContextValue(value: unknown): DocumentChatContext | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const title = cleanString(item.title);
  const sourcePath = cleanString(item.sourcePath);
  const questions = documentQuestionsValue(item.questions);

  if (!title || !sourcePath.startsWith('/uploads/') || questions.length === 0) return null;
  return { title, sourcePath, questions };
}
