import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineMagnifyingGlass, HiOutlinePencilSquare, HiOutlinePlus } from 'react-icons/hi2';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions, getEntries } from '@/lib/library-data';
import { categoryPath, statusLabel } from '@/lib/library-labels';

export const dynamic = 'force-dynamic';

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoryId?: string; status?: string; page?: string; saved?: string; cover?: string }>;
}) {
  const filters = await searchParams;
  const requestedPage = filters.page && /^[1-9]\d*$/.test(filters.page) ? Number(filters.page) : 1;
  const [{ entries, page, pageSize, total, totalPages }, categories] = await Promise.all([
    getEntries(filters, requestedPage),
    getCategoryOptions(),
  ]);
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.status) params.set('status', filters.status);
    if (targetPage > 1) params.set('page', String(targetPage));
    const query = params.toString();
    return `/dashboard/entries${query ? `?${query}` : ''}`;
  };
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => Math.max(1, Math.min(page - 2, totalPages - 4)) + index,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#C29C41]">المداخل</p>
          <h1 className="mt-2 text-3xl font-bold text-[#053D69]">إدارة الإصدارات</h1>
        </div>
        <Link href="/dashboard/entries/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0B5688] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#053D69]">
          <HiOutlinePlus className="h-5 w-5" />
          مدخل جديد
        </Link>
      </div>

      <form className="grid gap-3 rounded-lg border border-[#D9E3EE] bg-white p-4 lg:grid-cols-[1fr_240px_170px_auto]">
        <label className="relative">
          <span className="sr-only">بحث</span>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="بحث بالعنوان أو المؤلف أو الناشر أو الوسم"
            className="h-11 w-full rounded-md border border-[#CBD5E1] bg-white pr-10 pl-3 text-sm text-[#082F50] outline-none transition duration-200 focus:border-[#0B5688] focus:ring-2 focus:ring-[#0B5688]/20"
          />
          <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
        </label>
        <select name="categoryId" defaultValue={filters.categoryId ?? ''} className="h-11 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#082F50] outline-none focus:border-[#0B5688]">
          <option value="">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {categoryPath(category)}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={filters.status ?? ''} className="h-11 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#082F50] outline-none focus:border-[#0B5688]">
          <option value="">كل الحالات</option>
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
        </select>
        <button type="submit" className="h-11 cursor-pointer rounded-md border border-[#0B5688] bg-[#EFF5F9] px-5 text-sm font-bold text-[#0B5688] transition duration-200 hover:bg-[#0B5688] hover:text-white">
          تطبيق
        </button>
      </form>

      {filters.saved === 'created' && (
        <Notice tone="success" title="تم إنشاء المدخل" />
      )}
      {filters.cover === 'generated' && (
        <Notice tone="success" title="تم إنشاء صورة الغلاف تلقائيا">
          تم استخراج صورة الغلاف من الصفحة الأولى لملف PDF.
        </Notice>
      )}
      {filters.cover === 'failed' && (
        <Notice tone="info" title="تم حفظ PDF بدون صورة غلاف">
          تعذر استخراج صورة الغلاف تلقائيا. يمكن رفع صورة غلاف يدويا أو إعادة محاولة الحفظ لاحقا.
        </Notice>
      )}
      {filters.saved === 'deleted' && (
        <Notice tone="success" title="تم حذف المدخل" />
      )}

      <section className="overflow-hidden rounded-lg border border-[#D9E3EE] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-right">
            <thead className="bg-[#F8FAFC] text-xs font-bold text-[#64748B]">
              <tr>
                <th className="px-4 py-3">الإصدار</th>
                <th className="px-4 py-3">الوسم</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">السنة</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">تاريخ الإنشاء</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {entries.map((entry) => (
                <tr key={entry.id} className="transition duration-200 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-[#E2E8F0] bg-[#EFF5F9]">
                        {entry.coverImagePath ? (
                          <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#0B5688]">{entry.entryType === 'BOOK' ? 'كتاب' : 'ملف'}</div>
                        )}
                      </div>
                      <div>
                        <p className="line-clamp-2 font-bold text-[#082F50]">{entry.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{entry.author ?? 'بدون مؤلف'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {entry.tag ? (
                      <span className="rounded-full bg-[#FFF8E1] px-3 py-1 text-xs font-bold text-[#8A6A1D]">{entry.tag}</span>
                    ) : (
                      <span className="text-sm text-[#94A3B8]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold leading-6 text-[#475569]">{categoryPath(entry.category)}</td>
                  <td className="px-4 py-4 text-sm text-[#475569]">{entry.year ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#EFF5F9] px-3 py-1 text-xs font-bold text-[#0B5688]">{statusLabel(entry.status)}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B]">
                    <time dateTime={entry.createdAt.toISOString()}>{entry.createdAt.toLocaleDateString('ar-MA', { timeZone: 'Africa/Casablanca' })}</time>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/entries/${entry.id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E3EE] text-[#0B5688] transition duration-200 hover:border-[#C29C41] hover:text-[#C29C41]">
                      <HiOutlinePencilSquare className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-[#64748B]">
                    لا توجد نتائج.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {total > 0 && (
          <nav aria-label="صفحات الإصدارات" className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] px-4 py-4">
            <p className="text-sm text-[#64748B]">
              عرض {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} من {total}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="rounded-md border border-[#D9E3EE] px-3 py-2 text-sm font-semibold text-[#0B5688] hover:bg-[#EFF5F9]">السابق</Link>
              ) : (
                <span className="rounded-md border border-[#E2E8F0] px-3 py-2 text-sm text-[#94A3B8]">السابق</span>
              )}
              {visiblePages.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={pageHref(pageNumber)}
                  aria-label={`الصفحة ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                  className={`min-w-9 rounded-md border px-3 py-2 text-center text-sm font-semibold ${pageNumber === page ? 'border-[#0B5688] bg-[#0B5688] text-white' : 'border-[#D9E3EE] text-[#0B5688] hover:bg-[#EFF5F9]'}`}
                >
                  {pageNumber}
                </Link>
              ))}
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="rounded-md border border-[#D9E3EE] px-3 py-2 text-sm font-semibold text-[#0B5688] hover:bg-[#EFF5F9]">التالي</Link>
              ) : (
                <span className="rounded-md border border-[#E2E8F0] px-3 py-2 text-sm text-[#94A3B8]">التالي</span>
              )}
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}
