import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineLanguage,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { getStandardizationPageData } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';

type StandardizationPageConfig = {
  slug: string;
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
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F6F8FA] pt-28 text-[#0A2540]">
      <section className="relative border-b border-[#C29C41]/20 bg-[#071D2F] text-white">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <Image src={config.heroImage} alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.96),rgba(3,105,161,0.72)_54%,rgba(7,29,47,0.90))]" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-20">
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
        <div className="grid gap-5 border border-[#D9E3EE] bg-white p-4 shadow-[0_18px_55px_rgba(10,37,64,0.08)] lg:grid-cols-[1fr_auto] lg:items-end">
          <form className="grid gap-3 md:grid-cols-[1.25fr_180px_180px_170px_auto]">
            <label className="relative block">
              <span className="sr-only">بحث</span>
              <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C29C41]" />
              <input
                name="q"
                defaultValue={filters.q ?? ''}
                placeholder="ابحث في العنوان، المؤلف، الناشر، أو الوصف"
                className="h-12 w-full border border-[#D9E3EE] bg-[#F8FAFC] pr-10 pl-3 text-sm font-semibold outline-none transition duration-200 placeholder:text-[#64748B] focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/15"
              />
            </label>

            <select name="tag" defaultValue={filters.tag ?? ''} className="h-12 border border-[#D9E3EE] bg-[#F8FAFC] px-3 text-sm font-bold text-[#334155] outline-none focus:border-[#0369A1]">
              <option value="">كل الوسوم</option>
              {data.facets.tags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <select name="year" defaultValue={filters.year ?? ''} className="h-12 border border-[#D9E3EE] bg-[#F8FAFC] px-3 text-sm font-bold text-[#334155] outline-none focus:border-[#0369A1]">
              <option value="">كل السنوات</option>
              {data.facets.years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select name="sort" defaultValue={activeSort} className="h-12 border border-[#D9E3EE] bg-[#F8FAFC] px-3 text-sm font-bold text-[#334155] outline-none focus:border-[#0369A1]">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button type="submit" className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 bg-[#0369A1] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#003652] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
              <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
              تطبيق
            </button>
          </form>

          {hasFilters && (
            <Link href={data.category.navHref ?? `/catalog/${data.category.slug}`} className="inline-flex h-12 items-center justify-center border border-[#C29C41]/45 px-4 text-sm font-bold text-[#8A6A1D] transition duration-200 hover:bg-[#FFF8E1]">
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
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#64748B]">{entry.description}</p>
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
      </section>
    </main>
  );
}

