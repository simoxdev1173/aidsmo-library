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
import type { TrendingItem, TrendingRow } from '@/lib/library-data';

const ROW_ICONS: Record<string, IconType> = {
  trending: FaBookOpen,
  industry: FaIndustry,
  standardization: FaBalanceScale,
  mining: FaGem,
  'industrial-info': FaChartPie,
};

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

function LibraryCard({ item, index }: { item: TrendingItem; index: number }) {
  return (
    <Link
      href={item.href}
      className="group block w-48 shrink-0 text-right text-[#0A2540] outline-none [perspective:1100px] sm:w-56 lg:w-60"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative mx-auto h-72 w-44 [transform-style:preserve-3d] transition duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] group-hover:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] group-focus-visible:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] motion-reduce:transform-none motion-reduce:transition-none sm:h-80 sm:w-52 lg:h-[22rem] lg:w-56">
        <div className="absolute inset-0 translate-x-3 translate-y-4 bg-[#0A2540]/18 blur-xl transition duration-700 group-hover:translate-y-7 group-hover:bg-[#0A2540]/28" aria-hidden />
        <div className="absolute inset-y-3 right-[-10px] w-5 bg-gradient-to-l from-[#5A4217] via-[#C29C41] to-[#F7E5A9] shadow-[inset_3px_0_6px_rgba(10,37,64,0.22)] [transform:rotateY(72deg)] [transform-origin:left]" aria-hidden />
        <div className="absolute inset-0 overflow-hidden border border-[#C29C41]/35 bg-[#0A2540] shadow-[0_18px_34px_rgba(10,37,64,0.18)] [transform:translateZ(18px)]">
          {item.cover ? (
            <Image
              src={item.cover}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 224px, (min-width: 640px) 208px, 176px"
              className="relative z-10 object-cover transition duration-700 group-hover:scale-[1.055]"
              unoptimized
            />
          ) : (
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#0A2540] to-[#12335A] px-4 text-center">
              <span className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#C29C41]">AIDSMO</span>
              <span className="line-clamp-4 text-sm font-bold leading-6 text-[#F7E5A9]">{item.title}</span>
              <span className="text-xs font-semibold text-white/55">{item.type}</span>
            </div>
          )}
          <div className="absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-black/28 via-white/8 to-transparent" aria-hidden />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A2540]/18 via-transparent to-white/10" aria-hidden />
          <div className="absolute -inset-y-8 -left-16 z-30 w-12 rotate-12 bg-white/42 blur-md transition duration-700 group-hover:translate-x-64" aria-hidden />
        </div>
      </div>

      <div className="mt-5 px-1">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-base font-bold leading-7 text-[#003652] transition duration-300 group-hover:text-[#9A7421] group-focus-visible:text-[#9A7421] sm:text-[1.05rem]">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748B]">
          {item.meta} · {item.type}
        </p>
      </div>
    </Link>
  );
}

export default function LibraryCarouselRow({ row }: { row: TrendingRow }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const Icon = ROW_ICONS[row.iconKey] ?? FaBookOpen;
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
          <Link
            href={row.href}
            aria-label={`عرض المزيد: ${row.title}`}
            className="rounded-full border border-[#C29C41]/35 bg-[#FFF8E1] px-4 py-2 text-sm font-bold text-[#7A5C10] shadow-sm transition duration-200 hover:border-[#C29C41]/70 hover:bg-[#F7E5A9] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            عرض المزيد
          </Link>
          <button
            type="button"
            onClick={onNext}
            aria-label={`التالي: ${row.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
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
          className="flex gap-8 overflow-x-auto overflow-y-visible px-2 pb-7 pt-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
