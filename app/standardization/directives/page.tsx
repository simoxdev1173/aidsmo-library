import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationDirectivesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-directives',
        eyebrow: 'التقييس / توجيهات',
        title: 'توجيهات التقييس والمطابقة',
        description:
          'توجيهات عملية تساعد الجهات المختصة والمهنيين على تطبيق المواصفات، فهم متطلبات المطابقة، وتوحيد إجراءات الجودة في القطاعات الصناعية.',
        accent: '#0369A1',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
