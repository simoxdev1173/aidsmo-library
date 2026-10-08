'use client';

import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LuBookMarked, LuChevronDown, LuChevronLeft, LuLogOut, LuMenu, LuSearch, LuSettings, LuUser, LuX } from 'react-icons/lu';
import { useAppLocale, type AppLocale } from '@/lib/i18n/LocaleProvider';
import { logoutUserAction } from '@/lib/user-actions';

type SiteUser = { id: string; email: string; name: string; image: string | null } | null;

type SubItem = { label: string; labelEn: string; href: string; subItems?: SubItem[] };
type ChildItem = { label: string; labelEn: string; href: string; subItems?: SubItem[] };
type GroupDef = { title: string; titleEn: string; items: ChildItem[] };
type MenuItem = {
  id: string;
  label: string;
  labelEn: string;
  href?: string;
  children?: ChildItem[];
  groups?: GroupDef[];
};

const pickLabel = (ar: string, en: string, locale: AppLocale) => (locale === 'en' ? en : ar);

const menuHref = (item: MenuItem) =>
  item.href ?? item.children?.[0]?.href ?? item.groups?.[0]?.items[0]?.href ?? '/';

const isMenuActive = (item: MenuItem, pathname: string, activeSection: string) => {
  if (pathname === '/') return activeSection === item.id;
  const root = item.href?.startsWith('/') ? item.href : item.id === 'industrial-info' ? '/info' : `/${item.id}`;
  return pathname === root || pathname.startsWith(`${root}/`);
};

const menuItemsData: MenuItem[] = [
  { id: 'about', label: 'من نحن', labelEn: 'About Us', href: '/about-us' },
  {
    id: 'industry',
    label: 'الصناعة',
    labelEn: 'Industry',
    href: '/industry',
    children: [
      { label: 'إستراتيجيات', labelEn: 'Strategies', href: '/industry/integration-strategy' },
      { label: 'الصناعات الصغيرة والمتوسطة', labelEn: 'Small & Medium Industries', href: '/industry/sme' },
      { label: 'فعاليات وأنشطة', labelEn: 'Events & Activities', href: '/industry/events' },
      { label: 'الدراسات والأدلة', labelEn: 'Studies & Guides', href: '/industry/studies' , subItems: [
           { label: 'الدراسات', labelEn: 'Studies', href: '/industry/studies/studies' },
        { label: 'الأدلة', labelEn: 'Guides', href: '/industry/studies/guides' },
        ],  },
    ],
  },
  {
    id: 'standardization',
    label: 'التقييس',
    labelEn: 'Standardization',
    href: '/standardization',
    children: [
      { label: 'دراسات', labelEn: 'Studies', href: '/standardization/studies' },
      { label: 'معاجم', labelEn: 'Glossaries', href: '/standardization/glossaries' },
      { label: 'أدلة', labelEn: 'Guides', href: '/standardization/guides' },
      { label: 'توجيهات', labelEn: 'Directives', href: '/standardization/directives' },
      { label: 'إستراتيجيات', labelEn: 'Strategies', href: '/standardization/strategies' },
      { label: 'دورات تدريبية', labelEn: 'Training Courses', href: '/standardization/training-courses' },
      { label: 'ورش عمل', labelEn: 'Workshops', href: '/standardization/workshops' },
      { label: 'ندوات', labelEn: 'Seminars', href: '/standardization/seminars' },
      { label: 'إجتماعات', labelEn: 'Meetings', href: '/standardization/meetings' },
    ],
  },
  {
    id: 'mining',
    label: 'التعدين',
    labelEn: 'Mining',
    children: [
      { label: 'المكتبة الرقمية للدراسات التعدينية العربية', labelEn: 'Arab Mining Studies Digital Library', href: 'https://arabmininglibrary.org/' },
    ],
  },
  {
    id: 'industrial-info',
    href: '/info',
    label: 'المعلومات الصناعية',
    labelEn: 'Industrial Information',
    children: [
      {
        label: 'الإحصاءات الصناعية',
        labelEn: 'Industrial Statistics',
        href: '/info/statistics',
        subItems: [
          { label: 'تقرير الصناعة العربية', labelEn: 'Arab Industry Report', href: '/info/statistics/arab-industry-report' },
          { label: 'كتيب المؤشرات الاقتصادية والصناعية', labelEn: 'Economic & Industrial Indicators Booklet', href: '/info/statistics/indicators-booklet' },
          { label: 'نشرة الإحصاءات الصناعية', labelEn: 'Industrial Statistics Bulletin', href: '/info/statistics/bulletin' },
          {
            label: 'الانفوجرافيك',
            labelEn: 'Infographics',
            href: '/info/statistics/infographics',
            subItems: [
              { label: '2023', labelEn: '2023', href: '/info/statistics/infographics/2023' },
              { label: '2024', labelEn: '2024', href: '/info/statistics/infographics/2024' },
              { label: '2025', labelEn: '2025', href: '/info/statistics/infographics/2025' },
              { label: '2026', labelEn: '2026', href: '/info/statistics/infographics/2026' },
            ],
          },
        ],
      },
      { label: 'مؤتمرات وندوات', labelEn: 'Conferences & Seminars', href: '/info/conferences' },
      { label: 'مجلة التنمية الصناعية', labelEn: 'Industrial Development Magazine', href: '/info/magazine' },
      {
        label: 'النشرة الدورية',
        labelEn: 'Periodic Newsletter',
        href: '/info/newsletter',
        subItems: [
          { label: '2024', labelEn: '2024', href: '/info/newsletter/2024' },
          { label: '2025', labelEn: '2025', href: '/info/newsletter/2025' },
          { label: '2026', labelEn: '2026', href: '/info/newsletter/2026' },
        ],
      },
      { label: 'الاصدارات', labelEn: 'Publications', href: '/info/publications' },
    ],
  },
  {
    id: 'training',
    label: 'التدريب والاستشارات',
    labelEn: 'Training & Consulting',
    children: [
      { label: 'حول المعهد', labelEn: 'About the Institute', href: '/training/about' },
      {
        label: 'الخطة التدريبية',
        labelEn: 'Training Plan',
        href: '/training/plan',
        subItems: [
          { label: '2024', labelEn: '2024', href: '/training/plan/2024' },
          { label: '2025', labelEn: '2025', href: '/training/plan/2025' },
          { label: '2026', labelEn: '2026', href: '/training/plan/2026' },
        ],
      },
    ],
  },
  {
    id: 'archive',
    label: 'الأرشيف',
    labelEn: 'Archive',
    groups: [
      {
        title: 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين',
        titleEn: 'Arab Industrial Development, Standardization and Mining Organization',
        items: [
          { label: 'تأسيس المنظمة', labelEn: 'Founding of the Organization', href: '/archive/org/founding' },
          { label: 'اتفاقيات الانشاء', labelEn: 'Founding Agreements', href: '/archive/org/agreements' },
          { label: 'النظام الداخلي', labelEn: 'Bylaws', href: '/archive/org/bylaws' },
          { label: 'اللوائح الداخلية والأنظمة', labelEn: 'Internal Regulations & Statutes', href: '/archive/org/regulations' },
          { label: 'مذكرات التفاهم واتفاقيات', labelEn: 'Memoranda of Understanding & Agreements', href: '/archive/org/mou' },
          { label: 'المجلس التنفيذي', labelEn: 'Executive Board', href: '/archive/org/executive-board' },
          { label: 'الجمعية العامة', labelEn: 'General Assembly', href: '/archive/org/general-assembly' },
          { label: 'النظام الأساسي و الداخلي للمحكمة الإدارية', labelEn: 'Administrative Court Statute & Bylaws', href: '/archive/org/administrative-court' },
        ],
      },
      {
        title: 'جامعة الدول العربية',
        titleEn: 'League of Arab States',
        items: [
          {
            label: 'القمة العربية',
            labelEn: 'Arab Summit',
            href: '/archive/league/summit',
            subItems: [
              { label: 'قرارات مجلس الجامعة على المستوى الوزاري', labelEn: 'Ministerial-Level Council Resolutions', href: '/archive/league/summit/council' },
              { label: 'مجلس الجامعة على مستوى القمة', labelEn: 'League Council at Summit Level', href: '/archive/league/summit/summit-council' },
              { label: 'قرارات القمة الاقتصادية و التنموية و الاجتماعية', labelEn: 'Economic, Developmental & Social Summit Resolutions', href: '/archive/league/summit/economic-social' },
            ],
          },
          { label: 'المجلس الاقتصادي والاجتماعي', labelEn: 'Economic & Social Council', href: '/archive/league/ecosoc' },
          { label: 'لجنة المنظمات والتنسيق و المتابعة المنبثقة عن المجلس الاقتصادي و الاجتماعي', labelEn: 'Organizations, Coordination & Follow-up Committee', href: '/archive/league/coordination' },
          { label: 'لجنة التنسيق العليا للعمل العربي المشترك', labelEn: 'Higher Coordination Committee for Joint Arab Action', href: '/archive/league/joint-action' },
          { label: 'اللوائح والأنظمة', labelEn: 'Regulations & Statutes', href: '/archive/league/regulations' },
          { label: 'النظام الداخلي لمجلس الجامعة الدول العربية', labelEn: 'Bylaws of the Council of the League of Arab States', href: '/archive/league/council-bylaws' },
          { label: 'ميثاق جامعة الدول العربية و ملحقاته', labelEn: 'Charter of the League of Arab States and its Annexes', href: '/archive/league/charter' },
          {
            label: 'المحكمة الإدارية',
            labelEn: 'Administrative Court',
            href: '/archive/league/administrative-court',
            subItems: [
              { label: 'النظام الأساسي و الداخلي', labelEn: 'Statute & Bylaws', href: '/archive/league/administrative-court/statute' },
            ],
          },
        ],
      },
    ],
  },
];

const dropdownShell = 'rounded-[14px] border border-[#C29C41]/30 bg-white/[0.98] p-2 shadow-[0_18px_44px_rgba(10,37,64,0.15)] backdrop-blur-xl';
const dropdownLink = 'block rounded-full px-4 py-2.5 text-sm font-medium leading-relaxed text-[#334155] transition duration-300 hover:bg-[#F0F7FC] hover:text-[#C29C41] focus:bg-[#F0F7FC] focus:text-[#C29C41] focus:outline-none';

const NestedFlyoutItems = ({ items }: { items: SubItem[] }) => {
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const { locale } = useAppLocale();

  return (
    <>
      {items.map((item) => (
        <div key={item.href}>
          {item.subItems ? (
            <div
              className="relative"
              onMouseEnter={() => setExpandedHref(item.href)}
              onMouseLeave={() => setExpandedHref(null)}
            >
              <div className={cn(dropdownLink, 'flex cursor-default items-center justify-between gap-4')}>
                <Link href={item.href} className="min-w-0 flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                <LuChevronLeft size={14} className="shrink-0 text-[#C29C41]" />
              </div>
              <div
                className={cn(
                  'absolute top-0 z-50 transition duration-300',
                  locale === 'ar'
                    ? 'left-0 -translate-x-full pl-2'
                    : 'right-0 translate-x-full pr-2',
                  expandedHref === item.href ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                <div className={cn('min-w-[180px]', dropdownShell)}>
                  <NestedFlyoutItems items={item.subItems} />
                </div>
              </div>
            </div>
          ) : (
            <Link href={item.href} className={dropdownLink}>
              {pickLabel(item.label, item.labelEn, locale)}
            </Link>
          )}
        </div>
      ))}
    </>
  );
};

const DropdownSimple = ({ items }: { items: ChildItem[] }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { locale } = useAppLocale();
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
              <div className={cn(dropdownLink, 'flex cursor-default items-center justify-between gap-4')}>
                <Link href={item.href} className="min-w-0 flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                <LuChevronLeft size={14} className="shrink-0 text-[#C29C41]" />
              </div>
              <div
                className={cn(
                  'absolute top-0 z-50 transition duration-300',
                  locale === 'ar'
                    ? 'left-0 -translate-x-full pl-2'
                    : 'right-0 translate-x-full pr-2',
                  expandedIdx === idx ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                <div className={cn('min-w-[250px]', dropdownShell)}>
                  <NestedFlyoutItems items={item.subItems} />
                </div>
              </div>
            </div>
          ) : (
            <Link href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className={dropdownLink}>
              {pickLabel(item.label, item.labelEn, locale)}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const DropdownMega = ({ groups }: { groups: GroupDef[] }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const { locale } = useAppLocale();

  return (
    <div className={cn('max-h-[calc(100dvh-7rem)] w-[min(680px,calc(100vw-2rem))] overflow-y-auto overscroll-contain', dropdownShell)}>
      <div className={cn('grid gap-4', groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 border-b border-[#C29C41]/25 px-3 pb-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#C29C41]">
              {pickLabel(group.title, group.titleEn, locale)}
            </p>
            {group.items.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setExpandedKey(item.href)}
                    onMouseLeave={() => setExpandedKey(null)}
                  >
                    <div className={cn(dropdownLink, 'flex cursor-default items-center justify-between gap-4')}>
                      <Link href={item.href} className="min-w-0 flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                      <LuChevronDown size={14} className={cn('shrink-0 text-[#C29C41] transition duration-300', expandedKey === item.href && 'rotate-180')} />
                    </div>
                    <div className={cn('overflow-hidden border-r border-[#C29C41]/20 pr-3 transition-all duration-300', expandedKey === item.href ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0')}>
                      {item.subItems.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-xs font-medium leading-relaxed text-[#64748B] transition duration-200 hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:bg-[#F0F7FC] focus:text-[#0369A1] focus:outline-none">
                          {pickLabel(sub.label, sub.labelEn, locale)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className={dropdownLink}>
                    {pickLabel(item.label, item.labelEn, locale)}
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

const LanguageSwitcher = ({ tone = 'light', className, compact = false }: { tone?: 'light' | 'dark'; className?: string; compact?: boolean }) => {
  const { locale, setLocale } = useAppLocale();
  const t = useTranslations('nav');

  return (
    <div
      role="group"
      aria-label={t('languageGroupLabel')}
      className={cn(
        'flex shrink-0 items-center gap-0.5 rounded-full border p-0.5 transition duration-300',
        tone === 'dark' ? 'border-white/25 bg-white/10' : 'border-[#0369A1]/20 bg-[#F8FAFC]',
        className,
      )}
    >
      {(['ar', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          aria-label={option === 'ar' ? 'العربية' : 'English'}
          className={cn(
            'flex items-center justify-center rounded-full font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41]',
            compact ? 'h-10 min-w-10 px-2 text-xs max-[359px]:h-9 max-[359px]:min-w-9 max-[359px]:px-1.5' : 'h-9 min-w-9 px-2.5 text-xs',
            locale === option
              ? 'bg-[#C29C41] text-[#0A2540] shadow-[0_4px_12px_rgba(194,156,65,0.32)]'
              : tone === 'dark' ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-[#64748B] hover:text-[#0A2540]',
          )}
        >
          {option === 'ar' ? 'عربي' : 'EN'}
        </button>
      ))}
    </div>
  );
};

const NavItem = ({ item, isActive, tone = 'light', collapsed = false, enlarged = false }: { item: MenuItem; isActive: boolean; tone?: 'light' | 'dark'; collapsed?: boolean; enlarged?: boolean }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasDropdown = item.children || item.groups;
  const href = menuHref(item);
  const { locale } = useAppLocale();

  const enter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <li
      aria-hidden={collapsed}
      inert={collapsed}
      className={cn('relative transition-[max-width,opacity] duration-[420ms] ease-out motion-reduce:transition-none', collapsed ? 'max-w-0 overflow-hidden opacity-0' : 'max-w-72 overflow-visible opacity-100')}
      onMouseEnter={hasDropdown ? enter : undefined}
      onMouseLeave={hasDropdown ? leave : undefined}
      onFocusCapture={hasDropdown ? enter : undefined}
      onBlurCapture={
        hasDropdown
          ? (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) leave();
            }
          : undefined
      }
    >
      <Link
        href={href}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
          'relative flex min-h-11 items-center gap-1 text-nowrap rounded-full px-3 text-[0.78rem] font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2',
          tone === 'dark'
            ? cn('xl:px-4 xl:text-sm focus:ring-offset-[#0A2540]', isActive ? 'bg-white/10 text-[#F2D982]' : 'text-white/90 hover:bg-white/10 hover:text-[#F2D982]')
            : cn('2xl:px-2 2xl:text-[0.82rem] focus:ring-offset-white', isActive ? 'text-[#A77C20]' : 'text-[#0A2540] hover:bg-white/45 hover:text-[#9A7421]'),
          enlarged && 'min-h-12 px-4 text-[0.95rem]',
        )}
      >
        {pickLabel(item.label, item.labelEn, locale)}
        {hasDropdown && <LuChevronDown size={15} className={cn('transition duration-300', open && 'rotate-180')} />}
      </Link>

      {hasDropdown && (
        <div
          className={cn(
            'absolute top-full z-50 pt-3 transition duration-300',
            item.id === 'archive' ? 'end-0' : 'start-0',
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
  const [expandedSubChild, setExpandedSubChild] = useState<string | null>(null);
  const hasChildren = item.children || item.groups;
  const { locale } = useAppLocale();

  const allChildren: (ChildItem & { isGroupHeader?: boolean; groupTitle?: string })[] =
    item.children
      ? item.children
      : item.groups
        ? item.groups.flatMap((g) => [{ label: '', labelEn: '', href: '', isGroupHeader: true, groupTitle: pickLabel(g.title, g.titleEn, locale) }, ...g.items])
        : [];

  if (!hasChildren) {
    return (
      <Link href={item.href ?? `#${item.id}`} onClick={onNavigate} className="block min-h-12 rounded-full border-b border-[#0369A1]/10 px-4 py-3 text-lg font-bold text-[#003652]">
        {pickLabel(item.label, item.labelEn, locale)}
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
        {pickLabel(item.label, item.labelEn, locale)}
        <LuChevronDown size={18} className={cn('text-[#C29C41] transition duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-[1400px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className="ms-3 border-s border-[#C29C41]/30 ps-3">
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
                    className="flex min-h-11 w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold text-[#475569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]"
                  >
                    {pickLabel(child.label, child.labelEn, locale)}
                    <LuChevronDown size={14} className={cn('text-[#C29C41] transition duration-300', isExpanded && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[440px] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="ms-4 border-s border-[#0369A1]/10 ps-2">
                      {child.subItems.map((sub) => {
                        if (sub.subItems && sub.subItems.length > 0) {
                          const isSubExpanded = expandedSubChild === sub.href;

                          return (
                            <div key={sub.href}>
                              <div className="flex items-center gap-1 rounded-full">
                                <Link href={sub.href} onClick={onNavigate} className="flex min-h-11 flex-1 items-center rounded-full px-4 py-2 text-sm font-semibold text-[#475569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                                  {pickLabel(sub.label, sub.labelEn, locale)}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setExpandedSubChild(isSubExpanded ? null : sub.href)}
                                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#C29C41] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]"
                                  aria-label={`${pickLabel(sub.label, sub.labelEn, locale)} submenu`}
                                >
                                  <LuChevronDown size={14} className={cn('transition duration-300', isSubExpanded && 'rotate-180')} />
                                </button>
                              </div>
                              <div className={cn('overflow-hidden transition-all duration-300', isSubExpanded ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0')}>
                                <div className="ms-4 border-s border-[#C29C41]/20 ps-2">
                                  {sub.subItems.map((nested) => (
                                    <Link key={nested.href} href={nested.href} onClick={onNavigate} className="flex min-h-11 items-center rounded-full px-4 py-2 text-sm text-[#475569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                                      {pickLabel(nested.label, nested.labelEn, locale)}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link key={sub.href} href={sub.href} onClick={onNavigate} className="flex min-h-11 items-center rounded-full px-4 py-2 text-sm text-[#475569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                            {pickLabel(sub.label, sub.labelEn, locale)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={child.href} href={child.href} target={child.href.startsWith('http') ? '_blank' : undefined} rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={onNavigate} className="flex min-h-11 items-center rounded-full px-4 py-2.5 text-sm font-medium text-[#475569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                {pickLabel(child.label, child.labelEn, locale)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UserAvatar = ({
  user,
  className = 'size-9',
  iconSize = 17,
}: {
  user: NonNullable<SiteUser>;
  className?: string;
  iconSize?: number;
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C29C41]/45 bg-gradient-to-br from-[#0B4E84] to-[#022A4E] text-[#E8C96A] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.12)]',
        className,
      )}
      aria-hidden="true"
    >
      {user.image && !imageFailed ? (
        <Image
          src={user.image}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <LuUser size={iconSize} strokeWidth={1.9} />
      )}
    </span>
  );
};

const TopNavBar = ({ user }: { user: SiteUser }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [compactSearchOpen, setCompactSearchOpen] = useState(false);
  const [compactSearchPath, setCompactSearchPath] = useState(pathname);
  const [compactAccountOpen, setCompactAccountOpen] = useState(false);
  const [compactAccountPath, setCompactAccountPath] = useState(pathname);
  const [activeSection, setActiveSection] = useState('home');
  const pendingHomeScrollRef = useRef(false);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const compactSearchRef = useRef<HTMLDivElement>(null);
  const compactSearchButtonRef = useRef<HTMLButtonElement>(null);
  const compactSearchInputRef = useRef<HTMLInputElement>(null);
  const compactAccountRef = useRef<HTMLDivElement>(null);
  const compactAccountButtonRef = useRef<HTMLButtonElement>(null);
  const isCompactRef = useRef(false);
  const { locale } = useAppLocale();
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const tFooter = useTranslations('footer');
  const compactSearchVisible = isCompact && compactSearchOpen && compactSearchPath === pathname;
  const compactAccountVisible = isCompact && compactAccountOpen && compactAccountPath === pathname;

  const handleHomeNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    pendingHomeScrollRef.current = true;
    if (pathname === '/') {
      event.preventDefault();
      if (!mobileMenuOpen) {
        pendingHomeScrollRef.current = false;
        window.scrollTo(0, 0);
      }
    }
  };

  useLayoutEffect(() => {
    if (pathname === '/' && !mobileMenuOpen && pendingHomeScrollRef.current) {
      pendingHomeScrollRef.current = false;
      window.scrollTo(0, 0);
    }
  }, [pathname, mobileMenuOpen]);

  useEffect(() => {
    let frame = 0;
    let lastSection = 'home';
    let lastSectionCheck = -Infinity;
    const updateFromScroll = () => {
      const now = performance.now();
      const nextCompact = window.scrollY > (isCompactRef.current ? 28 : 112);
      if (nextCompact !== isCompactRef.current) {
        isCompactRef.current = nextCompact;
        setIsCompact(nextCompact);
        if (nextCompact) setAccountMenuOpen(false);
        else {
          setCompactSearchOpen(false);
          setCompactAccountOpen(false);
        }
      }
      if (pathname === '/' && now - lastSectionCheck >= 120) {
        lastSectionCheck = now;
        const scrollPosition = window.scrollY + (window.innerWidth < 768 ? 188 : 156);
        for (const item of menuItemsData) {
          const section = document.getElementById(item.id);
          if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
            if (section.id !== lastSection) {
              lastSection = section.id;
              setActiveSection(section.id);
            }
            break;
          }
        }
      }
      frame = 0;
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!compactSearchVisible) return;
    const focusFrame = window.requestAnimationFrame(() => compactSearchInputRef.current?.focus());
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!compactSearchRef.current?.contains(event.target as Node)) setCompactSearchOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCompactSearchOpen(false);
        compactSearchButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [compactSearchVisible]);

  useEffect(() => {
    if (!compactAccountVisible) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!compactAccountRef.current?.contains(event.target as Node)) setCompactAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCompactAccountOpen(false);
        compactAccountButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [compactAccountVisible]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = mobileMenuButtonRef.current;
    const handleMenuKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !mobileMenuRef.current) return;

      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const closeAtDesktopWidth = () => {
      if (window.innerWidth >= 1536) setMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current
        ?.querySelector<HTMLElement>('button, a[href], input')
        ?.focus();
    });
    window.addEventListener('keydown', handleMenuKeyboard);
    window.addEventListener('resize', closeAtDesktopWidth);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleMenuKeyboard);
      window.removeEventListener('resize', closeAtDesktopWidth);
      menuButton?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
        accountMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [accountMenuOpen]);

  return (
    <>
      <header data-compact={isCompact} className="sticky top-0 z-[60] w-full shadow-[0_8px_24px_rgba(10,37,64,0.14)]">
        <div
          aria-hidden={isCompact}
          inert={isCompact}
          className={cn(
            'bg-[#0A2540] transition-[max-height,opacity,border-color,border-width] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            isCompact
              ? 'max-h-0 overflow-hidden border-b-0 border-transparent opacity-0'
              : 'max-h-[124px] overflow-visible border-b border-[#E8C96A]/30 opacity-100 md:max-h-[88px]',
          )}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div dir="rtl" className="flex h-[76px] items-center justify-between gap-3 md:h-[88px]">
              <div className="flex shrink-0 items-center">
                <Link href="/" scroll={false} onClick={handleHomeNavigate} aria-label={locale === 'ar' ? 'الذهاب إلى الرئيسية' : 'Go to homepage'} className="flex h-14 w-20 shrink-0 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8C96A] focus:ring-offset-2 focus:ring-offset-[#0A2540] sm:w-24 md:h-16 md:w-28">
                  <Image src="/logo-3d-3d.png" alt={tHero('logoAlt')} height={240} width={260} className="h-full w-full object-contain" priority />
                </Link>
              </div>

              <form action="/search" method="get" role="search" className="hidden min-w-0 flex-1 justify-center md:flex">
                <label className="relative block w-full max-w-[30rem]">
                  <span className="sr-only">{t('searchLabel')}</span>
                  <input type="search" name="q" required minLength={2} maxLength={120} placeholder={t('searchPlaceholder')} dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    className="h-11 w-full rounded-full border border-[#D7E1E9] bg-white pe-5 ps-12 text-sm font-medium text-[#0A2540] shadow-[0_2px_9px_rgba(10,37,64,0.04)] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25" />
                  <button type="submit" aria-label={t('searchLabel')} className="absolute start-1 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#0A2540] text-[#E8C96A] transition-colors hover:bg-[#16466D] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                    <LuSearch className="size-4" />
                  </button>
                </label>
              </form>

              <div className="flex shrink-0 items-center gap-2">
                <LanguageSwitcher tone="dark" />

                {user && (
                  <div
                    ref={accountMenuRef}
                    className="relative hidden xl:block"
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setAccountMenuOpen(false);
                      }
                    }}
                  >
                    <button
                      ref={accountMenuButtonRef}
                      type="button"
                      onClick={() => setAccountMenuOpen((open) => !open)}
                      aria-haspopup="menu"
                      aria-expanded={accountMenuOpen}
                      aria-controls="desktop-account-menu"
                      className={cn(
                        'flex h-11 max-w-48 items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1 pe-3 ps-1 text-start text-white transition duration-200 hover:border-[#E8C96A]/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#E8C96A] focus:ring-offset-2 focus:ring-offset-[#0A2540]',
                        accountMenuOpen && 'border-[#E8C96A]/70 bg-white/15',
                      )}
                    >
                      <UserAvatar user={user} className="size-9" />
                      <span className="block max-w-24 truncate text-xs font-bold min-[1800px]:max-w-32">{user.name}</span>
                      <LuChevronDown
                        size={14}
                        className={cn('shrink-0 text-[#C29C41] transition-transform duration-300 motion-reduce:transition-none', accountMenuOpen && 'rotate-180')}
                      />
                    </button>

                    <div
                      id="desktop-account-menu"
                      role="menu"
                      aria-hidden={!accountMenuOpen}
                      inert={!accountMenuOpen}
                      className={cn(
                        'absolute end-0 top-full z-[80] w-72 pt-3 transition duration-200 motion-reduce:transition-none',
                        accountMenuOpen
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none -translate-y-1.5 opacity-0',
                      )}
                    >
                      <div className="overflow-hidden rounded-[14px] border border-[#C29C41]/30 bg-white shadow-[0_22px_55px_rgba(10,37,64,0.22)] ring-1 ring-[#0A2540]/5">
                        <div className="relative flex items-center gap-3 border-b border-[#0369A1]/10 bg-[#F8FAFC] px-4 py-4">
                          <span className="absolute inset-y-0 start-0 w-1 bg-[#C29C41]" aria-hidden="true" />
                          <UserAvatar user={user} className="size-11" iconSize={20} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#0A2540]">{user.name}</p>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            href="/library"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50"
                          >
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#E8F2F8] text-[#0369A1]"><LuBookMarked size={16} /></span>
                            مكتبتي
                          </Link>
                          <Link
                            href="/profile"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50"
                          >
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#E8F2F8] text-[#0369A1]"><LuSettings size={16} /></span>
                            إعدادات الملف الشخصي
                          </Link>
                          <div className="my-1 h-px bg-[#0A2540]/[0.07]" />
                          <form action={logoutUserAction}>
                            <button
                              type="submit"
                              role="menuitem"
                              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#9F2D2D] transition hover:bg-red-50 focus:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                            >
                              <span className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-[#B43A3A]"><LuLogOut size={16} /></span>
                              تسجيل الخروج
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!user && (
                  <Link href="/login" aria-label={t('loginFull')}
                    className="engraved brass-gradient hidden h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#C29C41] px-5 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 xl:flex">
                    <LuUser size={16} />
                    {t('loginFull')}
                  </Link>
                )}

                <span className="hidden h-10 w-px bg-[#E8C96A]/35 sm:block" aria-hidden="true" />
                <Link href="https://aidsmo.org" target="_blank" rel="noopener noreferrer" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-[0_3px_15px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-[#E8C96A] focus:ring-offset-2 focus:ring-offset-[#0A2540] md:size-[68px]">
                  <Image src="/aidsmo-logo.png" alt={tFooter('orgLogoAlt')} height={160} width={160} className="h-full w-full object-contain" priority />
                </Link>
              </div>
            </div>

            <form action="/search" method="get" role="search" className="relative pb-2 md:hidden">
              <label htmlFor="top-mobile-search" className="sr-only">{t('searchLabel')}</label>
              <input id="top-mobile-search" type="search" name="q" required minLength={2} maxLength={120} placeholder={t('searchPlaceholder')} dir={locale === 'ar' ? 'rtl' : 'ltr'}
                className="h-10 w-full rounded-full border border-[#D7E1E9] bg-white pe-4 ps-11 text-sm text-[#0A2540] outline-none placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25" />
              <button type="submit" aria-label={t('searchLabel')} className="absolute start-1 top-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#0A2540] text-[#E8C96A] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
                <LuSearch className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <nav aria-label={t('mainMenuLabel')} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="relative w-full border-b border-[#C29C41]/45 bg-[#0A2540] text-white">
          <div className={cn('flex w-full items-center gap-1 px-3 transition-[height] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:gap-2 sm:px-6 lg:gap-3 lg:px-8', isCompact ? 'h-[60px] justify-between md:h-16 lg:grid lg:grid-cols-[minmax(20rem,1fr)_minmax(0,3fr)_minmax(20rem,1fr)]' : 'h-[52px] md:h-14')}>
            <Link data-nav-zone="logo" href="/" scroll={false} onClick={handleHomeNavigate} aria-label={locale === 'ar' ? 'الذهاب إلى الرئيسية' : 'Go to homepage'} aria-hidden={!isCompact} inert={!isCompact} className={cn('flex shrink-0 items-center overflow-hidden rounded-lg transition-[width,height,opacity,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-[#E8C96A] focus:ring-offset-2 focus:ring-offset-[#0A2540] motion-reduce:transition-none lg:justify-self-start', isCompact ? 'h-12 w-12 translate-y-0 opacity-100 delay-75 max-[359px]:w-8 sm:w-20' : 'pointer-events-none h-11 w-0 -translate-y-1 opacity-0 delay-0')}>
              <Image src="/logo-3d-3d.png" alt="" height={120} width={130} className="h-full w-full shrink-0 object-contain" />
            </Link>
            <div data-nav-zone="links" className={cn('min-w-0 flex-1', isCompact && 'hidden lg:block lg:w-full')}>
            <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 2xl:flex">
              {menuItemsData.map((item) => (
                <NavItem key={item.id} item={item} isActive={isMenuActive(item, pathname ?? '/', activeSection)} tone="dark" collapsed={isCompact && item.id === 'about'} enlarged={isCompact} />
              ))}
            </ul>

            <div className={cn('min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden 2xl:hidden', isCompact ? 'hidden lg:flex' : 'flex')}>
              {menuItemsData.map((item) => {
                const href = menuHref(item);
                const active = isMenuActive(item, pathname ?? '/', activeSection);
                return (
                  <Link key={item.id} href={href} aria-hidden={isCompact && item.id === 'about'} inert={isCompact && item.id === 'about'} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={cn('flex shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full font-bold transition-[max-width,padding,opacity,background-color,color,font-size] duration-[420ms] ease-out focus:outline-none focus:ring-2 focus:ring-[#C29C41] motion-reduce:transition-none', isCompact ? 'min-h-12 text-sm' : 'min-h-11 text-xs', isCompact && item.id === 'about' ? 'max-w-0 px-0 opacity-0' : 'max-w-72 px-3 opacity-100', active ? 'bg-white/10 text-[#F2D982]' : 'text-white/90 hover:bg-white/10 hover:text-[#F2D982]')}>
                    {pickLabel(item.label, item.labelEn, locale)}
                  </Link>
                );
              })}
            </div>
            </div>

            <div data-nav-zone="actions" className={cn('flex shrink-0 items-center', isCompact ? 'gap-2 sm:gap-3 lg:justify-self-end' : 'gap-0')}>
            <div aria-hidden={!isCompact} inert={!isCompact} className={cn('shrink-0 overflow-hidden transition-[width,opacity,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', isCompact ? 'w-[104px] translate-y-0 overflow-visible opacity-100 delay-75 max-[359px]:w-[84px]' : 'pointer-events-none w-0 -translate-y-1 opacity-0 delay-0')}>
              <LanguageSwitcher tone="dark" compact className="w-full justify-center" />
            </div>

              <div ref={compactSearchRef} aria-hidden={!isCompact} inert={!isCompact} className={cn('relative shrink-0 transition-[width,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', isCompact ? 'w-12 opacity-100 delay-75 max-[359px]:w-10' : 'pointer-events-none w-0 opacity-0 delay-0')}>
                <button
                  ref={compactSearchButtonRef}
                  type="button"
                  onClick={() => { setCompactSearchPath(pathname); setCompactAccountOpen(false); setMobileMenuOpen(false); setCompactSearchOpen(!compactSearchVisible); }}
                  aria-label={t('searchLabel')}
                  aria-expanded={compactSearchVisible}
                  aria-controls="compact-nav-search"
                  className={cn('flex size-12 items-center justify-center rounded-full border text-[#E8C96A] transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#E8C96A] motion-reduce:transition-none max-[359px]:size-10', compactSearchVisible ? 'border-[#E8C96A] bg-white/15' : 'border-[#C29C41]/40 bg-white/5')}
                >
                  <LuSearch size={21} />
                </button>
                <div
                  id="compact-nav-search"
                  aria-hidden={!compactSearchVisible}
                  inert={!compactSearchVisible}
                  className={cn('fixed inset-x-4 top-[64px] z-[80] pt-3 transition duration-200 ease-out motion-reduce:transition-none sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:w-[min(30rem,calc(100vw-2rem))]', compactSearchVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0')}
                >
                  <form action="/search" method="get" role="search" onSubmit={() => setCompactSearchOpen(false)} className="flex items-center gap-2 rounded-[16px] border border-[#C29C41]/45 bg-white p-2 shadow-[0_18px_46px_rgba(10,37,64,0.24)]">
                    <label htmlFor="compact-search-input" className="sr-only">{t('searchLabel')}</label>
                    <input ref={compactSearchInputRef} id="compact-search-input" type="search" name="q" required minLength={2} maxLength={120} placeholder={t('searchPlaceholder')} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="h-10 min-w-0 flex-1 rounded-lg px-3 text-sm text-[#0A2540] outline-none placeholder:text-[#64748B] focus:ring-2 focus:ring-[#C29C41]/45" />
                    <button type="submit" aria-label={t('searchLabel')} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-[#E8C96A] transition-colors hover:bg-[#16466D] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"><LuSearch size={18} /></button>
                    <button type="button" onClick={() => { setCompactSearchOpen(false); compactSearchButtonRef.current?.focus(); }} aria-label={locale === 'ar' ? 'إغلاق البحث' : 'Close search'} className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"><LuX size={18} /></button>
                  </form>
                </div>
              </div>

              <div
                ref={compactAccountRef}
                aria-hidden={!isCompact}
                inert={!isCompact}
                className={cn('relative shrink-0 transition-[width,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', isCompact ? 'w-[74px] opacity-100 delay-75 max-[359px]:w-16' : 'pointer-events-none w-0 opacity-0 delay-0')}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCompactAccountOpen(false);
                }}
              >
                <button
                  ref={compactAccountButtonRef}
                  type="button"
                  onClick={() => { setCompactAccountPath(pathname); setCompactSearchOpen(false); setCompactAccountOpen(!compactAccountVisible); }}
                  aria-label={locale === 'ar' ? 'قائمة الحساب' : 'Account menu'}
                  aria-haspopup="menu"
                  aria-expanded={compactAccountVisible}
                  aria-controls="compact-account-menu"
                  className={cn('flex h-12 min-w-[74px] items-center justify-center gap-1 rounded-full border px-1 text-[#E8C96A] transition-colors hover:border-[#E8C96A] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#E8C96A] motion-reduce:transition-none max-[359px]:h-10 max-[359px]:min-w-16', compactAccountVisible ? 'border-[#E8C96A] bg-white/15' : 'border-[#C29C41]/40 bg-white/5')}
                >
                  {user ? <UserAvatar user={user} className="size-10 max-[359px]:size-9" /> : <LuUser size={21} />}
                  <LuChevronDown aria-hidden="true" size={15} className={cn('shrink-0 transition-transform duration-200 motion-reduce:transition-none', compactAccountVisible && 'rotate-180')} />
                </button>
                <div
                  id="compact-account-menu"
                  role="menu"
                  aria-hidden={!compactAccountVisible}
                  inert={!compactAccountVisible}
                  className={cn('fixed inset-x-4 top-[64px] z-[80] pt-3 transition duration-200 ease-out motion-reduce:transition-none sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:w-72', compactAccountVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0')}
                >
                  <div className="overflow-hidden rounded-[14px] border border-[#C29C41]/30 bg-white shadow-[0_22px_55px_rgba(10,37,64,0.22)] ring-1 ring-[#0A2540]/5">
                    {user && (
                      <div className="flex items-center gap-3 border-b border-[#0369A1]/10 bg-[#F8FAFC] px-4 py-3">
                        <UserAvatar user={user} className="size-10" />
                        <p className="min-w-0 truncate text-sm font-bold text-[#0A2540]">{user.name}</p>
                      </div>
                    )}
                    <div className="p-2">
                      {user ? (
                        <>
                          <Link href="/library" role="menuitem" onClick={() => setCompactAccountOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50">
                            <LuBookMarked size={17} className="text-[#0369A1]" />
                            {locale === 'ar' ? 'مكتبتي' : 'My library'}
                          </Link>
                          <Link href="/profile" role="menuitem" onClick={() => setCompactAccountOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50">
                            <LuSettings size={17} className="text-[#0369A1]" />
                            {locale === 'ar' ? 'إعدادات الملف الشخصي' : 'Profile settings'}
                          </Link>
                          <div className="my-1 h-px bg-[#0A2540]/[0.07]" />
                          <form action={logoutUserAction}>
                            <button type="submit" role="menuitem" className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#9F2D2D] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200">
                              <LuLogOut size={17} />
                              {locale === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <Link href="/login" role="menuitem" onClick={() => setCompactAccountOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50">
                            <LuUser size={17} className="text-[#0369A1]" />
                            {t('loginFull')}
                          </Link>
                          <Link href="/signup" role="menuitem" onClick={() => setCompactAccountOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#0A2540] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50">
                            <LuUser size={17} className="text-[#0369A1]" />
                            {locale === 'ar' ? 'إنشاء حساب' : 'Create account'}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            <button ref={mobileMenuButtonRef} type="button"
              className={cn('flex shrink-0 items-center justify-center rounded-full border border-[#C29C41]/60 bg-white/10 text-[#E8C96A] transition-[width,height,background-color] duration-[420ms] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#C29C41] max-[359px]:size-10 2xl:hidden', isCompact ? 'size-12' : 'size-11')}
              onClick={() => { setAccountMenuOpen(false); setCompactAccountOpen(false); setCompactSearchOpen(false); setMobileMenuOpen(true); }}
              aria-label={t('openMenu')} aria-expanded={mobileMenuOpen} aria-controls="mobile-site-menu">
              <LuMenu size={isCompact ? 24 : 22} />
            </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[100] bg-[#0A2540]/55 backdrop-blur-sm transition-opacity 2xl:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        ref={mobileMenuRef}
        id="mobile-site-menu"
        className={cn(
          'fixed inset-y-0 right-0 z-[110] h-dvh w-[min(92vw,26rem)] max-w-full overscroll-contain overflow-y-auto rounded-l-[14px] border-l border-[#C29C41]/30 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-[-18px_0_60px_rgba(10,37,64,0.22)] transition-transform duration-500 sm:p-6 2xl:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        aria-label={t('mainMenuLabel')}
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#C29C41]/25 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-2.png" alt={tHero('logoAlt')} height={44} width={112} className="h-10 w-auto object-contain" />
            <span className="h-8 w-px bg-[#C29C41]/30" />
            <Image src="/aidsmo-logo.png" alt={tFooter('orgLogoAlt')} height={40} width={40} className="h-10 w-auto object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex size-11 items-center justify-center rounded-full border border-[#C29C41]/35 bg-[#F8FAFC] text-[#003652] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]"
            aria-label={t('closeMenu')}
          >
            <LuX size={20} />
          </button>
        </div>

        <form action="/search" method="get" onSubmit={() => setMobileMenuOpen(false)} className="relative mb-5 block">
          <label htmlFor="mobile-nav-search" className="sr-only">{t('searchLabel')}</label>
          <input
            id="mobile-nav-search"
            type="search"
            name="q"
            required
            minLength={2}
            maxLength={120}
            placeholder={t('searchPlaceholder')}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            className="h-12 w-full rounded-full border border-[#0369A1]/20 bg-[#F8FAFC] pe-4 ps-12 text-sm outline-none transition duration-300 placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
          />
          <button type="submit" aria-label={t('searchLabel')} className="absolute start-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
            <LuSearch className="h-4 w-4" />
          </button>
        </form>

        <div className={cn('mb-4 flex items-center gap-2', user && 'justify-end')}>
          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="engraved brass-gradient flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#C29C41] px-4 py-3 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
            >
              <LuUser size={18} />
              {t('loginFull')}
            </Link>
          )}
          <LanguageSwitcher />
        </div>

        {user && (
          <div className="mb-5 overflow-hidden rounded-[14px] border border-[#C29C41]/30 bg-[#F8FAFC] shadow-sm">
            <div className="relative flex items-center gap-3 px-4 py-4">
              <span className="absolute inset-y-0 start-0 w-1 bg-[#C29C41]" aria-hidden="true" />
              <UserAvatar user={user} className="size-12" iconSize={21} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0A2540]">{user.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-[#0369A1]/10 bg-white p-2">
              <Link
                href="/library"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-[#0369A1] transition hover:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50"
              >
                <LuBookMarked size={16} />
                مكتبتي
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-[#0369A1] transition hover:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]/50">
                <LuSettings size={16} />
                إعدادات الحساب
              </Link>
              <form action={logoutUserAction} className="col-span-2 border-t border-[#0A2540]/10">
                <button type="submit" className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold text-[#9F2D2D] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200">
                  <LuLogOut size={16} />
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </div>
        )}

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
