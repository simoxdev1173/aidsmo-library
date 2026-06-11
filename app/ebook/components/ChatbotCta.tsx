'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  LuBookOpen,
  LuChevronLeft,
  LuMessageCircle,
  LuSparkles,
} from 'react-icons/lu';

const primaryButton =
  'engraved brass-gradient inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#C29C41] px-8 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#FFF8E8]';

function BrassDivider() {
  return (
    <div className="mt-3 flex items-center justify-end gap-3" aria-hidden>
      <span className="h-px w-20 bg-[#C29C41]/55" />
      <span className="h-1.5 w-1.5 rotate-45 border border-[#C29C41]" />
    </div>
  );
}

function ChatbotVisualCard() {
  const books = [
    { title: 'إدارة المعرفة', cover: '/bookCovers/i-2-1.png' },
    { title: 'رأس المال الفكري', cover: '/latest-cover/b-4.png' },
    { title: 'التحول الرقمي', cover: '/trendingSection/t-7.png' },
  ];

  return (
    <div className="relative h-full min-h-[500px] overflow-hidden rounded-[14px] border border-[#C29C41]/20 bg-[#071A2E] shadow-[0_22px_58px_rgba(10,37,64,0.16)]">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(194,156,65,0.18),transparent_30%),linear-gradient(135deg,rgba(10,37,64,0.45),rgba(7,26,46,0.96))]"
        aria-hidden
      />

      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.10) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
        aria-hidden
      />

      <div className="absolute bottom-8 right-8 h-48 w-28 opacity-70" aria-hidden>
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="absolute right-0 h-4 rounded-sm bg-[#FFF8E8]/70 shadow-[0_0_24px_rgba(232,201,106,0.16)]"
            style={{
              bottom: `${item * 18}px`,
              width: `${70 + item * 8}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-7 text-right md:p-8">
        <div>
          <h3 className="max-w-xs font-academic text-xl font-bold leading-[1.45] text-white md:text-2xl">
            هنا، المعرفة تجد إجاباتها.
          </h3>

          <p className="mt-5 max-w-xs font-academic text-xs font-bold leading-relaxed text-[#E8C96A]">
            ذكاء اصطناعي يفهم أسئلتك ويصل بك إلى ما تبحث عنه
          </p>
        </div>

        <div className="mr-auto w-full max-w-[330px] rounded-[28px] border border-sky-300/32 bg-sky-300/[0.08] p-4 shadow-[0_0_44px_rgba(56,189,248,0.28)] backdrop-blur-md">


          <div className="space-y-2.5">
            <div className="rounded-xl bg-white/88 px-3 py-2 text-xs font-semibold leading-relaxed text-[#0A2540]">
              مرحباً، كيف يمكنني مساعدتك؟
            </div>

            <div className="mr-auto max-w-[86%] rounded-xl bg-[#0B4E84]/88 px-3 py-2 text-xs font-semibold leading-relaxed text-white">
              أريد كتباً في مجال معلومات صناعية
            </div>

            <div className="rounded-xl bg-white/88 px-3 py-2 text-xs font-semibold leading-relaxed text-[#0A2540]">
              إليك بعض الإصدارات المقترحة في مجال المعلومات الصناعية
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {books.map((book) => (
              <div key={book.title} className="rounded-md border border-white/18 bg-white/10 p-2">
                <div className="relative mb-2 h-14 overflow-hidden rounded-sm bg-[#FFF8E8] shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    sizes="86px"
                    className="object-cover"
                  />
                </div>
                <p className="text-[0.62rem] font-bold leading-4 text-white">{book.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex h-8 items-center justify-between rounded-full bg-[#0B4E84]/70 px-4">
            <span className="text-xs text-white/60">•••</span>
            <span className="h-4 w-4 rounded-full border border-sky-200/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotCTA() {
  return (
    <section
      id="smart-assistant"
      className="relative overflow-hidden bg-[#F7F0E1] py-16 md:py-24"
      dir="rtl"
      aria-label="المساعد الذكي في المكتبة الرقمية"
    >
      <Image
        src="/background-01.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.18]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,240,0.96)_0%,rgba(247,240,225,0.88)_52%,rgba(255,250,240,0.98)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-right">
          <h2 className="academic-heading text-3xl leading-tight text-[#0A2540] md:text-4xl">
            مساعدك الذكي في المكتبة الرقمية
          </h2>


          <p className="mt-4 font-academic text-base leading-relaxed text-[#475569] md:text-lg">
            تجربة بحث وإرشاد متقدمة تعينك على الوصول إلى المعرفة بسهولة وموثوقية
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[250px_250px]">
          {/* Main cream card */}
          <div className="relative overflow-hidden rounded-[14px] border border-[#C29C41]/24 bg-[#FFF8E8]/95 p-7 text-center shadow-[0_18px_48px_rgba(10,37,64,0.1)] md:p-9 lg:col-span-5">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(194,156,65,0.35) 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
              aria-hidden
            />

            <div
              className="pointer-events-none absolute -right-24 bottom-[-110px] h-80 w-80 rounded-full border border-[#C29C41]/20"
              aria-hidden
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center">
           

              <h3 className="mt-6 font-academic text-3xl font-bold leading-tight text-[#0A2540] md:text-4xl">
                المساعد الذكي للمكتبة
              </h3>

              <p className="mt-5 max-w-lg font-academic text-base leading-loose text-[#475569] md:text-lg">
                اطرح أسئلتك حول الإصدارات والقطاعات واحصل على إرشاد سريع ودقيق داخل المكتبة الرقمية.
              </p>

              <Link href="#chatbot" className={`${primaryButton} mt-8`}>
                ابدأ المحادثة
              </Link>
            </div>
          </div>

          {/* Dark immediate search card */}
          <Link
            href="#chatbot"
            className="group relative overflow-hidden rounded-[14px] border border-[#C29C41]/20 bg-[#071D33] p-7 text-center shadow-[0_18px_48px_rgba(10,37,64,0.13)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/55 lg:col-span-3"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(232,201,106,0.17),transparent_28%),linear-gradient(135deg,rgba(11,78,132,0.32),transparent_55%)]"
              aria-hidden
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center">
              <h3 className="font-academic text-2xl font-bold text-[#E8C96A]">
                بحث فوري
              </h3>

              <p className="mt-5 max-w-[15rem] font-academic text-base leading-loose text-white/82">
                احصل على إجابات دقيقة من مصادر موثوقة في المكتبة.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#E8C96A] transition duration-300 group-hover:text-white">
                استكشف الإصدارات
                <LuChevronLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Large visual right card */}
          <div className="lg:col-span-4 lg:row-span-2">
            <ChatbotVisualCard />
          </div>

          {/* Bottom feature card 1 */}
          <Link
            href="#chatbot"
            className="group relative overflow-hidden rounded-[14px] border border-[#C29C41]/18 bg-[#071D33] p-7 text-center shadow-[0_18px_48px_rgba(10,37,64,0.13)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/55 lg:col-span-4"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_74%,rgba(125,211,252,0.14),transparent_28%)]"
              aria-hidden
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center">

              <h3 className="font-academic text-2xl font-bold text-[#E8C96A]">
                اقتراحات ذكية
              </h3>

              <p className="mt-4 max-w-sm font-academic text-base leading-loose text-white/82">
                توصيات مخصصة بناءً على اهتماماتك واحتياجاتك البحثية.
              </p>
            </div>
          </Link>

          {/* Bottom feature card 2 */}
          <Link
            href="/catalog/industry"
            className="group relative overflow-hidden rounded-[14px] border border-[#C29C41]/18 bg-[#0B4E84] p-7 text-center shadow-[0_18px_48px_rgba(10,37,64,0.13)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/55 lg:col-span-4"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_78%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_60%)]"
              aria-hidden
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center">

              <h3 className="font-academic text-2xl font-bold text-[#E8C96A]">
                وصول أسرع للمعلومة
              </h3>

              <p className="mt-4 max-w-sm font-academic text-base leading-loose text-white/86">
                مسارات مختصرة للوصول إلى الكتب والدوريات والبيانات ذات الصلة.
              </p>
            </div>
          </Link>
        </div>

        {/* Bottom strip */}
        <div className="mt-5 rounded-[14px] border border-[#C29C41]/18 bg-white/70 p-5 shadow-[0_16px_42px_rgba(10,37,64,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center text-[#C29C41]">
                <LuBookOpen className="h-10 w-10" strokeWidth={1.45} />
              </span>

              <div>
                <h3 className="font-academic text-lg font-bold text-[#0A2540]">
                  تجربة ذكية. معرفة أعمق.
                </h3>

                <p className="mt-1 font-academic text-base leading-relaxed text-[#475569]">
                  المكتبة الرقمية بين يديك، والمساعد الذكي معك في كل خطوة.
                </p>
              </div>
            </div>

            <Link
              href="#chatbot"
              className="inline-flex h-11 items-center justify-center gap-3 rounded-full border border-[#C29C41]/45 bg-white/40 px-6 text-sm font-bold text-[#8B681C] transition duration-300 hover:border-[#C29C41] hover:bg-[#FFF8E8] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
            >
              كيف يعمل المساعد الذكي؟
              <LuChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
