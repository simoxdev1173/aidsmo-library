import { notFound } from 'next/navigation';
import { deleteEntryAction, generateEntryCoverAction } from '@/lib/library-actions';
import EntryForm from '@/app/dashboard/_components/EntryForm';
import { Notice, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions, getEntryForEdit } from '@/lib/library-data';
import { documentFilesValue } from '@/lib/document-files';

export const dynamic = 'force-dynamic';

function dateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : null;
}

function eventImagesValue(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.startsWith('/uploads/'));
}

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
      {query.cover === 'missing-pdf' && (
        <Notice tone="error" title="ملف PDF غير موجود على الخادم">
          لا يمكن إنشاء غلاف من ملف غير موجود. تأكد من إعداد التخزين الدائم لمجلد الرفع في Coolify.
        </Notice>
      )}
      {query.cover === 'skipped' && (
        <Notice tone="info" title="لم يتم إنشاء غلاف جديد">
          المدخل لديه غلاف بالفعل أو لا يحتوي على ملف PDF.
        </Notice>
      )}
      {query.error && (
        <Notice tone="error" title="تعذر حفظ المدخل">
          {query.error === 'missing' ? 'العنوان والتصنيف مطلوبان.' : decodeURIComponent(query.error)}
        </Notice>
      )}

      {!entry.coverImagePath && documentFilesValue(entry.documentFiles, entry.filePath).length > 0 && (
        <form action={generateEntryCoverAction.bind(null, entry.id)} className="flex justify-end rounded-lg border border-[#D9E3EE] bg-white p-4">
          <SubmitButton pendingText="جاري إنشاء الغلاف...">
            إنشاء غلاف من PDF
          </SubmitButton>
        </form>
      )}

      <EntryForm
        entry={{
          id: entry.id,
          title: entry.title,
          description: entry.description,
          tag: entry.tag,
          notes: entry.notes,
          coverImagePath: entry.coverImagePath,
          filePath: entry.filePath,
          documentFiles: documentFilesValue(entry.documentFiles, entry.filePath),
          publisher: entry.publisher,
          author: entry.author,
          year: entry.year,
          language: entry.language,
          pageCount: entry.pageCount,
          status: entry.status,
          featured: entry.featured,
          categoryId: entry.categoryId,
          eventStartDate: dateInputValue(entry.eventStartDate),
          eventEndDate: dateInputValue(entry.eventEndDate),
          eventLocation: entry.eventLocation,
          eventImages: eventImagesValue(entry.eventImages),
        }}
        categories={categories}
      />
    </div>
  );
}
