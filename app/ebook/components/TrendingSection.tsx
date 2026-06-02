'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { LuArrowLeft, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type Book = {
  id: string;
  title: string;
  year?: string;
  cover: string;
  href: string;
};

type Sector = {
  key: 'industry' | 'mining' | 'standardization';
  title: string;
  description: string;
  books: Book[];
};

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

const sectors: Sector[] = [
  {
    key: 'industry',
    title: 'الأكثر رواجاً في الصناعة',
    description: 'مختارات حديثة ومرتفعة التحميل ضمن قطاع الصناعة.',
    books: [
      { id: 'ind-1', title: 'المؤشرات الإقتصادية و الصناعية في الدول العربية', year: '2024', cover: '/industry-covers/b-1.jpg', href: '/book/ind-1' },
      { id: 'ind-2', title: 'التجارب العربية في مجال ربط الأكاديميا بالصناعة', year: '2024', cover: '/industry-covers/b-2.jpg', href: '/book/ind-2' },
      { id: 'ind-3', title: 'التنمية الصناعية العربية', year: '2013', cover: '/trendingSection/t-3.png', href: '/book/ind-3' },
      { id: 'ind-4', title: 'التنمية الصناعية العربية', year: '2025', cover: '/industry-covers/b-3.jpg', href: '/book/ind-4' },
      { id: 'ind-5', title: 'التنمية الصناعية العربية', year: '2025', cover: '/industry-covers/b-5.jpg', href: '/book/ind-5' },
    ],
  },
];

const SectionRow = ({ sector }: { sector: Sector }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onPrev = () => scrollerRef.current && scrollByAmount(scrollerRef.current, 720);
  const onNext = () => scrollerRef.current && scrollByAmount(scrollerRef.current, -720);

  return (
    <div className="corner-frame overflow-hidden border border-[#C29C41]/35 bg-white/90 shadow-[0_18px_46px_rgba(10,37,64,0.08)]">
      <div className="brass-gradient h-1 w-full" />

      <div className="p-5 sm:p-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="academic-heading mt-3 text-3xl md:text-4xl">{sector.title}</h3>
            <p className="mt-2 font-academic text-lg leading-relaxed text-[#475569]">{sector.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C29C41]/50 bg-white text-[#C29C41] transition duration-300 hover:bg-[#C29C41] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#F8FAFC]"
              aria-label="السابق"
            >
              <LuChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C29C41]/50 bg-white text-[#C29C41] transition duration-300 hover:bg-[#C29C41] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#F8FAFC]"
              aria-label="التالي"
            >
              <LuChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sector.books.map((book) => (
            <Link
              key={book.id}
              href={book.href}
              className="group w-[260px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-4 focus:ring-offset-[#F8FAFC] sm:w-[300px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-[#C29C41]/25 bg-white shadow-sm ">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="sepia-reveal object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/55 via-transparent to-transparent opacity-80" />

                {book.year && (
                  <span className="wax-seal absolute left-3 top-4 flex h-14 w-14 items-center justify-center rounded-full font-display text-[0.65rem] font-bold text-[#0A2540]">
                    {book.year}
                  </span>
                )}

                <span className="absolute bottom-4 right-4 text-lg text-[#E8C96A]" aria-hidden>
                  ✶
                </span>
              </div>

              <h4 className="mt-4 line-clamp-2 min-h-[3.25rem] text-base font-bold leading-relaxed text-[#003652] transition duration-300 group-hover:text-[#C29C41]">
                {book.title}
              </h4>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-[#0369A1]/10 pt-6">
          <Link
            href={`/catalog/${sector.key}`}
            className="engraved brass-gradient inline-flex h-11 items-center gap-2 border border-[#C29C41] px-5 text-sm font-bold text-[#0A2540] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#F8FAFC]"
          >
            عرض المزيد
            <LuArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C29C41]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C29C41]/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C29C41]/25" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingBooks = () => {
  return (
    <section id="projects" className="relative overflow-hidden bg-[#F0F7FC] py-20 md:py-28" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.075]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.78) 1px, transparent 1px), linear-gradient(90deg, rgba(10,37,64,0.78) 1px, transparent 1px)',
          backgroundSize: '76px 76px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(240,247,252,0.68)_0%,rgba(248,250,252,0.88)_42%,rgba(240,247,252,0.72)_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#C29C41]/25" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-5xl">
            كنوز المكتبة الرقمية
          </h2>
          <p className="mt-5 font-academic text-xl leading-relaxed text-[#475569]">
            مجموعات رائجة من مجلات علمية ودراسات متخصصة وتقارير تقنية، معروضة كرفوف معرفة قابلة للتصفح.
          </p>
          <div className="mx-auto mt-7 max-w-md [--divider-bg:#F0F7FC]">
            <div className="ornate-divider" aria-hidden />
          </div>
        </div>

        <div className="space-y-6">
          {sectors.map((sector) => (
            <SectionRow key={sector.key} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBooks;
