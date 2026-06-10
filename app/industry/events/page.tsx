import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industry-events',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / فعاليات وأنشطة',
        title: 'فعاليات وأنشطة الصناعة',
        description:
          'مساحة للفعاليات والأنشطة الصناعية، مع مدخلات تساعد على متابعة البرامج والمبادرات والمواد المرتبطة بها.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
