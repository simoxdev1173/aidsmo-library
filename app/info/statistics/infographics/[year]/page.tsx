import { notFound } from 'next/navigation';
import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

const yearConfig = {
  '2024': {
    slug: 'infographics-2024',
    title: 'الإنفوجرافيك الصناعي 2024',
  },
  '2025': {
    slug: 'infographics-2025',
    title: 'الإنفوجرافيك الصناعي 2025',
  },
  '2026': {
    slug: 'infographics-2026',
    title: 'الإنفوجرافيك الصناعي 2026',
  },
} as const;

export default async function IndustrialInfographicsYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  const { year } = await params;
  const config = yearConfig[year as keyof typeof yearConfig];

  if (!config) {
    notFound();
  }

  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: config.slug,
        resetHref: `/info/statistics/infographics/${year}`,
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / الإحصاءات الصناعية / الانفوجرافيك',
        title: config.title,
        description:
          'مساحة للمواد البصرية التي تحول البيانات والمؤشرات الصناعية إلى عروض مختصرة وسهلة القراءة حسب سنة الإصدار.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
