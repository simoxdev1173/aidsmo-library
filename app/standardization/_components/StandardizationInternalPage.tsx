import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowLeft,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { getStandardizationPageData } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import FilterSelect from '@/components/library/FilterSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

// The publication's cover IS the card — no surrounding box. It carries its
// own rounded corners and shadow like a physical book resting on the page,
// and lifts with a light sweep on hover.
function CardCover({
  src,
  alt,
  category,
  featured,
  optimize,
}: {
  src: string;
  alt: string;
  category: string;
  featured: boolean;
  optimize: boolean;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#EAF3F8] shadow-[0_14px_34px_rgba(10,37,64,0.16)] ring-1 ring-black/5 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_52px_rgba(10,37,64,0.24)] group-hover:ring-[#C29C41]/40">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        unoptimized={optimize}
      />
      {/* light sweep on hover */}
      <div className="pointer-events-none absolute -inset-y-10 -left-24 z-20 w-16 rotate-12 bg-white/25 blur-md transition duration-[900ms] ease-out group-hover:translate-x-[145%] motion-reduce:hidden" aria-hidden />
      {/* base scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#071D2F]/92 via-[#071D2F]/28 to-transparent" aria-hidden />

      <span className="absolute inset-x-3 bottom-2.5 z-20 block max-w-[calc(100%-1.5rem)] truncate text-[0.68rem] font-bold text-white/90 drop-shadow-[0_1px_6px_rgba(7,29,47,0.9)]">
        {category}
      </span>

      {featured && (
        <span className="absolute end-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-[#E8C96A] px-2.5 py-1 text-[0.68rem] font-bold text-[#071D2F] shadow-[0_6px_16px_rgba(232,201,106,0.4)]">
          <HiOutlineSparkles className="h-3.5 w-3.5" />
          مميز
        </span>
      )}
    </div>
  );
}

function assistantPrompts(title: string, scope = 'هذه الصفحة') {
  return [
    `لخص أهم ما ورد في ${title}`,
    `ما الوثائق الأكثر ارتباطا بهذا الموضوع؟`,
    `اقترح كلمات بحث دقيقة داخل ${scope}`,
  ];
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

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative border-b border-[#C29C41]/20 bg-[#071D2F] text-white">
        <div className="absolute inset-0 opacity-[0.72]" aria-hidden>
          <Image src={config.heroImage} alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.76),rgba(3,105,161,0.38)_56%,rgba(7,29,47,0.66))]" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
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
        <div className="rounded-[20px] border border-[#E3EAF3] bg-white p-5 shadow-[0_18px_55px_rgba(10,37,64,0.07)]">
          <form className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div className="space-y-1.5">
              <label htmlFor="library-search" className="block ps-1 text-[0.68rem] font-bold text-[#8A6A1D]">
                بحث
              </label>
              <div className="relative">
                <HiOutlineMagnifyingGlass className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C29C41]" />
                <Input
                  id="library-search"
                  name="q"
                  defaultValue={filters.q ?? ''}
                  placeholder="ابحث في العنوان، المؤلف، الناشر، أو الوصف"
                  className="pe-11"
                />
              </div>
            </div>

            <FilterSelect
              name="year"
              label="السنة"
              defaultValue={filters.year ?? ''}
              options={[
                { value: '', label: 'كل السنوات' },
                ...data.facets.years.map((year) => ({ value: year, label: year })),
              ]}
            />

            <FilterSelect
              name="sort"
              label="الترتيب"
              defaultValue={activeSort}
              options={sortOptions}
            />

            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
              <Button type="submit" size="lg" className="h-13 flex-1 lg:flex-none">
                <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
                تطبيق
              </Button>

              {hasFilters && (
                <Button asChild variant="outline" size="lg" className="h-13">
                  <Link
                    href={
                      config.resetHref ??
                      data.category.navHref ??
                      `/catalog/${data.category.slug}`
                    }
                  >
                    مسح
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </div>

        {data.entries.length > 0 ? (
          <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.entries.map((entry, index) => {
              const metaLine = [fieldValue(entry.year), entry.pageCount ? `${entry.pageCount} صفحة` : null].filter(
                (part): part is string => Boolean(part),
              );

              return (
                <Link
                  key={entry.id}
                  href={`/book/${entry.slug}`}
                  className="group flex flex-col focus-visible:outline-none"
                >
                  <CardCover
                    src={entryImage(entry, index)}
                    alt={entry.title}
                    category={categoryPath(entry.category)}
                    featured={entry.featured}
                    optimize={Boolean(entry.coverImagePath)}
                  />

                  <div className="flex flex-1 flex-col pt-4">
                    <h2 className="line-clamp-2 min-h-[3rem] text-[0.95rem] font-bold leading-[1.6] text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
                      {entry.title}
                    </h2>

                    {metaLine.length > 0 && (
                      <p className="mt-1.5 text-[0.72rem] font-semibold text-[#8B98A8]">
                        {metaLine.join(' · ')}
                      </p>
                    )}

                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C29C41] bg-gradient-to-b from-[#f1dda0] to-[#C29C41] px-4 py-2 text-[0.72rem] font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_16px_rgba(194,156,65,0.24)] transition-all duration-300 group-hover:gap-2.5 group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-[#0369A1] group-focus-visible:ring-offset-2">
                        عرض المحتوى
                        <HiOutlineArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 grid overflow-hidden rounded-[18px] border border-[#D9E3EE] bg-white lg:grid-cols-[1fr_360px]">
            <div className="p-8">
              <p className="text-xs font-bold text-[#C29C41]">لا توجد نتائج منشورة</p>
              <h2 className="mt-3 text-3xl font-bold text-[#003652]">هذه الصفحة جاهزة لاستقبال مدخلات لوحة التحكم</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#64748B]">
                عند إضافة مدخل منشور ضمن هذا التصنيف ستظهر بطاقة تعرض الغلاف، العنوان، الوصف، الوسم، السنة، عدد الصفحات، ورابط ملف PDF إن وجد.
              </p>
            </div>
            <div className="relative min-h-72 bg-[#EAF3F8]">
              <Image src={fallbackImages[0]} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D2F]/58 to-transparent" />
            </div>
          </div>
        )}

        <AiAssistantPanel title={config.title} prompts={assistantPrompts(config.title, config.assistantScope)} />
      </section>
    </main>
  );
}
