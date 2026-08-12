'use client';

import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { LuBookMarked, LuChevronDown, LuChevronLeft, LuLogOut, LuMenu, LuSearch, LuUser, LuX } from 'react-icons/lu';
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

const menuItemsData: MenuItem[] = [
  { id: 'home', label: 'الرئيسية', labelEn: 'Home', href: '/' },
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
              <div className={cn('flex cursor-default items-center justify-between gap-4', dropdownLink)}>
                <Link href={item.href} className="flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                <LuChevronLeft size={14} className="text-[#C29C41]" />
              </div>
              <div
                className={cn(
                  'absolute left-0 top-0 z-50 -translate-x-full pl-2 transition duration-300',
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
              <div className={cn('flex cursor-default items-center justify-between gap-4', dropdownLink)}>
                <Link href={item.href} className="flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                <LuChevronLeft size={14} className="text-[#C29C41]" />
              </div>
              <div
                className={cn(
                  'absolute left-0 top-0 z-50 -translate-x-full pl-2 transition duration-300',
                  expandedIdx === idx ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                <div className={cn('min-w-[250px]', dropdownShell)}>
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
    </div>
  );
};

const DropdownMega = ({ groups }: { groups: GroupDef[] }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const { locale } = useAppLocale();

  return (
    <div className={cn('w-[min(680px,calc(100vw-2rem))]', dropdownShell)}>
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
                    <div className={cn('flex cursor-default items-center justify-between gap-4', dropdownLink)}>
                      <Link href={item.href} className="flex-1">{pickLabel(item.label, item.labelEn, locale)}</Link>
                      <LuChevronDown size={14} className={cn('text-[#C29C41] transition duration-300', expandedKey === item.href && 'rotate-180')} />
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

const LanguageSwitcher = ({ isSolid, className }: { isSolid: boolean; className?: string }) => {
  const { locale, setLocale } = useAppLocale();
  const t = useTranslations('nav');

  return (
    <div
      role="group"
      aria-label={t('languageGroupLabel')}
      className={cn(
        'flex shrink-0 items-center gap-0.5 rounded-full border p-0.5 transition duration-300',
        isSolid ? 'border-[#0369A1]/20 bg-[#F8FAFC]' : 'border-white/18 bg-white/10',
        className,
      )}
    >
      {(['ar', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={cn(
            'flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-xs font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41]',
            locale === option
              ? 'bg-[#C29C41] text-[#0A2540] shadow-[0_4px_12px_rgba(194,156,65,0.32)]'
              : isSolid
                ? 'text-[#64748B] hover:text-[#0A2540]'
                : 'text-white/60 hover:text-white',
          )}
        >
          {option === 'ar' ? 'عربي' : 'EN'}
        </button>
      ))}
    </div>
  );
};

const NavItem = ({ item, isActive, isScrolled }: { item: MenuItem; isActive: boolean; isScrolled: boolean }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasDropdown = item.children || item.groups;
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
      className="relative"
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
        href={item.href ?? `#${item.id}`}
        className={cn(
          'relative flex min-h-11 items-center gap-1 text-nowrap rounded-full px-2 text-[0.76rem] font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 2xl:px-4 2xl:text-sm',
          isScrolled
            ? cn('focus:ring-offset-white', isActive ? 'text-[#C29C41]' : 'text-[#0A2540] hover:text-[#C29C41]')
            : cn('focus:ring-offset-[#0A2540]', isActive ? 'text-[#E8C96A]' : 'text-white/88 hover:text-[#E8C96A]'),
        )}
      >
        {pickLabel(item.label, item.labelEn, locale)}
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
                    className="flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold text-[#475569]"
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
                                <Link href={sub.href} onClick={onNavigate} className="block flex-1 rounded-full px-4 py-2 text-sm font-semibold text-[#475569]">
                                  {pickLabel(sub.label, sub.labelEn, locale)}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setExpandedSubChild(isSubExpanded ? null : sub.href)}
                                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#C29C41]"
                                  aria-label={`${pickLabel(sub.label, sub.labelEn, locale)} submenu`}
                                >
                                  <LuChevronDown size={14} className={cn('transition duration-300', isSubExpanded && 'rotate-180')} />
                                </button>
                              </div>
                              <div className={cn('overflow-hidden transition-all duration-300', isSubExpanded ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0')}>
                                <div className="ms-4 border-s border-[#C29C41]/20 ps-2">
                                  {sub.subItems.map((nested) => (
                                    <Link key={nested.href} href={nested.href} onClick={onNavigate} className="block rounded-full px-4 py-2 text-sm text-[#64748B]">
                                      {pickLabel(nested.label, nested.labelEn, locale)}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link key={sub.href} href={sub.href} onClick={onNavigate} className="block rounded-full px-4 py-2 text-sm text-[#64748B]">
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
              <Link key={child.href} href={child.href} onClick={onNavigate} className="block rounded-full px-4 py-2.5 text-sm font-medium text-[#475569]">
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const isSolid = isScrolled;
  const { locale } = useAppLocale();
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const tFooter = useTranslations('footer');

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
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
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
      <header
        className={cn(
          'fixed inset-x-0 z-[60] px-2 transition-all duration-500 md:px-3 2xl:px-4',
          isSolid ? 'top-3' : 'top-4',
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-[108rem] overflow-visible rounded-[14px] border transition-all duration-500',
            isSolid
              ? 'border-[#C29C41]/30 bg-white/95 py-1 shadow-[0_16px_40px_rgba(10,37,64,0.12)] backdrop-blur-xl'
              : 'border-white/15 bg-[#0A2540]/30 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-md hover:border-[#C29C41]/35 hover:bg-[#0A2540]/55',
          )}
        >
          <div className="px-3 lg:px-4">
            <div className="flex items-center gap-2 2xl:gap-3">
              <Link href="/" className="flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white">
                <Image
                  src="/logo-3d-3d.png"
                  alt={tHero('logoAlt')}
                  height={240}
                  width={260}
                  className={cn('object-contain transition-all duration-500', isSolid ? 'h-12 w-auto' : 'h-14 w-auto md:h-16')}
                  priority
                />
              </Link>

              <div className={cn('hidden h-12 w-px shrink-0 xl:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />

              <ul className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex 2xl:gap-1.5">
                {menuItemsData.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeSection === item.id} isScrolled={isSolid} />
                ))}
              </ul>

              <div className="ms-auto flex shrink-0 items-center gap-2 xl:ms-0 2xl:gap-3">
                <form action="/search" method="get" className="hidden items-center 2xl:flex">
                  <label className="relative">
                    <span className="sr-only">{t('searchLabel')}</span>
                    <input
                      type="search"
                      name="q"
                      required
                      minLength={2}
                      maxLength={120}
                      placeholder={t('searchPlaceholder')}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      className={cn(
                        'h-11 w-40 rounded-full border pe-4 ps-10 text-sm font-medium outline-none transition duration-300 focus:w-48 focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25',
                        isSolid
                          ? 'border-[#0369A1]/20 bg-[#F8FAFC] text-[#0A2540] placeholder:text-[#64748B]'
                          : 'border-white/16 bg-white/10 text-white placeholder:text-white/60',
                      )}
                    />
                    <button
                      type="submit"
                      aria-label={t('searchLabel')}
                      className="absolute start-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
                    >
                      <LuSearch className={cn('h-4 w-4', isSolid ? 'text-[#C29C41]' : 'text-[#E8C96A]')} />
                    </button>
                  </label>
                </form>

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
                        'flex h-11 max-w-48 items-center gap-2 rounded-full border py-1 pe-3 ps-1 text-start transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2',
                        isSolid
                          ? 'border-[#0369A1]/15 bg-[#F8FAFC] text-[#0A2540] hover:border-[#C29C41]/55 hover:bg-white focus:ring-offset-white'
                          : 'border-white/18 bg-white/10 text-white hover:border-[#C29C41]/55 hover:bg-white/15 focus:ring-offset-[#0A2540]',
                        accountMenuOpen && (isSolid ? 'border-[#C29C41]/60 bg-white' : 'border-[#C29C41]/65 bg-white/15'),
                      )}
                    >
                      <UserAvatar user={user} className="size-9" />
                      <span className="block max-w-24 truncate text-xs font-bold 2xl:max-w-32">{user.name}</span>
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

                <LanguageSwitcher isSolid={isSolid} className="hidden xl:flex" />

                <div className={cn('hidden h-12 w-px shrink-0 2xl:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />

                {!user && (
                  <>
                    <Link
                      href="/login"
                      aria-label={t('loginFull')}
                      className={cn(
                        'engraved brass-gradient hidden h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#C29C41] px-3.5 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 xl:flex',
                        isSolid ? 'focus:ring-offset-white' : 'focus:ring-offset-[#0A2540]',
                      )}
                    >
                      <LuUser size={16} />
                      <span className="2xl:hidden">{t('loginShort')}</span>
                      <span className="hidden 2xl:inline">{t('loginFull')}</span>
                    </Link>

                    <div className={cn('hidden h-12 w-px shrink-0 2xl:block', isSolid ? 'bg-[#C29C41]/30' : 'bg-white/18')} aria-hidden />
                  </>
                )}

                <Link
                  href="https://aidsmo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-white 2xl:flex"
                >
                  <Image
                    src="/aidsmo-logo.png"
                    alt={tFooter('orgLogoAlt')}
                    height={160}
                    width={160}
                    className={cn('object-contain transition-all duration-500', isSolid ? 'h-9 w-auto' : 'h-10 w-auto 2xl:h-11')}
                  />
                </Link>

                <button
                  ref={mobileMenuButtonRef}
                  type="button"
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:bg-[#C29C41] hover:text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 xl:hidden',
                    isSolid
                      ? 'border-[#C29C41]/35 bg-[#F8FAFC] text-[#003652] focus:ring-offset-white'
                      : 'border-white/20 bg-white/10 text-white focus:ring-offset-[#0A2540]',
                  )}
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setMobileMenuOpen(true);
                  }}
                  aria-label={t('openMenu')}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-site-menu"
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
          'fixed inset-0 z-[100] bg-[#0A2540]/55 backdrop-blur-sm transition-opacity xl:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        ref={mobileMenuRef}
        id="mobile-site-menu"
        className={cn(
          'fixed inset-y-0 right-0 z-[110] h-dvh w-[min(88vw,24rem)] max-w-full overscroll-contain overflow-y-auto rounded-l-[14px] border-l border-[#C29C41]/30 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-2xl transition-transform duration-500 sm:p-6 xl:hidden',
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C29C41]/35 bg-[#F8FAFC] text-[#003652]"
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
            className="h-12 w-full rounded-full border border-[#0369A1]/20 bg-[#F8FAFC] pe-4 ps-11 text-sm outline-none transition duration-300 placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/25"
          />
          <button type="submit" aria-label={t('searchLabel')} className="absolute start-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#C29C41] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
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
          <LanguageSwitcher isSolid />
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
              <form action={logoutUserAction} className="border-s border-[#0A2540]/10">
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
