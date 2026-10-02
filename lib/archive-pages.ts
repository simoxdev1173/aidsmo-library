export const archivePages = {
  '/archive': { title: 'الأرشيف', group: 'الأرشيف', categorySlug: 'archive' },
  '/archive/org': { title: 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين', group: 'الأرشيف', categorySlug: 'archive-org' },
  '/archive/org/founding': { title: 'تأسيس المنظمة', group: 'آليات المنظمة' },
  '/archive/org/agreements': { title: 'اتفاقيات الإنشاء', group: 'آليات المنظمة', categorySlug: 'archive-org-agreements' },
  '/archive/org/bylaws': { title: 'النظام الداخلي', group: 'آليات المنظمة', categorySlug: 'archive-org-bylaws' },
  '/archive/org/regulations': { title: 'اللوائح الداخلية والأنظمة', group: 'آليات المنظمة', categorySlug: 'archive-org-regulations' },
  '/archive/org/mou': { title: 'مذكرات التفاهم والاتفاقيات', group: 'آليات المنظمة', categorySlug: 'archive-org-mou' },
  '/archive/org/administrative-court': { title: 'النظام الأساسي والداخلي للمحكمة الإدارية', group: 'آليات المنظمة', categorySlug: 'archive-org-administrative-court' },
  '/archive/league': { title: 'جامعة الدول العربية', group: 'الأرشيف', categorySlug: 'archive-league' },
  '/archive/league/summit': { title: 'القمة العربية', group: 'جامعة الدول العربية', categorySlug: 'archive-league-summit' },
  '/archive/league/summit/council': { title: 'قرارات مجلس الجامعة على المستوى الوزاري', group: 'القمة العربية', categorySlug: 'archive-league-summit-council' },
  '/archive/league/summit/summit-council': { title: 'مجلس الجامعة على مستوى القمة', group: 'جامعة الدول العربية', categorySlug: 'archive-league-summit-council-summit' },
  '/archive/league/summit/economic-social': { title: 'قرارات القمة الاقتصادية والتنموية والاجتماعية', group: 'جامعة الدول العربية', categorySlug: 'archive-league-summit-economic-social' },
  '/archive/league/ecosoc': { title: 'المجلس الاقتصادي والاجتماعي', group: 'جامعة الدول العربية', categorySlug: 'archive-league-ecosoc' },
  '/archive/league/coordination': { title: 'لجنة المنظمات والتنسيق والمتابعة المنبثقة عن المجلس الاقتصادي والاجتماعي', group: 'جامعة الدول العربية', categorySlug: 'archive-league-coordination' },
  '/archive/league/joint-action': { title: 'لجنة التنسيق العليا للعمل العربي المشترك', group: 'جامعة الدول العربية', categorySlug: 'archive-league-joint-action' },
  '/archive/league/regulations': { title: 'اللوائح والأنظمة', group: 'جامعة الدول العربية', categorySlug: 'archive-league-regulations' },
  '/archive/league/council-bylaws': { title: 'النظام الداخلي لمجلس جامعة الدول العربية', group: 'جامعة الدول العربية', categorySlug: 'archive-league-council-bylaws' },
  '/archive/league/charter': { title: 'ميثاق جامعة الدول العربية وملحقاته', group: 'جامعة الدول العربية', categorySlug: 'archive-league-charter' },
  '/archive/league/administrative-court': { title: 'المحكمة الإدارية', group: 'جامعة الدول العربية', categorySlug: 'archive-league-administrative-court' },
  '/archive/league/administrative-court/statute': { title: 'النظام الأساسي والداخلي', group: 'المحكمة الإدارية', categorySlug: 'archive-league-administrative-court-statute' },
} as const;

export type ArchivePagePath = keyof typeof archivePages;

export function getArchivePage(path: string) {
  return Object.prototype.hasOwnProperty.call(archivePages, path)
    ? archivePages[path as ArchivePagePath]
    : null;
}
