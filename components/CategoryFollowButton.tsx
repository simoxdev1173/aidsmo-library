'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LuBellPlus, LuBellOff } from 'react-icons/lu';
import { setCategoryFollowAction } from '@/lib/notification-actions';

export default function CategoryFollowButton({ categoryId, initialFollowing, compact = false }: {
  categoryId: string;
  initialFollowing: boolean;
  compact?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" disabled={pending} aria-pressed={following} onClick={() => {
        setError('');
        startTransition(async () => {
          try {
            const result = await setCategoryFollowAction(categoryId, !following);
            if (result.requiresAuth) {
              router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
            } else if (result.ok) {
              setFollowing(result.following!);
              router.refresh();
            } else {
              setError('تعذر تحديث المتابعة. حاول مجدداً.');
            }
          } catch {
            setError('تعذر تحديث المتابعة. حاول مجدداً.');
          }
        });
      }} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] disabled:opacity-60 ${following ? 'border-[#C29C41] bg-[#FFF8E8] text-[#805E1B] hover:bg-[#F9EDCF]' : 'border-[#C29C41] bg-[#053D69] text-white hover:bg-[#0B5688]'}`}>
        {following ? <LuBellOff className="size-4" aria-hidden="true" /> : <LuBellPlus className="size-4" aria-hidden="true" />}
        {pending ? 'جارٍ التحديث...' : following ? (compact ? 'إلغاء المتابعة' : 'تتابع هذا التصنيف') : 'تابع التصنيف'}
      </button>
      {error && <span role="alert" className="text-xs text-red-700">{error}</span>}
    </span>
  );
}
