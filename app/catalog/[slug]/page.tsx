import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineArrowLeft, HiOutlineBookOpen } from 'react-icons/hi2';
import { getCategoryWithCards, getRatingSummaries } from '@/lib/library-data';
import RatingBadge from '@/components/book/RatingBadge';
import CategoryFollowButton from '@/components/CategoryFollowButton';
import { getUserSession } from '@/lib/user-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryWithCards(decodeURIComponent(slug));

  if (!data) {
    notFound();
  }
  const [ratings, user] = await Promise.all([
    getRatingSummaries(data.entries.map((entry) => entry.id)),
    getUserSession(),
  ]);
  const following = user ? Boolean(await prisma.categoryFollow.findUnique({
    where: { userId_categoryId: { userId: user.id, categoryId: data.category.id } },
    select: { categoryId: true },
  })) : false;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-32 text-[#082F50]">
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#D9E3EE] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#C29C41]">فهرس المكتبة</p>
            <h1 className="mt-3 text-4xl font-bold text-[#053D69]">{data.category.name}</h1>
            {data.category.description && (
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#475569]">{data.category.description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryFollowButton categoryId={data.category.id} initialFollowing={following} />
            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D9E3EE] bg-white px-4 text-sm font-bold text-[#475569]">
              <HiOutlineBookOpen className="h-5 w-5 text-[#C29C41]" />
              {data.entries.length} مدخل
            </div>
          </div>
        </div>

        {data.entries.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {data.entries.map((entry) => (
              <Link key={entry.id} href={`/book/${entry.slug}`} prefetch={false} className="group min-w-0 overflow-hidden rounded-lg border border-[#D9E3EE] bg-white transition duration-200 hover:border-[#C29C41]/60 hover:shadow-[0_16px_42px_rgba(8,47,80,0.10)]">
                <div className="flex flex-col gap-2 p-2 sm:grid sm:grid-cols-[120px_1fr] sm:gap-4 sm:p-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#E2E8F0] bg-[#EFF5F9]">
                    <RatingBadge rating={ratings.get(entry.id)} />
                    {entry.coverImagePath ? (
                      <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm font-bold leading-6 text-[#0B5688]">
                        {entry.year ?? 'AIDSMO'}
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-1 text-[0.65rem] font-bold text-[#C29C41] sm:text-xs">{entry.tag ?? entry.category.name}</p>
                    <h2 className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-[#053D69] transition duration-200 group-hover:text-[#0B5688] sm:mt-2 sm:text-lg sm:leading-7">
                      {entry.title}
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.65rem] font-bold text-[#0B5688] sm:mt-4 sm:gap-2 sm:pt-0 sm:text-sm">
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
