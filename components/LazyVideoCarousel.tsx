'use client';

import { lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useNearViewport } from '@/lib/use-near-viewport';

const VideoCarousel = lazy(() => import('@/components/VideoCarousel'));

function VideoPlaceholder({ onOpen }: { onOpen?: () => void }) {
  const t = useTranslations('videos');

  return (
    <div className="flex min-h-[44rem] items-center justify-center bg-[#382715] px-4 sm:min-h-[40rem]">
      <div className="w-full max-w-5xl rounded-[18px] border border-[#C6A346]/35 bg-[#fffdf8] px-6 py-12 text-center shadow-[0_22px_58px_rgba(10,37,64,0.16)]">
        <h2 className="text-2xl font-medium text-[#003652]">{t('heading')}</h2>
        <p className="mt-3 text-sm text-[#475569]">{t('subtitle')}</p>
        {onOpen && (
          <button type="button" onClick={onOpen} className="mt-6 min-h-11 rounded-full bg-[#0A2540] px-6 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">
            {t('carouselLabel')}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LazyVideoCarousel() {
  const { ref, isNear, activate } = useNearViewport<HTMLDivElement>('600px 0px');

  return (
    <div ref={ref}>
      {isNear ? (
        <Suspense fallback={<VideoPlaceholder />}>
          <VideoCarousel />
        </Suspense>
      ) : (
        <VideoPlaceholder onOpen={activate} />
      )}
    </div>
  );
}
