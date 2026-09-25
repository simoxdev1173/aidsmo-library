'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LuChevronLeft, LuChevronRight, LuPlay } from 'react-icons/lu';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './VideoCarousel.module.css';

const videos = [
  { id: 'Ccjv48W8mLQ', titleAr: 'فيديو ترويجي للمنظمة العربية للتنمية الصناعية والتقييس والتعدين', titleEn: 'Introducing the Arab Industrial Development, Standardization and Mining Organization' },
  { id: '4t3-cEkVyqg', titleAr: 'دليل إضافة المنتجات مجانا داخل منصة APIP.online', titleEn: 'How to add products to APIP.online for free' },
  { id: 'RaO0_lbLqLg', titleAr: 'APIP.online Platform presentation', titleEn: 'APIP.online platform presentation' },
  { id: '8UMN3Q1waZY', titleAr: 'الفيديو الترويجي للمنصة العربية لمعادن المستقبل', titleEn: 'Introducing the Arab Future Minerals Platform' },
  { id: 'Sd_NYSIrcBg', titleAr: 'فيديو إطلاق المنصة العربية لمعادن المستقبل', titleEn: 'Launch of the Arab Future Minerals Platform' },
  { id: '-VhO3fZg-i8', titleAr: 'المنصة العربية لمعادن المستقبل', titleEn: 'The Arab Future Minerals Platform' },
  { id: 'V365bLTljl0', titleAr: 'الفيديو التعريفي للمعهد', titleEn: 'Introducing the institute' },
] as const;

function VideoImage({ id, large = false }: { id: string; large?: boolean }) {
  const [useStandard, setUseStandard] = useState(!large);
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={styles.imageFallback} aria-hidden="true" />;
  return (
    <Image src={`https://img.youtube.com/vi/${id}/${useStandard ? 'hqdefault' : 'maxresdefault'}.jpg`} alt="" fill unoptimized
      className={styles.thumbnail}
      onLoad={(event) => { if (!useStandard && event.currentTarget.naturalWidth < 320) setUseStandard(true); }}
      onError={() => { if (!useStandard) setUseStandard(true); else setFailed(true); }} />
  );
}

export default function VideoCarousel() {
  const t = useTranslations('videos');
  const { locale } = useAppLocale();
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const selectionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const video = videos[selected];
  const title = locale === 'ar' ? video.titleAr : video.titleEn;

  const selectVideo = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(videos.length - 1, index));
    if (next !== selected) { setSelected(next); setPlaying(false); }
    const target = selectionRefs.current[next];
    if (focus) target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest', inline: 'nearest' });
  };

  return (
    <section id="library-videos" dir={locale === 'ar' ? 'rtl' : 'ltr'} className={styles.section} aria-labelledby="library-videos-heading">
      <Image src="/standardization-bg.png" alt="" fill sizes="100vw" className={styles.background} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 id="library-videos-heading" className={styles.heading}>{t('heading')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
          <div className={styles.controls}>
            <span className={styles.range}><bdi>{selected + 1}</bdi> {t('rangeOf')} {videos.length}</span>
            <button type="button" onClick={() => selectVideo(selected - 1)} disabled={selected === 0} aria-label={t('prevAria')}>{locale === 'ar' ? <LuChevronRight /> : <LuChevronLeft />}</button>
            <button type="button" onClick={() => selectVideo(selected + 1)} disabled={selected === videos.length - 1} aria-label={t('nextAria')}>{locale === 'ar' ? <LuChevronLeft /> : <LuChevronRight />}</button>
          </div>
        </header>

        <div className={styles.feature}>
          <div className={styles.screen}>
            {playing ? (
              <iframe key={video.id} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className={styles.player} />
            ) : (
              <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`${t('playVideo')}: ${title}`}>
                <VideoImage key={video.id} id={video.id} large />
                <span className={styles.playRing}><LuPlay aria-hidden="true" fill="currentColor" /></span>
                <span className={styles.posterLabel}>{t('playVideo')}</span>
              </button>
            )}
          </div>
          <div className={styles.featureInfo}>
            <div className={styles.featureCover} aria-hidden="true"><VideoImage key={video.id} id={video.id} large /></div>
            <h3 className={styles.featureTitle} aria-live="polite">{title}</h3>
            <div className={styles.featureActions}>
              <button type="button" onClick={() => setPlaying((value) => !value)} className={styles.primaryAction}>
                {playing ? t('closeVideo') : t('playVideo')}
              </button>
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className={styles.watchLink}>{t('watchOnYoutube')}</a>
            </div>
          </div>
        </div>

        <div className={styles.selectionHeader}><span>{t('carouselLabel')}</span><span className={styles.selectionLine} aria-hidden="true" /></div>
        <div className={styles.filmstrip} role="group" aria-label={t('carouselLabel')}>
          {videos.map((item, index) => {
            const itemTitle = locale === 'ar' ? item.titleAr : item.titleEn;
            return (
              <button key={item.id} ref={(node) => { selectionRefs.current[index] = node; }} type="button" className={styles.selection}
                aria-pressed={selected === index} onClick={() => selectVideo(index)}
                onKeyDown={(event) => {
                  const forward = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight';
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); selectVideo(index + (event.key === forward ? 1 : -1), true); }
                  if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectVideo(event.key === 'Home' ? 0 : videos.length - 1, true); }
                }}>
                <span className={styles.selectionImage}><VideoImage id={item.id} /><span className={styles.selectionIndicator}><LuPlay aria-hidden="true" fill="currentColor" /></span></span>
                <span className={styles.selectionTitle}>{itemTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
