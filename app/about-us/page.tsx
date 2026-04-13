'use client';
import React, { useEffect, useRef, useState } from 'react';

/* ── intersection-observer hook ── */
function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const AboutPage = () => {
  const [heroRef, heroVisible] = useInView(0.1);
  const [textRef, textVisible] = useInView(0.15);

  return (
    <div dir="rtl">
      {/* ═══════ HERO — centered card ═══════ */}
      <section className="bg-white pt-32 md:pt-36 pb-10 md:pb-14 px-4 lg:px-8">
        <div
          ref={heroRef}
          className="relative mx-auto max-w-[95%] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <div className="relative flex items-center justify-center py-24 md:py-32 lg:py-36 bg-gradient-to-bl from-[#0a2540] via-[#0C5B99] to-[#0369A1]">
            {/* Gold top accent bar */}
            <div
              className="absolute inset-x-0 top-0 h-[5px] z-10"
              style={{ background: 'linear-gradient(to left, #C29C41, #e8c96a, #C29C41)' }}
            />

            {/* Subtle grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />

            {/* Radial gold glows */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 50% at 80% 25%, rgba(194,156,65,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 55% at 15% 75%, rgba(194,156,65,0.07) 0%, transparent 70%)',
              }}
            />

            {/* Decorative diamonds */}
            <div className="absolute top-[14%] right-[7%] w-36 h-36 border border-[#C29C41]/10 rotate-45 rounded-lg" />
            <div className="absolute bottom-[16%] left-[9%] w-24 h-24 border border-[#C29C41]/10 rotate-45 rounded-lg" />
            <div className="absolute top-[45%] right-[30%] w-12 h-12 border border-white/5 rotate-45 rounded" />

            {/* Decorative circles */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full border border-[#C29C41]/[0.06]" />
            <div className="absolute -bottom-12 -right-8 w-40 h-40 rounded-full border border-[#C29C41]/[0.06]" />

            {/* Title */}
            <div className="relative z-10 text-center px-6">
             

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none select-none">
                <span className="text-white">من </span>
                <span className="text-[#C29C41]">نحن</span>
              </h1>

             
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT TEXT ═══════ */}
      <section className="relative bg-white pt-16 pb-24 md:pt-20 md:pb-32">
        {/* Top center gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-gradient-to-l from-[#C29C41] to-[#e8c96a]" />

        <div
          ref={textRef}
          className="mx-auto max-w-[800px] px-6"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <div className="relative">
            {/* Decorative quotation mark */}
            <span className="absolute -top-8 -right-2 text-7xl text-[#C29C41] select-none leading-none font-serif">
              ❝
            </span>

            <p className="text-lg md:text-xl leading-[2.2] text-slate-600 font-medium text-justify mb-8">
              أعدّت{' '}
              <span className="font-bold text-[#0C5B99]">
                المنظمة العربية للتنمية الصناعية والتقييس والتعدين
              </span>{' '}
              <span className="font-bold text-[#C29C41]">
                المكتبة الرقمية الذكية
              </span>
              {' '}، منصة رائدة تهدف إلى جمع{' '}
              <span className="font-bold text-[#0C5B99]">
                المعرفة الصناعية والتقنية
              </span>{' '}
              وتنظيمها بطريقة ذكية ومتاحة للجميع. تم تصميم المكتبة باستخدام أحدث{' '}
              <span className="font-bold text-[#C29C41]">
                التطورات التكنولوجية
              </span>{' '}
              لتسهيل{' '}
              <span className="font-bold text-[#0C5B99]">
                البحث التفاعلي
              </span>{' '}
              والوصول السريع إلى المعلومات الدقيقة والموثوقة.
            </p>

            <p className="text-base md:text-lg leading-[2.3] text-slate-500 text-justify">
              تسعى المكتبة إلى أن تكون{' '}
              <span className="font-bold text-[#0C5B99]">
                مرجعاً موثوقاً
              </span>{' '}
              للباحثين والمهتمين بالقطاع الصناعي والتعديني، من خلال توفير محتوى غني يدعم{' '}
              <span className="font-bold text-[#C29C41]">
                البحث العلمي
              </span>
              ،{' '}
              <span className="font-bold text-[#C29C41]">
                التطوير المهني
              </span>
              ، واتخاذ{' '}
              <span className="font-bold text-[#0C5B99]">
                القرار المبني على المعرفة
              </span>
              . كما تهدف إلى تعزيز{' '}
              <span className="font-bold text-[#C29C41]">
                الابتكار
              </span>{' '}
              ونشر المعرفة داخل{' '}
              <span className="font-bold text-[#0C5B99]">
                المجتمع العربي
              </span>
              ، مع تصميم يجعل البحث واستكشاف المعلومات أمراً سهلاً وممتعاً لجميع المستخدمين.
            </p>
             <span className="absolute -bottom-8 -left-2 text-7xl text-[#C29C41] select-none leading-none font-serif">
              ❝
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;