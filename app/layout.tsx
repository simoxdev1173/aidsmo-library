import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Amiri, Cinzel, Manrope, Readex_Pro } from 'next/font/google'
import './globals.css'
import SiteChrome, { SiteNavigation, SiteNavigationFallback } from '@/components/SiteChrome';
import LocaleProvider from '@/lib/i18n/LocaleProvider';
import { getUserSession } from '@/lib/user-auth';
import { getUnreadNotificationCount } from '@/lib/notifications';
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'المكتبة الرقمية الذكية',
  description: 'المكتبة الرقمية الذكية',
}

async function AuthenticatedNav() {
  const user = await getUserSession();
  const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;
  return <SiteNavigation user={user} unreadCount={unreadCount} />;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const savedLocale = (await cookies()).get('aidsmo-locale')?.value;
  const locale = savedLocale === 'en' ? 'en' : 'ar';
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var nav = performance.getEntriesByType('navigation')[0];
            if (nav && nav.type === 'reload') {
              history.scrollRestoration = 'manual';
              if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
              var resetScroll = function () { window.scrollTo(0, 0); };
              resetScroll();
              document.addEventListener('DOMContentLoaded', resetScroll, { once: true });
              window.addEventListener('load', resetScroll, { once: true });
            }
          } catch (_) {}
        ` }} />
      </head>
      <body className={`${manrope.variable} ${readexPro.variable} ${amiri.variable} ${cinzel.variable} font-arabic`}>
        <LocaleProvider initialLocale={locale}>
          <SiteChrome navigation={
            <Suspense fallback={<SiteNavigationFallback />}>
              <AuthenticatedNav />
            </Suspense>
          }>{children}</SiteChrome>
        </LocaleProvider>
      </body>
    </html>
  )
}
