'use client';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuMenu, LuX, LuSearch } from 'react-icons/lu';

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
  { id: 'about', label: 'من نحن' , href: '/about-us'},
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
              { label: 'قرارات مجلس الجامعة على المستوى الوزاري', href: '/archive/league/summit/council' },
              { label: 'مجلس الجامعة على مستوى القمة', href: '/archive/league/summit/summit-council' },
              { label: 'القمة العربية الإقتصادية و التنموية و الإجتماعية', href: '/archive/league/summit/summit-council' },
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

/* ---- Simple dropdown ---- */
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
              <div className={cn(
                'absolute left-0 top-0 z-50 -translate-x-full pl-1 transition-all duration-200',
                expandedIdx === idx ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0',
              )}>
                <div className="min-w-[240px] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  {item.subItems.map((sub) => (
                    <Link key={sub.href} href={sub.href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link href={item.href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

/* ---- Mega dropdown ---- */
const DropdownMega = ({ groups }: { groups: GroupDef[] }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  return (
    <div className="min-w-[540px] rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
      <div className={cn('grid gap-6', groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {groups.map((group) => (
          <div key={group.title}>
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
                      <LuChevronRight size={14} className="text-slate-400" />
                    </div>
                    <div className={cn(
                      'absolute right-0 top-0 z-50 translate-x-full pr-1 transition-all duration-200',
                      expandedKey === item.href ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0',
                    )}>
                      <div className="min-w-[220px] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                        {item.subItems.map((sub) => (
                          <Link key={sub.href} href={sub.href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-[#C29C41]">
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

/* ---- Desktop nav item ---- */
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
          'relative flex items-center gap-1 px-3 py-2 text-base font-bold text-nowrap transition-all duration-300',
          isActive ? 'text-[#C29C41]' : 'text-slate-700 hover:text-[#0369A1]',
        )}
      >
        {item.label}
        {hasDropdown && (
          <LuChevronDown size={15} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        )}
      </Link>

      {hasDropdown && (
        <div className={cn(
          'absolute top-full z-50 pt-2 transition-all duration-200',
          item.id === 'archive' ? 'left-auto right-0' : 'right-0',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}>
          {item.groups ? <DropdownMega groups={item.groups} /> : <DropdownSimple items={item.children!} />}
        </div>
      )}
    </li>
  );
};

/* ---- Mobile accordion ---- */
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
      <Link href={item.href ?? `#${item.id}`} onClick={onNavigate} className="block rounded-xl px-4 py-4 text-lg font-bold text-slate-600 hover:text-[#0369A1]">
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
        <LuChevronDown size={18} className={cn('transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className="mr-4 border-r-2 border-[#C29C41]/20 pr-2">
          {allChildren.map((child, idx) => {
            if (child.isGroupHeader) {
              return <p key={`header-${idx}`} className="px-4 pb-1 pt-3 text-xs font-bold text-[#C29C41]">{child.groupTitle}</p>;
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
                    <LuChevronDown size={14} className={cn('transition-transform duration-300', isExpanded && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="mr-4 border-r-2 border-slate-50 pr-2">
                      {child.subItems.map((sub) => (
                        <Link key={sub.href} href={sub.href} onClick={onNavigate} className="block rounded-lg px-4 py-2 text-[0.8rem] font-medium text-slate-400 hover:text-[#C29C41]">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={child.href} href={child.href} onClick={onNavigate} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-[#0369A1]">
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---- TopNavBar ---- */
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
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
        isScrolled ? 'top-2 px-4 md:px-8' : 'top-0 px-0',
      )}>
        <nav className={cn(
          'mx-auto max-w-7xl transition-all duration-500',
          isScrolled
            ? 'rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-md py-1'
            : 'border-b border-transparent bg-transparent py-3',
        )}>
          <div className="px-4 lg:px-6">
            <div className="flex items-center gap-3">

              {/* LEFT — Main library logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo-2.png"
                  alt="Logo"
                  height={240}
                  width={260}
                  className={cn(
                    'object-contain transition-all duration-500',
                    isScrolled ? 'h-14 w-auto' : 'h-20 w-auto',
                  )}
                />
              </Link>

              {/* Gold divider */}
              <div
                className="hidden lg:block flex-shrink-0 w-px self-stretch my-2"
                style={{ backgroundColor: 'rgba(194,156,65,0.35)' }}
              />

              {/* CENTER — Desktop nav */}
              <ul className="hidden flex-1 items-center justify-center gap-0 lg:flex">
                {menuItemsData.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeSection === item.id} />
                ))}
              </ul>

              {/* RIGHT — Search + AIDSMO logo + mobile button */}
              <div className="flex items-center gap-3 flex-shrink-0 mr-auto lg:mr-0">

                {/* Search bar — blue border at rest, gold on focus */}
                <div className="hidden items-center lg:flex">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="بحث..."
                      dir="rtl"
                      className="h-10 w-40 rounded-full bg-white pr-10 pl-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:w-48 placeholder:text-[#095C9B]/60 placeholder:font-semibold"
                      style={{
                        border: '2px solid rgba(9,92,155,0.3)',
                        boxShadow: 'inset 0 0 0 1px rgba(194,156,65,0.12)',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#C29C41';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,156,65,0.15)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = 'rgba(9,92,155,0.3)';
                        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(194,156,65,0.12)';
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 text-[#095C9B]/60 group-focus-within:text-[#C29C41]">
                      <LuSearch size={15} />
                    </div>
                  </div>
                </div>

                {/* Gold divider before AIDSMO logo */}
                <div
                  className="hidden lg:block flex-shrink-0 w-px self-stretch my-2"
                  style={{ backgroundColor: 'rgba(194,156,65,0.35)' }}
                />

                {/* AIDSMO org logo — inside the nav box */}
                <Link
                  href="https://aidsmo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex flex-shrink-0 items-center"
                >
                  <Image
                    src="/aidsmo-logo.png"
                    alt="AIDSMO"
                    height={160}
                    width={160}
                    className={cn(
                      'object-contain transition-all duration-500',
                      isScrolled ? 'h-10 w-auto' : 'h-14 w-auto',
                    )}
                  />
                </Link>

                {/* Mobile menu button */}
                <button
                  className="rounded-xl bg-slate-100 p-2.5 text-slate-700 hover:bg-[#0369A1] hover:text-white lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <LuMenu size={24} />
                </button>
              </div>

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
      <div className={cn(
        'fixed bottom-0 right-0 top-0 z-[110] w-[85%] max-w-sm overflow-y-auto bg-white p-6 transition-transform duration-500 lg:hidden',
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
      )}>
        <div className="mb-8 flex items-center justify-between border-b border-[#C29C41]/20 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-2.png" alt="Logo" height={36} width={100} className="h-9 w-auto object-contain" />
            <span className="h-6 w-px" style={{ backgroundColor: 'rgba(194,156,65,0.3)' }} />
            <Image src="/aidsmo-logo.png" alt="AIDSMO" height={36} width={36} className="h-9 w-auto object-contain" />
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-slate-100 p-2">
            <LuX size={20} />
          </button>
        </div>

        {/* Mobile search — blue border, gold on focus */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="بحث..."
            dir="rtl"
            className="w-full rounded-xl bg-slate-50 py-3 pr-10 pl-4 text-sm outline-none transition-all duration-200 placeholder:text-[#095C9B]/60 placeholder:font-semibold"
            style={{ border: '2px solid rgba(9,92,155,0.25)' }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#C29C41';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,156,65,0.12)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(9,92,155,0.25)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#095C9B]/60" size={18} />
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