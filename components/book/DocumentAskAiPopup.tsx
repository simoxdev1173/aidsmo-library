'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HiOutlineArrowLeft, HiOutlineXMark } from 'react-icons/hi2';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';

/**
 * A floating nudge anchored to the corner of the document preview, as if it
 * emerged from the PDF itself, rather than a static block in the sidebar.
 * Dismissing it only clears this render — it's a light nudge, not a setting
 * worth persisting.
 */
export default function DocumentAskAiPopup({ title }: { title: string }) {
  const [dismissed, setDismissed] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.92, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-4 end-4 z-20 w-[min(19rem,calc(100%-2rem))]"
        >
          {/* Separate node for the perpetual float, so the loop never fights
              the one-shot entrance/exit transition above. */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
            className="relative rounded-2xl border border-[#C29C41]/35 bg-white p-4 shadow-[0_20px_46px_rgba(10,37,64,0.22)]"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="إغلاق"
              className="absolute end-2 top-2 cursor-pointer rounded-full p-1 text-[#94A3B8] transition hover:bg-[#F4F8FB] hover:text-[#0A2540]"
            >
              <HiOutlineXMark className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 pe-4">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/35 bg-[#022A4E]">
                <Image src="/ai-assistant.png" alt="" width={24} height={24} className="object-contain" />
                <span className="absolute -end-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C29C41] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e8c96a]" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[0.82rem] font-bold leading-5 text-[#0A2540]">
                  هل لديك سؤال حول هذا المستند؟
                </p>

                <ChatbotPromptButton
                  prompt={`اشرح لي محتوى ${title}`}
                  className="mt-2.5 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#C29C41] bg-gradient-to-b from-[#f1dda0] to-[#C29C41] px-4 text-[0.72rem] font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 hover:brightness-110"
                >
                  اسأل المساعد
                  <HiOutlineArrowLeft className="h-3.5 w-3.5" />
                </ChatbotPromptButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
