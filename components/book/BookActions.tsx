'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiBookmark,
  HiOutlineArrowPath,
  HiOutlineBookmark,
  HiOutlineClipboardDocumentCheck,
  HiOutlineShare,
} from 'react-icons/hi2';
import { toggleSavedBookAction } from '@/lib/user-library-actions';
import { cn } from '@/utils/cn';

export default function BookActions({
  entryId,
  slug,
  initialSaved,
  isAuthenticated,
}: {
  entryId: string;
  slug: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleSaved = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/book/${slug}`)}`);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleSavedBookAction(entryId);
        if (result.requiresAuth) {
          router.push(`/login?callbackUrl=${encodeURIComponent(`/book/${slug}`)}`);
          return;
        }
        if (!result.ok) {
          setError(result.error ?? 'تعذر حفظ الكتاب. حاول مرة أخرى.');
          return;
        }
        setSaved(Boolean(result.saved));
        router.refresh();
      } catch {
        setError('تعذر حفظ الكتاب. تحقق من اتصالك وحاول مرة أخرى.');
      }
    });
  };

  const share = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch {
        // Closing the native share sheet is an intentional user action.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('تعذر نسخ الرابط على هذا الجهاز.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={toggleSaved}
          disabled={isPending}
          aria-pressed={saved}
          className={cn(
            'inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border px-7 text-sm font-bold backdrop-blur-sm transition duration-200 disabled:cursor-wait disabled:opacity-65',
            saved
              ? 'border-[#C29C41] bg-[#C29C41]/15 text-[#E8C96A]'
              : 'border-white/25 bg-white/[0.06] text-white/90 hover:border-[#C29C41]/60 hover:text-[#E8C96A]',
          )}
        >
          {isPending ? <HiOutlineArrowPath className="h-5 w-5 animate-spin" /> : saved ? <HiBookmark className="h-5 w-5 text-[#E8C96A]" /> : <HiOutlineBookmark className="h-5 w-5 text-[#E8C96A]" />}
          {isPending ? 'جارٍ الحفظ...' : saved ? 'محفوظ في مكتبتي' : 'حفظ في مكتبتي'}
        </button>

        <button
          type="button"
          onClick={share}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white/90 backdrop-blur-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#E8C96A]"
        >
          {copied ? <HiOutlineClipboardDocumentCheck className="h-5 w-5 text-[#4ade80]" /> : <HiOutlineShare className="h-5 w-5 text-[#E8C96A]" />}
          {copied ? 'تم نسخ الرابط' : 'مشاركة'}
        </button>
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-red-200">{error}</p>}
    </div>
  );
}
