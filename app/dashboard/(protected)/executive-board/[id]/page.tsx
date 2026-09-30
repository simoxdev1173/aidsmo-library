import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import ExecutiveBoardMemberForm from '@/app/dashboard/_components/ExecutiveBoardMemberForm';
import { updateExecutiveBoardMember } from '@/lib/executive-board-actions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditExecutiveBoardMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const member = await prisma.executiveBoardMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/executive-board" className="text-sm font-bold text-[#0369A1] transition-colors hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">العودة إلى المجلس التنفيذي</Link>
        <p className="mt-4 text-sm font-bold text-[#C29C41]">المجلس التنفيذي</p>
        <h1 className="mt-1 text-3xl font-bold text-[#003652]">تعديل الملف التعريفي</h1>
        <p className="mt-2 text-sm text-[#64748B]">{member.name}</p>
      </div>
      {query.saved === 'updated' && <Notice tone="success" title="تم حفظ التغييرات." />}
      {query.error && <Notice tone="error" title="تعذر حفظ الملف">{query.error}</Notice>}
      {member.sourceNote && <Notice tone="info" title="مراجعة بيانات المصدر">{member.sourceNote}</Notice>}
      <ExecutiveBoardMemberForm member={member} action={updateExecutiveBoardMember} />
    </div>
  );
}
