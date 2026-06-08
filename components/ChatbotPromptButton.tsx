'use client';

import type React from 'react';

type ChatbotPromptButtonProps = {
  prompt: string;
  className: string;
  children: React.ReactNode;
};

export default function ChatbotPromptButton({ prompt, className, children }: ChatbotPromptButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('aidsmo:open-chatbot', { detail: { prompt } }));
      }}
      className={className}
    >
      {children}
    </button>
  );
}
