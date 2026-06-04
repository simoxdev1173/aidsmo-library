import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenCheck,
  Bot,
  Database,
  Download,
  FileSearch,
  MessageCircleQuestion,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const researchPaths = [
  {
    title: 'ابدأ بسؤال بحثي',
    text: 'اكتب كلمة مفتاحية أو عنوان إصدار للوصول السريع إلى الكتب والدراسات والتقارير.',
    href: '/catalog/industry',
    label: 'افتح الفهرس',
    Icon: Search,
  },
  {
    title: 'صف النتائج بذكاء',
    text: 'ضيّق النتائج حسب نوع المادة أو سنة النشر أو المجال المعرفي دون إعادة تصفح القطاعات.',
    href: '/catalog/industry',
    label: 'جرّب التصفية',
    Icon: SlidersHorizontal,
  },
  {
    title: 'اقرأ واحفظ المرجع',
    text: 'انتقل من المعاينة إلى التحميل أو الاقتباس مع الحفاظ على سياق الإصدار.',
    href: '#latest-pub',
    label: 'أحدث الإصدارات',
    Icon: BookOpenCheck,
  },
  {
    title: 'اسأل مساعد المكتبة',
    text: 'حوّل احتياجك إلى مسار بحث واضح عندما لا تعرف العنوان أو التصنيف المناسب.',
    href: '#chatbot',
    label: 'اسأل المساعد',
    Icon: MessageCircleQuestion,
  },
];

const archiveStats = [
  { label: 'كتاب ودليل', value: '+350' },
  { label: 'بحث ودراسة', value: '+140' },
  { label: 'مجلة متخصصة', value: '+17' },
];

const BrowseBySubject = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-20 md:py-28" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(3,105,161,0.72) 1px, transparent 1px), linear-gradient(90deg, rgba(3,105,161,0.72) 1px, transparent 1px)',
          backgroundSize: '68px 68px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(194,156,65,0.16),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(240,247,252,0.94)_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#C29C41]/30" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[560px] overflow-hidden border border-[#C29C41]/35 bg-[#0A2540] shadow-[0_28px_72px_rgba(10,37,64,0.18)]">
          <div className="absolute inset-x-0 top-0 h-1.5 brass-gradient" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.16)_0%,transparent_28%,rgba(232,201,106,0.12)_100%)]" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 text-white">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#E8C96A]">
                  Research Compass
                </p>
                <h2 className="mt-3 font-academic text-4xl font-bold leading-tight md:text-5xl">
                  بوصلة الوصول للمعلومة
                </h2>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#E8C96A]/45 bg-white/10 text-[#E8C96A] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Database className="h-7 w-7" strokeWidth={1.5} />
              </div>
            </div>

            <div className="research-orbit mx-auto my-10 h-[280px] w-full max-w-[420px]" aria-hidden>
              <div className="research-orbit-ring research-orbit-ring-a" />
              <div className="research-orbit-ring research-orbit-ring-b" />
              <div className="research-archive-stack">
                <div className="research-book research-book-top">
                  <span />
                </div>
                <div className="research-book research-book-mid">
                  <span />
                </div>
                <div className="research-book research-book-bottom">
                  <span />
                </div>
                <div className="research-glow" />
              </div>
              <div className="research-chip research-chip-search">
                <Search className="h-4 w-4" />
                بحث
              </div>
              <div className="research-chip research-chip-download">
                <Download className="h-4 w-4" />
                تحميل
              </div>
              <div className="research-chip research-chip-ai">
                <Bot className="h-4 w-4" />
                مساعد ذكي
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {archiveStats.map((item) => (
                <div key={item.label} className="border border-white/12 bg-white/[0.06] p-3 text-center text-white backdrop-blur">
                  <p className="font-display text-xl font-bold text-[#E8C96A]" dir="ltr">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/72">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#C29C41]">
            بدل التصفح المتكرر
          </p>
          <h2 className="academic-heading mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
            اختر طريقة الوصول، لا القطاع فقط
          </h2>
          <p className="mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
            عندما تكون القطاعات موجودة في شريط التنقل، تصبح هذه المساحة أفضل كدليل عمل سريع يساعد الزائر على الانتقال من السؤال إلى المصدر المناسب.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {researchPaths.map((path, index) => {
              const Icon = path.Icon;

              return (
                <Link
                  key={path.title}
                  href={path.href}
                  className="group corner-card relative min-h-[238px] overflow-hidden border border-[#C29C41]/30 bg-white/88 p-6 shadow-[0_16px_38px_rgba(10,37,64,0.08)] transition duration-300 [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] hover:-translate-y-1 hover:border-[#C29C41]/65 hover:shadow-[0_24px_58px_rgba(10,37,64,0.13)] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-4 focus:ring-offset-[#F8FAFC]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#C29C41,rgba(3,105,161,0.55),transparent)] opacity-75" aria-hidden />
                  <div className="flex h-12 w-12 items-center justify-center border border-[#C29C41]/35 bg-[#F8FAFC] text-[#C29C41] transition duration-300 group-hover:bg-[#0A2540] group-hover:text-[#E8C96A]">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold leading-relaxed text-[#003652]">{path.title}</h3>
                  <p className="mt-3 font-academic text-lg leading-8 text-[#475569]">{path.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#C29C41]">
                    {path.label}
                    <ArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-r-2 border-[#C29C41] bg-white/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileSearch className="mt-1 h-5 w-5 shrink-0 text-[#C29C41]" strokeWidth={1.6} />
              <p className="font-academic text-lg leading-8 text-[#475569]">
                صممت هذه البوصلة لتختصر قرار الزائر: هل يبحث، يصفّي، يقرأ، أم يحتاج مساعدة؟
              </p>
            </div>
            <Link
              href="/catalog/industry"
              className="engraved brass-gradient inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-[#C29C41] px-5 text-sm font-bold text-[#0A2540] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseBySubject;
