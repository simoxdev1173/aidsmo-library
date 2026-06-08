import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationWorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-workshops',
        eyebrow: 'التقييس / ورش ودورات',
        title: 'ورش ودورات التقييس',
        description:
          'مساحة لورش العمل والدورات التدريبية المرتبطة بالمواصفات والجودة والمطابقة، مع مواد معرفية تدعم بناء القدرات الفنية والمؤسسية.',
        accent: '#C29C41',
        heroImage: '/trendingSection/t-2.jpg',
      }}
    />
  );
}
