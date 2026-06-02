import Image from 'next/image';
import Link from 'next/link';
import {
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { getDashboardStats } from '@/lib/library-data';
import { categoryPath, statusLabel } from '@/lib/library-labels';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    { label: 'كل المداخل', value: stats.entries, icon: HiOutlineBookOpen },
    { label: 'منشورة', value: stats.publishedEntries, icon: HiOutlineCheckCircle },
    { label: 'مسودات', value: stats.draftEntries, icon: HiOutlineClock },
    { label: 'مؤرشفة', value: stats.archivedEntries, icon: HiOutlineDocumentText },
    { label: 'ملفات PDF', value: stats.documentEntries, icon: HiOutlineDocumentText },
    { label: 'أغلفة', value: stats.coverEntries, icon: HiOutlineBookOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#C29C41]">لوحة التحكم</p>
          <h1 className="mt-2 text-3xl font-bold text-[#003652]">نظرة عامة</h1>
        </div>
        <Link href="/dashboard/entries/new" className="inline-flex h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#003652]">
          مدخل جديد
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="rounded-lg border border-[#D9E3EE] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#64748B]">{card.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#003652]">{card.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F0F7FC] text-[#0369A1]">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-[#D9E3EE] bg-white">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-lg font-bold text-[#003652]">آخر التحديثات</h2>
          <Link href="/dashboard/entries" className="text-sm font-bold text-[#0369A1] hover:text-[#C29C41]">
            عرض الكل
          </Link>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {stats.recentEntries.length > 0 ? (
            stats.recentEntries.map((entry) => (
              <Link key={entry.id} href={`/dashboard/entries/${entry.id}`} className="grid gap-3 px-5 py-4 transition duration-200 hover:bg-[#F8FAFC] md:grid-cols-[1fr_180px_120px]">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F0F7FC]">
                    {entry.coverImagePath ? (
                      <Image src={entry.coverImagePath} alt={entry.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#0369A1]">PDF</div>
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-2 font-bold text-[#0A2540]">{entry.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">{categoryPath(entry.category)}</p>
                  </div>
                </div>
                <p className="text-sm text-[#64748B]">{entry.author ?? 'بدون مؤلف'}</p>
                <p className="text-sm font-bold text-[#0369A1]">{statusLabel(entry.status)}</p>
              </Link>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-sm font-semibold text-[#64748B]">لا توجد مداخل بعد.</p>
          )}
        </div>
      </section>
    </div>
  );
}
