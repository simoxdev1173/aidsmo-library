import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialStatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: [
          'industrial-statistics',
          'arab-industry-report',
          'indicators-booklet',
          'statistics-bulletin',
          'infographics',
        ],
        resetHref: '/info/statistics',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / الإحصاءات الصناعية',
        title: 'الإحصاءات الصناعية',
        description:
          'مساحة للإحصاءات والتقارير والمؤشرات التي تساعد على متابعة واقع الصناعة العربية وتحليل اتجاهاتها.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
