'use client';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { LuSearch } from 'react-icons/lu';

const stats = [
  { number: '+1000', label: 'اصدار' },
  { number: '+50', label: 'مجلة' },
  { number: '+3000', label: 'كتاب إلكتروني' },
  { number: '+100,000', label: 'تحميل سنوياً' },
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <section id="home" className="relative h-[60vh] min-h-[400px] w-full flex items-center">
      {/* Reverted Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-cover-2.png"
          alt="خلفية المكتبة"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Two-Row Title: Large main title + elegant subtitle */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white md:text-5xl lg:text-6xl mb-2">
              المكتبة الرقمية
            </h1>
            <p className="text-lg font-medium text-white/90 md:text-2xl">
              للمنظمة العربية للتنمية الصناعية والتقييس والتعدين
            </p>
          </div>

          {/* Original Search Bar Styling */}
          <form onSubmit={handleSearch} className="mx-auto mb-10 max-w-xl">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الكتب، الدراسات  ..."
                className="h-12 w-full rounded-lg bg-white py-3 pe-12 ps-4 text-sm text-[#334155] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0369a1]"
                dir="rtl"
              />
              <button
                type="submit"
                className="absolute left-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-md bg-[#0369a1] text-white transition-all hover:bg-[#075985]"
                aria-label="بحث"
              >
                <LuSearch className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Modern Stats: No icons, clean typography, visual separators */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-0">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="px-6 text-center">
                  <p className="text-2xl font-black text-white md:text-3xl lg:text-4xl">
                    {stat.number}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/70 md:text-sm">
                    {stat.label}
                  </p>
                </div>
                {/* Vertical Divider between stats on desktop */}
                {index !== stats.length - 1 && (
                  <div className="hidden h-10 w-[1px] bg-white/20 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;