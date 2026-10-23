'use client';

import { Children, type ReactNode, useState } from 'react';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

const PAGE_SIZE = 8;

export default function PaginatedDocumentGrid({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const items = Children.toArray(children);
  const { locale } = useAppLocale();
  const english = locale === 'en';
  const [requestedPage, setRequestedPage] = useState(1);
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(pageCount, 1));

  return (
    <>
      <div className={className}>{items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}</div>
      {pageCount > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label={english ? 'Document pages' : 'صفحات الوثائق'}>
          <button type="button" disabled={page === 1} onClick={() => setRequestedPage(page - 1)} className="min-h-10 rounded-full border border-[#D9E3EE] bg-white px-4 text-sm font-bold text-[#053D69] hover:border-[#C29C41] disabled:cursor-not-allowed disabled:opacity-40">
            {english ? 'Previous' : 'السابق'}
          </button>
          <span className="text-sm font-bold text-[#053D69]" aria-live="polite">{english ? `Page ${page} of ${pageCount}` : `الصفحة ${page} من ${pageCount}`}</span>
          <button type="button" disabled={page === pageCount} onClick={() => setRequestedPage(page + 1)} className="min-h-10 rounded-full border border-[#D9E3EE] bg-white px-4 text-sm font-bold text-[#053D69] hover:border-[#C29C41] disabled:cursor-not-allowed disabled:opacity-40">
            {english ? 'Next' : 'التالي'}
          </button>
        </nav>
      )}
    </>
  );
}
