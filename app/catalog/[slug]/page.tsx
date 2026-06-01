import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineArrowLeft, HiOutlineBookOpen } from 'react-icons/hi2';
import { getCategoryWithEntries } from '@/lib/library-data';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryWithEntries(decodeURIComponent(slug));

  if (!data) {
    notFound();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-32 text-[#0A2540]">
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#D9E3EE] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#C29C41]">فهرس المكتبة</p>
            <h1 className="mt-3 text-4xl font-bold text-[#003652]">{data.category.name}</h1>
            {data.category.description && (
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#475569]">{data.category.description}</p>
            )}
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#D9E3EE] bg-white px-4 py-3 text-sm font-bold text-[#475569]">
            <HiOutlineBookOpen className="h-5 w-5 text-[#C29C41]" />
            {data.entries.length} مدخل
          </div>
        </div>

        {data.entries.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.entries.map((entry) => (
              <Link key={entry.id} href={`/book/${entry.slug}`} className="group overflow-hidden rounded-lg border border-[#D9E3EE] bg-white transition duration-200 hover:border-[#C29C41]/60 hover:shadow-[0_16px_42px_rgba(10,37,64,0.10)]">
                <div className="grid grid-cols-[120px_1fr] gap-4 p-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F0F7FC]">
                    {entry.coverImagePath ? (
                      <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm font-bold leading-6 text-[#0369A1]">
                        {entry.year ?? 'AIDSMO'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#C29C41]">{entry.category.name}</p>
                    <h2 className="mt-2 line-clamp-3 text-lg font-bold leading-7 text-[#003652] transition duration-200 group-hover:text-[#0369A1]">
                      {entry.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#64748B]">{entry.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0369A1]">
                      عرض التفاصيل
                      <HiOutlineArrowLeft className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#D9E3EE] bg-white px-6 py-12 text-center text-sm font-semibold text-[#64748B]">
            لا توجد مداخل منشورة في هذا التصنيف.
          </div>
        )}
      </section>
    </main>
  );
}
