import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowDownTray, HiOutlineArrowTopRightOnSquare, HiOutlineEye } from 'react-icons/hi2';
import { documentFilesValue } from '@/lib/document-files';

const HERO_IMAGE = '/services-bg.png';

/**
 * One hero backdrop for the whole training & consulting section, the same
 * way each other sector (industry, standardization) has its own single
 * background reused across all of its sub-pages.
 */
export function TrainingHero({
  breadcrumb,
  badge,
  title,
  subtitle,
}: {
  breadcrumb: { label: string; href: string }[];
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#071D2F] pt-28 text-white md:pt-32">
      <div className="absolute inset-0 opacity-[0.5]" aria-hidden>
        <Image src={HERO_IMAGE} alt="" fill priority className="object-cover" />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.9),rgba(3,105,161,0.42)_56%,rgba(7,29,47,0.94))]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 md:pb-16">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/60">
          {breadcrumb.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-[#C29C41]">
                  /
                </span>
              )}
              <Link href={item.href} className="transition hover:text-[#E8C96A]">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-8 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-[#C29C41]/18 px-3 py-1 text-xs font-bold text-[#E8C96A] ring-1 ring-[#C29C41]/30">
            {badge}
          </span>
          <h1 className="mt-4 font-academic text-3xl font-bold leading-[1.25] md:text-[2.75rem]">{title}</h1>
          {subtitle && <p className="mt-4 text-sm font-bold text-white/70">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

/** A plain section label — no underline rule, weight alone carries it. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="academic-heading text-2xl md:text-3xl">{children}</h2>
    </div>
  );
}

type PlanEntry = {
  id: string;
  slug: string;
  title: string;
  coverImagePath: string | null;
  filePath: string | null;
  documentFiles: unknown;
  year: string | null;
};

/** True for the single entry that is the year's own plan document, as
 * opposed to one specific course within it — used to give it an honest,
 * distinct description rather than reusing the generic course line. */
function isPlanDocument(title: string) {
  return title.includes('الخطة التدريبية');
}

function planEntrySummary(entry: PlanEntry) {
  if (isPlanDocument(entry.title)) {
    return `الوثيقة الرسمية للخطة التدريبية الكاملة للمعهد العربي للتدريب والاستشارات الصناعية والتعدينية${entry.year ? ` لعام ${entry.year}` : ''}.`;
  }

  return `دورة تدريبية ضمن الخطة التدريبية للمعهد العربي للتدريب والاستشارات الصناعية والتعدينية${entry.year ? ` لعام ${entry.year}` : ''}.`;
}

/**
 * Each plan entry gets the same weight a book page gives its own document:
 * a real cover, a short factual line (these entries carry no curated
 * description), and the PDF itself previewed at size rather than a small
 * thumbnail card. `loading="lazy"` keeps this from loading every embed at
 * once on years with 30+ entries.
 */
export function PlanEntryRow({ entry }: { entry: PlanEntry }) {
  const documentFiles = documentFilesValue(entry.documentFiles, entry.filePath);
  const primaryDocument = documentFiles[0] ?? null;
  // The plan document itself is an overview, not a course with its own
  // identity — it reads better as full-width text and preview, no thumbnail.
  const showCover = !isPlanDocument(entry.title);

  return (
    <article className="border-t border-[#E3EAF3] pt-10 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {showCover && (
          <div className="mx-auto w-36 shrink-0 sm:mx-0 sm:w-44">
            <div className="corner-frame">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_24px_40px_-16px_rgba(10,37,64,0.5)]">
                {entry.coverImagePath ? (
                  <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A2540] to-[#0C5B99] p-4 text-center">
                    <span className="font-academic text-xs font-bold leading-5 text-white/90 line-clamp-4">
                      {entry.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Link href={`/book/${entry.slug}`} className="group inline-block">
            <h2 className="text-lg font-bold text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
              {entry.title}
            </h2>
          </Link>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{planEntrySummary(entry)}</p>

          {primaryDocument && (
            <div className="relative mt-5">
              <iframe
                src={`${primaryDocument.path}#toolbar=0&view=FitH&navpanes=0`}
                title={`معاينة: ${entry.title}`}
                loading="lazy"
                className="h-[360px] w-full rounded-lg border border-[#D9E3EE] bg-[#F4F8FB] sm:h-[440px]"
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {primaryDocument && (
              <>
                <a
                  href={primaryDocument.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D9E3EE] bg-white px-5 text-sm font-bold text-[#0369A1] transition duration-200 hover:border-[#C29C41]/60 hover:text-[#8A6A1D]"
                >
                  <HiOutlineEye className="h-4 w-4" />
                  فتح كامل
                </a>
                <a
                  href={primaryDocument.path}
                  download
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D9E3EE] bg-white px-5 text-sm font-bold text-[#0369A1] transition duration-200 hover:border-[#C29C41]/60 hover:text-[#8A6A1D]"
                >
                  <HiOutlineArrowDownTray className="h-4 w-4" />
                  تنزيل
                </a>
              </>
            )}
            <Link
              href={`/book/${entry.slug}`}
              className="inline-flex h-10 items-center gap-1.5 text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#8A6A1D]"
            >
              صفحة الدورة الكاملة
              <HiOutlineArrowTopRightOnSquare className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
