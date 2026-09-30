import Image from 'next/image';
import Link from 'next/link';
import { SubmitButton } from '@/app/dashboard/_components/FormFeedback';

type MemberValues = {
  id?: string;
  slug: string;
  name: string;
  sourceProfileName: string | null;
  role: string | null;
  ministry: string;
  country: string;
  imageUrl: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  websiteUrl: string | null;
  vCardUrl: string | null;
  bio: string | null;
  sourceNote: string | null;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  action: (formData: FormData) => Promise<void>;
  member?: MemberValues;
  basePath?: string;
  allowImageUpload?: boolean;
};

function InputField({
  name,
  label,
  value,
  required = false,
  dir,
  hint,
}: {
  name: string;
  label: string;
  value?: string | number | null;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#334155]">{label}{required && ' *'}</span>
      <input
        name={name}
        defaultValue={value ?? ''}
        required={required}
        dir={dir}
        className="h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
      />
      {hint && <span className="mt-1 block text-xs leading-5 text-[#64748B]">{hint}</span>}
    </label>
  );
}

export default function ExecutiveBoardMemberForm({ action, member, basePath = '/dashboard/executive-board', allowImageUpload = false }: Props) {
  return (
    <form action={action} className="space-y-6">
      {member?.id && <input type="hidden" name="id" value={member.id} />}

      <section className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 border-b border-[#E2E8F0] pb-4">
          <h2 className="text-lg font-bold text-[#003652]">المعلومات الأساسية</h2>
          <p className="mt-1 text-sm text-[#64748B]">الاسم والصفة والجهة التي ستظهر في دليل المجلس.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <InputField name="name" label="اسم العضو" value={member?.name} required />
          <InputField name="role" label="المنصب الوظيفي" value={member?.role} />
          <InputField name="ministry" label="الوزارة أو الجهة" value={member?.ministry} required />
          <InputField name="country" label="الدولة" value={member?.country} required />
          <InputField name="slug" label="الرابط المختصر" value={member?.slug} dir="ltr" hint="اتركه فارغاً لإنشائه تلقائياً من الاسم والدولة." />
          <InputField name="sortOrder" label="ترتيب الظهور" value={member?.sortOrder ?? 0} dir="ltr" />
        </div>
      </section>

      <section className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 border-b border-[#E2E8F0] pb-4">
          <h2 className="text-lg font-bold text-[#003652]">الصورة وبيانات الاتصال</h2>
          <p className="mt-1 text-sm text-[#64748B]">تقبل الصورة رابطاً كاملاً أو مساراً محلياً مثل /images/member.jpg.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <InputField name="imageUrl" label={allowImageUpload ? 'رابط الصورة الشخصية' : 'رابط الصورة أو العلم'} value={member?.imageUrl} dir="ltr" />
            {allowImageUpload && <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-[#334155]">رفع صورة شخصية جديدة</span>
              <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-[#334155] file:me-3 file:rounded-md file:border-0 file:bg-[#F0F7FC] file:px-3 file:py-1 file:text-[#0369A1]" />
              <span className="mt-1 block text-xs leading-5 text-[#64748B]">JPG أو PNG أو WebP أو AVIF، حتى 10MB. الصورة المرفوعة تحل محل الرابط عند الحفظ.</span>
            </label>}
            {member?.imageUrl && <div className={`relative mt-3 overflow-hidden rounded-lg border border-[#D9E3EE] bg-[#F8FAFC] ${allowImageUpload ? 'h-40 w-32' : 'h-24 w-36'}`}>
              <Image src={member.imageUrl} alt={`صورة ${member.name}`} fill unoptimized sizes="144px" className="object-cover object-top" />
            </div>}
          </div>
          <InputField name="phone" label="الهاتف" value={member?.phone} dir="ltr" />
          <InputField name="fax" label="الفاكس" value={member?.fax} dir="ltr" />
          <InputField name="email" label="البريد الإلكتروني" value={member?.email} dir="ltr" />
        </div>
      </section>

      <section className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 border-b border-[#E2E8F0] pb-4">
          <h2 className="text-lg font-bold text-[#003652]">الملف التعريفي والمصادر</h2>
          <p className="mt-1 text-sm text-[#64748B]">الروابط الرسمية والملاحظات التحريرية متاحة للمراجعة والتحديث.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <InputField name="websiteUrl" label="صفحة العضو الرسمية" value={member?.websiteUrl} dir="ltr" />
          <InputField name="vCardUrl" label="رابط بطاقة vCard" value={member?.vCardUrl} dir="ltr" />
          <InputField name="sourceProfileName" label="الاسم في صفحة المصدر عند اختلافه" value={member?.sourceProfileName} />
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-[#334155]">نبذة تعريفية</span>
            <textarea name="bio" defaultValue={member?.bio ?? ''} rows={5} className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm leading-7 text-[#0A2540] outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-[#334155]">ملاحظات المصدر للمحررين</span>
            <textarea name="sourceNote" defaultValue={member?.sourceNote ?? ''} rows={3} className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm leading-7 text-[#0A2540] outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20" />
            <span className="mt-1 block text-xs leading-5 text-[#64748B]">هذه الملاحظات تظهر في لوحة الإدارة فقط.</span>
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-bold text-[#334155]">
          <input type="checkbox" name="isActive" defaultChecked={member?.isActive ?? true} className="h-4 w-4 cursor-pointer accent-[#0369A1]" />
          إظهار الملف في الموقع
        </label>
        <div className="flex flex-wrap gap-3">
          <Link href={basePath} className="inline-flex h-11 items-center justify-center rounded-md border border-[#D9E3EE] px-5 text-sm font-bold text-[#475569] transition hover:border-[#C29C41] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
            إلغاء
          </Link>
          <SubmitButton>حفظ الملف</SubmitButton>
        </div>
      </div>
    </form>
  );
}
