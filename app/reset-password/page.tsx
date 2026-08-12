import Link from 'next/link';
import { HiOutlineExclamationTriangle, HiOutlineKey } from 'react-icons/hi2';
import AuthShell from '@/components/auth/AuthShell';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { isPasswordResetTokenValid, resetPasswordAction } from '@/lib/password-reset-actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'إنشاء كلمة مرور جديدة | المكتبة الرقمية الذكية',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    token?: string;
    error?: string;
    status?: string;
    callbackUrl?: string;
  }>;
}) {
  const query = await searchParams;
  const email = query.email?.trim().toLowerCase() ?? '';
  const token = query.token?.trim() ?? '';
  const callbackUrl = query.callbackUrl?.startsWith('/') && !query.callbackUrl.startsWith('//')
    ? query.callbackUrl
    : '/library';
  const tokenIsValid = query.status !== 'invalid' && email && token
    ? await isPasswordResetTokenValid(email, token)
    : false;

  return (
    <AuthShell
      callbackUrl={callbackUrl}
      showTabs={false}
      title="أنشئ كلمة مرور جديدة"
      description="اختر كلمة مرور قوية لم تستخدمها سابقاً لهذا الحساب."
    >
      {tokenIsValid ? (
        <>
          {query.error && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
              <HiOutlineExclamationTriangle className="mt-0.5 size-5 shrink-0" />
              <span>{query.error}</span>
            </div>
          )}

          <form action={resetPasswordAction} className="mt-7">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="new-password">كلمة المرور الجديدة</FieldLabel>
                <PasswordInput id="new-password" name="password" autoComplete="new-password" required minLength={8} maxLength={128} />
                <FieldDescription>استخدم 8 أحرف على الأقل، ويفضل مزج الحروف والأرقام.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-new-password">تأكيد كلمة المرور الجديدة</FieldLabel>
                <PasswordInput id="confirm-new-password" name="confirmPassword" autoComplete="new-password" required minLength={8} maxLength={128} />
              </Field>

              <AuthSubmitButton pendingText="جاري تحديث كلمة المرور...">
                <HiOutlineKey className="size-5" />
                حفظ كلمة المرور الجديدة
              </AuthSubmitButton>
            </FieldGroup>
          </form>
        </>
      ) : (
        <div className="mt-7 grid gap-5">
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold leading-6 text-amber-900">
            <HiOutlineExclamationTriangle className="mt-0.5 size-5 shrink-0" />
            <span>رابط الاستعادة غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً للمتابعة.</span>
          </div>
          <Button asChild variant="navy" size="lg">
            <Link href={`/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`}>طلب رابط استعادة جديد</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
