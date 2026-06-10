'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenCheck,
  Bot,
  Building2,
  Factory,
  LibraryBig,
  Pickaxe,
  Scale,
  Search,
} from 'lucide-react';

type ServiceCard = {
  title: string;
  description: string;
  href: string;
  action: string;
  Icon: typeof Search;
};

type SectorLink = {
  label: string;
  href: string;
  Icon: typeof Factory;
};

const services: ServiceCard[] = [
  {
    title: 'مساعدة بحثية فورية',
    description: 'انتقل إلى المساعد الذكي لطرح أسئلة حول الإصدارات أو تضييق نطاق البحث داخل المكتبة.',
    href: '#chatbot',
    action: 'اسأل المساعد',
    Icon: Bot,
  },
  {
    title: 'أحدث الإصدارات',
    description: 'تابع المواد التي تمت إضافتها حديثا في مجالات الصناعة والتقييس والتعدين.',
    href: '#latest-pub',
    action: 'عرض الإصدارات',
    Icon: BookOpenCheck,
  },
  {
    title: 'مدخل القطاعات',
    description: 'ابدأ من المجال المناسب ثم انتقل مباشرة إلى الرف الرقمي الخاص به.',
    href: '/catalog/industry',
    action: 'ابدأ التصفح',
    Icon: LibraryBig,
  },
];

const sectors: SectorLink[] = [
  { label: 'الصناعة', href: '/catalog/industry', Icon: Factory },
  { label: 'التقييس', href: '/catalog/standardization', Icon: Scale },
  { label: 'التعدين', href: '/catalog/mining', Icon: Pickaxe },
  { label: 'المعلومات الصناعية', href: '/catalog/industrial-info', Icon: Building2 },
];

const LibraryNews = () => {
  return (
    <section
      id="library-services"
      className="relative overflow-hidden bg-[#F7F0E1] py-20 md:py-28"
      aria-label="خدمات المكتبة الرقمية"
      dir="rtl"
    >
  <Image
        src="/services-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-100 blur-xs sm:opacity-75"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-5 lg:gap-14" dir="ltr">
         

          <div className="flex h-full flex-col justify-center lg:col-span-3 lg:col-start-3 lg:row-start-1" dir="rtl">
            <div>

              <h2 className="academic-heading text-[#FAF5F2] mt-4 text-4xl leading-tight md:text-5xl">
                خدمات المكتبة الرقمية
              </h2>
              <p className="mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#F2EEEC]">
                مسارات عملية تساعدك على الوصول إلى الإصدارات، اختيار مجال البحث، أو طلب إرشاد سريع من المساعد الذكي.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {services.map((service) => {
                const Icon = service.Icon;

                return (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group corner-card flex min-h-[15rem] flex-col justify-between border border-[#C29C41]/30 bg-white/88 p-5 text-right shadow-[0_16px_38px_rgba(10,37,64,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C29C41]/65 hover:shadow-[0_24px_58px_rgba(10,37,64,0.13)] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-4 focus:ring-offset-[#F7F0E1]"
                  >
                    <div>
                      <span className="flex h-11 w-11 items-center justify-center border border-[#C29C41]/35 bg-white text-[#9A7421]">
                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>
                      <h3 className="mt-4 text-xl font-bold leading-relaxed text-[#003652] transition duration-300 group-hover:text-[#9A7421]">
                        {service.title}
                      </h3>
                      <p className="mt-2 font-academic text-base leading-relaxed text-[#64748B]">
                        {service.description}
                      </p>
                    </div>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0369A1] transition duration-300 group-hover:text-[#C29C41]">
                      {service.action}
                      <ArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 border border-[#C29C41]/25 bg-white/88 p-4 shadow-[0_14px_34px_rgba(10,37,64,0.08)] backdrop-blur-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#003652]">اختر مجال العمل مباشرة</h3>
                  <p className="mt-1 font-academic text-base leading-relaxed text-[#64748B]">
                    روابط مختصرة إلى نفس قطاعات المكتبة المستخدمة في شريط التنقل.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sectors.map((sector) => {
                    const Icon = sector.Icon;

                    return (
                      <Link
                        key={sector.href}
                        href={sector.href}
                        className="inline-flex items-center gap-2 border border-[#C29C41]/30 bg-[#FFF8E1] px-3 py-2 text-sm font-bold text-[#7A5C10] transition duration-200 hover:border-[#C29C41]/70 hover:bg-[#F7E5A9] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                        {sector.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
           <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1" dir="rtl">
            <div className=" relative h-full overflow-hidden border border-[#C29C41]/35 bg-white/88 p-3 shadow-[0_22px_58px_rgba(10,37,64,0.1)]">
              <div className="relative min-h-[28rem] overflow-hidden  lg:h-full lg:min-h-0">
                <Image
                  alt="واجهة خدمات المكتبة الرقمية"
                  src="/section-4-card.png"
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="object-cover"
                />


                <div className="absolute inset-x-4 bottom-4 space-y-3">
                  <div className="border border-white/25 bg-white/90 p-4 text-right shadow-[0_12px_30px_rgba(10,37,64,0.2)] backdrop-blur">
                    <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C29C41]">
                      خدمات المكتبة
                    </p>
                    <p className="mt-2 text-lg font-bold leading-relaxed text-[#003652]">
                      وصول أسرع إلى المعرفة المتخصصة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryNews;
