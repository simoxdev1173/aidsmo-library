'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  LuBrain,
  LuChevronDown,
  LuCheck,
  LuFilter,
  LuGitCompare,
  LuLayers,
  LuChartBar,
  LuPenLine,
  LuSearch,
} from 'react-icons/lu';

import { cn } from '@/utils/cn';
import type { ToolName, ToolStep } from './agent';

const TOOL_ICONS: Record<ToolName, React.ComponentType<{ className?: string }>> = {
  understand_query: LuBrain,
  search_library: LuSearch,
  filter_metadata: LuFilter,
  rank_results: LuLayers,
  compare_documents: LuGitCompare,
  fetch_statistics: LuChartBar,
  compose_answer: LuPenLine,
};

type ToolTraceProps = {
  steps: ToolStep[];
  revealed: number;
  done: boolean;
  locale: 'ar' | 'en';
};

export default function ToolTrace({ steps, revealed, done, locale }: ToolTraceProps) {
  const t = useTranslations('chatbotWidget');
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse once the run finishes, unless the user pinned it open.
  const isCollapsed = done && collapsed;
  const visible = steps.slice(0, revealed);
  const active = done ? null : steps[revealed];

  return (
    <div className="overflow-hidden rounded-xl border border-[#0369A1]/12 bg-white/70 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        disabled={!done}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-start transition-colors',
          done ? 'cursor-pointer hover:bg-[#F0F7FC]' : 'cursor-default',
        )}
      >
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-md',
            done ? 'bg-[#C29C41]/15 text-[#8B681C]' : 'bg-[#0369A1]/10 text-[#0369A1]',
          )}
        >
          {done ? (
            <LuCheck className="size-3" aria-hidden />
          ) : (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="block size-3 rounded-full border-[1.5px] border-current border-t-transparent"
              aria-hidden
            />
          )}
        </span>

        <span className="flex-1 text-[0.7rem] font-bold text-[#0A2540]">
          {done
            ? t('toolsUsed', { count: steps.length })
            : (active ?? steps[steps.length - 1]).label[locale]}
        </span>

        {done && (
          <LuChevronDown
            className={cn(
              'size-3.5 text-[#475569] transition-transform duration-300',
              isCollapsed && '-rotate-90 rtl:rotate-90',
            )}
            aria-hidden
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ol className="space-y-0 border-t border-[#0369A1]/10 px-3 py-2">
              {visible.map((step, index) => {
                const Icon = TOOL_ICONS[step.tool];
                const isLast = index === visible.length - 1;

                return (
                  <motion.li
                    key={`${step.tool}-${index}`}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex gap-2.5 pb-2 last:pb-0"
                  >
                    {/* Connector rail */}
                    {!isLast && (
                      <span
                        className="absolute top-5 h-[calc(100%-12px)] w-px bg-[#0369A1]/15 start-[7px]"
                        aria-hidden
                      />
                    )}

                    <span className="relative z-10 mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#F0F7FC] ring-1 ring-[#0369A1]/20">
                      <Icon className="size-2 text-[#0369A1]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-bold leading-tight text-[#0A2540]">
                        {step.label[locale]}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.62rem] leading-tight text-[#475569]">
                        {step.detail[locale]}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
