'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { FaFileAlt, FaFlask, FaHandshake, FaNewspaper, FaRegFileAlt } from 'react-icons/fa';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

type LibraryStatsData = {
  magazines: number;
  books: number;
  studies: number;
  reports: number;
  scientificPapers: number;
  numberedPapers: number;
  memorandums: number;
};

const useCountUp = (target: number, duration = 2000) => {
  const [value, setValue] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          let start: number | null = null;
          const tick = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
};

const getStatsData = (stats: LibraryStatsData): Array<{
  num: number;
  labelKey: 'magazines' | 'studies' | 'reports' | 'scientificPapers' | 'numberedPapers' | 'memorandums';
  Icon: IconType;
}> => [
  { num: stats.numberedPapers, labelKey: 'numberedPapers', Icon: FaRegFileAlt },
  { num: stats.magazines, labelKey: 'magazines', Icon: FaNewspaper },
  { num: stats.studies, labelKey: 'studies', Icon: FaFlask },
  { num: stats.reports, labelKey: 'reports', Icon: FaFileAlt },
  { num: stats.scientificPapers, labelKey: 'scientificPapers', Icon: FaFlask },
  { num: stats.memorandums, labelKey: 'memorandums', Icon: FaHandshake },
];

const StatCard = ({ stat, index, label }: { stat: ReturnType<typeof getStatsData>[number]; index: number; label: string }) => {
  const { value, ref } = useCountUp(stat.num, 2300);
  const Icon = stat.Icon;

  return (
    <div
      ref={ref}
      className="group relative min-h-[184px] w-full overflow-hidden bg-transparent p-0 text-right transition duration-300 [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[196px] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(14.2857%-0.86rem)]"
      style={{
        animationDelay: `${index * 90}ms`,
      }}
    >
      <div className="absolute inset-0 translate-y-4 bg-[#0A2540]/10 blur-2xl transition duration-500 group-hover:translate-y-6 group-hover:bg-[#0A2540]/16" aria-hidden />

      <div className="relative z-10 h-full overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,rgba(255,252,244,0.92)_0%,rgba(255,248,225,0.84)_48%,rgba(255,255,255,0.96)_100%)] px-4 py-5 shadow-[0_14px_30px_rgba(10,37,64,0.12)] transition duration-300 group-hover:shadow-[0_20px_42px_rgba(10,37,64,0.16)] sm:px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,156,65,0.18),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(3,105,161,0.08),transparent_42%)]" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-[#C29C41] via-[#F7E5A9] to-[#0A2540]" aria-hidden />

        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#0A2540] text-[#F7E5A9] shadow-[0_10px_22px_rgba(10,37,64,0.2)] transition duration-300 group-hover:rotate-3 sm:size-13">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <p className="mt-4 min-h-11 text-base font-bold leading-snug text-[#003652]">
            {label}
          </p>

          <div className="mt-3 flex items-baseline justify-center gap-1 whitespace-nowrap" dir="ltr">
            <span className="font-academic text-xl font-bold leading-none text-[#C29C41] sm:text-2xl xl:text-lg" aria-hidden>
              +
            </span>
            <span className="font-academic text-3xl font-bold leading-none text-[#003652] tabular-nums sm:text-4xl xl:text-2xl">
              {value.toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryStats = ({ stats }: { stats: LibraryStatsData }) => {
  const t = useTranslations('stats');
  const { locale } = useAppLocale();

  return (
    <section className="relative overflow-hidden bg-[#F7F0E1]/85 py-12 text-[#0A2540] sm:py-14 lg:py-16" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Image
             src="/standardization-bg.png"
             alt=""
             fill
             sizes="100vw"
             className="object-cover opacity-[0.46] contrast-110 saturate-125"
             aria-hidden
           />
           <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.42)_0%,rgba(247,240,225,0.20)_48%,rgba(255,252,244,0.50)_100%)]" aria-hidden />
           <div
             className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <h2 className="academic-heading text-balance text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {t('heading')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty font-academic text-base leading-relaxed text-[#003652] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto flex flex-wrap justify-center gap-3 sm:gap-4">
          {getStatsData(stats).map((stat, index) => (
            <StatCard key={stat.labelKey} stat={stat} index={index} label={t(stat.labelKey)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibraryStats;
