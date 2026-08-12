import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineEnvelope, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import AuthShell from '@/components/auth/AuthShell';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requestPasswordResetAction } from '@/lib/password-reset-actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'استعادة كلمة المرور | المكتبة الرقمية الذكية',
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    status?: string;
    callbackUrl?: string;
    previewToken?: string;
    previewEmail?: string;
  }>;
}) {
  const query = await searchParams;
  const callbackUrl = query.callbackUrl?.startsWith('/') && !query.callbackUrl.startsWith('//')
    ? query.callbackUrl
    : '/library';
  const previewHref = process.env.NODE_ENV !== 'production' && query.previewToken && query.previewEmail
    ? `/reset-password?${new URLSearchParams({
      token: query.previewToken,
      email: query.previewEmail,
      callbackUrl,
    }).toString()}`
    : null;

  return (
    <AuthShell
      callbackUrl={callbackUrl}
      showTabs={false}
      title="استعادة كلمة المرور"
      description="أدخل بريد حسابك وسنرسل إليك رابطاً آمناً لإنشاء كلمة مرور جديدة."
    >
      {query.error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          <HiOutlineExclamationTriangle className="mt-0.5 size-5 shrink-0" />
          <span>{query.error}</span>
        </div>
      )}

      {query.status === 'sent' ? (
        <div className="mt-7 grid gap-5">
          <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold leading-6 text-emerald-800">
            <HiOutlineCheckCircle className="mt-0.5 size-5 shrink-0" />
            <span>إذا كان البريد مرتبطاً بحساب، فستصل إليه رسالة الاستعادة خلال دقائق. تحقق أيضاً من مجلد الرسائل غير المرغوب فيها.</span>
          </div>

          {previewHref && (
            <div className="rounded-xl border border-[#C29C41]/35 bg-[#FFF8E8] p-4 text-sm leading-6 text-[#6F5418]">
              <p className="font-bold">معاينة التطوير المحلي</p>
              <p className="mt-1 text-xs">إرسال البريد غير مهيأ محلياً، لذلك يتوفر رابط الاختبار هنا فقط ولن يظهر في الإنتاج.</p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={previewHref}>فتح رابط الاستعادة</Link>
              </Button>
            </div>
          )}

          <Button asChild variant="navy" size="lg">
            <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>العودة إلى تسجيل الدخول</Link>
          </Button>
        </div>
      ) : (
        <form action={requestPasswordResetAction} className="mt-7 grid gap-6">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <Field>
            <FieldLabel htmlFor="recovery-email">البريد الإلكتروني</FieldLabel>
            <Input
              id="recovery-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              className="text-start"
              placeholder="name@example.com"
            />
            <FieldDescription>لأمان حسابك، ستظهر الرسالة نفسها سواء كان البريد مسجلاً أم لا.</FieldDescription>
          </Field>

          <AuthSubmitButton pendingText="جاري إرسال الرابط...">
            <HiOutlineEnvelope className="size-5" />
            إرسال رابط الاستعادة
          </AuthSubmitButton>
        </form>
      )}

      {query.status !== 'sent' && (
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0369A1] hover:text-[#8B681C]">
          <HiOutlineArrowRight className="size-4" /> العودة إلى تسجيل الدخول
        </Link>
      )}
    </AuthShell>
  );
}
