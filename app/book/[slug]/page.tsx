import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowLeft,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBookOpen,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineLanguage,
  HiOutlineSquares2X2,
  HiOutlineTag,
  HiOutlineUserCircle,
} from 'react-icons/hi2';
import type { IconType } from 'react-icons';
import { getPublishedEntryBySlug, getRelatedEntries } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import BookSummary from '@/components/book/BookSummary';
import styles from '@/components/book/BookReading.module.css';
import RelatedEntriesCarousel from '@/components/RelatedEntriesCarousel';
import BookActions from '@/components/book/BookActions';
import CommentsSection from '@/components/book/CommentsSection';
import DocumentAskAiPopup from '@/components/book/DocumentAskAiPopup';
import PdfPreview from '@/components/book/PdfPreview';
import { documentFilesValue } from '@/lib/document-files';
import { documentQuestionsValue, type DocumentChatContext } from '@/lib/document-chat';
import { getUserSession } from '@/lib/user-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type EntryCategory = {
  slug: string;
  name: string;
  parent?: { slug: string; name?: string; parent?: { slug: string; name?: string } | null } | null;
};

type ContentSection = {
  title: string;
  body: string;
};

const ENTRY_TYPE_LABEL: Record<string, string> = {
  BOOK: 'إصدار',
  PAGE: 'صفحة معرفية',
  EVENT: 'فعالية',
  OTHER: 'مدخل أرشيفي',
};

// "هذا" for masculine type nouns, "هذه" for feminine ones (صفحة، فعالية) — the
// composed summary below needs the right demonstrative pronoun per type.
const ENTRY_TYPE_DEMONSTRATIVE: Record<string, string> = {
  BOOK: 'هذا',
  PAGE: 'هذه',
  EVENT: 'هذه',
  OTHER: 'هذا',
};

// A second, closing sentence for the composed summary — about the entry
// type's role and AIDSMO's own mission, never about the document's specific
// content (which we have no real way to know without a curated description).
const ENTRY_TYPE_CLOSING: Record<string, string> = {
  BOOK: 'يهدف هذا الإصدار إلى تزويد الباحثين والمهتمين بمرجع موثوق يمكن الرجوع إليه عند دراسة هذا المجال، ويأتي ضمن الجهود المستمرة التي تبذلها المنظمة العربية للتنمية الصناعية والتقييس والتعدين لإتاحة محتواها العلمي والتقني رقميا لجميع الدول الأعضاء والمهتمين بالشأن الصناعي في الوطن العربي.',
  PAGE: 'تهدف هذه الصفحة إلى تقديم لمحة تعريفية مركزة يمكن الاستفادة منها كمدخل سريع للموضوع، ضمن مجموعة الصفحات المعرفية التي تتيحها المكتبة الرقمية للمنظمة تسهيلا للاطلاع والبحث على جميع المهتمين والباحثين.',
  EVENT: 'وتأتي هذه الفعالية ضمن الأنشطة التي تنظمها المنظمة العربية للتنمية الصناعية والتقييس والتعدين لتعزيز التعاون العربي المشترك، وتبادل الخبرات بين الجهات الوطنية المعنية بالشأن الصناعي والتقييس في الدول الأعضاء.',
  OTHER: 'يُحفظ هذا المدخل ضمن الأرشيف الرقمي للمنظمة، حفاظا على التوثيق التاريخي لأنشطتها ومساهماتها في مسيرة التنمية الصناعية والتقييس على المستوى العربي، وإتاحة لهذا التوثيق أمام الباحثين والمهتمين بتاريخ العمل الصناعي العربي المشترك.',
};

const CATEGORY_SPINE: Record<string, string> = {
  industry: '#0369A1',
  standardization: '#0C5B99',
  mining: '#003652',
  'industrial-info': '#8A6A1D',
};

// Same sector header images the listing pages use, so an entry inherits the
// backdrop of the sector it belongs to. Mining has no dedicated art yet, so it
// borrows the industry backdrop.
const SECTOR_HERO: Record<string, string> = {
  industry: '/industry-bg.png',
  standardization: '/standardization-bg.png',
  'industrial-info': '/industry-informations-bg.png',
  mining: '/industry-bg.png',
};
const DEFAULT_HERO = '/industry-bg.png';

function categoryTopSlug(category: EntryCategory) {
  return category.parent?.parent?.slug ?? category.parent?.slug ?? category.slug;
}

function getContentSections(value: unknown): ContentSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const section = item as { title?: unknown; body?: unknown };

      return {
        title: typeof section.title === 'string' ? section.title : '',
        body: typeof section.body === 'string' ? section.body : '',
      };
    })
    .filter((item): item is ContentSection => Boolean(item && (item.title || item.body)));
}

function formatEventDate(value: Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

// One field within the unified bibliographic record. Icons provide a second
// scanning cue alongside the labels without relying on color alone.
type EntryFact = {
  label: string;
  value: string;
  icon: IconType;
};

function FactCell({ label, value, icon: Icon, compact = false }: EntryFact & { compact?: boolean }) {
  return (
    <div className={`min-w-0 bg-[#fffdf8] ${compact ? 'px-4 py-4 sm:flex-1' : 'px-5 py-5 sm:px-6'}`}>
      <dt className="flex items-center gap-3 text-[0.7rem] font-bold text-[#64748B]">
        <span
          className={`flex shrink-0 items-center justify-center rounded-lg border border-[#C29C41]/25 bg-[#FFF8E8] text-[#9A7421] ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}
          aria-hidden
        >
          <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </span>
        <span>{label}</span>
      </dt>
      <dd
        className={`mt-1.5 break-words font-academic font-bold text-[#0A2540] ${compact ? 'ms-11 text-[0.95rem] leading-6' : 'ms-[3.25rem] text-[1.05rem] leading-7'}`}
      >
        {value}
      </dd>
    </div>
  );
}

// A section label with a short, quiet gold rule underneath — standing in for
// a card border, without the site's ornate-divider star glyph repeating down
// the page.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium text-[#0A2540]">{children}</h2>
      <div className="mt-3 h-[3px] w-14 rounded-full bg-[#C29C41]" />
    </div>
  );
}

// Consistent cover proportions, a cast shadow, and a subtle bound edge.
// Show a title plate when no cover scan is available.
function CoverArt({
  src,
  title,
  spine,
}: {
  src: string | null;
  title: string;
  spine: string;
}) {
  return (
    <div className={styles.coverArt}>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_28px_46px_-18px_rgba(10,37,64,0.55)]"
        style={{ background: `linear-gradient(160deg, #0A2540, ${spine})` }}
      >
        {src ? (
          <Image src={src} alt={title} fill sizes="(max-width: 767px) 240px, 320px" className="object-cover object-top" unoptimized priority />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-between px-5 py-7 text-center">
            <span className="font-display text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#E8C96A]">
              AIDSMO
            </span>
            <HiOutlineBookOpen className="h-10 w-10 text-white/25" />
            <span className="font-academic text-sm font-bold leading-6 text-white/90 line-clamp-3">
              {title}
            </span>
          </div>
        )}

        {/* bound edge: a soft inner shadow where the pages would gather */}
        <div
          className="pointer-events-none absolute inset-y-0 start-0 w-3 bg-gradient-to-l from-black/35 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}

// A real, per-entry synopsis composed from the entry's own metadata — never
// the same sentence twice — used only when no curated description exists.
// Applies to every entry type, not just books.
function composeSummary(params: {
  typeLabel: string;
  demonstrative: string;
  categoryLabel: string;
  publisher: string | null;
  author: string | null;
  year: string | null;
  pageCount: number | null;
  language: string;
  isEvent: boolean;
  eventDate: string | null;
  eventLocation: string | null;
  closingNote: string;
}): string {
  const {
    typeLabel,
    demonstrative,
    categoryLabel,
    publisher,
    author,
    year,
    pageCount,
    language,
    isEvent,
    eventDate,
    eventLocation,
    closingNote,
  } = params;

  // Verb agreement follows the type noun's gender (فعالية/صفحة = feminine).
  const isFeminine = demonstrative === 'هذه';
  const issuedBy = isFeminine ? 'صادرة عن' : 'صادر عن';
  const issuedIn = isFeminine ? 'صدرت عام' : 'صدر عام';

  const clauses: string[] = [
    publisher
      ? `${demonstrative} ${typeLabel} ${issuedBy} ${publisher}، ضمن قسم ${categoryLabel}`
      : `${demonstrative} ${typeLabel} من قسم ${categoryLabel}`,
  ];

  if (isEvent) {
    if (eventDate) clauses.push(`أقيمت بتاريخ ${eventDate}`);
    if (eventLocation) clauses.push(`في ${eventLocation}`);
  } else {
    if (year) clauses.push(`${issuedIn} ${year}`);
    if (pageCount) clauses.push(`ويقع في ${pageCount} صفحة`);
  }

  if (author && author !== publisher) clauses.push(`من إعداد ${author}`);
  if (language) clauses.push(`متاح باللغة ${language}`);

  return `${clauses.join('، ')}. ${closingNote}`;
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublishedEntryBySlug(decodeURIComponent(slug));

  if (!entry) {
    notFound();
  }

  const user = await getUserSession();
  const savedItem = user
    ? await prisma.userLibraryItem.findUnique({
        where: { userId_entryId: { userId: user.id, entryId: entry.id } },
        select: { id: true },
      })
    : null;

  const isBook = entry.entryType === 'BOOK';
  const isEvent = entry.entryType === 'EVENT';
  const sections = getContentSections(entry.contentSections);
  const documentFiles = documentFilesValue(entry.documentFiles, entry.filePath);
  const primaryDocument = documentFiles[0] ?? null;
  const primaryAnalysis = primaryDocument
    ? entry.documentAnalyses.find((analysis) => analysis.sourcePath === primaryDocument.path)
    : null;
  const storedQuestions = documentQuestionsValue(primaryAnalysis?.questions);
  const documentChatContext: DocumentChatContext | undefined = primaryDocument && storedQuestions.length > 0
    ? { title: entry.title, sourcePath: primaryDocument.path, questions: storedQuestions }
    : undefined;

  const topSlug = categoryTopSlug(entry.category);
  const spine = CATEGORY_SPINE[topSlug] ?? '#0369A1';
  const heroImage = SECTOR_HERO[topSlug] ?? DEFAULT_HERO;
  const typeLabel = ENTRY_TYPE_LABEL[entry.entryType] ?? 'مدخل';
  const demonstrative = ENTRY_TYPE_DEMONSTRATIVE[entry.entryType] ?? 'هذا';
  const categoryLabel = categoryPath(entry.category);
  const year = entry.year?.trim() || new Date(entry.createdAt).getFullYear().toString();
  const eventStart = formatEventDate(entry.eventStartDate);
  const eventEnd = formatEventDate(entry.eventEndDate);
  const eventDate = eventStart && eventEnd && eventStart !== eventEnd ? `${eventStart} — ${eventEnd}` : eventStart;

  const description = entry.description?.trim();
  const generatedSummary = primaryAnalysis?.summary?.trim();
  const summary =
    description ||
    generatedSummary ||
    composeSummary({
      typeLabel,
      demonstrative,
      categoryLabel,
      publisher: entry.publisher,
      author: entry.author,
      year: entry.year,
      pageCount: entry.pageCount,
      language: entry.language,
      isEvent,
      eventDate,
      eventLocation: entry.eventLocation,
      closingNote: ENTRY_TYPE_CLOSING[entry.entryType] ?? ENTRY_TYPE_CLOSING.OTHER,
    });

  // Metadata list — type-aware, so an event is never described as a book.
  const identityFacts = [
    { label: 'الناشر', value: entry.publisher, icon: HiOutlineBuildingOffice2 },
    { label: 'المؤلف', value: entry.author, icon: HiOutlineUserCircle },
  ].filter((item): item is EntryFact => Boolean(item.value));
  const classificationFact: EntryFact = {
    label: 'التصنيف',
    value: categoryLabel,
    icon: HiOutlineSquares2X2,
  };
  const compactFacts = [
    { label: 'الوسم', value: entry.tag, icon: HiOutlineTag },
    isEvent
      ? { label: 'التاريخ', value: eventDate, icon: HiOutlineCalendarDays }
      : { label: 'السنة', value: entry.year, icon: HiOutlineCalendarDays },
    isEvent ? { label: 'المكان', value: entry.eventLocation, icon: HiOutlineBuildingOffice2 } : null,
    { label: 'اللغة', value: entry.language, icon: HiOutlineLanguage },
    !isEvent && entry.pageCount
      ? { label: 'عدد الصفحات', value: `${entry.pageCount} صفحة`, icon: HiOutlineDocumentText }
      : null,
  ].filter((item): item is EntryFact => Boolean(item && item.value));

  const heroFacts = [year, entry.language, entry.pageCount ? `${entry.pageCount} صفحة` : null].filter(
    (item): item is string => Boolean(item),
  );

  const related = await getRelatedEntries(entry, 6);
  const parentHref = `/catalog/${entry.category.parent?.slug ?? entry.category.slug}`;
  const [commentRows, commentCount, viewCount, ratingAggregate, ownRating] = await Promise.all([
    prisma.documentComment.findMany({
      where: { entryId: entry.id },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 11,
      select: { id: true, body: true, createdAt: true, userId: true, user: { select: { name: true, email: true } } },
    }),
    prisma.documentComment.count({ where: { entryId: entry.id } }),
    prisma.documentView.count({ where: { entryId: entry.id } }),
    prisma.documentRating.aggregate({ where: { entryId: entry.id }, _avg: { value: true }, _count: { value: true } }),
    user ? prisma.documentRating.findUnique({ where: { entryId_userId: { entryId: entry.id, userId: user.id } }, select: { value: true } }) : Promise.resolve(null),
  ]);
  const visibleComments = commentRows.slice(0, 10);

  return (
    <main dir="rtl" className={styles.page}>
      {/* ─── Hero: the sector's own header backdrop, matching listing pages ─── */}
      <section className="relative overflow-hidden bg-[#071D2F] pt-28 text-white md:pt-32">
        <div className="absolute inset-0 opacity-[0.72]" aria-hidden>
          <Image src={heroImage} alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.82),rgba(3,105,161,0.4)_56%,rgba(7,29,47,0.9))]" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 md:pb-16">
          <nav className="flex items-center gap-2 text-sm font-bold text-white/60">
            <Link href={parentHref} className="transition hover:text-[#E8C96A]">
              {entry.category.parent?.name ?? 'الفهرس'}
            </Link>
            <span aria-hidden className="text-[#C29C41]">/</span>
            <Link href={`/catalog/${entry.category.slug}`} className="transition hover:text-[#E8C96A]">
              {entry.category.name}
            </Link>
          </nav>

          <div className={styles.heroLayout}>
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-[#C29C41]/18 px-3 py-1 text-xs font-bold text-[#E8C96A] ring-1 ring-[#C29C41]/30">
              {typeLabel}
            </span>
            <h1 className={styles.heroTitle}>
              {entry.title}
            </h1>

            {heroFacts.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-white/70">
                {heroFacts.map((fact, index) => (
                  <span key={fact} className="inline-flex items-center gap-3">
                    {index > 0 && <span aria-hidden className="text-white/30">·</span>}
                    {fact}
                  </span>
                ))}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {primaryDocument ? (
                <a
                  href="#document-preview"
                  className="engraved brass-gradient inline-flex h-12 items-center gap-2 rounded-full border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#071D2F]"
                >
                  <HiOutlineEye className="h-5 w-5" />
                  اقرأ الوثيقة
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-7 text-sm font-bold text-white/50"
                >
                  <HiOutlineEye className="h-5 w-5" />
                  الملف غير متاح حاليا
                </button>
              )}
              {primaryDocument && (
                <a
                  href={primaryDocument.path}
                  download
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white/90 backdrop-blur-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#E8C96A]"
                >
                  <HiOutlineArrowDownTray className="h-5 w-5 text-[#E8C96A]" />
                  تنزيل
                </a>
              )}
              <BookActions
                entryId={entry.id}
                slug={entry.slug}
                initialSaved={Boolean(savedItem)}
                isAuthenticated={Boolean(user)}
              />
            </div>
          </div>
          <div className={styles.heroCover}>
            <CoverArt src={entry.coverImagePath} title={entry.title} spine={spine} />
          </div>
          </div>
        </div>
      </section>

      <nav className={styles.pageNav} aria-label="أقسام صفحة الإصدار">
        <div className={styles.pageNavInner}>
          <a href="#book-summary">الملخص</a>
          <a href="#book-questions-heading">{documentChatContext ? 'أسئلة حول الوثيقة' : 'اسأل المساعد'}</a>
          <a href="#book-details">بيانات الإصدار</a>
          <a href="#document-preview">معاينة الوثيقة</a>
          <a href="#document-discussion">آراء القراء</a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={styles.readingLayout}>
        <div className="min-w-0">
        {summary && (
          <BookSummary text={summary} title={entry.title} source={description ? 'editorial' : generatedSummary ? 'generated' : 'metadata'} documentContext={documentChatContext} />
        )}

        {/* Entry facts — a grid instead of a boxed list, so they use the
            width the sidebar used to waste. */}
        <div id="book-details" className={styles.sectionAnchor}>
          <SectionHeading>بيانات الإصدار</SectionHeading>
          <div className="overflow-hidden rounded-2xl border border-[#C29C41]/25 bg-[#e8dfcb]">
            {identityFacts.length > 0 && (
              <dl className={`grid gap-px ${identityFacts.length > 1 ? 'sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''}`}>
                {identityFacts.map((fact) => (
                  <FactCell key={fact.label} {...fact} />
                ))}
              </dl>
            )}

            <dl className="mt-px">
              <FactCell {...classificationFact} />
            </dl>

            {compactFacts.length > 0 && (
              <dl className="mt-px grid grid-cols-2 gap-px sm:flex">
                {compactFacts.map((fact) => (
                  <FactCell key={fact.label} {...fact} compact />
                ))}
              </dl>
            )}
          </div>
        </div>

        {documentFiles.length > 1 && (
          <div className="mt-14">
            <SectionHeading>الوثائق المرفقة</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {documentFiles.map((file, index) => (
                <a
                  key={file.path}
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-between gap-3 border-t-2 border-[#C29C41]/25 pt-3 text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#8A6A1D]"
                >
                  <span>وثيقة {index + 1}</span>
                  <HiOutlineEye className="h-5 w-5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Document preview — skim the actual PDF without leaving the page */}
        <div id="document-preview" className={styles.sectionAnchor}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="academic-heading flex flex-wrap items-center gap-3 text-xl">
              <span>معاينة الوثيقة</span>
              {entry.pageCount ? (
                <span className="rounded-full border border-[#C29C41]/25 bg-[#FFF8E8] px-3 py-1 font-sans text-xs font-bold text-[#8A6A1D]">
                  {entry.pageCount} صفحة
                </span>
              ) : null}
            </h2>
            {primaryDocument && (
              <a
                href={primaryDocument.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#8A6A1D]"
              >
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                فتح كامل
              </a>
            )}
          </div>

          {primaryDocument ? (
            <div className="relative">
              <PdfPreview src={primaryDocument.path} title={entry.title} />
              <DocumentAskAiPopup title={entry.title} documentContext={documentChatContext} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#D9E3EE] px-6 py-16 text-center">
              <HiOutlineEye className="h-8 w-8 text-[#CBD5E1]" />
              <p className="text-sm font-bold text-[#64748B]">لا تتوفر وثيقة للمعاينة حاليا</p>
            </div>
          )}
        </div>

        {!isBook && sections.length > 0 && (
          <div className="mt-14 flex flex-col gap-12">
            {sections.map((section, index) => (
              <article key={`${section.title}-${index}`}>
                {section.title && <SectionHeading>{section.title}</SectionHeading>}
                {section.body && (
                  <p className="max-w-[70ch] whitespace-pre-line font-academic text-[1.02rem] leading-[2] text-[#334155]">
                    {section.body}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <Link
          href={`/catalog/${entry.category.slug}`}
          className="group mt-14 flex items-center justify-between gap-4 border-t border-[#E3EAF3] pt-6 transition duration-200"
        >
          <div>
            <p className="text-xs font-bold text-[#C29C41]">استكشاف</p>
            <p className="mt-1 text-base font-bold text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
              تصفّح المزيد ضمن {entry.category.name}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F8FB] text-[#0369A1] transition duration-200 group-hover:bg-[#0369A1] group-hover:text-white">
            <HiOutlineArrowLeft className="h-5 w-5" />
          </span>
        </Link>

        </div>
        <aside className={styles.coverSidebar} aria-label="غلاف الإصدار">
          <div className={styles.stickyCover}>
            <CoverArt src={entry.coverImagePath} title={entry.title} spine={spine} />
            <p className={styles.sidebarTitle}>{entry.title}</p>
            {primaryDocument && <a href="#document-preview" className={styles.sidebarRead}>اقرأ الوثيقة<HiOutlineBookOpen aria-hidden="true" /></a>}
          </div>
        </aside>
        </div>

        <CommentsSection
          entryId={entry.id}
          slug={entry.slug}
          currentUser={user ? { id: user.id, name: user.name } : null}
          initialComments={visibleComments.map((comment) => ({
            id: comment.id,
            name: comment.user.name?.trim() || comment.user.email?.split('@')[0] || 'قارئ',
            body: comment.body,
            createdAt: comment.createdAt.toISOString(),
            mine: comment.userId === user?.id,
          }))}
          initialNextCursor={commentRows.length > 10 ? visibleComments.at(-1)?.id ?? null : null}
          initialCommentCount={commentCount}
          initialViewCount={viewCount}
          initialRatingCount={ratingAggregate._count.value}
          initialAverageRating={ratingAggregate._avg.value ?? 0}
          initialUserRating={ownRating?.value ?? null}
        />

        {related.length > 0 && (
          <div className="mt-12">
            <RelatedEntriesCarousel
              viewAllHref={parentHref}
              entries={related.map((item) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                coverImagePath: item.coverImagePath,
                categoryLabel: categoryPath(item.category),
              }))}
            />
          </div>
        )}
      </section>
    </main>
  );
}
