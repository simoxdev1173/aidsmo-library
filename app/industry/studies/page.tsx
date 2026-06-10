import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustryStudiesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: ['industry-studies', 'industry-studies-studies', 'industry-studies-guides'],
        resetHref: '/industry/studies',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / الدراسات والأدلة',
        title: 'الدراسات والأدلة الصناعية',
        description:
          'مدخل منظم للدراسات والأدلة التي تتناول التنمية الصناعية، السياسات القطاعية، أدوات التنفيذ، وممارسات التطوير.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
