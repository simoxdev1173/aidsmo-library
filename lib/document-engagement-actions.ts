'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/user-auth';

const VISITOR_COOKIE = 'aidsmo_visitor';
const COMMENT_PAGE_SIZE = 10;

type ActionResult = { ok: boolean; error?: string; requiresAuth?: boolean };

async function publishedEntry(entryId: string) {
  if (!entryId || entryId.length > 100) return null;
  return prisma.libraryEntry.findFirst({
    where: { id: entryId, status: 'PUBLISHED' },
    select: { id: true, slug: true },
  });
}

export async function registerDocumentViewAction(entryId: string) {
  const entry = await publishedEntry(entryId);
  if (!entry) return { ok: false, count: 0 };

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
    visitorId = randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const viewedOn = new Date(new Date().toISOString().slice(0, 10));
  await prisma.documentView.createMany({
    data: [{ entryId, visitorId, viewedOn }],
    skipDuplicates: true,
  });
  const count = await prisma.documentView.count({ where: { entryId } });
  return { ok: true, count };
}

export async function addDocumentCommentAction(entryId: string, text: string): Promise<ActionResult & { comment?: {
  id: string; name: string; body: string; createdAt: string;
} }> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publishedEntry(entryId);
  if (!entry) return { ok: false, error: 'هذا الإصدار غير متاح حاليا.' };
  const body = typeof text === 'string' ? text.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu, '') : '';
  if (body.length < 3 || body.length > 1000) return { ok: false, error: 'اكتب تعليقا بين 3 و1000 حرف.' };

  const latest = await prisma.documentComment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < 30_000) {
    return { ok: false, error: 'انتظر قليلا قبل نشر تعليق آخر.' };
  }

  const comment = await prisma.documentComment.create({
    data: { entryId, userId: user.id, body },
    select: { id: true, body: true, createdAt: true },
  });
  revalidatePath(`/book/${entry.slug}`);
  return { ok: true, comment: { id: comment.id, name: user.name, body: comment.body, createdAt: comment.createdAt.toISOString() } };
}

export async function rateDocumentAction(entryId: string, value: number): Promise<ActionResult & { average?: number; count?: number; value?: number }> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publishedEntry(entryId);
  if (!entry) return { ok: false, error: 'هذا الإصدار غير متاح حاليا.' };
  if (!Number.isInteger(value) || value < 1 || value > 5) return { ok: false, error: 'اختر تقييما من نجمة إلى خمس نجوم.' };

  await prisma.documentRating.upsert({
    where: { entryId_userId: { entryId, userId: user.id } },
    create: { entryId, userId: user.id, value },
    update: { value },
  });
  const aggregate = await prisma.documentRating.aggregate({ where: { entryId }, _avg: { value: true }, _count: { value: true } });
  revalidatePath(`/book/${entry.slug}`);
  return { ok: true, value, average: aggregate._avg.value ?? 0, count: aggregate._count.value };
}

export async function deleteDocumentCommentAction(entryId: string, commentId: string): Promise<ActionResult> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publishedEntry(entryId);
  if (!entry || !commentId || commentId.length > 100) return { ok: false, error: 'تعذر العثور على التعليق.' };
  const result = await prisma.documentComment.deleteMany({ where: { id: commentId, entryId, userId: user.id } });
  if (!result.count) return { ok: false, error: 'يمكنك حذف تعليقاتك فقط.' };
  revalidatePath(`/book/${entry.slug}`);
  return { ok: true };
}

export async function moreDocumentCommentsAction(entryId: string, cursor: string) {
  const entry = await publishedEntry(entryId);
  if (!entry || !cursor || cursor.length > 100) return { comments: [], nextCursor: null };
  const anchor = await prisma.documentComment.findFirst({ where: { id: cursor, entryId }, select: { id: true } });
  if (!anchor) return { comments: [], nextCursor: null };

  const rows = await prisma.documentComment.findMany({
    where: { entryId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    cursor: { id: cursor },
    skip: 1,
    take: COMMENT_PAGE_SIZE + 1,
    select: { id: true, body: true, createdAt: true, userId: true, user: { select: { name: true, email: true } } },
  });
  const visible = rows.slice(0, COMMENT_PAGE_SIZE);
  return {
    comments: visible.map((row) => ({ id: row.id, userId: row.userId, name: row.user.name?.trim() || row.user.email?.split('@')[0] || 'قارئ', body: row.body, createdAt: row.createdAt.toISOString() })),
    nextCursor: rows.length > COMMENT_PAGE_SIZE ? visible.at(-1)?.id ?? null : null,
  };
}
