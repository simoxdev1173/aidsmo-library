'use client';

import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuChevronLeft, LuMenu, LuSearch, LuX } from 'react-icons/lu';
import { MdDashboardCustomize } from 'react-icons/md';

type SubItem = { label: string; href: string };
type ChildItem = { label: string; href: string; subItems?: SubItem[] };
type GroupDef = { title: string; items: ChildItem[] };
type MenuItem = {
  id: string;
  label: string;
  href?: string;
  children?: ChildItem[];
  groups?: GroupDef[];
};

const menuItemsData: MenuItem[] = [
  { id: 'home', label: 'الرئيسية', href: '/' },
  { id: 'about', label: 'من نحن', href: '/about-us' },
  {
    id: 'industry',
    label: 'الصناعة',
    href: '/industry',
    children: [
      { label: 'إستراتيجيات', href: '/industry/integration-strategy' },
      { label: 'الصناعات الصغيرة والمتوسطة', href: '/industry/sme' },
      { label: 'فعاليات وأنشطة', href: '/industry/events' },
      { label: 'الدراسات والأدلة', href: '/industry/studies' , subItems: [
           { label: 'الدراسات', href: '/industry/studies/studies' },
        { label: 'الأدلة', href: '/industry/studies/guides' },
        ],  },
    ],
  },
  {
    id: 'standardization',
    label: 'التقييس',
    href: '/standardization',
    children: [
      { label: 'دراسات', href: '/standardization/studies' },
      { label: 'معاجم', href: '/standardization/glossaries' },
      { label: 'أدلة', href: '/standardization/guides' },
      { label: 'توجيهات', href: '/standardization/directives' },
      { label: 'إستراتيجيات', href: '/standardization/strategies' },
      { label: 'دورات تدريبية', href: '/standardization/training-courses' },
      { label: 'ورش عمل', href: '/standardization/workshops' },
      { label: 'ندوات', href: '/standardization/seminars' },
      { label: 'إجتماعات', href: '/standardization/meetings' },
    ],
  },
  {
    id: 'mining',
    label: 'التعدين',
    children: [
      { label: 'المكتبة الرقمية للدراسات التعدينية العربية', href: 'https://arabmininglibrary.org/' },
    ],
  },
  {
    id: 'industrial-info',
    href: '/info',
    label: 'المعلومات الصناعية',
    children: [
      {
        label: 'الإحصاءات الصناعية',
        href: '/info/statistics',
        subItems: [
          { label: 'تقرير الصناعة العربية', href: '/info/statistics/arab-industry-report' },
          { label: 'كتيب المؤشرات الاقتصادية والصناعية', href: '/info/statistics/indicators-booklet' },
          { label: 'نشرة الإحصاءات الصناعية', href: '/info/statistics/bulletin' },
          { label: 'الانفوجرافيك', href: '/info/statistics/infographics' },
        ],
      },
      { label: 'مؤتمرات وندوات', href: '/info/conferences' },
      { label: 'مجلة التنمية الصناعية', href: '/info/magazine' },
      { label: 'النشرة الدورية', href: '/info/newsletter' },
      { label: 'الاصدارات', href: '/info/publications' },
    ],
  },
  {
    id: 'training',
    label: 'التدريب والاستشارات',
    children: [
      { label: 'حول المعهد', href: '/training/about' },
      {
        label: 'الخطة التدريبية',
        href: '/training/plan',
        subItems: [
          { label: '2024', href: '/training/plan/2024' },
          { label: '2025', href: '/training/plan/2025' },
          { label: '2026', href: '/training/plan/2026' },
        ],
      },
    ],
  },
  {
    id: 'archive',
    label: 'الأرشيف',
    groups: [
      {
        title: 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين',
        items: [
          { label: 'تأسيس المنظمة', href: '/archive/org/founding' },
          { label: 'اتفاقيات الانشاء', href: '/archive/org/agreements' },
          { label: 'النظام الداخلي', href: '/archive/org/bylaws' },
          { label: 'اللوائح الداخلية', href: '/archive/org/regulations' },
          { label: 'مذكرات التفاهم واتفاقيات', href: '/archive/org/mou' },
          { label: 'المجلس التنفيذي', href: '/archive/org/executive-board' },
          { label: 'الجمعية العامة', href: '/archive/org/general-assembly' },
        ],
      },
      {
        title: 'جامعة الدول العربية',
        items: [
          {
            label: 'القمة العربية',
            href: '/archive/league/summit',
            subItems: [
              { label: 'قرارات مجلس الجامعة على المستوى الوزاري', href: '/archive/league/summit/council' },
              { label: 'مجلس الجامعة على مستوى القمة', href: '/archive/league/summit/summit-council' },
              { label: 'القمة العربية الاقتصادية والاجتماعية', href: '/archive/league/summit/economic-social' },
            ],
          },
          { label: 'المجلس الاقتصادي والاجتماعي', href: '/archive/league/ecosoc' },
          { label: 'لجنة المنظمات والتنسيق', href: '/archive/league/coordination' },
          { label: 'لجنة التنسيق العليا للعمل العربي المشترك', href: '/archive/league/joint-action' },
          { label: 'اللوائح والأنظمة', href: '/archive/league/regulations' },
        ],
      },
    ],
  },
];

const dropdownShell = 'rounded-[14px] border border-[#C29C41]/30 bg-white/[0.98] p-2 shadow-[0_18px_44px_rgba(10,37,64,0.15)] backdrop-blur-xl';
const dropdownLink = 'block rounded-full px-4 py-2.5 text-sm font-medium leading-relaxed text-[#334155] transition duration-300 hover:bg-[#F0F7FC] hover:text-[#C29C41] focus:bg-[#F0F7FC] focus:text-[#C29C41] focus:outline-none';

const DropdownSimple = ({ items }: { items: ChildItem[] }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  return (
    <div className={cn('min-w-[280px]', dropdownShell)}>
      {items.map((item, idx) => (
        <div key={item.href}>
          {item.subItems ? (
            <div
              className="relative"
              onMouseEnter={() => setExpandedIdx(idx)}
              onMouseLeave={() => setExpandedIdx(null)}
            >
              <div className={cn('flex cursor-default items-center justify-between gap-4', dropdownLink)}>
                <Link href={item.href} className="flex-1">{item.label}</Link>
                <LuChevronLeft size={14} className="text-[#C29C41]" />
              </div>
              <div
                className={cn(
                  'absolute left-0 top-0 z-50 -translate-x-full pl-2 transition duration-300',
                  expandedIdx === idx ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                <div className={cn('min-w-[250px]', dropdownShell)}>
                  {item.subItems.map((sub) => (
                    <Link key={sub.href} href={sub.href} className={dropdownLink}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link href={item.href} className={dropdownLink}>
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const DropdownMega = ({ groups }: { groups: GroupDef[] }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <div className={cn('w-[min(680px,calc(100vw-2rem))]', dropdownShell)}>
      <div className={cn('grid gap-4', groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 border-b border-[#C29C41]/25 px-3 pb-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#C29C41]">
              {group.title}
            </p>
            {group.items.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setExpandedKey(item.href)}
                    onMouseLeave={() => setExpandedKey(null)}
                  >
                    <div className={cn('flex cursor-default items-center justify-between gap-4', dropdownLink)}>
                      <Link href={item.href} className="flex-1">{item.label}</Link>
                      <LuChevronDown size={14} className={cn('text-[#C29C41] transition duration-300', expandedKey === item.href && 'rotate-180')} />
                    </div>
                    <div className={cn('overflow-hidden border-r border-[#C29C41]/20 pr-3 transition-all duration-300', expandedKey === item.href ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0')}>
                      {item.subItems.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-xs font-medium leading-relaxed text-[#64748B] transition duration-200 hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:bg-[#F0F7FC] focus:text-[#0369A1] focus:outline-none">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className={dropdownLink}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ item, isActive, isScrolled }: { item: MenuItem; isActive: boolean; isScrolled: boolean }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasDropdown = item.children || item.groups;

  const enter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <li
      className="relative"
      onMouseEnter={hasDropdown ? enter : undefined}
      onMouseLeave={hasDropdown ? leave : undefined}
    >
      <Link
        href={item.href ?? `#${item.id}`}
        className={cn(
          'relative flex min-h-11 items-center gap-1 text-nowrap rounded-full px-2 text-[0.82rem] font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 2xl:px-3 2xl:text-sm',
          isScrolled
            ? cn('focus:ring-offset-white', isActive ? 'text-[#C29C41]' : 'text-[#0A2540] hover:text-[#C29C41]')
            : cn('focus:ring-offset-[#0A2540]', isActive ? 'text-[#E8C96A]' : 'text-white/88 hover:text-[#E8C96A]'),
        )}
      >
        {item.label}
        {hasDropdown && <LuChevronDown size={15} className={cn('transition duration-300', open && 'rotate-180')} />}
      </Link>

      {hasDropdown && (
        <div
          className={cn(
            'absolute top-full z-50 pt-3 transition duration-300',
            item.id === 'archive' ? 'left-0 right-auto' : 'right-0',
            open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          {item.groups ? <DropdownMega groups={item.groups} /> : <DropdownSimple items={item.children!} />}
        </div>
      )}
    </li>
  );
};

const MobileAccordion = ({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) => {
  const [open, setOpen] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const hasChildren = item.children || item.groups;

  const allChildren: (ChildItem & { isGroupHeader?: boolean; groupTitle?: string })[] =
    item.children
      ? item.children
      : item.groups
        ? item.groups.flatMap((g) => [{ label: '', href: '', isGroupHeader: true, groupTitle: g.title }, ...g.items])
        : [];

  if (!hasChildren) {
    return (
      <Link href={item.href ?? `#${item.id}`} onClick={onNavigate} className="block min-h-12 rounded-full border-b border-[#0369A1]/10 px-4 py-3 text-lg font-bold text-[#003652]">
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-[#0369A1]/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-12 w-full items-center justify-between rounded-full px-4 py-3 text-lg font-bold text-[#003652]"
      >
        {item.label}
        <LuChevronDown size={18} className={cn('text-[#C29C41] transition duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-[1400px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className="mr-3 border-r border-[#C29C41]/30 pr-3">
          {allChildren.map((child, idx) => {
            if (child.isGroupHeader) {
              return (
                <p key={`header-${idx}`} className="px-2 pb-1 pt-3 text-xs font-bold text-[#C29C41]">
                  {child.groupTitle}
                </p>
              );
            }
            if (child.subItems && child.subItems.length > 0) {
              const isExpanded = expandedChild === child.href;
              return (
                <div key={child.href}>
                  <button
                    type="button"
                    onClick={() => setExpandedChild(isExpanded ? null : child.href)}
                    className="flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold text-[#475569]"
                  >
                    {child.label}
                    <LuChevronDown size={14} className={cn('text-[#C29C41] transition duration-300', isExpanded && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[440px] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="mr-4 border-r border-[#0369A1]/10 pr-2">
                      {child.subItems.map((sub) => (
                        <Link key={sub.href} href={sub.href} onClick={onNavigate} className="block rounded-full px-4 py-2 text-sm text-[#64748B]">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={child.href} href={child.href} onClick={onNavigate} className="block rounded-full px-4 py-2.5 text-sm font-medium text-[#475569]">
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TopNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isSolid = isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = menuItemsData.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120;
      sections.forEach((section) => {
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 z-[60] px-2 transition-all duration-500 md:px-4 2xl:px-6',
          isSolid ? 'top-3' : 'top-4',
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-[92rem] rounded-[14px] border transition-all duration-500',
            isSolid
              ? 'border-[#C29C41]/30 bg-white/95 py-1 shadow-[0_16px_40px_rgba(10,37,64,0.12)] backdrop-blur-xl'
              : 'border-white/15 bg-[#0A2540]/30 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-md hover:border-[#C29C41]/35 hover:bg-[#0A2540]/55',
          )}
        >
          <div className="px-3 lg:px-4">
            <div className="flex items-center gap-2 2xl:gap-3">
              <Link href="/" className="flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white">
                <Image
                  src={isSolid ? '/logo-2.png' : '/logo-3.png'}
                  alt="المكتبة الرقمية"
                  height={240}
                  width={260}
                  className={cn('object-contain transition-all duration-500', isSolid ? 'h-12 w-auto' : 'h-14 w-auto md:h-16')}
                  priority
                />
              </Link>

              <div className={cn('hidden h-12 w-px shrink-0 lg:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />

              <ul className="hidden flex-1 items-center justify-center gap-0 lg:flex">
                {menuItemsData.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeSection === item.id} isScrolled={isSolid} />
                ))}
              </ul>

              <div className="mr-auto flex shrink-0 items-center gap-2 2xl:gap-3 lg:mr-0">
                <div className="hidden items-center 2xl:flex">
                  <label className="relative">
                    <span className="sr-only">بحث</span>
                    <input
                      type="text"
                      placeholder="بحث..."
                      dir="rtl"
                      className={cn(
                        'h-11 w-40 rounded-full border pr-10 pl-4 text-sm font-medium outline-none transition duration-300 focus:w-48 focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25',
                        isSolid
                          ? 'border-[#0369A1]/20 bg-[#F8FAFC] text-[#0A2540] placeholder:text-[#64748B]'
                          : 'border-white/16 bg-white/10 text-white placeholder:text-white/60',
                      )}
                    />
                    <LuSearch className={cn('absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2', isSolid ? 'text-[#C29C41]' : 'text-[#E8C96A]')} />
                  </label>
                </div>

                <div className={cn('hidden h-12 w-px shrink-0 2xl:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />

                <Link
                  href="/dashboard"
                  aria-label="لوحة التحكم"
                  className={cn(
                    'group relative hidden h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-sm font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 lg:flex',
                    isSolid
                      ? 'border-[#C29C41]/35 bg-[#FFF8E1] text-[#8A6A1D] shadow-[0_8px_22px_rgba(194,156,65,0.16)] hover:border-[#C29C41] hover:bg-[#C29C41] hover:text-[#0A2540] focus:ring-offset-white'
                      : 'border-[#E8C96A]/35 bg-[#E8C96A]/12 text-[#E8C96A] shadow-[0_10px_26px_rgba(0,0,0,0.12)] hover:border-[#E8C96A] hover:bg-[#E8C96A] hover:text-[#0A2540] focus:ring-offset-[#0A2540]',
                  )}
                >
                  <MdDashboardCustomize className="h-6 w-6" />
                  <span className="hidden 2xl:inline">لوحة التحكم</span>
                  <span
                    className={cn(
                      'pointer-events-none absolute top-full mt-3 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold opacity-0 shadow-[0_10px_24px_rgba(10,37,64,0.14)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 2xl:hidden',
                      isSolid
                        ? 'border-[#C29C41]/30 bg-white text-[#003652]'
                        : 'border-[#E8C96A]/30 bg-[#0A2540] text-white',
                    )}
                  >
                    لوحة التحكم
                  </span>
                </Link>

                <div className={cn('hidden h-12 w-px shrink-0 lg:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />

                <Link
                  href="https://aidsmo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white xl:flex"
                >
                  <Image
                    src="/aidsmo-logo.png"
                    alt="المنظمة العربية للتنمية الصناعية والتقييس والتعدين"
                    height={160}
                    width={160}
                    className={cn('object-contain transition-all duration-500', isSolid ? 'h-9 w-auto' : 'h-10 w-auto 2xl:h-11')}
                  />
                </Link>

                <button
                  type="button"
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:bg-[#C29C41] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 lg:hidden',
                    isSolid
                      ? 'border-[#C29C41]/35 bg-[#F8FAFC] text-[#003652] focus:ring-offset-white'
                      : 'border-white/20 bg-white/10 text-white focus:ring-offset-[#0A2540]',
                  )}
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="فتح القائمة"
                >
                  <LuMenu size={24} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[100] bg-[#0A2540]/55 backdrop-blur-sm transition-opacity lg:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={cn(
          'fixed bottom-0 right-0 top-0 z-[110] w-[86%] max-w-sm overflow-y-auto rounded-l-[14px] border-l border-[#C29C41]/30 bg-white p-6 shadow-2xl transition-transform duration-500 lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="القائمة الرئيسية"
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#C29C41]/25 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-2.png" alt="المكتبة الرقمية" height={44} width={112} className="h-10 w-auto object-contain" />
            <span className="h-8 w-px bg-[#C29C41]/30" />
            <Image src="/aidsmo-logo.png" alt="المنظمة العربية للتنمية الصناعية والتقييس والتعدين" height={40} width={40} className="h-10 w-auto object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/35 bg-[#F8FAFC] text-[#003652]"
            aria-label="إغلاق القائمة"
          >
            <LuX size={20} />
          </button>
        </div>

        <label className="relative mb-5 block">
          <span className="sr-only">بحث</span>
          <input
            type="text"
            placeholder="بحث..."
            dir="rtl"
            className="h-12 w-full rounded-full border border-[#0369A1]/20 bg-[#F8FAFC] pr-10 pl-4 text-sm outline-none transition duration-300 placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
          />
          <LuSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C29C41]" />
        </label>

        <Link
          href="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className="mb-4 flex min-h-12 items-center justify-between rounded-full border border-[#C29C41]/35 bg-[#FFF8E1] px-4 py-3 text-sm font-bold text-[#003652] transition duration-200 hover:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
        >
          <span>لوحة التحكم</span>
          <MdDashboardCustomize className="h-6 w-6 text-[#8A6A1D]" />
        </Link>

        <nav className="flex flex-col">
          {menuItemsData.map((item) => (
            <MobileAccordion key={item.id} item={item} onNavigate={() => setMobileMenuOpen(false)} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default TopNavBar;
