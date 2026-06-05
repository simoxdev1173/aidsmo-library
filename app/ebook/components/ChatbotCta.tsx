'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LuArrowLeft } from 'react-icons/lu';

const ChatbotCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8F6ED] px-4 py-20 md:py-28" dir="rtl">
   

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="corner-frame relative grid overflow-hidden border border-[#C29C41]/35 bg-[#0A2540] lg:grid-cols-[1.1fr_0.9fr]"
        >
             <Image
               src="/background-01.png"
               alt=""
               fill
               sizes="100vw"
               className="object-cover opacity-[0.44] contrast-110 saturate-125"
               aria-hidden
             />
             <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.74)_0%,rgba(247,240,225,0.46)_48%,rgba(255,252,244,0.82)_100%)]" aria-hidden />
             <div
               className="pointer-events-none absolute inset-0 opacity-[0.14]"
               style={{
                 backgroundImage:
                   'linear-gradient(rgba(10,37,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(194,156,65,0.2) 1px, transparent 1px)',
                 backgroundSize: '56px 56px',
               }}
               aria-hidden
             />
             <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
             <div className="absolute inset-x-0 bottom-0 h-px bg-[#C29C41]/35" aria-hidden />

          <div className="relative z-10  px-7 py-12 md:px-12 md:py-16">
            <h2 className="mt-5 max-w-2xl pb-5 font-academic text-4xl font-bold leading-tight text-white md:text-4xl">
              تحدث مع مساعدنا الذكي الآن
            </h2>


            <p className="max-w-2xl font-academic text-xl leading-relaxed text-white/78">
              اسأل عن المجلات والدراسات والتقارير الصناعية والتعدينية، وسيقودك المساعد إلى ما تبحث عنه في ثوان.
            </p>

            <Link
              href="/chatbot"
              className="engraved brass-gradient mt-9 inline-flex h-12 items-center gap-3 border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]"
            >
              ابدأ المحادثة
              <LuArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative z-10 flex min-h-[320px] items-center justify-center px-8 pb-12 lg:pb-0">
            <div className="corner-card relative border border-[#C29C41]/35 bg-white/10 p-8 backdrop-blur-md">
              
              <Image
                src="/ai.png"
                alt="مساعد الذكاء الاصطناعي"
                width={190}
                height={190}
                className="mx-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotCTA;
