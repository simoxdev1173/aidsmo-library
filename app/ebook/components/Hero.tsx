'use client';
import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const slide = {
  title: 'المكتبة الرقمية الذكية',
  subtitle: 'للمنظمة العربية للتنمية الصناعية والتقييس والتعدين',
};

const Hero = () => {
  return (
    <section className="relative w-full bg-white pt-32 pb-6 md:pt-12 md:pb-10">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Card */}
        <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">

          {/* Video */}
          <video
            src="/hero-video-1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay 1 — dark base */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Overlay 2 — gold top bar */}
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: 'linear-gradient(to right, #C29C41, #e8c96a, #C29C41)' }}
          />

          {/* Overlay 3 — blue diagonal from bottom-left */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(3,105,161,0.45) 0%, transparent 55%)' }}
          />

          {/* Overlay 4 — gold diagonal from top-right */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(315deg, rgba(194,156,65,0.25) 0%, transparent 50%)' }}
          />

          {/* Content */}
          <div
            className="relative z-10 flex h-full w-full flex-col justify-center px-8 md:px-16 lg:px-24 text-right"
            dir="rtl"
          >
            <div className="max-w-2xl">
              {/* Title — gold */}
              <h1
                className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
                style={{ color: '#C29C41' }}
              >
                {slide.title}
              </h1>

              {/* Subtitle — blue */}
              <p
                className="mb-2 text-lg font-semibold md:text-xl lg:text-2xl"
                style={{ color: '#0C5D9B' }}
              >
                {slide.subtitle}
              </p>

          
            </div>
          </div>

          {/* Nav buttons */}
          <div className="absolute bottom-8 left-8 md:left-16 z-20 flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41]">
              <LuChevronRight size={20} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41]">
              <LuChevronLeft size={20} />
            </button>
          </div>

          {/* Gold dot cluster — bottom right */}
          <div className="absolute bottom-8 right-8 md:right-16 z-20 flex items-center gap-2">
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