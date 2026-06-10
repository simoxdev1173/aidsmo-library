import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function IndustrySmePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'industry-sme',
        assistantScope: 'محتوى الصناعة',
        eyebrow: 'الصناعة / الصناعات الصغيرة والمتوسطة',
        title: 'الصناعات الصغيرة والمتوسطة',
        description:
          'مراجع ودراسات وأدلة لدعم المنشآت الصناعية الصغيرة والمتوسطة، تطوير قدراتها، وتحسين اندماجها في سلاسل الإنتاج.',
        accent: '#C29C41',
        heroImage: '/industry-bg.png',
      }}
    />
  );
}
