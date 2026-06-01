import { createCategoryAction, updateCategoryAction } from '@/lib/library-actions';
import { FormBusyOverlay, Notice, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { getCategoryOptions } from '@/lib/library-data';

export const dynamic = 'force-dynamic';

function inputClass() {
  return 'h-10 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20';
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const query = await searchParams;
  const categories = await getCategoryOptions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#C29C41]">التصنيفات</p>
        <h1 className="mt-2 text-3xl font-bold text-[#003652]">ربط التصنيفات بالملاحة</h1>
      </div>

      {query.error && (
        <Notice tone="error" title="تعذر حفظ التصنيف">
          {query.error === 'missing' ? 'اسم التصنيف مطلوب.' : decodeURIComponent(query.error)}
        </Notice>
      )}
      {query.saved === '1' && (
        <Notice tone="success" title="تم حفظ التصنيف" />
      )}

      <form action={createCategoryAction} className="rounded-lg border border-[#D9E3EE] bg-white p-5">
        <FormBusyOverlay title="جاري حفظ التصنيف" detail="نربط التصنيف بالملاحة ونحدث الفهرس." />
        <h2 className="mb-4 text-lg font-bold text-[#003652]">تصنيف جديد</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input name="name" required placeholder="الاسم" className={inputClass()} />
          <input name="slug" dir="ltr" placeholder="slug" className={inputClass()} />
          <select name="parentId" defaultValue="" className={inputClass()}>
            <option value="">بدون تصنيف أب</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input name="navHref" dir="ltr" placeholder="/catalog/example" className={inputClass()} />
          <input name="order" type="number" placeholder="الترتيب" className={inputClass()} />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold text-[#334155]">
          <input name="isNavVisible" type="checkbox" defaultChecked className="h-4 w-4 accent-[#0369A1]" />
          ظاهر في الملاحة
        </label>
        <textarea name="description" rows={3} placeholder="وصف قصير" className="mt-4 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20" />
        <SubmitButton pendingText="جاري الإضافة..." className="mt-4 h-10 px-5">
          إضافة
        </SubmitButton>
      </form>

      <section className="space-y-3">
        {categories.map((category) => (
          <form key={category.id} action={updateCategoryAction.bind(null, category.id)} className="rounded-lg border border-[#D9E3EE] bg-white p-4">
            <FormBusyOverlay title="جاري تحديث التصنيف" detail="سيتم تحديث التصنيف والروابط المرتبطة به." />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1.2fr_120px_auto]">
              <input name="name" defaultValue={category.name} required className={inputClass()} />
              <input name="slug" dir="ltr" defaultValue={category.slug} className={inputClass()} />
              <select name="parentId" defaultValue={category.parentId ?? ''} className={inputClass()}>
                <option value="">بدون تصنيف أب</option>
                {categories
                  .filter((item) => item.id !== category.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
              </select>
              <input name="navHref" dir="ltr" defaultValue={category.navHref ?? ''} className={inputClass()} />
              <input name="order" type="number" defaultValue={category.order} className={inputClass()} />
              <SubmitButton pendingText="جاري الحفظ..." className="h-10 border border-[#0369A1] bg-white px-4 text-[#0369A1] hover:bg-[#0369A1] hover:text-white">
                حفظ
              </SubmitButton>
            </div>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
              <label className="flex items-center gap-2 text-sm font-bold text-[#334155]">
                <input name="isNavVisible" type="checkbox" defaultChecked={category.isNavVisible} className="h-4 w-4 accent-[#0369A1]" />
                ظاهر في الملاحة
              </label>
              <p className="text-sm text-[#64748B]">
                {category.parent ? `${category.parent.name} / ${category.name}` : category.name} · {category._count.entries} مدخل
              </p>
            </div>
            <textarea name="description" rows={2} defaultValue={category.description ?? ''} className="mt-3 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20" />
          </form>
        ))}
      </section>
    </div>
  );
}
