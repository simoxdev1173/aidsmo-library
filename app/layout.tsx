import type { Metadata } from 'next'
import { Manrope, Tajawal } from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader';
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
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
      <body className={`${manrope.variable} ${tajawal.variable}`}>
      <NextTopLoader color="#ea580c" showSpinner={false} /> 
       <div>
          {children}
        </div>
      </body>
    </html>
  )
}