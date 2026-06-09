import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationTrainingCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-training-courses',
        eyebrow: 'التقييس / دورات تدريبية',
        title: 'دورات تدريبية في التقييس',
        description:
          'مساحة للدورات التدريبية المرتبطة بالمواصفات والجودة والمطابقة، مع مواد معرفية تساعد على تطوير القدرات الفنية والمؤسسية.',
        accent: '#C29C41',
        heroImage: '/trendingSection/t-2.jpg',
      }}
    />
  );
}
