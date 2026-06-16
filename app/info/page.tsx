import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: [
          'industrial-info',
          'industrial-statistics',
          'arab-industry-report',
          'indicators-booklet',
          'statistics-bulletin',
          'infographics',
          'conferences',
          'industrial-development-magazine',
          'newsletter',
          'newsletter-2024',
          'newsletter-2025',
          'newsletter-2026',
          'publications',
        ],
        resetHref: '/info',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية',
        title: 'مكتبة المعلومات الصناعية',
        description:
          'مدخل موحد للإحصاءات الصناعية، التقارير، المؤشرات، النشرات، الإنفوجرافيك، والمؤتمرات والإصدارات المرتبطة بالمعلومات الصناعية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
