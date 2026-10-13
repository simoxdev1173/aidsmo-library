import Link from 'next/link';
import { LuBell, LuCheckCheck, LuMessageCircle, LuBookOpen, LuCalendarDays } from 'react-icons/lu';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/user-auth';
import { markAllNotificationsReadAction, openNotificationAction } from '@/lib/notification-actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'إشعاراتي | المكتبة الرقمية الذكية' };

const iconByType = {
  COMMENT_REPLY: LuMessageCircle,
  NEW_PUBLICATION: LuBookOpen,
  SAVED_PUBLICATION_UPDATED: LuBookOpen,
  EVENT_ANNOUNCEMENT: LuCalendarDays,
  NEWS_ANNOUNCEMENT: LuBell,
};

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireUser('/notifications');
  const query = await searchParams;
  const rawPage = Number(query.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 1000) : 1;
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * 30, take: 31 }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
  ]);
  const hasNext = notifications.length > 30;

  return <main dir="rtl" className="min-h-screen bg-[#F8FAFC] px-4 pb-20 pt-14 text-[#082F50] sm:px-6">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#D9E3EE] pb-6">
        <div>
          <p className="text-sm font-bold text-[#A77C20]">حسابي</p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold"><LuBell className="size-7 text-[#C29C41]" />الإشعارات</h1>
          <p className="mt-2 text-sm text-[#64748B]">{unreadCount ? `${unreadCount} إشعار غير مقروء` : 'أنت مطّلع على جميع الإشعارات.'}</p>
        </div>
        {unreadCount > 0 && <form action={markAllNotificationsReadAction}><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C29C41] bg-white px-4 text-sm font-bold text-[#053D69] hover:bg-[#FFF8E8]"><LuCheckCheck className="size-4" />تحديد الكل كمقروء</button></form>}
      </div>

      {notifications.length ? <ul className="space-y-3">{notifications.slice(0, 30).map((notification) => {
        const Icon = iconByType[notification.type];
        return <li key={notification.id} className={`rounded-2xl border p-1 shadow-sm ${notification.readAt ? 'border-[#D9E3EE] bg-white' : 'border-[#C29C41]/60 bg-[#FFFDF6]'}`}>
          <form action={openNotificationAction.bind(null, notification.id)}>
            <button type="submit" className="flex min-h-20 w-full cursor-pointer items-start gap-4 rounded-xl p-4 text-right transition-colors hover:bg-[#EDF4F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E9F2F8] text-[#053D69]"><Icon className="size-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2"><strong className="text-sm">{notification.title}</strong>{!notification.readAt && <span className="size-2 rounded-full bg-[#C29C41]" aria-label="غير مقروء" />}</span>
                <span className="mt-1 block text-sm leading-6 text-[#475569]">{notification.body}</span>
                <time className="mt-2 block text-xs text-[#64748B]" dateTime={notification.createdAt.toISOString()}>{new Intl.DateTimeFormat('ar-MA', { dateStyle: 'medium', timeStyle: 'short' }).format(notification.createdAt)}</time>
              </span>
            </button>
          </form>
        </li>;
      })}</ul> : <div className="rounded-2xl border border-[#D9E3EE] bg-white p-10 text-center"><LuBell className="mx-auto size-10 text-[#C29C41]" /><h2 className="mt-4 text-lg font-bold">لا توجد إشعارات بعد</h2><p className="mt-2 text-sm text-[#64748B]">تابع تصنيفاً لتصلك إصداراته الجديدة، أو شارك بتعليق على أحد الإصدارات.</p><Link href="/profile?section=notifications" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#053D69] px-5 text-sm font-bold text-white">إدارة المتابعات</Link></div>}
      {(page > 1 || hasNext) && <nav aria-label="صفحات الإشعارات" className="mt-7 flex items-center justify-between gap-3 text-sm font-bold text-[#053D69]">
        {page > 1 ? <Link href={`/notifications?page=${page - 1}`} className="rounded-full border border-[#D9E3EE] bg-white px-5 py-3">السابق</Link> : <span />}
        {hasNext && <Link href={`/notifications?page=${page + 1}`} className="rounded-full border border-[#D9E3EE] bg-white px-5 py-3">التالي</Link>}
      </nav>}
    </div>
  </main>;
}
