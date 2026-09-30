import Link from 'next/link';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import ExecutiveBoardMemberForm from '@/app/dashboard/_components/ExecutiveBoardMemberForm';
import { createExecutiveBoardMember } from '@/lib/executive-board-actions';

export const dynamic = 'force-dynamic';

export default async function NewExecutiveBoardMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/executive-board" className="text-sm font-bold text-[#0369A1] transition-colors hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">العودة إلى المجلس التنفيذي</Link>
        <p className="mt-4 text-sm font-bold text-[#C29C41]">المجلس التنفيذي</p>
        <h1 className="mt-1 text-3xl font-bold text-[#003652]">إضافة عضو</h1>
      </div>
      {error && <Notice tone="error" title="تعذر حفظ الملف">{error}</Notice>}
      <ExecutiveBoardMemberForm action={createExecutiveBoardMember} />
    </div>
  );
}
