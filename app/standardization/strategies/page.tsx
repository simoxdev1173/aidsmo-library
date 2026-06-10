import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationStrategiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-strategies',
        eyebrow: 'التقييس / إستراتيجيات',
        title: 'إستراتيجيات التقييس والجودة',
        description:
          'مرجع منظم للإستراتيجيات والرؤى التي تدعم تطوير منظومات التقييس، البنية التحتية للجودة، والمواءمة العربية في مجالات المواصفات والاعتماد.',
        accent: '#0A2540',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
