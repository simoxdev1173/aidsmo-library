'use client';

import { useFormStatus } from 'react-dom';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { googleSignInAction } from '@/lib/user-actions';

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.55h3.24c1.9-1.75 2.98-4.33 2.98-7.42Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.55c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.63A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.85A6 6 0 0 1 6.07 12c0-.64.11-1.26.32-1.85V7.52H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.48l3.35-2.63Z" />
      <path fill="#EA4335" d="M12 6.02c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.63C7.18 7.78 9.39 6.02 12 6.02Z" />
    </svg>
  );
}

function SubmitButton({ enabled }: { enabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!enabled || pending}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0A2540] shadow-sm transition hover:border-[#0369A1]/40 hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-55"
    >
      {pending ? <HiOutlineArrowPath className="h-5 w-5 animate-spin text-[#0369A1]" /> : <GoogleIcon />}
      {pending ? 'جارٍ الاتصال بـ Google...' : enabled ? 'المتابعة باستخدام Google' : 'Google غير مهيأ بعد'}
    </button>
  );
}

export default function GoogleAuthButton({
  callbackUrl,
  enabled,
}: {
  callbackUrl: string;
  enabled: boolean;
}) {
  return (
    <form action={googleSignInAction} className="mt-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <SubmitButton enabled={enabled} />
    </form>
  );
}
