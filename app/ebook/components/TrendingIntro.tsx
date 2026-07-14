'use client';

import { useTranslations } from 'next-intl';

export default function TrendingIntro() {
  const t = useTranslations('trending');

  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <h2 className="academic-heading text-4xl leading-tight md:text-5xl">
        {t('heading')}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
        {t('subtitle')}
      </p>
    </div>
  );
}
