'use client';
import TextFormInput from '@/components/form/TextFormInput';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

const bookImages = [
  '/trendingSection/t-1.png',
  '/trendingSection/t-11.png',
  '/trendingSection/t-7.png',
  '/trendingSection/t-5.png',
  '/trendingSection/t-3.png',
];

const SubscribeToMail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    <section className="bg-[#F0F7FC]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold leading-tight text-[#1e293b] md:text-4xl">
             ابقَ على اتصال بآخر مستجدات المكتبة الرقمية
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#475569]">
             انضم إلى نشرتنا البريدية لتصلك أحدث مجلات  ، تقارير التعدين، و اصدارات المنظمة فور صدورها.
            </p>

            {/* Subscribe Form */}
            <div className="mt-8 max-w-xl">
              {isSuccess ? (
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-green-700">✓ تم الاشتراك بنجاح! شكراً لك.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <TextFormInput
                        name="email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        className="h-14 w-full rounded-lg border-0 bg-white px-4 text-right placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0369a1]"
                        placeholder="أدخل بريدك الإلكتروني"
                        error={error}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 shrink-0 rounded-lg bg-[#0369a1] px-8 text-base font-semibold text-white transition-all hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          جاري الإرسال...
                        </span>
                      ) : (
                        'اشترك الآن'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-6">
              {['محتوى حصري', 'تحديثات مستمرة', 'مجاني 100%'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0369a1]/10">
                    <svg
                      className="h-4 w-4 text-[#0369a1]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#475569]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Images Marquee */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="h-[495px] overflow-hidden rounded-2xl">
              <div className="marquee grid grid-cols-2 gap-4 place-items-center">
                {/* Column 1 */}
                <div className="flex flex-col gap-6 overflow-hidden">
                  <div className="marquee-hero flex flex-col items-center gap-6">
                    {bookImages.map((image, idx) => (
                      <Image
                        key={idx}
                        alt="صورة كتاب"
                        src={image}
                        width={240}
                        height={240}
                        sizes="240px"
                        className="w-60 rounded-lg object-cover shadow-md"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden
                    className="marquee-hero flex flex-col items-center gap-6"
                  >
                    {bookImages.map((image, idx) => (
                      <Image
                        key={idx}
                        alt="صورة كتاب"
                        src={image}
                        width={240}
                        height={240}
                        sizes="240px"
                        className="w-60 rounded-lg object-cover shadow-md"
                      />
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="marquee-reverse flex flex-col gap-6 overflow-hidden">
                  <div className="marquee-hero flex flex-col items-center gap-6">
                    {bookImages.map((image, idx) => (
                      <Image
                        key={idx}
                        alt="صورة كتاب"
                        src={image}
                        width={240}
                        height={240}
                        sizes="240px"
                        className="w-60 rounded-lg object-cover shadow-md"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden
                    className="marquee-hero flex flex-col items-center gap-6"
                  >
                    {bookImages.map((image, idx) => (
                      <Image
                        key={idx}
                        alt="صورة كتاب"
                        src={image}
                        width={240}
                        height={240}
                        sizes="240px"
                        className="w-60 rounded-lg object-cover shadow-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeToMail;
