'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaBalanceScale,
  FaBookOpen,
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaGem,
  FaIndustry,
} from 'react-icons/fa';
import type { TrendingItem, TrendingRow } from '@/lib/library-data';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

const ROW_ICONS: Record<string, IconType> = {
  trending: FaBookOpen,
  industry: FaIndustry,
  standardization: FaBalanceScale,
  mining: FaGem,
  'industrial-info': FaChartPie,
};

// These row headers are static copy defined in lib/library-data.ts, so they're
// translated once here instead of round-tripping through the live translate API.
const ROW_LABELS_EN: Record<string, { title: string; description: string }> = {
  trending: { title: 'Trending Titles', description: "Fresh picks from across the digital library's sectors." },
  industry: { title: 'Industry', description: 'Reports and references on development, value chains, and industrial competitiveness.' },
  standardization: { title: 'Standardization & Quality', description: 'Guides, terminology, and references to help understand standards and quality.' },
  mining: { title: 'Mining', description: 'Geological references and studies on mineral resources and sustainability.' },
  'industrial-info': { title: 'Industrial Information', description: 'Statistics, bulletins, and visuals supporting research and decision-making.' },
};

// Mirrors ENTRY_TYPE_LABEL in lib/library-data.ts — also static/enumerable.
const ENTRY_TYPE_EN: Record<string, string> = {
  'كتاب': 'Book',
  'صفحة': 'Page',
  'وثيقة': 'Document',
  'فعالية': 'Event',
};

// item.meta is almost always a category name (a small, known taxonomy), not
// free text — curated translations read better than raw machine translation
// for these short, easily-ambiguous labels (e.g. "أدلة" alone means both
// "Guides" and "Evidence"; in this taxonomy it's always "Guides").
const CATEGORY_NAME_EN: Record<string, string> = {
  'الصناعات الصغيرة والمتوسطة': 'Small & Medium Industries',
  'توجيهات': 'Directives',
  'إستراتيجيات': 'Strategies',
  'تقرير الصناعة العربية': 'Arab Industry Report',
  'كتيب المؤشرات الاقتصادية و الصناعية في الدول العربية': 'Economic & Industrial Indicators Booklet',
  'المعلومات الصناعية': 'Industrial Information',
  'نشرة الإحصاءات الصناعية': 'Industrial Statistics Bulletin',
  'الأرشيف': 'Archive',
  'حول المعهد': 'About the Institute',
  'أدلة': 'Guides',
  'التدريب والاستشارات': 'Training & Consulting',
  'جيولوجيا': 'Geology',
  'الصناعة التعدينية': 'Mining Industry',
  'الإحصاءات الصناعية': 'Industrial Statistics',
  'التقييس': 'Standardization',
  'الانفوجرافيك': 'Infographics',
  'مؤتمرات وندوات': 'Conferences & Seminars',
  'مجلة التنمية الصناعية': 'Industrial Development Magazine',
  'النشرة الدورية': 'Periodic Newsletter',
  'الإصدارات': 'Publications',
  'الخطة التدريبية': 'Training Plan',
  'تأسيس المنظمة': 'Founding of the Organization',
  'اتفاقيات الانشاء': 'Founding Agreements',
  'المكتبة الرقمية للدراسات التعدينية العربية': 'Arab Mining Studies Digital Library',
  'التعدين': 'Mining',
  'النظام الداخلي': 'Bylaws',
  'اللوائح الداخلية والأنظمة': 'Internal Regulations & Statutes',
  'مذكرات التفاهم واتفاقيات': 'Memoranda of Understanding & Agreements',
  'المجلس التنفيذي': 'Executive Board',
  'الجمعية العامة': 'General Assembly',
  'جامعة الدول العربية': 'League of Arab States',
  'ورش ودورات تدريبية': 'Workshops & Training Courses',
  'فعاليات وأنشطة': 'Events & Activities',
  'الدراسات والأدلة': 'Studies & Guides',
  'دراسات': 'Studies',
  'معاجم': 'Glossaries',
  'دورات تدريبية': 'Training Courses',
  'ورش عمل': 'Workshops',
  'لجنة تنسيق مراكز البحوث الصناعية': 'Industrial Research Centers Coordination Committee',
  'إجتماعات': 'Meetings',
  'القمة العربية': 'Arab Summit',
  'الصناعة': 'Industry',
  'الدراسات': 'Studies',
  'الأدلة': 'Guides',
  'ندوات': 'Seminars',
  'المنظمة العربية للتنمية الصناعية والتقييس والتعدين': 'Arab Industrial Development, Standardization and Mining Organization',
  'النظام الأساسي و الداخلي للمحكمة الإدارية': 'Administrative Court Statute & Bylaws',
  'قرارات مجلس الجامعة على المستوى الوزاري': 'Ministerial-Level Council Resolutions',
  'مجلس الجامعة على مستوى القمة': 'League Council at Summit Level',
  'القمة العربية الاقتصادية والاجتماعية': 'Arab Economic & Social Summit',
  'المجلس الاقتصادي والاجتماعي': 'Economic & Social Council',
  'لجنة المنظمات والتنسيق': 'Organizations & Coordination Committee',
  'لجنة التنسيق العليا للعمل العربي المشترك': 'Higher Coordination Committee for Joint Arab Action',
  'اللوائح والأنظمة': 'Regulations & Statutes',
  'النظام الداخلي لمجلس الجامعة الدول العربية': 'Bylaws of the Council of the League of Arab States',
  'ميثاق جامعة الدول العربية و ملحقاته': 'Charter of the League of Arab States and its Annexes',
  'اللجنة الاستشارية للتنمية الصناعية': 'Industrial Development Advisory Committee',
};

const YEAR_LIKE = /^\d/;

// Shared across every row instance so identical titles/tags (which repeat a
// lot across sectors) are only ever translated once per page session.
const translationCache = new Map<string, string>();

async function fetchTranslations(texts: string[]): Promise<void> {
  const uncached = Array.from(new Set(texts.filter((text) => !translationCache.has(text))));
  if (uncached.length === 0) return;

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncached, target: 'en' }),
    });
    const data = await res.json();
    uncached.forEach((text, i) => translationCache.set(text, data.translations?.[i] ?? text));
  } catch {
    uncached.forEach((text) => translationCache.set(text, text));
  }
}

function translateItem(item: TrendingItem): TrendingItem {
  const title = translationCache.get(item.title) ?? item.title;
  const meta =
    CATEGORY_NAME_EN[item.meta] ??
    ENTRY_TYPE_EN[item.meta] ??
    (YEAR_LIKE.test(item.meta) ? item.meta : translationCache.get(item.meta) ?? item.meta);
  const type = ENTRY_TYPE_EN[item.type] ?? item.type;
  return { ...item, title, meta, type };
}

function scrollByAmount(container: HTMLDivElement, amount: number) {
  container.scrollBy({ left: amount, behavior: 'smooth' });
}

function LibraryCard({ item, index }: { item: TrendingItem; index: number }) {
  const { locale } = useAppLocale();
  return (
    <Link
      href={item.href}
      className={`group block w-48 shrink-0 text-[#0A2540] outline-none [perspective:1100px] sm:w-56 lg:w-60 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative mx-auto h-72 w-44 [transform-style:preserve-3d] transition duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [animation:research-card-rise_700ms_cubic-bezier(0.19,1,0.22,1)_both] group-hover:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] group-focus-visible:[transform:rotateY(-10deg)_rotateX(5deg)_translateY(-12px)] motion-reduce:transform-none motion-reduce:transition-none sm:h-80 sm:w-52 lg:h-[22rem] lg:w-56">
        <div className="absolute inset-0 translate-x-3 translate-y-4 bg-[#0A2540]/18 blur-xl transition duration-700 group-hover:translate-y-7 group-hover:bg-[#0A2540]/28" aria-hidden />
        <div className="absolute inset-y-3 right-[-10px] w-5 bg-gradient-to-l from-[#5A4217] via-[#C29C41] to-[#F7E5A9] shadow-[inset_3px_0_6px_rgba(10,37,64,0.22)] [transform:rotateY(72deg)] [transform-origin:left]" aria-hidden />
        <div className="absolute inset-0 overflow-hidden border border-[#C29C41]/35 bg-[#0A2540] shadow-[0_18px_34px_rgba(10,37,64,0.18)] [transform:translateZ(18px)]">
          {item.cover ? (
            <Image
              src={item.cover}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 224px, (min-width: 640px) 208px, 176px"
              className="relative z-10 object-cover transition duration-700 group-hover:scale-[1.055]"
              unoptimized
            />
          ) : (
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#0A2540] to-[#12335A] px-4 text-center">
              <span className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#C29C41]">AIDSMO</span>
              <span className="line-clamp-4 text-sm font-bold leading-6 text-[#F7E5A9]">{item.title}</span>
              <span className="text-xs font-semibold text-white/55">{item.type}</span>
            </div>
          )}
          <div className="absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-black/28 via-white/8 to-transparent" aria-hidden />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A2540]/18 via-transparent to-white/10" aria-hidden />
          <div className="absolute -inset-y-8 -left-16 z-30 w-12 rotate-12 bg-white/42 blur-md transition duration-700 group-hover:translate-x-64" aria-hidden />
        </div>
      </div>

      <div className="mt-5 px-1">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-base font-bold leading-7 text-[#003652] transition duration-300 group-hover:text-[#9A7421] group-focus-visible:text-[#9A7421] sm:text-[1.05rem]">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748B]">
          {item.meta} · {item.type}
        </p>
      </div>
    </Link>
  );
}

export default function LibraryCarouselRow({ row }: { row: TrendingRow }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('trendingRow');
  const { locale } = useAppLocale();
  const Icon = ROW_ICONS[row.iconKey] ?? FaBookOpen;
  const total = row.items.length;
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (locale !== 'en') return;
    const texts = row.items.flatMap((item) => {
      const metaNeedsApi = !CATEGORY_NAME_EN[item.meta] && !ENTRY_TYPE_EN[item.meta] && !YEAR_LIKE.test(item.meta);
      return metaNeedsApi ? [item.title, item.meta] : [item.title];
    });
    let cancelled = false;
    fetchTranslations(texts).then(() => {
      if (!cancelled) forceRerender((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, row.items]);

  const isRtl = locale === 'ar';
  const displayItems = locale === 'en' ? row.items.map(translateItem) : row.items;
  const displayTitle = locale === 'en' ? ROW_LABELS_EN[row.id]?.title ?? row.title : row.title;
  const displayDescription = locale === 'en' ? ROW_LABELS_EN[row.id]?.description ?? row.description : row.description;

  const onPrev = () => scrollerRef.current && scrollByAmount(scrollerRef.current, isRtl ? 660 : -660);
  const onNext = () => scrollerRef.current && scrollByAmount(scrollerRef.current, isRtl ? -660 : 660);
  const PrevIcon = isRtl ? FaChevronRight : FaChevronLeft;
  const NextIcon = isRtl ? FaChevronLeft : FaChevronRight;

  return (
    <section
      id={`shelf-${row.id}`}
      aria-labelledby={`${row.id}-heading`}
      aria-roledescription="carousel"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative border-t border-[#C29C41]/25 py-10 first:border-t-0 md:py-12"
    >
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#C29C41]/40 bg-[#0A2540] text-[#F7E5A9] shadow-[0_12px_26px_rgba(10,37,64,0.18)]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 id={`${row.id}-heading`} className="text-2xl font-bold leading-tight text-[#003652] md:text-3xl">
              {displayTitle}
            </h3>
            <p className="mt-2 max-w-2xl font-academic text-base leading-relaxed text-[#64748B]">{displayDescription}</p>
            <p className="sr-only">{`1 ${t('rangeTo')} ${Math.min(total, 6)} ${t('rangeOf')} ${total}`}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label={`${t('prevAria')}: ${displayTitle}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <PrevIcon className="h-4 w-4" />
          </button>
          <Link
            href={row.href}
            aria-label={`${t('viewMoreAria')}: ${displayTitle}`}
            className="rounded-full border border-[#C29C41]/35 bg-[#FFF8E1] px-4 py-2 text-sm font-bold text-[#7A5C10] shadow-sm transition duration-200 hover:border-[#C29C41]/70 hover:bg-[#F7E5A9] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            {t('viewMore')}
          </Link>
          <button
            type="button"
            onClick={onNext}
            aria-label={`${t('nextAria')}: ${displayTitle}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/30 bg-white/72 text-[#0369A1] shadow-sm backdrop-blur transition duration-200 hover:border-[#C29C41]/65 hover:bg-[#FFF8E1] hover:text-[#9A7421] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <NextIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F7F0E1] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F7F0E1] to-transparent" aria-hidden />
        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto overflow-y-visible px-2 pb-7 pt-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayItems.map((item, itemIndex) => (
            <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
              <LibraryCard item={item} index={itemIndex} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
