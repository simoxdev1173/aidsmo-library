'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LuCheck, LuChevronDown, LuSearch } from 'react-icons/lu';
import EntryTypedFields from '@/app/dashboard/_components/EntryTypedFields';
import { FileField, FormBusyOverlay, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { createEntryAction, updateEntryAction } from '@/lib/library-actions';
import { categoryPath } from '@/lib/library-labels';

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  parent?: { name: string; slug: string; parent?: { name: string; slug: string } | null } | null;
};

type EntryFormValue = {
  id: string;
  title: string;
  description: string | null;
  tag: string | null;
  notes: string | null;
  coverImagePath: string | null;
  filePath: string | null;
  publisher: string | null;
  author: string | null;
  year: string | null;
  language: string;
  pageCount: number | null;
  status: string;
  featured: boolean;
  categoryId: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  eventLocation: string | null;
  eventImages: string[];
};

const eventCategorySlugs = new Set([
  'standardization-training-courses',
  'standardization-workshops-events',
  'standardization-seminars',
  'standardization-meetings',
  'training-plan-2024',
  'training-plan-2025',
  'training-plan-2026',
]);

function fieldClass() {
  return 'h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20';
}

function labelClass() {
  return 'mb-2 block text-sm font-bold text-[#334155]';
}

function isEventCategory(category?: CategoryOption) {
  return Boolean(
    category &&
      (eventCategorySlugs.has(category.slug) ||
        (category.parent?.slug && eventCategorySlugs.has(category.parent.slug))),
  );
}

function CategoryPicker({
  categories,
  selectedCategoryId,
  onSelect,
}: {
  categories: CategoryOption[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const filteredCategories = categories.filter((category) => categoryPath(category).includes(query.trim()));

  return (
    <div className="relative">
      <input type="hidden" name="categoryId" value={selectedCategoryId} />
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-right text-sm font-semibold text-[#0A2540] shadow-sm outline-none transition duration-200 hover:border-[#94A3B8] focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
      >
        <span className={selectedCategory ? 'leading-6' : 'text-[#64748B]'}>
          {selectedCategory ? categoryPath(selectedCategory) : 'اختر التصنيف'}
        </span>
        <LuChevronDown className={`h-4 w-4 shrink-0 text-[#64748B] transition duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-md border border-[#CBD5E1] bg-white shadow-[0_18px_42px_rgba(10,37,64,0.16)]">
          <label className="relative block border-b border-[#E2E8F0]">
            <span className="sr-only">بحث في التصنيفات</span>
            <LuSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="بحث..."
              className="h-11 w-full bg-[#F8FAFC] pr-9 pl-3 text-sm text-[#0A2540] outline-none placeholder:text-[#94A3B8]"
            />
          </label>
          <div className="max-h-72 overflow-y-auto p-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const selected = category.id === selectedCategoryId;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onSelect(category.id);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`flex w-full items-start justify-between gap-3 rounded px-3 py-2.5 text-right text-sm transition duration-150 ${
                      selected ? 'bg-[#EFF6FF] font-bold text-[#0369A1]' : 'text-[#334155] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="leading-6">{categoryPath(category)}</span>
                    {selected && <LuCheck className="mt-1 h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-4 text-center text-sm text-[#64748B]">لا توجد نتائج</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EntryForm({
  entry,
  categories,
}: {
  entry?: EntryFormValue | null;
  categories: CategoryOption[];
}) {
  const action = entry ? updateEntryAction.bind(null, entry.id) : createEntryAction;
  const [selectedCategoryId, setSelectedCategoryId] = useState(entry?.categoryId ?? '');
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );
  const eventMode = isEventCategory(selectedCategory);

  return (
    <form action={action} className="space-y-6 rounded-lg border border-[#D9E3EE] bg-white p-5">
      <FormBusyOverlay
        title="جاري حفظ المدخل"
        detail="إذا كنت ترفع صورا أو ملف PDF فقد يستغرق الأمر قليلا. انتظر حتى تكتمل العملية."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <label className="block">
            <span className={labelClass()}>العنوان</span>
            <input name="title" required defaultValue={entry?.title} className={fieldClass()} />
          </label>

          {eventMode ? (
            <div className="space-y-5">
              <section className="rounded-lg border border-[#D9E3EE] bg-[#F8FAFC] p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#003652]">بيانات الفعالية</h3>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">
                    استخدم هذه الخانات لفعاليات الخطة التدريبية حسب السنة المختارة.
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <label className="block">
                    <span className={labelClass()}>تاريخ البداية</span>
                    <input name="eventStartDate" type="date" defaultValue={entry?.eventStartDate ?? ''} className={fieldClass()} />
                  </label>
                  <label className="block">
                    <span className={labelClass()}>تاريخ النهاية</span>
                    <input name="eventEndDate" type="date" defaultValue={entry?.eventEndDate ?? ''} className={fieldClass()} />
                  </label>
                  <label className="block md:col-span-2 xl:col-span-1">
                    <span className={labelClass()}>المكان</span>
                    <input name="eventLocation" defaultValue={entry?.eventLocation ?? ''} className={fieldClass()} />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className={labelClass()}>وصف الفعالية</span>
                  <textarea
                    name="description"
                    defaultValue={entry?.description ?? ''}
                    rows={5}
                    placeholder="اكتب وصفا مختصرا للفعالية يظهر للزوار."
                    className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 placeholder:text-[#94A3B8] focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
                  />
                </label>
              </section>

              <label className="block">
                <span className={labelClass()}>ملاحظات داخلية</span>
                <textarea
                  name="notes"
                  defaultValue={entry?.notes ?? ''}
                  rows={4}
                  placeholder="ملاحظة للإدارة فقط، لا تظهر للزائر."
                  className="w-full rounded-md border border-[#E8C96A] bg-[#FFF8E1] px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 placeholder:text-[#8A6A1D] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
                />
              </label>
            </div>
          ) : (
            <EntryTypedFields
              tag={entry?.tag}
              notes={entry?.notes}
              publisher={entry?.publisher}
              author={entry?.author}
              year={entry?.year}
              language={entry?.language}
              pageCount={entry?.pageCount}
            />
          )}
        </div>

        <aside className="space-y-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <label className="block">
            <span className={labelClass()}>التصنيف</span>
            <CategoryPicker
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
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

          {eventMode ? (
            <label className="block">
              <span className={labelClass()}>صور الفعالية</span>
              {entry?.eventImages && entry.eventImages.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {entry.eventImages.map((image) => (
                    <div key={image} className="relative aspect-square overflow-hidden rounded-md border border-[#D9E3EE] bg-white">
                      <Image src={image} alt={entry.title} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              )}
              <FileField
                name="eventImages"
                label="اختيار صور الفعالية"
                accept="image/png,image/jpeg,image/webp,image/avif"
                hint="حتى 3 صور. PNG أو JPG أو WebP أو AVIF، والحد الأقصى 10MB لكل صورة."
                multiple
              />
            </label>
          ) : (
            <>
              <label className="block">
                <span className={labelClass()}>صورة الغلاف</span>
                {entry?.coverImagePath && (
                  <div className="mb-3 overflow-hidden rounded-md border border-[#D9E3EE] bg-white">
                    <Image src={entry.coverImagePath} alt={entry.title} width={320} height={420} className="max-h-52 w-full object-cover" unoptimized />
                  </div>
                )}
                <FileField
                  name="cover"
                  label="اختيار صورة غلاف"
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
                  label="اختيار ملف PDF"
                  accept="application/pdf"
                  hint="PDF فقط. الحد الأقصى 50MB."
                />
              </label>
            </>
          )}
        </aside>
      </div>

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
