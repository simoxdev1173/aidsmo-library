import EntryForm from '@/app/dashboard/_components/EntryForm';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions } from '@/lib/library-data';

export const dynamic = 'force-dynamic';

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const categories = await getCategoryOptions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#C29C41]">المداخل</p>
        <h1 className="mt-2 text-3xl font-bold text-[#003652]">مدخل جديد</h1>
      </div>
      {query.error && (
        <Notice tone="error" title="تعذر حفظ المدخل">
          {query.error === 'missing' ? 'العنوان والتصنيف مطلوبان.' : decodeURIComponent(query.error)}
        </Notice>
      )}
      <EntryForm categories={categories} />
    </div>
  );
}
