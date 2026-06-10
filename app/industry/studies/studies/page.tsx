import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industry-studies-studies',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / الدراسات',
        title: 'الدراسات الصناعية',
        description:
          'مساحة للدراسات والتحليلات المرتبطة بالقطاع الصناعي، التكامل العربي، سلاسل القيمة، والقدرات الإنتاجية.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
