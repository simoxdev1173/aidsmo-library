'use client';

import { usePathname } from 'next/navigation';
import LazyChatbotWidget from '@/components/LazyChatbotWidget';
import LazyWebsiteFeedbackWidget from '@/components/LazyWebsiteFeedbackWidget';
import Footer from '@/components/Footer';
import TopNavBar from '@/components/TopNavBar';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

type SiteUser = { id: string; email: string; name: string; image: string | null } | null;

export function SiteNavigation({ user, unreadCount }: { user: SiteUser; unreadCount: number }) {
  return <TopNavBar user={user} unreadCount={unreadCount} />;
}

export function SiteNavigationFallback() {
  return (
    <header
      aria-label="جارٍ تحميل شريط التنقل"
      className="sticky top-0 z-[60] h-44 bg-[#053D69] md:h-36"
    >
      <div dir="rtl" className="mx-auto flex h-[76px] max-w-[96rem] items-center justify-between gap-6 px-5 md:h-[88px]">
        <div className="h-12 w-24 animate-pulse rounded-lg bg-white/15 motion-reduce:animate-none" />
        <div className="hidden h-11 w-2/5 max-w-lg animate-pulse rounded-full bg-white/15 motion-reduce:animate-none md:block" />
        <div className="h-12 w-28 animate-pulse rounded-full bg-[#E8C96A]/25 motion-reduce:animate-none" />
      </div>
      <div className="mx-5 h-10 animate-pulse rounded-full bg-white/15 motion-reduce:animate-none md:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-[52px] border-t border-[#E8C96A]/30 bg-[#053D69] md:h-14" />
    </header>
  );
}

export default function SiteChrome({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const { locale } = useAppLocale();

  return (
    <>
      {isDashboard ? (
        children
      ) : (
        <>
          <a
            href="#main-content"
            className="fixed start-4 top-3 z-[130] -translate-y-20 rounded-full bg-[#082F50] px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2"
          >
            {locale === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}
          </a>
          {navigation}
          <div id="main-content" tabIndex={-1} className="min-w-0 outline-none">
            {children}
          </div>
          <LazyChatbotWidget />
          <LazyWebsiteFeedbackWidget />
          <Footer />
        </>
      )}
    </>
  );
}
