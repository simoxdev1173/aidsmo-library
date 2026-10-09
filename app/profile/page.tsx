import Image from 'next/image';
import Link from 'next/link';
import { LuBell, LuCamera, LuKeyRound, LuMail, LuTrash2, LuUserRound } from 'react-icons/lu';
import AuthShell from '@/components/auth/AuthShell';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { changeProfilePasswordAction, removeProfilePictureAction, updateProfileAction } from '@/lib/profile-actions';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/user-auth';
import CategoryFollowButton from '@/components/CategoryFollowButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'إعدادات الملف الشخصي | المكتبة الرقمية الذكية' };

export default async function ProfilePage({ searchParams }: {
  searchParams: Promise<{ error?: string; saved?: string; section?: string }>;
}) {
  const session = await requireUser('/profile');
  const [user, query, follows] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.id }, select: { name: true, email: true, image: true, passwordHash: true } }),
    searchParams,
    prisma.categoryFollow.findMany({ where: { userId: session.id }, include: { category: true }, orderBy: { createdAt: 'desc' } }),
  ]);
  if (!user) return null;
  const activeSection = query.section === 'password' ? 'password' : query.section === 'notifications' ? 'notifications' : 'personal';

  return (
    <AuthShell
      title="إعدادات الملف الشخصي"
      description="اختر القسم الذي تريد تحديثه في حسابك."
      showTabs={false}
      showImage={false}
    >
      <nav aria-label="إعدادات الحساب" className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-2 rounded-2xl bg-[#EDF4F9] p-1.5">
        <Link
          href="/profile"
          aria-current={activeSection === 'personal' ? 'page' : undefined}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-center text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] ${activeSection === 'personal' ? 'bg-white text-[#0A527E] shadow-sm' : 'text-[#64748B] hover:text-[#0A527E]'}`}
        >
          <LuUserRound className="size-4 shrink-0" aria-hidden="true" />
          البيانات الشخصية
        </Link>
        <Link
          href="/profile?section=password"
          aria-current={activeSection === 'password' ? 'page' : undefined}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-center text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] ${activeSection === 'password' ? 'bg-white text-[#0A527E] shadow-sm' : 'text-[#64748B] hover:text-[#0A527E]'}`}
        >
          <LuKeyRound className="size-4 shrink-0" aria-hidden="true" />
          كلمة المرور
        </Link>
        <Link href="/profile?section=notifications" aria-current={activeSection === 'notifications' ? 'page' : undefined} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-center text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] sm:text-sm ${activeSection === 'notifications' ? 'bg-white text-[#0A527E] shadow-sm' : 'text-[#64748B] hover:text-[#0A527E]'}`}>
          <LuBell className="size-4 shrink-0" aria-hidden="true" />
          المتابعات
        </Link>
      </nav>

      {query.error && (
        <div role="alert" className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
          {query.error}
        </div>
      )}
      {query.saved && (
        <div role="status" className="mx-auto mt-6 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-800">
          تم حفظ التغييرات بنجاح.
        </div>
      )}

      <div className="mx-auto mt-7 flex max-w-2xl items-center gap-4 rounded-2xl border border-[#D9E3EE] bg-[#F6FAFD] p-4">
        <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#C29C41]/50 bg-[#082F50] text-[#E8C96A] sm:size-20">
          {user.image ? (
            <Image src={user.image} alt="صورتك الشخصية" fill sizes="80px" className="object-cover" unoptimized />
          ) : (
            <LuUserRound className="size-8 sm:size-9" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-[#082F50]">{user.name || session.name}</p>
          <p dir="ltr" className="mt-1 truncate text-left text-xs text-[#64748B]">{user.email}</p>
          {user.image && activeSection === 'personal' && (
            <form action={removeProfilePictureAction} className="mt-2">
              <button type="submit" className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-xs font-bold text-[#9F2D2D] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">
                <LuTrash2 className="size-4" aria-hidden="true" />
                حذف الصورة
              </button>
            </form>
          )}
        </div>
      </div>

      {activeSection === 'personal' ? (
      <section className="mx-auto mt-7 w-full max-w-2xl rounded-2xl border border-[#E7ECF2] bg-white p-5 sm:p-7" aria-labelledby="personal-details-heading">
        <div className="mb-6 flex items-center gap-3 border-b border-[#E7ECF2] pb-4">
          <span className="grid size-10 place-items-center rounded-xl bg-[#EDF4F9] text-[#0B5688]"><LuUserRound className="size-5" /></span>
          <div>
            <h2 id="personal-details-heading" className="font-bold text-[#082F50]">البيانات الشخصية</h2>
            <p className="mt-1 text-xs text-[#64748B]">الاسم والبريد الإلكتروني وصورة الحساب</p>
          </div>
        </div>

        <form action={updateProfileAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-image" className="inline-flex items-center gap-2"><LuCamera className="size-4 text-[#C29C41]" />الصورة الشخصية</FieldLabel>
              <Input id="profile-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="h-auto min-h-13 py-2.5 file:me-3 file:rounded-lg file:border-0 file:bg-[#EDF4F9] file:px-3 file:py-1 file:text-[#0B5688]" />
              <FieldDescription>JPG أو PNG أو WebP أو AVIF، بحجم لا يتجاوز 2MB.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-name">الاسم</FieldLabel>
              <Input id="profile-name" name="name" defaultValue={user.name ?? ''} required minLength={2} maxLength={100} autoComplete="name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-email" className="inline-flex items-center gap-2"><LuMail className="size-4 text-[#C29C41]" />البريد الإلكتروني</FieldLabel>
              <Input id="profile-email" name="email" type="email" dir="ltr" defaultValue={user.email ?? ''} required maxLength={254} autoComplete="email" className="text-left" />
            </Field>
            {user.passwordHash ? (
              <Field>
                <FieldLabel htmlFor="profile-current-password">كلمة المرور الحالية عند تغيير البريد</FieldLabel>
                <PasswordInput id="profile-current-password" name="currentPassword" autoComplete="current-password" />
                <FieldDescription>اتركها فارغة إذا لم تغيّر البريد الإلكتروني.</FieldDescription>
              </Field>
            ) : (
              <p className="rounded-xl bg-[#FFF8E8] px-4 py-3 text-xs leading-6 text-[#805E1B]">
                حساب Google: لتغيير البريد الإلكتروني، عيّن كلمة مرور أولاً عبر{' '}
                <Link href="/forgot-password?callbackUrl=%2Fprofile" className="font-bold underline">استعادة كلمة المرور</Link>.
              </p>
            )}
            <AuthSubmitButton pendingText="جاري حفظ البيانات...">حفظ البيانات الشخصية</AuthSubmitButton>
          </FieldGroup>
        </form>
      </section>
      ) : activeSection === 'password' ? (
      <section className="mx-auto mt-7 w-full max-w-2xl rounded-2xl border border-[#E7ECF2] bg-white p-5 sm:p-7" aria-labelledby="password-heading">
        <div className="mb-6 flex items-center gap-3 border-b border-[#E7ECF2] pb-4">
          <span className="grid size-10 place-items-center rounded-xl bg-[#FFF8E8] text-[#9A7421]"><LuKeyRound className="size-5" /></span>
          <div>
            <h2 id="password-heading" className="font-bold text-[#082F50]">كلمة المرور</h2>
            <p className="mt-1 text-xs text-[#64748B]">احمِ حسابك بكلمة مرور قوية.</p>
          </div>
        </div>
        {user.passwordHash ? (
          <form action={changeProfilePasswordAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password-current">كلمة المرور الحالية</FieldLabel>
                <PasswordInput id="password-current" name="currentPassword" required autoComplete="current-password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="password-new">كلمة المرور الجديدة</FieldLabel>
                <PasswordInput id="password-new" name="password" required minLength={8} maxLength={128} autoComplete="new-password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="password-confirm">تأكيد كلمة المرور الجديدة</FieldLabel>
                <PasswordInput id="password-confirm" name="confirmPassword" required minLength={8} maxLength={128} autoComplete="new-password" />
              </Field>
              <AuthSubmitButton pendingText="جاري تحديث كلمة المرور...">تحديث كلمة المرور</AuthSubmitButton>
            </FieldGroup>
          </form>
        ) : (
          <p className="text-sm leading-7 text-[#475569]">
            لا توجد كلمة مرور لهذا الحساب. يمكنك{' '}
            <Link href="/forgot-password?callbackUrl=%2Fprofile" className="font-bold text-[#0B5688] underline">تعيين كلمة مرور</Link>{' '}
            عبر بريدك الإلكتروني.
          </p>
        )}
      </section>
      ) : (
      <section className="mx-auto mt-7 w-full max-w-2xl rounded-2xl border border-[#E7ECF2] bg-white p-5 sm:p-7" aria-labelledby="follows-heading">
        <div className="mb-5 flex items-center gap-3 border-b border-[#E7ECF2] pb-4">
          <span className="grid size-10 place-items-center rounded-xl bg-[#FFF8E8] text-[#9A7421]"><LuBell className="size-5" /></span>
          <div>
            <h2 id="follows-heading" className="font-bold text-[#082F50]">التصنيفات التي تتابعها</h2>
            <p className="mt-1 text-xs text-[#64748B]">ستجد الإصدارات الجديدة من هذه التصنيفات في إشعاراتك.</p>
          </div>
        </div>
        {follows.length ? <ul className="space-y-3">{follows.map(({ category }) => <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D9E3EE] p-3">
          <Link href={`/catalog/${category.slug}`} className="font-bold text-[#053D69] hover:underline">{category.name}</Link>
          <CategoryFollowButton categoryId={category.id} initialFollowing compact />
        </li>)}</ul> : <p className="rounded-xl bg-[#F6FAFD] p-4 text-sm leading-7 text-[#475569]">لم تتابع أي تصنيف بعد. افتح صفحة أي تصنيف من فهرس المكتبة واضغط «تابع التصنيف».</p>}
        <Link href="/notifications" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#053D69] px-5 text-sm font-bold text-white hover:bg-[#0B5688]">عرض الإشعارات</Link>
      </section>
      )}

      <div className="mx-auto mt-9 max-w-2xl border-t border-[#E7ECF2] pt-5 text-center">
        <Link href="/library" className="text-sm font-bold text-[#8B681C] transition hover:text-[#0B5688] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C29C41]">
          العودة إلى مكتبتي
        </Link>
      </div>
    </AuthShell>
  );
}
