'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuArrowLeft, LuCalendar } from 'react-icons/lu';

// ✅ Keep your image import (replace with your real image)
import ebook5 from '@/images/landing/ebook/img-5.jpg';

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
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered container card (premium feel) */}
        <div className="rounded-3xl  sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
               <Image
                alt="أخبار المكتبة الرقمية"
                src="/newsCover.png"
                width={900}
                height={650}
                className="h-auto w-full object-cover rounded-2xl"
              />
                {/* subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                {/* <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  تحديثات المكتبة
                </div> */}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="text-center lg:text-right">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#0369a1]" />
                  أخبار المكتبة
                </span>

                <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  آخر المستجدات داخل المكتبة الرقمية
                </h2>

                {/* <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base lg:mx-0">
                  تابع التحديثات الدورية: أقسام جديدة، تحسينات في البحث والفهرسة،
                  وإصدارات مختارة بعناية لدعم المختصين والباحثين.
                </p> */}
              </div>

              {/* News list */}
              <div className="mt-6 space-y-3">
                {news.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 transition group-hover:text-[#0369a1] sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#F0F7FC] px-3 py-1 text-xs font-semibold text-slate-700">
                          <LuCalendar className="h-4 w-4 text-[#0369a1]" />
                          {item.date}
                        </div>

                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0369a1]">
                          اقرأ المزيد
                          <LuArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/news"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0369a1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#075985]"
                >
                  عرض جميع الأخبار
                </Link>
             
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryNews;
