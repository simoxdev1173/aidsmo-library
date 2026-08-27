// Sampling policy requested for the library corpus: the opening 20 pages,
// every 100th page, and the closing 20 pages. A Set keeps short documents and
// boundary pages from being processed twice.
export function selectSamplePages(pageCount: number) {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(`Invalid PDF page count: ${pageCount}`);
  }

  const pages = new Set<number>();
  const openingEnd = Math.min(20, pageCount);
  for (let page = 1; page <= openingEnd; page += 1) pages.add(page);

  for (let page = 100; page <= pageCount; page += 100) pages.add(page);

  const closingStart = Math.max(1, pageCount - 19);
  for (let page = closingStart; page <= pageCount; page += 1) pages.add(page);

  return [...pages].sort((left, right) => left - right);
}
