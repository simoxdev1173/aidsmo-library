import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HiOutlineArchiveBox, HiOutlineArrowLeft, HiOutlineBookOpen, HiOutlineChevronLeft } from 'react-icons/hi2';
import { archivePages, type ArchivePagePath } from '@/lib/archive-pages';
import { getCategoryWithEntries } from '@/lib/library-data';
import { documentFilesValue } from '@/lib/document-files';

export default async function ArchiveEmptyPage({ path }: { path: ArchivePagePath }) {
  const page = archivePages[path];
  const isAgreementsPage = path === '/archive/org/agreements';
  const categorySlug = 'categorySlug' in page ? page.categorySlug : null;
  const categoryData = categorySlug ? await getCategoryWithEntries(categorySlug) : null;
  const entries = categoryData?.entries.filter((entry) => documentFilesValue(entry.documentFiles, entry.filePath).length > 0) ?? [];

  if (entries.length === 1) {
    redirect(`/book/${entries[0].slug}`);
  }

  const segments = path.split('/').filter(Boolean);
  const ancestors = segments.slice(0, -1).map((_, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}` as ArchivePagePath;
    return { href, title: archivePages[href].title };
  });

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative overflow-hidden border-b border-[#C29C41]/25 bg-[#071D2F] text-white">
        <Image src="/standardization-bg.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.94),rgba(3,105,161,0.64)_55%,rgba(7,29,47,0.86))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-36 sm:px-6 lg:px-8 lg:pb-16 lg:pt-40">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
            <Image src="/aidsmo-logo.png" alt="" width={30} height={30} className="h-7 w-7 object-contain" />
            <span className="font-display text-[0.65rem] font-bold tracking-[0.12em] text-[#E8C96A]">{page.group}</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-academic text-3xl font-bold leading-[1.4] sm:text-4xl lg:text-5xl">{page.title}</h1>
          {isAgreementsPage && (
            <p className="mt-4 max-w-3xl font-academic text-base leading-8 text-white/80 sm:text-lg">
              تصفح وثائق واتفاقيات إنشاء المنظمة واختر محتوى للاطلاع عليه.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="مسار الصفحة" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
          <Link href="/" className="transition-colors hover:text-[#0369A1]">الرئيسية</Link>
          <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
          {ancestors.map((ancestor) => (
            <span key={ancestor.href} className="inline-flex items-center gap-2">
              <Link href={ancestor.href} className="transition-colors hover:text-[#0369A1]">{ancestor.title}</Link>
              <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
            </span>
          ))}
          <span className="font-semibold text-[#0A2540]" aria-current="page">{page.title}</span>
        </nav>

        <section aria-label={`محتوى ${page.title}`} className={isAgreementsPage ? '' : 'overflow-hidden rounded-[18px] border border-[#DCE6EF] bg-white shadow-[0_12px_34px_rgba(10,37,64,0.055)]'}>
          {!isAgreementsPage && <div className="h-1.5 bg-gradient-to-l from-[#C29C41] via-[#E8C96A] to-[#0369A1]" aria-hidden="true" />}
          {entries.length > 1 ? (
            <div className={isAgreementsPage ? '' : 'p-5 sm:p-7 lg:p-8'}>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm leading-7 text-[#64748B]">{isAgreementsPage ? 'وثائق المنظمة واتفاقياتها متاحة للقراءة من خلال المكتبة الرقمية.' : 'تصفح الإصدارات والوثائق المتاحة ضمن هذا القسم.'}</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E3EE] bg-white px-4 py-2 text-sm font-bold text-[#475569] shadow-sm">
                  <HiOutlineBookOpen className="h-5 w-5 text-[#C29C41]" aria-hidden="true" />
                  {entries.length} {isAgreementsPage ? 'اتفاقية ووثيقة' : 'كتاب'}
                </span>
              </div>
              <div className={isAgreementsPage ? 'grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-4'}>
                {entries.map((entry) => (
                  <article key={entry.id} className={`group min-w-0 ${isAgreementsPage ? '' : 'text-center'}`}>
                    {isAgreementsPage ? (
                      <Link href={`/book/${entry.slug}`} className="flex h-full cursor-pointer flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-4" aria-label={`عرض محتوى ${entry.title}`}>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#EAF3F8] shadow-[0_14px_34px_rgba(10,37,64,0.14)] ring-1 ring-black/5 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_48px_rgba(10,37,64,0.20)] group-hover:ring-[#C29C41]/40 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                          {entry.coverImagePath ? (
                            <Image src={entry.coverImagePath} alt={entry.title} fill sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100" unoptimized />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(145deg,#E9F1F6,#B8D4E2_48%,#0A3650)] px-6 text-center font-academic text-xl font-bold leading-8 text-white">{entry.title}</div>
                          )}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#071D2F]/90 via-[#071D2F]/25 to-transparent" aria-hidden="true" />
                          <span className="absolute inset-x-3 bottom-3 z-20 block truncate text-start text-xs font-bold text-white drop-shadow">{entry.tag ?? entry.category.name}</span>
                        </div>
                        <div className="flex flex-1 flex-col pt-4">
                          <h2 className="line-clamp-2 min-h-12 text-[0.95rem] font-bold leading-[1.7] text-[#003652] transition-colors duration-200 group-hover:text-[#0369A1]">{entry.title}</h2>
                          {(entry.year || entry.pageCount) && <p className="mt-1.5 text-xs font-semibold text-[#7B8795]">{[entry.year, entry.pageCount ? `${entry.pageCount} صفحة` : null].filter(Boolean).join(' · ')}</p>}
                          <div className="mt-3">
                            <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#C29C41] bg-gradient-to-b from-[#F1DDA0] to-[#C29C41] px-4 py-2 text-xs font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_16px_rgba(194,156,65,0.2)] transition-all duration-300 group-hover:gap-3 group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-[#0369A1] group-focus-visible:ring-offset-2">
                              عرض المحتوى <HiOutlineArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <>
                    <Link href={`/book/${entry.slug}`} aria-label={`عرض محتوى ${entry.title}`} className="relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-[20px] border border-[#D9E3EE] bg-[#EAF1F6] shadow-[0_12px_30px_rgba(10,37,64,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,37,64,0.17)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C29C41]/55">
                      {entry.coverImagePath ? (
                        <Image src={entry.coverImagePath} alt={entry.title} fill sizes="(max-width: 639px) 90vw, (max-width: 1279px) 44vw, 23vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" unoptimized />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(145deg,#E9F1F6,#B8D4E2_48%,#0A3650)] px-6 text-center font-academic text-xl font-bold leading-8 text-white">{entry.title}</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071D2F]/95 via-[#071D2F]/65 to-transparent px-4 pb-4 pt-16 text-start">
                        <span className="line-clamp-2 text-xs font-bold leading-5 text-white">{entry.tag ?? entry.category.name}</span>
                      </div>
                    </Link>
                    <h2 className="mt-4 line-clamp-2 min-h-14 font-academic text-base font-bold leading-7 text-[#003652] transition-colors group-hover:text-[#0369A1]">{entry.title}</h2>
                    <Link href={`/book/${entry.slug}`} className="mt-3 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#C29C41] bg-gradient-to-b from-[#F6E8B5] to-[#D7B653] px-5 py-2 text-sm font-bold text-[#17354A] shadow-[0_5px_14px_rgba(194,156,65,0.2)] transition duration-200 hover:brightness-105 hover:shadow-[0_8px_18px_rgba(194,156,65,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0369A1] focus-visible:ring-offset-2">
                      عرض المحتوى <HiOutlineArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Link>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center sm:min-h-96">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C29C41]/30 bg-[#FBF7EA] text-[#9B7626]">
                <HiOutlineArchiveBox className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-academic text-xl font-bold text-[#003652]">المحتوى سيُضاف هنا لاحقاً</h2>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
