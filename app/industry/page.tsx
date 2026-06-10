import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: [
          'industry-integration-strategy',
          'industry-sme',
          'industry-events',
          'industry-studies',
          'industry-studies-studies',
          'industry-studies-guides',
        ],
        resetHref: '/industry',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة',
        title: 'مكتبة الصناعة',
        description:
          'مدخل موحد لإستراتيجيات الصناعة، الصناعات الصغيرة والمتوسطة، الفعاليات، الدراسات، والأدلة الصناعية.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
