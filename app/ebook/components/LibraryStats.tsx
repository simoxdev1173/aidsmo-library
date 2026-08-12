'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { FaBookOpen, FaFileAlt, FaFlask, FaNewspaper } from 'react-icons/fa';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

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

const statsData: Array<{
  num: number;
  suffix: string;
  labelKey: 'magazines' | 'books' | 'studies' | 'reports';
  Icon: IconType;
}> = [
  { num: 17, suffix: '+', labelKey: 'magazines', Icon: FaNewspaper },
  { num: 350, suffix: '+', labelKey: 'books', Icon: FaBookOpen },
  { num: 140, suffix: '+', labelKey: 'studies', Icon: FaFlask },
  { num: 90, suffix: '+', labelKey: 'reports', Icon: FaFileAlt },
];

const StatCard = ({ stat, index, label }: { stat: (typeof statsData)[number]; index: number; label: string }) => {
  const { value, ref } = useCountUp(stat.num, 2300);
  const Icon = stat.Icon;

  return (
    <div
      ref={ref}
      className="group relative min-h-[255px] overflow-hidden bg-transparent p-0 text-right transition duration-500 [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] [perspective:1100px] [transform-style:preserve-3d] hover:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none"
      style={{
        animationDelay: `${index * 90}ms`,
        transform: `perspective(1100px) rotateX(${index % 2 === 0 ? '6deg' : '-4deg'}) rotateY(${index % 2 === 0 ? '-6deg' : '5deg'})`,
      }}
    >
      <div className="absolute inset-0 translate-y-4 bg-[#0A2540]/10 blur-2xl transition duration-500 group-hover:translate-y-6 group-hover:bg-[#0A2540]/16" aria-hidden />

      <div className="relative z-10 h-full overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,rgba(255,252,244,0.92)_0%,rgba(255,248,225,0.84)_48%,rgba(255,255,255,0.96)_100%)] px-6 py-7 shadow-[0_18px_38px_rgba(10,37,64,0.14)] transition duration-500 group-hover:shadow-[0_30px_60px_rgba(10,37,64,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,156,65,0.18),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(3,105,161,0.08),transparent_42%)]" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-[#C29C41] via-[#F7E5A9] to-[#0A2540]" aria-hidden />

        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A2540] text-[#F7E5A9] shadow-[0_16px_30px_rgba(10,37,64,0.22)] transition duration-500 group-hover:scale-105 group-hover:rotate-3">
            <Icon className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xl font-bold leading-relaxed text-[#003652]">
            {label}
          </p>

          <div className="mt-8 flex items-baseline justify-center gap-1" dir="ltr">
            <span className="font-academic text-6xl font-bold leading-none text-[#003652] md:text-7xl">
              {value.toLocaleString('en-US')}
            </span>
            <span className="text-3xl font-bold text-[#C29C41] drop-shadow-[0_0_16px_rgba(194,156,65,0.3)]">
              {stat.suffix}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryStats = () => {
  const t = useTranslations('stats');
  const { locale } = useAppLocale();

  return (
    <section className="relative overflow-hidden bg-[#F7F0E1] py-16 text-[#0A2540] md:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Image
             src="/standardization-bg.png"
             alt=""
             fill
             sizes="100vw"
             className="object-cover opacity-[70] contrast-110 saturate-125"
             aria-hidden
           />
           <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.74)_0%,rgba(247,240,225,0.46)_48%,rgba(255,252,244,0.82)_100%)]" aria-hidden />
           <div
             className="pointer-events-none absolute inset-0 opacity-[70]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="academic-heading text-balance text-3xl leading-tight sm:text-4xl md:text-5xl">
            {t('heading')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty font-academic text-lg leading-relaxed text-[#003652] sm:text-xl">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 [perspective:1200px]">
          {statsData.map((stat, index) => (
            <StatCard key={stat.labelKey} stat={stat} index={index} label={t(stat.labelKey)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibraryStats;
