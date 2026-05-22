'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  LuBookOpen,
  LuFileText,
  LuNewspaper,
  LuFlaskConical,
} from 'react-icons/lu';

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
            const ease = 1 - Math.pow(1 - p, 4);
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

const stats = [
  {
    num: 17,
    suffix: '+',
    label: 'مجلة متخصصة',
    Icon: LuNewspaper,
    accent: '#0369A1',
  },
  {
    num: 350,
    suffix: '+',
    label: 'كتاب رقمي',
    Icon: LuBookOpen,
    accent: '#C29C41',
  },
  {
    num: 140,
    suffix: '+',
    label: 'بحث ودراسة',
    Icon: LuFlaskConical,
    accent: '#0369A1',
  },
  {
    num: 90,
    suffix: '+',
    label: 'تقرير صناعي',
    Icon: LuFileText,
    accent: '#C29C41',
  },
];

const StatCard = ({ stat }: { stat: (typeof stats)[number] }) => {
  const { value, ref } = useCountUp(stat.num, 2400);
  const Icon = stat.Icon;

  return (
    <div ref={ref} className="group corner-card academic-card p-6 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C29C41]/35 bg-white text-[#C29C41] transition duration-300 group-hover:border-[#0369A1]/35 group-hover:text-[#0369A1]">
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <div className="mt-3 flex items-baseline justify-center gap-1" dir="ltr">
        <span className="font-academic text-5xl font-bold leading-none text-[#003652] md:text-6xl">
          {value.toLocaleString('en-US')}
        </span>
        <span className="text-2xl font-bold" style={{ color: stat.accent }}>
          {stat.suffix}
        </span>
      </div>

      <p className="mt-4 text-base font-semibold text-[#334155]">{stat.label}</p>
    </div>
  );
};

const LibraryStats = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #0369a1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-5xl">
            أرقام تعكس ثراء مكتبتنا
          </h2>
          <div className="mx-auto mt-6 max-w-md [--divider-bg:#F0F7FC]">
            <div className="ornate-divider" aria-hidden />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibraryStats;
