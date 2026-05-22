'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuChevronLeft, LuExternalLink, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';

const footerLinks = [
  {
    title: 'المكتبة',
    items: [
      { label: 'الرئيسية', href: '/' },
      { label: 'من نحن', href: '/about-us' },
      { label: 'الدراسات والأدلة', href: '/industry/studies' },
      { label: 'الاصدارات', href: '/info/publications' },
    ],
  },
  {
    title: 'القطاعات',
    items: [
      { label: 'الصناعة', href: '/industry/advisory-committee' },
      { label: 'التقييس', href: '/standardization/studies' },
      { label: 'التعدين', href: 'https://arabmininglibrary.org/' },
      { label: 'المعلومات الصناعية', href: '/info/statistics' },
    ],
  },
  {
    title: 'روابط مفيدة',
    items: [
      { label: 'التدريب والاستشارات', href: '/training/about' },
      { label: 'الأرشيف', href: '/archive/org/founding' },
      { label: 'مجلة التنمية الصناعية', href: '/info/magazine' },
      { label: 'موقع المنظمة', href: 'https://aidsmo.org', external: true },
    ],
  },
];

const Footer = () => {
  return (
    <footer dir="rtl" className="relative overflow-hidden bg-[#0A2540] text-white">
      <div className="absolute inset-x-0 top-0 h-1 brass-gradient" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '78px 78px',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8 lg:pt-20">
        <div className="corner-frame border border-[#C29C41]/30 bg-white/[0.04] p-6 md:p-9">
          <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-3.png"
                alt="المكتبة الرقمية"
                width={170}
                height={84}
                className="h-20 w-auto object-contain"
              />
              <span className="h-12 w-px bg-[#C29C41]/30" aria-hidden />
              <Link href="https://aidsmo.org" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:opacity-80">
                <Image
                  src="/aidsmo-logo.png"
                  alt="المنظمة العربية للتنمية الصناعية والتقييس والتعدين"
                  width={150}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="max-w-md">
              <p className="mt-3 font-academic text-xl leading-relaxed text-white/76">
                منصة عربية لجمع المعرفة الصناعية والتقنية وتنظيمها وإتاحتها للمجتمع العربي.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-bold tracking-[0.12em] text-[#C29C41]">تواصل معنا</h3>

              <div className="mt-5 flex flex-col gap-3">
                <a href="tel:+212537274500" className="inline-flex items-center gap-3 text-sm text-white/78 transition duration-300 hover:text-[#C29C41]">
                  <LuPhone size={15} className="shrink-0 text-[#C29C41]" />
                  <span dir="ltr">00212537274500</span>
                </a>
                <a href="mailto:aidsmo@aidsmo.org" className="inline-flex items-center gap-3 text-sm text-white/78 transition duration-300 hover:text-[#C29C41]">
                  <LuMail size={15} className="shrink-0 text-[#C29C41]" />
                  aidsmo@aidsmo.org
                </a>
              </div>

              <a
                href="https://maps.google.com/?q=33.8511,-6.9863"
                target="_blank"
                rel="noopener noreferrer"
                className="corner-card mt-6 block max-w-xs border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-[#C29C41]/40 hover:bg-white/[0.07]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/30 text-[#C29C41]">
                  <LuMapPin size={18} />
                </div>
                <p className="text-sm font-semibold text-white/78">الرباط، المملكة المغربية</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#C29C41]">
                  خرائط جوجل
                  <LuExternalLink size={11} />
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 border-b border-[#C29C41]/20 pb-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-[#C29C41]">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          {...('external' in item && item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group/link inline-flex items-center gap-2 text-sm text-white/72 transition duration-300 hover:text-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]"
                        >
                          <LuChevronLeft size={13} className="text-[#C29C41]/60 transition duration-300 group-hover/link:-translate-x-1 group-hover/link:text-[#C29C41]" />
                          {item.label}
                          {'external' in item && item.external && <LuExternalLink size={11} className="text-white/35" />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-right">
            <p className="text-xs leading-relaxed text-white/60">
              © {new Date().getFullYear()} المنظمة العربية للتنمية الصناعية والتقييس والتعدين. جميع الحقوق محفوظة.
            </p>
            <div className="text-xs font-bold tracking-[0.12em] text-[#C29C41]/80">
              المكتبة الرقمية الذكية
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
