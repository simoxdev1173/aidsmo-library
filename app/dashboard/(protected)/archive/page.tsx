import Link from 'next/link';
import { HiOutlineArchiveBox, HiOutlineArrowLeft, HiOutlineGlobeAlt, HiOutlineIdentification } from 'react-icons/hi2';

export const metadata = { title: 'إدارة الأرشيف | لوحة التحكم' };

const sections = [
  {
    href: '/dashboard/executive-board',
    title: 'إدارة المجلس التنفيذي',
    description: 'تحديث ملفات أعضاء المجلس التنفيذي وبيانات الاتصال والصور والروابط وترتيب العرض.',
    icon: HiOutlineIdentification,
  },
  {
    href: '/dashboard/general-assembly',
    title: 'إدارة الجمعية العامة',
    description: 'تحديث ملفات أعضاء الجمعية العامة وصورهم الشخصية وبيانات الاتصال والروابط وترتيب العرض.',
    icon: HiOutlineGlobeAlt,
  },
];

export default function ArchiveAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#C29C41]">
          <HiOutlineArchiveBox className="h-5 w-5" aria-hidden />
          إدارة المحتوى المؤسسي
        </div>
        <h1 className="mt-2 text-3xl font-bold text-[#053D69]">إدارة الأرشيف</h1>
        <p className="mt-2 text-sm leading-7 text-[#64748B]">اختر القسم الذي تريد تعديل معلوماته وملفات أعضائه.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="group flex flex-col rounded-xl border border-[#D9E3EE] bg-white p-6 shadow-sm transition duration-200 hover:border-[#C29C41] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C29C41] sm:p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EFF5F9] text-[#0B5688]">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-bold text-[#053D69]">{section.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#64748B]">{section.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0B5688] group-hover:text-[#8B681C]">فتح القسم <HiOutlineArrowLeft className="h-4 w-4" aria-hidden /></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
