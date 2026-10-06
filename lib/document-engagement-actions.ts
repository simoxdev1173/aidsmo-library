'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/user-auth';
import { publicEntryWhere } from '@/lib/public-entry-where';
import { getDocumentCommentPage, getDocumentReplyPage, isReplySchemaUnavailable } from '@/lib/document-comments';

const VISITOR_COOKIE = 'aidsmo_visitor';

type ActionResult = { ok: boolean; error?: string; requiresAuth?: boolean };
type CommentActionResult = ActionResult & { comment?: {
  id: string; userId: string; name: string; image: string | null; body: string; createdAt: string;
} };

async function publicEntry(entryId: string) {
  if (!entryId || entryId.length > 100) return null;
  return prisma.libraryEntry.findFirst({
    where: { id: entryId, AND: [publicEntryWhere] },
    select: { id: true, slug: true },
  });
}

export async function registerDocumentViewAction(entryId: string) {
  const entry = await publicEntry(entryId);
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

async function createDocumentComment(entryId: string, text: string, parentId: string | null): Promise<CommentActionResult> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publicEntry(entryId);
  if (!entry) return { ok: false, error: 'هذا الإصدار غير متاح حاليا.' };
  const body = typeof text === 'string' ? text.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu, '') : '';
  if (body.length < 3 || body.length > 1000) return { ok: false, error: 'اكتب تعليقا بين 3 و1000 حرف.' };
  if (parentId) {
    if (parentId.length > 100) return { ok: false, error: 'تعذر العثور على التعليق.' };
    try {
      const parent = await prisma.documentComment.findFirst({
        where: { id: parentId, entryId, parentId: null },
        select: { id: true },
      });
      if (!parent) return { ok: false, error: 'تعذر العثور على التعليق.' };
    } catch (error) {
      if (!isReplySchemaUnavailable(error)) throw error;
      return { ok: false, error: 'الردود غير متاحة حاليا.' };
    }
  }

  const latest = await prisma.documentComment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < 30_000) {
    return { ok: false, error: 'انتظر قليلا قبل نشر تعليق آخر.' };
  }

  let comment;
  try {
    comment = await prisma.documentComment.create({
      data: { entryId, userId: user.id, parentId, body },
      select: { id: true, body: true, createdAt: true },
    });
  } catch (error) {
    if (!isReplySchemaUnavailable(error)) throw error;
    if (parentId) return { ok: false, error: 'الردود غير متاحة حاليا.' };
    comment = await prisma.documentComment.create({
      data: { entryId, userId: user.id, body },
      select: { id: true, body: true, createdAt: true },
    });
  }
  revalidatePath(`/book/${entry.slug}`);
  return { ok: true, comment: { id: comment.id, userId: user.id, name: user.name, image: user.image, body: comment.body, createdAt: comment.createdAt.toISOString() } };
}

export async function addDocumentCommentAction(entryId: string, text: string) {
  return createDocumentComment(entryId, text, null);
}

export async function addDocumentReplyAction(entryId: string, parentId: string, text: string) {
  if (!parentId || typeof parentId !== 'string') return { ok: false, error: 'تعذر العثور على التعليق.' };
  return createDocumentComment(entryId, text, parentId);
}

export async function rateDocumentAction(entryId: string, value: number): Promise<ActionResult & { average?: number; count?: number; value?: number }> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publicEntry(entryId);
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

export async function deleteDocumentCommentAction(entryId: string, commentId: string): Promise<ActionResult & { parentId?: string | null; deletedCount?: number }> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };
  const entry = await publicEntry(entryId);
  if (!entry || !commentId || commentId.length > 100) return { ok: false, error: 'تعذر العثور على التعليق.' };
  let parentId: string | null = null;
  let deletedCount = 1;
  try {
    const comment = await prisma.documentComment.findFirst({
      where: { id: commentId, entryId, userId: user.id },
      select: { parentId: true, _count: { select: { replies: true } } },
    });
    if (!comment) return { ok: false, error: 'يمكنك حذف تعليقاتك فقط.' };
    parentId = comment.parentId;
    deletedCount += comment._count.replies;
  } catch (error) {
    if (!isReplySchemaUnavailable(error)) throw error;
    const comment = await prisma.documentComment.findFirst({
      where: { id: commentId, entryId, userId: user.id },
      select: { id: true },
    });
    if (!comment) return { ok: false, error: 'يمكنك حذف تعليقاتك فقط.' };
  }
  const result = await prisma.documentComment.deleteMany({ where: { id: commentId, entryId, userId: user.id } });
  if (!result.count) return { ok: false, error: 'يمكنك حذف تعليقاتك فقط.' };
  revalidatePath(`/book/${entry.slug}`);
  return { ok: true, parentId, deletedCount };
}

export async function moreDocumentCommentsAction(entryId: string, cursor: string) {
  const entry = await publicEntry(entryId);
  if (!entry || !cursor || cursor.length > 100) return { comments: [], nextCursor: null };
  const anchor = await prisma.documentComment.findFirst({ where: { id: cursor, entryId }, select: { id: true } });
  if (!anchor) return { comments: [], nextCursor: null };
  return getDocumentCommentPage(entryId, cursor);
}

export async function moreDocumentRepliesAction(entryId: string, parentId: string, cursor?: string) {
  const entry = await publicEntry(entryId);
  if (!entry || typeof parentId !== 'string' || !parentId || parentId.length > 100 || (cursor !== undefined && (typeof cursor !== 'string' || !cursor || cursor.length > 100))) return { replies: [], nextCursor: null };
  try {
    const parent = await prisma.documentComment.findFirst({
      where: { id: parentId, entryId, parentId: null },
      select: { id: true },
    });
    if (!parent) return { replies: [], nextCursor: null };
    if (cursor) {
      const anchor = await prisma.documentComment.findFirst({ where: { id: cursor, entryId, parentId }, select: { id: true } });
      if (!anchor) return { replies: [], nextCursor: null };
    }
    return getDocumentReplyPage(entryId, parentId, cursor);
  } catch (error) {
    if (!isReplySchemaUnavailable(error)) throw error;
    return { replies: [], nextCursor: null };
  }
}
