import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type AuthMode = 'login' | 'signup';

function tabHref(path: '/login' | '/signup', callbackUrl: string) {
  return `${path}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export default function AuthShell({
  mode,
  callbackUrl = '/library',
  title,
  description,
  children,
  showTabs = true,
}: {
  mode?: AuthMode;
  callbackUrl?: string;
  title: string;
  description: string;
  children: ReactNode;
  showTabs?: boolean;
}) {
  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#022A4E] via-[#073E68] to-[#0A2540] px-4 pb-16 pt-32 text-[#0A2540] sm:px-6 sm:pt-36">
      <div className="pointer-events-none absolute -start-32 top-12 size-[30rem] rounded-full bg-[#0369A1]/30 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-24 bottom-0 size-[25rem] rounded-full bg-[#C29C41]/20 blur-[110px]" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-[0_32px_90px_rgba(0,0,0,0.32)] lg:grid-cols-[1.12fr_0.88fr]">
        <section className="px-5 py-7 sm:px-10 sm:py-10 lg:px-12" aria-labelledby="auth-title">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
              <Image src="/logo-3d-3d.png" alt="المكتبة الرقمية" width={68} height={62} className="h-14 w-auto object-contain" priority />
            </Link>
            <span className="hidden text-xs font-bold text-[#8B681C] sm:inline">حساب المكتبة</span>
          </div>

          {showTabs && mode && (
            <div role="tablist" aria-label="الدخول أو التسجيل" className="mt-7 grid grid-cols-2 rounded-2xl bg-[#EDF4F9] p-1.5">
              <Link
                role="tab"
                aria-selected={mode === 'login'}
                href={tabHref('/login', callbackUrl)}
                className={cn(
                  'flex h-11 items-center justify-center rounded-xl text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#C29C41]',
                  mode === 'login' ? 'bg-white text-[#0B4E84] shadow-sm' : 'text-[#64748B] hover:text-[#0B4E84]',
                )}
              >
                تسجيل الدخول
              </Link>
              <Link
                role="tab"
                aria-selected={mode === 'signup'}
                href={tabHref('/signup', callbackUrl)}
                className={cn(
                  'flex h-11 items-center justify-center rounded-xl text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#C29C41]',
                  mode === 'signup' ? 'bg-white text-[#0B4E84] shadow-sm' : 'text-[#64748B] hover:text-[#0B4E84]',
                )}
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          <div className="mt-7">
            <p className="text-xs font-bold tracking-[0.16em] text-[#C29C41]">المكتبة الرقمية الذكية</p>
            <h1 id="auth-title" className="mt-2 font-academic text-2xl font-black leading-tight text-[#0A2540] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">{description}</p>
          </div>

          {children}
        </section>

        <aside className="relative hidden min-h-full overflow-hidden bg-[#0A2540] lg:block" aria-label="المنظمة العربية للتنمية الصناعية والتقييس والتعدين">
          <Image
            src="/section-4-card.png"
            alt="شعار المنظمة العربية للتنمية الصناعية والتقييس والتعدين في مشهد صناعي"
            fill
            priority
            sizes="(min-width: 1024px) 390px, 0px"
            className="object-cover object-center"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2540]/20 via-transparent to-white/5" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" aria-hidden="true" />
        </aside>
      </div>
    </main>
  );
}
