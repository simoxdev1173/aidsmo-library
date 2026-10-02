import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArchiveBox, HiOutlineChevronLeft } from 'react-icons/hi2';
import { archivePages, type ArchivePagePath } from '@/lib/archive-pages';

export default function ArchiveEmptyPage({ path }: { path: ArchivePagePath }) {
  const page = archivePages[path];
  const segments = path.split('/').filter(Boolean);
  const ancestors = segments.slice(0, -1).map((_, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}` as ArchivePagePath;
    return { href, title: archivePages[href].title };
  });

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative overflow-hidden border-b border-[#C29C41]/25 bg-[#071D2F] text-white">
        <Image src="/standardization-bg.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.94),rgba(3,105,161,0.64)_55%,rgba(7,29,47,0.86))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-36 sm:px-6 lg:px-8 lg:pb-16 lg:pt-40">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
            <Image src="/aidsmo-logo.png" alt="" width={30} height={30} className="h-7 w-7 object-contain" />
            <span className="font-display text-[0.65rem] font-bold tracking-[0.12em] text-[#E8C96A]">{page.group}</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-academic text-3xl font-bold leading-[1.4] sm:text-4xl lg:text-5xl">{page.title}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="مسار الصفحة" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
          <Link href="/" className="transition-colors hover:text-[#0369A1]">الرئيسية</Link>
          <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
          {ancestors.map((ancestor) => (
            <span key={ancestor.href} className="inline-flex items-center gap-2">
              <Link href={ancestor.href} className="transition-colors hover:text-[#0369A1]">{ancestor.title}</Link>
              <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
            </span>
          ))}
          <span className="font-semibold text-[#0A2540]" aria-current="page">{page.title}</span>
        </nav>

        <section aria-label={`محتوى ${page.title}`} className="overflow-hidden rounded-[18px] border border-[#DCE6EF] bg-white shadow-[0_12px_34px_rgba(10,37,64,0.055)]">
          <div className="h-1.5 bg-gradient-to-l from-[#C29C41] via-[#E8C96A] to-[#0369A1]" aria-hidden="true" />
          <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center sm:min-h-96">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C29C41]/30 bg-[#FBF7EA] text-[#9B7626]">
              <HiOutlineArchiveBox className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-academic text-xl font-bold text-[#003652]">المحتوى سيُضاف هنا لاحقاً</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
