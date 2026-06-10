import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineLanguage,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { getStandardizationPageData } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';

type StandardizationPageConfig = {
  slug: string | string[];
  resetHref?: string;
  assistantScope?: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  heroImage: string;
};

type SearchParams = {
  q?: string;
  tag?: string;
  year?: string;
  sort?: string;
};

const fallbackImages = [
  '/bookCovers/i-1.png',
  '/bookCovers/i-1-1.png',
  '/bookCovers/i-1-2.png',
  '/bookCovers/i-1-3.png',
  '/bookCovers/i-2.png',
  '/bookCovers/i-2-1.png',
  '/bookCovers/i-2-2.png',
  '/bookCovers/i-2-3.png',
  '/trendingSection/t-6.png',
  '/latest-cover/b-4.png',
];

const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'featured', label: 'المميزة' },
  { value: 'year', label: 'السنة' },
  { value: 'title', label: 'العنوان' },
];

function SelectField({
  name,
  value,
  options,
  label,
}: {
  name: string;
  value: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="group relative block">
      <span className="pointer-events-none absolute right-3 top-2 text-[0.65rem] font-bold text-[#C29C41] transition duration-200 group-focus-within:text-[#0369A1]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-14 w-full cursor-pointer appearance-none rounded-md border border-[#D9E3EE] bg-white px-3 pb-2 pt-6 text-sm font-bold text-[#334155] shadow-sm outline-none transition duration-200 hover:border-[#C29C41]/55 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <HiOutlineChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B] transition duration-200 group-focus-within:text-[#0369A1]" />
    </label>
  );
}

function AiPromptPanel({ title, scope = 'هذه الصفحة' }: { title: string; scope?: string }) {
  const prompts = [
    `لخص أهم ما ورد في ${title}`,
    `ما الوثائق الأكثر ارتباطا بهذا الموضوع؟`,
    `اقترح كلمات بحث دقيقة داخل ${scope}`,
  ];

  return (
    <section className="mt-10 overflow-hidden border border-[#C29C41]/28 bg-[#071D2F] text-white shadow-[0_22px_70px_rgba(10,37,64,0.16)]">
      <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C29C41]/35 bg-[#C29C41]/12 text-[#E8C96A]">
            <HiOutlineChatBubbleLeftRight className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">اسأل المساعد الذكي عن هذه الصفحة</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/72">
            استخدم الأسئلة المقترحة لتضييق البحث أو استخراج ملخص سريع من {scope}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:max-w-xl md:justify-end">
          {prompts.map((prompt) => (
            <ChatbotPromptButton
              key={prompt}
              prompt={prompt}
              className="rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-bold text-white/82 transition duration-200 hover:-translate-y-0.5 hover:border-[#C29C41]/45 hover:bg-[#C29C41] hover:text-[#071D2F] active:translate-y-0"
            >
              {prompt}
            </ChatbotPromptButton>
          ))}
        </div>
      </div>
    </section>
  );
}


function fieldValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

function entryImage(entry: { coverImagePath: string | null; id: string }, index: number) {
  if (entry.coverImagePath) return entry.coverImagePath;

  const seed = entry.id.split('').reduce((total, char) => total + char.charCodeAt(0), index);
  return fallbackImages[seed % fallbackImages.length];
}

export default async function StandardizationInternalPage({
  config,
  searchParams,
}: {
  config: StandardizationPageConfig;
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const data = await getStandardizationPageData(config.slug, {
    q: filters.q,
    tag: filters.tag,
    year: filters.year,
    sort: filters.sort,
  });

  if (!data) {
    notFound();
  }

  const activeSort = filters.sort || 'newest';
  const hasFilters = Boolean(filters.q || filters.tag || filters.year || filters.sort);
  const featuredCount = data.entries.filter((entry) => entry.featured).length;
  const downloadableCount = data.entries.filter((entry) => entry.filePath).length;

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative border-b border-[#C29C41]/20 bg-[#071D2F] text-white">
        <div className="absolute inset-0 opacity-[0.72]" aria-hidden>
          <Image src={config.heroImage} alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.76),rgba(3,105,161,0.38)_56%,rgba(7,29,47,0.66))]" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-36 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:pb-20 lg:pt-40">
          <div className="max-w-4xl">
            <p className="font-display text-xs font-bold uppercase tracking-[0.26em] text-[#E8C96A]">
              {config.eyebrow}
            </p>
            <h1 className="mt-5 font-academic text-4xl font-bold leading-tight md:text-6xl">
              {config.title}
            </h1>
            <p className="mt-6 max-w-3xl font-academic text-lg leading-9 text-white/82 md:text-xl">
              {config.description}
            </p>
          </div>

          
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 rounded-lg border border-[#D9E3EE] bg-white p-4 shadow-[0_18px_55px_rgba(10,37,64,0.08)] lg:grid-cols-[1fr_auto] lg:items-end">
          <form className="grid gap-3 md:grid-cols-[1.25fr_190px_190px_180px_auto]">
            <label className="relative block">
              <span className="sr-only">بحث</span>
              <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C29C41]" />
              <input
                name="q"
                defaultValue={filters.q ?? ''}
                placeholder="ابحث في العنوان، المؤلف، الناشر، أو الوصف"
                className="h-14 w-full rounded-md border border-[#D9E3EE] bg-white pr-10 pl-3 text-sm font-semibold shadow-sm outline-none transition duration-200 placeholder:text-[#64748B] hover:border-[#C29C41]/55 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/15"
              />
            </label>

            <SelectField
              name="tag"
              value={filters.tag ?? ''}
              label="الوسم"
              options={[{ value: '', label: 'كل الوسوم' }, ...data.facets.tags.map((tag) => ({ value: tag, label: tag }))]}
            />

            <SelectField
              name="year"
              value={filters.year ?? ''}
              label="السنة"
              options={[{ value: '', label: 'كل السنوات' }, ...data.facets.years.map((year) => ({ value: year, label: year }))]}
            />

            <SelectField
              name="sort"
              value={activeSort}
              label="الترتيب"
              options={sortOptions}
            />

            <button type="submit" className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(3,105,161,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#003652] focus:outline-none focus:ring-2 focus:ring-[#C29C41] active:translate-y-0">
              <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
              تطبيق
            </button>
          </form>

          {hasFilters && (
            <Link href={config.resetHref ?? data.category.navHref ?? `/catalog/${data.category.slug}`} className="inline-flex h-14 items-center justify-center rounded-md border border-[#C29C41]/45 px-4 text-sm font-bold text-[#8A6A1D] transition duration-200 hover:bg-[#FFF8E1]">
              مسح الفلتر
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-[#D9E3EE] bg-white p-5">
            <p className="text-xs font-bold text-[#C29C41]">المدخلات</p>
            <p className="mt-2 text-3xl font-bold text-[#003652]">{data.entries.length}</p>
          </div>
          <div className="border border-[#D9E3EE] bg-white p-5">
            <p className="text-xs font-bold text-[#C29C41]">المميزة</p>
            <p className="mt-2 text-3xl font-bold text-[#003652]">{featuredCount}</p>
          </div>
          <div className="border border-[#D9E3EE] bg-white p-5">
            <p className="text-xs font-bold text-[#C29C41]">ملفات قابلة للاطلاع</p>
            <p className="mt-2 text-3xl font-bold text-[#003652]">{downloadableCount}</p>
          </div>
        </div>

        {data.entries.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {data.entries.map((entry, index) => {
              const meta = [
                { icon: HiOutlineDocumentText, label: entry.tag ?? entry.category.name },
                { icon: HiOutlineCalendarDays, label: fieldValue(entry.year) },
                { icon: HiOutlineLanguage, label: fieldValue(entry.language) },
                { icon: HiOutlineBookOpen, label: entry.pageCount ? `${entry.pageCount} صفحة` : null },
              ].filter((item): item is { icon: typeof HiOutlineDocumentText; label: string } => Boolean(item.label));

              return (
                <Link
                  key={entry.id}
                  href={`/book/${entry.slug}`}
                  className="group grid overflow-hidden border border-[#D9E3EE] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/65 hover:shadow-[0_26px_70px_rgba(10,37,64,0.13)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF3F8]">
                    <Image
                      src={entryImage(entry, index)}
                      alt={entry.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.055]"
                      unoptimized={Boolean(entry.coverImagePath)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071D2F]/64 via-transparent to-transparent" />
                    {entry.featured && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 bg-[#E8C96A] px-3 py-2 text-xs font-bold text-[#071D2F]">
                        <HiOutlineSparkles className="h-4 w-4" />
                        مميز
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold text-[#C29C41]">{categoryPath(entry.category)}</p>
                    <h2 className="mt-3 line-clamp-2 text-2xl font-bold leading-9 text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
                      {entry.title}
                    </h2>
                    {entry.description && (
                      <div className="mt-4 rounded-md border border-[#D9E3EE] bg-[#F8FAFC] p-3">
                        <p className="text-[0.7rem] font-bold text-[#C29C41]">وصف مختصر</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#64748B]">{entry.description}</p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {meta.map((item) => {
                        const Icon = item.icon;
                        return (
                          <span key={item.label} className="inline-flex items-center gap-1 border border-[#D9E3EE] bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-bold text-[#475569]">
                            <Icon className="h-4 w-4 text-[#0369A1]" />
                            {item.label}
                          </span>
                        );
                      })}
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0369A1]">
                      عرض التفاصيل
                      <HiOutlineArrowLeft className="h-4 w-4 transition duration-200 group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 grid overflow-hidden border border-[#D9E3EE] bg-white lg:grid-cols-[1fr_360px]">
            <div className="p-8">
              <p className="text-xs font-bold text-[#C29C41]">لا توجد نتائج منشورة</p>
              <h2 className="mt-3 text-3xl font-bold text-[#003652]">هذه الصفحة جاهزة لاستقبال مدخلات لوحة التحكم</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#64748B]">
                عند إضافة مدخل منشور ضمن هذا التصنيف ستظهر بطاقة تعرض الغلاف، العنوان، الوصف، الوسم، السنة، اللغة، عدد الصفحات، ورابط ملف PDF إن وجد.
              </p>
            </div>
            <div className="relative min-h-72 bg-[#EAF3F8]">
              <Image src={fallbackImages[0]} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D2F]/58 to-transparent" />
            </div>
          </div>
        )}

        <AiPromptPanel title={config.title} scope={config.assistantScope} />
      </section>
    </main>
  );
}

