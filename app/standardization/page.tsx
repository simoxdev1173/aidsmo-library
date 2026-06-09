import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: [
          'standardization-studies',
          'standardization-glossaries',
          'standardization-guides',
          'standardization-directives',
          'standardization-strategies',
          'standardization-training-courses',
          'standardization-workshops-events',
          'standardization-workshops',
          'standardization-seminars',
          'standardization-meetings',
        ],
        eyebrow: 'التقييس',
        title: 'مكتبة التقييس والجودة',
        resetHref: '/standardization',
        description:
          'مدخل موحد لدراسات التقييس، المعاجم، الأدلة، التوجيهات، الإستراتيجيات، والفعاليات المرتبطة بالجودة والمطابقة.',
        accent: '#C29C41',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
