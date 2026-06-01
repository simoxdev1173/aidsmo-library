import Image from 'next/image';
import { redirect } from 'next/navigation';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { FormBusyOverlay, Notice, SubmitButton } from '@/app/dashboard/_components/FormFeedback';
import { getAdminSession } from '@/lib/auth';
import { loginAction } from '@/lib/library-actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdminSession();
  const query = await searchParams;

  if (admin) {
    redirect('/dashboard');
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8FB] px-4 py-10 text-[#0A2540]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <Image src="/logo-2.png" alt="المكتبة الرقمية" width={260} height={120} className="h-24 w-auto object-contain" priority />
          <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight text-[#003652]">
            لوحة إدارة المكتبة الرقمية
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#475569]">
            إدارة الإصدارات والتصنيفات المرتبطة بالملاحة العامة للموقع.
          </p>
        </section>

        <section className="rounded-lg border border-[#D9E3EE] bg-white p-6 shadow-[0_22px_60px_rgba(10,37,64,0.10)]">
          <div className="mb-6 flex items-center gap-3 border-b border-[#E2E8F0] pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F0F7FC] text-[#0369A1]">
              <HiOutlineLockClosed className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#003652]">تسجيل الدخول</h2>
              <p className="mt-1 text-sm text-[#64748B]">حساب الإدارة</p>
            </div>
          </div>

          {query.error && (
            <div className="mb-4">
              <Notice tone="error" title="تعذر تسجيل الدخول">
                {query.error === 'invalid' ? 'بيانات الدخول غير صحيحة أو الحساب غير موجود.' : decodeURIComponent(query.error)}
              </Notice>
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <FormBusyOverlay title="جاري تسجيل الدخول" detail="نراجع بيانات الحساب ونجهز لوحة التحكم." />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#334155]">البريد الإلكتروني</span>
              <input
                name="email"
                type="email"
                dir="ltr"
                required
                className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 text-left text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#334155]">كلمة المرور</span>
              <input
                name="password"
                type="password"
                required
                className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
              />
            </label>

            <SubmitButton pendingText="جاري الدخول..." className="h-12 w-full">
              دخول
            </SubmitButton>
          </form>
        </section>
      </div>
    </main>
  );
}
