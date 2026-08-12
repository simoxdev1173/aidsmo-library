import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowLeft,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBookOpen,
  HiOutlineEye,
} from 'react-icons/hi2';
import { getPublishedEntryBySlug, getRelatedEntries } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import RelatedEntriesCarousel from '@/components/RelatedEntriesCarousel';
import BookActions from '@/components/book/BookActions';
import CommentsSection from '@/components/book/CommentsSection';
import DocumentAskAiPopup from '@/components/book/DocumentAskAiPopup';
import { documentFilesValue } from '@/lib/document-files';
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

// One metadata cell in the facts grid: a quiet label over the value, marked
// by a short gold rule instead of a card border — the same accent language
// as the ornate divider, just quieter. Rows breathe in the grid instead of
// being boxed individually.
function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t-2 border-[#C29C41]/25 pt-3">
      <dt className="text-xs font-bold text-[#94A3B8]">{label}</dt>
      <dd className="mt-1.5 text-[0.95rem] font-bold leading-6 text-[#0A2540]">{value}</dd>
    </div>
  );
}

// A section label with a short, quiet gold rule underneath — standing in for
// a card border, without the site's ornate-divider star glyph repeating down
// the page.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="academic-heading text-xl">{children}</h2>
      <div className="mt-3 h-[3px] w-14 rounded-full bg-[#C29C41]" />
    </div>
  );
}

// The cover as a physical object resting on the page: gold corner brackets
// in place of a card border, a tinted cast shadow, and a bound-edge sliver
// where the pages would gather. Falls back to a quiet manuscript plate
// (never a card either) when no scan has been generated yet.
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
    <div className="corner-frame w-44 sm:w-52">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_28px_46px_-18px_rgba(10,37,64,0.55)]"
        style={{ background: `linear-gradient(160deg, #0A2540, ${spine})` }}
      >
        {src ? (
          <Image src={src} alt={title} fill className="object-cover" unoptimized />
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
  const summary =
    description ||
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
  const facts = [
    { label: 'الناشر', value: entry.publisher },
    { label: 'المؤلف', value: entry.author },
    { label: 'التصنيف', value: categoryLabel },
    { label: 'الوسم', value: entry.tag },
    isEvent ? { label: 'التاريخ', value: eventDate } : { label: 'السنة', value: entry.year },
    isEvent ? { label: 'المكان', value: entry.eventLocation } : null,
    { label: 'اللغة', value: entry.language },
    !isEvent && entry.pageCount ? { label: 'عدد الصفحات', value: `${entry.pageCount} صفحة` } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item && item.value));

  const heroFacts = [year, entry.language, entry.pageCount ? `${entry.pageCount} صفحة` : null].filter(
    (item): item is string => Boolean(item),
  );

  const related = await getRelatedEntries(entry, 6);
  const parentHref = `/catalog/${entry.category.parent?.slug ?? entry.category.slug}`;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#0A2540]">
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

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-[#C29C41]/18 px-3 py-1 text-xs font-bold text-[#E8C96A] ring-1 ring-[#C29C41]/30">
              {typeLabel}
            </span>
            <h1 className="mt-4 font-academic text-3xl font-bold leading-[1.25] md:text-[2.75rem]">
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
                  href={primaryDocument.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="engraved brass-gradient inline-flex h-12 items-center gap-2 rounded-full border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#071D2F]"
                >
                  <HiOutlineEye className="h-5 w-5" />
                  اطّلاع على الملف
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
        </div>
      </section>

      {/* ─── Body ─── */}
      {/* Single flowing column — no sidebar. The entry's own facts read
          better with the full page width to breathe in than boxed into a
          narrow rail, and it keeps the reading order linear: cover with the
          summary, then what the entry is, then the document itself. */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {summary && (
          <article className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <div className="mx-auto shrink-0 sm:mx-0">
              <CoverArt src={entry.coverImagePath} title={entry.title} spine={spine} />
            </div>
            <div className="min-w-0 flex-1">
              <SectionHeading>ملخص</SectionHeading>
              <p className="dropcap max-w-[70ch] font-academic text-[1.1rem] leading-[2.15] text-[#334155]">{summary}</p>
            </div>
          </article>
        )}

        {/* Entry facts — a grid instead of a boxed list, so they use the
            width the sidebar used to waste. */}
        <div className={summary ? 'mt-14' : ''}>
          <SectionHeading>بيانات المدخل</SectionHeading>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
            {facts.map((fact) => (
              <FactCell key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>
        </div>

        {documentFiles.length > 1 && (
          <div className="mt-14">
            <SectionHeading>ملفات PDF المرفقة</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {documentFiles.map((file, index) => (
                <a
                  key={file.path}
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-between gap-3 border-t-2 border-[#C29C41]/25 pt-3 text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#8A6A1D]"
                >
                  <span className="truncate">{file.title || (index === 0 ? 'الملف الأساسي' : `ملف PDF ${index + 1}`)}</span>
                  <HiOutlineEye className="h-5 w-5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Document preview — skim the actual PDF without leaving the page */}
        <div className="mt-14">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="academic-heading text-xl">
              معاينة الوثيقة
              {entry.pageCount ? (
                <span className="ms-3 align-middle text-xs font-bold text-[#94A3B8]">
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
              <iframe
                src={`${primaryDocument.path}#toolbar=0&view=FitH&navpanes=0`}
                title={`معاينة: ${entry.title}`}
                loading="lazy"
                className="h-[420px] w-full rounded-lg border border-[#D9E3EE] bg-[#F4F8FB] sm:h-[600px]"
              />
              <DocumentAskAiPopup title={entry.title} />
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

        <CommentsSection />

        <AiAssistantPanel
          title={entry.title}
          prompts={[
            `لخص مدخل ${entry.title}`,
            `ما أهم الكلمات المفتاحية في ${entry.title}؟`,
            `اقترح أسئلة بحثية حول ${entry.title}`,
          ]}
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
