import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineExclamationTriangle, HiOutlinePencilSquare, HiOutlinePlus } from 'react-icons/hi2';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ExecutiveBoardAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const members = await prisma.executiveBoardMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <Link href="/dashboard/archive" className="inline-flex min-h-10 items-center text-sm font-bold text-[#0B5688] hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">العودة إلى إدارة الأرشيف</Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#C29C41]">إدارة المحتوى المؤسسي</p>
          <h1 className="mt-2 text-3xl font-bold text-[#053D69]">أعضاء المجلس التنفيذي</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64748B]">عدّل معلومات الأعضاء والروابط والصور وترتيب العرض. التغييرات تظهر في دليل المجلس بالموقع.</p>
        </div>
        <Link href="/dashboard/executive-board/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0B5688] px-5 text-sm font-bold text-white transition hover:bg-[#053D69] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
          <HiOutlinePlus className="h-5 w-5" /> إضافة عضو
        </Link>
      </div>

      {params.saved === 'created' && <Notice tone="success" title="تمت إضافة ملف العضو." />}
      {params.error && <Notice tone="error" title="تعذر العثور على الملف المطلوب." />}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">إجمالي الملفات</p>
          <p className="mt-2 text-3xl font-bold text-[#053D69]">{members.length}</p>
        </div>
        <div className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">الملفات الظاهرة</p>
          <p className="mt-2 text-3xl font-bold text-[#0B5688]">{members.filter((member) => member.isActive).length}</p>
        </div>
        <div className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">تحتاج مراجعة مصدر</p>
          <p className="mt-2 text-3xl font-bold text-[#A27E30]">{members.filter((member) => member.sourceNote).length}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#D9E3EE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="font-bold text-[#053D69]">سجلات الأعضاء</h2>
          <span className="text-xs font-semibold text-[#64748B]">مرتبة حسب ترتيب الظهور</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right">
            <thead className="bg-[#F8FAFC] text-xs font-bold text-[#64748B]">
              <tr>
                <th className="px-4 py-3">العضو والجهة</th>
                <th className="px-4 py-3">الدولة</th>
                <th className="px-4 py-3">ترتيب الظهور</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">المصدر</th>
                <th className="px-4 py-3">آخر تحديث</th>
                <th className="px-4 py-3"><span className="sr-only">تعديل</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {members.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-[#F8FAFC]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-[#E2E8F0] bg-[#EFF5F9]">
                        {member.imageUrl && <Image src={member.imageUrl} alt={member.country} fill unoptimized sizes="64px" className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold text-[#082F50]">{member.name}</p>
                        <p className="mt-1 max-w-sm truncate text-xs text-[#64748B]">{member.ministry}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#475569]">{member.country}</td>
                  <td className="px-4 py-4 text-sm text-[#475569]">{member.sortOrder}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {member.isActive ? 'ظاهر للزوار' : 'مخفي'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {member.sourceNote ? <span title={member.sourceNote} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><HiOutlineExclamationTriangle className="h-4 w-4" /> يحتاج مراجعة</span> : <span className="text-xs text-[#64748B]">موثق</span>}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#64748B]">{member.updatedAt.toLocaleDateString('ar-MA')}</td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/executive-board/${member.id}`} aria-label={`تعديل ${member.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#D9E3EE] text-[#0B5688] transition-colors hover:border-[#C29C41] hover:text-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                      <HiOutlinePencilSquare className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {members.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-[#64748B]">لا توجد ملفات أعضاء بعد. أضف ملفاً جديداً أو شغّل تهيئة البيانات الأولية.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
