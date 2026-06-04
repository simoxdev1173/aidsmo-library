'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { IconType } from 'react-icons';
import {
  FaBalanceScale,
  FaBookOpen,
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaGem,
  FaIndustry,
} from 'react-icons/fa';

type LibraryItem = {
  id: string;
  title: string;
  meta: string;
  type: string;
  cover: string;
  href: string;
};

type LibraryRow = {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: IconType;
  items: LibraryItem[];
};

const libraryRows: LibraryRow[] = [
  {
    id: 'trending',
    title: 'العناوين الرائجة',
    description: 'الأكثر طلبا عبر قطاعات المكتبة الرقمية.',
    href: '/catalog/industry',
    Icon: FaBookOpen,
    items: [
      { id: 'trend-1', title: 'المؤشرات الاقتصادية والصناعية في الدول العربية', meta: 'إحصاءات وتقارير', type: 'تقرير', cover: '/industry-covers/b-1.jpg', href: '/catalog/industry' },
      { id: 'trend-2', title: 'إعادة تأهيل المناجم والمحاجر القديمة', meta: 'التعدين', type: 'دراسة', cover: '/latest-cover/b-1.png', href: '/catalog/mining' },
      { id: 'trend-3', title: 'التنمية الصناعية العربية', meta: 'الصناعة', type: 'مجلة', cover: '/trendingSection/t-3.png', href: '/catalog/industry' },
      { id: 'trend-4', title: 'الدليل العربي للمواصفات والجودة', meta: 'التقييس', type: 'دليل', cover: '/bookCovers/i-2-1.png', href: '/catalog/standardization' },
      { id: 'trend-5', title: 'التحول الرقمي في الصناعة العربية', meta: 'المعلومات الصناعية', type: 'كتاب', cover: '/trendingSection/t-7.png', href: '/catalog/industrial-info' },
      { id: 'trend-6', title: 'سلاسل القيمة الصناعية العربية', meta: 'الصناعة', type: 'بحث', cover: '/industry-covers/b-5.jpg', href: '/catalog/industry' },
      { id: 'trend-7', title: 'معجم المصطلحات الصناعية', meta: 'التقييس', type: 'معجم', cover: '/latest-cover/b-4.png', href: '/catalog/standardization' },
      { id: 'trend-8', title: 'الإنفوجرافيك الصناعي', meta: 'مرئيات وبيانات', type: 'ملف', cover: '/trendingSection/t-6.png', href: '/catalog/industrial-info' },
      { id: 'trend-9', title: 'السلامة والاستدامة في التعدين', meta: 'تعدين', type: 'دليل', cover: '/trendingSection/t-11.png', href: '/catalog/mining' },
    ],
  },
  {
    id: 'industry',
    title: 'الصناعة',
    description: 'تقارير ومراجع حول التنمية، سلاسل القيمة، والتنافسية الصناعية.',
    href: '/catalog/industry',
    Icon: FaIndustry,
    items: [
      { id: 'industry-1', title: 'التنمية الصناعية العربية', meta: 'إصدار سنوي', type: 'مجلة', cover: '/industry-covers/b-3.jpg', href: '/catalog/industry' },
      { id: 'industry-2', title: 'ربط الأكاديميا بالصناعة', meta: 'دراسات وأدلة', type: 'دراسة', cover: '/industry-covers/b-2.jpg', href: '/catalog/industry' },
      { id: 'industry-3', title: 'الصناعات الصغيرة والمتوسطة', meta: 'سياسات صناعية', type: 'دليل', cover: '/industry-covers/b-3-1.jpg', href: '/catalog/industry' },
      { id: 'industry-4', title: 'مؤشرات تنافسية الصناعة العربية', meta: 'تحليل اقتصادي', type: 'تقرير', cover: '/industry-covers/b-1-1.jpg', href: '/catalog/industry' },
      { id: 'industry-5', title: 'خريطة التكامل الصناعي العربي', meta: 'استراتيجيات', type: 'كتاب', cover: '/industry-covers/b-3-2.jpg', href: '/catalog/industry' },
      { id: 'industry-6', title: 'الابتكار في المنشآت الصناعية', meta: 'فعاليات وأنشطة', type: 'بحث', cover: '/trendingSection/t-10.png', href: '/catalog/industry' },
      { id: 'industry-7', title: 'تقرير الصناعة العربية', meta: 'إحصاءات صناعية', type: 'تقرير', cover: '/trendingSection/t-1.png', href: '/catalog/industry' },
      { id: 'industry-8', title: 'كتيب المؤشرات الاقتصادية والصناعية', meta: 'مؤشرات', type: 'كتيب', cover: '/trendingSection/t-2.jpg', href: '/catalog/industry' },
      { id: 'industry-9', title: 'مجلة التنمية الصناعية', meta: 'مجلة متخصصة', type: 'مجلة', cover: '/trendingSection/t-4.jpg', href: '/catalog/industry' },
    ],
  },
  {
    id: 'standardization',
    title: 'التقييس والجودة',
    description: 'أدلة ومصطلحات ومراجع تساعد على فهم المواصفات والجودة.',
    href: '/catalog/standardization',
    Icon: FaBalanceScale,
    items: [
      { id: 'standard-1', title: 'أدلة المواصفات القياسية العربية', meta: 'أدلة', type: 'دليل', cover: '/bookCovers/i-1.png', href: '/catalog/standardization' },
      { id: 'standard-2', title: 'معجم المصطلحات الصناعية', meta: 'معاجم', type: 'معجم', cover: '/bookCovers/i-1-1.png', href: '/catalog/standardization' },
      { id: 'standard-3', title: 'توجيهات المطابقة والجودة', meta: 'توجيهات', type: 'توجيه', cover: '/bookCovers/i-1-2.png', href: '/catalog/standardization' },
      { id: 'standard-4', title: 'استراتيجية البنية التحتية للجودة', meta: 'استراتيجيات', type: 'دراسة', cover: '/bookCovers/i-1-3.png', href: '/catalog/standardization' },
      { id: 'standard-5', title: 'ورش التقييس وبناء القدرات', meta: 'ورش ودورات', type: 'برنامج', cover: '/bookCovers/i-2.png', href: '/catalog/standardization' },
      { id: 'standard-6', title: 'الدليل العربي للمواصفات والجودة', meta: 'مرجع تطبيقي', type: 'دليل', cover: '/bookCovers/i-2-1.png', href: '/catalog/standardization' },
      { id: 'standard-7', title: 'لوائح وأنظمة الجودة', meta: 'وثائق مرجعية', type: 'لائحة', cover: '/bookCovers/i-2-2.png', href: '/catalog/standardization' },
      { id: 'standard-8', title: 'اتفاقيات ومعايير الاعتماد', meta: 'تقييس', type: 'وثيقة', cover: '/bookCovers/i-2-3.png', href: '/catalog/standardization' },
    ],
  },
  {
    id: 'mining',
    title: 'التعدين',
    description: 'مراجع جيولوجية ودراسات حول الموارد المعدنية والاستدامة.',
    href: '/catalog/mining',
    Icon: FaGem,
    items: [
      { id: 'mining-1', title: 'إعادة تأهيل المناجم والمحاجر القديمة', meta: 'دراسات تعدينية', type: 'دراسة', cover: '/latest-cover/b-1.png', href: '/catalog/mining' },
      { id: 'mining-2', title: 'جيولوجيا الموارد المعدنية العربية', meta: 'جيولوجيا', type: 'كتاب', cover: '/latest-cover/b-2.png', href: '/catalog/mining' },
      { id: 'mining-3', title: 'الصناعة التعدينية وسلاسل الإمداد', meta: 'الصناعة التعدينية', type: 'تقرير', cover: '/latest-cover/b-3.png', href: '/catalog/mining' },
      { id: 'mining-4', title: 'السلامة والاستدامة في التعدين', meta: 'تعدين', type: 'دليل', cover: '/trendingSection/t-11.png', href: '/catalog/mining' },
      { id: 'mining-5', title: 'الخرائط المعدنية العربية', meta: 'بيانات وخرائط', type: 'مرجع', cover: '/trendingSection/t-12.jpg', href: '/catalog/mining' },
      { id: 'mining-6', title: 'اقتصاديات المعادن العربية', meta: 'تحليل اقتصادي', type: 'تقرير', cover: '/industry-covers/b-1.jpg', href: '/catalog/mining' },
      { id: 'mining-7', title: 'الموارد المعدنية وسلاسل القيمة', meta: 'استراتيجيات', type: 'كتاب', cover: '/industry-covers/b-5.jpg', href: '/catalog/mining' },
      { id: 'mining-8', title: 'إدارة بيانات التعدين', meta: 'بيانات', type: 'ملف', cover: '/trendingSection/t-6.png', href: '/catalog/mining' },
    ],
  },
  {
    id: 'industrial-info',
    title: 'المعلومات الصناعية',
    description: 'إحصاءات ونشرات ومرئيات تساند البحث واتخاذ القرار.',
    href: '/catalog/industrial-info',
    Icon: FaChartPie,
    items: [
      { id: 'info-1', title: 'تقرير الصناعة العربية', meta: 'إحصاءات صناعية', type: 'تقرير', cover: '/trendingSection/t-1.png', href: '/catalog/industrial-info' },
      { id: 'info-2', title: 'كتيب المؤشرات الاقتصادية والصناعية', meta: 'مؤشرات', type: 'كتيب', cover: '/trendingSection/t-2.jpg', href: '/catalog/industrial-info' },
      { id: 'info-3', title: 'مجلة التنمية الصناعية', meta: 'مجلة متخصصة', type: 'مجلة', cover: '/trendingSection/t-4.jpg', href: '/catalog/industrial-info' },
      { id: 'info-4', title: 'النشرة الدورية للمعلومات الصناعية', meta: 'نشرات', type: 'نشرة', cover: '/trendingSection/t-5.png', href: '/catalog/industrial-info' },
      { id: 'info-5', title: 'الإنفوجرافيك الصناعي', meta: 'مرئيات وبيانات', type: 'ملف', cover: '/trendingSection/t-6.png', href: '/catalog/industrial-info' },
      { id: 'info-6', title: 'التحول الرقمي في الصناعة العربية', meta: 'بيانات رقمية', type: 'كتاب', cover: '/trendingSection/t-7.png', href: '/catalog/industrial-info' },
      { id: 'info-7', title: 'لوحات متابعة المؤشرات الصناعية', meta: 'تحليل وقياس', type: 'مرجع', cover: '/latest-cover/b-4.png', href: '/catalog/industrial-info' },
      { id: 'info-8', title: 'بيانات سلاسل الإمداد الصناعية', meta: 'إحصاءات', type: 'ملف', cover: '/industry-covers/b-3-2.jpg', href: '/catalog/industrial-info' },
    ],
  },
];

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

function LibraryCard({ item, index }: { item: LibraryItem; index: number }) {
  return (
    <Link
      href={item.href}
      className="group block w-40 shrink-0 text-right text-[#0A2540] outline-none [perspective:1100px] sm:w-44"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative mx-auto h-64 w-36 [transform-style:preserve-3d] transition duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] group-hover:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] group-focus-visible:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] motion-reduce:transform-none motion-reduce:transition-none sm:h-72 sm:w-40">
        <div className="absolute inset-0 translate-x-3 translate-y-4 bg-[#0A2540]/18 blur-xl transition duration-700 group-hover:translate-y-7 group-hover:bg-[#0A2540]/28" aria-hidden />
        <div className="absolute inset-y-3 right-[-10px] w-5 bg-gradient-to-l from-[#5A4217] via-[#C29C41] to-[#F7E5A9] shadow-[inset_3px_0_6px_rgba(10,37,64,0.22)] [transform:rotateY(72deg)] [transform-origin:left]" aria-hidden />
        <div className="absolute inset-0 overflow-hidden border border-[#C29C41]/35 bg-[#0A2540] shadow-[0_18px_34px_rgba(10,37,64,0.18)] [transform:translateZ(18px)]">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="180px"
            className="relative z-10 object-cover transition duration-700 group-hover:scale-[1.055]"
          />
          <div className="absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-black/28 via-white/8 to-transparent" aria-hidden />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A2540]/18 via-transparent to-white/10" aria-hidden />
          <div className="absolute -inset-y-8 -left-16 z-30 w-12 rotate-12 bg-white/42 blur-md transition duration-700 group-hover:translate-x-64" aria-hidden />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-[0.98rem] font-bold leading-7 text-[#003652] transition duration-300 group-hover:text-[#9A7421] group-focus-visible:text-[#9A7421]">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748B]">
          {item.meta} · {item.type}
        </p>
      </div>
    </Link>
  );
}

function LibraryCarouselRow({ row }: { row: LibraryRow }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const Icon = row.Icon;
  const total = row.items.length;

  const onPrev = () => scrollerRef.current && scrollByAmount(scrollerRef.current, 660);
  const onNext = () => scrollerRef.current && scrollByAmount(scrollerRef.current, -660);

  return (
    <section
      id={`shelf-${row.id}`}
      aria-labelledby={`${row.id}-heading`}
      aria-roledescription="carousel"
      className="relative border-t border-[#C29C41]/25 py-10 first:border-t-0 md:py-12"
    >
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#C29C41]/40 bg-[#0A2540] text-[#F7E5A9] shadow-[0_12px_26px_rgba(10,37,64,0.18)]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 id={`${row.id}-heading`} className="text-2xl font-bold leading-tight text-[#003652] md:text-3xl">
              {row.title}
            </h3>
            <p className="mt-2 max-w-2xl font-academic text-base leading-relaxed text-[#64748B]">{row.description}</p>
            <p className="sr-only">{`1 إلى ${Math.min(total, 6)} من ${total}`}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label={`السابق: ${row.title}`}
            className="flex h-10 w-10 items-center justify-center border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
          <Link
            href={row.href}
            aria-label={`عرض المزيد: ${row.title}`}
            className="border border-[#C29C41]/35 bg-[#FFF8E1] px-4 py-2 text-sm font-bold text-[#7A5C10] shadow-sm transition duration-200 hover:border-[#C29C41]/70 hover:bg-[#F7E5A9] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            عرض المزيد
          </Link>
          <button
            type="button"
            onClick={onNext}
            aria-label={`التالي: ${row.title}`}
            className="flex h-10 w-10 items-center justify-center border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F7F0E1] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F7F0E1] to-transparent" aria-hidden />
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto overflow-y-visible px-2 pb-7 pt-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {row.items.map((item, itemIndex) => (
            <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
              <LibraryCard item={item} index={itemIndex} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TrendingBooks() {
  return (
    <section id="projects" className="relative overflow-hidden bg-[#F7F0E1] py-16 md:py-24" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.92)_0%,rgba(247,240,225,0.82)_42%,rgba(255,252,244,0.94)_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="academic-heading text-4xl leading-tight md:text-5xl">
            رائج في المكتبة الرقمية
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
            رفوف متحركة تجمع العناوين الأكثر طلبا حسب قطاعات المكتبة الرئيسية، مع بطاقات كتب أكثر عمقا وسلاسة.
          </p>
        </div>

        <div className="space-y-0">
          {libraryRows.map((row) => (
            <LibraryCarouselRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
