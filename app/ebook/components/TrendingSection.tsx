import { getTrendingLibraryRows } from '@/lib/library-data';
import LibraryCarouselRow from './TrendingCarousel';

export default async function TrendingBooks() {
  const libraryRows = await getTrendingLibraryRows();

  if (libraryRows.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-[#F7F0E1] py-16 md:py-24" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.92)_0%,rgba(247,240,225,0.82)_42%,rgba(255,252,244,0.94)_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="academic-heading text-4xl leading-tight md:text-5xl">
            رائج في المكتبة الرقمية
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
            رفوف متحركة تجمع العناوين الأكثر طلبا حسب قطاعات المكتبة الرئيسية، مع بطاقات كتب أكثر عمقا وسلاسة.
          </p>
        </div>

        <div className="space-y-0">
          {libraryRows.map((row) => (
            <LibraryCarouselRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
