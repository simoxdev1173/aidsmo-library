'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuMapPin, LuPhone, LuMail, LuExternalLink, LuChevronLeft } from 'react-icons/lu';

const footerLinks = [
  {
    title: 'المكتبة',
    items: [
      { label: 'الرئيسية', href: '/' },
      { label: 'من نحن', href: '/about' },
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
    <footer dir="rtl" className="relative overflow-hidden">
      <div className="relative bg-gradient-to-bl from-[#0a2540] via-[#0C5B99] to-[#0369A1]">
        {/* Gold top bar */}
        <div
          className="absolute inset-x-0 top-0 h-[4px] z-10"
          style={{ background: 'linear-gradient(to left, #C29C41, #e8c96a, #C29C41)' }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 85% 30%, rgba(194,156,65,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 10% 70%, rgba(194,156,65,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Decorative diamonds */}
        <div className="absolute top-[20%] left-[5%] w-28 h-28 border border-[#C29C41]/[0.06] rotate-45 rounded-lg" />
        <div className="absolute bottom-[25%] right-[8%] w-20 h-20 border border-white/[0.03] rotate-45 rounded" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-8 md:pt-20 md:pb-10">

          {/* Top row — logo + links + location */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-white/10">

            {/* Logo + description */}
            <div className="md:col-span-4 lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo-2.png"
                  alt="المكتبة الرقمية"
                  width={160}
                  height={60}
                  className="h-14 w-auto object-contain brightness-0 invert opacity-90"
                />
                <span className="h-8 w-px bg-[#C29C41]/25" />
                <Image
                  src="/aidsmo-logo.png"
                  alt="AIDSMO"
                  width={60}
                  height={60}
                  className="h-12 w-auto object-contain brightness-0 invert opacity-80"
                />
              </div>
              <p className="text-sm leading-[2] text-white/50 max-w-[340px] mb-6">
                المكتبة الرقمية الذكية — منصة رائدة لجمع المعرفة الصناعية والتقنية وتنظيمها وإتاحتها للمجتمع العربي.
              </p>

              {/* Contact info */}
              <div className="flex flex-col gap-3">
                <a href="tel:+212537000000" className="inline-flex items-center gap-2.5 text-sm text-white/45 transition-colors duration-300 hover:text-[#C29C41]">
                  <LuPhone size={14} className="flex-shrink-0" />
                  <span dir="ltr">+212 5 37 00 00 00</span>
                </a>
                <a href="mailto:info@aidsmo.org" className="inline-flex items-center gap-2.5 text-sm text-white/45 transition-colors duration-300 hover:text-[#C29C41]">
                  <LuMail size={14} className="flex-shrink-0" />
                  info@aidsmo.org
                </a>
              </div>
            </div>

            {/* Nav link columns + location */}
            <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Link columns */}
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-bold text-[#C29C41] mb-4 pb-2 border-b border-[#C29C41]/15">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          {...('external' in item && item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group/link inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors duration-300 hover:text-white"
                        >
                          <LuChevronLeft size={12} className="text-[#C29C41]/40 transition-transform duration-300 group-hover/link:-translate-x-0.5 group-hover/link:text-[#C29C41]" />
                          {item.label}
                          {'external' in item && item.external && (
                            <LuExternalLink size={11} className="text-white/25" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Location column */}
              <div>
                <h3 className="text-sm font-bold text-[#C29C41] mb-4 pb-2 border-b border-[#C29C41]/15">
                  الموقع
                </h3>

                <a
                  href="https://maps.google.com/?q=33.8511,-6.9863"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/loc block rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-400 hover:border-[#C29C41]/20 hover:bg-white/[0.06]"
                >
                  {/* Pin icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C29C41]/10 mb-3 mx-auto transition-all duration-400 group-hover/loc:bg-[#C29C41]/20 group-hover/loc:scale-110">
                    <LuMapPin size={18} className="text-[#C29C41]" />
                  </div>

                  <p className="text-xs font-semibold text-white/60 text-center leading-relaxed mb-1">
                    الرباط
                  </p>
                  <p className="text-[0.7rem] text-white/35 text-center leading-relaxed mb-3">
                    المملكة المغربية
                  </p>

                  <span className="flex items-center justify-center gap-1 text-[0.65rem] font-semibold text-[#C29C41]/50 transition-colors duration-300 group-hover/loc:text-[#C29C41]">
                    خرائط جوجل
                    <LuExternalLink size={9} />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} المنظمة العربية للتنمية الصناعية والتقييس والتعدين. جميع الحقوق محفوظة.
            </p>
        
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;