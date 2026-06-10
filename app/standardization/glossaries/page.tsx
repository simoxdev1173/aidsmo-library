import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationGlossariesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-glossaries',
        eyebrow: 'التقييس / معاجم',
        title: 'معاجم ومصطلحات التقييس',
        description:
          'فهارس لغوية ومراجع مصطلحية تساعد الباحثين والمهنيين على توحيد المفاهيم الفنية المرتبطة بالمواصفات والجودة والاعتماد.',
        accent: '#C29C41',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
