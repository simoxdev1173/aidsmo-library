import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryWithEntries } from '@/lib/library-data';
import { PlanEntryRow, TrainingHero } from '@/app/training/_components/TrainingShared';

export const dynamic = 'force-dynamic';

export default async function TrainingPlanYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const data = await getCategoryWithEntries(`training-plan-${year}`);

  if (!data) {
    notFound();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#0A2540]">
      <TrainingHero
        breadcrumb={[
          { label: 'التدريب والاستشارات', href: '/training/about' },
          { label: 'الخطة التدريبية', href: '/training/plan' },
          { label: year, href: `/training/plan/${year}` },
        ]}
        badge="AIMTCI"
        title={`الخطة التدريبية ${year}`}
        subtitle={`${data.entries.length} ${data.entries.length === 1 ? 'دورة تدريبية' : 'دورات تدريبية'} ينظمها المعهد خلال عام ${year}`}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {data.entries.length > 0 ? (
          <div className="flex flex-col gap-10">
            {data.entries.map((entry) => (
              <PlanEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="grid overflow-hidden rounded-[18px] border border-[#D9E3EE] bg-white lg:grid-cols-[1fr_360px]">
            <div className="p-8">
              <p className="text-xs font-bold text-[#C29C41]">لا توجد دورات منشورة بعد</p>
              <h2 className="mt-3 text-3xl font-bold text-[#003652]">الخطة التدريبية لعام {year} قيد الإعداد</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#64748B]">
                عند نشر الدورات التدريبية لهذا العام ستظهر هنا مع الغلاف والعنوان ورابط الملف.
              </p>
            </div>
            <div className="relative min-h-72 bg-[#EAF3F8]">
              <Image src="/services-bg.png" alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D2F]/58 to-transparent" />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
