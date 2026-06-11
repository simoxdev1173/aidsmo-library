'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuChevronLeft } from 'react-icons/lu';

const primaryButton =
  'engraved brass-gradient inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]';

const darkButton =
  'inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-white/42 bg-white/12 px-7 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/22 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]';

const LibraryNews = () => {
  return (
    <section
      id="library-services"
      className="relative overflow-hidden bg-[#F7F0E1] py-16 md:py-24"
      aria-label="خدمات المكتبة الرقمية"
      dir="rtl"
    >
      <Image
        src="/background-01.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.34] contrast-110 saturate-125"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,225,0.94)_0%,rgba(247,240,225,0.74)_48%,rgba(247,240,225,0.96)_100%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.22) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
        

          <h2 className="academic-heading mt-3 text-3xl leading-tight text-[#0A2540] md:text-4xl">
            خدمات المكتبة الرقمية
          </h2>

          <p className="mt-4 max-w-2xl text-nowrap font-academic text-lg leading-relaxed text-[#475569]">
            مسارات عملية تساعدك على الوصول إلى الإصدارات، اختيار مجال البحث، أو طلب إرشاد سريع من المساعد الذكي.
          </p>
        </div>

        <div className="grid auto-rows-[210px] gap-5 lg:grid-cols-3">
          {/* Big parchment card */}
          <Link
            href="#latest-pub"
            className="corner-frame group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#C29C41]/35 bg-[#FFF8E8]/95 p-7 shadow-[0_22px_58px_rgba(10,37,64,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/70 hover:shadow-[0_28px_76px_rgba(10,37,64,0.14)] md:p-8 lg:row-span-2"
          >
            <div>
              <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9A7421]">
                أحدث الإصدارات
              </p>

              <h3 className="mt-5 max-w-md font-academic text-2xl font-bold leading-[1.55] text-[#0A2540] md:text-3xl">
                اكتشف المواد الجديدة في الصناعة والتقييس والتعدين
              </h3>

              <p className="mt-4 max-w-md font-academic text-base leading-relaxed text-[#64748B]">
                تابع الإصدارات والدراسات المضافة حديثا داخل المكتبة الرقمية.
              </p>
            </div>

            <span className={`${primaryButton} mt-7 w-fit`}>
              عرض الإصدارات
              <LuChevronLeft className="h-4 w-4" />
            </span>
          </Link>

          {/* Top image card */}
          <Link
            href="/catalog/industry"
            className="corner-frame group relative overflow-hidden rounded-[14px] border border-[#C29C41]/25 bg-[#0A2540] shadow-[0_22px_58px_rgba(10,37,64,0.12)]"
          >
            <Image
              src="/industry-informations-bg.png"
              alt="تصفح المكتبة الرقمية"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,37,64,0.12)_0%,rgba(10,37,64,0.54)_52%,rgba(10,37,64,0.88)_100%)]" />

            <div className="absolute inset-x-6 bottom-6 text-right">
              <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#E8C96A]">
                تصفح حسب المجال
              </p>

              <p className="mt-2 max-w-xs font-academic text-xl font-bold leading-relaxed text-white">
                انتقال مباشر إلى رفوف المكتبة
              </p>
            </div>
          </Link>

          {/* Smart assistant card */}
          <Link
            href="#chatbot"
            className="corner-frame group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#C29C41]/30 bg-[#0A2540] p-7 text-white shadow-[0_24px_68px_rgba(10,37,64,0.16)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/70 md:p-8 lg:row-span-2"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(232,201,106,0.2),transparent_28%),radial-gradient(circle_at_78%_82%,rgba(14,165,233,0.12),transparent_30%)]"
              aria-hidden
            />

            <div className="relative z-10">
              <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#E8C96A]">
                المساعد الذكي
              </p>

              <h3 className="mt-5 max-w-md font-academic text-2xl font-bold leading-[1.55] text-white md:text-3xl">
                اسأل عن الإصدارات والقطاعات واحصل على إرشاد فوري
              </h3>

              <p className="mt-4 max-w-md font-academic text-base leading-relaxed text-white/72">
                يساعدك في تضييق البحث والوصول إلى المواد المناسبة بسرعة.
              </p>
            </div>

            <span className={`${primaryButton} relative z-10 mt-7 w-fit`}>
              اسأل المساعد
              <LuChevronLeft className="h-4 w-4" />
            </span>
          </Link>

          {/* Main blue sector card */}
          <Link
            href="/catalog/standardization"
            className="corner-frame group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#C29C41]/30 bg-[#0B4E84] p-7 text-white shadow-[0_24px_68px_rgba(10,37,64,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/70 md:p-8 lg:row-span-2"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(232,201,106,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]"
              aria-hidden
            />

            <div className="relative z-10">
              <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#E8C96A]">
                مدخل القطاعات
              </p>

              <h3 className="mt-5 max-w-lg font-academic text-2xl font-bold leading-[1.55] text-white md:text-3xl">
                اختر مجال العمل وانتقل مباشرة إلى الرف الرقمي المناسب
              </h3>

              <p className="mt-4 max-w-md font-academic text-base leading-relaxed text-white/76">
                الصناعة، التقييس، التعدين، والمعلومات الصناعية في مسار واضح.
              </p>
            </div>

            <span className={`${darkButton} relative z-10 mt-7 w-fit`}>
              ابدأ التصفح
              <LuChevronLeft className="h-4 w-4" />
            </span>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/mining"
            className="corner-frame group relative overflow-hidden rounded-[14px] border border-[#C29C41]/25 bg-[#0A2540] shadow-[0_22px_58px_rgba(10,37,64,0.12)]"
          >
            <Image
              src="/industry-bg.png"
              alt="موارد التعدين"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/88 via-[#0A2540]/34 to-transparent" />

            <div className="absolute inset-x-6 bottom-6 text-right">
              

              <p className="mt-2 max-w-xs font-academic text-xl font-bold leading-relaxed text-white">
                موارد فنية ودراسات متخصصة
              </p>
            </div>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/industrial-info"
            className="corner-frame group relative overflow-hidden rounded-[14px] border border-[#C29C41]/25 bg-[#0A2540] shadow-[0_22px_58px_rgba(10,37,64,0.12)]"
          >
            <Image
              src="/standardization-bg.png"
              alt="المعلومات الصناعية"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/88 via-[#0A2540]/34 to-transparent" />

            <div className="absolute inset-x-6 bottom-6 text-right">
          
              <p className="mt-2 max-w-xs font-academic text-xl font-bold leading-relaxed text-white">
                بيانات ومعرفة قابلة للاستكشاف
              </p>
            </div>
          </Link>
        </div>

        
      </div>
    </section>
  );
};

export default LibraryNews;
