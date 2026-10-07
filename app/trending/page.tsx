import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';
import { LuChevronLeft } from 'react-icons/lu';
import { getTrendingLibraryRows } from '@/lib/library-data';
import { TrendingTitlesGrid } from '@/app/ebook/components/TrendingCarousel';
import styles from '@/app/ebook/components/TrendingShelves.module.css';

export const metadata = {
  title: 'العناوين الرائجة | المكتبة الرقمية الذكية',
  description: 'تصفح جميع العناوين الرائجة في المكتبة الرقمية الذكية.',
};

export default async function TrendingPage() {
  const rows = await getTrendingLibraryRows(Number.MAX_SAFE_INTEGER);
  const items = rows.find((row) => row.id === 'trending')?.items ?? [];

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 text-[#0A2540]">
      <section className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12" aria-labelledby="trending-heading">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-[#C29C41]/30 pb-7">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-[#0A2540] text-[#F7E5A9]" aria-hidden="true">
              <FaBookOpen />
            </span>
            <h1 id="trending-heading" className="font-academic text-3xl font-bold">العناوين الرائجة</h1>
          </div>
          <Link href="/#shelf-trending" className={`${styles.viewAll} engraved brass-gradient`}>
            العودة إلى الرئيسية<LuChevronLeft aria-hidden="true" />
          </Link>
        </div>
        {items.length > 0 ? (
          <TrendingTitlesGrid items={items} />
        ) : (
          <p className="rounded-xl border border-[#C29C41]/30 bg-[#FFFCF4] px-6 py-12 text-center text-[#59616A]">
            لا توجد عناوين رائجة متاحة حاليًا.
          </p>
        )}
      </section>
    </main>
  );
}
