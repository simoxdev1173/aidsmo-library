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
import styles from './TrendingShelves.module.css';

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
  trending: { title: 'Trending Titles', description: '' },
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

function LibraryCard({ item }: { item: TrendingItem }) {
  const t = useTranslations('trendingRow');
  const [failedCover, setFailedCover] = useState<string | null>(null);
  const [loadedCover, setLoadedCover] = useState<string | null>(null);
  const metadata = Array.from(new Set([item.meta.trim(), item.type.trim()].filter(Boolean)));
  const showCover = Boolean(item.cover && failedCover !== item.cover);
  const coverReady = loadedCover === item.cover;

  return (
    <Link href={item.href} className={styles.book}>
      <div className={styles.coverStage}>
        {showCover && <div className={`${styles.coverSkeleton} ${coverReady ? styles.coverSkeletonReady : ''}`} aria-hidden="true"><span /></div>}
        {showCover && item.cover ? (
          <div className={styles.cover}>
            <Image src={item.cover} alt="" fill sizes="(max-width: 640px) 180px, 220px"
              className={`${styles.coverImage} ${coverReady ? styles.coverReady : ''}`}
              unoptimized onLoad={() => setLoadedCover(item.cover)} onError={() => setFailedCover(item.cover)} />
          </div>
        ) : (
          <div className={styles.fallback} aria-hidden="true">
            <span>AIDSMO</span><FaBookOpen /><span>{item.title}</span>
          </div>
        )}
      </div>
      <div className={styles.bookBody}>
        <p className={styles.metadata}>{metadata.map((part, index) => (
          <span key={part}>{index > 0 && <span className={styles.dot} aria-hidden="true">·</span>}<bdi>{part}</bdi></span>
        ))}</p>
        <h4 className={styles.bookTitle}>{item.title}</h4>
        <span className={styles.openBook}>{t('openPublication')}<span aria-hidden="true">↗</span></span>
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
  const [position, setPosition] = useState({ first: 1, last: 1, prev: false, next: false });

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
    return () => { cancelled = true; };
  }, [locale, row.items]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const update = () => {
      const bounds = scroller.getBoundingClientRect();
      const cards = Array.from(scroller.children);
      const visible = cards.flatMap((card, index) => {
        const rect = card.getBoundingClientRect();
        const overlap = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left);
        return overlap >= rect.width * .5 ? [index + 1] : [];
      });
      const offset = Math.abs(scroller.scrollLeft);
      const next = {
        first: visible[0] ?? 1,
        last: visible.at(-1) ?? 1,
        prev: offset > 4,
        next: offset < scroller.scrollWidth - scroller.clientWidth - 4,
      };
      setPosition((current) => Object.keys(next).every((key) => current[key as keyof typeof current] === next[key as keyof typeof next]) ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(scroller);
    scroller.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      scroller.removeEventListener('scroll', schedule);
    };
  }, [locale, total]);

  const isRtl = locale === 'ar';
  const displayItems = isRtl ? row.items : row.items.map(translateItem);
  const displayTitle = isRtl ? row.title : ROW_LABELS_EN[row.id]?.title ?? row.title;
  const displayDescription = isRtl ? row.description : ROW_LABELS_EN[row.id]?.description ?? row.description;
  const move = (forward: boolean) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = (scroller.firstElementChild?.getBoundingClientRect().width ?? 240) + 24;
    const count = Math.max(1, Math.floor(scroller.clientWidth / step));
    scroller.scrollBy({
      left: step * count * (forward ? 1 : -1) * (isRtl ? -1 : 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  const PrevIcon = isRtl ? FaChevronRight : FaChevronLeft;
  const NextIcon = isRtl ? FaChevronLeft : FaChevronRight;

  return (
    <section id={`shelf-${row.id}`} aria-labelledby={`${row.id}-heading`} dir={isRtl ? 'rtl' : 'ltr'} className={styles.shelf}>
      <header className={styles.shelfHeader}>
        <div className={styles.shelfIntro}>
          <span className={styles.sectorIcon}><Icon aria-hidden="true" /></span>
          <div>
            <h3 id={`${row.id}-heading`} className={styles.shelfTitle}>{displayTitle}</h3>
            {displayDescription && <p className={styles.shelfDescription}>{displayDescription}</p>}
          </div>
        </div>
        <Link href={row.href} className={styles.viewAll} aria-label={`${t('viewMoreAria')}: ${displayTitle}`}>
          {t('viewMore')}<span aria-hidden="true">{isRtl ? '←' : '→'}</span>
        </Link>
      </header>
      <div ref={scrollerRef} id={`${row.id}-books`} className={styles.scroller}
        role="group" aria-label={displayTitle} tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(isRtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight');
          }
        }}>
        {displayItems.map((item) => <article className={styles.slide} key={item.id}><LibraryCard item={item} /></article>)}
      </div>
      <footer className={styles.shelfFooter}>
        <p className={styles.range} aria-live="polite" aria-atomic="true">
          {position.first} {t('rangeTo')} {position.last} {t('rangeOf')} {total}
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={() => move(false)} disabled={!position.prev} aria-controls={`${row.id}-books`}
            aria-label={`${t('prevAria')}: ${displayTitle}`}><PrevIcon aria-hidden="true" /></button>
          <button type="button" onClick={() => move(true)} disabled={!position.next} aria-controls={`${row.id}-books`}
            aria-label={`${t('nextAria')}: ${displayTitle}`}><NextIcon aria-hidden="true" /></button>
        </div>
      </footer>
    </section>
  );
}
