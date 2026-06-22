import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndicatorsBookletPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'indicators-booklet',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية',
        title: 'كتيب المؤشرات الاقتصادية و الصناعية في الدول العربية',
        description:
          'مجموعة منظمة من المؤشرات الاقتصادية والصناعية التي تدعم المقارنة والمتابعة وتحليل تطور الصناعة العربية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
