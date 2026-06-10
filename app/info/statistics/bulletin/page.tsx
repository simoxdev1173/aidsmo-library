import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StatisticsBulletinPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'statistics-bulletin',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / الإحصاءات الصناعية',
        title: 'نشرة الإحصاءات الصناعية',
        description:
          'نشرة دورية تجمع البيانات والإحصاءات الصناعية وتعرضها بطريقة تساعد الباحثين وصناع القرار على المتابعة السريعة.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
