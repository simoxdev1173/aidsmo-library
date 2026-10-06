'use client';

import { lazy, Suspense, useState } from 'react';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';

const WebsiteFeedbackWidget = lazy(() => import('@/components/WebsiteFeedbackWidget'));

export default function LazyWebsiteFeedbackWidget() {
  const [opened, setOpened] = useState(false);

  if (opened) {
    return (
      <Suspense fallback={<Launcher loading onClick={() => {}} />}>
        <WebsiteFeedbackWidget initiallyOpen />
      </Suspense>
    );
  }

  return <Launcher onClick={() => setOpened(true)} />;
}

function Launcher({ loading = false, onClick }: { loading?: boolean; onClick: () => void }) {
  return (
    <div dir="rtl" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 sm:bottom-6 sm:left-6">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-haspopup="dialog"
        aria-label="شاركنا رأيك في الموقع"
        aria-busy={loading}
        className="group inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border border-[#C29C41]/70 bg-white/95 px-4 text-sm font-bold text-[#0A2540] shadow-[0_10px_28px_rgba(10,37,64,0.14)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-[#C29C41] hover:shadow-[0_14px_34px_rgba(10,37,64,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:cursor-wait"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[#FBF7EA] text-[#987523] transition-colors group-hover:bg-[#F4E8C5]">
          <HiOutlineChatBubbleLeftRight className="size-[18px]" aria-hidden="true" />
        </span>
        <span>رأيك يهمنا</span>
      </button>
    </div>
  );
}
