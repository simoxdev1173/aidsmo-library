'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import {
  HiBookmark,
  HiOutlineArrowPath,
  HiOutlineBookmark,
  HiOutlineClipboardDocumentCheck,
  HiOutlineLink,
  HiOutlineShare,
} from 'react-icons/hi2';
import { toggleSavedBookAction } from '@/lib/user-library-actions';
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function BookActions({
  entryId,
  title,
  initialSaved,
  isAuthenticated,
}: {
  entryId: string;
  title: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const redirectToLogin = () => {
    const { pathname, search, hash } = window.location;
    const callbackUrl = `${pathname}${search}${hash}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  const toggleSaved = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleSavedBookAction(entryId);
        if (result.requiresAuth) {
          redirectToLogin();
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setShareMessage('تم نسخ رابط الإصدار.');
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      setShareMessage('تعذر نسخ الرابط على هذا الجهاز.');
      return false;
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ url: shareUrl, title });
      setShareOpen(false);
    } catch {
      // Dismissing the device share sheet leaves this menu available.
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

        <Popover open={shareOpen} onOpenChange={(open) => {
          setShareOpen(open);
          if (open) {
            setShareUrl(window.location.href);
            setShareMessage(null);
          }
        }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="مشاركة الإصدار"
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white/90 backdrop-blur-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#E8C96A]"
            >
              <HiOutlineShare className="h-5 w-5 text-[#E8C96A]" aria-hidden="true" />
              مشاركة
            </button>
          </PopoverTrigger>
          <PopoverContent dir="rtl" align="start" className="w-64 p-3">
            <p className="px-2 pb-2 text-sm font-bold text-[#082F50]">شارك هذا الإصدار</p>
            <div className="space-y-1">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]"><FaFacebookF className="size-4 text-[#1877F2]" aria-hidden="true" />فيسبوك</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]"><FaWhatsapp className="size-4 text-[#128C7E]" aria-hidden="true" />واتساب</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]"><FaXTwitter className="size-4" aria-hidden="true" />إكس</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" onClick={() => { void copyLink().then((success) => { if (success) setShareMessage('تم نسخ الرابط. الصقه في قصتك أو رسالتك على إنستغرام.'); }); }} className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]"><FaInstagram className="size-4 text-[#C13584]" aria-hidden="true" /><span>إنستغرام <span className="text-xs font-normal text-[#64748B]">(نسخ الرابط)</span></span></a>
              <button type="button" onClick={() => { void copyLink(); }} className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-start text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]">{copied ? <HiOutlineClipboardDocumentCheck className="size-4 text-emerald-600" aria-hidden="true" /> : <HiOutlineLink className="size-4 text-[#8B681C]" aria-hidden="true" />}{copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}</button>
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && <button type="button" onClick={() => { void nativeShare(); }} className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-start text-sm font-semibold text-[#082F50] hover:bg-[#EFF5F9] focus-visible:outline-2 focus-visible:outline-[#C29C41]"><HiOutlineShare className="size-4 text-[#8B681C]" aria-hidden="true" />المزيد من التطبيقات</button>}
            </div>
            {shareMessage && <p role="status" className="mt-2 border-t border-[#E7ECF2] px-2 pt-2 text-xs text-[#475569]">{shareMessage}</p>}
          </PopoverContent>
        </Popover>
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-red-200">{error}</p>}
    </div>
  );
}
