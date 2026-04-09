'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  LuBookOpen,
  LuFileText,
  LuNewspaper,
  LuGlobe,
  LuFlaskConical,
  LuLibrary,
} from 'react-icons/lu';

/* ------------------------------------------------------------------ */
/*  Animated counter — fires once when the card enters the viewport   */
/* ------------------------------------------------------------------ */
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
          const tick = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4); // ease-out quart
            setValue(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(tick);
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

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
const stats = [
  {
    num: 17,
    suffix: '+',
    ar: 'مجلة ',
    en: 'Specialized Magazines',
    Icon: LuNewspaper,
    accent: '#0369A1',
    accentLight: '#e0f2fe',
  },
  {
    num: 350,
    suffix: '+',
    ar: 'كتاب رقمي',
    en: 'Digital Books',
    Icon: LuBookOpen,
    accent: '#C29C41',
    accentLight: '#fdf6e3',
  },
  {
    num: 140,
    suffix: '+',
    ar: 'بحث ودراسة',
    en: 'Research & Studies',
    Icon: LuFlaskConical,
    accent: '#0369A1',
    accentLight: '#e0f2fe',
  },
  {
    num: 90,
    suffix: '+',
    ar: 'تقرير صناعي',
    en: 'Industrial Reports',
    Icon: LuFileText,
    accent: '#C29C41',
    accentLight: '#fdf6e3',
  },
];

/* ------------------------------------------------------------------ */
/*  Single stat card                                                  */
/* ------------------------------------------------------------------ */
const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) => {
  const { value, ref } = useCountUp(stat.num, 2400);
  const Icon = stat.Icon;

  return (
    <div ref={ref} className="group relative">
      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-6 overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white px-5 py-10 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)]">
       
        {/* Icon */}
        <div
          className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg"
          style={{
            backgroundColor: stat.accentLight,
            color: stat.accent,
          }}
        >
          <Icon size={30} strokeWidth={1.6} />
        </div>

        {/* Counter */}
        <div className="flex items-baseline justify-center gap-0.5" dir="ltr">
          <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-slate-900 md:text-5xl">
            {value.toLocaleString('en-US')}
          </span>
          {stat.suffix && (
            <span
              className="text-2xl font-black md:text-3xl"
              style={{ color: stat.accent }}
            >
              {stat.suffix}
            </span>
          )}
        </div>

        {/* Labels */}
        <div className="space-y-1.5">
          <p className="text-[0.95rem] font-bold text-slate-800">{stat.ar}</p>
       
        </div>

      
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main section                                                      */
/* ------------------------------------------------------------------ */
const LibraryStats = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#f8fafc] py-24 md:py-32"
      dir="rtl"
    >
      {/* ---- Background decoration ---- */}

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #0369a1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ---- Content ---- */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
        

          <h2 className="mb-5 text-3xl font-extrabold leading-snug text-slate-900 md:text-4xl lg:text-[2.75rem]">
            أرقام تعكس{' '}
            <span className="relative inline-block">
             <span className="relative z-10 text-[#C29C41] clip-text">
  ثراء مكتبتنا
</span>
              {/* Highlight swoosh behind text */}
            </span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 lg:gap-6">
          {stats.map((s, i) => (
            <StatCard key={s.en} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibraryStats;