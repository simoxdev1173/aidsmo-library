import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialConferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'conferences',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / مؤتمرات وندوات',
        title: 'مؤتمرات وندوات المعلومات الصناعية',
        description:
          'صفحة للفعاليات والمؤتمرات والندوات المرتبطة بالمعلومات الصناعية والإحصاءات وقضايا التنمية الصناعية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
