import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function ArabIndustryReportPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'arab-industry-report',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / الإحصاءات الصناعية',
        title: 'تقرير الصناعة العربية',
        description:
          'صفحة مخصصة لتقارير الصناعة العربية وما تتضمنه من مؤشرات وتحليلات عن أداء القطاع الصناعي في الدول العربية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
