'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { HiOutlineChatBubbleLeftRight, HiOutlineEye, HiStar, HiOutlineStar } from 'react-icons/hi2';
import {
  addDocumentCommentAction,
  deleteDocumentCommentAction,
  moreDocumentCommentsAction,
  rateDocumentAction,
  registerDocumentViewAction,
} from '@/lib/document-engagement-actions';

type Comment = { id: string; name: string; body: string; createdAt: string; mine: boolean };

function initialsOf(name: string) {
  return name.trim().split(/\s+/u).slice(0, 2).map((part) => part[0] ?? '').join('') || 'ق';
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

export default function CommentsSection({ entryId, slug, currentUser, initialComments, initialNextCursor, initialCommentCount, initialViewCount, initialRatingCount, initialAverageRating, initialUserRating }: {
  entryId: string;
  slug: string;
  currentUser: { id: string; name: string } | null;
  initialComments: Comment[];
  initialNextCursor: string | null;
  initialCommentCount: number;
  initialViewCount: number;
  initialRatingCount: number;
  initialAverageRating: number;
  initialUserRating: number | null;
}) {
  const [comments, setComments] = useState(initialComments);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [ratingPending, startRatingTransition] = useTransition();
  const [morePending, startMoreTransition] = useTransition();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/book/${slug}#document-discussion`)}`;

  useEffect(() => {
    let active = true;
    void registerDocumentViewAction(entryId).then((result) => {
      if (active && result.ok) setViewCount(result.count);
    }).catch(() => { /* Keep the last known count if tracking is unavailable. */ });
    return () => { active = false; };
  }, [entryId]);

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
        setComments((previous) => [{ ...result.comment!, mine: true }, ...previous]);
        setCommentCount((count) => count + 1);
        setBody('');
      } catch {
        setError('تعذر نشر التعليق. تحقق من اتصالك وحاول مجددا.');
      }
    });
  };

  const rate = (value: number) => {
    setRatingError(null);
    startRatingTransition(async () => {
      try {
        const result = await rateDocumentAction(entryId, value);
        if (!result.ok) {
          setRatingError(result.requiresAuth ? 'سجّل الدخول لتقييم الوثيقة.' : result.error ?? 'تعذر حفظ التقييم.');
          return;
        }
        setUserRating(result.value ?? value);
        setAverageRating(result.average ?? 0);
        setRatingCount(result.count ?? 0);
      } catch {
        setRatingError('تعذر حفظ التقييم. حاول مجددا.');
      }
    });
  };

  const loadMore = () => {
    if (!nextCursor) return;
    startMoreTransition(async () => {
      try {
        const result = await moreDocumentCommentsAction(entryId, nextCursor);
        setComments((previous) => [...previous, ...result.comments.map((comment) => ({ ...comment, mine: comment.userId === currentUser?.id }))]);
        setNextCursor(result.nextCursor);
      } catch {
        setError('تعذر تحميل المزيد من التعليقات. حاول مجددا.');
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
        setComments((previous) => previous.filter((comment) => comment.id !== commentId));
        setCommentCount((count) => Math.max(0, count - 1));
      } catch {
        setError('تعذر حذف التعليق. حاول مجددا.');
      }
    });
  };

  return (
    <section id="document-discussion" className="mt-16 scroll-mt-28 rounded-[24px] border border-[#e8dfcb] bg-[#fffdf8] p-6 shadow-[0_18px_48px_rgba(10,37,64,0.06)] md:p-8" aria-labelledby="discussion-heading">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#e8dfcb] pb-7">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a2540] text-[#e8c96a]" aria-hidden="true"><HiOutlineChatBubbleLeftRight className="h-5 w-5" /></span>
          <div>
            <h2 id="discussion-heading" className="text-xl font-medium text-[#0a2540]">آراء القراء</h2>
            <p className="mt-1 text-sm text-[#627080]">{commentCount.toLocaleString('ar')} {commentCount === 1 ? 'تعليق' : 'تعليقات'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#526072]">
          <span className="inline-flex items-center gap-2"><HiOutlineEye className="h-5 w-5 text-[#9a7421]" aria-hidden="true" />{viewCount.toLocaleString('ar')} مشاهدة</span>
          <span className="inline-flex items-center gap-2"><HiStar className="h-5 w-5 text-[#c29c41]" aria-hidden="true" />{ratingCount ? `${averageRating.toFixed(1)} من 5` : 'لم يُقيّم بعد'} <span className="text-xs text-[#78828a]">({ratingCount.toLocaleString('ar')})</span></span>
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-[#f5efdf] px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h3 className="text-base font-medium text-[#0a2540]">قيّم هذه الوثيقة</h3>
          <p className="mt-1 text-xs text-[#59616a]">{userRating ? 'يمكنك تغيير تقييمك في أي وقت.' : 'اختر من نجمة إلى خمس نجوم.'}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-1 sm:mt-0" role="group" aria-label="تقييم الوثيقة">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" disabled={ratingPending} onClick={() => rate(value)} aria-label={`تقييم ${value} ${value === 1 ? 'نجمة' : 'نجوم'}`} aria-pressed={userRating === value} className="grid h-11 w-11 place-items-center rounded-lg text-[#b58c2d] transition hover:bg-[#e9ddc2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421] disabled:opacity-60">
              {value <= (userRating ?? 0) ? <HiStar className="h-7 w-7" aria-hidden="true" /> : <HiOutlineStar className="h-7 w-7" aria-hidden="true" />}
            </button>
          ))}
        </div>
        {!currentUser && <Link href={loginHref} className="mt-3 inline-block text-xs font-medium text-[#805e1b] underline-offset-4 hover:underline sm:mt-0">سجّل الدخول للتقييم</Link>}
      </div>
      {ratingError && <p role="alert" className="mt-3 text-sm text-red-700">{ratingError}</p>}

      {currentUser ? (
        <form onSubmit={publish} className="mt-7">
          <label htmlFor="document-comment" className="text-sm font-medium text-[#0a2540]">اكتب تعليقا باسم {currentUser.name}</label>
          <textarea id="document-comment" value={body} onChange={(event) => setBody(event.target.value)} minLength={3} maxLength={1000} rows={3} placeholder="ما رأيك في هذه الوثيقة؟" className="mt-3 block w-full resize-y rounded-xl border border-[#dfd2b9] bg-white px-4 py-3 text-sm leading-7 text-[#0a2540] outline-none focus:border-[#9a7421] focus:ring-2 focus:ring-[#c29c41]/20" />
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-[#78828a]">{body.length}/1000</span>
            <button type="submit" disabled={isPending || body.trim().length < 3} className="min-h-11 rounded-full bg-[#0a2540] px-6 text-sm font-medium text-white transition hover:bg-[#003652] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9a7421] disabled:cursor-not-allowed disabled:opacity-50">{isPending ? 'جارٍ النشر...' : 'نشر التعليق'}</button>
          </div>
        </form>
      ) : (
        <p className="mt-7 rounded-xl border border-[#e8dfcb] bg-[#faf7ef] p-5 text-sm text-[#344557]"><Link href={loginHref} className="font-medium text-[#805e1b] underline-offset-4 hover:underline">سجّل الدخول</Link> للمشاركة بتعليقك.</p>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

      {comments.length ? (
        <ul className="mt-7 divide-y divide-[#e8dfcb]">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3 py-5 first:pt-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a2540] text-xs font-medium text-[#e8c96a]" aria-hidden="true">{initialsOf(comment.name)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><p className="text-sm font-medium text-[#0a2540]">{comment.name}</p><time dateTime={comment.createdAt} className="text-xs text-[#78828a]">{formattedDate(comment.createdAt)}</time></div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#344557]">{comment.body}</p>
                {comment.mine && <button type="button" disabled={isPending} onClick={() => remove(comment.id)} className="mt-2 min-h-9 text-xs text-[#805e1b] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7421]">حذف تعليقي</button>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="mt-7 text-sm text-[#627080]">لا توجد تعليقات بعد. كن أول من يشارك رأيه.</p>}
      {nextCursor && <button type="button" disabled={morePending} onClick={loadMore} className="mt-4 min-h-11 rounded-full border border-[#c29c41] px-6 text-sm font-medium text-[#0a2540] hover:bg-[#f5efdf] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9a7421] disabled:opacity-60">{morePending ? 'جارٍ التحميل...' : 'عرض المزيد من التعليقات'}</button>}
    </section>
  );
}
