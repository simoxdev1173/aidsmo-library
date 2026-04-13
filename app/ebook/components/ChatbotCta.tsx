'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LuSparkles, LuArrowLeft } from 'react-icons/lu';

const ChatbotCTA = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#F0F7FC]" dir="rtl">
      <div className="mx-auto max-w-5xl">

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
          style={{ minHeight: '420px' }}
        >

          {/* Background image */}
          <Image
            src="/chatbot-card.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />

          {/* Overlay — deep blue tint to ensure text pops */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(2,42,78,0.82) 0%, rgba(3,69,130,0.60) 50%, rgba(2,42,78,0.85) 100%)',
            }}
          />

          {/* Gold top border */}
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{
              background: 'linear-gradient(to left, transparent, #C29C41, #e8c96a, #C29C41, transparent)',
            }}
          />

          {/* Decorative corner ornament — top right */}
          <div className="absolute top-6 right-6 opacity-30">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M60 0 L60 60 L0 60" stroke="#C29C41" strokeWidth="0.8" fill="none" />
              <path d="M60 12 L60 60 L12 60" stroke="#C29C41" strokeWidth="0.5" fill="none" />
              <circle cx="60" cy="60" r="4" fill="#C29C41" />
            </svg>
          </div>

          {/* Decorative corner ornament — bottom left */}
          <div className="absolute bottom-6 left-6 opacity-30">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M0 60 L0 0 L60 0" stroke="#C29C41" strokeWidth="0.8" fill="none" />
              <path d="M0 48 L0 0 L48 0" stroke="#C29C41" strokeWidth="0.5" fill="none" />
              <circle cx="0" cy="0" r="4" fill="#C29C41" />
            </svg>
          </div>

          {/* Subtle gold glow blob — top left */}
          <div
            className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: '#C29C41' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-14 md:px-16 md:py-16">

            {/* Left side — text */}
            <div className="flex-1 text-right">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                style={{ borderColor: 'rgba(194,156,65,0.4)', backgroundColor: 'rgba(194,156,65,0.08)' }}
              >
                <LuSparkles size={13} style={{ color: '#C29C41' }} />
                <span className="text-xs font-bold tracking-widest" style={{ color: '#C29C41' }}>
                  مساعد ذكاء اصطناعي
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-4 text-3xl text-nowrap font-extrabold leading-snug "
                style={{ color: '#C29C41' }}
              >
                تحدّث مع مساعدنا 
                <span className="font-black pr-4" style={{ color: '#e8c96a' }}>
                  الذكي الآن
                </span>
              </motion.h2>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-5 flex items-center justify-end gap-2"
              >
                <span className="h-px w-4 rounded-full" style={{ backgroundColor: '#0369A1' }} />
                <span className="h-px w-16 rounded-full" style={{ backgroundColor: '#C29C41' }} />
              </motion.div>

            <motion.p
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ delay: 0.45, duration: 0.5 }}
  className="mb-8 text-sm leading-relaxed md:text-base"
  style={{ color: 'rgba(255,255,255,0.70)' }}
>
  اسأل عن المجلات ، الدراسات، والتقارير الصناعية والتعدينية —
  <br className="hidden md:block" />
  مساعدنا يرشدك إلى ما تبحث عنه في ثوانٍ.
</motion.p>
              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Link
                  href="/chatbot"
                  className="group inline-flex items-center gap-3 rounded-2xl px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:gap-4 hover:shadow-lg"
                  style={{
                    backgroundColor: '#C29C41',
                    color: '#0a1628',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#e8c96a';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C29C41';
                  }}
                >
                  ابدأ المحادثة
                  <LuArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            </div>

            {/* Right side — AI logo with glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <div className="relative flex items-center justify-center">

                {/* Outer pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute h-56 w-56 rounded-full"
                  style={{ border: '1px solid #C29C41' }}
                />

                {/* Middle ring */}
                <motion.div
                  animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute h-44 w-44 rounded-full"
                  style={{ border: '1px solid rgba(194,156,65,0.6)' }}
                />

                {/* Gold glow behind logo */}
                <div
                  className="absolute h-36 w-36 rounded-full blur-2xl opacity-30"
                  style={{ backgroundColor: '#C29C41' }}
                />

                {/* Glass circle */}
                <div
                  className="relative flex h-36 w-36 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(194,156,65,0.35)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Image
                    src="/ai.png"
                    alt="AI Assistant"
                    width={140}
                    height={140}
                    className="object-contain drop-shadow-lg"
                  />
                </div>

              </div>
            </motion.div>

          </div>

          {/* Bottom gold bar */}
          <div
            className="absolute inset-x-0 bottom-0 h-[2px]"
            style={{
              background: 'linear-gradient(to left, transparent, rgba(194,156,65,0.4), transparent)',
            }}
          />

        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotCTA;