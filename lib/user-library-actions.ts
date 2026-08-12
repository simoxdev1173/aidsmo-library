'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUserSession, requireUser } from '@/lib/user-auth';

const VALID_STATUSES = ['SAVED', 'READING', 'COMPLETED'] as const;
type ReadingStatusValue = (typeof VALID_STATUSES)[number];

type ActionResult = {
  ok: boolean;
  error?: string;
  saved?: boolean;
  requiresAuth?: boolean;
};

function refreshLibrary(slug?: string) {
  revalidatePath('/library');
  if (slug) revalidatePath(`/book/${slug}`);
}

export async function toggleSavedBookAction(entryId: string): Promise<ActionResult> {
  const user = await getUserSession();
  if (!user) return { ok: false, requiresAuth: true };

  const entry = await prisma.libraryEntry.findFirst({
    where: { id: entryId, status: 'PUBLISHED' },
    select: { id: true, slug: true },
  });
  if (!entry) return { ok: false, error: 'هذا الإصدار غير متاح حاليا.' };

  const existing = await prisma.userLibraryItem.findUnique({
    where: { userId_entryId: { userId: user.id, entryId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.userLibraryItem.delete({ where: { id: existing.id } });
    refreshLibrary(entry.slug);
    return { ok: true, saved: false };
  }

  const lastItem = await prisma.userLibraryItem.findFirst({
    where: { userId: user.id },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  await prisma.userLibraryItem.create({
    data: {
      userId: user.id,
      entryId,
      position: (lastItem?.position ?? -1) + 1,
    },
  });
  refreshLibrary(entry.slug);
  return { ok: true, saved: true };
}

export async function removeLibraryItemAction(itemId: string): Promise<ActionResult> {
  const user = await requireUser();
  const item = await prisma.userLibraryItem.findFirst({
    where: { id: itemId, userId: user.id },
    select: { id: true, entry: { select: { slug: true } } },
  });

  if (!item) return { ok: false, error: 'تعذر العثور على العنصر المحفوظ.' };
  await prisma.userLibraryItem.delete({ where: { id: item.id } });
  refreshLibrary(item.entry.slug);
  return { ok: true };
}

export async function updateLibraryItemAction(
  itemId: string,
  input: { status?: string; progress?: number; shelfId?: string | null },
): Promise<ActionResult> {
  const user = await requireUser();
  const item = await prisma.userLibraryItem.findFirst({
    where: { id: itemId, userId: user.id },
    select: { id: true },
  });
  if (!item) return { ok: false, error: 'تعذر العثور على العنصر المحفوظ.' };

  const data: {
    status?: ReadingStatusValue;
    progress?: number;
    shelfId?: string | null;
    position?: number;
  } = {};

  if (input.status && VALID_STATUSES.includes(input.status as ReadingStatusValue)) {
    data.status = input.status as ReadingStatusValue;
    if (input.status === 'COMPLETED') data.progress = 100;
  }

  if (typeof input.progress === 'number' && Number.isFinite(input.progress)) {
    data.progress = Math.min(100, Math.max(0, Math.round(input.progress)));
    if (data.progress === 100) data.status = 'COMPLETED';
    else if (data.progress > 0 && !data.status) data.status = 'READING';
  }

  if ('shelfId' in input) {
    if (input.shelfId) {
      const shelf = await prisma.userShelf.findFirst({
        where: { id: input.shelfId, userId: user.id },
        select: { id: true },
      });
      if (!shelf) return { ok: false, error: 'الرف المحدد غير موجود.' };
    }

    data.shelfId = input.shelfId || null;
    const lastInShelf = await prisma.userLibraryItem.findFirst({
      where: { userId: user.id, shelfId: input.shelfId || null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    data.position = (lastInShelf?.position ?? -1) + 1;
  }

  if (!Object.keys(data).length) return { ok: true };
  await prisma.userLibraryItem.update({ where: { id: item.id }, data });
  refreshLibrary();
  return { ok: true };
}

export async function moveLibraryItemAction(
  itemId: string,
  direction: 'up' | 'down',
): Promise<ActionResult> {
  const user = await requireUser();
  const current = await prisma.userLibraryItem.findFirst({
    where: { id: itemId, userId: user.id },
    select: { id: true, shelfId: true, position: true },
  });
  if (!current) return { ok: false, error: 'تعذر العثور على العنصر المحفوظ.' };

  const siblings = await prisma.userLibraryItem.findMany({
    where: { userId: user.id, shelfId: current.shelfId },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, position: true },
  });
  const index = siblings.findIndex((item) => item.id === current.id);
  const target = siblings[direction === 'up' ? index - 1 : index + 1];
  if (!target) return { ok: true };

  await prisma.$transaction([
    prisma.userLibraryItem.update({
      where: { id: current.id },
      data: { position: target.position },
    }),
    prisma.userLibraryItem.update({
      where: { id: target.id },
      data: { position: current.position },
    }),
  ]);
  refreshLibrary();
  return { ok: true };
}

export async function createShelfAction(nameValue: string): Promise<ActionResult> {
  const user = await requireUser();
  const name = nameValue.trim().replace(/\s+/g, ' ').slice(0, 60);
  if (name.length < 2) return { ok: false, error: 'اكتب اسما للرف من حرفين على الأقل.' };

  const existing = await prisma.userShelf.findUnique({
    where: { userId_name: { userId: user.id, name } },
    select: { id: true },
  });
  if (existing) return { ok: false, error: 'يوجد رف بهذا الاسم بالفعل.' };

  const lastShelf = await prisma.userShelf.findFirst({
    where: { userId: user.id },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  await prisma.userShelf.create({
    data: { userId: user.id, name, position: (lastShelf?.position ?? -1) + 1 },
  });
  refreshLibrary();
  return { ok: true };
}

export async function deleteShelfAction(shelfId: string): Promise<ActionResult> {
  const user = await requireUser();
  const shelf = await prisma.userShelf.findFirst({
    where: { id: shelfId, userId: user.id },
    select: { id: true },
  });
  if (!shelf) return { ok: false, error: 'تعذر العثور على الرف.' };

  await prisma.userShelf.delete({ where: { id: shelf.id } });
  refreshLibrary();
  return { ok: true };
}
