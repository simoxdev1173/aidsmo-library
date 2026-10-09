import Image from 'next/image';
import Link from 'next/link';
import { HiOutlinePencilSquare, HiOutlinePlus } from 'react-icons/hi2';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function GeneralAssemblyAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const params = await searchParams;
  const members = await prisma.generalAssemblyMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return <div className="space-y-6">
    <Link href="/dashboard/archive" className="inline-flex min-h-10 items-center text-sm font-bold text-[#0B5688] hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">العودة إلى إدارة الأرشيف</Link>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>
      <p className="text-sm font-bold text-[#C29C41]">إدارة المحتوى المؤسسي</p><h1 className="mt-2 text-3xl font-bold text-[#053D69]">أعضاء الجمعية العامة</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64748B]">عدّل أسماء الوزراء وصفاتهم وبيانات الاتصال والصور الشخصية وروابط الملفات. التغييرات تظهر في صفحة الجمعية العامة.</p>
    </div><Link href="/dashboard/general-assembly/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0B5688] px-5 text-sm font-bold text-white"><HiOutlinePlus className="h-5 w-5"/>إضافة عضو</Link></div>
    {params.saved && <Notice tone="success" title="تم حفظ الملف."/>}{params.error && <Notice tone="error" title="تعذر العثور على الملف المطلوب."/>}
    <div className="grid gap-4 sm:grid-cols-3"><Stat label="إجمالي الملفات" value={members.length}/><Stat label="الملفات الظاهرة" value={members.filter((m)=>m.isActive).length}/><Stat label="تحتاج مراجعة المصدر" value={members.filter((m)=>m.sourceNote).length}/></div>
    <section className="overflow-hidden rounded-xl border border-[#D9E3EE] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-right"><thead className="bg-[#F8FAFC] text-xs font-bold text-[#64748B]"><tr><th className="px-4 py-3">العضو والجهة</th><th className="px-4 py-3">الدولة</th><th className="px-4 py-3">الترتيب</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">المصدر</th><th className="px-4 py-3">تعديل</th></tr></thead><tbody className="divide-y divide-[#E2E8F0]">{members.map((m)=><tr key={m.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative h-16 w-12 overflow-hidden rounded border">{m.imageUrl&&<Image src={m.imageUrl} alt={m.country} fill unoptimized className="object-cover object-top"/>}</div><div><p className="font-bold">{m.name}</p><p className="text-xs text-slate-500">{m.ministry}</p></div></div></td><td className="px-4 py-3 text-sm">{m.country}</td><td className="px-4 py-3">{m.sortOrder}</td><td className="px-4 py-3 text-sm">{m.isActive?'ظاهر':'مخفي'}</td><td className="px-4 py-3 text-sm">{m.sourceNote?'يحتاج مراجعة':'موثق'}</td><td className="px-4 py-3"><Link href={`/dashboard/general-assembly/${m.id}`} aria-label={`تعديل ${m.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border"><HiOutlinePencilSquare/></Link></td></tr>)}</tbody></table></div></section>
  </div>;
}
function Stat({label,value}:{label:string;value:number}) { return <div className="rounded-xl border border-[#D9E3EE] bg-white p-5 shadow-sm"><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-3xl font-bold text-[#053D69]">{value}</p></div>; }
