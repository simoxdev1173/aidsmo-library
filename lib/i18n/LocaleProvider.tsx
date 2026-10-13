'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react';
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

export default function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: AppLocale }) {
  // Use the request's locale for every streamed boundary's first render.
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (next: AppLocale) => {
    document.cookie = `${STORAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    startTransition(() => setLocaleState(next));
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
