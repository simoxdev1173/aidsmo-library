import Image from 'next/image';
import Link from 'next/link';
import {
  LuArrowLeft,
  LuArrowRight,
  LuBookOpen,
  LuFileSearch,
  LuSearch,
} from 'react-icons/lu';
import { searchPublishedEntries } from '@/lib/search-data';

export const metadata = {
  title: 'البحث | المكتبة الرقمية الذكية',
  description: 'البحث في إصدارات ودراسات المكتبة الرقمية.',
};

export const dynamic = 'force-dynamic';

const ENTRY_TYPE_LABEL: Record<string, string> = {
  BOOK: 'كتاب',
  PAGE: 'صفحة معرفية',
  EVENT: 'فعالية',
  OTHER: 'وثيقة',
};

function safePage(value?: string) {
  const parsed = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
}

function pageHref(query: string, page: number) {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set('page', String(page));
  return `/search?${params.toString()}`;
}

function paginationItems(currentPage: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', pageCount];
  }

  if (currentPage >= pageCount - 3) {
    return [1, 'ellipsis', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', pageCount];
}

function Highlight({ text, keywords }: { text: string; keywords: string[] }) {
  if (!keywords.length) return text;

  const escaped = keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'giu'));
  const normalizedKeywords = new Set(keywords.map((keyword) => keyword.toLocaleLowerCase('ar')));

  return parts.map((part, index) =>
    normalizedKeywords.has(part.toLocaleLowerCase('ar')) ? (
      <mark key={`${part}-${index}`} className="rounded bg-[#F6E8B8] px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await searchPublishedEntries(params.q ?? '', safePage(params.page));
  const hasQuery = result.query.length >= 2;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pb-20 text-[#0A2540]">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#022A4E] to-[#034582] px-4 pb-10 pt-36 sm:px-6 sm:pb-14 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#E8C96A]">فهرس المكتبة</p>
          <h1 className="mt-2 font-academic text-3xl font-bold text-white sm:text-4xl">ابحث في المعرفة العربية</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B9DDF5] sm:text-base">
            استخدم كلمات تصف الموضوع أو المؤلف أو السنة أو القطاع. يجب أن يظهر كل لفظ كتبته في بيانات النتيجة.
          </p>

          <form action="/search" method="get" className="relative mt-7 max-w-3xl">
            <label htmlFor="catalog-search" className="sr-only">كلمات البحث</label>
            <input
              id="catalog-search"
              name="q"
              type="search"
              required
              minLength={2}
              maxLength={120}
              defaultValue={result.query}
              placeholder="مثال: الطاقة المتجددة 2025"
              className="h-14 w-full rounded-2xl border border-white/20 bg-white pe-14 ps-5 text-base font-semibold text-[#0A2540] shadow-[0_16px_40px_rgba(0,0,0,0.16)] outline-none transition placeholder:font-normal placeholder:text-[#94A3B8] focus:border-[#C29C41] focus:ring-4 focus:ring-[#C29C41]/20"
            />
            <button
              type="submit"
              aria-label="بحث"
              className="absolute end-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#0B4E84] text-white transition hover:bg-[#083C67] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
            >
              <LuSearch className="size-4.5" />
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {hasQuery ? (
          <>
            <div className="mb-7 flex flex-col gap-4 border-b border-[#0A2540]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0A2540]">
                  {result.total === 0 ? 'لا توجد نتائج' : `${result.total} نتيجة`}
                  <span className="font-normal text-[#64748B]"> لعبارة «{result.query}»</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="كلمات البحث">
                  {result.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full border border-[#C29C41]/35 bg-[#FFF8E8] px-3 py-1 text-xs font-bold text-[#8B681C]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              {result.pageCount > 1 && (
                <p className="text-xs font-semibold text-[#64748B]">الصفحة {result.page} من {result.pageCount}</p>
              )}
            </div>

            {result.entries.length ? (
              <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                {result.entries.map((entry) => {
                  const description = entry.description?.replace(/\s+/g, ' ').trim();
                  return (
                    <article key={entry.id} className="group relative h-full overflow-hidden rounded-2xl border border-[#0369A1]/10 bg-white shadow-[0_5px_22px_rgba(10,37,64,0.06)] transition hover:-translate-y-0.5 hover:border-[#C29C41]/35 hover:shadow-[0_16px_38px_rgba(10,37,64,0.11)] motion-reduce:transform-none">
                      <span className="absolute inset-y-0 start-0 w-1 bg-[#C29C41]" aria-hidden="true" />
                      <div className="flex min-h-48 gap-4 p-3 ps-4 sm:p-4 sm:ps-5">
                        <Link href={`/book/${entry.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-[#EAF2F8] ring-1 ring-black/5">
                          {entry.coverImagePath ? (
                            <Image src={entry.coverImagePath} alt={entry.title} fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                          ) : (
                            <span className="flex h-full items-center justify-center text-[#C29C41]"><LuBookOpen className="size-7" /></span>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col py-1">
                          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-bold">
                            <span className="rounded-full bg-[#F0F7FC] px-2.5 py-1 text-[#0369A1]">{entry.category.name}</span>
                            <span className="text-[#8B681C]">{ENTRY_TYPE_LABEL[entry.entryType] ?? 'إصدار'}</span>
                            {entry.year && <span className="text-[#64748B]">{entry.year}</span>}
                          </div>
                          <h2 className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-[#0A2540] sm:text-base">
                            <Link href={`/book/${entry.slug}`} className="transition hover:text-[#0369A1]">
                              <Highlight text={entry.title} keywords={result.keywords} />
                            </Link>
                          </h2>
                          <p className="mt-1 truncate text-xs text-[#64748B]">{entry.author ?? entry.publisher ?? 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين'}</p>
                          {description && (
                            <p className="mt-3 line-clamp-2 text-xs leading-6 text-[#64748B] sm:text-sm">
                              <Highlight text={description} keywords={result.keywords} />
                            </p>
                          )}
                          <Link href={`/book/${entry.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-bold text-[#0369A1] hover:text-[#8B681C]">
                            عرض الإصدار <LuArrowLeft className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#0369A1]/20 bg-white px-5 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#FFF8E8] text-[#C29C41]"><LuFileSearch className="size-6" /></span>
                <h2 className="mt-4 text-lg font-bold">لم نعثر على إصدار مطابق</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">استخدم كلمات أقل أو جرّب اسم المؤلف أو المجال دون علامات ترقيم.</p>
              </div>
            )}

            {result.pageCount > 1 && (
              <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="صفحات نتائج البحث">
                {result.page > 1 ? (
                  <Link href={pageHref(result.query, result.page - 1)} aria-label="الصفحة السابقة" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0369A1]/15 bg-white px-4 text-sm font-bold text-[#0369A1] transition hover:border-[#C29C41]/50 hover:bg-[#FFF8E8] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                    <LuArrowRight /> السابق
                  </Link>
                ) : null}

                <div dir="rtl" className="flex items-center gap-1.5" aria-label="أرقام الصفحات">
                  {paginationItems(result.page, result.pageCount).map((item, index) =>
                    item === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="flex size-10 items-center justify-center text-sm font-bold text-[#64748B]" aria-hidden="true">
                        …
                      </span>
                    ) : item === result.page ? (
                      <span key={item} aria-current="page" className="flex size-10 items-center justify-center rounded-full bg-[#0B4E84] text-sm font-bold text-white shadow-[0_6px_16px_rgba(11,78,132,0.2)]">
                        {item}
                      </span>
                    ) : (
                      <Link key={item} href={pageHref(result.query, item)} aria-label={`الصفحة ${item}`} className="flex size-10 items-center justify-center rounded-full border border-[#0369A1]/15 bg-white text-sm font-bold text-[#0A2540] transition hover:border-[#C29C41]/50 hover:bg-[#FFF8E8] hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                        {item}
                      </Link>
                    ),
                  )}
                </div>

                {result.page < result.pageCount ? (
                  <Link href={pageHref(result.query, result.page + 1)} aria-label="الصفحة التالية" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0369A1]/15 bg-white px-4 text-sm font-bold text-[#0369A1] transition hover:border-[#C29C41]/50 hover:bg-[#FFF8E8] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                    التالي <LuArrowLeft />
                  </Link>
                ) : null}
              </nav>
            )}
          </>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#0369A1]/20 bg-white px-5 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#F0F7FC] text-[#0369A1]"><LuSearch className="size-6" /></span>
            <h2 className="mt-4 text-lg font-bold">ابدأ بكلمتين واضحتين</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">ابحث باسم الإصدار أو المؤلف أو الموضوع أو السنة للوصول إلى المحتوى المنشور في قاعدة المكتبة.</p>
          </div>
        )}
      </section>
    </main>
  );
}
