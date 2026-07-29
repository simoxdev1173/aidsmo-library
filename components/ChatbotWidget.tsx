'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  LuArrowUp,
  LuCheck,
  LuCopy,
  LuMaximize2,
  LuMic,
  LuMinimize2,
  LuRotateCcw,
  LuSearch,
  LuX,
} from 'react-icons/lu';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';
import { cn } from '@/utils/cn';
import DocumentCard from '@/components/chatbot/DocumentCard';
import ToolTrace from '@/components/chatbot/ToolTrace';
import { runAgent, SUGGESTED_PROMPTS, type AgentRun } from '@/components/chatbot/agent';

type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | {
      id: string;
      role: 'assistant';
      run: AgentRun;
      revealed: number;
      done: boolean;
    };

const CAPABILITY_KEYS = [
  'capabilitySearch',
  'capabilityFilter',
  'capabilityCompare',
  'capabilityStats',
] as const;

/** How long each capability stays on screen, in ms. */
const CAPABILITY_DWELL = 2800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let messageCounter = 0;
const nextId = () => `msg-${++messageCounter}`;

/* ------------------------------------------------------------------ */
/* Answer text with a word-by-word reveal                              */
/* ------------------------------------------------------------------ */

function AnswerText({ text }: { text: string }) {
  const words = text.split(' ');

  return (
    <motion.p
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.012 } } }}
      className="text-[0.82rem] leading-relaxed text-[#0A2540]"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.24 }}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ */
/* Capability ticker — one capability at a time, no icons              */
/* ------------------------------------------------------------------ */

function CapabilityTicker({ isRtl }: { isRtl: boolean }) {
  const t = useTranslations('chatbotWidget');
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % CAPABILITY_KEYS.length),
      CAPABILITY_DWELL,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-full border border-[#C29C41]/25 bg-[#FFF8E8]/70 px-4 py-2.5"
      aria-live="off"
    >
      <div className="relative h-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center truncate text-center text-[0.72rem] font-bold text-[#8B681C]"
          >
            {t(CAPABILITY_KEYS[index])}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dwell timer, doubles as the "moving" cue */}
      {!reduceMotion && (
        <motion.span
          key={`timer-${index}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: CAPABILITY_DWELL / 1000, ease: 'linear' }}
          style={{ transformOrigin: isRtl ? 'right' : 'left' }}
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C29C41] to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Widget                                                              */
/* ------------------------------------------------------------------ */

const ChatbotWidget = () => {
  const t = useTranslations('chatbotWidget');
  const { locale } = useAppLocale();
  const isRtl = locale === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Auto-resize the composer.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, isExpanded ? 200 : 120)}px`;
  }, [message, isExpanded]);

  // Keep the newest message in view.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Lock page scroll while the expanded overlay is up.
  useEffect(() => {
    if (!isOpen || !isExpanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isExpanded]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isBusy) return;

      setMessage('');
      setIsBusy(true);

      const run = runAgent(text, locale);
      const assistantId = nextId();

      setMessages((current) => [
        ...current,
        { id: nextId(), role: 'user', text },
        { id: assistantId, role: 'assistant', run, revealed: 0, done: false },
      ]);

      for (let index = 0; index < run.steps.length; index += 1) {
        await sleep(run.steps[index].durationMs);
        if (!aliveRef.current) return;
        setMessages((current) =>
          current.map((entry) =>
            entry.id === assistantId && entry.role === 'assistant'
              ? { ...entry, revealed: index + 1 }
              : entry,
          ),
        );
      }

      await sleep(160);
      if (!aliveRef.current) return;
      setMessages((current) =>
        current.map((entry) =>
          entry.id === assistantId && entry.role === 'assistant'
            ? { ...entry, done: true }
            : entry,
        ),
      );
      setIsBusy(false);
      textareaRef.current?.focus();
    },
    [isBusy, locale],
  );

  // Opened from a CTA elsewhere on the site.
  useEffect(() => {
    const openFromPrompt = (event: Event) => {
      const prompt =
        event instanceof CustomEvent && typeof event.detail?.prompt === 'string'
          ? event.detail.prompt
          : '';
      setIsOpen(true);
      if (prompt) setMessage(prompt);
      window.setTimeout(() => textareaRef.current?.focus(), 350);
    };

    window.addEventListener('aidsmo:open-chatbot', openFromPrompt);
    return () => window.removeEventListener('aidsmo:open-chatbot', openFromPrompt);
  }, []);

  // Escape steps back out: expanded → docked → closed.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isExpanded) setIsExpanded(false);
      else setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isExpanded]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
    } catch {
      /* clipboard unavailable — nothing to do in the demo */
    }
  };

  const resetChat = () => {
    if (isBusy) return;
    setMessages([]);
    setMessage('');
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  /* ---------------------------------------------------------------- */
  /* Panel                                                             */
  /* ---------------------------------------------------------------- */

  const panel = (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn(
        'flex flex-col overflow-hidden rounded-[1.75rem] bg-[#F0F7FC] shadow-[0_28px_70px_rgba(10,37,64,0.28)] ring-1 ring-[#0A2540]/8',
        isExpanded
          ? 'h-[min(88vh,820px)] w-[min(94vw,880px)]'
          : 'h-[600px] max-h-[76vh] w-[92vw] sm:w-[404px]',
      )}
    >
      {/* Header */}
      <header
        className="relative z-10 flex items-center gap-3 px-5 py-4 shadow-md"
        style={{ background: 'linear-gradient(135deg, #022A4E 0%, #034582 100%)' }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, #C29C41, #e8c96a, #C29C41, transparent)',
          }}
          aria-hidden
        />

        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/40 bg-[#011E39]">
          <Image src="/ai-assistant.png" alt="" width={30} height={30} className="object-contain" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white">{t('title')}</h3>
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-[#9FD3F5]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#4ade80]" />
            </span>
            {t('status')}
          </p>
        </div>

        <TooltipProvider>
          <div className="flex items-center gap-0.5">
            {!isEmpty && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={resetChat}
                    disabled={isBusy}
                    className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                    aria-label={t('newChat')}
                  >
                    <LuRotateCcw className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t('newChat')}</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsExpanded((value) => !value)}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={isExpanded ? t('minimize') : t('maximize')}
                >
                  {isExpanded ? (
                    <LuMinimize2 className="size-4" />
                  ) : (
                    <LuMaximize2 className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{isExpanded ? t('minimize') : t('maximize')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={t('closeChat')}
                >
                  <LuX className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t('closeChat')}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </header>

      {/* Conversation. A native scroller rather than Radix ScrollArea, which
          keeps the viewport at `overflow: hidden` until its own scrollbar has
          mounted and forces dir="ltr" onto the content.
          min-h-0 matters: a flex item defaults to min-height:auto, which would
          let this grow to fit the messages instead of scrolling them. */}
      <div
        ref={viewportRef}
        className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div
          className={cn(
            'flex flex-col gap-4 p-5',
            isExpanded && 'mx-auto w-full max-w-3xl px-6 py-7',
          )}
        >
          {/* Empty state */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-start gap-2.5">
                <div className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/30 bg-[#022A4E]">
                  <Image
                    src="/ai-assistant.png"
                    alt=""
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <div className="rounded-2xl rounded-ss-none bg-white px-4 py-3 text-[0.82rem] leading-relaxed text-[#0A2540] shadow-sm">
                  {t('welcomeMessage')}
                </div>
              </div>

              <CapabilityTicker isRtl={isRtl} />

              {/* Suggested prompts */}
              <div>
                <p className="mb-2 text-[0.7rem] font-bold text-[#475569]">{t('tryAsking')}</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.en}
                      type="button"
                      onClick={() => send(prompt[locale])}
                      className="rounded-full border border-[#0369A1]/16 bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-[#0B4E84] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C29C41] hover:bg-[#FFF8E8] hover:text-[#0A2540]"
                    >
                      {prompt[locale]}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((entry) =>
            entry.role === 'user' ? (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end"
              >
                <p className="max-w-[85%] rounded-2xl rounded-ee-none bg-gradient-to-br from-[#034582] to-[#022A4E] px-4 py-2.5 text-[0.82rem] leading-relaxed text-white shadow-[0_6px_16px_rgba(2,42,78,0.2)]">
                  {entry.text}
                </p>
              </motion.div>
            ) : (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/30 bg-[#022A4E]">
                  <Image
                    src="/ai-assistant.png"
                    alt=""
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2.5">
                  <ToolTrace
                    steps={entry.run.steps}
                    revealed={entry.revealed}
                    done={entry.done}
                    locale={locale}
                  />

                  {entry.done && (
                    <>
                      {/* Answer */}
                      <div className="rounded-2xl rounded-ss-none bg-white px-4 py-3 shadow-sm">
                        <AnswerText text={entry.run.answer[locale]} />

                        <div className="mt-2.5 flex items-center gap-2 border-t border-[#0369A1]/8 pt-2">
                          {entry.run.docs.length > 0 && (
                            <Badge variant="navy">
                              {t('sourcesCount', { count: entry.run.docs.length })}
                            </Badge>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopy(entry.id, entry.run.answer[locale])}
                            className="ms-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.64rem] font-semibold text-[#475569] transition-colors hover:bg-[#F0F7FC] hover:text-[#0A2540]"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <LuCheck className="size-2.5" aria-hidden />
                                {t('copied')}
                              </>
                            ) : (
                              <>
                                <LuCopy className="size-2.5" aria-hidden />
                                {t('copy')}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Stat tiles */}
                      {entry.run.stats && (
                        <div className="grid grid-cols-2 gap-2">
                          {entry.run.stats.map((stat, index) => (
                            <motion.div
                              key={stat.label.en}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.06, duration: 0.3 }}
                              className="rounded-xl border border-[#C29C41]/25 bg-[#FFF8E8]/80 px-3 py-2.5"
                            >
                              <p className="text-base font-bold leading-none text-[#0A2540]">
                                {stat.value}
                              </p>
                              <p className="mt-1 text-[0.62rem] font-semibold leading-tight text-[#8B681C]">
                                {stat.label[locale]}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Result cards */}
                      {entry.run.docs.length > 0 && (
                        <div className="space-y-2">
                          <p className="flex items-center gap-1.5 px-0.5 text-[0.68rem] font-bold text-[#475569]">
                            <LuSearch className="size-3" aria-hidden />
                            {t('relatedDocuments')}
                          </p>

                          <div
                            className={cn(
                              'grid gap-2',
                              isExpanded ? 'sm:grid-cols-2' : 'grid-cols-1',
                            )}
                          >
                            {entry.run.docs.map((doc, index) => (
                              <DocumentCard
                                key={doc.id}
                                doc={doc}
                                locale={locale}
                                index={index}
                                relevance={entry.run.relevance[index]}
                                onOpen={() => {
                                  setIsOpen(false);
                                  setIsExpanded(false);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-ups */}
                      {entry.run.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {entry.run.followUps.map((followUp) => (
                            <button
                              key={followUp.en}
                              type="button"
                              disabled={isBusy}
                              onClick={() => send(followUp[locale])}
                              className="rounded-full border border-[#0369A1]/16 bg-white/80 px-2.5 py-1 text-[0.66rem] font-semibold text-[#0B4E84] transition-all duration-300 hover:border-[#C29C41] hover:bg-[#FFF8E8] hover:text-[#0A2540] disabled:opacity-50"
                            >
                              {followUp[locale]}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-[#0369A1]/10 bg-white p-4">
        <div className={cn(isExpanded && 'mx-auto w-full max-w-3xl')}>
          <div
            className={cn(
              'flex items-end gap-1.5 rounded-2xl bg-[#F0F7FC] p-1.5 transition-all duration-300',
              message.trim()
                ? 'ring-1 ring-[#C29C41]'
                : 'ring-1 ring-transparent focus-within:ring-[#0369A1]/25',
            )}
          >
            <button
              type="button"
              className="shrink-0 rounded-xl p-2.5 text-[#0369A1] transition-colors hover:bg-[#0369A1]/8 hover:text-[#C29C41]"
              aria-label={t('voiceInput')}
            >
              <LuMic className="size-4" />
            </button>

            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(message);
                }
              }}
              placeholder={isBusy ? t('thinking') : t('placeholder')}
              disabled={isBusy}
              dir={isRtl ? 'rtl' : 'ltr'}
              rows={1}
              className={cn('flex-1', isExpanded ? 'max-h-[200px]' : 'max-h-[120px]')}
            />

            <Button
              type="button"
              size="icon-sm"
              onClick={() => send(message)}
              disabled={!message.trim() || isBusy}
              className="mb-1 shrink-0"
              aria-label={t('sendMessage')}
            >
              <LuArrowUp className="size-4" />
            </Button>
          </div>

          <p className="mt-2 px-1 text-center text-[0.6rem] font-medium text-[#475569]/70">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /* Shell                                                             */
  /* ---------------------------------------------------------------- */

  return (
    <>
      {/* Expanded, centred overlay */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[#0A2540]/45 p-4 backdrop-blur-sm"
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsExpanded(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {panel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked panel + launcher. Pinned bottom-right in both locales, so this
          wrapper stays LTR — the panel inside sets its own direction. */}
      <div dir="ltr" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'bottom right' }}
            >
              {panel}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
              setIsExpanded(false);
            } else {
              setIsOpen(true);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex size-16 items-center justify-center rounded-full shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #022A4E 0%, #034582 100%)',
            border: '2px solid #C29C41',
          }}
          aria-label={t('toggleChat')}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <LuX className="size-7 text-[#C29C41]" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Image
                  src="/ai-assistant.png"
                  alt=""
                  width={52}
                  height={52}
                  className="object-contain"
                />
                <span className="absolute -end-1 -top-1 flex size-3.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C29C41] opacity-75" />
                  <span className="relative inline-flex size-3.5 rounded-full bg-[#e8c96a]" />
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default ChatbotWidget;
