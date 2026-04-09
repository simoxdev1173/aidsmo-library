'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuArrowLeft } from 'react-icons/lu';
import { LayoutGroup, motion } from "motion/react";
import TextRotate from "./subComponents/text-rotate";

type Book = {
  id: string;
  title: string;
  author?: string;
  year?: string;
  cover: string;
  href: string;
};

type Sector = {
  key: 'industry' | 'mining' | 'standardization';
  title: string;
  description?: string;
  books: Book[];
};

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

const SectionRow = ({ sector, accent }: { sector: Sector; accent: string }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isGold = accent === '#C29C41';

  const onPrev = () => scrollerRef.current && scrollByAmount(scrollerRef.current, 720);
  const onNext = () => scrollerRef.current && scrollByAmount(scrollerRef.current, -720);

  return (
    <div
      className="overflow-hidden rounded-3xl shadow-sm border"
      style={{
        borderColor: `${accent}25`,
        background: isGold
          ? 'linear-gradient(135deg, #fffdf5 0%, #ffffff 60%)'
          : 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: isGold
            ? 'linear-gradient(to left, transparent, #C29C41, #e8c96a, #C29C41, transparent)'
            : 'linear-gradient(to left, transparent, #0369A1, #5aabf7, #0369A1, transparent)',
        }}
      />

      <div className="p-6 sm:p-8">
        {/* Title + nav */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Accent pip */}
            <span
              className="h-8 w-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: accent }}
            />
            <div>
              <h3
                className="text-base font-bold"
                style={{ color: isGold ? '#7a5c10' : '#003652' }}
              >
                {sector.title}
              </h3>
              {sector.description && (
                <p className="mt-0.5 text-xs text-slate-500">{sector.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 hover:text-white"
              style={{ borderColor: accent, color: accent }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = accent;
                (e.currentTarget as HTMLButtonElement).style.color = isGold ? '#3a2800' : '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = accent;
              }}
              aria-label="السابق"
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
            {/* Next */}
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200"
              style={{ borderColor: accent, color: accent }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = accent;
                (e.currentTarget as HTMLButtonElement).style.color = isGold ? '#3a2800' : '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = accent;
              }}
              aria-label="التالي"
            >
              <LuChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sector.books.map((book) => (
            <Link
              key={book.id}
              href={book.href}
              className="group flex-shrink-0"
              style={{ scrollSnapAlign: 'start', width: '300px' }}
            >
              {/* Cover */}
              <div
                className="relative w-full overflow-hidden rounded-2xl shadow-sm"
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Year badge */}
                {book.year && (
                  <span
                    className="absolute bottom-2 left-2 rounded-md px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm"
                    style={{ backgroundColor: `${accent}cc` }}
                  >
                    {book.year}
                  </span>
                )}
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to top, ${accent}66 0%, transparent 65%)`,
                  }}
                />
              </div>

              {/* Meta */}
              {/* <div className="mt-3 px-0.5">
                <p className="line-clamp-2 text-[0.8rem] font-semibold leading-snug text-slate-800 group-hover:text-[var(--accent)] transition-colors duration-200">
                  {book.title}
                </p>
                {book.author && (
                  <p className="mt-1 truncate text-[0.72rem] text-slate-400">{book.author}</p>
                )}
              </div> */}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-6 pt-5 flex items-center justify-between"
          style={{ borderTop: `1px solid ${accent}20` }}
        >
          <Link
            href={`/catalog/${sector.key}`}
            className="group inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 hover:gap-3 hover:shadow-md"
            style={{
              backgroundColor: accent,
              color: isGold ? '#3a2800' : '#ffffff',
            }}
          >
            عرض المزيد
            <LuArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>

          {/* Decorative dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="h-1.5 w-1.5 rounded-full opacity-50" style={{ backgroundColor: accent }} />
            <span className="h-1.5 w-1.5 rounded-full opacity-25" style={{ backgroundColor: accent }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ACCENTS = ['#0369A1', '#C29C41', '#0369A1'];

const TrendingBooks = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sectors = useMemo<Sector[]>(() => [
    {
      key: 'industry',
      title: 'الأكثر رواجاً في الصناعة',
      description: 'مختارات حديثة ومرتفعة التحميل ضمن قطاع الصناعة.',
      books: [
        { id: 'ind-1', title: 'المٍؤشرات الإقتصادية و الصناعية في الدول العربية', author: '', year: '2024', cover: '/industry-covers/b-1.jpg', href: '/book/ind-1' },
        { id: 'ind-2', title: 'التجارب العربية في مجال ربط الأكاديميا بالصناعة', author: '', year: '2024', cover: '/industry-covers/b-2.jpg', href: '/book/ind-2' },
        { id: 'ind-3', title: 'التنمية الصناعية العربية', author: '', year: '2013', cover: '/trendingSection/t-3.png', href: '/book/ind-3' },
        { id: 'ind-4', title: 'التنمية الصناعية العربية', author: '', year: '2025', cover: '/industry-covers/b-3.jpg', href: '/book/ind-4' },
        { id: 'ind-5', title: 'التنمية الصناعية العربية', author: '', year: '2025', cover: '/industry-covers/b-5.jpg', href: '/book/ind-5' },
      ],
    },
  ], []);

  return (
    <section id="projects" className="bg-white py-16 lg:py-24" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">

         

          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">
            كنوز المكتبة الرقمية: المجموعات الرائجة
          </h2>

        
          <div className="mt-4">
            {mounted ? (
              <LayoutGroup>
                <motion.p
                  className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 sm:text-base"
                  layout
                  dir="rtl"
                  lang="ar"
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  >
                    بوابتك إلى
                  </motion.span>
                  <TextRotate
                    texts={['مجلات علمية', 'دراسات متخصصة', 'أوراق علمية', 'بحوث صناعية', 'تقارير تقنية', 'مواصفات قياسية']}
                    splitBy="words"
                    mainClassName="text-white px-3 bg-[#0369A1] overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    staggerDuration={0.04}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </motion.p>
              </LayoutGroup>
            ) : (
              <p className="text-sm text-slate-500 sm:text-base" dir="rtl" lang="ar">
                بوابتك إلى{' '}
                <span className="rounded-lg bg-[#0369A1] px-2 py-1 text-white">مجلات علمية</span>
              </p>
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-6">
          {sectors.map((sector, i) => (
            <SectionRow key={sector.key} sector={sector} accent={ACCENTS[i % ACCENTS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBooks;