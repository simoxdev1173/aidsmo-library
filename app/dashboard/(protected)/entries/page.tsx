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
  searchParams: Promise<{ q?: string; categoryId?: string; status?: string; saved?: string; cover?: string }>;
}) {
  const filters = await searchParams;
  const [entries, categories] = await Promise.all([
    getEntries(filters),
    getCategoryOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#C29C41]">المداخل</p>
          <h1 className="mt-2 text-3xl font-bold text-[#003652]">إدارة الإصدارات</h1>
        </div>
        <Link href="/dashboard/entries/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#003652]">
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
            className="h-11 w-full rounded-md border border-[#CBD5E1] bg-white pr-10 pl-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
          />
          <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
        </label>
        <select name="categoryId" defaultValue={filters.categoryId ?? ''} className="h-11 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none focus:border-[#0369A1]">
          <option value="">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {categoryPath(category)}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={filters.status ?? ''} className="h-11 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none focus:border-[#0369A1]">
          <option value="">كل الحالات</option>
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
        </select>
        <button type="submit" className="h-11 cursor-pointer rounded-md border border-[#0369A1] bg-[#F0F7FC] px-5 text-sm font-bold text-[#0369A1] transition duration-200 hover:bg-[#0369A1] hover:text-white">
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
                <th className="px-4 py-3">آخر تحديث</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {entries.map((entry) => (
                <tr key={entry.id} className="transition duration-200 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F0F7FC]">
                        {entry.coverImagePath ? (
                          <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#0369A1]">PDF</div>
                        )}
                      </div>
                      <div>
                        <p className="line-clamp-2 font-bold text-[#0A2540]">{entry.title}</p>
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
                    <span className="rounded-full bg-[#F0F7FC] px-3 py-1 text-xs font-bold text-[#0369A1]">{statusLabel(entry.status)}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#64748B]">{entry.updatedAt.toLocaleDateString('ar-MA')}</td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/entries/${entry.id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E3EE] text-[#0369A1] transition duration-200 hover:border-[#C29C41] hover:text-[#C29C41]">
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
      </section>
    </div>
  );
}
