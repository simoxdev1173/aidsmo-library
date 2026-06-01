import type { Metadata } from 'next'
import { Amiri, Cinzel, Manrope, Readex_Pro } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${manrope.variable} ${readexPro.variable} ${amiri.variable} ${cinzel.variable} font-arabic academic-atmosphere`}>
        <SiteChrome>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}
