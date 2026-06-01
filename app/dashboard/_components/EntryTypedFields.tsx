'use client';

import { useState } from 'react';
import SectionFields, { type EntrySection } from '@/app/dashboard/_components/SectionFields';

type EntryType = 'BOOK' | 'PAGE' | 'OTHER';

type EntryTypedFieldsProps = {
  initialType?: string;
  notes?: string | null;
  publisher?: string | null;
  author?: string | null;
  year?: number | null;
  language?: string | null;
  pageCount?: number | null;
  sections?: EntrySection[];
};

function fieldClass() {
  return 'h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20';
}

function labelClass() {
  return 'mb-2 block text-sm font-bold text-[#334155]';
}

function normalizeEntryType(value?: string): EntryType {
  if (value === 'PAGE' || value === 'OTHER') return value;
  return 'BOOK';
}

export default function EntryTypedFields({
  initialType,
  notes,
  publisher,
  author,
  year,
  language,
  pageCount,
  sections = [],
}: EntryTypedFieldsProps) {
  const [entryType, setEntryType] = useState<EntryType>(normalizeEntryType(initialType));
  const isBook = entryType === 'BOOK';

  return (
    <div className="space-y-5">
      <label className="block">
        <span className={labelClass()}>نوع المدخل</span>
        <select
          name="entryType"
          value={entryType}
          onChange={(event) => setEntryType(normalizeEntryType(event.target.value))}
          className={fieldClass()}
        >
          <option value="BOOK">كتاب / إصدار</option>
          <option value="PAGE">صفحة محتوى</option>
          <option value="OTHER">أخرى</option>
        </select>
      </label>

      {isBook ? (
        <section className="rounded-lg border border-[#D9E3EE] bg-[#F8FAFC] p-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#003652]">بيانات الكتاب</h3>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">
              تظهر هذه البيانات في صفحة الكتاب فقط.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className={labelClass()}>الناشر</span>
              <input name="publisher" defaultValue={publisher ?? ''} className={fieldClass()} />
            </label>
            <label className="block">
              <span className={labelClass()}>المؤلف</span>
              <input name="author" defaultValue={author ?? ''} className={fieldClass()} />
            </label>
            <label className="block">
              <span className={labelClass()}>السنة</span>
              <input name="year" type="number" min="1900" max="2100" defaultValue={year ?? ''} className={fieldClass()} />
            </label>
            <label className="block">
              <span className={labelClass()}>عدد الصفحات</span>
              <input name="pageCount" type="number" min="1" defaultValue={pageCount ?? ''} className={fieldClass()} />
            </label>
          </div>
          <label className="mt-5 block max-w-md">
            <span className={labelClass()}>اللغة</span>
            <input name="language" defaultValue={language ?? 'العربية'} className={fieldClass()} />
          </label>
        </section>
      ) : (
        <SectionFields initialSections={sections} />
      )}

      <label className="block">
        <span className={labelClass()}>ملاحظات داخلية</span>
        <textarea
          name="notes"
          defaultValue={notes ?? ''}
          rows={4}
          placeholder="ملاحظة لك فقط داخل لوحة التحكم، لا تظهر للزائر."
          className="w-full rounded-md border border-[#E8C96A] bg-[#FFF8E1] px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 placeholder:text-[#8A6A1D] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
        />
        <p className="mt-2 text-xs leading-5 text-[#8A6A1D]">هذه الملاحظات داخلية ولن تظهر في صفحة الكتاب أو المحتوى.</p>
      </label>
    </div>
  );
}
