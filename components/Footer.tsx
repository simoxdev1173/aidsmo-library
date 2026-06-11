'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  LuArrowUpLeft,
  LuBookOpen,
  LuChevronLeft,
  LuMail,
  LuMapPin,
  LuPhone,
  LuSearch,
} from 'react-icons/lu';

const bookImages = [
  '/trendingSection/t-12.jpg',
  '/bookCovers/i-2-1.png',
  '/trendingSection/t-7.png',
  '/trendingSection/t-9.png',
  '/trendingSection/t-3.png',
];

const footerLinks = [
  {
    title: 'المكتبة الرقمية الذكية',
    items: [
      { label: 'الرئيسية', href: '/' },
      { label: 'من نحن', href: '/about-us' },
      { label: 'الدراسات والأدلة', href: '/industry/studies' },
      { label: 'الإصدارات', href: '/info/publications' },
    ],
  },
  {
    title: 'القطاعات',
    items: [
      { label: 'الصناعة', href: '/industry/integration-strategy' },
      { label: 'التقييس', href: '/standardization/studies' },
      { label: 'التعدين', href: 'https://arabmininglibrary.org/', external: true },
      { label: 'المعلومات الصناعية', href: '/info/statistics' },
    ],
  },
  {
    title: 'خدمات ومعرفة',
    items: [
      { label: 'التدريب والاستشارات', href: '/training/about' },
      { label: 'الأرشيف', href: '/archive/org/founding' },
      { label: 'مجلة التنمية الصناعية', href: '/info/magazine' },
      { label: 'موقع المنظمة', href: 'https://aidsmo.org', external: true },
    ],
  },
];

const contactLinks = [
  {
    label: 'الهاتف',
    value: '00212537274500',
    href: 'tel:+212537274500',
    icon: LuPhone,
    dir: 'ltr' as const,
  },
  {
    label: 'البريد الإلكتروني',
    value: 'aidsmo@aidsmo.org',
    href: 'mailto:aidsmo@aidsmo.org',
    icon: LuMail,
    dir: 'ltr' as const,
  },
  {
    label: 'المقر',
    value: 'الرباط، المملكة المغربية',
    href: 'https://maps.google.com/?q=33.8511,-6.9863',
    icon: LuMapPin,
    external: true,
  },
];

const quickActions = [
  { label: 'استكشف المكتبة', href: '/', icon: LuBookOpen },
  { label: 'ابدأ البحث', href: '/#search', icon: LuSearch },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <footer dir="rtl" className="relative overflow-hidden bg-[#F7F0E1] text-[#0A2540]">
      <Image
        src="/background-01.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.34] contrast-110 saturate-125"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,244,0.92)_0%,rgba(247,240,225,0.78)_58%,rgba(255,252,244,0.96)_100%)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(198,163,70,0.22) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-1 bg-[#C6A346]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <section className="corner-frame grid gap-7 border border-[#C6A346]/35 bg-white/88 p-5 shadow-[0_22px_58px_rgba(10,37,64,0.1)] backdrop-blur-sm md:p-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C6A346]">
              النشرة البريدية
            </p>
            <h2 className="academic-heading mt-3 text-3xl leading-tight md:text-4xl">
              ابقَ على اتصال بآخر مستجدات المكتبة الرقمية
            </h2>
            <p className="mt-4 max-w-2xl font-academic text-lg leading-relaxed text-[#475569]">
              تصلك أحدث المجلات والتقارير والإصدارات فور نشرها، في مساحة واحدة مختصرة ومباشرة.
            </p>

            <div className="mt-6 max-w-2xl">
              {isSuccess ? (
                <div className="border border-[#C6A346]/35 bg-[#FFF8E1] p-4 text-center font-bold text-[#003652]">
                  تم الاشتراك بنجاح. شكرا لك.
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    البريد الإلكتروني
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <input
                        id="footer-newsletter-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (error) setError('');
                        }}
                        className="h-12 w-full border border-[#C6A346]/35 bg-[#FFFCF4] px-4 text-right text-[#0A2540] placeholder:font-academic placeholder:text-[#64748B] focus:border-[#C6A346] focus:outline-none focus:ring-2 focus:ring-[#C6A346]/30"
                        placeholder="أدخل بريدك الإلكتروني"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'footer-newsletter-error' : undefined}
                      />
                      {error && (
                        <p id="footer-newsletter-error" className="mt-2 text-sm font-medium text-red-600">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="engraved h-12 shrink-0 cursor-pointer border border-[#C6A346] bg-[#C6A346] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(198,163,70,0.2)] transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#C6A346] focus:ring-offset-2 focus:ring-offset-white"
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'اشترك الآن'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {['محتوى حصري', 'تحديثات مستمرة', 'مجاني 100%'].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 border border-[#C6A346]/30 bg-[#FFF8E1] px-3 py-2 text-sm font-semibold text-[#334155]">
                  <span className="h-2 w-2 rounded-full bg-[#C6A346]" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="h-[320px] overflow-hidden border border-[#C6A346]/28 bg-[#FFFCF4]/72 p-3 shadow-[0_16px_36px_rgba(10,37,64,0.08)]">
              <div className="marquee grid grid-cols-2 place-items-center gap-3">
                {[false, true].map((reverse) => (
                  <div key={String(reverse)} className={`${reverse ? 'marquee-reverse ' : ''}flex flex-col gap-5 overflow-hidden`}>
                    {[0, 1].map((set) => (
                      <div key={set} aria-hidden={set === 1} className="marquee-hero flex flex-col items-center gap-5">
                        {bookImages.map((image, index) => (
                          <Image
                            key={`${image}-${set}-${index}`}
                            alt="صورة كتاب"
                            src={image}
                            width={190}
                            height={190}
                            sizes="190px"
                            className="w-40 border border-[#C6A346]/25 object-cover shadow-sm md:w-44"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.5fr]">
          <div className="border border-[#C6A346]/28 bg-white/78 p-5 shadow-[0_14px_34px_rgba(10,37,64,0.07)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src="/logo-3.png"
                alt="المكتبة الرقمية"
                width={190}
                height={92}
                className="h-16 w-auto object-contain"
              />
              <span className="h-10 w-px bg-[#C6A346]/36" aria-hidden />
              <Link
                href="https://aidsmo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group/logo inline-flex cursor-pointer items-center gap-2 outline-none transition duration-300 hover:opacity-90 focus:ring-2 focus:ring-[#C6A346] focus:ring-offset-2 focus:ring-offset-[#F7F0E1]"
              >
                <Image
                  src="/aidsmo-logo.png"
                  alt="المنظمة العربية للتنمية الصناعية والتقييس والتعدين"
                  width={150}
                  height={80}
                  className="h-12 w-auto object-contain transition duration-300 group-hover/logo:scale-[1.03]"
                />
              </Link>
            </div>

            <p className="mt-5 max-w-xl font-academic text-lg leading-[1.8] text-[#475569]">
              منصة عربية تنظم المعرفة الصناعية والتقنية وتتيحها للباحثين وصناع القرار.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group/action flex min-h-12 cursor-pointer items-center justify-between border border-[#C6A346]/30 bg-[#FFF8E1] px-4 text-sm font-bold text-[#0A2540] transition duration-300 hover:border-[#C6A346] hover:bg-[#C6A346] focus:outline-none focus:ring-2 focus:ring-[#C6A346] focus:ring-offset-2 focus:ring-offset-[#F7F0E1]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {action.label}
                    </span>
                    <LuArrowUpLeft className="h-4 w-4 transition duration-300 group-hover/action:-translate-x-1 group-hover/action:translate-y-1" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              {contactLinks.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.href}
                    href={contact.href}
                    {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group/contact border border-[#C6A346]/25 bg-white/78 p-4 transition duration-300 hover:border-[#C6A346]/55 hover:bg-[#FFF8E1] focus:outline-none focus:ring-2 focus:ring-[#C6A346] focus:ring-offset-2 focus:ring-offset-[#F7F0E1]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border border-[#C6A346]/38 bg-[#FFF8E1] text-[#8B681C] transition duration-300 group-hover/contact:bg-[#C6A346] group-hover/contact:text-[#0A2540]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-4 block text-xs font-bold text-[#8B681C]">{contact.label}</span>
                    <span dir={contact.dir} className="mt-1 block break-words text-sm font-semibold leading-6 text-[#334155]">
                      {contact.value}
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="grid gap-4 border border-[#C6A346]/25 bg-white/78 p-5 md:grid-cols-3">
              {footerLinks.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h3 className="mb-3 border-b border-[#C6A346]/22 pb-3 text-sm font-bold text-[#003652]">
                    {group.title}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group/link flex min-h-9 cursor-pointer items-center justify-between gap-3 px-2 text-sm font-medium text-[#475569] transition duration-300 hover:bg-[#FFF8E1] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C6A346] focus:ring-offset-2 focus:ring-offset-[#F7F0E1]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <LuChevronLeft className="h-3.5 w-3.5 text-[#C6A346] transition duration-300 group-hover/link:-translate-x-1" />
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#C6A346]/30 pt-5 text-sm text-[#64748B] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} المنظمة العربية للتنمية الصناعية والتقييس والتعدين. جميع الحقوق محفوظة.
          </p>
          <p className="font-bold text-[#8B681C]">المكتبة الرقمية الذكية</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
