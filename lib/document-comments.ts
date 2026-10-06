import { prisma } from '@/lib/prisma';

export const COMMENT_PAGE_SIZE = 10;
export const REPLY_PAGE_SIZE = 3;

const commentSelect = {
  id: true,
  userId: true,
  body: true,
  createdAt: true,
  user: { select: { name: true, email: true, image: true } },
} as const;

type CommentRow = {
  id: string;
  userId: string;
  body: string;
  createdAt: Date;
  user: { name: string | null; email: string | null; image: string | null };
};

function serializeComment(row: CommentRow) {
  return {
    id: row.id,
    userId: row.userId,
    name: row.user.name?.trim() || row.user.email?.split('@')[0] || 'قارئ',
    image: row.user.image,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export function isReplySchemaUnavailable(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  if ('code' in error && error.code === 'P2022') return true;
  return error instanceof Error
    && error.name === 'PrismaClientValidationError'
    && /parentId|replies/u.test(error.message);
}

export async function getDocumentCommentPage(entryId: string, cursor?: string) {
  try {
    const rows = await prisma.documentComment.findMany({
      where: { entryId, parentId: null },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: COMMENT_PAGE_SIZE + 1,
      select: {
        ...commentSelect,
        replies: {
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: REPLY_PAGE_SIZE + 1,
          select: commentSelect,
        },
        _count: { select: { replies: true } },
      },
    });
    const visible = rows.slice(0, COMMENT_PAGE_SIZE);
    return {
      comments: visible.map((row) => {
        const replies = row.replies.slice(0, REPLY_PAGE_SIZE);
        return {
          ...serializeComment(row),
          replies: replies.map(serializeComment),
          replyCount: row._count.replies,
          nextReplyCursor: row.replies.length > REPLY_PAGE_SIZE ? replies.at(-1)?.id ?? null : null,
        };
      }),
      nextCursor: rows.length > COMMENT_PAGE_SIZE ? visible.at(-1)?.id ?? null : null,
      repliesEnabled: true,
    };
  } catch (error) {
    if (!isReplySchemaUnavailable(error)) throw error;
    const rows = await prisma.documentComment.findMany({
      where: { entryId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: COMMENT_PAGE_SIZE + 1,
      select: commentSelect,
    });
    const visible = rows.slice(0, COMMENT_PAGE_SIZE);
    return {
      comments: visible.map((row) => ({ ...serializeComment(row), replies: [], replyCount: 0, nextReplyCursor: null })),
      nextCursor: rows.length > COMMENT_PAGE_SIZE ? visible.at(-1)?.id ?? null : null,
      repliesEnabled: false,
    };
  }
}

export async function getDocumentReplyPage(entryId: string, parentId: string, cursor?: string) {
  const rows = await prisma.documentComment.findMany({
    where: { entryId, parentId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: REPLY_PAGE_SIZE + 1,
    select: commentSelect,
  });
  const visible = rows.slice(0, REPLY_PAGE_SIZE);
  return {
    replies: visible.map(serializeComment),
    nextCursor: rows.length > REPLY_PAGE_SIZE ? visible.at(-1)?.id ?? null : null,
  };
}
