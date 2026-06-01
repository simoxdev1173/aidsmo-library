import Image from 'next/image';
import Link from 'next/link';
import { FileField, FormBusyOverlay, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { createEntryAction, updateEntryAction } from '@/lib/library-actions';

type CategoryOption = {
  id: string;
  name: string;
  parent?: { name: string } | null;
};

type EntryFormValue = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImagePath: string | null;
  filePath: string | null;
  publisher: string | null;
  author: string | null;
  year: number | null;
  language: string;
  pageCount: number | null;
  status: string;
  featured: boolean;
  categoryId: string;
};

function fieldClass() {
  return 'h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20';
}

function labelClass() {
  return 'mb-2 block text-sm font-bold text-[#334155]';
}

export default function EntryForm({
  entry,
  categories,
}: {
  entry?: EntryFormValue | null;
  categories: CategoryOption[];
}) {
  const action = entry ? updateEntryAction.bind(null, entry.id) : createEntryAction;

  return (
    <form action={action} className="space-y-6 rounded-lg border border-[#D9E3EE] bg-white p-5">
      <FormBusyOverlay
        title="جاري حفظ المدخل"
        detail="إذا كنت ترفع غلافاً أو ملف PDF فقد يستغرق الأمر قليلاً. انتظر حتى تكتمل العملية."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <label className="block">
            <span className={labelClass()}>العنوان</span>
            <input name="title" required defaultValue={entry?.title} className={fieldClass()} />
          </label>

          <label className="block">
            <span className={labelClass()}>الرابط المختصر</span>
            <input name="slug" dir="ltr" defaultValue={entry?.slug} className={fieldClass()} />
          </label>

          <label className="block">
            <span className={labelClass()}>الوصف</span>
            <textarea
              name="description"
              required
              defaultValue={entry?.description}
              rows={9}
              className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
            />
          </label>
        </div>

        <aside className="space-y-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <label className="block">
            <span className={labelClass()}>التصنيف</span>
            <select name="categoryId" required defaultValue={entry?.categoryId ?? ''} className={fieldClass()}>
              <option value="" disabled>اختر التصنيف</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parent ? `${category.parent.name} / ${category.name}` : category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass()}>الحالة</span>
            <select name="status" defaultValue={entry?.status ?? 'DRAFT'} className={fieldClass()}>
              <option value="DRAFT">مسودة</option>
              <option value="PUBLISHED">منشور</option>
              <option value="ARCHIVED">مؤرشف</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-md border border-[#CBD5E1] bg-white px-3 py-3 text-sm font-bold text-[#334155]">
            <input name="featured" type="checkbox" defaultChecked={entry?.featured} className="h-4 w-4 accent-[#0369A1]" />
            عرض كمدخل مميز
          </label>

          <label className="block">
            <span className={labelClass()}>صورة الغلاف</span>
            {entry?.coverImagePath && (
              <div className="mb-3 overflow-hidden rounded-md border border-[#D9E3EE] bg-white">
                <Image src={entry.coverImagePath} alt={entry.title} width={320} height={420} className="max-h-52 w-full object-cover" />
              </div>
            )}
            <FileField
              name="cover"
              label="صورة غلاف جديدة"
              accept="image/png,image/jpeg,image/webp,image/avif"
              hint="PNG أو JPG أو WebP أو AVIF. الحد الأقصى 10MB."
            />
          </label>

          <label className="block">
            <span className={labelClass()}>ملف PDF</span>
            {entry?.filePath && (
              <a href={entry.filePath} target="_blank" rel="noopener noreferrer" className="mb-3 block rounded-md border border-[#D9E3EE] bg-white px-3 py-2 text-sm font-bold text-[#0369A1]">
                فتح الملف الحالي
              </a>
            )}
            <FileField
              name="document"
              label="ملف PDF جديد"
              accept="application/pdf"
              hint="PDF فقط. الحد الأقصى 50MB."
            />
          </label>
        </aside>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className={labelClass()}>الناشر</span>
          <input name="publisher" defaultValue={entry?.publisher ?? ''} className={fieldClass()} />
        </label>
        <label className="block">
          <span className={labelClass()}>المؤلف</span>
          <input name="author" defaultValue={entry?.author ?? ''} className={fieldClass()} />
        </label>
        <label className="block">
          <span className={labelClass()}>السنة</span>
          <input name="year" type="number" min="1900" max="2100" defaultValue={entry?.year ?? ''} className={fieldClass()} />
        </label>
        <label className="block">
          <span className={labelClass()}>عدد الصفحات</span>
          <input name="pageCount" type="number" min="1" defaultValue={entry?.pageCount ?? ''} className={fieldClass()} />
        </label>
      </div>

      <label className="block max-w-md">
        <span className={labelClass()}>اللغة</span>
        <input name="language" defaultValue={entry?.language ?? 'العربية'} className={fieldClass()} />
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
        <Link href="/dashboard/entries" className="inline-flex h-11 items-center justify-center rounded-md border border-[#CBD5E1] px-5 text-sm font-bold text-[#334155] transition duration-200 hover:border-[#C29C41]">
          رجوع
        </Link>
        <SubmitButton pendingText="جاري الحفظ...">
          حفظ
        </SubmitButton>
      </div>
    </form>
  );
}
