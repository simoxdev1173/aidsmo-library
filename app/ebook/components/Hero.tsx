'use client';
import React from 'react';
import Image from 'next/image';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const slide = {
  title: 'المكتبة الرقمية الذكية',
  subtitle:
    'منصة رقمية عربية متخصصة تُعنى بجمع وتنظيم وإتاحة الدراسات الفنية والأبحاث العلمية التي تزخر بها المنظمة في مجال عملها الصناعة – التقييس – التعدين',
};

const Hero = () => {
  return (
    <section className="relative w-full bg-white pt-28 pb-6 md:pt-32 md:pb-10">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Card */}
        <div className="relative mx-auto h-[480px] md:h-[560px] lg:h-[620px] w-full max-w-[95%] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">

          {/* Video */}
          <video
            src="/hero-video-2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay 1 — dark base */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Overlay 2 — gold top bar */}
          <div
            className="absolute inset-x-0 top-0 h-1.5 z-10"
            style={{ background: 'linear-gradient(to right, #C29C41, #e8c96a, #C29C41)' }}
          />

          {/* Overlay 3 — blue diagonal from bottom-left */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(3,105,161,0.50) 0%, transparent 55%)' }}
          />

          {/* Overlay 4 — gold diagonal from top-right */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(315deg, rgba(194,156,65,0.20) 0%, transparent 50%)' }}
          />

          {/* TOP-RIGHT — Logo */}
       {/* TOP-RIGHT — Logo + Title */}
<div className="absolute top-8 right-8 md:top-10 md:right-12 lg:right-16 z-20 flex flex-col items-start">
  {/* Logo Container */}
  <div
    className="rounded-2xl p-3 mb-6"
   
  >
    <Image
      src="/logo-4.png"
      alt="المكتبة الرقمية"
      width={400}
      height={400}
      className="object-fill w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-2xl"
    />
  </div>

  {/* New Big Title */}
  <h1 
    dir="rtl" 
    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-lg select-none"
  >
    <span style={{ color: '#B99739' }}>المكتبة الرقمية</span>{' '}
    <span style={{ color: '#0C5B99' }}>الذكية</span>
  </h1>
</div>

          {/* BOTTOM-LEFT — Title + Subtitle */}
          <div
            className="absolute bottom-16 left-8 md:bottom-20 md:left-12 lg:left-16 z-20 max-w-[55%]"
            dir="rtl"
          >
            {/* <h1
              className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl"
              style={{ color: '#C29C41' }}
            >
              {slide.title}
            </h1> */}

            <p
              className="text-sm mb-5 md:text-3xl leading-snug font-bold  text-justify text-[white] "
            
            >
              {slide.subtitle}
            </p>
          </div>

          {/* Nav buttons — bottom left below text */}
          <div className="absolute bottom-6 left-8 md:left-12 lg:left-16 z-20 flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41]">
              <LuChevronRight size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41]">
              <LuChevronLeft size={18} />
            </button>
          </div>

          {/* Gold dot cluster — bottom right */}
          <div className="absolute bottom-7 right-8 md:right-12 lg:right-16 z-20 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#C29C41' }} />
            <span className="h-2 w-2 rounded-full opacity-50" style={{ backgroundColor: '#C29C41' }} />
            <span className="h-2 w-2 rounded-full opacity-25" style={{ backgroundColor: '#C29C41' }} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;