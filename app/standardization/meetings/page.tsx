import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationMeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-meetings',
        eyebrow: 'التقييس / إجتماعات',
        title: 'إجتماعات التقييس',
        description:
          'مساحة للاجتماعات المرتبطة ببرامج التقييس والجودة والمطابقة، مع مدخلات منظمة تسهل الوصول إلى المواد والوثائق ذات الصلة.',
        accent: '#C29C41',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
