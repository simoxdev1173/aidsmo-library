'use client';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuMenu, LuX, LuSearch } from 'react-icons/lu';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Menu data                                                          */
/* ------------------------------------------------------------------ */
const menuItemsData: MenuItem[] = [
  { id: 'home', label: 'الرئيسية', href: '/' },
  { id: 'about', label: 'من نحن' },
  {
    id: 'industry', label: 'الصناعة',
    children: [
      { label: 'اللجنة الاستشارية للتنمية الصناعية', href: '/industry/advisory-committee' },
      { label: 'إستراتيجية التكامل الصناعي', href: '/industry/integration-strategy' },
      { label: 'لجنة تنسيق مراكز البحوث الصناعية', href: '/industry/research-coordination' },
      { label: 'الصناعات الصغيرة والمتوسطة', href: '/industry/sme' },
      { label: 'فعاليات وأنشطة', href: '/industry/events' },
      { label: 'الدراسات والأدلة', href: '/industry/studies' },
    ],
  },
  {
    id: 'standardization', label: 'التقييس',
    children: [
      { label: 'دراسات', href: '/standardization/studies' },
      { label: 'معاجم', href: '/standardization/glossaries' },
      { label: 'أدلة', href: '/standardization/guides' },
      { label: 'توجيهات', href: '/standardization/directives' },
      { label: 'استراتيجيات', href: '/standardization/strategies' },
      { label: 'ورش ودورات تدريبية', href: '/standardization/workshops' },
    ],
  },
  {
    id: 'mining', label: 'التعدين',
    children: [
      { label: 'المكتبة الرقمية للدراسات التعدينية العربية', href: 'https://arabmininglibrary.org/' },
    ],
  },
  {
    id: 'industrial-info', label: 'المعلومات الصناعية',
    children: [
      {
        label: 'الإحصاءات الصناعية', href: '/info/statistics',
        subItems: [
          { label: 'تقرير الصناعة العربية', href: '/info/statistics/arab-industry-report' },
          { label: 'كتيب المؤشرات الاقتصادية والصناعية', href: '/info/statistics/indicators-booklet' },
          { label: 'نشرة الإحصاءات الصناعية', href: '/info/statistics/bulletin' },
          { label: 'الانفوجرافي', href: '/info/statistics/infographics' },
        ],
      },
      { label: 'مؤتمرات وندوات', href: '/info/conferences' },
      { label: 'مجلة التنمية الصناعية', href: '/info/magazine' },
      { label: 'النشرة الدورية', href: '/info/newsletter' },
      { label: 'الاصدارات', href: '/info/publications' },
    ],
  },
  {
    id: 'training', label: 'التدريب والاستشارات',
    children: [
      { label: 'حول المعهد', href: '/training/about' },
      { label: 'الخطة التدريبية', href: '/training/plan' },
      { label: 'دورات تدريبية', href: '/training/courses' },
      { label: 'ورش عمل', href: '/training/workshops' },
    ],
  },
  {
    id: 'archive', label: 'الأرشيف',
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
            label: 'القمة العربية', href: '/archive/league/summit',
            subItems: [
              { label: 'مجلس جامعة الدول العربية', href: '/archive/league/summit/council' },
              { label: 'مجلس الجامعة على مستوى القمة', href: '/archive/league/summit/summit-council' },
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

/* ------------------------------------------------------------------ */
/*  Desktop: Simple dropdown                                           */
/* ------------------------------------------------------------------ */
const DropdownSimple = ({ items }: { items: ChildItem[] }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="min-w-[260px] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
      {items.map((item, idx) => (
        <div key={item.href}>
          {item.subItems ? (
            <div
              className="relative"
              onMouseEnter={() => setExpandedIdx(idx)}
              onMouseLeave={() => setExpandedIdx(null)}
            >
              <div className="flex cursor-default items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
                <Link href={item.href} className="flex-1">{item.label}</Link>
                <LuChevronLeft size={14} className="text-slate-400" />
              </div>
              {/* Flyout — opens to the LEFT (standard RTL nav, sub-menu goes further left) */}
              <div
                className={cn(
                  'absolute left-0 top-0 z-50 -translate-x-full pl-1 transition-all duration-200',
                  expandedIdx === idx
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-1 opacity-0',
                )}
              >
                <div className="min-w-[240px] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              href={item.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Desktop: Mega dropdown (Archive) — sub-flyout opens to the RIGHT  */
/* ------------------------------------------------------------------ */
const DropdownMega = ({ groups }: { groups: GroupDef[] }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <div className="min-w-[540px] rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
      <div className={cn('grid gap-6', groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {groups.map((group) => (
          <div key={group.title}>
            {/* Gold group header */}
            <p className="mb-2 border-b border-[#C29C41]/30 px-3 pb-2 text-xs font-bold text-[#C29C41]">
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
                    <div className="flex cursor-default items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
                      <Link href={item.href} className="flex-1">{item.label}</Link>
                      {/* Arrow points RIGHT — flyout opens to the right to stay on-screen */}
                      <LuChevronRight size={14} className="text-slate-400" />
                    </div>
                    {/* Flyout opens to the RIGHT to prevent overflow */}
                    <div
                      className={cn(
                        'absolute right-0 top-0 z-50 translate-x-full pr-1 transition-all duration-200',
                        expandedKey === item.href
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none translate-y-1 opacity-0',
                      )}
                    >
                      <div className="min-w-[220px] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]"
                  >
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

/* ------------------------------------------------------------------ */
/*  Desktop nav item                                                   */
/* ------------------------------------------------------------------ */
const NavItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasDropdown = item.children || item.groups;

  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <li
      className="relative"
      onMouseEnter={hasDropdown ? enter : undefined}
      onMouseLeave={hasDropdown ? leave : undefined}
    >
      <Link
        href={item.href ?? `#${item.id}`}
        className={cn(
          'relative flex items-center gap-1 px-4 py-2 text-sm font-bold text-nowrap transition-all duration-300',
          isActive
            ? 'text-[#C29C41]'  /* gold for active */
            : 'text-slate-600 hover:text-[#0369A1]',  /* blue on hover */
        )}
      >
        {item.label}
        {hasDropdown && (
          <LuChevronDown
            size={14}
            className={cn('transition-transform duration-300', open && 'rotate-180')}
          />
        )}
        {/* Gold underline indicator for active item */}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 rounded-full bg-[#C29C41]" />
        )}
      </Link>

      {hasDropdown && (
        <div
          className={cn(
            'absolute right-0 top-full z-50 pt-2 transition-all duration-200',
            /* Archive is the last item — anchor to LEFT edge so it doesn't overflow right */
            item.id === 'archive' ? 'left-auto right-0' : 'right-0',
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          {item.groups ? (
            <DropdownMega groups={item.groups} />
          ) : (
            <DropdownSimple items={item.children!} />
          )}
        </div>
      )}
    </li>
  );
};

/* ------------------------------------------------------------------ */
/*  Mobile accordion                                                   */
/* ------------------------------------------------------------------ */
const MobileAccordion = ({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) => {
  const [open, setOpen] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const hasChildren = item.children || item.groups;

  const allChildren: (ChildItem & { isGroupHeader?: boolean; groupTitle?: string })[] =
    item.children
      ? item.children
      : item.groups
        ? item.groups.flatMap((g) => [
            { label: '', href: '', isGroupHeader: true, groupTitle: g.title },
            ...g.items,
          ])
        : [];

  if (!hasChildren) {
    return (
      <Link
        href={item.href ?? `#${item.id}`}
        onClick={onNavigate}
        className="block rounded-xl px-4 py-4 text-lg font-bold text-slate-600 hover:text-[#0369A1]"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-lg font-bold text-slate-600"
      >
        {item.label}
        <LuChevronDown
          size={18}
          className={cn('transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mr-4 border-r-2 border-[#C29C41]/20 pr-2">
          {allChildren.map((child, idx) => {
            if (child.isGroupHeader) {
              return (
                <p key={`header-${idx}`} className="px-4 pb-1 pt-3 text-xs font-bold text-[#C29C41]">
                  {child.groupTitle}
                </p>
              );
            }
            if (child.subItems && child.subItems.length > 0) {
              const isExpanded = expandedChild === child.href;
              return (
                <div key={child.href}>
                  <button
                    onClick={() => setExpandedChild(isExpanded ? null : child.href)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#0369A1]"
                  >
                    {child.label}
                    <LuChevronDown
                      size={14}
                      className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}
                    />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="mr-4 border-r-2 border-slate-50 pr-2">
                      {child.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onNavigate}
                          className="block rounded-lg px-4 py-2 text-[0.8rem] font-medium text-slate-400 hover:text-[#C29C41]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-[#0369A1]"
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  TopNavBar                                                          */
/* ------------------------------------------------------------------ */
const TopNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = menuItemsData.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
      sections.forEach((section) => {
        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
          isScrolled ? 'top-2 px-4 md:px-8' : 'top-0 px-0',
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-7xl transition-all duration-500',
            isScrolled
              ? 'rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md py-2'
              : 'border-b border-transparent bg-transparent py-5',
          )}
        >
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/logo-2.png"
                    alt="Logo"
                    height={200}
                    width={220}
                    className={cn(
                      'transition-all duration-500',
                      isScrolled ? 'h-22 w-auto' : 'h-24 w-auto',
                    )}
                  />
                </Link>
              </div>

              {/* Desktop Menu */}
              <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                {menuItemsData.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeSection === item.id} />
                ))}
              </ul>

              {/* Search */}
              <div className="hidden items-center lg:flex">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="ابحث عن الكتب، المقالات..."
                    className="h-11 w-64 rounded-full border border-slate-200 bg-slate-100/50 pr-11 pl-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:w-80 focus:border-[#0369A1] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0369A1]">
                    <LuSearch size={18} />
                  </div>
                </div>
              </div>

              {/* Mobile button */}
              <button
                className="rounded-xl bg-slate-100 p-2.5 text-slate-700 hover:bg-[#0369A1] hover:text-white lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <LuMenu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm lg:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0 transition-opacity',
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile panel */}
      <div
        className={cn(
          'fixed bottom-0 right-0 top-0 z-[110] w-[85%] max-w-sm overflow-y-auto bg-white p-6 transition-transform duration-500 lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between border-b border-[#C29C41]/20 pb-4">
          <Image src="/lib-logo.svg" alt="Logo" height={40} width={40} />
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-slate-100 p-2">
            <LuX size={20} />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="بحث..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pr-10 pl-4 text-sm focus:border-[#0369A1] outline-none"
          />
          <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>

        <nav className="flex flex-col gap-1">
          {menuItemsData.map((item) => (
            <MobileAccordion key={item.id} item={item} onNavigate={() => setMobileMenuOpen(false)} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default TopNavBar;