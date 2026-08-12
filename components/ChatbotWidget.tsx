// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LuArrowUp,
  LuCheck,
  LuCopy,
  LuMaximize2,
  LuMic,
  LuMinimize2,
  LuRefreshCcw,
  LuRotateCcw,
  LuSquare,
  LuX,
  LuBookOpen,
  LuBookmark,
} from 'react-icons/lu';

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
import type { AgentRun } from '@/components/chatbot/agent';

type LightRagReference = {
  reference_id: string;
  file_path: string;
  content?: string[];
};

type LightRagStreamEvent = {
  response?: string;
  references?: LightRagReference[];
  progress?: string;
  response_time?: number;
  error?: string;
};

type AssistantStatus =
  | 'connecting'
  | 'retrieving'
  | 'streaming'
  | 'done'
  | 'cancelled'
  | 'error';

type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | {
      id: string;
      role: 'assistant';
      request: string;
      text: string;
      status: AssistantStatus;
      progress?: string;
      references: LightRagReference[];
      responseTime?: number;
      error?: string;
    };

let messageCounter = 0;
const nextId = () => `msg-${++messageCounter}`;

const progressCopy: Record<string, { en: string; ar: string }> = {
  extracting_keywords: { en: 'Understanding your question', ar: 'فهم سؤالك' },
  retrieving: { en: 'Searching the knowledge base', ar: 'البحث في قاعدة المعرفة' },
  retrieving_context: { en: 'Retrieving relevant sources', ar: 'استرجاع المصادر ذات الصلة' },
  building_context: { en: 'Connecting the evidence', ar: 'ربط الأدلة والمعلومات' },
  generating_response: { en: 'Writing the answer', ar: 'صياغة الإجابة' },
};

function getProgressLabel(progress: string | undefined, locale: string) {
  const copy = progress ? progressCopy[progress] : undefined;
  if (copy) return locale === 'ar' ? copy.ar : copy.en;
  if (progress) {
    return progress
      .replace(/_/g, ' ')
      .replace(/^./, (letter) => letter.toUpperCase());
  }
  return locale === 'ar' ? 'الاتصال بالمكتبة الذكية' : 'Connecting to the knowledge base';
}

function friendlyError(message: string, locale: string) {
  if (/knowledge graph unavailable/i.test(message)) {
    return locale === 'ar'
      ? 'قاعدة المعرفة غير متاحة مؤقتاً. حاول مرة أخرى بعد قليل.'
      : 'The knowledge base is temporarily unavailable. Try again in a moment.';
  }
  if (/could not reach|fetch failed|connection/i.test(message)) {
    return locale === 'ar'
      ? 'تعذر الاتصال بخدمة البحث الآن. تحقق من تشغيل LightRAG ثم أعد المحاولة.'
      : 'The research service could not be reached. Check that LightRAG is running, then try again.';
  }
  return message;
}

function stripReferencesSection(markdown: string) {
  const referenceHeading =
    /(?:^|\n)\s*(?:#{1,6}\s*(?:references?|sources?|المراجع|المصادر)\s*:?(?=\s|$)|(?:references?|sources?|المراجع|المصادر)\s*:(?=\s|$))/iu;
  const match = referenceHeading.exec(markdown);
  return (match ? markdown.slice(0, match.index) : markdown).trimEnd();
}

type VoiceState = 'idle' | 'requesting' | 'listening' | 'processing';

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean;
  readonly [index: number]: { transcript?: string };
};

type SpeechRecognitionEventLike = {
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorLike = {
  readonly error?: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getFollowUpSuggestions(locale: string) {
  if (locale === 'ar') {
    return [
      'لخّص أهم النتائج في ثلاث نقاط.',
      'ما الإجراءات العملية التي توصي بها هذه النتائج؟',
      'ما الإصدارات الأخرى في المكتبة التي تنصح بقراءتها؟',
    ];
  }

  return [
    'Summarize the key findings in three points.',
    'What practical actions do these findings recommend?',
    'Which other library publications should I read next?',
  ];
}

function getVoiceError(error: unknown, locale: string) {
  const errorName =
    error && typeof error === 'object' && 'name' in error
      ? String((error as { name?: unknown }).name)
      : '';
  const recognitionError =
    error && typeof error === 'object' && 'error' in error
      ? String((error as { error?: unknown }).error)
      : '';
  const code = recognitionError || errorName;

  if (/not-allowed|permissiondenied|notallowederror|securityerror/i.test(code)) {
    return locale === 'ar'
      ? 'لم يتم منح إذن الميكروفون. اسمح بالوصول من إعدادات المتصفح ثم حاول مرة أخرى.'
      : 'Microphone access was not granted. Allow it in your browser settings, then try again.';
  }
  if (/audio-capture|notfounderror|devicesnotfounderror/i.test(code)) {
    return locale === 'ar'
      ? 'لم يتم العثور على ميكروفون متاح. تحقق من توصيله ومن إعدادات النظام.'
      : 'No available microphone was found. Check the device and your system settings.';
  }
  if (/not-readable|trackstarterror|aborterror/i.test(code)) {
    return locale === 'ar'
      ? 'تعذر استخدام الميكروفون. قد يكون مستخدماً في تطبيق آخر.'
      : 'The microphone could not be used. Another application may be using it.';
  }
  if (/network/i.test(code)) {
    return locale === 'ar'
      ? 'تعذر الوصول إلى خدمة التعرف على الصوت. تحقق من الاتصال وحاول مرة أخرى.'
      : 'The speech recognition service could not be reached. Check your connection and try again.';
  }
  if (/no-speech/i.test(code)) {
    return locale === 'ar'
      ? 'لم يتم سماع كلام واضح. قرّب الميكروفون وحاول مرة أخرى.'
      : 'No clear speech was detected. Move closer to the microphone and try again.';
  }

  return locale === 'ar'
    ? 'تعذر تشغيل الإدخال الصوتي. حاول مرة أخرى أو اكتب سؤالك.'
    : 'Voice input could not start. Try again or type your question.';
}

/* ------------------------------------------------------------------ */
/* Hardcoded Prompts & Responses                                       */
/* ------------------------------------------------------------------ */

const LOCAL_SUGGESTIONS = [
  {
    en: 'What are the best practices for sustainable mining and environmental rehabilitation in Arab countries?',
    ar: 'ما هي أفضل الممارسات للتعدين المستدام وإعادة التأهيل البيئي في الدول العربية؟',
  },
  {
    en: 'How can Arab countries utilize their industrial rocks and vital minerals for economic growth?',
    ar: 'كيف يمكن للدول العربية الاستفادة من ثروات الصخور الصناعية والمعادن الحيوية للنمو الاقتصادي؟',
  },
];

const getHardcodedRun = (text: string): AgentRun | null => {
  if (text === LOCAL_SUGGESTIONS[0].en || text === LOCAL_SUGGESTIONS[0].ar) {
    return {
      steps: [
        { text: { en: 'Analyzing request...', ar: 'تحليل الطلب...' }, durationMs: 600 },
        { text: { en: 'Searching sustainability frameworks...', ar: 'البحث في أطر الاستدامة...' }, durationMs: 800 },
        { text: { en: 'Extracting rehabilitation guidelines...', ar: 'استخراج إرشادات التأهيل...' }, durationMs: 700 },
      ],
      answer: {
        en: 'To ensure sustainable practices, Arab countries are adopting comprehensive frameworks that balance economic extraction with strict environmental preservation.\n\nModern guidelines mandate rigorous impact assessments before launching any mining project, alongside social commitments to protect local community rights and provide sustainable employment. Furthermore, a critical phase of the mining lifecycle is the rehabilitation of abandoned mines and quarries. By transforming these legacy sites into productive or sustainable ecological zones, countries can mitigate long-term environmental hazards and generate secondary economic value.\n\nBased on your query, I highly recommend exploring these two foundational documents which detail legislative frameworks and practical rehabilitation methodologies:',
        ar: 'لضمان ممارسات مستدامة، تتبنى الدول العربية أطراً شاملة توازن بين الاستخراج الاقتصادي والحفاظ الصارم على البيئة.\n\nتفرض التوجيهات الحديثة إجراء تقييمات دقيقة للأثر البيئي قبل إطلاق أي مشروع، إلى جانب الالتزامات الاجتماعية لحماية حقوق المجتمعات المحلية وتوفير فرص العمل المستدامة. وعلاوة على ذلك، تُعدّ إعادة تأهيل المناجم والمحاجر المهجورة مرحلة حاسمة في دورة حياة التعدين. من خلال تحويل هذه المواقع القديمة إلى مناطق بيئية أو إنتاجية مستدامة، يمكن للدول التخفيف من المخاطر البيئية طويلة الأجل وتوليد قيمة اقتصادية ثانوية.\n\nبناءً على استفسارك، أوصي بشدة باستكشاف هاتين الوثيقتين التأسيسيتين اللتين تفصلان الأطر التشريعية ومنهجيات التأهيل العملية:',
      },
      docs: [
        {
          id: 'doc-1',
          cover: '/ai-demo/book-cover-1.jpg',
          title: {
            en: 'Arab Indicative Mining System',
            ar: 'الـنـظـام االسـترشـادي التعديني للدول العربية'
          },
          summary: {
            en: 'A unified reference framework helping governments develop modern, sustainable, and harmonious legislation for the mining sector.',
            ar: 'إطار مرجعي موحّد يساعد الحكومات على تطوير تشريعات حديثة ومتناغمة لقطاع التعدين، بما يعزز الشفافية والاستثمار المسؤول.'
          },
          relevance: 98,
        },
        {
          id: 'doc-4',
          cover: '/ai-demo/book-cover-4.jpg',
          title: {
            en: 'Rehabilitation of Old Mines and Quarries for Sustainable Development',
            ar: 'إعـادة تأهيـل الـمناجم والـمحاجر القديمة لتحقيق تنمية مستدامة'
          },
          summary: {
            en: 'A study reviewing the environmental impacts of abandoned mines and frameworks for rehabilitating them into sustainable resources.',
            ar: 'دراسة تستعرض أهمية إعادة تأهيل المناجم والمحاجر المهجورة، وتتبنّى سياسات لتحويلها إلى موارد إنتاجية أو خدمية مستدامة.'
          },
          relevance: 94,
        }
      ],
      stats: [],
      followUps: [],
    };
  }

  if (text === LOCAL_SUGGESTIONS[1].en || text === LOCAL_SUGGESTIONS[1].ar) {
    return {
      steps: [
        { text: { en: 'Analyzing request...', ar: 'تحليل الطلب...' }, durationMs: 500 },
        { text: { en: 'Locating geological maps...', ar: 'تحديد الخرائط الجيولوجية...' }, durationMs: 800 },
        { text: { en: 'Generating strategic summary...', ar: 'صياغة الملخص الاستراتيجي...' }, durationMs: 750 },
      ],
      answer: {
        en: 'The Arab region possesses rich and highly diverse geological resources, strategically positioning it to play a pivotal role in global manufacturing and the green energy transition.\n\nIndustrial rocks such as limestone, basalt, and silica are foundational for advanced manufacturing, construction, and glass industries. Simultaneously, the global shift towards clean energy relies heavily on vital transition minerals. To maximize these assets, the region is developing unified roadmaps and detailed geological atlases to map these resources, attract direct investments, and integrate into global clean energy supply chains.\n\nTo dive deeper into the geological distribution and economic strategies surrounding these resources, these specialized publications are highly relevant:',
        ar: 'تمتلك المنطقة العربية موارد جيولوجية غنية ومتنوعة للغاية، مما يضعها في موقع استراتيجي لتلعب دوراً محورياً في الصناعات التحويلية العالمية والتحول نحو الطاقة الخضراء.\n\nتعتبر الصخور الصناعية مثل الحجر الجيري والبازلت والسيليكا أساسية في مجالات التصنيع المتقدم والبناء وصناعة الزجاج. في الوقت ذاته، يعتمد التحول العالمي نحو الطاقة النظيفة بشكل كبير على معادن الانتقال الحيوية. ولتحقيق أقصى استفادة، تعمل المنطقة على تطوير خرائط طريق موحدة وأطالس جيولوجية دقيقة لتحديد هذه الموارد وجذب الاستثمارات المباشرة.\n\nللتعمق أكثر في التوزيع الجيولوجي والاستراتيجيات الاقتصادية المحيطة بهذه الثروات، تُعد هذه المنشورات المتخصصة ذات صلة وثيقة:',
      },
      docs: [
        {
          id: 'doc-2',
          cover: '/ai-demo/book-cover-2.jpg',
          title: {
            en: 'Guiding Roadmap for Energy Transition Minerals',
            ar: 'خارطة الطريق الأسترشادية لمعادن الأنتقال الطاقي بالمنطقة العربية'
          },
          summary: {
            en: 'A unified Arab vision to enhance the region\'s role in clean energy value chains and the global vital minerals market.',
            ar: 'رؤية عربية موحدة تعزّز دور المنطقة في سلاسل القيمة المرتبطة بالطاقة النظيفة والمعادن الحيوية.'
          },
          relevance: 97,
        },
        {
          id: 'doc-3',
          cover: '/ai-demo/book-cover-3.png',
          title: {
            en: 'Atlas of Arab Industrial Rocks',
            ar: 'أطلس الصخور الصناعية العربية'
          },
          summary: {
            en: 'A comprehensive reference defining major industrial rocks, their geographical distribution, and their massive economic value in manufacturing.',
            ar: 'مرجع متكامل يعرّف بأهم الصخور الصناعية في الدول العربية ويستعرض خرائط توزيعها واستخداماتها في الصناعات التحويلية.'
          },
          relevance: 95,
        }
      ],
      stats: [],
      followUps: [],
    };
  }

  return null;
};

const HARDCODED_BOOK_SUGGESTIONS =
  getHardcodedRun(LOCAL_SUGGESTIONS[0].en)?.docs ?? [];

/* ------------------------------------------------------------------ */
/* Answer text with a word-by-word reveal (Supports Paragraphs)        */
/* ------------------------------------------------------------------ */

function StreamingAnswer({ text, active }: { text: string; active: boolean }) {
  const visibleText = stripReferencesSection(text);

  return (
    <div
      className="text-[0.82rem] leading-[1.75] text-[#0A2540]"
      aria-live={active ? 'polite' : 'off'}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-2 mt-4 text-base font-bold leading-snug tracking-[-0.02em] text-[#022A4E] first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-4 text-[0.95rem] font-bold leading-snug text-[#022A4E] first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1.5 mt-3.5 text-[0.86rem] font-bold leading-snug text-[#0B4E84] first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2.5 whitespace-pre-wrap text-pretty last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ms-1 list-disc space-y-1.5 ps-4 marker:text-[#C29C41] last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ms-1 list-decimal space-y-1.5 ps-4 marker:font-bold marker:text-[#8B681C] last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ps-1 text-pretty">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-[#022A4E]">{children}</strong>
          ),
          em: ({ children }) => <em className="text-[#334E63]">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-[#0369A1] underline decoration-[#C29C41]/55 underline-offset-2 transition-colors hover:text-[#8B681C] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-s-2 border-[#C29C41] bg-[#FFF9EA] py-2 pe-3 ps-3 text-[#334E63]">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => (
            <code className={cn('rounded bg-[#E8F1F7] px-1 py-0.5 font-mono text-[0.76rem] text-[#0B4E84]', className)}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-3 max-w-full overflow-x-auto rounded-xl bg-[#022A4E] p-3 text-start text-[0.74rem] leading-relaxed text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-3 max-w-full overflow-x-auto rounded-xl border border-[#DDEAF3]">
              <table className="w-full min-w-[28rem] border-collapse text-start text-[0.72rem]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-[#DDEAF3] bg-[#F0F7FC] px-3 py-2 text-start font-bold text-[#022A4E]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[#DDEAF3]/70 px-3 py-2 align-top last:border-b-0">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-0 border-t border-[#DDEAF3]" />,
        }}
      >
        {visibleText}
      </ReactMarkdown>
      {active && (
        <motion.span
          aria-hidden
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
          className="ms-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] rounded-full bg-[#C29C41] motion-reduce:animate-pulse"
        />
      )}
    </div>
  );
}

function AnswerText({ text }: { text: string }) {
  return <StreamingAnswer text={text} active={false} />;
}

function HardcodedBookSuggestions({
  docs,
  locale,
}: {
  docs: AgentRun['docs'];
  locale: string;
}) {
  if (!docs.length) return null;

  return (
    <div className="mt-5 flex flex-col gap-3">
      {docs.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
          className="group relative flex gap-3.5 rounded-xl border border-transparent bg-[#F8FAFC]/60 p-2.5 transition-all duration-300 hover:border-[#C29C41]/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(194,156,65,0.12)]"
        >
          <div className="relative h-[115px] w-[80px] min-w-[80px] shrink-0 overflow-hidden rounded-md bg-[#FFF8E8] shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            <Image
              src={doc.cover}
              alt={doc.title[locale as keyof typeof doc.title] || doc.title.en}
              fill
              sizes="80px"
              className="object-cover"
            />
            <div className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent mix-blend-multiply" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div>
              <h4 className="line-clamp-2 text-[0.8rem] font-bold leading-snug text-[#0A2540] transition-colors group-hover:text-[#0B4E84]">
                {doc.title[locale as keyof typeof doc.title] || doc.title.en}
              </h4>
              <p className="mt-1 line-clamp-2 text-[0.68rem] leading-relaxed text-[#475569]">
                {doc.summary[locale as keyof typeof doc.summary] || doc.summary.en}
              </p>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex cursor-help items-center text-[0.65rem] font-bold text-[#8B681C]">
                        {doc.relevance}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {locale === 'ar' ? 'نسبة التطابق مع استفسارك' : 'Relevance to your query'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0A2540]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C29C41] to-[#e8c96a]"
                    style={{ width: `${doc.relevance}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#C29C41] to-[#e8c96a] px-3.5 py-1.5 text-[0.65rem] font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(194,156,65,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2"
                >
                  <LuBookOpen className="size-3" />
                  {locale === 'ar' ? 'تصفح الكتاب' : 'Read Book'}
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#C29C41]/40 bg-white px-3.5 py-1.5 text-[0.65rem] font-bold text-[#C29C41] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C29C41] hover:bg-[#FFF8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2"
                >
                  <LuBookmark className="size-3" />
                  {locale === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RetrievalState({ label, reduceMotion }: { label: string; reduceMotion: boolean }) {
  return (
    <div className="min-h-[82px] rounded-2xl rounded-ss-none border border-[#0369A1]/8 bg-white/95 px-4 py-3.5 shadow-[0_4px_20px_rgba(10,37,64,0.06)]">
      <div className="flex items-center gap-2 text-[0.72rem] font-semibold text-[#0B4E84]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C29C41]/70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-[#C29C41]" />
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative mt-4 h-px overflow-hidden bg-[#D8E7F2]">
        <motion.span
          aria-hidden
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#C29C41] to-transparent"
          animate={reduceMotion ? { x: '100%' } : { x: ['-120%', '320%'] }}
          transition={reduceMotion ? undefined : { duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mt-3 space-y-2" aria-hidden>
        <div className="h-1.5 w-[84%] rounded-full bg-[#E8F1F7]" />
        <div className="h-1.5 w-[58%] rounded-full bg-[#E8F1F7]" />
      </div>
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
  const reduceMotion = useReducedMotion() ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const aliveRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const voiceSessionRef = useRef(0);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      abortRef.current?.abort();
      voiceSessionRef.current += 1;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, isExpanded ? 200 : 120)}px`;
  }, [message, isExpanded]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: reduceMotion || isBusy ? 'auto' : 'smooth',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, isBusy, reduceMotion]);

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

      voiceSessionRef.current += 1;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      setVoiceState('idle');
      setVoiceError(null);
      setMessage('');
      setIsBusy(true);
      const assistantId = nextId();
      const controller = new AbortController();
      abortRef.current = controller;

      const conversationHistory = messages
        .flatMap((entry) => {
          if (entry.role === 'user') return [{ role: 'user' as const, content: entry.text }];
          if (entry.text && entry.status !== 'error') {
            return [
              { role: 'assistant' as const, content: stripReferencesSection(entry.text) },
            ];
          }
          return [];
        })
        .slice(-12);

      setMessages((current) => [
        ...current,
        { id: nextId(), role: 'user', text },
        {
          id: assistantId,
          role: 'assistant',
          request: text,
          text: '',
          status: 'connecting',
          references: [],
        },
      ]);

      const updateAssistant = (update: (entry: Extract<ChatMessage, { role: 'assistant' }>) => ChatMessage) => {
        if (!aliveRef.current) return;
        setMessages((current) =>
          current.map((entry) =>
            entry.id === assistantId && entry.role === 'assistant'
              ? update(entry)
              : entry,
          ),
        );
      };

      const applyStreamEvent = (event: LightRagStreamEvent) => {
        if (event.error) throw new Error(event.error);
        updateAssistant((entry) => ({
          ...entry,
          status: event.response
            ? 'streaming'
            : event.progress || Array.isArray(event.references)
              ? 'retrieving'
              : entry.status,
          progress: event.progress || entry.progress,
          text: event.response ? `${entry.text}${event.response}` : entry.text,
          references: Array.isArray(event.references) ? event.references : entry.references,
          responseTime:
            typeof event.response_time === 'number' ? event.response_time : entry.responseTime,
        }));
      };

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text, conversationHistory }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let detail = `The research service returned HTTP ${response.status}.`;
          try {
            const payload = (await response.json()) as { detail?: unknown };
            if (typeof payload.detail === 'string') detail = payload.detail;
          } catch {
            // Preserve the status-based fallback for non-JSON responses.
          }
          throw new Error(detail);
        }

        if (!response.body) throw new Error('The research service returned an empty stream.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });

          const lines = buffer.split('\n');
          buffer = done ? '' : lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            applyStreamEvent(JSON.parse(line) as LightRagStreamEvent);
          }

          if (done) {
            if (buffer.trim()) applyStreamEvent(JSON.parse(buffer) as LightRagStreamEvent);
            break;
          }
        }

        updateAssistant((entry) => ({
          ...entry,
          status: 'done',
          text:
            stripReferencesSection(entry.text) ||
            (locale === 'ar'
              ? 'لم يتم العثور على إجابة في قاعدة المعرفة.'
              : 'No answer was found in the knowledge base.'),
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          updateAssistant((entry) => ({
            ...entry,
            status: entry.text ? 'cancelled' : 'error',
            error: entry.text
              ? undefined
              : locale === 'ar'
                ? 'تم إيقاف الإجابة.'
                : 'Response stopped.',
          }));
        } else {
          const reason = error instanceof Error ? error.message : 'Unexpected streaming error.';
          updateAssistant((entry) => ({
            ...entry,
            status: 'error',
            error: friendlyError(reason, locale),
          }));
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        if (aliveRef.current) {
          setIsBusy(false);
          window.setTimeout(() => textareaRef.current?.focus(), 0);
        }
      }
    },
    [isBusy, locale, messages],
  );

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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isExpanded) setIsExpanded(false);
        else {
          voiceSessionRef.current += 1;
          recognitionRef.current?.abort();
          recognitionRef.current = null;
          setVoiceState('idle');
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isExpanded]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
    } catch {}
  };

  const cancelVoiceInput = useCallback(() => {
    voiceSessionRef.current += 1;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    try {
      recognition?.abort();
    } catch {
      // The recognition session may already have closed.
    }
    if (aliveRef.current) setVoiceState('idle');
  }, []);

  const resetChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    cancelVoiceInput();
    setIsBusy(false);
    setMessages([]);
    setMessage('');
    setVoiceError(null);
    textareaRef.current?.focus();
  };

  const toggleVoiceInput = async () => {
    if (isBusy || voiceState === 'requesting') return;

    if (voiceState === 'listening' || voiceState === 'processing') {
      const recognition = recognitionRef.current;
      if (!recognition) {
        setVoiceState('idle');
        return;
      }
      setVoiceState('processing');
      try {
        recognition.stop();
      } catch {
        cancelVoiceInput();
      }
      return;
    }

    setVoiceError(null);

    if (!window.isSecureContext) {
      setVoiceError(
        locale === 'ar'
          ? 'يتطلب الإدخال الصوتي اتصالاً آمناً عبر HTTPS.'
          : 'Voice input requires a secure HTTPS connection.',
      );
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognitionConstructor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor || !navigator.mediaDevices?.getUserMedia) {
      setVoiceError(
        locale === 'ar'
          ? 'لا يدعم هذا المتصفح الإدخال الصوتي. استخدم Chrome أو Edge حديثاً، أو اكتب سؤالك.'
          : 'This browser does not support voice input. Use a current Chrome or Edge browser, or type your question.',
      );
      return;
    }

    const sessionId = ++voiceSessionRef.current;
    setVoiceState('requesting');
    let permissionStream: MediaStream | null = null;

    try {
      // Speech recognition starts only after this permission request resolves.
      permissionStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });

      permissionStream.getTracks().forEach((track) => track.stop());
      permissionStream = null;

      if (!aliveRef.current || sessionId !== voiceSessionRef.current) return;

      const recognition = new SpeechRecognitionConstructor();
      const startingMessage = message.trim();
      recognitionRef.current = recognition;
      recognition.lang = isRtl ? 'ar-MA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (sessionId === voiceSessionRef.current && aliveRef.current) {
          setVoiceState('listening');
        }
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        if (sessionId !== voiceSessionRef.current || !aliveRef.current) return;
        let transcript = '';
        for (let index = 0; index < event.results.length; index += 1) {
          transcript += event.results[index][0]?.transcript || '';
        }
        const nextMessage = [startingMessage, transcript.trim()].filter(Boolean).join(' ');
        setMessage(nextMessage);
        if (event.results[event.results.length - 1]?.isFinal) setVoiceState('processing');
      };

      recognition.onerror = (event: SpeechRecognitionErrorLike) => {
        if (sessionId !== voiceSessionRef.current || !aliveRef.current) return;
        if (event?.error !== 'aborted') setVoiceError(getVoiceError(event, locale));
      };

      recognition.onend = () => {
        if (sessionId !== voiceSessionRef.current || !aliveRef.current) return;
        recognitionRef.current = null;
        setVoiceState('idle');
        window.setTimeout(() => textareaRef.current?.focus(), 0);
      };

      recognition.start();
    } catch (error) {
      if (sessionId === voiceSessionRef.current && aliveRef.current) {
        recognitionRef.current = null;
        setVoiceState('idle');
        setVoiceError(getVoiceError(error, locale));
      }
    } finally {
      permissionStream?.getTracks().forEach((track) => track.stop());
    }
  };

  const isEmpty = messages.length === 0;

  const panel = (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn(
        'flex flex-col overflow-hidden rounded-[1.75rem] bg-[#F0F7FC] shadow-[0_28px_70px_rgba(10,37,64,0.28)] ring-1 ring-[#0A2540]/8',
        isExpanded
          ? 'h-[min(820px,calc(100dvh-1rem))] w-[min(880px,calc(100vw-1rem))] sm:h-[min(820px,calc(100dvh-2rem))] sm:w-[min(880px,calc(100vw-2rem))]'
          : 'h-[min(600px,calc(100dvh-7.75rem))] w-[min(404px,calc(100vw-2rem))]',
      )}
    >
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
                    className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
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
                    cancelVoiceInput();
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

              <div>
                <p className="mb-2 text-[0.7rem] font-bold text-[#475569]">{t('tryAsking')}</p>
                <div className="flex flex-col gap-2">
                  {LOCAL_SUGGESTIONS.map((prompt) => (
                    <button
                      key={prompt.en}
                      type="button"
                      onClick={() => send(prompt[locale as keyof typeof prompt] || prompt.en)}
                      className="rounded-2xl border border-[#0369A1]/16 bg-white px-4 py-2.5 text-start text-[0.75rem] font-medium text-[#0B4E84] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C29C41] hover:bg-[#FFF8E8] hover:text-[#0A2540]"
                    >
                      {prompt[locale as keyof typeof prompt] || prompt.en}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((entry, entryIndex) =>
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
            ) : entry.status ? (
              <motion.div
                key={entry.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2.5"
              >
                <div className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center">
                  {['connecting', 'retrieving', 'streaming'].includes(entry.status) && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-[-3px] rounded-full border border-[#C29C41]/55"
                      animate={reduceMotion ? undefined : { scale: [1, 1.16], opacity: [0.7, 0] }}
                      transition={{ duration: 1.45, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/30 bg-[#022A4E]">
                    <Image src="/ai-assistant.png" alt="" width={26} height={26} className="object-contain" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-2.5">
                  {!entry.text && ['connecting', 'retrieving'].includes(entry.status) && (
                    <RetrievalState
                      label={getProgressLabel(entry.progress, locale)}
                      reduceMotion={reduceMotion}
                    />
                  )}

                  {entry.text && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="overflow-hidden rounded-2xl rounded-ss-none border border-[#0369A1]/5 bg-white/95 shadow-[0_4px_20px_rgba(10,37,64,0.06)]"
                    >
                      {entry.status === 'streaming' && (
                        <div className="flex items-center gap-2 border-b border-[#0369A1]/6 bg-[#F8FBFD] px-4 py-2 text-[0.65rem] font-semibold text-[#0B4E84]">
                          <span className="flex gap-1" aria-hidden>
                            {[0, 1, 2].map((index) => (
                              <motion.span
                                key={index}
                                className="size-1 rounded-full bg-[#C29C41]"
                                animate={reduceMotion ? undefined : { y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
                                transition={{ duration: 0.75, delay: index * 0.12, repeat: Infinity }}
                              />
                            ))}
                          </span>
                          {locale === 'ar' ? 'تصل الإجابة الآن' : 'Answering from the library'}
                        </div>
                      )}

                      <div className="px-4 py-4">
                        <StreamingAnswer text={entry.text} active={entry.status === 'streaming'} />

                        {entry.status === 'done' && (
                          <HardcodedBookSuggestions
                            docs={HARDCODED_BOOK_SUGGESTIONS}
                            locale={locale}
                          />
                        )}

                        {entry.status !== 'streaming' && (
                          <div className="mt-3 flex items-center gap-2 border-t border-[#0369A1]/5 pt-2.5">
                            {typeof entry.responseTime === 'number' && (
                              <span className="text-[0.6rem] font-medium text-[#7A8D9C]">
                                {entry.responseTime.toFixed(1)}s
                              </span>
                            )}
                            {entry.status === 'cancelled' && (
                              <span className="text-[0.62rem] font-semibold text-[#7A8D9C]">
                                {locale === 'ar' ? 'تم إيقاف الإجابة' : 'Response stopped'}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(entry.id, stripReferencesSection(entry.text))
                              }
                              className="ms-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.64rem] font-semibold text-[#475569] transition-colors hover:bg-[#F0F7FC] hover:text-[#0A2540]"
                            >
                              {copiedId === entry.id ? (
                                <><LuCheck className="size-2.5 text-green-600" aria-hidden />{t('copied')}</>
                              ) : (
                                <><LuCopy className="size-2.5" aria-hidden />{t('copy')}</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {entry.error && (
                    <motion.div
                      role="alert"
                      initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-[#D97757]/20 bg-[#FFF5F1] px-3.5 py-3 text-[0.72rem] leading-relaxed text-[#7C2D20]"
                    >
                      <p>{entry.error}</p>
                      <button
                        type="button"
                        onClick={() => send(entry.request)}
                        disabled={isBusy}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#D97757]/25 bg-white px-3 py-1.5 text-[0.65rem] font-bold text-[#7C2D20] transition hover:border-[#D97757]/50 hover:bg-[#FFF9F6] disabled:opacity-50"
                      >
                        <LuRefreshCcw className="size-3" aria-hidden />
                        {locale === 'ar' ? 'حاول مرة أخرى' : 'Try again'}
                      </button>
                    </motion.div>
                  )}

                  {entry.status === 'done' && entryIndex === messages.length - 1 && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 pt-0.5"
                    >
                      <p className="px-1 text-[0.65rem] font-bold text-[#52687A]">
                        {locale === 'ar' ? 'يمكنك المتابعة بسؤال:' : 'Continue with a follow-up:'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {getFollowUpSuggestions(locale).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => send(suggestion)}
                            disabled={isBusy}
                            className="rounded-xl border border-[#0369A1]/14 bg-white/90 px-3 py-2 text-start text-[0.68rem] font-semibold leading-snug text-[#0B4E84] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C29C41]/70 hover:bg-[#FFF9EA] hover:text-[#0A2540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] disabled:pointer-events-none disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
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
                  {!entry.done && (
                    <div className="flex flex-col gap-2.5 py-1.5 ps-1">
                      {entry.run.steps.map((step, idx) => {
                        if (idx > entry.revealed) return null;
                        const isActive = idx === entry.revealed;
                        const stepText = step.text?.[locale as keyof typeof step.text] || step.text?.en || 'Processing...';

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, filter: 'blur(4px)', x: isRtl ? 10 : -10 }}
                            animate={{ opacity: isActive ? 1 : 0.4, filter: 'blur(0px)', x: 0 }}
                            className="flex items-center gap-2.5 text-[0.75rem]"
                          >
                            <span
                              className={cn(
                                'block h-1.5 w-1.5 shrink-0 rounded-full',
                                isActive ? 'animate-pulse bg-[#C29C41]' : 'bg-[#94a3b8]'
                              )}
                            />
                            <span
                              className={
                                isActive
                                  ? 'font-semibold text-[#0B4E84]'
                                  : 'font-medium text-[#64748b]'
                              }
                            >
                              {stepText}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {entry.done && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="rounded-2xl rounded-ss-none bg-white/95 px-4 py-4 shadow-[0_4px_20px_rgba(10,37,64,0.06)] border border-[#0369A1]/5">
                        <AnswerText text={entry.run.answer[locale as keyof typeof entry.run.answer] || entry.run.answer.en} />

                        {entry.run.docs.length > 0 && (
                          <div className="mt-5 flex flex-col gap-3">
                            {entry.run.docs.map((doc, idx) => (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.1), duration: 0.4 }}
                                className="group relative flex gap-3.5 rounded-xl border border-transparent bg-[#F8FAFC]/60 p-2.5 transition-all duration-300 hover:bg-white hover:border-[#C29C41]/30 hover:shadow-[0_8px_24px_rgba(194,156,65,0.12)]"
                              >
                                {/* Sleek Cover Image with forced dimensions to prevent collapsing */}
                                <div className="relative h-[115px] w-[80px] min-w-[80px] shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md bg-[#FFF8E8]">
                                  <Image
                                    src={doc.cover}
                                    alt={doc.title[locale as keyof typeof doc.title] || ''}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent mix-blend-multiply" />
                                </div>

                                {/* Content & Buttons */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                                  <div>
                                    <h4 className="line-clamp-2 text-[0.8rem] font-bold leading-snug text-[#0A2540] group-hover:text-[#0B4E84] transition-colors">
                                      {doc.title[locale as keyof typeof doc.title] || doc.title.en}
                                    </h4>
                                    <p className="mt-1 line-clamp-2 text-[0.68rem] leading-relaxed text-[#475569]">
                                      {doc.summary[locale as keyof typeof doc.summary] || doc.summary.en}
                                    </p>
                                  </div>

                                  {/* Custom Relevance Meter (Icon Removed) & Actions */}
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center text-[0.65rem] font-bold text-[#8B681C] cursor-help">
                                              {doc.relevance}%
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            {locale === 'ar' ? 'نسبة التطابق مع استفسارك' : 'Relevance to your query'}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0A2540]/10">
                                        <div
                                          className="h-full rounded-full bg-gradient-to-r from-[#C29C41] to-[#e8c96a]"
                                          style={{ width: `${doc.relevance}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-0.5">
                                      <button
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#C29C41] to-[#e8c96a] px-3.5 py-1.5 text-[0.65rem] font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(194,156,65,0.3)]"
                                      >
                                        <LuBookOpen className="size-3" />
                                        {locale === 'ar' ? 'تصفح الكتاب' : 'Read Book'}
                                      </button>
                                      <button
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#C29C41]/40 bg-white px-3.5 py-1.5 text-[0.65rem] font-bold text-[#C29C41] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C29C41] hover:bg-[#FFF8E8]"
                                      >
                                        <LuBookmark className="size-3" />
                                        {locale === 'ar' ? 'حفظ' : 'Save'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        <div className="mt-3.5 flex items-center gap-2 border-t border-[#0369A1]/5 pt-2.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(entry.id, entry.run.answer[locale as keyof typeof entry.run.answer] || entry.run.answer.en)}
                            className="ms-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.64rem] font-semibold text-[#475569] transition-colors hover:bg-[#F0F7FC] hover:text-[#0A2540]"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <LuCheck className="size-2.5 text-green-600" aria-hidden />
                                <span className="text-green-700">{t('copied')}</span>
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
                    </motion.div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-[#0369A1]/10 bg-white p-3 sm:p-4">
        <div className={cn(isExpanded && 'mx-auto w-full max-w-3xl')}>
          <div
            className={cn(
              'flex items-end gap-1.5 rounded-2xl bg-[#F0F7FC] p-1.5 transition-all duration-300',
              message.trim()
                ? 'ring-1 ring-[#C29C41] shadow-sm'
                : 'ring-1 ring-transparent focus-within:ring-[#0369A1]/25 focus-within:shadow-sm',
            )}
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isBusy || voiceState === 'requesting'}
              className={cn(
                'relative shrink-0 rounded-xl p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] disabled:cursor-not-allowed disabled:opacity-55',
                voiceState === 'listening' || voiceState === 'processing'
                  ? 'bg-[#C29C41]/16 text-[#8B681C] ring-1 ring-[#C29C41]/35'
                  : 'text-[#0369A1] hover:bg-[#0369A1]/8 hover:text-[#8B681C]',
              )}
              aria-label={
                voiceState === 'listening'
                  ? locale === 'ar' ? 'إيقاف الاستماع' : 'Stop listening'
                  : voiceState === 'requesting'
                    ? locale === 'ar' ? 'في انتظار إذن الميكروفون' : 'Waiting for microphone permission'
                    : t('voiceInput')
              }
              aria-pressed={voiceState === 'listening'}
            >
              {voiceState === 'requesting' ? (
                <span className="block size-4 animate-spin rounded-full border-2 border-[#0369A1]/25 border-t-[#0369A1] motion-reduce:animate-pulse" aria-hidden />
              ) : (
                <>
                  <LuMic className={cn('size-4', voiceState === 'listening' && 'animate-pulse')} />
                  {voiceState === 'listening' && (
                    <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-[#B94732] shadow-[0_0_0_3px_rgba(185,71,50,0.14)]" aria-hidden />
                  )}
                </>
              )}
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
              className={cn('flex-1 bg-transparent border-0 focus-visible:ring-0', isExpanded ? 'max-h-[200px]' : 'max-h-[120px]')}
            />

            <Button
              type="button"
              size="icon-sm"
              onClick={() => (isBusy ? abortRef.current?.abort() : send(message))}
              disabled={!isBusy && !message.trim()}
              className={cn(
                'mb-1 shrink-0 text-white transition-colors [&_svg]:text-white',
                isBusy
                  ? 'bg-[#0A2540] hover:bg-[#163C5C]'
                  : 'bg-gradient-to-br from-[#034582] to-[#022A4E] hover:from-[#0B4E84] hover:to-[#034582]',
              )}
              aria-label={
                isBusy
                  ? locale === 'ar' ? 'إيقاف الإجابة' : 'Stop response'
                  : t('sendMessage')
              }
            >
              {isBusy ? <LuSquare className="size-3.5 fill-current" /> : <LuArrowUp className="size-4" />}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {voiceError ? (
              <motion.div
                key="voice-error"
                role="alert"
                initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 flex items-start gap-2 rounded-xl border border-[#D97757]/20 bg-[#FFF5F1] px-3 py-2 text-[0.66rem] leading-relaxed text-[#7C2D20]"
              >
                <span className="flex-1">{voiceError}</span>
                <button
                  type="button"
                  onClick={() => setVoiceError(null)}
                  className="shrink-0 rounded-md p-0.5 text-[#7C2D20]/70 transition hover:bg-[#D97757]/10 hover:text-[#7C2D20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757]/45"
                  aria-label={locale === 'ar' ? 'إغلاق رسالة الخطأ' : 'Dismiss error'}
                >
                  <LuX className="size-3.5" aria-hidden />
                </button>
              </motion.div>
            ) : voiceState !== 'idle' ? (
              <motion.p
                key={voiceState}
                role="status"
                aria-live="polite"
                initial={reduceMotion ? false : { opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="mt-2 px-1 text-center text-[0.64rem] font-semibold text-[#0B4E84]"
              >
                {voiceState === 'requesting'
                  ? locale === 'ar' ? 'اسمح بالوصول إلى الميكروفون للبدء.' : 'Allow microphone access to begin.'
                  : voiceState === 'listening'
                    ? locale === 'ar' ? 'أستمع الآن… اضغط على الميكروفون للإيقاف.' : 'Listening… press the microphone to stop.'
                    : locale === 'ar' ? 'جارٍ إنهاء النص الصوتي…' : 'Finishing your voice input…'}
              </motion.p>
            ) : null}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[#0A2540]/45 p-2 backdrop-blur-sm sm:p-4"
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

      <div dir="ltr" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
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
              cancelVoiceInput();
              setIsOpen(false);
              setIsExpanded(false);
            } else {
              setIsOpen(true);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex size-14 items-center justify-center rounded-full shadow-2xl sm:size-16"
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
