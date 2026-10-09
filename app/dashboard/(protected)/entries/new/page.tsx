import EntryForm from '@/app/dashboard/_components/EntryForm';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions } from '@/lib/library-data';
import { eventCategorySlugs } from '@/lib/event-categories';

export const dynamic = 'force-dynamic';

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; kind?: string }>;
}) {
  const query = await searchParams;
  const categories = await getCategoryOptions();
  const eventMode = query.kind === 'event';
  const eventCategory = eventMode ? (
    categories.find((category) => category.slug === 'industry-events') ??
    categories.find((category) => eventCategorySlugs.has(category.slug) || Boolean(category.parent?.slug && eventCategorySlugs.has(category.parent.slug)))
  ) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#C29C41]">{eventMode ? 'الفعاليات' : 'المداخل'}</p>
        <h1 className="mt-2 text-3xl font-bold text-[#053D69]">{eventMode ? 'إضافة فعالية' : 'مدخل جديد'}</h1>
      </div>
      {query.error && (
        <Notice tone="error" title="تعذر حفظ المدخل">
          {query.error === 'missing' ? 'العنوان والتصنيف مطلوبان.' : decodeURIComponent(query.error)}
        </Notice>
      )}
      {eventMode && <Notice tone="info" title="إنشاء فعالية">اختر تصنيف الفعالية وتفاصيلها، ثم اجعل حالتها «منشورة». بعد الحفظ افتحها من صفحة المداخل لإرسال إعلانها.</Notice>}
      <EntryForm categories={categories} initialCategoryId={eventCategory?.id} />
    </div>
  );
}
