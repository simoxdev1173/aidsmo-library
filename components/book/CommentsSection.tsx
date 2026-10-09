'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineChatBubbleLeftRight, HiOutlineChevronDown, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import {
  addDocumentCommentAction,
  addDocumentReplyAction,
  deleteDocumentCommentAction,
  moreDocumentCommentsAction,
  moreDocumentRepliesAction,
} from '@/lib/document-engagement-actions';

type Reply = { id: string; userId: string; name: string; image: string | null; body: string; createdAt: string; mine: boolean };
type Comment = Reply & { replies: Reply[]; replyCount: number; nextReplyCursor: string | null };

function initialsOf(name: string) {
  return name.trim().split(/\s+/u).slice(0, 2).map((part) => part[0] ?? '').join('') || 'ق';
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

function CommentAvatar({ name, image, size = 'md' }: { name: string; image: string | null; size?: 'sm' | 'md' }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ${size === 'sm' ? 'size-8 bg-[#edf4f8] text-xs text-[#0a4e75]' : 'size-10 bg-[#082F50] text-xs text-[#e8c96a]'}`} aria-hidden="true">
      {image && !imageFailed ? <Image src={image} alt="" fill sizes={size === 'sm' ? '32px' : '40px'} className="object-cover" unoptimized onError={() => setImageFailed(true)} /> : initialsOf(name)}
    </span>
  );
}

export default function CommentsSection({ entryId, slug, currentUser, initialComments, initialNextCursor, initialCommentCount, repliesEnabled }: {
  entryId: string;
  slug: string;
  currentUser: { id: string; name: string; image: string | null } | null;
  initialComments: Comment[];
  initialNextCursor: string | null;
  initialCommentCount: number;
  repliesEnabled: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [body, setBody] = useState('');
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplyIds, setExpandedReplyIds] = useState<string[]>([]);
  const [replyBody, setReplyBody] = useState('');
  const [replyError, setReplyError] = useState<string | null>(null);
  const [loadingRepliesFor, setLoadingRepliesFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [morePending, startMoreTransition] = useTransition();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/book/${slug}#document-discussion`)}`;

  const publish = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const result = await addDocumentCommentAction(entryId, body);
        if (!result.ok || !result.comment) {
          setError(result.requiresAuth ? 'سجّل الدخول لنشر تعليق.' : result.error ?? 'تعذر نشر التعليق. حاول مجددا.');
          return;
        }
        setComments((previous) => [{ ...result.comment!, mine: true, replies: [], replyCount: 0, nextReplyCursor: null }, ...previous]);
        setCommentCount((count) => count + 1);
        setBody('');
        setCommentFormOpen(false);
      } catch {
        setError('تعذر نشر التعليق. تحقق من اتصالك وحاول مجددا.');
      }
    });
  };

  const publishReply = (event: React.FormEvent, parentId: string) => {
    event.preventDefault();
    setReplyError(null);
    startTransition(async () => {
      try {
        const result = await addDocumentReplyAction(entryId, parentId, replyBody);
        if (!result.ok || !result.comment) {
          setReplyError(result.requiresAuth ? 'سجّل الدخول لنشر رد.' : result.error ?? 'تعذر نشر الرد. حاول مجددا.');
          return;
        }
        setComments((previous) => previous.map((comment) => comment.id === parentId
          ? { ...comment, replies: [{ ...result.comment!, mine: true }, ...comment.replies], replyCount: comment.replyCount + 1 }
          : comment));
        setCommentCount((count) => count + 1);
        setReplyBody('');
        setReplyingTo(null);
        setExpandedReplyIds((previous) => previous.includes(parentId) ? previous : [...previous, parentId]);
      } catch {
        setReplyError('تعذر نشر الرد. تحقق من اتصالك وحاول مجددا.');
      }
    });
  };

  const loadMore = () => {
    if (!nextCursor) return;
    startMoreTransition(async () => {
      try {
        const result = await moreDocumentCommentsAction(entryId, nextCursor);
        setComments((previous) => [...previous, ...result.comments.map((comment) => ({
          ...comment,
          mine: comment.userId === currentUser?.id,
          replies: comment.replies.map((reply) => ({ ...reply, mine: reply.userId === currentUser?.id })),
        }))]);
        setNextCursor(result.nextCursor);
      } catch {
        setError('تعذر تحميل المزيد من التعليقات. حاول مجددا.');
      }
    });
  };

  const loadMoreReplies = (parentId: string, cursor: string | null) => {
    setLoadingRepliesFor(parentId);
    startMoreTransition(async () => {
      try {
        const result = await moreDocumentRepliesAction(entryId, parentId, cursor ?? undefined);
        setComments((previous) => previous.map((comment) => comment.id === parentId
          ? {
              ...comment,
              replies: [...comment.replies, ...result.replies.filter((reply) => !comment.replies.some((loaded) => loaded.id === reply.id)).map((reply) => ({ ...reply, mine: reply.userId === currentUser?.id }))],
              nextReplyCursor: result.nextCursor,
            }
          : comment));
      } catch {
        setError('تعذر تحميل المزيد من الردود. حاول مجددا.');
      } finally {
        setLoadingRepliesFor(null);
      }
    });
  };

  const remove = (commentId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteDocumentCommentAction(entryId, commentId);
        if (!result.ok) {
          setError(result.error ?? 'تعذر حذف التعليق.');
          return;
        }
        if (result.parentId) {
          setComments((previous) => previous.map((comment) => {
            if (comment.id !== result.parentId) return comment;
            const replies = comment.replies.filter((reply) => reply.id !== commentId);
            return {
              ...comment,
              replies,
              replyCount: Math.max(0, comment.replyCount - 1),
              nextReplyCursor: comment.nextReplyCursor === commentId ? replies.at(-1)?.id ?? null : comment.nextReplyCursor,
            };
          }));
        } else {
          setComments((previous) => previous.filter((comment) => comment.id !== commentId));
          if (replyingTo === commentId) setReplyingTo(null);
        }
        setCommentCount((count) => Math.max(0, count - (result.deletedCount ?? 1)));
      } catch {
        setError('تعذر حذف التعليق. حاول مجددا.');
      }
    });
  };

  return (
    <section id="document-discussion" className="mt-16 scroll-mt-28 rounded-[24px] border border-[#e1e7ec] bg-white p-5 shadow-[0_18px_48px_rgba(8,47,80,0.06)] sm:p-7 md:p-8" aria-labelledby="discussion-heading">
      {currentUser ? (
        commentFormOpen ? (
          <form onSubmit={publish} className="rounded-2xl border border-[#dce5ec] bg-[#f8fafc] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <CommentAvatar name={currentUser.name} image={currentUser.image} />
              <label htmlFor="document-comment" className="text-sm font-semibold text-[#082F50]">تعليق جديد باسم {currentUser.name}</label>
            </div>
            <textarea id="document-comment" autoFocus value={body} onChange={(event) => setBody(event.target.value)} minLength={3} maxLength={1000} rows={3} placeholder="ما رأيك في هذا الكتاب؟" className="mt-3 block w-full resize-y rounded-lg border border-[#d7e0e7] bg-white px-4 py-3 text-sm leading-7 text-[#082F50] outline-none transition-colors placeholder:text-[#8995a1] focus:border-[#9a7421] focus:ring-2 focus:ring-[#c29c41]/20" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#667789]">{body.length}/1000</span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={isPending} onClick={() => { setCommentFormOpen(false); setBody(''); setError(null); }} className="min-h-10 cursor-pointer rounded-full px-4 text-sm font-medium text-[#516274] transition-colors hover:bg-[#e9eff3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-50">إلغاء</button>
                <button type="submit" disabled={isPending || body.trim().length < 3} className="min-h-10 cursor-pointer rounded-full bg-[#082F50] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#053D69] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:cursor-not-allowed disabled:opacity-50">{isPending ? 'جارٍ النشر...' : 'نشر التعليق'}</button>
              </div>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => { setError(null); setCommentFormOpen(true); }} className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-xl bg-[#082F50] px-4 py-3 text-start text-white shadow-sm transition-colors hover:bg-[#0A527E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421]">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#e8c96a]" aria-hidden="true"><HiOutlinePencilSquare className="size-5" /></span>
            <span className="flex flex-col gap-0.5"><span className="text-sm font-bold">اكتب تعليقاً</span><span className="text-xs text-[#d2dce5]">شارك رأيك حول هذا الكتاب</span></span>
          </button>
        )
      ) : (
        <Link href={loginHref} className="flex min-h-16 cursor-pointer items-center gap-3 rounded-xl bg-[#082F50] px-4 py-3 text-white shadow-sm transition-colors hover:bg-[#0A527E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421]"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#e8c96a]" aria-hidden="true"><HiOutlinePencilSquare className="size-5" /></span><span className="flex flex-col gap-0.5"><strong className="text-sm font-bold">اكتب تعليقاً</strong><span className="text-xs text-[#d2dce5]">سجّل الدخول للمشاركة</span></span></Link>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-7 flex items-center gap-2.5 border-t border-[#e7ebef] pt-6">
        <h2 id="discussion-heading" className="text-base font-bold text-[#082F50]">التعليقات</h2>
        <span className="text-xs font-bold text-[#082F50]" aria-label={`${commentCount.toLocaleString('ar')} تعليق`}>{commentCount.toLocaleString('ar')}</span>
      </div>

      {comments.length ? (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3 rounded-xl border border-[#dce5ec] bg-[#fbfcfd] p-4 shadow-[0_3px_12px_rgba(8,47,80,0.035)] sm:gap-4 sm:p-5">
              <CommentAvatar name={comment.name} image={comment.image} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1"><p className="text-sm font-bold text-[#082F50]">{comment.name}</p><time dateTime={comment.createdAt} className="text-xs text-[#566777]">{formattedDate(comment.createdAt)}</time></div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#344557]">{comment.body}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#dce5ec] pt-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    {repliesEnabled && (currentUser ? (
                      <button type="button" aria-expanded={replyingTo === comment.id} aria-label={`الرد على تعليق ${comment.name}`} disabled={isPending} onClick={() => { setReplyError(null); setReplyBody(''); setReplyingTo(replyingTo === comment.id ? null : comment.id); }} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#cddce6] bg-white px-3 font-semibold text-[#07577f] transition-colors hover:border-[#8db8d0] hover:bg-[#edf4f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-50"><HiOutlineChatBubbleLeftRight className="size-4" aria-hidden="true" />رد</button>
                    ) : (
                      <Link href={loginHref} aria-label={`سجّل الدخول للرد على تعليق ${comment.name}`} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#cddce6] bg-white px-3 font-semibold text-[#07577f] transition-colors hover:border-[#8db8d0] hover:bg-[#edf4f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421]"><HiOutlineChatBubbleLeftRight className="size-4" aria-hidden="true" />رد</Link>
                    ))}
                  </div>
                  {comment.mine && <button type="button" aria-label="حذف تعليقي" title="حذف تعليقي" disabled={isPending} onClick={() => remove(comment.id)} className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#082F50] bg-white px-3 font-semibold text-[#082F50] transition-colors hover:bg-[#eef3f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-50"><HiOutlineTrash className="size-4" aria-hidden="true" />حذف</button>}
                </div>

                {comment.replyCount > 0 && (
                  <button type="button" aria-expanded={expandedReplyIds.includes(comment.id)} onClick={() => setExpandedReplyIds((previous) => previous.includes(comment.id) ? previous.filter((id) => id !== comment.id) : [...previous, comment.id])} className="mt-3 flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-[#dce5ec] bg-white px-3 text-xs font-semibold text-[#07577f] transition-colors hover:bg-[#edf4f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421]">
                    <span>{expandedReplyIds.includes(comment.id) ? 'إخفاء' : 'عرض'} {comment.replyCount.toLocaleString('ar')} {comment.replyCount === 1 ? 'رد' : 'ردود'}</span>
                    <HiOutlineChevronDown className={`size-4 transition-transform ${expandedReplyIds.includes(comment.id) ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                )}

                {replyingTo === comment.id && (
                  <form onSubmit={(event) => publishReply(event, comment.id)} className="mt-3 rounded-xl border border-[#dce5ec] bg-[#f8fafc] p-4">
                    <label htmlFor={`reply-${comment.id}`} className="block text-sm font-semibold text-[#082F50]">الرد على {comment.name}</label>
                    <textarea id={`reply-${comment.id}`} autoFocus value={replyBody} onChange={(event) => setReplyBody(event.target.value)} minLength={3} maxLength={1000} rows={2} placeholder="اكتب ردك هنا..." className="mt-2 block w-full resize-y rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 text-sm leading-7 text-[#082F50] outline-none transition-colors placeholder:text-[#8995a1] focus:border-[#9a7421] focus:ring-2 focus:ring-[#c29c41]/20" />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-[#667789]">{replyBody.length}/1000</span>
                      <div className="flex items-center gap-3">
                        <button type="button" disabled={isPending} onClick={() => { setReplyingTo(null); setReplyBody(''); setReplyError(null); }} className="min-h-10 cursor-pointer rounded-full px-3 text-xs font-medium text-[#516274] transition-colors hover:bg-[#e9eff3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-50">إلغاء</button>
                        <button type="submit" disabled={isPending || replyBody.trim().length < 3} className="min-h-10 cursor-pointer rounded-full bg-[#082F50] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#053D69] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:cursor-not-allowed disabled:opacity-50">{isPending ? 'جارٍ النشر...' : 'نشر الرد'}</button>
                      </div>
                    </div>
                    {replyError && <p role="alert" className="mt-2 text-xs text-red-700">{replyError}</p>}
                  </form>
                )}

                {expandedReplyIds.includes(comment.id) && comment.replies.length > 0 && (
                  <ul aria-label={`ردود على تعليق ${comment.name}`} className="mt-4 space-y-4 ps-3 sm:ps-4">
                    {comment.replies.map((reply) => (
                      <li key={reply.id} className="flex gap-3">
                        <CommentAvatar name={reply.name} image={reply.image} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1"><p className="text-sm font-semibold text-[#082F50]">{reply.name}</p><time dateTime={reply.createdAt} className="text-xs text-[#657588]">{formattedDate(reply.createdAt)}</time></div>
                          <p className="mt-1 whitespace-pre-wrap break-words rounded-lg bg-white px-3 py-2 text-sm leading-6 text-[#344557]">{reply.body}</p>
                          {reply.mine && <div className="mt-1 flex justify-end"><button type="button" aria-label="حذف ردي" title="حذف ردي" disabled={isPending} onClick={() => remove(reply.id)} className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#082F50] bg-white px-3 text-xs font-semibold text-[#082F50] transition-colors hover:bg-[#eef3f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-50"><HiOutlineTrash className="size-4" aria-hidden="true" />حذف الرد</button></div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {expandedReplyIds.includes(comment.id) && comment.replyCount > comment.replies.length && <button type="button" disabled={morePending} onClick={() => loadMoreReplies(comment.id, comment.nextReplyCursor)} className="mt-3 min-h-9 cursor-pointer rounded-full px-3 text-xs font-semibold text-[#07577f] transition-colors hover:bg-[#edf4f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-60">{loadingRepliesFor === comment.id ? 'جارٍ التحميل...' : 'عرض المزيد من الردود'}</button>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="mt-7 text-sm text-[#627080]">لا توجد تعليقات بعد. كن أول من يشارك رأيه.</p>}
      {nextCursor && <button type="button" disabled={morePending} onClick={loadMore} className="mt-4 min-h-11 rounded-full border border-[#c29c41] px-6 text-sm font-medium text-[#082F50] hover:bg-[#f5efdf] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9a7421] disabled:opacity-60">{morePending ? 'جارٍ التحميل...' : 'عرض المزيد من التعليقات'}</button>}
    </section>
  );
}
