'use client';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import ChatbotWidget from '@/components/ChatbotWidget';
import Footer from '@/components/Footer';
import TopNavBar from '@/components/TopNavBar';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

type SiteUser = { id: string; email: string; name: string; image: string | null } | null;

export default function SiteChrome({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SiteUser;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const { locale } = useAppLocale();

  return (
    <>
      <NextTopLoader color="#0369a1" showSpinner={false} />
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
          <TopNavBar user={user} />
          <div id="main-content" tabIndex={-1} className="min-w-0 outline-none">
            {children}
          </div>
          <ChatbotWidget />
          <Footer />
        </>
      )}
    </>
  );
}
