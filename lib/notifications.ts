import { prisma } from '@/lib/prisma';
import type { NotificationType } from '@/lib/generated/prisma/enums';

type Message = {
  entryId?: string;
  type: NotificationType;
  sourceKey: string;
  title: string;
  body: string;
  href: string;
};

export async function getUnreadNotificationCount(userId: string) {
  // A dev server may still hold the old generated client until it restarts.
  // The site header should remain usable while the new migration is pending.
  if (typeof prisma.notification?.count !== 'function') return 0;
  try {
    return await prisma.notification.count({ where: { userId, readAt: null } });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2021') return 0;
    throw error;
  }
}

async function deliverToUsers(userIds: string[], message: Message) {
  const uniqueIds = [...new Set(userIds)];
  const safeMessage = {
    ...message,
    title: message.title.slice(0, 250),
    body: message.body.slice(0, 500),
    href: message.href.length <= 500 ? message.href : '/notifications',
  };
  for (let offset = 0; offset < uniqueIds.length; offset += 500) {
    await prisma.notification.createMany({
      data: uniqueIds.slice(offset, offset + 500).map((userId) => ({ userId, ...safeMessage })),
      skipDuplicates: true,
    });
  }
}

export async function notifyCommentReply(replyId: string, recipientId: string, actorId: string, entryId: string, entrySlug: string, actorName: string) {
  if (recipientId === actorId) return;
  await deliverToUsers([recipientId], {
    entryId,
    type: 'COMMENT_REPLY',
    sourceKey: `reply:${replyId}`,
    title: 'رد جديد على تعليقك',
    body: `${actorName} رد على تعليقك في هذا الإصدار.`,
    href: `/book/${encodeURIComponent(entrySlug)}#document-discussion`,
  });
}

async function categoryLineage(categoryId: string) {
  const categories = await prisma.category.findMany({ select: { id: true, parentId: true } });
  const byId = new Map(categories.map((category) => [category.id, category.parentId]));
  const ids: string[] = [];
  let current: string | null | undefined = categoryId;
  while (current && !ids.includes(current)) {
    ids.push(current);
    current = byId.get(current);
  }
  return ids;
}

export async function notifyNewPublication(entry: { id: string; slug: string; title: string; categoryId: string }) {
  const followedIds = await categoryLineage(entry.categoryId);
  const follows = await prisma.categoryFollow.findMany({
    where: { categoryId: { in: followedIds } },
    select: { userId: true },
  });
  await deliverToUsers(follows.map((follow) => follow.userId), {
    entryId: entry.id,
    type: 'NEW_PUBLICATION',
    sourceKey: `publication:${entry.id}`,
    title: 'إصدار جديد في تصنيف تتابعه',
    body: entry.title,
    href: `/book/${encodeURIComponent(entry.slug)}`,
  });
}

export async function notifySavedPublicationUpdated(entry: { id: string; slug: string; title: string; updatedAt: Date }) {
  let cursor: string | undefined;
  do {
    const saved = await prisma.userLibraryItem.findMany({
      where: { entryId: entry.id },
      select: { id: true, userId: true },
      orderBy: { id: 'asc' },
      take: 500,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    if (!saved.length) break;
    await deliverToUsers(saved.map((item) => item.userId), {
      entryId: entry.id,
      type: 'SAVED_PUBLICATION_UPDATED',
      sourceKey: `saved-update:${entry.id}:${entry.updatedAt.getTime()}`,
      title: 'تحديث إصدار محفوظ',
      body: `تحدّث محتوى «${entry.title}».`,
      href: `/book/${encodeURIComponent(entry.slug)}`,
    });
    cursor = saved.at(-1)?.id;
    if (saved.length < 500) break;
  } while (cursor);
}

export async function announceEvent(entry: { id: string; slug: string; title: string }) {
  let cursor: string | undefined;
  let recipients = 0;
  do {
    const users = await prisma.user.findMany({
      select: { id: true }, orderBy: { id: 'asc' }, take: 500,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    if (!users.length) break;
    await deliverToUsers(users.map((user) => user.id), {
      entryId: entry.id,
      type: 'EVENT_ANNOUNCEMENT',
      sourceKey: `event-announcement:${entry.id}`,
      title: 'إعلان فعالية جديدة',
      body: entry.title,
      href: `/book/${encodeURIComponent(entry.slug)}`,
    });
    recipients += users.length;
    cursor = users.at(-1)?.id;
    if (users.length < 500) break;
  } while (cursor);
  return recipients;
}

export async function announceNews(body: string) {
  const sourceKey = `news:${crypto.randomUUID()}`;
  let cursor: string | undefined;
  let recipients = 0;
  do {
    const users = await prisma.user.findMany({
      select: { id: true }, orderBy: { id: 'asc' }, take: 500,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    if (!users.length) break;
    await deliverToUsers(users.map((user) => user.id), {
      type: 'NEWS_ANNOUNCEMENT',
      sourceKey,
      title: 'خبر جديد من المكتبة',
      body,
      href: '/notifications',
    });
    recipients += users.length;
    cursor = users.at(-1)?.id;
    if (users.length < 500) break;
  } while (cursor);
  return recipients;
}
