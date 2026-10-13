'use client';

import Image from 'next/image';
import { lazy, Suspense, useEffect, useState } from 'react';
import type { DocumentChatContext } from '@/lib/document-chat';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

const ChatbotWidget = lazy(() => import('@/components/ChatbotWidget'));

type OpenRequest = {
  prompt?: string;
  documentContext?: DocumentChatContext;
  autoAnswer?: boolean;
};

export default function LazyChatbotWidget() {
  const { locale } = useAppLocale();
  const [request, setRequest] = useState<OpenRequest | null>(null);

  useEffect(() => {
    if (request !== null) return;

    const open = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      setRequest(detail && typeof detail === 'object' ? detail as OpenRequest : {});
    };

    window.addEventListener('aidsmo:open-chatbot', open);
    return () => window.removeEventListener('aidsmo:open-chatbot', open);
  }, [request]);

  if (request !== null) {
    return (
      <Suspense fallback={<Launcher loading locale={locale} onClick={() => {}} />}>
        <ChatbotWidget initialRequest={request} />
      </Suspense>
    );
  }

  return <Launcher locale={locale} onClick={() => setRequest({})} />;
}

function Launcher({ loading = false, locale, onClick }: { loading?: boolean; locale: string; onClick: () => void }) {
  return (
    <div dir="ltr" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-label={locale === 'ar' ? 'فتح المساعد الذكي' : 'Open the smart assistant'}
        aria-busy={loading}
        className="relative flex size-14 items-center justify-center rounded-full border-2 border-[#C29C41] bg-[linear-gradient(135deg,#032C4B,#0B5688)] shadow-2xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] disabled:cursor-wait sm:size-16"
      >
        <Image src="/ai-assistant.png" alt="" width={52} height={52} className="object-contain" />
        {loading ? (
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#E8C96A]" aria-hidden="true" />
        ) : (
          <span className="absolute -end-1 -top-1 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C29C41] opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full bg-[#E8C96A]" />
          </span>
        )}
      </button>
    </div>
  );
}
