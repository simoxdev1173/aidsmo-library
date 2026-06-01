import { HiOutlineAdjustmentsHorizontal, HiOutlineDocumentText } from 'react-icons/hi2';

export const dynamic = 'force-dynamic';

export default function OtherSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#C29C41]">إعدادات أخرى</p>
        <h1 className="mt-2 text-3xl font-bold text-[#003652]">حقول ومحتوى قابل للتطوير</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#64748B]">
          هذه المساحة مخصصة للخيارات التي سنضيفها لاحقاً حسب نوع الصفحة والمحتوى، بدون إرباك المستخدم في إدارة التصنيفات.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[#D9E3EE] bg-white p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F0F7FC] text-[#0369A1]">
            <HiOutlineDocumentText className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#003652]">حقول الصفحات</h2>
          <p className="mt-2 text-sm leading-7 text-[#64748B]">
            حالياً يمكن إضافة نوع المدخل، الوصف، الملاحظات، الأقسام الداخلية، الغلاف، وملف PDF من صفحة المداخل.
          </p>
        </div>

        <div className="rounded-lg border border-[#D9E3EE] bg-white p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#FFF8E1] text-[#8A6A1D]">
            <HiOutlineAdjustmentsHorizontal className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#003652]">المرحلة القادمة</h2>
          <p className="mt-2 text-sm leading-7 text-[#64748B]">
            عندما نحدد الصفحات التي تحتاج حقولاً خاصة، يمكن تحويل هذه الصفحة إلى إعدادات قابلة للتعديل من لوحة التحكم.
          </p>
        </div>
      </section>
    </div>
  );
}
