import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrialDevelopmentMagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industrial-development-magazine',
        assistantScope: 'محتوى المعلومات الصناعية',
        eyebrow: 'المعلومات الصناعية / مجلة التنمية الصناعية',
        title: 'مجلة التنمية الصناعية',
        description:
          'أعداد ومقالات مجلة التنمية الصناعية بما تقدمه من رؤى وتحليلات ومواد معرفية حول واقع الصناعة العربية.',
        accent: '#C29C41',
        heroImage: '/industry-informations-bg.png',
      }}
    />
  );
}
