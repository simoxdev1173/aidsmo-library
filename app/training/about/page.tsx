import Image from 'next/image';
import Link from 'next/link';
import {
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import { SectionHeading, TrainingHero } from '@/app/training/_components/TrainingShared';

export const dynamic = 'force-dynamic';

const OFFICIAL_SITE = 'https://aimtci-aidsmo.org';

const FOCUS_AREAS = [
  {
    icon: HiOutlineAcademicCap,
    title: 'برامج تدريبية متخصصة',
    body: 'دورات تأهيلية وتخصصية في المجالين الصناعي والتعديني، موجهة للكوادر الوطنية في الدول العربية الأعضاء.',
  },
  {
    icon: HiOutlineBriefcase,
    title: 'استشارات فنية',
    body: 'دعم استشاري للمؤسسات الصناعية والتعدينية في بناء القدرات وتطوير الأداء المؤسسي.',
  },
  {
    icon: HiOutlineMapPin,
    title: 'مقر المعهد',
    body: 'يتخذ المعهد من مدينة الرباط بالمملكة المغربية مقرا له، بصفته الذراع التدريبية للمنظمة.',
  },
];

export default function TrainingAboutPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#0A2540]">
      <TrainingHero
        breadcrumb={[{ label: 'التدريب والاستشارات', href: '/training/about' }, { label: 'حول المعهد', href: '/training/about' }]}
        badge="AIMTCI"
        title="المعهد العربي للتدريب والاستشارات الصناعية والتعدينية"
        subtitle="الرباط، المملكة المغربية · الذراع التدريبية للمنظمة العربية للتنمية الصناعية والتقييس والتعدين"
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <article>
          <SectionHeading>عن المعهد</SectionHeading>
          <p className="dropcap max-w-[85ch] font-academic text-[1.12rem] leading-[2.2] text-[#334155]">
            المعهد العربي للتدريب والاستشارات الصناعية والتعدينية (AIMTCI) هو الذراع التدريبية والاستشارية
            التابعة للمنظمة العربية للتنمية الصناعية والتقييس والتعدين (AIDSMO)، ويتخذ من مدينة الرباط
            بالمملكة المغربية مقرا له. يعمل المعهد على تطوير القدرات البشرية في القطاعين الصناعي والتعديني
            عبر الدول العربية الأعضاء، من خلال برامج تدريبية متخصصة تغطي مجالات إدارية وفنية وتقنية، إلى
            جانب تقديم استشارات فنية تدعم المؤسسات الصناعية والتعدينية في بناء قدراتها المؤسسية وتحسين
            أدائها.
          </p>
        </article>

        {/* Focus areas — a plain grid, no card boxes */}
        <div className="mt-14">
          <SectionHeading>مجالات العمل</SectionHeading>
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-3">
            {FOCUS_AREAS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t-2 border-[#C29C41]/25 pt-4">
                <Icon className="h-6 w-6 text-[#0369A1]" />
                <h3 className="mt-3 text-base font-bold text-[#003652]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promotional CTA toward the institute's own platform */}
        <div className="relative mt-14 overflow-hidden rounded-[20px] border border-[#C29C41]/30 bg-[#071D2F] p-8 text-white md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(232,201,106,0.18),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(14,165,233,0.14),transparent_42%)]"
            aria-hidden
          />
          <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
            {/* The logo has its own white backdrop, so it sits on a plate
                rather than floating a white rectangle over the dark banner. */}
            <div className="flex w-full max-w-[220px] shrink-0 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_14px_34px_rgba(0,0,0,0.28)] md:max-w-[240px]">
              <Image
                src="/aimtci-cover.png"
                alt="المعهد العربي للتدريب والاستشارات الصناعية والتعدينية (AIMTCI)"
                width={480}
                height={480}
                className="h-auto w-full"
              />
            </div>

            <div className="flex-1 text-center md:text-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C29C41]/18 px-3 py-1 text-xs font-bold text-[#E8C96A] ring-1 ring-[#C29C41]/30">
                <HiOutlineGlobeAlt className="h-3.5 w-3.5" />
                المنصة الرسمية
              </span>
              <h2 className="mt-4 font-academic text-2xl font-bold leading-tight md:text-3xl">
                تصفّح برامج المعهد ومنصته الإلكترونية
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
                لمزيد من التفاصيل حول البرامج التدريبية والاستشارات المتاحة، والتسجيل في الدورات، يمكن زيارة
                المنصة الرسمية للمعهد العربي للتدريب والاستشارات الصناعية والتعدينية.
              </p>

              <a
                href={OFFICIAL_SITE}
                target="_blank"
                rel="noopener noreferrer"
                className="engraved brass-gradient mt-6 inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#071D2F]"
              >
                زيارة المنصة
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Link
          href="/training/plan"
          className="group mt-14 flex items-center justify-between gap-4 border-t border-[#E3EAF3] pt-6 transition duration-200"
        >
          <div>
            <p className="text-xs font-bold text-[#C29C41]">التدريب</p>
            <p className="mt-1 text-base font-bold text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
              تصفّح الخطة التدريبية للمعهد
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F8FB] text-[#0369A1] transition duration-200 group-hover:bg-[#0369A1] group-hover:text-white">
            <HiOutlineArrowLeft className="h-5 w-5" />
          </span>
        </Link>

        <AiAssistantPanel
          title="المعهد العربي للتدريب والاستشارات"
          prompts={[
            'ما هي خدمات المعهد العربي للتدريب والاستشارات؟',
            'أين يقع المعهد وما علاقته بالمنظمة؟',
            'ما هي الدورات التدريبية المتاحة حاليا؟',
          ]}
        />
      </section>
    </main>
  );
}
