'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUserSession, requireUser } from '@/lib/user-auth';

export async function setCategoryFollowAction(categoryId: string, follow: boolean) {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  if (typeof categoryId !== 'string' || categoryId.length > 100 || typeof follow !== 'boolean') return { ok: false };
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, slug: true } });
  if (!category) return { ok: false };
  if (follow) {
    await prisma.categoryFollow.upsert({
      where: { userId_categoryId: { userId: user.id, categoryId } },
      create: { userId: user.id, categoryId },
      update: {},
    });
  } else {
    await prisma.categoryFollow.deleteMany({ where: { userId: user.id, categoryId } });
  }
  revalidatePath(`/catalog/${category.slug}`);
  revalidatePath('/profile');
  return { ok: true, following: follow };
}

export async function openNotificationAction(id: string) {
  const user = await requireUser('/notifications');
  if (typeof id !== 'string' || id.length > 100) redirect('/notifications');
  const notification = await prisma.notification.findFirst({ where: { id, userId: user.id }, select: { id: true, href: true } });
  if (!notification) redirect('/notifications');
  await prisma.notification.update({ where: { id: notification.id }, data: { readAt: new Date() } });
  revalidatePath('/notifications');
  revalidatePath('/', 'layout');
  redirect(notification.href.startsWith('/book/') && !notification.href.startsWith('//') ? notification.href : '/notifications');
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser('/notifications');
  await prisma.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath('/notifications');
  revalidatePath('/', 'layout');
}
