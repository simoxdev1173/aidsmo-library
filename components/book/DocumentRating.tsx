'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { HiOutlineEye, HiOutlineStar, HiStar } from 'react-icons/hi2';
import { rateDocumentAction, registerDocumentViewAction } from '@/lib/document-engagement-actions';

export default function DocumentRating({ entryId, slug, initialCount, initialAverage, initialUserRating, initialViewCount, isAuthenticated }: {
  entryId: string;
  slug: string;
  initialCount: number;
  initialAverage: number;
  initialUserRating: number | null;
  initialViewCount: number;
  isAuthenticated: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [average, setAverage] = useState(initialAverage);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/book/${slug}#document-rating`)}`;

  useEffect(() => {
    let active = true;
    void registerDocumentViewAction(entryId).then((result) => {
      if (active && result.ok) setViewCount(result.count);
    }).catch(() => { /* Keep the last known count if tracking is unavailable. */ });
    return () => { active = false; };
  }, [entryId]);

  const rate = (value: number) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await rateDocumentAction(entryId, value);
        if (!result.ok) {
          setError(result.requiresAuth ? 'سجّل الدخول لتقييم الوثيقة.' : result.error ?? 'تعذر حفظ التقييم.');
          return;
        }
        setUserRating(result.value ?? value);
        setAverage(result.average ?? 0);
        setCount(result.count ?? 0);
      } catch {
        setError('تعذر حفظ التقييم. حاول مجددا.');
      }
    });
  };

  return (
    <div id="document-rating" className="mt-5 inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm scroll-mt-32">
      <span className="inline-flex items-center gap-2 text-sm text-white/85">
        <HiOutlineEye className="h-5 w-5 text-[#E8C96A]" aria-hidden="true" />
        {viewCount.toLocaleString('ar')} مشاهدة
      </span>
      <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden="true" />
      <span className="inline-flex items-center gap-2 text-sm font-bold">
        <HiStar className="h-5 w-5 text-[#E8C96A]" aria-hidden="true" />
        {count ? `${average.toFixed(1)} من 5` : 'لم يُقيّم بعد'}
        <span className="text-xs font-normal text-white/70">({count.toLocaleString('ar')})</span>
      </span>
      <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden="true" />
      <div className="flex items-center gap-0.5" role="group" aria-label="تقييم الوثيقة">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={isPending}
            onClick={() => rate(value)}
            aria-label={`تقييم ${value} ${value === 1 ? 'نجمة' : 'نجوم'}`}
            aria-pressed={userRating === value}
            className="grid h-10 w-10 place-items-center rounded-lg text-[#E8C96A] transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C96A] disabled:opacity-60"
          >
            {value <= (userRating ?? 0) ? <HiStar className="h-6 w-6" aria-hidden="true" /> : <HiOutlineStar className="h-6 w-6" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {!isAuthenticated && <Link href={loginHref} className="text-xs font-bold text-[#E8C96A] underline-offset-4 hover:underline">سجّل الدخول للتقييم</Link>}
      {error && <p role="alert" className="w-full text-xs text-red-200">{error}</p>}
    </div>
  );
}
