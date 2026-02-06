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
    // FIX 1: Changed h-[60vh] to min-h-[650px] for laptops and added flex-col to handle layout flow
    <section id="home" className="relative min-h-[650px] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden">
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
      {/* FIX 2: Added pt-24 to push content below the header on laptops/desktops */}
      <div className="relative z-10 w-full px-4 pt-24 pb-12">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Two-Row Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-white md:text-5xl lg:text-7xl mb-4">
              المكتبة الرقمية
            </h1>
            <p className="text-lg font-medium text-white/90 md:text-2xl lg:text-3xl">
              للمنظمة العربية للتنمية الصناعية والتقييس والتعدين
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mb-12 max-w-2xl">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الكتب، الدراسات  ..."
                className="h-14 w-full rounded-xl bg-white py-3 pe-14 ps-4 text-base text-[#334155] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0369a1] shadow-2xl"
                dir="rtl"
              />
              <button
                type="submit"
                className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0369a1] text-white transition-all hover:bg-[#075985]"
                aria-label="بحث"
              >
                <LuSearch className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Modern Stats */}
          <div className="flex flex-wrap items-center justify-center gap-y-8 gap-x-4 md:gap-0">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="px-4 md:px-8 text-center">
                  <p className="text-2xl font-black text-white md:text-3xl lg:text-4xl">
                    {stat.number}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 md:text-xs">
                    {stat.label}
                  </p>
                </div>
                {index !== stats.length - 1 && (
                  <div className="hidden h-12 w-[1px] bg-white/20 md:block" />
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