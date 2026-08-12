import { redirect } from 'next/navigation';
import { HiOutlineExclamationTriangle, HiOutlineUserPlus } from 'react-icons/hi2';
import { googleAuthEnabled } from '@/auth';
import AuthShell from '@/components/auth/AuthShell';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signupUserAction } from '@/lib/user-actions';
import { getUserSession } from '@/lib/user-auth';

export const dynamic = 'force-dynamic';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const user = await getUserSession();
  const query = await searchParams;
  const callbackUrl = query.callbackUrl?.startsWith('/') && !query.callbackUrl.startsWith('//')
    ? query.callbackUrl
    : '/library';

  if (user) redirect(callbackUrl);

  return (
    <AuthShell
      mode="signup"
      callbackUrl={callbackUrl}
      title="أنشئ حساب مكتبتك"
      description="احفظ الإصدارات ونظّمها في رفوف خاصة بك عبر جميع أجهزتك."
    >
      {query.error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          <HiOutlineExclamationTriangle className="mt-0.5 size-5 shrink-0" />
          <span>{query.error}</span>
        </div>
      )}

      <GoogleAuthButton callbackUrl={callbackUrl} enabled={googleAuthEnabled} />

      <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span>أو بالبريد الإلكتروني</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={signupUserAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="signup-name">الاسم الكامل</FieldLabel>
            <Input id="signup-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">البريد الإلكتروني</FieldLabel>
            <Input id="signup-email" name="email" type="email" dir="ltr" autoComplete="email" inputMode="email" required maxLength={254} className="text-start" />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-password">كلمة المرور</FieldLabel>
            <PasswordInput id="signup-password" name="password" autoComplete="new-password" required minLength={8} maxLength={128} />
            <FieldDescription>استخدم 8 أحرف على الأقل، ويفضل مزج الحروف والأرقام.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-confirm-password">تأكيد كلمة المرور</FieldLabel>
            <PasswordInput id="signup-confirm-password" name="confirmPassword" autoComplete="new-password" required minLength={8} maxLength={128} />
          </Field>

          <AuthSubmitButton pendingText="جاري إنشاء الحساب...">
            <HiOutlineUserPlus className="size-5" />
            إنشاء الحساب
          </AuthSubmitButton>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
