'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LuChevronLeft } from 'react-icons/lu';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';
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
      className="relative overflow-hidden bg-[#382715] py-10 sm:py-20 lg:py-24"
      aria-label={t('heading')}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Image
        src="/background-01.webp"
        alt=""
        fill
        sizes="100vw"
        className="hidden scale-[1.04] object-cover brightness-[0.85] saturate-[0.7] sm:block"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 bg-black/10 sm:bg-black/20" aria-hidden />

      <div className="absolute inset-x-0 top-0 h-px bg-[#C29C41]/35" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

      <div className="relative z-10 mx-auto w-[calc(100%-2rem)] max-w-6xl rounded-[18px] border border-[#C6A346]/35 bg-[#fffdf8] px-4 py-6 shadow-[0_22px_58px_rgba(10,37,64,0.16)] sm:bg-white/78 sm:px-7 sm:py-8 sm:backdrop-blur-sm lg:px-9">
        <div className="mb-6 max-w-2xl sm:mb-12">
          <h2 className="text-balance text-[1.5rem] font-medium leading-[1.45] text-[#003652] sm:text-[2rem] lg:text-[2.4rem]">
            {t('heading')}
          </h2>

          <p className="mt-2 max-w-xl text-pretty text-sm leading-[1.7] text-[#475569] sm:mt-3 sm:text-[0.95rem] sm:leading-[1.9]">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[205px] lg:grid-cols-3">
          {/* Personal library card */}
          <Link
            href="/library"
            className={`${styles.card} group col-span-2 flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#C29C41]/35 bg-[#fffcf4]/95 p-5 shadow-[0_14px_36px_rgba(10,37,64,0.07)] sm:p-7 sm:backdrop-blur-sm lg:col-span-1 lg:row-span-2`}
          >
            <div>
              <p className="text-xs font-medium text-[#805e1b]">
                {t('myLibraryKicker')}
              </p>

              <h3 className="mt-2 max-w-md text-lg font-medium leading-[1.5] text-[#0A2540] sm:mt-4 sm:text-[1.45rem] sm:leading-[1.7]">
                {t('myLibraryTitle')}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-[1.7] text-[#59616a] sm:mt-3 sm:leading-[1.9]">
                {t('myLibraryDesc')}
              </p>
            </div>

            <span className={`${primaryButton} mt-5 w-full sm:mt-7 sm:w-fit`}>
              {t('openMyLibrary')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </Link>

          {/* Smart assistant card */}
          <div className={`${styles.card} group col-span-2 flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] p-5 text-white shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:p-7 lg:col-span-1 lg:row-span-2`}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(232,201,106,0.14),transparent_34%)]"
              aria-hidden
            />

            <ChatbotPromptButton className="absolute inset-0 z-20 cursor-pointer rounded-[18px] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8C96A]">
              <span className="sr-only">{t('askAssistant')}</span>
            </ChatbotPromptButton>

            <div className="pointer-events-none relative z-10">
              <p className="text-xs font-medium text-[#E8C96A]">
                {t('assistantKicker')}
              </p>

              <h3 className="mt-2 max-w-md text-lg font-medium leading-[1.5] text-white sm:mt-4 sm:text-[1.45rem] sm:leading-[1.7]">
                {t('assistantTitle')}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-[1.7] text-white/75 sm:mt-3 sm:leading-[1.9]">
                {t('assistantDesc')}
              </p>
            </div>

            <span className={`${primaryButton} pointer-events-none relative z-10 mt-5 w-full sm:mt-7 sm:w-fit`}>
              {t('askAssistant')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </div>

          {/* Top image card */}
          <Link
            href="/catalog/industry"
            className={`${styles.card} group min-h-[164px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/industry-informations-bg.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#061d31] via-[#0A2540]/65 to-[#0A2540]/10 sm:bg-[linear-gradient(90deg,rgba(10,37,64,0.12)_0%,rgba(10,37,64,0.55)_50%,rgba(10,37,64,0.9)_100%)]" aria-hidden="true" />

            <div className="absolute inset-x-3 bottom-4 text-start sm:inset-x-6 sm:bottom-6">
              <p className="hidden text-xs font-medium text-[#E8C96A] sm:block">
                {t('browseByFieldKicker')}
              </p>

              <p className="mt-1 text-base font-medium leading-[1.35] text-white sm:mt-2 sm:max-w-xs sm:text-lg sm:leading-[1.7]">
                <span className="sm:hidden">{t('industryShortcut')}</span>
                <span className="hidden sm:inline">{t('browseByFieldTitle')}</span>
              </p>
            </div>
          </Link>

          {/* Main blue sector card */}
          <Link
            href="/catalog/standardization"
            className={`${styles.card} group flex min-h-[164px] flex-col justify-end overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#003652] p-3 text-white shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] sm:justify-between sm:p-7 lg:min-h-0 lg:row-span-2`}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(232,201,106,0.13),transparent_36%)]"
              aria-hidden
            />

            <div className="relative z-10">
              <p className="hidden text-xs font-medium text-[#E8C96A] sm:block">
                {t('sectorsKicker')}
              </p>

              <h3 className="mt-1 text-base font-medium leading-[1.35] text-white sm:mt-4 sm:max-w-lg sm:text-[1.45rem] sm:leading-[1.7]">
                <span className="sm:hidden">{t('standardizationShortcut')}</span>
                <span className="hidden sm:inline">{t('sectorsTitle')}</span>
              </h3>

              <p className="mt-3 hidden max-w-md text-sm leading-[1.9] text-white/75 sm:block">
                {t('sectorsDesc')}
              </p>
            </div>

            <span className={`${darkButton} relative z-10 mt-7 hidden w-fit sm:inline-flex`}>
              {t('startBrowsing')}
              <LuChevronLeft className={`${styles.arrow} h-4 w-4`} />
            </span>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/mining"
            className={`${styles.card} group min-h-[164px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/industry-bg.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/35 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-3 bottom-4 text-start sm:inset-x-6 sm:bottom-6">
              <p className="hidden text-xs font-medium text-[#E8C96A] sm:block">{t('miningAlt')}</p>
              <p className="mt-1 text-base font-medium leading-[1.35] text-white sm:mt-2 sm:max-w-xs sm:text-lg sm:leading-[1.7]">
                <span className="sm:hidden">{t('miningShortcut')}</span>
                <span className="hidden sm:inline">{t('miningText')}</span>
              </p>
            </div>
          </Link>

          {/* Bottom image card */}
          <Link
            href="/catalog/industrial-info"
            className={`${styles.card} group min-h-[164px] overflow-hidden rounded-[18px] border border-[#C29C41]/30 bg-[#0A2540] shadow-[0_14px_36px_rgba(10,37,64,0.12)] sm:min-h-[230px] lg:min-h-0`}
          >
            <Image
              src="/standardization-bg.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
              className={`${styles.image} object-cover`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/35 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-3 bottom-4 text-start sm:inset-x-6 sm:bottom-6">
              <p className="hidden text-xs font-medium text-[#E8C96A] sm:block">{t('industrialInfoAlt')}</p>
              <p className="mt-1 text-base font-medium leading-[1.35] text-white sm:mt-2 sm:max-w-xs sm:text-lg sm:leading-[1.7]">
                <span className="sm:hidden">{t('industrialInfoShortcut')}</span>
                <span className="hidden sm:inline">{t('industrialInfoText')}</span>
              </p>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default LibraryNews;
