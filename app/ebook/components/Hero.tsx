'use client';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { LuSearch } from 'react-icons/lu';

const stats = [
  { number: '+10,000', label: 'مورد رقمي' },
  { number: '+50,000', label: 'زائر شهرياً' },
  { number: '+5,000', label: 'كتاب إلكتروني' },
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
    <section id="home" className="relative h-[50vh] min-h-[280px] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-cover-1.png"
          alt="خلفية المكتبة"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Title */}
          <h1 className="mb-4 text-xl font-bold text-white md:text-2xl lg:text-3xl">
            المكتبة الرقمية للمنظمة العربية للتنمية الصناعية والتقييس والتعدين
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mb-6 max-w-xl">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الكتب، المقالات، المعايير..."
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

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-bold text-white md:text-xl">
                  {stat.number}
                </p>
                <p className="text-xs text-white/70 md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;