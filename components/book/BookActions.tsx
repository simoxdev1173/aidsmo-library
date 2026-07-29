'use client';

import { useEffect, useState } from 'react';
import { HiBookmark, HiOutlineBookmark, HiOutlineClipboardDocumentCheck, HiOutlineShare } from 'react-icons/hi2';
import { cn } from '@/utils/cn';

const STORAGE_KEY = 'aidsmo-bookmarks';

function readBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * There is no public account system in this app (only an admin login), so
 * "saved" entries live in this browser's localStorage rather than a user
 * record — a bookmark, not a synced library.
 */
export default function BookActions({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().includes(slug));
  }, [slug]);

  const toggleSaved = () => {
    const current = readBookmarks();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  };

  const share = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        return; // user cancelled the native share sheet — not an error
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — nothing more to do in that case
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={toggleSaved}
        aria-pressed={saved}
        className={cn(
          'inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border px-7 text-sm font-bold backdrop-blur-sm transition duration-200',
          saved
            ? 'border-[#C29C41] bg-[#C29C41]/15 text-[#E8C96A]'
            : 'border-white/25 bg-white/[0.06] text-white/90 hover:border-[#C29C41]/60 hover:text-[#E8C96A]',
        )}
      >
        {saved ? (
          <HiBookmark className="h-5 w-5 text-[#E8C96A]" />
        ) : (
          <HiOutlineBookmark className="h-5 w-5 text-[#E8C96A]" />
        )}
        {saved ? 'محفوظ' : 'حفظ'}
      </button>

      <button
        type="button"
        onClick={share}
        className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white/90 backdrop-blur-sm transition duration-200 hover:border-[#C29C41]/60 hover:text-[#E8C96A]"
      >
        {copied ? (
          <HiOutlineClipboardDocumentCheck className="h-5 w-5 text-[#4ade80]" />
        ) : (
          <HiOutlineShare className="h-5 w-5 text-[#E8C96A]" />
        )}
        {copied ? 'تم نسخ الرابط' : 'مشاركة'}
      </button>
    </div>
  );
}
