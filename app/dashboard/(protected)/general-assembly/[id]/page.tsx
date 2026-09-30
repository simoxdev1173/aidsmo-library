import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import ExecutiveBoardMemberForm from '@/app/dashboard/_components/ExecutiveBoardMemberForm';
import { prisma } from '@/lib/prisma';
import { updateGeneralAssemblyMember } from '@/lib/general-assembly-actions';

export const dynamic = 'force-dynamic';
export default async function EditGeneralAssemblyMemberPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const member = await prisma.generalAssemblyMember.findUnique({ where: { id } });
  if (!member) notFound();
  return <div className="space-y-6"><div><Link href="/dashboard/general-assembly" className="text-sm font-bold text-[#0369A1]">العودة إلى الجمعية العامة</Link><p className="mt-4 text-sm font-bold text-[#C29C41]">الجمعية العامة</p><h1 className="mt-1 text-3xl font-bold text-[#003652]">تعديل بيانات العضو</h1></div>{query.saved&&<Notice tone="success" title="تم حفظ التغييرات."/>}{query.error&&<Notice tone="error" title="تعذر حفظ الملف">{query.error}</Notice>}<ExecutiveBoardMemberForm action={updateGeneralAssemblyMember} member={member} basePath="/dashboard/general-assembly" allowImageUpload/></div>;
}
