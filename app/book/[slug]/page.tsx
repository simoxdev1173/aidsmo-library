import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineBookmark, HiOutlineEye, HiOutlineRectangleGroup } from 'react-icons/hi2';
import { getPublishedEntryBySlug } from '@/lib/library-data';

export const dynamic = 'force-dynamic';

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

  const metadata = [
    ['الناشر', entry.publisher],
    ['المؤلف', entry.author],
    ['تصنيف', entry.category.parent ? `${entry.category.parent.name} / ${entry.category.name}` : entry.category.name],
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
                <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" priority />
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

          <p className="mt-6 max-w-4xl text-lg leading-9 text-[#475569]">
            {entry.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {entry.filePath ? (
              <a href={entry.filePath} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#0369A1] px-6 text-sm font-bold text-white transition duration-200 hover:bg-[#003652]">
                <HiOutlineEye className="h-5 w-5" />
                اطِّلاع
              </a>
            ) : (
              <button type="button" disabled className="inline-flex h-12 items-center gap-2 rounded-md bg-[#94A3B8] px-6 text-sm font-bold text-white">
                <HiOutlineEye className="h-5 w-5" />
                اطِّلاع
              </button>
            )}
            <button type="button" className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-md border border-[#C29C41]/60 bg-white px-6 text-sm font-bold text-[#003652] transition duration-200 hover:bg-[#F0F7FC]">
              <HiOutlineBookmark className="h-5 w-5 text-[#C29C41]" />
              حفظ
            </button>
          </div>

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
        </article>
      </section>
    </main>
  );
}
