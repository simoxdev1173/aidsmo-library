import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineArrowLeft, HiOutlineCalendarDays } from 'react-icons/hi2';
import { getCategoryWithEntries } from '@/lib/library-data';
import { TrainingHero } from '@/app/training/_components/TrainingShared';

export const dynamic = 'force-dynamic';

const PLAN_YEARS = ['2024', '2025', '2026'] as const;

export default async function TrainingPlanIndexPage() {
  const results = await Promise.all(PLAN_YEARS.map((year) => getCategoryWithEntries(`training-plan-${year}`)));

  if (results.every((result) => !result)) {
    notFound();
  }

  const years = PLAN_YEARS.map((year, index) => ({
    year,
    href: `/training/plan/${year}`,
    count: results[index]?.entries.length ?? 0,
  }));

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#0A2540]">
      <TrainingHero
        breadcrumb={[
          { label: 'التدريب والاستشارات', href: '/training/about' },
          { label: 'الخطة التدريبية', href: '/training/plan' },
        ]}
        badge="AIMTCI"
        title="الخطة التدريبية"
        subtitle="الدورات التدريبية التي ينظمها المعهد العربي للتدريب والاستشارات الصناعية والتعدينية، موزعة حسب السنة"
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {years.map(({ year, href, count }) => (
            <Link
              key={year}
              href={href}
              className="group relative overflow-hidden rounded-[18px] border border-[#C29C41]/25 bg-[#071D2F] p-7 text-white transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/55 hover:shadow-[0_26px_58px_rgba(10,37,64,0.24)]"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(232,201,106,0.16),transparent_42%)]"
                aria-hidden
              />
              <HiOutlineCalendarDays className="h-6 w-6 text-[#E8C96A]" />
              <p className="mt-4 font-academic text-4xl font-bold">{year}</p>
              <p className="mt-2 text-sm font-bold text-white/65">
                {count > 0 ? `${count} ${count === 1 ? 'دورة' : 'دورات'} تدريبية` : 'التفاصيل قريبا'}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#E8C96A] transition duration-300 group-hover:gap-3">
                عرض الخطة
                <HiOutlineArrowLeft className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
