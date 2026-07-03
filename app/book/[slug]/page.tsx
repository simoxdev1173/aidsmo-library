import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBookmark,
  HiOutlineBookOpen,
  HiOutlineBuildingLibrary,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineLanguage,
  HiOutlineMapPin,
  HiOutlineRectangleGroup,
  HiOutlineTag,
  HiOutlineUser,
} from 'react-icons/hi2';
import { getPublishedEntryBySlug, getRelatedEntries } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import RelatedEntriesCarousel from '@/components/RelatedEntriesCarousel';
import { documentFilesValue } from '@/lib/document-files';

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

// One metadata cell: an icon chip, a quiet label, and the value. No rules, no
// leaders — the grid does the aligning.
function FactCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HiOutlineUser;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F4F8FB] p-4 transition duration-200 hover:bg-[#EAF3F8]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0369A1] shadow-[0_2px_8px_rgba(10,37,64,0.08)]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-bold text-[#94A3B8]">{label}</dt>
        <dd className="mt-1 text-sm font-bold leading-6 text-[#0A2540]">{value}</dd>
      </div>
    </div>
  );
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

  const isBook = entry.entryType === 'BOOK';
  const isEvent = entry.entryType === 'EVENT';
  const sections = getContentSections(entry.contentSections);
  const documentFiles = documentFilesValue(entry.documentFiles, entry.filePath);
  const primaryDocument = documentFiles[0] ?? null;
  const description = entry.description?.trim();
  const summary =
    description ||
    (isBook
      ? 'هذا ملخص تمهيدي مؤقت لهذا المدخل، يوضح الفكرة العامة للمحتوى ويمنح القارئ لمحة سريعة قبل الاطلاع على الملف الكامل. سيتم استبدال هذا النص لاحقا بملخص محرر يعكس موضوع الإصدار ومنهجه وأهم محاوره.'
      : null);

  const topSlug = categoryTopSlug(entry.category);
  const spine = CATEGORY_SPINE[topSlug] ?? '#0369A1';
  const heroImage = SECTOR_HERO[topSlug] ?? DEFAULT_HERO;
  const typeLabel = ENTRY_TYPE_LABEL[entry.entryType] ?? 'مدخل';
  const year = entry.year?.trim() || new Date(entry.createdAt).getFullYear().toString();
  const eventStart = formatEventDate(entry.eventStartDate);
  const eventEnd = formatEventDate(entry.eventEndDate);
  const eventDate = eventStart && eventEnd && eventStart !== eventEnd ? `${eventStart} — ${eventEnd}` : eventStart;

  // Metadata grid — type-aware, so an event is never described as a book.
  const facts = [
    { icon: HiOutlineBuildingLibrary, label: 'الناشر', value: entry.publisher },
    { icon: HiOutlineUser, label: 'المؤلف', value: entry.author },
    { icon: HiOutlineRectangleGroup, label: 'التصنيف', value: categoryPath(entry.category) },
    { icon: HiOutlineTag, label: 'الوسم', value: entry.tag },
    isEvent
      ? { icon: HiOutlineCalendarDays, label: 'التاريخ', value: eventDate }
      : { icon: HiOutlineCalendarDays, label: 'السنة', value: entry.year },
    isEvent ? { icon: HiOutlineMapPin, label: 'المكان', value: entry.eventLocation } : null,
    { icon: HiOutlineLanguage, label: 'اللغة', value: entry.language },
    !isEvent && entry.pageCount ? { icon: HiOutlineBookOpen, label: 'عدد الصفحات', value: `${entry.pageCount} صفحة` } : null,
  ].filter((item): item is { icon: typeof HiOutlineUser; label: string; value: string } =>
    Boolean(item && item.value),
  );

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

          <div className="mt-8 grid gap-8 md:grid-cols-[210px_1fr] md:items-end">
            {/* Sharp cover, floating over its own blurred backdrop */}
            <div className="mx-auto w-40 sm:w-48 md:mx-0 md:w-full md:max-w-[210px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#0A2540] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
                {entry.coverImagePath ? (
                  <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" priority unoptimized />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 text-center"
                    style={{ background: `linear-gradient(160deg, #0A2540, ${spine})` }}
                  >
                    <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#E8C96A]">
                      AIDSMO
                    </span>
                    <span className="font-academic text-sm font-bold leading-6 text-white/90 line-clamp-4">
                      {entry.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title block */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[#C29C41]/18 px-3 py-1 text-xs font-bold text-[#E8C96A] ring-1 ring-[#C29C41]/30">
                {typeLabel}
              </span>
              <h1 className="mt-4 max-w-3xl font-academic text-3xl font-bold leading-[1.25] md:text-[2.75rem]">
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
                <button
                  type="button"
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white/90 backdrop-blur-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#E8C96A]"
                >
                  <HiOutlineBookmark className="h-5 w-5 text-[#E8C96A]" />
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Body ─── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Main column: summary + document preview + sections + browse */}
          <div className="flex flex-col gap-8">
            {summary && (
              <article className="rounded-[20px] border border-[#D9E3EE] bg-white p-6 shadow-[0_16px_44px_rgba(10,37,64,0.06)] md:p-8">
                <h2 className="text-lg font-bold text-[#003652]">ملخص</h2>
                <p className="mt-4 font-academic text-[1.08rem] leading-[2.15] text-[#334155]">{summary}</p>
              </article>
            )}

            {/* Document preview — skim the actual PDF without leaving the page */}
            <article className="overflow-hidden rounded-[20px] border border-[#D9E3EE] bg-white shadow-[0_16px_44px_rgba(10,37,64,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF3F8] p-5 md:px-6">
                <div className="flex items-center gap-2">
                  <HiOutlineDocumentText className="h-5 w-5 text-[#0369A1]" />
                  <h2 className="text-lg font-bold text-[#003652]">معاينة الوثيقة</h2>
                  {entry.pageCount ? (
                    <span className="rounded-full bg-[#F4F8FB] px-3 py-1 text-xs font-bold text-[#64748B]">
                      {entry.pageCount} صفحة
                    </span>
                  ) : null}
                </div>
                {primaryDocument && (
                  <a
                    href={primaryDocument.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D9E3EE] bg-white px-4 py-2 text-sm font-bold text-[#0369A1] transition duration-200 hover:border-[#C29C41]/60 hover:text-[#8A6A1D]"
                  >
                    <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                    فتح كامل
                  </a>
                )}
              </div>

              {primaryDocument ? (
                <div className="bg-[#F4F8FB] p-3 md:p-4">
                  <iframe
                    src={`${primaryDocument.path}#toolbar=0&view=FitH&navpanes=0`}
                    title={`معاينة: ${entry.title}`}
                    loading="lazy"
                    className="h-[380px] w-full rounded-lg border border-[#E2E8F0] bg-white sm:h-[560px]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F8FB] text-[#94A3B8]">
                    <HiOutlineEye className="h-7 w-7" />
                  </span>
                  <p className="text-sm font-bold text-[#64748B]">لا تتوفر وثيقة للمعاينة حاليا</p>
                </div>
              )}
            </article>

            {!isBook && sections.length > 0 && (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <article
                    key={`${section.title}-${index}`}
                    className="rounded-[20px] border border-[#D9E3EE] bg-white p-6 shadow-[0_16px_44px_rgba(10,37,64,0.06)] md:p-8"
                  >
                    {section.title && <h2 className="text-lg font-bold text-[#003652]">{section.title}</h2>}
                    {section.body && (
                      <p className="mt-4 whitespace-pre-line font-academic text-[1.02rem] leading-[2] text-[#334155]">
                        {section.body}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}

            <Link
              href={`/catalog/${entry.category.slug}`}
              className="group flex items-center justify-between gap-4 rounded-[20px] border border-[#D9E3EE] bg-white p-6 shadow-[0_16px_44px_rgba(10,37,64,0.06)] transition duration-200 hover:border-[#C29C41]/60 hover:shadow-[0_22px_54px_rgba(10,37,64,0.12)]"
            >
              <div>
                <p className="text-xs font-bold text-[#C29C41]">استكشاف</p>
                <p className="mt-1 text-base font-bold text-[#003652]">تصفّح المزيد ضمن {entry.category.name}</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F8FB] text-[#0369A1] transition duration-200 group-hover:bg-[#0369A1] group-hover:text-white">
                <HiOutlineArrowLeft className="h-5 w-5" />
              </span>
            </Link>
          </div>

          {/* Aside: metadata + files, natural height, sticky beside the tall
              preview column */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="rounded-[20px] border border-[#D9E3EE] bg-white p-6 shadow-[0_16px_44px_rgba(10,37,64,0.06)]">
              <h2 className="text-lg font-bold text-[#003652]">بيانات المدخل</h2>
              <dl className="mt-4 flex flex-col gap-3">
                {facts.map((fact) => (
                  <FactCell key={fact.label} icon={fact.icon} label={fact.label} value={fact.value} />
                ))}
              </dl>
            </div>

            {documentFiles.length > 1 && (
              <div className="rounded-[20px] border border-[#D9E3EE] bg-white p-6 shadow-[0_16px_44px_rgba(10,37,64,0.06)]">
                <h2 className="text-lg font-bold text-[#003652]">ملفات PDF المرفقة</h2>
                <div className="mt-4 space-y-2">
                  {documentFiles.map((file, index) => (
                    <a
                      key={file.path}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#F4F8FB] px-4 py-3 text-sm font-bold text-[#0369A1] transition duration-200 hover:bg-[#EAF3F8]"
                    >
                      <span className="truncate">{file.title || (index === 0 ? 'الملف الأساسي' : `ملف PDF ${index + 1}`)}</span>
                      <HiOutlineEye className="h-5 w-5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

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
