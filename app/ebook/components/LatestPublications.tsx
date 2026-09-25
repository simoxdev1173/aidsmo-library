'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LuArrowUpLeft } from 'react-icons/lu';
import { Book } from './subComponents/Book';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './LatestPublications.module.css';

const publications = [
  {
    id: 'industry-magazine-88',
    titleKey: 'book1Title',
    categoryKey: 'book1Category',
    cover: '/industry-covers/b-3.jpg',
    inside: '/latest-cover/previews/industry-88-1.webp',
    preview: '/latest-cover/previews/industry-88-2.webp',
    year: '2025',
    color: '#0a2540',
    href: '/catalog/industry',
  },
  {
    id: 'conformity-guide',
    titleKey: 'book2Title',
    categoryKey: 'book2Category',
    cover: '/latest-cover/b-4.png',
    inside: '/latest-cover/previews/conformity-guide-1.webp',
    preview: '/latest-cover/previews/conformity-guide-2.webp',
    year: '2026',
    color: '#003652',
    href: '/book/الدليل-الا-رشادي-العربي-لنماذج-تقييم-المطابقة',
  },
  {
    id: 'mine-rehabilitation',
    titleKey: 'book3Title',
    categoryKey: 'book3Category',
    cover: '/latest-cover/b-1.png',
    inside: '/latest-cover/previews/mine-rehabilitation-1.webp',
    preview: '/latest-cover/previews/mine-rehabilitation-2.webp',
    year: '2026',
    color: '#005b58',
    href: '/catalog/mining',
  },
] as const;

export default function LatestPublications() {
  const t = useTranslations('latestPublications');
  const { locale } = useAppLocale();

  return (
    <section id="latest-publications" className={styles.section} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="latest-publications-heading">
      <div className={styles.container}>
        <header className={styles.intro}>
          <h2 id="latest-publications-heading" className={styles.heading}>{t('heading')}</h2>
          <p className={styles.subtitle}>{t('previewHint')}</p>
        </header>

        <div className={styles.grid}>
          {publications.map((publication) => {
            const title = t(publication.titleKey);
            const category = t(publication.categoryKey);
            return (
              <article key={publication.id} className={styles.item}>
                <div className={styles.stage}>
                  <Book
                    title={title}
                    openLabel={t('openPreview')}
                    closeLabel={t('closePreview')}
                    rtl={locale === 'ar'}
                    color={publication.color}
                    cover={<Image src={publication.cover} alt="" width={420} height={630} className={styles.coverImage} sizes="(max-width: 640px) 192px, 212px" />}
                    backOfCover={<Image src={publication.inside} alt="" width={900} height={1273} className={styles.coverImage} sizes="212px" />}
                    content={
                      <Image src={publication.preview} alt="" width={420} height={630} className={styles.coverImage} sizes="(max-width: 640px) 192px, 212px" />
                    }
                  />
                </div>
                <div className={styles.details}>
                  <p className={styles.category}>{category} <span aria-hidden="true">·</span> <bdi>{publication.year}</bdi></p>
                  <h3 className={styles.title}>{title}</h3>
                  <Link href={publication.href} className={styles.link}>
                    {t('browsePublication')}<LuArrowUpLeft aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
