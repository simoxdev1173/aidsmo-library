import Link from 'next/link';
import { Notice } from '@/app/dashboard/_components/FormFeedback';
import ExecutiveBoardMemberForm from '@/app/dashboard/_components/ExecutiveBoardMemberForm';
import { createGeneralAssemblyMember } from '@/lib/general-assembly-actions';

export const dynamic = 'force-dynamic';
export default async function NewGeneralAssemblyMemberPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className="space-y-6"><div><Link href="/dashboard/general-assembly" className="text-sm font-bold text-[#0B5688]">العودة إلى الجمعية العامة</Link><p className="mt-4 text-sm font-bold text-[#C29C41]">الجمعية العامة</p><h1 className="mt-1 text-3xl font-bold text-[#053D69]">إضافة عضو</h1></div>{error&&<Notice tone="error" title="تعذر حفظ الملف">{error}</Notice>}<ExecutiveBoardMemberForm action={createGeneralAssemblyMember} basePath="/dashboard/general-assembly" allowImageUpload/></div>;
}
