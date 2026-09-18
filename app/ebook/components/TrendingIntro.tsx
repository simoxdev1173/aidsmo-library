'use client';

import { useTranslations } from 'next-intl';

export default function TrendingIntro() {
  const t = useTranslations('trending');

  return (
    <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
      <h2 className="academic-heading text-balance text-2xl leading-tight sm:text-3xl lg:text-4xl">
        {t('heading')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty font-academic text-base leading-relaxed text-[#475569] sm:text-lg">
        {t('subtitle')}
      </p>
    </div>
  );
}
