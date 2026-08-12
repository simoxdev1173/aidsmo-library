'use client';

import { useTranslations } from 'next-intl';

export default function TrendingIntro() {
  const t = useTranslations('trending');

  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
      <h2 className="academic-heading text-balance text-3xl leading-tight sm:text-4xl md:text-5xl">
        {t('heading')}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-pretty font-academic text-lg leading-relaxed text-[#475569] sm:text-xl">
        {t('subtitle')}
      </p>
    </div>
  );
}
