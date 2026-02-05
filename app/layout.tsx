import type { Metadata } from 'next'
import { Manrope, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'المكتبة الرقمية | خدمات رقمية متكاملة',
  description: 'نقدم أفضل الخدمات الرقمية للمكتبات والمؤسسات الثقافية - تطوير المواقع، التسويق الرقمي، التصميم الجرافيكي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${manrope.variable} ${notoSansArabic.variable} font-arabic`}>
        <NextTopLoader color="#0369a1" showSpinner={false} /> 
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}