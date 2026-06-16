import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: ['newsletter', 'newsletter-2024', 'newsletter-2025', 'newsletter-2026'],
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / النشرة الدورية',
        title: 'النشرة الدورية',
        description:
          'أرشيف للنشرات الدورية التي تلخص أبرز المستجدات والبيانات والمواد المرتبطة بالمعلومات الصناعية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
