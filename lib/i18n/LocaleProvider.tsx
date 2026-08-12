'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

export type AppLocale = 'ar' | 'en';

const STORAGE_KEY = 'aidsmo-locale';

const messagesByLocale: Record<AppLocale, typeof arMessages> = {
  ar: arMessages,
  en: enMessages,
};

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useAppLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useAppLocale must be used within LocaleProvider');
  }
  return ctx;
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('ar');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') {
      // The persisted preference is intentionally restored after hydration so
      // the server and first client render both start with the Arabic default.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (next: AppLocale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]} timeZone="Africa/Casablanca">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
