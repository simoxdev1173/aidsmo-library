import { prisma } from '@/lib/prisma';

export const SEARCH_PAGE_SIZE = 9;

export function normalizeSearchQuery(value?: string) {
  return (value ?? '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

export function searchKeywords(query: string) {
  return Array.from(
    new Set(
      query
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8);
}

export async function searchPublishedEntries(queryValue: string, pageValue = 1) {
  const query = normalizeSearchQuery(queryValue);
  const keywords = searchKeywords(query);
  const requestedPage = Number.isFinite(pageValue) ? Math.max(1, Math.floor(pageValue)) : 1;

  if (query.length < 2 || keywords.length === 0) {
    return { query, keywords, entries: [], total: 0, page: 1, pageCount: 0 };
  }

  const where = {
    status: 'PUBLISHED' as const,
    AND: keywords.map((keyword) => ({
      OR: [
        { title: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
        { tag: { contains: keyword, mode: 'insensitive' as const } },
        { author: { contains: keyword, mode: 'insensitive' as const } },
        { publisher: { contains: keyword, mode: 'insensitive' as const } },
        { year: { contains: keyword, mode: 'insensitive' as const } },
        { language: { contains: keyword, mode: 'insensitive' as const } },
        { category: { name: { contains: keyword, mode: 'insensitive' as const } } },
      ],
    })),
  };

  const total = await prisma.libraryEntry.count({ where });
  const pageCount = Math.ceil(total / SEARCH_PAGE_SIZE);
  const page = pageCount > 0 ? Math.min(requestedPage, pageCount) : 1;
  const entries = await prisma.libraryEntry.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
    skip: (page - 1) * SEARCH_PAGE_SIZE,
    take: SEARCH_PAGE_SIZE,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      author: true,
      publisher: true,
      year: true,
      tag: true,
      entryType: true,
      coverImagePath: true,
      category: { select: { name: true } },
    },
  });

  return { query, keywords, entries, total, page, pageCount };
}
