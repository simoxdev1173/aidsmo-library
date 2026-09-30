'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { HiOutlineDocumentDuplicate, HiOutlineBeaker, HiOutlineAcademicCap, HiOutlineNewspaper, HiOutlineChartBar, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './LibraryStats.module.css';

type LibraryStatsData = {
  magazines: number;
  books: number;
  studies: number;
  reports: number;
  scientificPapers: number;
  numberedPapers: number;
  memorandums: number;
};

type StatKey = Exclude<keyof LibraryStatsData, 'books'>;
const statKeys: StatKey[] = ['numberedPapers', 'scientificPapers', 'studies', 'magazines', 'reports', 'memorandums'];
const formatNumber = (value: number) => value.toLocaleString('en-US');
const statIcons = {
  numberedPapers: HiOutlineDocumentDuplicate,
  scientificPapers: HiOutlineAcademicCap,
  studies: HiOutlineBeaker,
  magazines: HiOutlineNewspaper,
  reports: HiOutlineChartBar,
  memorandums: HiOutlineGlobeAlt,
};

function Stat({ value, label, statKey }: { value: number; label: string; statKey: StatKey }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const Icon = statIcons[statKey];

  useEffect(() => {
    const item = itemRef.current;
    const number = numberRef.current;
    if (!item || !number) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      item.dataset.revealed = 'true';
      number.textContent = formatNumber(value);
    };
    if (preference.matches || !('IntersectionObserver' in window)) {
      finish();
      return;
    }
    item.dataset.revealed = 'false';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer?.disconnect();
      item.dataset.revealed = 'true';
      let start: number | undefined;
      const tick = (time: number) => {
        start ??= time;
        const progress = Math.min((time - start) / 1800, 1);
        number.textContent = formatNumber(Math.round(value * (1 - Math.pow(1 - progress, 4))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    observer.observe(item);
    const handlePreference = () => {
      if (preference.matches) {
        observer.disconnect();
        finish();
      }
    };
    preference.addEventListener('change', handlePreference);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      preference.removeEventListener('change', handlePreference);
    };
  }, [value]);

  return (
    <div ref={itemRef} className={styles.stat} data-kind={statKey}>
      <dt className={styles.label}>
        <Icon className={styles.icon} aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className={styles.value}>
        <span className="sr-only">+{formatNumber(value)}</span>
        <span className={styles.numberLine} dir="ltr" aria-hidden="true">
          <span ref={numberRef}>{formatNumber(value)}</span>
          <span className={styles.plus}>+</span>
        </span>
      </dd>
      <div className={styles.binding} aria-hidden="true"><span /><span /><span /></div>
    </div>
  );
}

export default function LibraryStats({ stats }: { stats: LibraryStatsData }) {
  const t = useTranslations('stats');
  const { locale } = useAppLocale();

  return (
    <section className={styles.section} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="library-stats-heading">
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id="library-stats-heading" className={styles.heading}>{t('heading')}</h2>
        </header>
        <div className={styles.rail} role="region" aria-labelledby="library-stats-heading" tabIndex={0}>
          <dl className={styles.grid}>
            {statKeys.map((key) => <Stat key={key} statKey={key} value={stats[key]} label={t(key)} />)}
          </dl>
        </div>
      </div>
    </section>
  );
}
