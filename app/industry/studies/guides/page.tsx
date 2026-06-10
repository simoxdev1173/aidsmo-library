import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryGuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industry-studies-guides',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / الأدلة',
        title: 'الأدلة الصناعية',
        description:
          'أدلة تطبيقية ووثائق إرشادية تساعد الجهات الصناعية على التخطيط، التنفيذ، تحسين الأداء، وتطوير المشاريع.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
