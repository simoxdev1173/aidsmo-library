'use client';
import React, { useState, FormEvent, useCallback } from 'react';
import Image from 'next/image';
import { LuSearch, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  {
    image: '/hero-image.png',
    title: 'المكتبة الرقمية الذكية',
    subtitle: 'للمنظمة العربية للتنمية الصناعية والتقييس والتعدين',
  },

];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize Embla with a "UAE Style" configuration
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) console.log('Searching for:', searchQuery);
  };

  return (
    <section className="relative w-full bg-white py-6 md:py-10">
      {/* 1. The Container: Centering the Hero */}
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* 2. The Rounded Card: High radius and overflow clip */}
        <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl" ref={emblaRef}>
          
          {/* Slider Track */}
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div className="relative flex-[0_0_100%] h-full" key={index}>
                {/* Background Image with optimized Next.js Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                
                {/* 3. The Overlay: UAE sites use a subtle side-gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />

                {/* 4. The Content: Aligned to the right (RTL) and vertically centered */}
                <div className="relative z-10 flex h-full w-full flex-col justify-center px-8 md:px-16 lg:px-24 text-right">
                  <div className="max-w-2xl">
                    <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
                      {slide.title}
                    </h1>
                    <p className="mb-10 text-lg font-medium text-white/90 md:text-xl lg:text-2xl opacity-80">
                      {slide.subtitle}
                    </p>

                    {/* Integrated Search Bar inside the slide content
                    <form onSubmit={handleSearch} className="relative max-w-lg group">
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن الكتب، الدراسات ..."
                        className="h-14 w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 py-3 pe-14 ps-6 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:outline-none transition-all duration-300"
                        dir="rtl"
                      />
                      <button
                        type="submit"
                        className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-lg"
                      >
                        <LuSearch className="h-5 w-5" />
                      </button>
                    </form> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Floating Controls: Minimalist UAE-style dots and arrows */}
          <div className="absolute bottom-8 left-8 md:left-16 z-20 flex items-center gap-4">
            <button 
              onClick={scrollNext} 
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              <LuChevronRight size={24} />
            </button>
            <button 
              onClick={scrollPrev} 
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              <LuChevronLeft size={24} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;