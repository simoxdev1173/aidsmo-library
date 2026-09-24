'use client';

import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './TrendingShelves.module.css';

export default function TrendingIntro({ shelfIds }: { shelfIds: string[] }) {
  const t = useTranslations('trending');
  const { locale } = useAppLocale();

  return (
    <div className={styles.intro} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className={styles.heading}>
        {t('heading')}
      </h2>
      <p className={styles.subtitle}>
        {t('subtitle')}
      </p>
      <nav className={styles.shortcuts} aria-label={t('browseSectors')}>
        {shelfIds.map((id) => <a key={id} href={`#shelf-${id}`}>{t(`sectors.${id}`)}</a>)}
      </nav>
    </div>
  );
}
