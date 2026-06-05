import StandardizationInternalPage from '@/app/standardization/_components/StandardizationInternalPage';

export const dynamic = 'force-dynamic';

export default function StandardizationGuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; year?: string; sort?: string }>;
}) {
  return (
    <StandardizationInternalPage
      searchParams={searchParams}
      config={{
        slug: 'standardization-guides',
        eyebrow: 'التقييس / أدلة',
        title: 'أدلة المواصفات والجودة',
        description:
          'أدلة تطبيقية ووثائق إرشادية تقدم مسارات واضحة للتعامل مع المواصفات القياسية، إجراءات المطابقة، وأنظمة إدارة الجودة.',
        accent: '#0A2540',
        heroImage: '/bookCovers/i-2-1.png',
      }}
    />
  );
}
