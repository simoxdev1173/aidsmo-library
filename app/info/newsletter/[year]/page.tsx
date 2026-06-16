import { notFound } from 'next/navigation';
import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

const yearConfig = {
  '2024': {
    slug: 'newsletter-2024',
    title: 'النشرة الدورية 2024',
  },
  '2025': {
    slug: 'newsletter-2025',
    title: 'النشرة الدورية 2025',
  },
  '2026': {
    slug: 'newsletter-2026',
    title: 'النشرة الدورية 2026',
  },
} as const;

export default async function IndustrialNewsletterYearPage({
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
        resetHref: `/info/newsletter/${year}`,
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / النشرة الدورية',
        title: config.title,
        description:
          'أرشيف سنوي للنشرات الدورية التي تلخص أبرز المستجدات والبيانات والمواد المرتبطة بالمعلومات الصناعية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
