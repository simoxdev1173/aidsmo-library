'use client';

import type { PageCountStatus } from '@/app/dashboard/_components/EntryForm';

type EntryTypedFieldsProps = {
  tag?: string | null;
  notes?: string | null;
  publisher?: string | null;
  author?: string | null;
  year?: string | null;
  language?: string | null;
  pageCount?: number | null;
  pageCountStatus?: PageCountStatus;
};

function fieldClass() {
  return 'h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20';
}

function labelClass() {
  return 'mb-2 block text-sm font-bold text-[#334155]';
}

export default function EntryTypedFields({
  tag,
  notes,
  publisher,
  author,
  year,
  language,
  pageCount,
  pageCountStatus,
}: EntryTypedFieldsProps) {
  const status = pageCountStatus ?? { phase: 'idle' as const, done: 0, total: 0, failed: 0 };
  const isCounting = status.phase === 'counting';
  const progress = status.total > 0 ? Math.round((status.done / status.total) * 100) : 0;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-[#D9E3EE] bg-[#F8FAFC] p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#003652]">بيانات الإصدار</h3>
          <p className="mt-1 text-sm leading-6 text-[#64748B]">
            املأ البيانات المتوفرة فقط. يمكن ترك أي خانة غير ضرورية فارغة.
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
            <input
              name="year"
              type="text"
              inputMode="text"
              dir="ltr"
              placeholder="2023 or 2023 - 2019"
              defaultValue={year ?? ''}
              className={fieldClass()}
            />
          </label>
          <label className="block">
            <span className={labelClass()}>عدد الصفحات</span>
            <input
              name="pageCount"
              type="number"
              min="1"
              defaultValue={pageCount ?? ''}
              placeholder={isCounting ? 'جاري حساب الصفحات...' : 'يُحسب تلقائيا'}
              className={fieldClass()}
            />
            {isCounting ? (
              <div className="mt-2" role="status" aria-live="polite">
                <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#0369A1]">
                  <span>جاري حساب صفحات ملفات PDF...</span>
                  <span dir="ltr">{status.done}/{status.total}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full bg-[#0369A1] transition-[width] duration-300 ease-out"
                    style={{ width: `${Math.max(progress, 6)}%` }}
                  />
                </div>
              </div>
            ) : status.phase === 'done' ? (
              <p className="mt-1.5 text-xs font-semibold leading-5 text-green-700">
                تم حساب عدد الصفحات تلقائيا من ملفات PDF.
                {status.failed > 0 && (
                  <span className="text-[#B45309]">
                    {' '}
                    (تعذر قراءة {status.failed} ملف، يمكنك تعديل الرقم يدويا.)
                  </span>
                )}
              </p>
            ) : (
              <p className="mt-1.5 text-xs leading-5 text-[#64748B]">
                يُحسب مجموع صفحات ملفات PDF تلقائيا عند رفعها، أو أدخل رقما لتجاوز الحساب.
              </p>
            )}
          </label>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={labelClass()}>اللغة</span>
            <input name="language" defaultValue={language ?? 'العربية'} className={fieldClass()} />
          </label>
          <label className="block">
            <span className={labelClass()}>وسم إضافي</span>
            <input
              name="tag"
              defaultValue={tag ?? ''}
              placeholder="مثال: دليل، دراسة، تقرير، نشرة"
              className={fieldClass()}
            />
          </label>
        </div>
      </section>

      <label className="block">
        <span className={labelClass()}>ملاحظات داخلية</span>
        <textarea
          name="notes"
          defaultValue={notes ?? ''}
          rows={4}
          placeholder="ملاحظة للإدارة فقط، لا تظهر للزائر."
          className="w-full rounded-md border border-[#E8C96A] bg-[#FFF8E1] px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 placeholder:text-[#8A6A1D] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
        />
        <p className="mt-2 text-xs leading-5 text-[#8A6A1D]">هذه الملاحظات داخلية ولا تظهر في صفحات المكتبة.</p>
      </label>
    </div>
  );
}
