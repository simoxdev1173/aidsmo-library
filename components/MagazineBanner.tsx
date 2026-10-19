'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './MagazineBanner.module.css';

const copy = {
  ar: {
    eyebrow: 'مكتبتك الخاصة',
    title: 'اجمع ما يهمك في مكان واحد.',
    description: 'احفظ الإصدارات التي تهمك، ونظّمها في رفوفك الخاصة، وتابع ما تقرؤه وقتما تشاء.',
    action: 'افتح مكتبتي',
  },
  en: {
    eyebrow: 'YOUR PERSONAL LIBRARY',
    title: 'Keep what matters in one place.',
    description: 'Save publications, organize your own shelves, and keep track of what you are reading.',
    action: 'Open my library',
  },
} as const;

export default function MagazineBanner() {
  const { locale } = useAppLocale();
  const content = copy[locale];

  return (
    <section className={styles.banner} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="magazine-banner-title">
      <div className={`${styles.book} ${styles.bookLeft}`} aria-hidden="true">
        <div className={styles.cover}>
          <Image src="/bookCovers/i-1.png" alt="" fill sizes="(max-width: 640px) 110px, 190px" className={styles.coverImage} />
        </div>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="magazine-banner-title" className={styles.title}>{content.title}</h2>
        <p className={styles.description}>{content.description}</p>
        <Link href="/library" className={styles.action}>
          <span>{content.action}</span>
          <LuArrowLeft aria-hidden="true" className={locale === 'en' ? styles.arrowReverse : undefined} />
        </Link>
      </div>

      <div className={`${styles.book} ${styles.bookRight}`} aria-hidden="true">
        <div className={styles.cover}>
          <Image src="/bookCovers/i-2-1.png" alt="" fill sizes="(max-width: 640px) 110px, 190px" className={styles.coverImage} />
        </div>
      </div>
    </section>
  );
}
