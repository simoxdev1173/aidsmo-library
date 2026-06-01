'use client';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import ChatbotWidget from '@/components/ChatbotWidget';
import Footer from '@/components/Footer';
import TopNavBar from '@/components/TopNavBar';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      <NextTopLoader color="#0369a1" showSpinner={false} />
      {isDashboard ? (
        children
      ) : (
        <>
          <TopNavBar />
          {children}
          <ChatbotWidget />
          <Footer />
        </>
      )}
    </>
  );
}
