import Image from 'next/image';
import Link from 'next/link';
import {
  HiOutlineArchiveBox,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineBuildingLibrary,
  HiOutlineCircleStack,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const pillars = [
  {
    title: 'تنظيم المعرفة',
    description: 'جمع الإصدارات والدراسات والتقارير المتخصصة في هيكل واضح يسهل تصفحه والرجوع إليه.',
    Icon: HiOutlineArchiveBox,
  },
  {
    title: 'بحث ذكي',
    description: 'تجربة بحث تساعد المستخدم على الوصول إلى المحتوى الصناعي والتعديني والتقييسي بسرعة ووضوح.',
    Icon: HiOutlineMagnifyingGlass,
  },
  {
    title: 'مرجع عربي موثوق',
    description: 'إتاحة مصادر معرفية صادرة عن المنظمة لخدمة الباحثين وصناع القرار والمهتمين بالقطاع الصناعي العربي.',
    Icon: HiOutlineBuildingLibrary,
  },
];

const stats = [
  { value: '350+', label: 'كتاب رقمي', Icon: HiOutlineBookOpen },
  { value: '140+', label: 'بحث ودراسة', Icon: HiOutlineSparkles },
  { value: '90+', label: 'تقرير صناعي', Icon: HiOutlineCircleStack },
];

const chapters = [
  {
    number: '01',
    title: 'الفكرة',
    text: 'نشأت المكتبة الرقمية الذكية من الحاجة إلى بوابة عربية تجمع المعرفة الصناعية والتقنية المتخصصة وتعرضها بصورة قابلة للبحث والاستكشاف.',
  },
  {
    number: '02',
    title: 'الدور',
    text: 'تدعم المكتبة الباحثين والمهنيين وصناع القرار بمحتوى موثوق يساعد على فهم التحولات الصناعية والتعدينية والتقييسية في الدول العربية.',
  },
  {
    number: '03',
    title: 'الأثر',
    text: 'تسهم المنصة في نشر المعرفة، وتعزيز الابتكار، وتسهيل الوصول إلى إصدارات المنظمة ضمن تجربة رقمية واضحة وذات طابع مؤسسي.',
  },
];

export default function AboutPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F8FAFC] text-[#0A2540]">
      <section className="relative min-h-[78vh] overflow-hidden bg-[#0A2540] pt-32 text-white md:pt-36">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        >
          <source src="/hero-video-3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A2540]/96 via-[#0369A1]/72 to-[#0A2540]/90" />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '84px 84px',
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-1 brass-gradient" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[calc(78vh-9rem)] max-w-7xl items-center px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-display text-xs font-bold uppercase tracking-[0.28em] text-[#E8C96A]">
                المكتبة الرقمية الذكية
              </p>
              <h1 className="mt-6 font-academic text-5xl font-bold leading-tight md:text-7xl">
                من نحن
              </h1>
              <p className="mt-7 max-w-3xl font-academic text-xl leading-10 text-white/82 md:text-2xl">
                منصة عربية متخصصة أعدّتها المنظمة العربية للتنمية الصناعية والتقييس والتعدين لجمع المعرفة الصناعية والتقنية وتنظيمها وإتاحتها للباحثين والمهنيين وصناع القرار.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/catalog/industry"
                  className="engraved brass-gradient inline-flex h-12 items-center gap-2 border border-[#C29C41] px-6 text-sm font-bold text-[#0A2540] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
                >
                  استكشاف المكتبة
                  <HiOutlineArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  href="/#chatbot"
                  className="inline-flex h-12 items-center border border-white/24 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
                >
                  اسأل المساعد الذكي
                </Link>
              </div>
            </div>

           
          </div>
        </div>
      </section>

      <section className="relative bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="corner-frame relative overflow-hidden border border-[#C29C41]/35 bg-[#F0F7FC]">
              <Image
                src="/hero-image-2.png"
                alt="واجهة المكتبة الرقمية الذكية"
                width={900}
                height={700}
                className="h-full min-h-[420px] w-full object-cover sepia-reveal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/46 via-transparent to-transparent" />
            </div>

            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#C29C41]">
                رسالتنا
              </p>
              <h2 className="academic-heading mt-4 text-3xl leading-tight md:text-4xl">
                تحويل أرشيف المعرفة إلى تجربة بحث واستكشاف
              </h2>
              <div className="mt-6 max-w-md [--divider-bg:#FFFFFF]">
                <div className="ornate-divider" aria-hidden />
              </div>
              <div className="mt-8 space-y-6 font-academic text-xl leading-10 text-[#475569]">
                <p>
                  أعدّت المنظمة العربية للتنمية الصناعية والتقييس والتعدين المكتبة الرقمية الذكية لتكون منصة رائدة تجمع المعرفة الصناعية والتقنية وتنظمها بطريقة ذكية ومتاحة للجميع.
                </p>
                <p>
                  تسعى المكتبة إلى أن تكون مرجعاً موثوقاً للباحثين والمهتمين بالقطاع الصناعي والتعديني، من خلال محتوى غني يدعم البحث العلمي والتطوير المهني واتخاذ القرار المبني على المعرفة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#0369A1]/10 bg-[#F0F7FC] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="academic-heading text-3xl leading-tight md:text-4xl">
              ما الذي تقدمه المكتبة الرقمية الذكية ؟
            </h2>
            <p className="mt-5 font-academic text-xl leading-9 text-[#475569]">
              تجربة مؤسسية واضحة تجمع بين موثوقية المحتوى وسهولة الوصول إليه.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.Icon;

              return (
                <article key={pillar.title} className="group corner-card academic-card p-6">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#C29C41]/35 bg-white text-[#C29C41] transition duration-300 group-hover:border-[#0369A1]/35 group-hover:text-[#0369A1]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003652]">{pillar.title}</h3>
                  <p className="mt-4 text-base leading-8 text-[#475569]">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#C29C41]">
                مسار العمل
              </p>
              <h2 className="academic-heading  mt-4 text-3xl leading-tight md:text-3xl">
                من الأرشفة إلى الإتاحة الذكية
              </h2>
            </div>

            <div className="grid gap-4">
              {chapters.map((chapter) => (
                <article key={chapter.number} className="grid gap-5 border border-[#0369A1]/14 bg-[#F8FAFC] p-5 md:grid-cols-[90px_1fr] md:p-6">
                  <div className="font-display text-4xl font-bold text-[#C29C41]">{chapter.number}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#003652]">{chapter.title}</h3>
                    <p className="mt-3 font-academic text-lg leading-9 text-[#475569]">{chapter.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      
    </main>
  );
}
