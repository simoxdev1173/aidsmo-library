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
    title: 'إطلاق قسم جديد للكتب المتخصصة في التقييس والجودة',
    date: '05 فبراير 2026',
    excerpt:
      'تمت إضافة مجموعة جديدة من المراجع والدلائل الإرشادية لدعم الباحثين والمهنيين في مجالات المواصفات وتقييم المطابقة.',
    href: '/news/standardization-section',
  },
  {
    title: 'تحديثات على فهرسة الكتب الإلكترونية وتحسين البحث',
    date: '02 فبراير 2026',
    excerpt:
      'أصبح البحث أسرع وأكثر دقة مع تصفية حسب القطاع، سنة النشر، والموضوعات الأكثر شيوعاً داخل المكتبة.',
    href: '/news/search-upgrade',
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
      className="bg-white py-10 lg:py-16"
      aria-label="أخبار المكتبة"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">

          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl shadow-sm"
              style={{ border: '1px solid rgba(194,156,65,0.25)' }}
            >
              {/* Gold top bar */}
              <div
                className="absolute inset-x-0 top-0 z-10 h-[3px]"
                style={{
                  background: 'linear-gradient(to left, transparent, #C29C41, #e8c96a, #C29C41, transparent)',
                }}
              />
              <Image
                alt="أخبار المكتبة الرقمية"
                src="/newsCover.png"
                width={900}
                height={650}
                className="h-auto w-full object-cover rounded-2xl"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 rounded-2xl" />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="text-right">

              {/* Eyebrow badge — gold */}
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                style={{
                  borderColor: 'rgba(194,156,65,0.35)',
                  backgroundColor: 'rgba(194,156,65,0.07)',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C29C41]" />
                <span className="text-xs font-bold tracking-widest text-[#C29C41]">
                  أخبار المكتبة
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                آخر المستجدات داخل المكتبة الرقمية
              </h2>

              {/* Dual-color rule */}
           
            </div>

            {/* News list */}
            <div className="mt-6 space-y-3">
              {news.map((item, idx) => {
                const isMiddle = idx === 1;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group block rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      border: isMiddle
                        ? '1px solid rgba(194,156,65,0.35)'
                        : '1px solid rgba(3,105,161,0.15)',
                      background: isMiddle
                        ? 'linear-gradient(135deg, #fffdf5 0%, #ffffff 100%)'
                        : 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
                    }}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3
                          className="text-base font-bold text-slate-900 transition-colors duration-200 sm:text-base group-hover:text-[#0369A1]"
                          style={isMiddle ? {} : {}}
                        >
                          {/* Gold accent number */}
                          <span
                            className="ml-2 text-xs font-black"
                            style={{ color: isMiddle ? '#C29C41' : '#0369A1' }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                        {/* Date badge */}
                        <div
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: isMiddle
                              ? 'rgba(194,156,65,0.10)'
                              : 'rgba(3,105,161,0.08)',
                            color: isMiddle ? '#7a5c10' : '#003652',
                          }}
                        >
                          <LuCalendar
                            className="h-3.5 w-3.5"
                            style={{ color: isMiddle ? '#C29C41' : '#0369A1' }}
                          />
                          {item.date}
                        </div>

                        {/* Read more */}
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold"
                          style={{ color: isMiddle ? '#C29C41' : '#0369A1' }}
                        >
                          اقرأ المزيد
                          <LuArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryNews;