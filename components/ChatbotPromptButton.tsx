'use client';

import type React from 'react';
import type { DocumentChatContext } from '@/lib/document-chat';

type ChatbotPromptButtonProps = {
  prompt?: string;
  documentContext?: DocumentChatContext;
  autoAnswer?: boolean;
  className: string;
  children: React.ReactNode;
};

export default function ChatbotPromptButton({
  prompt,
  documentContext,
  autoAnswer = false,
  className,
  children,
}: ChatbotPromptButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('aidsmo:open-chatbot', {
          detail: { prompt, documentContext, autoAnswer },
        }));
      }}
      className={className}
    >
      {children}
    </button>
  );
}
