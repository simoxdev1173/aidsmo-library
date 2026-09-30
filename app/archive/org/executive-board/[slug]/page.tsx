import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineArrowRight, HiOutlineBuildingOffice2, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import { executiveBoardSourcePage } from '@/lib/executive-board-data';
import { prisma } from '@/lib/prisma';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const member = await prisma.executiveBoardMember.findUnique({ where: { slug } });
  if (!member || !member.isActive) return { title: 'عضو المجلس التنفيذي | AIDSMO' };
  return {
    title: `${member.name} | المجلس التنفيذي`,
    description: [member.role, member.ministry, member.country].filter(Boolean).join(' — '),
  };
}

export default async function ExecutiveBoardMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await prisma.executiveBoardMember.findUnique({ where: { slug } });
  if (!member || !member.isActive) notFound();
  const sourceUrl = member.websiteUrl || executiveBoardSourcePage;

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#F6F8FA] text-[#0A2540]">
      <section className="relative border-b border-[#C29C41]/25 bg-[#071D2F] text-white">
        <div className="absolute inset-0 opacity-35" aria-hidden><Image src="/standardization-bg.png" alt="" fill priority sizes="100vw" className="object-cover" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,47,0.94),rgba(3,105,161,0.64)_55%,rgba(7,29,47,0.86))]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-36 sm:px-6 lg:px-8 lg:pb-16 lg:pt-40">
          <Link href="/archive/org/executive-board" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:border-[#E8C96A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E8C96A]"><HiOutlineArrowRight className="h-4 w-4" /> أعضاء المجلس التنفيذي</Link>
          <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur"><Image src="/aidsmo-logo.png" alt="" width={30} height={30} className="h-7 w-7 object-contain" /><span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#E8C96A]">المجلس التنفيذي</span></div>
              <h1 className="mt-6 font-academic text-3xl font-bold leading-relaxed md:text-5xl">{member.name}</h1>
              {member.role && <p className="mt-3 font-academic text-lg leading-8 text-white/85">{member.role}</p>}
            </div>
            {member.imageUrl && <img src={member.imageUrl} alt={`علم ${member.country}`} className="h-20 w-32 rounded-xl border border-white/30 object-cover shadow-lg sm:h-24 sm:w-40" />}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8 lg:py-14">
        <div className="space-y-5">
          <article className="rounded-[20px] border border-[#DCE6EF] bg-white p-6 shadow-[0_14px_44px_rgba(10,37,64,0.06)] sm:p-8">
            <p className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#A27E30]">بيانات العضو</p>
            <h2 className="mt-2 font-academic text-2xl font-bold text-[#003652]">التمثيل والجهة</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {member.role && <div className="rounded-[16px] border border-[#E6ECF2] bg-[#F8FAFC] p-5"><div className="flex items-center gap-2 text-xs font-bold text-[#A27E30]"><HiOutlineBuildingOffice2 className="h-4 w-4" /> المنصب الوظيفي</div><p className="mt-3 text-base font-semibold leading-8 text-[#334155]">{member.role}</p></div>}
              <div className="rounded-[16px] border border-[#E6ECF2] bg-[#F8FAFC] p-5"><div className="flex items-center gap-2 text-xs font-bold text-[#A27E30]"><HiOutlineMapPin className="h-4 w-4" /> الدولة والجهة</div><p className="mt-3 text-base font-semibold leading-8 text-[#334155]">{member.ministry}</p><p className="text-sm leading-7 text-[#64748B]">{member.country}</p></div>
            </div>
            {member.bio && <div className="mt-6 rounded-[16px] border border-[#0369A1]/15 bg-[#F0F7FC] p-5"><h3 className="font-bold text-[#003652]">نبذة تعريفية</h3><p className="mt-2 whitespace-pre-line text-sm leading-8 text-[#475569]">{member.bio}</p></div>}
          </article>

          {(member.phone || member.fax || member.email) && <article className="rounded-[20px] border border-[#DCE6EF] bg-white p-6 shadow-[0_14px_44px_rgba(10,37,64,0.06)] sm:p-8">
            <p className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#A27E30]">معلومات الاتصال</p><h2 className="mt-2 font-academic text-2xl font-bold text-[#003652]">بيانات الجهة</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {member.phone && <a href={`tel:${member.phone}`} className="flex items-center gap-3 rounded-[14px] border border-[#E6ECF2] p-4 transition-colors hover:border-[#C29C41]/60"><HiOutlinePhone className="h-5 w-5 text-[#B58D36]" /><span><span className="block text-xs font-semibold text-[#64748B]">هاتف</span><bdi dir="ltr" className="mt-1 block font-semibold text-[#003652]">{member.phone}</bdi></span></a>}
              {member.fax && <div className="flex items-center gap-3 rounded-[14px] border border-[#E6ECF2] p-4"><HiOutlinePhone className="h-5 w-5 text-[#B58D36]" /><span><span className="block text-xs font-semibold text-[#64748B]">فاكس</span><bdi dir="ltr" className="mt-1 block font-semibold text-[#003652]">{member.fax}</bdi></span></div>}
              {member.email && <a href={`mailto:${member.email}`} dir="ltr" className="rounded-[14px] border border-[#E6ECF2] p-4 text-left font-semibold text-[#0369A1]">{member.email}</a>}
            </div>
          </article>}
        </div>

        <aside className="h-fit rounded-[20px] border border-[#C29C41]/25 bg-white p-6 shadow-[0_14px_44px_rgba(10,37,64,0.06)]">
          <h2 className="font-academic text-xl font-bold text-[#003652]">المصدر والروابط</h2>
          {member.sourceProfileName && <div className="mt-4 rounded-[14px] border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-bold text-amber-800">الاسم الظاهر في صفحة المصدر المرتبطة</p><p className="mt-2 text-sm leading-7 text-amber-950">{member.sourceProfileName}</p></div>}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-5 flex min-h-11 items-center justify-center rounded-full border border-[#D9E3EE] px-4 py-2 text-center text-sm font-bold text-[#0369A1] transition-colors hover:border-[#C29C41] hover:text-[#8B681C] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">صفحة العضو على الموقع الرسمي</a>
          {member.vCardUrl && <a href={member.vCardUrl} className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#D9E3EE] bg-[#F8FAFC] px-4 py-2 text-center text-sm font-bold text-[#0369A1] transition-colors hover:border-[#C29C41] hover:bg-[#FBF7EA] hover:text-[#8B681C]">تحميل بطاقة جهة الاتصال (vCard)</a>}
          <Link href="/archive/org/executive-board" className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-gradient-to-b from-[#f1dda0] to-[#C29C41] px-4 py-2 text-sm font-bold text-[#0A2540] transition hover:brightness-105">العودة إلى قائمة الأعضاء</Link>
        </aside>
      </section>
    </main>
  );
}
