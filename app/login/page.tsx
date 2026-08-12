import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineLockClosed } from 'react-icons/hi2';
import { googleAuthEnabled } from '@/auth';
import AuthShell from '@/components/auth/AuthShell';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginUserAction } from '@/lib/user-actions';
import { getUserSession } from '@/lib/user-auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; reset?: string }>;
}) {
  const user = await getUserSession();
  const query = await searchParams;
  const callbackUrl = query.callbackUrl?.startsWith('/') && !query.callbackUrl.startsWith('//')
    ? query.callbackUrl
    : '/library';

  if (user) redirect(callbackUrl);

  return (
    <AuthShell
      mode="login"
      callbackUrl={callbackUrl}
      title="مرحباً بعودتك"
      description="سجّل دخولك للوصول إلى كتبك ورفوفك المحفوظة."
    >
      {query.error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          <HiOutlineExclamationTriangle className="mt-0.5 size-5 shrink-0" />
          <span>{query.error}</span>
        </div>
      )}

      {query.reset === 'success' && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-800">
          <HiOutlineCheckCircle className="mt-0.5 size-5 shrink-0" />
          <span>تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</span>
        </div>
      )}

      <GoogleAuthButton callbackUrl={callbackUrl} enabled={googleAuthEnabled} />

      <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span>أو بالبريد الإلكتروني</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={loginUserAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">البريد الإلكتروني</FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              className="text-start"
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-3 px-1">
              <FieldLabel htmlFor="login-password" className="p-0">كلمة المرور</FieldLabel>
              <Link
                href={`/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-xs font-bold text-[#8B681C] transition hover:text-[#0369A1] focus:outline-none focus:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
          </Field>

          <AuthSubmitButton pendingText="جاري تسجيل الدخول...">
            <HiOutlineLockClosed className="size-5" />
            الدخول إلى الحساب
          </AuthSubmitButton>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
