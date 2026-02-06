'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
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

const SectionRow = ({ sector }: { sector: Sector }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onPrev = () => {
    if (!scrollerRef.current) return;
    scrollByAmount(scrollerRef.current, 720);
  };

  const onNext = () => {
    if (!scrollerRef.current) return;
    scrollByAmount(scrollerRef.current, -720);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[white] p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            {sector.title}
          </h3>
          {sector.description ? (
            <p className="mt-1 text-sm text-slate-600">{sector.description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            aria-label="السابق"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            aria-label="التالي"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {sector.books.map((book) => (
          <Link
            key={book.id}
            href={book.href}
            className="min-w-[240px] max-w-[240px] sm:min-w-[280px] sm:max-w-[280px] flex-shrink-0 scroll-mx-2"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-base font-semibold text-slate-900 sm:text-[15px]">
                  {book.title}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span className="truncate">{book.author ?? '—'}</span>
                  <span className="shrink-0">{book.year ?? ''}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <Link
          href={`/catalog/${sector.key}`}
          className="inline-flex items-center justify-center rounded-lg bg-[#0369a1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#075985]"
        >
          عرض المزيد
        </Link>
      </div>
    </div>
  );
};

const TrendingBooks = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

const sectors = useMemo<Sector[]>(
    () => [
      {
        key: 'industry',
        title: 'الأكثر رواجاً في الصناعة',
        description: 'مختارات حديثة ومرتفعة التحميل ضمن قطاع الصناعة.',
        books: [
          {
            id: 'ind-1',
            title: 'التصنيع الذكي والتحول الرقمي',
            author: '—',
            year: '2025',
            cover: '/trendingSection/t-1.png',
            href: '/book/ind-1',
          },
          {
            id: 'ind-2',
            title: 'إدارة الجودة في سلاسل الإمداد',
            author: '—',
            year: '2024',
            cover: '/trendingSection/t-2.jpg',
            href: '/book/ind-2',
          },
          {
            id: 'ind-3',
            title: 'مقدمة في اقتصاديات الصناعة',
            author: '—',
            year: '2023',
            cover: '/trendingSection/t-3.png',
            href: '/book/ind-3',
          },
          {
            id: 'ind-4',
            title: 'الابتكار الصناعي وتطوير المنتجات',
            author: '—',
            year: '2024',
            cover: '/trendingSection/t-4.jpg',
            href: '/book/ind-4',
          },
          {
            id: 'ind-5',
            title: 'السلامة المهنية في المنشآت الصناعية',
            author: '—',
            year: '2022',
            cover: '/trendingSection/t-7.png',
            href: '/book/ind-5',
          },
        ],
      },
      {
        key: 'mining',
        title: 'الأكثر رواجاً في التعدين',
        description: 'كتب وتقارير أساسية حول الاستكشاف والمعالجة والاستدامة.',
        books: [
          {
            id: 'min-1',
            title: 'مدخل إلى جيولوجيا التعدين',
            author: '—',
            year: '2023',
            cover: '/trendingSection/t-5.png',
            href: '/book/min-1',
          },
          {
            id: 'min-2',
            title: 'تقنيات الاستكشاف المعدني الحديثة',
            author: '—',
            year: '2024',
            cover: '/trendingSection/t-6.png',
            href: '/book/min-2',
          },
          {
            id: 'min-3',
            title: 'معالجة الخامات والتعويم',
            author: '—',
            year: '2022',
            cover: '/trendingSection/t-9.png',
            href: '/book/min-3',
          },
          {
            id: 'min-4',
            title: 'التعدين المستدام وإدارة المخلفات',
            author: '—',
            year: '2025',
            cover: '/trendingSection/t-11.png',
            href: '/book/min-4',
          },
          {
            id: 'min-5',
            title: 'اقتصاديات التعدين وسلاسل القيمة',
            author: '—',
            year: '2021',
            cover: '/trendingSection/t-10.png',
            href: '/book/min-5',
          },
        ],
      },
      {
        key: 'standardization',
        title: 'الأكثر رواجاً في التقييس',
        description: 'أدلة ومعايير ومراجع داعمة للامتثال والتحسين المستمر.',
        books: [
          {
            id: 'std-1',
            title: 'أساسيات المواصفات القياسية',
            author: '—',
            year: '2022',
            cover: '/trendingSection/t-1.png',
            href: '/book/std-1',
          },
          {
            id: 'std-2',
            title: 'نظم إدارة الجودة (ISO) – دليل عملي',
            author: '—',
            year: '2024',
            cover: '/trendingSection/t-1.png',
            href: '/book/std-2',
          },
          {
            id: 'std-3',
            title: 'تقييم المطابقة وإجراءات الاعتماد',
            author: '—',
            year: '2023',
            cover: '/trendingSection/t-1.png',
            href: '/book/std-3',
          },
          {
            id: 'std-4',
            title: 'السلامة والامتثال في المنتجات',
            author: '—',
            year: '2025',
            cover: '/trendingSection/t-1.png',
            href: '/book/std-4',
          },
          {
            id: 'std-5',
            title: 'القياس والمعايرة والجودة',
            author: '—',
            year: '2021',
            cover: '/trendingSection/t-1.png',
            href: '/book/std-5',
          },
        ],
      },
    ],
    []
  );

  return (
    <section id="projects" className="py-10 bg-[#F0F7FC] lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            كنوز المكتبة الرقمية: المجموعات الرائجة
          </h2>

          {/* Render the animated line only after mount to prevent hydration mismatch */}
          <div className="mt-3">
            {mounted ? (
              <LayoutGroup>
                <motion.p
                  className="flex flex-wrap items-center justify-center gap-2"
                  layout
                  dir="rtl"
                  lang="ar"
                >
                  <motion.span
                    className="pt-0.5 sm:pt-1"
                    layout
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  >
                    بوابتك إلى
                  </motion.span>

                  <TextRotate
                    texts={[
                      "مجلات علمية",
                      "دراسات متخصصة",
                      "أوراق علمية",
                      "بحوث صناعية",
                      "تقارير تقنية",
                      "مواصفات قياسية",
                    ]}
                    splitBy="words"
                    mainClassName="text-white px-2 sm:px-3 bg-[#075985] overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.04}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </motion.p>
              </LayoutGroup>
            ) : (
              // stable SSR fallback (same text every time)
              <p className="text-sm sm:text-base text-slate-700" dir="rtl" lang="ar">
                بوابتك إلى <span className="rounded-lg bg-[#075985] px-2 py-1 text-white">مجلات علمية</span>
              </p>
            )}
          </div>
        </div>

        {/* 3 Rows */}
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
