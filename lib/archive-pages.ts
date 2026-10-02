export const archivePages = {
  '/archive': { title: 'الأرشيف', group: 'الأرشيف' },
  '/archive/org': { title: 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين', group: 'الأرشيف' },
  '/archive/org/founding': { title: 'تأسيس المنظمة', group: 'آليات المنظمة' },
  '/archive/org/agreements': { title: 'اتفاقيات الإنشاء', group: 'آليات المنظمة' },
  '/archive/org/bylaws': { title: 'النظام الداخلي', group: 'آليات المنظمة' },
  '/archive/org/regulations': { title: 'اللوائح الداخلية والأنظمة', group: 'آليات المنظمة' },
  '/archive/org/mou': { title: 'مذكرات التفاهم والاتفاقيات', group: 'آليات المنظمة' },
  '/archive/org/administrative-court': { title: 'النظام الأساسي والداخلي للمحكمة الإدارية', group: 'آليات المنظمة' },
  '/archive/league': { title: 'جامعة الدول العربية', group: 'الأرشيف' },
  '/archive/league/summit': { title: 'القمة العربية', group: 'جامعة الدول العربية' },
  '/archive/league/summit/council': { title: 'قرارات مجلس الجامعة على المستوى الوزاري', group: 'القمة العربية' },
  '/archive/league/summit/summit-council': { title: 'مجلس الجامعة على مستوى القمة', group: 'القمة العربية' },
  '/archive/league/summit/economic-social': { title: 'قرارات القمة الاقتصادية والتنموية والاجتماعية', group: 'القمة العربية' },
  '/archive/league/ecosoc': { title: 'المجلس الاقتصادي والاجتماعي', group: 'جامعة الدول العربية' },
  '/archive/league/coordination': { title: 'لجنة المنظمات والتنسيق والمتابعة المنبثقة عن المجلس الاقتصادي والاجتماعي', group: 'جامعة الدول العربية' },
  '/archive/league/joint-action': { title: 'لجنة التنسيق العليا للعمل العربي المشترك', group: 'جامعة الدول العربية' },
  '/archive/league/regulations': { title: 'اللوائح والأنظمة', group: 'جامعة الدول العربية' },
  '/archive/league/council-bylaws': { title: 'النظام الداخلي لمجلس جامعة الدول العربية', group: 'جامعة الدول العربية' },
  '/archive/league/charter': { title: 'ميثاق جامعة الدول العربية وملحقاته', group: 'جامعة الدول العربية' },
  '/archive/league/administrative-court': { title: 'المحكمة الإدارية', group: 'جامعة الدول العربية' },
  '/archive/league/administrative-court/statute': { title: 'النظام الأساسي والداخلي', group: 'المحكمة الإدارية' },
} as const;

export type ArchivePagePath = keyof typeof archivePages;

export function getArchivePage(path: string) {
  return Object.prototype.hasOwnProperty.call(archivePages, path)
    ? archivePages[path as ArchivePagePath]
    : null;
}
