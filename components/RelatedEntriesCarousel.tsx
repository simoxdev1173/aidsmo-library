'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export type RelatedEntry = {
  id: string;
  slug: string;
  title: string;
  coverImagePath: string | null;
  categoryLabel: string;
};

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

export default function RelatedEntriesCarousel({
  entries,
  viewAllHref,
}: {
  entries: RelatedEntry[];
  viewAllHref: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onPrev = () => scrollerRef.current && scrollByAmount(scrollerRef.current, 480);
  const onNext = () => scrollerRef.current && scrollByAmount(scrollerRef.current, -480);

  return (
    <section aria-roledescription="carousel" aria-label="قد يهمك أيضا">
      <div className="flex items-center justify-between">
        <h2 className="font-academic text-xl font-bold text-[#003652] md:text-2xl">قد يهمك أيضا</h2>

        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#C29C41]"
          >
            عرض المزيد
          </Link>
          <button
            type="button"
            onClick={onPrev}
            aria-label="السابق"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9E3EE] bg-white text-[#0369A1] shadow-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="التالي"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9E3EE] bg-white text-[#0369A1] shadow-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#F8FAFC] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#F8FAFC] to-transparent" aria-hidden />

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {entries.map((item) => (
            <Link
              key={item.id}
              href={`/book/${item.slug}`}
              style={{ scrollSnapAlign: 'start' }}
              className="group flex w-36 shrink-0 flex-col sm:w-40"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] border border-[#D9E3EE] bg-[#EAF3F8] shadow-[0_10px_28px_rgba(10,37,64,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#C29C41]/55 group-hover:shadow-[0_18px_40px_rgba(10,37,64,0.14)]">
                {item.coverImagePath ? (
                  <Image
                    src={item.coverImagePath}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0A2540] px-3 text-center">
                    <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#C29C41]">
                      {item.title}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#071D2F]/85 via-[#071D2F]/20 to-transparent" aria-hidden />
                <span className="absolute inset-x-2 bottom-2 block truncate rounded-full bg-white/12 px-2 py-0.5 text-[0.6rem] font-bold text-white ring-1 ring-white/25 backdrop-blur-md">
                  {item.categoryLabel}
                </span>
              </div>
              <h3 className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-5 text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
