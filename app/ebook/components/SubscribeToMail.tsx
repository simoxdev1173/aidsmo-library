'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

const bookImages = [
  '/trendingSection/t-12.jpg',
  '/bookCovers/i-2-1.png',
  '/trendingSection/t-7.png',
  '/trendingSection/t-9.png',
  '/trendingSection/t-3.png',
];

const SubscribeToMail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!validateEmail(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail('');
    } catch {
      setError('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F7F0E1]" dir="rtl">
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="corner-frame grid gap-10 border border-[#C29C41]/35 bg-white/88 p-6 shadow-[0_22px_58px_rgba(10,37,64,0.1)] backdrop-blur-sm md:p-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-4xl">
              ابقَ على اتصال بآخر مستجدات المكتبة الرقمية
            </h2>

            <p className="mt-5 font-academic text-xl leading-relaxed text-[#475569]">
              انضم إلى نشرتنا البريدية لتصلك أحدث المجلات وتقارير التعدين وإصدارات المنظمة فور صدورها.
            </p>

            <div className="mt-8 max-w-xl">
              {isSuccess ? (
                <div className="border border-[#C29C41]/30 bg-[#FFF8E1] p-4 text-center text-[#003652]">
                  تم الاشتراك بنجاح. شكراً لك.
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <label htmlFor="newsletter-email" className="sr-only">
                    البريد الإلكتروني
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        className="h-14 w-full border border-[#C29C41]/25 bg-[#FFFCF4] px-4 text-right text-[#0A2540] placeholder:font-academic placeholder:text-[#64748B] focus:border-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/30"
                        placeholder="أدخل بريدك الإلكتروني"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'newsletter-error' : undefined}
                      />
                      {error && (
                        <p id="newsletter-error" className="mt-2 text-sm font-medium text-red-600">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="engraved brass-gradient h-14 shrink-0 border border-[#C29C41] px-8 text-base font-bold text-[#0A2540] transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white"
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'اشترك الآن'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {['محتوى حصري', 'تحديثات مستمرة', 'مجاني 100%'].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 border border-[#C29C41]/25 bg-[#FFF8E1] px-4 py-2 text-sm font-semibold text-[#334155]">
                  <span className="h-2 w-2 rounded-full bg-[#C29C41]" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="h-[500px] overflow-hidden">
              <div className="marquee grid grid-cols-2 gap-4 place-items-center">
                {[false, true].map((reverse) => (
                  <div key={String(reverse)} className={`${reverse ? 'marquee-reverse ' : ''}flex flex-col gap-6 overflow-hidden`}>
                    {[0, 1].map((set) => (
                      <div key={set} aria-hidden={set === 1} className="marquee-hero flex flex-col items-center gap-6">
                        {bookImages.map((image, idx) => (
                          <Image
                            key={`${image}-${set}-${idx}`}
                            alt="صورة كتاب"
                            src={image}
                            width={240}
                            height={240}
                            sizes="240px"
                            className="w-56 border border-[#C29C41]/25 object-cover shadow-md"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeToMail;
