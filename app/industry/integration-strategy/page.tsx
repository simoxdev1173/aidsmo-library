import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryIntegrationStrategyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industry-integration-strategy',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / إستراتيجيات',
        title: 'إستراتيجيات الصناعة',
        description:
          'مساحة للإستراتيجيات والرؤى التي تدعم التكامل الصناعي العربي، تطوير سلاسل القيمة، وتعزيز تنافسية القطاع الصناعي.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
