'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { LuArrowUpRight, LuFileText } from 'react-icons/lu';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { TYPE_LABELS } from './agent';
import type { LibraryDoc } from './demo-data';

type DocumentCardProps = {
  doc: LibraryDoc;
  locale: 'ar' | 'en';
  relevance: number;
  index: number;
  onOpen?: () => void;
};

export default function DocumentCard({
  doc,
  locale,
  relevance,
  index,
  onOpen,
}: DocumentCardProps) {
  const t = useTranslations('chatbotWidget');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={doc.href}
        onClick={onOpen}
        className={cn(
          'group flex gap-3 rounded-2xl border border-[#0369A1]/12 bg-white p-2.5',
          'shadow-[0_2px_10px_rgba(10,37,64,0.04)] transition-all duration-300',
          'hover:-translate-y-0.5 hover:border-[#C29C41]/55 hover:shadow-[0_10px_26px_rgba(10,37,64,0.12)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]',
        )}
      >
        {/* Cover */}
        <div className="relative h-[78px] w-[56px] shrink-0 overflow-hidden rounded-lg bg-[#FFF8E8] shadow-[0_4px_12px_rgba(10,37,64,0.16)] ring-1 ring-[#C29C41]/20">
          <Image
            src={doc.cover}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Spine sheen */}
          <span
            className="pointer-events-none absolute inset-y-0 start-0 w-1.5 bg-gradient-to-r from-black/25 to-transparent"
            aria-hidden
          />
        </div>

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start gap-1.5">
            <h4 className="line-clamp-2 flex-1 text-[0.82rem] font-bold leading-snug text-[#0A2540] transition-colors group-hover:text-[#0B4E84]">
              {doc.title[locale]}
            </h4>
            <LuArrowUpRight
              className="mt-0.5 size-3.5 shrink-0 text-[#C29C41] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:-scale-x-100"
              aria-hidden
            />
          </div>

          <p className="mt-1 line-clamp-2 text-[0.7rem] leading-relaxed text-[#475569]">
            {doc.summary[locale]}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1.5">
            <Badge variant="default">{TYPE_LABELS[doc.type][locale]}</Badge>
            <span className="text-[0.65rem] font-semibold text-[#475569]">{doc.year}</span>
            <span className="text-[0.65rem] text-[#0A2540]/25" aria-hidden>
              •
            </span>
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-[#475569]">
              <LuFileText className="size-2.5" aria-hidden />
              {t('pagesCount', { count: doc.pages })}
            </span>

            {/* Relevance meter */}
            <span
              className="ms-auto inline-flex items-center gap-1.5"
              title={t('relevance', { percent: relevance })}
            >
              <span className="h-1 w-8 overflow-hidden rounded-full bg-[#0A2540]/10">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-[#C29C41] to-[#e8c96a]"
                  style={{ width: `${relevance}%` }}
                />
              </span>
              <span className="text-[0.62rem] font-bold tabular-nums text-[#8B681C]">
                {relevance}%
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
