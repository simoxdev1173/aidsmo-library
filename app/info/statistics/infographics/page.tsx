import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialInfographicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: ['infographics', 'infographics-2023', 'infographics-2024', 'infographics-2025', 'infographics-2026'],
        resetHref: '/info/statistics/infographics',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / الإحصاءات الصناعية',
        title: 'الإنفوجرافيك الصناعي',
        description:
          'مساحة للمواد البصرية التي تحول البيانات والمؤشرات الصناعية إلى عروض مختصرة وسهلة القراءة.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
