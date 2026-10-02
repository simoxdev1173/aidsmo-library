import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import FoundingTimeline from './FoundingTimeline';
import styles from './FoundingCards.module.css';

export const metadata = {
  title: 'تأسيس المنظمة | الأرشيف',
  description: 'تأسيس المنظمة والدول العربية الأعضاء من الدليل التعريفي للمنظمة العربية للتنمية الصناعية والتقييس والتعدين.',
};

const milestones = [
  {
    year: '1966',
    text: 'أصدر المؤتمر الأول للتنمية الصناعية في الدول العربية الذي عقد بدولة الكويت (1-10/3/1966) توصية بإنشاء مركز التنمية الصناعية للعمل على دفع عجلة التنمية الصناعية في الدول العربية وتطورها.',
  },
  {
    year: '1968',
    text: 'وافق المجلس الاقتصادي والاجتماعي في دورته العادية الثالثة عشرة بموجب قراره رقم 359 بتاريخ 18/5/1968 على إنشاء المركز في جمهورية مصر العربية. وفي دورته الرابعة عشرة أصدر المجلس قراره رقم 397 (25/1/1969) باعتماد نظام المركز الأساسي. وقد عقد أول مجلس إدارة للمركز في القاهرة (24-29/5/1969).',
  },
  {
    year: '1975',
    text: 'أصدر السادة وزراء الصناعة العرب في اجتماعهم بالقاهرة (26-28/5/1975) توصية بتحويل المركز إلى منظمة عربية مستقلة. وفي اجتماع بالخرطوم (1-4/11/1975) وافق مجلس إدارة المركز على مشروع اتفاقية إنشاء المنظمة.',
  },
  {
    year: '1978',
    text: 'أصدر المجلس الاقتصادي والاجتماعي قراره رقم 742 في دورته الخامسة والعشرون المنعقدة (9-10/9/1978) بالموافقة على تحويل المركز التنمية الصناعية إلى المنظمة العربية للتنمية الصناعية.',
  },
  {
    year: '1979',
    text: 'انتقلت المنظمة من القاهرة إلى تونس مؤقتا شهر مايو 1979.',
  },
  {
    year: '1979–1980',
    text: 'وفي اجتماع وزراء الصناعة العرب في مؤتمر التنمية الصناعية الخامس بالجزائر شهر نوفمبر 1979 اختيرت مدينة بغداد – جمهورية العراق مقرا للمنظمة وباشرت فيها أعمالها في سبتمبر 1980 بعد نقلها من تونس.',
  },
  {
    year: '1988–1990',
    text: 'ونظرا لوجود علاقة مباشرة بين الصناعة والمواصفات والمقاييس ونشاط التعدين كركيزة أساسية في جودة الصناعة في الدول العربية وفي إطار إعادة هيكلة العمل العربي المشترك واستنادا إلى قرار المجلس الاقتصادي والاجتماعي العربي رقم 1056 الصادر في دورته الغير العادية – عمان - المملكة الأردنية الهاشمية (5-6/7/1988) وقراره رقم 1086 الصادر في الدورة السابعة والأربعين المنعقدة في تونس (25/10/1989) وإلى قرار اللجنة الوزارية المنبثقة من المجلس الاقتصادي والاجتماعي المنعقدة في تونس (8-9/9/1988) التي قررت اعتبار المنظمة العربية للتنمية الصناعية هي المنظمة ذات النشاط الرئيسي وأوكلت لها مهام المنظمة العربية للثروة المعدنية التي وافق المجلس الاقتصادي والاجتماعي على تأسيسها في (24/2/1979) والمنظمة العربية للمواصفات والمقاييس والتي وافق المجلس الاقتصادي والاجتماعي على تأسيسها في (12/12/1965) وباشرت عملها في (25/3/1968) وسميت المنظمة الجديدة بالمنظمة العربية للتنمية الصناعية والتعدين وباشرت عملها من المقر في بغداد يناير 1990. وتقرر أن ينشأ في إطارها وضمن موازنتها وفي مقرها، مركزا تناط به مهام المواصفات والمقاييس مع شمول خدماته لجميع القطاعات وأطلق عليه مركز المواصفات والمقاييس.',
  },
  {
    year: '1992',
    text: 'وفي فبراير 1992 قرر المجلس الاقتصادي والاجتماعي أن تكون مدينة الرباط بالمملكة المغربية مقرا دائما للمنظمة العربية للتنمية الصناعية والتعدين حيث باشرت أعمالها في أغسطس 1992.',
  },
  {
    year: '2020',
    text: 'نظرا للأهمية الحالية لمجال المواصفات والمقاييس على المستوى الوطني والإقليمي والدولي فقد عرض مشروع تعديل مسمى المنظمة ليتضمن التقييس، على المجالس التشريعية للمنظمة وتمت الموافقة عليه بناءً على قرار رقم 498 من طرف أصحاب المعالي وزراء الصناعة في الدول العربية خلال الدورة 26 للجمعية العامة، المنعقدة في الرباط (23/7/2020).',
  },
  {
    year: '2021',
    text: 'أصدر المجلس الاقتصادي والاجتماعي قراره رقم 2301 الصادر في دورته العادية (107) المنعقدة في القاهرة، فبراير 2021 بالموافقة على المسمى الجديد لتصبح "المنظمة العربية للتنمية الصناعية والتقييس والتعدين"',
  },
] as const;

const predecessors = [
  {
    name: 'المنظمة العربية للمواصفات والمقاييس',
    image: '/archive/founding/logo-standards.webp',
    details: ['تاريخ الإنشاء: ديسمبر 1965', 'تاريخ مباشرة العمل: مارس 1968', 'المدينة: القاهرة – عمان'],
  },
  {
    name: 'مركز التنمية الصناعية للدول العربية',
    image: '/archive/founding/logo-industrial-center.webp',
    details: ['تاريخ الإنشاء: مايو 1968', 'تاريخ مباشرة العمل: يناير 1969', 'المدينة: القاهرة'],
  },
  {
    name: 'المنظمة العربية للثروة المعدنية',
    image: '/archive/founding/logo-mineral-resources.webp',
    details: ['تاريخ الإنشاء: فبراير 1979', 'تاريخ مباشرة العمل: فبراير 1979', 'المدينة: الرباط'],
  },
] as const;

const industrialOrganization = {
  name: 'المنظمة العربية للتنمية الصناعية',
  image: '/archive/founding/logo-industrial-organization.png',
  details: ['تاريخ الإنشاء: سبتمبر 1978', 'تاريخ مباشرة العمل: مايو 1979', 'المدينة: تونس', 'تاريخ مباشرة العمل: سبتمبر 1980', 'المدينة: بغداد'],
} as const;

const industrialMiningOrganization = {
  name: 'المنظمة العربية للتنمية الصناعية والتعدين',
  image: '/archive/founding/logo-industrial-mining.png',
  details: ['تاريخ الإنشاء: سبتمبر 1988', 'تاريخ مباشرة العمل: يناير 1990', 'المدينة: بغداد', 'تاريخ مباشرة العمل: فبراير 1992', 'المدينة: الرباط'],
} as const;

function OrganizationHistoryNode({ name, image, details }: { name: string; image: string; details: readonly string[] }) {
  return (
    <article className="relative z-10 mx-auto flex max-w-[340px] flex-col items-center text-center">
      <Image src={image} alt="" width={112} height={112} className="h-24 w-28 object-contain" />
      <h3 className="mt-2 font-academic text-base font-bold leading-7 text-[#003652]">{name}</h3>
      <ul className="mt-2 space-y-0.5 font-academic text-sm leading-6 text-[#475569]">
        {details.map((detail) => <li key={detail}>{detail}</li>)}
      </ul>
    </article>
  );
}

const memberCountries = [
  { name: 'المملكة الأردنية الهاشمية', flag: 'jordan' },
  { name: 'دولة الإمارات العربية المتحدة', flag: 'uae' },
  { name: 'مملكة البحرين', flag: 'bahrain' },
  { name: 'الجمهورية التونسية', flag: 'tunisia' },
  { name: 'الجمهورية الجزائرية الديمقراطية الشعبية', flag: 'algeria' },
  { name: 'دولة جيبوتي', flag: 'djibouti' },
  { name: 'المملكة العربية السعودية', flag: 'saudi-arabia' },
  { name: 'جمهورية السودان', flag: 'sudan' },
  { name: 'الجمهورية العربية السورية', flag: 'syria' },
  { name: 'جمهورية الصومال الفيدرالية', flag: 'somalia' },
  { name: 'جمهورية العراق', flag: 'iraq' },
  { name: 'سلطنة عمان', flag: 'oman' },
  { name: 'دولة فلسطين', flag: 'palestine' },
  { name: 'دولة قطر', flag: 'qatar' },
  { name: 'دولة الكويت', flag: 'kuwait' },
  { name: 'الجمهورية اللبنانية', flag: 'lebanon' },
  { name: 'دولة ليبيا', flag: 'libya' },
  { name: 'جمهورية مصر العربية', flag: 'egypt' },
  { name: 'المملكة المغربية', flag: 'morocco' },
  { name: 'الجمهورية الإسلامية الموريتانية', flag: 'mauritania' },
  { name: 'الجمهورية اليمنية', flag: 'yemen' },
] as const;

const identity = [
  {
    title: 'رؤيتنا',
    text: 'منظمة رائدة تحقق التميز والتعاون والتنسيق بين الدول العربية في تنمية وتطوير الصناعة والتعدين والمواصفات والمقاييس.',
    image: '/archive/founding/identity-vision.webp',
  },
  {
    title: 'رسالتنا',
    text: 'تهيئة المتطلبات الأساسية لدفع التنمية بجودة عالية ومستدامة في مجالات الصناعة والتعدين والتقييس لتساير التطورات المتلاحقة على المستوى العالمي، لإزالة العقبات التي تعترض طريقها في هذه المجالات.',
    image: '/archive/founding/identity-mission.webp',
  },
  {
    title: 'قيمنا',
    text: 'الجودة، روح الفريق، الشفافية، التنوع، المنظومية، التحسين المستمر، الالتزام والانتماء، المبادرة والإبداع.',
    image: '/archive/founding/identity-values.webp',
  },
] as const;

const goals = [
  {
    text: 'المساهمة في تطوير القطاع الصناعي وتحقيق التنسيق والتكامل الصناعي في الدول العربية.',
    image: '/archive/founding/goal-industry.webp',
  },
  {
    text: 'تشجيع صناعات عربية مبنية على الإبداع والابتكار والمعرفة والتكنولوجيا لتعزيز قدرتها التنافسية.',
    image: '/archive/founding/goal-innovation.webp',
  },
  {
    text: 'الارتقاء بمنظومة البنية التحتية للجودة في الدول العربية لتسهيل التبادل التجاري العربي البيني.',
    image: '/archive/founding/goal-quality.webp',
  },
  {
    text: 'الإسهام في تطوير قطاع التعدين في الدول العربية.',
    image: '/archive/founding/goal-mining.webp',
  },
] as const;

const organs = [
  {
    title: 'الجمعية العامة',
    text: 'الجمعية العامة هي السلطة التشريعية في المنظمة وتختص بوضع السياسة العامة التي تسير عليها المنظمة وتخطيط وإقرار ومتابعة برامجها ونشاطها ومراقبة أعمالها الفنية والمالية والإدارية، وتتخذ الجمعية العامة القرارات والإجراءات اللازمة لتحقيق أغراض المنظمة.',
    image: '/archive/founding/general-assembly-meeting.webp',
    href: '/archive/org/general-assembly',
  },
  {
    title: 'المجلس التنفيذي',
    text: 'يتولى المجلس التنفيذي متابعة تحقيق أهداف المنظمة وتنفيذ ما تقرره الجمعية العامة. ويحدد النظام الداخلي للجمعية العامة كيفية اختيار أعضائه، مع مراعاة التوزيع الجغرافي، ويكون التمثيل على مستوى وكلاء أو أمناء الوزارات المعنية أو من ينوب عنهم. ويجتمع المجلس مرتين على الأقل كل عام في مقر المنظمة، ويجوز أن يعقد اجتماعاته في إحدى الدول الأعضاء.',
    image: '/archive/founding/executive-board-meeting.webp',
    href: '/archive/org/executive-board',
  },
  {
    title: 'الإدارة العامة',
    text: 'الإدارة العامة هي الجهاز التنفيذي للمنظمة، وتتولى تنفيذ المهام اللازمة لتحقيق أهدافها وممارسة اختصاصاتها وفق الاتفاقية والأنظمة والأحكام المعتمدة. كما تدير الشؤون الفنية والإدارية والمالية المنوطة بها، ويتألف جهازها من المدير العام والموظفين العاملين فيها. ويقود المدير العام عملها ويوجه تنفيذ قرارات الجمعية العامة والمجلس التنفيذي.',
    image: null,
    href: null,
  },
] as const;

export default function FoundingPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative border-b border-[#C29C41]/25 bg-[#071D2F] text-white">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <Image src="/standardization-bg.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.94),rgba(3,105,161,0.64)_55%,rgba(7,29,47,0.86))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
            <Image src="/aidsmo-logo.png" alt="" width={30} height={30} className="h-7 w-7 object-contain" />
            <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#E8C96A]">آليات المنظمة</span>
          </div>
          <h1 className="mt-6 font-academic text-4xl font-bold leading-tight md:text-6xl">تأسيس المنظمة</h1>
          <p className="mt-5 max-w-3xl font-academic text-lg leading-9 text-white/85 md:text-xl">المنظمة العربية للتنمية الصناعية والتقييس والتعدين</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="مسار الصفحة" className="mb-9 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#0369A1]">الرئيسية</Link>
          <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
          <Link href="/archive" className="hover:text-[#0369A1]">الأرشيف</Link>
          <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
          <Link href="/archive/org" className="hover:text-[#0369A1]">المنظمة العربية للتنمية الصناعية والتقييس والتعدين</Link>
          <HiOutlineChevronLeft className="h-3.5 w-3.5 text-[#C29C41]" aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-[#0A2540]">تأسيس المنظمة</span>
        </nav>

        <section aria-labelledby="founding-intro-heading" className="mb-12 overflow-hidden rounded-[18px] border border-[#DCE6EF] bg-white shadow-[0_12px_34px_rgba(10,37,64,0.055)]">
          <div className="h-1.5 bg-gradient-to-l from-[#C29C41] via-[#E8C96A] to-[#0369A1]" aria-hidden="true" />
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 id="founding-intro-heading" className="font-academic text-2xl font-bold text-[#003652]">نبذة تعريفية</h2>
            <p className="mt-5 max-w-5xl font-academic text-base leading-9 text-[#334155] md:text-lg md:leading-10">
              المنظمة العربية للتنمية الصناعية والتقييس والتعدين هي منظمة عربية متخصصة ذات شخصية اعتبارية واستقلال مالي وإداري تعمل في إطار جامعة الدول العربية في مجالات الصناعة، التقييس والتعدين، أنشأت نتيجة لدمج مهام المنظمة العربية للثروة المعدنية والمنظمة العربية للمواصفات والمقاييس بالمنظمة العربية للتنمية الصناعية وتضم في عضويتها (21) دولة عربية.
            </p>
          </div>
        </section>

        <section aria-label="رؤيتنا ورسالتنا وقيمنا" className={`${styles.cardGrid} mb-12 grid gap-5 lg:grid-cols-3`}>
          {identity.map((item, index) => (
            <article
              key={item.title}
              className="relative flex min-h-[320px] flex-col overflow-hidden rounded-[22px] border border-[#DCE6EF] bg-white p-7 text-[#003652] shadow-[0_16px_42px_rgba(10,37,64,0.08)] sm:p-8"
            >
              <div className="absolute inset-0" aria-hidden="true">
                <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="scale-110 object-cover blur-[3px]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/76 to-white/92" aria-hidden="true" />
              <div className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full border border-[#C29C41]/20" aria-hidden="true" />
              <div className="relative flex justify-end">
                <span dir="ltr" className="font-display text-sm font-bold tracking-[0.25em] text-[#9B7626]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="relative mt-auto pt-8">
                <span className="mb-4 block h-1 w-12 rounded-full bg-[#C29C41]" aria-hidden="true" />
                <h2 className="font-academic text-2xl font-bold text-[#003652]">{item.title}</h2>
                <p className="mt-4 font-academic text-base leading-8 text-[#334155]">{item.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section aria-labelledby="founding-predecessors-heading" className="mb-12">
          <h2 id="founding-predecessors-heading" className="mb-7 font-academic text-2xl font-bold text-[#003652]">المنظمة العربية للتنمية الصناعية والتقييس والتعدين</h2>
          <div className="overflow-hidden rounded-[22px] border border-[#DCE6EF] bg-white px-5 py-9 shadow-[0_12px_34px_rgba(10,37,64,0.055)] sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
              {predecessors.map((predecessor) => (
                <OrganizationHistoryNode key={predecessor.name} {...predecessor} />
              ))}
            </div>

            <div className="relative mt-10 border-t border-dashed border-[#C29C41]/40 pt-8 lg:mt-0 lg:h-[360px] lg:border-0 lg:pt-0">
              <svg className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full text-[#A6B4B8] lg:block" viewBox="0 0 1000 360" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path d="M167 0 V310 L500 360 M500 0 V28 M500 310 V360 M833 0 V310 L500 360" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="relative z-10 mx-auto bg-white lg:absolute lg:left-1/2 lg:top-7 lg:w-[34%] lg:-translate-x-1/2 lg:px-2">
                <OrganizationHistoryNode {...industrialOrganization} />
              </div>
            </div>

            <div className="mx-auto h-9 w-px bg-[#A6B4B8]" aria-hidden="true" />
            <OrganizationHistoryNode {...industrialMiningOrganization} />
            <div className="mx-auto my-7 h-12 w-px bg-[#A6B4B8]" aria-hidden="true" />

            <div className="mx-auto max-w-2xl text-center">
              <Image src="/archive/founding/logo-aidsmo.png" alt="" width={128} height={128} className="mx-auto h-28 w-28 object-contain" />
              <h3 className="mt-2 font-academic text-lg font-bold text-[#003652]">المنظمة العربية للتنمية الصناعية والتقييس والتعدين</h3>
              <p className="mt-2 font-academic text-sm text-[#475569]">المدينة: الرباط</p>
              <p className="mt-5 border-t border-[#E8EEF4] pt-5 font-academic text-sm leading-7 text-[#475569]">
                تمت الموافقة على تعديل مسمى المنظمة ليشمل التقييس خلال الدورة 26 للجمعية العامة في الرباط (23/7/2020)، ثم وافق المجلس الاقتصادي والاجتماعي في فبراير 2021 على المسمى الجديد.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="founding-timeline-heading">
          <h2 id="founding-timeline-heading" className="mb-7 font-academic text-2xl font-bold text-[#003652]">محطات التأسيس</h2>
          <FoundingTimeline milestones={milestones} />
        </section>

        <section aria-labelledby="founding-goals-heading" className="mt-14">
          <h2 id="founding-goals-heading" className="mb-7 font-academic text-2xl font-bold text-[#003652]">من أهدافنا</h2>
          <div className={`${styles.cardGrid} grid gap-5 sm:grid-cols-2 xl:grid-cols-4`}>
            {goals.map((goal, index) => (
              <article key={goal.image} className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[22px] border border-[#DCE6EF] bg-white p-6 shadow-[0_12px_34px_rgba(10,37,64,0.055)] sm:p-7">
                <div className="absolute inset-0" aria-hidden="true">
                  <Image src={goal.image} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="scale-110 object-cover blur-[3px]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/76 to-white/92" aria-hidden="true" />
                <div className="relative flex justify-end">
                  <span dir="ltr" className="font-display text-sm font-bold tracking-[0.25em] text-[#9B7626]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="relative mt-auto pt-8">
                  <span className="mb-4 block h-1 w-12 rounded-full bg-[#C29C41]" aria-hidden="true" />
                  <p className="font-academic text-base font-semibold leading-8 text-[#003652]">{goal.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="founding-organs-heading" className="mt-14">
          <h2 id="founding-organs-heading" className="mb-7 font-academic text-2xl font-bold text-[#003652]">أجهزة المنظمة</h2>
          <div className={`${styles.cardGrid} grid gap-5 lg:grid-cols-3`}>
            {organs.map((organ) => (
              <article key={organ.title} className="relative flex flex-col overflow-hidden rounded-[18px] border border-[#DCE6EF] bg-white shadow-[0_12px_34px_rgba(10,37,64,0.055)]">
                {organ.image ? (
                  <div className="relative h-44 bg-[#F0F7FC]">
                    <Image src={organ.image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-[#0A2540]">
                    <Image src="/aidsmo-logo.png" alt="" width={104} height={104} className="h-24 w-24 object-contain" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-academic text-xl font-bold text-[#003652]">{organ.title}</h3>
                  <p className="mt-4 flex-1 font-academic text-sm leading-8 text-[#475569]">{organ.text}</p>
                  {organ.href && <Link href={organ.href} className="mt-6 inline-flex min-h-10 items-center self-start rounded-full border border-[#C29C41]/55 bg-[#FBF7EA] px-4 text-sm font-bold text-[#8B681C] transition-colors hover:bg-[#F0F7FC] hover:text-[#0369A1]">عرض الأعضاء</Link>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="member-countries-heading" className="mt-14">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <h2 id="member-countries-heading" className="font-academic text-2xl font-bold text-[#003652]">الدول العربية الأعضاء</h2>
            <span className="rounded-full border border-[#C29C41]/35 bg-[#FBF7EA] px-4 py-1.5 text-sm font-bold text-[#8B681C]">{memberCountries.length} دولة عربية</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberCountries.map((country) => (
              <article key={country.flag} className="flex min-h-28 items-center gap-5 rounded-[16px] border border-[#DCE6EF] bg-white px-6 py-4 shadow-[0_10px_26px_rgba(10,37,64,0.045)]">
                <Image src={`/archive/founding/flag-${country.flag}.webp`} alt="" width={70} height={48} className="h-12 w-[70px] shrink-0 rounded-sm border border-[#E8EEF4] object-cover" />
                <h3 className="font-academic text-base font-bold leading-7 text-[#003652]">{country.name}</h3>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
