'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LuChevronLeft } from 'react-icons/lu';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import styles from './LibraryServices.module.css';

const primaryButton =
  'inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-full border border-[#b88e36] bg-[#e8c96a] px-5 py-2.5 text-center text-[0.8rem] font-medium text-[#0A2540] shadow-[0_7px_18px_rgba(10,37,64,0.12)] sm:px-6';

const darkButton =
  'inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-full border border-[#e8c96a]/65 bg-white/10 px-5 py-2.5 text-center text-[0.8rem] font-medium text-white backdrop-blur-sm sm:px-6';

const LibraryNews = () => {
  const t = useTranslations('services');
  const { locale } = useAppLocale();

  return (
    <section
      id="library-services"
      className="relative overflow-hidden bg-[#F7F0E1] py-16 sm:py-20 lg:py-24"
      aria-label={t('heading')}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Image
        src="/background-01.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.28] contrast-110 saturate-110"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,225,0.94)_0%,rgba(247,240,225,0.82)_48%,rgba(247,240,225,0.96)_100%)]"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 h-px bg-[#C29C41]/35" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <h2 className="text-balance text-[1.7rem] font-medium leading-[1.6] text-[#0A2540] sm:text-[2rem] lg:text-[2.4rem]">
            {t('heading')}
          </h2>

          <p className="mt-3 max-w-xl text-pretty text-sm leading-[1.9] text-[#59616a] sm:text-[0.95rem]">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-4 lg:auto-rows-[205px] lg:grid-cols-3">
          {/* Big parchment card */}
          <Link
            href="#latest-pub"
            className={`${styles.card} group flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#C29C41]/35 bg-[#fffcf4]/95 p-6 shadow-[0_14px_36px_rgba(10,37,64,0.07)] backdrop-blur-sm sm:p-7 lg:row-span-2`}
          >
            <div>
              <p className="text-xs font-medium text-[#805e1b]">
                {t('latestKicker')}
              </p>

              <h3 className="mt-4 max-w-md text-xl font-medium leading-[1.7] text-[#0A2540] sm:text-[1.45rem]">
                {t('latestTitle')}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-[1.9] text-[#59616a]">
                {t('latestDesc')}
              </p>
            </div>

            <span className={`${primaryButton} mt-7 w-fit`}>
              {t('viewPublications')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </Link>

          {/* Top image card */}
          <Link
            href="/catalog/industry"
            className={`${styles.card} group min-h-[210px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/industry-informations-bg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,37,64,0.12)_0%,rgba(10,37,64,0.55)_50%,rgba(10,37,64,0.9)_100%)]" aria-hidden="true" />

            <div className="absolute inset-x-6 bottom-6 text-start">
              <p className="text-xs font-medium text-[#E8C96A]">
                {t('browseByFieldKicker')}
              </p>

              <p className="mt-2 max-w-xs text-lg font-medium leading-[1.7] text-white">
                {t('browseByFieldTitle')}
              </p>
            </div>
          </Link>

          {/* Smart assistant card */}
          <Link
            href="#chatbot"
            className={`${styles.card} group flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] p-6 text-white shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:p-7 lg:row-span-2`}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(232,201,106,0.14),transparent_34%)]"
              aria-hidden
            />

            <div className="relative z-10">
              <p className="text-xs font-medium text-[#E8C96A]">
                {t('assistantKicker')}
              </p>

              <h3 className="mt-4 max-w-md text-xl font-medium leading-[1.7] text-white sm:text-[1.45rem]">
                {t('assistantTitle')}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-[1.9] text-white/75">
                {t('assistantDesc')}
              </p>
            </div>

            <span className={`${primaryButton} relative z-10 mt-7 w-fit`}>
              {t('askAssistant')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </Link>

          {/* Main blue sector card */}
          <Link
            href="/catalog/standardization"
            className={`${styles.card} group flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#003652] p-6 text-white shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:p-7 lg:row-span-2`}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(232,201,106,0.13),transparent_36%)]"
              aria-hidden
            />

            <div className="relative z-10">
              <p className="text-xs font-medium text-[#E8C96A]">
                {t('sectorsKicker')}
              </p>

              <h3 className="mt-4 max-w-lg text-xl font-medium leading-[1.7] text-white sm:text-[1.45rem]">
                {t('sectorsTitle')}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-[1.9] text-white/75">
                {t('sectorsDesc')}
              </p>
            </div>

            <span className={`${darkButton} relative z-10 mt-7 w-fit`}>
              {t('startBrowsing')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/mining"
            className={`${styles.card} group min-h-[210px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/industry-bg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/35 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-6 bottom-6 text-start">
              <p className="text-xs font-medium text-[#E8C96A]">{t('miningAlt')}</p>
              <p className="mt-2 max-w-xs text-lg font-medium leading-[1.7] text-white">
                {t('miningText')}
              </p>
            </div>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/industrial-info"
            className={`${styles.card} group min-h-[210px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/standardization-bg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/35 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-6 bottom-6 text-start">
              <p className="text-xs font-medium text-[#E8C96A]">{t('industrialInfoAlt')}</p>
              <p className="mt-2 max-w-xs text-lg font-medium leading-[1.7] text-white">
                {t('industrialInfoText')}
              </p>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default LibraryNews;
