import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Amiri, Cinzel, Manrope, Readex_Pro } from 'next/font/google'
import './globals.css'
import SiteChrome, { SiteNavigation, SiteNavigationFallback } from '@/components/SiteChrome';
import LocaleProvider from '@/lib/i18n/LocaleProvider';
import { getUserSession } from '@/lib/user-auth';
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
  return <SiteNavigation user={user} />;
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
