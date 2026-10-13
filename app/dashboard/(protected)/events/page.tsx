import { HiOutlineMegaphone } from 'react-icons/hi2';
import { Notice, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { addNewsAction } from '@/lib/news-actions';

export const metadata = { title: 'الأخبار والإعلانات | لوحة التحكم' };

export default async function NewsDashboardPage({ searchParams }: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const query = await searchParams;
  const sent = query.sent !== undefined ? Number(query.sent) : null;

  return <div className="mx-auto max-w-3xl space-y-6">
    <div>
      <p className="text-sm font-bold text-[#C29C41]">لوحة التحكم</p>
      <h1 className="mt-2 text-3xl font-bold text-[#053D69]">الأخبار والإعلانات</h1>
      <p className="mt-2 text-sm leading-7 text-[#64748B]">اكتب خبراً أو معلومة لإرسال إشعار داخل الموقع إلى مستخدمي المكتبة.</p>
    </div>

    {sent !== null && Number.isInteger(sent) && sent >= 0 && <Notice tone={sent > 0 ? 'success' : 'info'} title={sent > 0 ? 'تمت إضافة الخبر' : 'لم يُرسل الخبر'}>{sent > 0 ? `أُرسل الإشعار إلى ${sent} مستخدم.` : 'لا يوجد مستخدمون مسجلون لإرسال الإشعار إليهم حالياً.'}</Notice>}
    {query.error === 'invalid' && <Notice tone="error" title="تعذر إضافة الخبر">اكتب نصاً لا يتجاوز 500 حرف.</Notice>}

    <form action={addNewsAction} className="rounded-2xl border border-[#D9E3EE] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#E9F2F8] text-[#053D69]"><HiOutlineMegaphone className="size-6" /></div>
      <label htmlFor="message" className="block text-base font-bold text-[#082F50]">نص الخبر</label>
      <p id="message-help" className="mt-1 text-sm text-[#64748B]">سيظهر هذا النص للمستخدمين في صفحة الإشعارات.</p>
      <textarea id="message" name="message" required maxLength={500} rows={5} aria-describedby="message-help" placeholder="اكتب الخبر أو المعلومة هنا..." className="mt-4 w-full resize-y rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm leading-7 text-[#082F50] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/20" />
      <div className="mt-5 flex justify-end"><SubmitButton pendingText="جارٍ الإرسال..." className="rounded-lg bg-[#053D69] hover:bg-[#0B5688]">إضافة الخبر</SubmitButton></div>
    </form>
  </div>;
}
