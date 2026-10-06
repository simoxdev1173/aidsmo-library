'use client';

import { usePathname } from 'next/navigation';
import LazyChatbotWidget from '@/components/LazyChatbotWidget';
import LazyWebsiteFeedbackWidget from '@/components/LazyWebsiteFeedbackWidget';
import Footer from '@/components/Footer';
import TopNavBar from '@/components/TopNavBar';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

type SiteUser = { id: string; email: string; name: string; image: string | null } | null;

export function SiteNavigation({ user }: { user: SiteUser }) {
  return <TopNavBar user={user} />;
}

export function SiteNavigationFallback() {
  return (
    <header
      aria-label="جارٍ تحميل شريط التنقل"
      className="fixed inset-x-0 top-0 z-[60] h-20 bg-[#0A2540] px-5 md:h-24"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6">
        <div className="h-12 w-24 animate-pulse rounded-lg bg-white/15 motion-reduce:animate-none" />
        <div className="hidden h-10 w-2/3 max-w-2xl animate-pulse rounded-full bg-white/10 motion-reduce:animate-none md:block" />
        <div className="h-11 w-11 animate-pulse rounded-full bg-white/15 motion-reduce:animate-none" />
      </div>
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
            className="fixed start-4 top-3 z-[130] -translate-y-20 rounded-full bg-[#0A2540] px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2"
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
