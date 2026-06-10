import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-studies',
        eyebrow: 'التقييس / دراسات',
        title: 'دراسات التقييس والجودة',
        description:
          'مساحة منظمة للدراسات والتحليلات التي تتناول المواصفات، المطابقة، البنية التحتية للجودة، وتطوير منظومات القياس والاعتماد في الدول العربية.',
        accent: '#0369A1',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
