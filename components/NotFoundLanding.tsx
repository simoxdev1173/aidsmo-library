import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineHome } from 'react-icons/hi2';

export default function NotFoundLanding({ archive = false }: { archive?: boolean }) {
  return (
    <main data-error-page dir="rtl" className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#062B46] px-4 py-24 text-[#082F50] sm:px-6">
      <Image
        src="/standardization-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none scale-105 object-cover object-center blur-[3px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0B5688]/65" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(6,43,70,0.72),rgba(5,61,105,0.22)_55%,rgba(6,43,70,0.7))]" aria-hidden="true" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/30 bg-white/95 px-6 py-12 text-center shadow-[0_32px_90px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:px-12 sm:py-16">
        <span className="mx-auto mb-5 block h-1 w-16 rounded-full bg-[#C29C41]" aria-hidden="true" />
        <p className="font-display text-7xl font-black leading-none text-[#C29C41] sm:text-8xl" aria-label="خطأ 404">404</p>
        <h1 className="mt-6 font-academic text-2xl font-black leading-relaxed text-[#082F50] sm:text-4xl">
          {archive ? 'هذه الصفحة قيد التطوير' : 'الصفحة غير موجودة'}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#64748B] sm:text-base">
          {archive
            ? 'نعمل على تجهيز هذا القسم من الأرشيف. يمكنك العودة إلى الصفحة الرئيسية ومتابعة استكشاف المكتبة الرقمية.'
            : 'قد يكون الرابط غير صحيح أو تغيّر عنوان الصفحة. يمكنك العودة إلى الصفحة الرئيسية ومتابعة التصفح.'}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#082F50] px-7 text-sm font-bold text-white transition hover:bg-[#0B5688] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C29C41]"
        >
          <HiOutlineHome className="size-5" aria-hidden="true" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
