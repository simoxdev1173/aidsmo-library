import Image from 'next/image';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';

export default function AiAssistantPanel({
  title,
  prompts,
}: {
  title: string;
  prompts: string[];
}) {
  return (
    <section className="relative mt-12 overflow-hidden rounded-[22px] border border-[#C29C41]/30 bg-[#071D2F] text-white shadow-[0_26px_80px_rgba(10,37,64,0.22)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,106,0.12) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_22%,rgba(232,201,106,0.2),transparent_40%),radial-gradient(circle_at_10%_92%,rgba(14,165,233,0.16),transparent_42%)]"
        aria-hidden
      />

      <div className="relative grid gap-8 p-6 md:grid-cols-[240px_1fr] md:items-center md:gap-10 md:p-10">
        {/* Mascot stage — sits on the right in RTL */}
        <div className="relative mx-auto flex h-44 w-44 items-center justify-center md:h-56 md:w-56">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(232,201,106,0.32),transparent_66%)] blur-md" aria-hidden />
          <div className="absolute inset-2 rounded-full border border-[#C29C41]/35" aria-hidden />
          <div className="absolute inset-6 rounded-full border border-white/10" aria-hidden />
          <Image
            src="/ai-assistant.png"
            alt="المساعد الذكي للمكتبة"
            width={224}
            height={224}
            className="relative z-10 h-auto w-36 drop-shadow-[0_18px_34px_rgba(0,0,0,0.45)] [animation:research-float_6s_ease-in-out_infinite] motion-reduce:animate-none md:w-44"
          />
        </div>

        {/* Content + right-aligned prompt cards */}
        <div className="text-right">
          <h2 className="font-academic text-2xl font-bold leading-tight text-white md:text-3xl">
            اسأل المساعد الذكي عن {title}
          </h2>
          <p className="mt-3 max-w-2xl font-academic text-sm leading-8 text-white/72 md:text-base">
            اختر سؤالاً للبدء، أو اطرح سؤالك الخاص في المحادثة.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {prompts.map((prompt) => (
              <ChatbotPromptButton
                key={prompt}
                prompt={prompt}
                className="group/prompt flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-3.5 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C29C41]/55 hover:bg-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/60 active:translate-y-0"
              >
                <span className="flex-1 text-sm font-bold leading-6 text-white/85 transition duration-200 group-hover/prompt:text-[#071D2F]">
                  {prompt}
                </span>
                <HiOutlineArrowLeft className="h-4 w-4 shrink-0 text-[#E8C96A] transition duration-200 group-hover/prompt:-translate-x-1 group-hover/prompt:text-[#071D2F]" />
              </ChatbotPromptButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
