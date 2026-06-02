'use client';

import { useEffect, useRef, useState } from 'react';
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
    accent: '#38BDF8',
  },
  {
    num: 350,
    suffix: '+',
    label: 'كتاب رقمي',
    Icon: LuBookOpen,
    accent: '#E8C96A',
  },
  {
    num: 140,
    suffix: '+',
    label: 'بحث ودراسة',
    Icon: LuFlaskConical,
    accent: '#38BDF8',
  },
  {
    num: 90,
    suffix: '+',
    label: 'تقرير صناعي',
    Icon: LuFileText,
    accent: '#E8C96A',
  },
];

const StatCard = ({ stat, index }: { stat: (typeof stats)[number]; index: number }) => {
  const { value, ref } = useCountUp(stat.num, 2400);
  const Icon = stat.Icon;

  return (
    <div
      ref={ref}
      className="group relative min-h-[220px] overflow-hidden border border-[#C29C41]/28 bg-[#0A2540] p-5 text-center shadow-[0_24px_56px_rgba(10,37,64,0.16)] transition duration-300 [transform-style:preserve-3d] hover:border-[#C29C41]/55 hover:shadow-[0_30px_70px_rgba(10,37,64,0.22)]"
      style={{ transform: `perspective(900px) rotateX(${index % 2 === 0 ? '2deg' : '-1.5deg'})` }}
    >
      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,transparent_34%,rgba(232,201,106,0.1)_100%)] opacity-80" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.72) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.72) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#E8C96A]/35 bg-[#0A2540]/80 text-[#E8C96A] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_16px_32px_rgba(0,0,0,0.24)] transition duration-300 group-hover:border-[#E8C96A]/70 group-hover:text-white">
        <Icon size={29} strokeWidth={1.6} />
      </div>

      <div className="relative z-10 mt-3 flex items-baseline justify-center gap-1" dir="ltr">
        <span className="font-academic text-5xl font-bold leading-none text-white md:text-6xl">
          {value.toLocaleString('en-US')}
        </span>
        <span className="text-2xl font-bold drop-shadow-[0_0_14px_rgba(232,201,106,0.45)]" style={{ color: stat.accent }}>
          {stat.suffix}
        </span>
      </div>

      <p className="relative z-10 mt-4 text-base font-semibold text-white/76">{stat.label}</p>
    </div>
  );
};

const LibraryStats = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-[#0A2540] md:py-28" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(3,105,161,0.72) 1px, transparent 1px), linear-gradient(90deg, rgba(3,105,161,0.72) 1px, transparent 1px)',
          backgroundSize: '76px 76px',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-1.5 brass-gradient" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="font-display text-xs font-bold uppercase tracking-[0.26em] text-[#E8C96A]">
            مؤشرات المكتبة
          </p>
          <h2 className="mt-4 font-academic text-4xl font-bold leading-tight text-[#003652] md:text-5xl">
            أرقام تعكس ثراء مكتبتنا
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-academic text-lg leading-8 text-[#475569]">
            حصيلة معرفية منظمة تجمع الإصدارات والدراسات والتقارير في تجربة رقمية قابلة للاستكشاف.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 [perspective:1200px]">
          {stats.map((s, index) => (
            <StatCard key={s.label} stat={s} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibraryStats;
