'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  LuArrowUpLeft,
  LuBookOpen,
  LuChevronLeft,
  LuMail,
  LuMapPin,
  LuPhone,
  LuSearch,
} from 'react-icons/lu';

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

  return (
    <footer dir="rtl" className="relative overflow-hidden bg-[#061D33] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-[#C29C41]/60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,201,106,0.36) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,106,0.24) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 20%, black 72%, transparent 100%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute right-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-[#0369A1]/24 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-9rem] h-96 w-96 rounded-full bg-[#C29C41]/18 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-[92rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.65fr]">
          <section className="corner-frame border border-[#C29C41]/28 bg-white/[0.055] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.2)] backdrop-blur-md md:p-7">
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src="/logo-3.png"
                alt="المكتبة الرقمية"
                width={190}
                height={92}
                className="h-20 w-auto object-contain"
              />
              <span className="h-12 w-px bg-[#C29C41]/32" aria-hidden />
              <Link
                href="https://aidsmo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group/logo inline-flex items-center gap-2 outline-none transition duration-300 hover:opacity-90 focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#061D33]"
              >
                <Image
                  src="/aidsmo-logo.png"
                  alt="المنظمة العربية للتنمية الصناعية والتقييس والتعدين"
                  width={150}
                  height={80}
                  className="h-14 w-auto object-contain transition duration-300 group-hover/logo:scale-[1.03]"
                />
              </Link>
            </div>

            <p className="mt-7 max-w-xl font-academic text-2xl leading-[1.8] text-white/82">
              منصة عربية تنظم المعرفة الصناعية والتقنية وتتيحها للباحثين وصناع القرار.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group/action flex min-h-14 items-center justify-between border border-white/12 bg-white/[0.06] px-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#C29C41]/45 hover:bg-[#C29C41] hover:text-[#061D33] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#061D33] active:translate-y-0"
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
          </section>

          <section className="grid gap-5 lg:grid-rows-[auto_1fr]">
            <div className="grid gap-3 md:grid-cols-3">
              {contactLinks.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.href}
                    href={contact.href}
                    {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group/contact border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C29C41]/40 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#061D33] active:translate-y-0"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/34 bg-[#C29C41]/10 text-[#E8C96A] transition duration-300 group-hover/contact:bg-[#C29C41] group-hover/contact:text-[#061D33]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-4 block text-xs font-bold text-[#C29C41]">{contact.label}</span>
                    <span dir={contact.dir} className="mt-1 block break-words text-sm font-semibold leading-6 text-white/80">
                      {contact.value}
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="grid gap-4 border border-white/10 bg-white/[0.035] p-5 md:grid-cols-3 md:p-6">
              {footerLinks.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h3 className="mb-4 border-b border-[#C29C41]/18 pb-3 text-sm font-bold text-[#E8C96A]">
                    {group.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group/link flex min-h-10 items-center justify-between gap-3 px-2 text-sm font-medium text-white/70 transition duration-300 hover:bg-white/[0.055] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#061D33]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <LuChevronLeft className="h-3.5 w-3.5 text-[#C29C41]/72 transition duration-300 group-hover/link:-translate-x-1 group-hover/link:text-[#E8C96A]" />
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/58 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} المنظمة العربية للتنمية الصناعية والتقييس والتعدين. جميع الحقوق محفوظة.
          </p>
          <p className="font-bold text-[#C29C41]/86">المكتبة الرقمية الذكية</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
