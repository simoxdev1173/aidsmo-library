import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineBookmark, HiOutlineChatBubbleLeftRight, HiOutlineEye, HiOutlineRectangleGroup } from 'react-icons/hi2';
import { getPublishedEntryBySlug } from '@/lib/library-data';
import { categoryPath } from '@/lib/library-labels';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';
import { documentFilesValue } from '@/lib/document-files';

export const dynamic = 'force-dynamic';

type ContentSection = {
  title: string;
  body: string;
};

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
  const sections = getContentSections(entry.contentSections);
  const documentFiles = documentFilesValue(entry.documentFiles, entry.filePath);
  const primaryDocument = documentFiles[0] ?? null;
  const description = entry.description?.trim();
  const summary =
    description ||
    'هذا ملخص تمهيدي مؤقت لهذا المدخل، يوضح الفكرة العامة للمحتوى ويمنح القارئ لمحة سريعة قبل الاطلاع على الملف الكامل. سيتم استبدال هذا النص لاحقا بملخص محرر يعكس موضوع الإصدار ومنهجه وأهم محاوره.';
  const metadata = [
    ['الناشر', entry.publisher],
    ['المؤلف', entry.author],
    ['تصنيف', categoryPath(entry.category)],
    ['الوسم', entry.tag],
    ['سنة', entry.year?.toString()],
    ['اللغة', entry.language],
    ['عدد الصفحات', entry.pageCount?.toString()],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-32 text-[#0A2540]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-[#C29C41]/35 bg-white shadow-[0_22px_60px_rgba(10,37,64,0.10)]">
            <div className="relative aspect-[3/4] bg-[#F0F7FC]">
              {entry.coverImagePath ? (
                <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" priority unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-8 text-center text-2xl font-bold leading-relaxed text-[#0369A1]">
                  {entry.title}
                </div>
              )}
            </div>
          </div>
        </aside>

        <article>
          <Link href={`/catalog/${entry.category.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[#C29C41]/35 bg-white px-4 py-2 text-sm font-bold text-[#0369A1] transition duration-200 hover:text-[#C29C41]">
            <HiOutlineRectangleGroup className="h-5 w-5" />
            {entry.category.name}
          </Link>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-[#003652] md:text-5xl">
            {entry.title}
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            {primaryDocument ? (
              <a href={primaryDocument} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#0369A1] px-6 text-sm font-bold text-white transition duration-200 hover:bg-[#003652]">
                <HiOutlineEye className="h-5 w-5" />
                اطّلاع
              </a>
            ) : (
              <button type="button" disabled className="inline-flex h-12 items-center gap-2 rounded-md bg-[#94A3B8] px-6 text-sm font-bold text-white">
                <HiOutlineEye className="h-5 w-5" />
                اطّلاع
              </button>
            )}
            <button type="button" className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-md border border-[#C29C41]/60 bg-white px-6 text-sm font-bold text-[#003652] transition duration-200 hover:bg-[#F0F7FC]">
              <HiOutlineBookmark className="h-5 w-5 text-[#C29C41]" />
              حفظ
            </button>
          </div>

          {documentFiles.length > 1 && (
            <section className="mt-6 rounded-lg border border-[#D9E3EE] bg-white p-4">
              <h2 className="text-base font-bold text-[#003652]">ملفات PDF المرفقة</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {documentFiles.map((file, index) => (
                  <a
                    key={file}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-[#D9E3EE] bg-[#F8FAFC] px-3 py-2 text-sm font-bold text-[#0369A1] transition duration-200 hover:border-[#C29C41] hover:bg-[#FFF8E1]"
                  >
                    <span>{index === 0 ? 'الملف الأساسي' : `ملف PDF ${index + 1}`}</span>
                    <HiOutlineEye className="h-5 w-5 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {isBook && metadata.length > 0 && (
            <section className="mt-10 rounded-lg border border-[#D9E3EE] bg-white">
              <h2 className="border-b border-[#E2E8F0] px-5 py-4 text-lg font-bold text-[#003652]">معلومات إضافية</h2>
              <dl className="grid gap-px overflow-hidden rounded-b-lg bg-[#E2E8F0] sm:grid-cols-2">
                {metadata.map(([label, value]) => (
                  <div key={label} className="bg-white px-5 py-4">
                    <dt className="text-xs font-bold text-[#C29C41]">{label}</dt>
                    <dd className="mt-2 text-sm font-bold leading-6 text-[#334155]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="mt-10 overflow-hidden rounded-lg border border-[#D9E3EE] bg-white shadow-[0_18px_48px_rgba(10,37,64,0.07)]">
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <h2 className="text-xl font-bold text-[#003652]">ملخص قصير</h2>
            </div>
            <div className="relative p-6">
              <div className="absolute bottom-0 right-0 h-full w-1 bg-[#C29C41]" aria-hidden />
              <p className="max-w-4xl text-base leading-9 text-[#475569]">
                {summary}
              </p>
            </div>
          </section>

          {!isBook && sections.length > 0 && (
            <section className="mt-10 space-y-4">
              {sections.map((section, index) => (
                <div key={`${section.title}-${index}`} className="rounded-lg border border-[#D9E3EE] bg-white p-5">
                  {section.title && (
                    <h2 className="text-xl font-bold leading-8 text-[#003652]">{section.title}</h2>
                  )}
                  {section.body && (
                    <p className="mt-3 whitespace-pre-line text-base leading-8 text-[#475569]">{section.body}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          <section className="mt-10 overflow-hidden rounded-lg border border-[#C29C41]/30 bg-[#071D2F] text-white shadow-[0_22px_70px_rgba(10,37,64,0.16)]">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C29C41]/35 bg-[#C29C41]/12 text-[#E8C96A]">
                <HiOutlineChatBubbleLeftRight className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">اسأل المساعد عن هذا المدخل</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/72">
                افتح المساعد الذكي بسؤال جاهز لتلخيص المحتوى أو استخراج أهم المعلومات قبل الاطلاع على الملف.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  `لخص مدخل ${entry.title}`,
                  `ما أهم الكلمات المفتاحية في ${entry.title}؟`,
                  `اقترح أسئلة بحثية حول ${entry.title}`,
                ].map((prompt) => (
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
        </article>
      </section>
    </main>
  );
}
