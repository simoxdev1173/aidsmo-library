import { notFound } from 'next/navigation';
import { deleteEntryAction } from '@/lib/library-actions';
import EntryForm from '@/app/dashboard/_components/EntryForm';
import { Notice, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions, getEntryForEdit } from '@/lib/library-data';

export const dynamic = 'force-dynamic';

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string; cover?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [entry, categories] = await Promise.all([
    getEntryForEdit(id),
    getCategoryOptions(),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#C29C41]">المداخل</p>
          <h1 className="mt-2 text-3xl font-bold text-[#003652]">تعديل المدخل</h1>
        </div>
        <form action={deleteEntryAction.bind(null, entry.id)}>
          <SubmitButton pendingText="جاري الحذف..." className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-700">
            حذف المدخل
          </SubmitButton>
        </form>
      </div>

      {query.saved === '1' && (
        <Notice tone="success" title="تم الحفظ">
          تم الحفظ.
        </Notice>
      )}
      {query.cover === 'generated' && (
        <Notice tone="success" title="تم إنشاء صورة الغلاف تلقائيا">
          تم استخراج صورة الغلاف من الصفحة الأولى لملف PDF.
        </Notice>
      )}
      {query.cover === 'failed' && (
        <Notice tone="info" title="تم حفظ PDF بدون صورة غلاف">
          تعذر استخراج صورة الغلاف تلقائيا. يمكن رفع صورة غلاف يدويا أو إعادة محاولة الحفظ لاحقا.
        </Notice>
      )}
      {query.error && (
        <Notice tone="error" title="تعذر حفظ المدخل">
          {query.error === 'missing' ? 'العنوان والتصنيف مطلوبان.' : decodeURIComponent(query.error)}
        </Notice>
      )}

      <EntryForm entry={entry} categories={categories} />
    </div>
  );
}
