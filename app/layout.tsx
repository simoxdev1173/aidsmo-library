import type { Metadata } from 'next'
import { Manrope, Readex_Pro } from 'next/font/google' // Changed here
import './globals.css'
import NextTopLoader from 'nextjs-toploader';
import TopNavBar from '@/components/TopNavBar';
import Footer from '@/components/Footer';
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'], // Added a wider range of weights
  variable: '--font-readex',
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
      {/* Updated the variable name to readexPro.variable */}
      <body className={`${manrope.variable} ${readexPro.variable} font-arabic`}>
        <TopNavBar  />
        <NextTopLoader color="#0369a1" showSpinner={false} /> 
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}