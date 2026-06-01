'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuArrowLeft, LuCalendar } from 'react-icons/lu';

type NewsItem = {
  title: string;
  date: string;
  excerpt: string;
  href: string;
};

const news: NewsItem[] = [
  {
    title: 'إطلاق إصدارات جديدة في مجال عمل المنظمة: صناعة، تقييس، تعدين',
    date: '05 فبراير 2026',
    excerpt:
      'تعرّف على أحدث الإصدارات والدراسات الفنية المتخصصة التي أضافتها المكتبة الرقمية إلى مجموعتها في مجالات الصناعة والتقييس والتعدين.',
    href: '/news/standardization-section',
  },
  {
    title: 'نشرات دورية: أهم الإصدارات والتحليلات الصناعية',
    date: '28 يناير 2026',
    excerpt:
      'اشترك لتصلك أحدث التقارير والدراسات المختارة بعناية في الصناعة والتعدين والتقييس مباشرة إلى بريدك.',
    href: '/news/newsletter',
  },
];

const LibraryNews = () => {
  return (
    <section
      id="library-news"
      className="bg-white py-20 md:py-28"
      aria-label="أخبار المكتبة"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-2">
            <div className="group corner-frame relative overflow-hidden border border-[#C29C41]/35 bg-[#F8FAFC] p-3">
              <div className="relative aspect-[4/5] overflow-hidden arch-top">
                <Image
                  alt="أخبار المكتبة الرقمية"
                  src="/newsCover.png"
                  fill
                  className="sepia-reveal object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div>
              <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-4
              xl">
                آخر المستجدات داخل المكتبة الرقمية
              </h2>
              <p className="mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
                أخبار وإعلانات مختارة تساعدك على متابعة الإصدارات الجديدة والمواد المعرفية فور صدورها.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              {news.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group corner-card block border border-[#C29C41]/30 bg-[#F8FAFC] p-6 transition duration-300 hover:border-[#C29C41]/60 hover:shadow-[0_14px_34px_rgba(10,37,64,0.1)] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-4 focus:ring-offset-white"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <span className="text-lg text-[#C29C41]" aria-hidden>✶</span>
                      <h3 className="mt-2 text-xl font-bold leading-relaxed text-[#003652] transition duration-300 group-hover:text-[#C29C41]">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 font-academic text-lg leading-relaxed text-[#475569]">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="inline-flex items-center gap-2 border border-[#C29C41]/25 bg-white px-3 py-2 text-xs font-semibold text-[#7A5C10]">
                        <LuCalendar className="h-3.5 w-3.5 text-[#C29C41]" />
                        {item.date}
                      </div>

                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[#C29C41]">
                        اقرأ المزيد
                        <LuArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryNews;
