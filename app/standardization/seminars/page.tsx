import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationSeminarsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-seminars',
        eyebrow: 'التقييس / ندوات',
        title: 'ندوات التقييس',
        description:
          'مساحة للندوات المرتبطة بمنظومات التقييس والجودة والمطابقة، مع مدخلات تساعد على متابعة النقاشات الفنية والمؤسسية.',
        accent: '#C29C41',
        heroImage: '/standardization-bg.png',
      }}
    />
  );
}
