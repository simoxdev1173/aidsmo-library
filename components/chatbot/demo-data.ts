/**
 * Hardcoded demo corpus for the smart assistant.
 *
 * This stands in for the real search index while the agent backend is being
 * built, but the entries mirror publications that actually exist in the
 * library database — titles, years, and categories were taken from it — so the
 * demo answers match what a user would really find. Every `href` points at a
 * live route and every `cover` is a real asset in /public.
 *
 * Page counts are illustrative; they are not read from the database.
 */

export type DocType =
  | 'report'
  | 'guide'
  | 'directive'
  | 'study'
  | 'strategy'
  | 'bulletin'
  | 'magazine'
  | 'glossary';

export type Bilingual = { ar: string; en: string };

export type LibraryDoc = {
  id: string;
  href: string;
  cover: string;
  type: DocType;
  year: string;
  pages: number;
  language: 'ar' | 'en' | 'both';
  featured?: boolean;
  title: Bilingual;
  summary: Bilingual;
  category: Bilingual;
  publisher: Bilingual;
  /** Match tokens, Arabic + English, used by the demo retriever. */
  keywords: string[];
};

const AIDSMO: Bilingual = {
  ar: 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين',
  en: 'AIDSMO',
};

const CAT_STANDARDIZATION: Bilingual = { ar: 'التقييس', en: 'Standardization' };
const CAT_INDUSTRY: Bilingual = { ar: 'الصناعة', en: 'Industry' };
const CAT_STATISTICS: Bilingual = { ar: 'المعلومات الصناعية', en: 'Industrial Information' };
const CAT_MINING: Bilingual = { ar: 'التعدين', en: 'Mining' };

export const DEMO_DOCS: LibraryDoc[] = [
  {
    id: 'conformity-assessment-guide',
    href: '/standardization/guides',
    cover: '/bookCovers/i-2-1.png',
    type: 'guide',
    year: '2026',
    pages: 164,
    language: 'ar',
    featured: true,
    title: {
      ar: 'الدليل الإرشادي العربي لنماذج تقييم المطابقة',
      en: 'Arab Guide to Conformity Assessment Models',
    },
    summary: {
      ar: 'دليل يوضح نماذج تقييم المطابقة المعتمدة عربياً، وكيفية اختيار النموذج المناسب لكل فئة من فئات المنتجات.',
      en: 'A guide to the conformity assessment models adopted across the Arab region, and how to select the right model for each product category.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'مطابقة', 'conformity', 'assessment', 'تقييم', 'نماذج', 'models', 'دليل',
      'guide', 'شهادة', 'certification', 'منتجات', 'products', 'تقييس',
      'standardization', 'اعتماد', 'accreditation',
    ],
  },
  {
    id: 'product-safety-market-surveillance',
    href: '/standardization/guides',
    cover: '/bookCovers/i-1-2.png',
    type: 'guide',
    year: '2023',
    pages: 132,
    language: 'ar',
    title: {
      ar: 'الدليل الاسترشادي العربي لنظام سلامة المنتجات ومسح السوق',
      en: 'Arab Guide to Product Safety and Market Surveillance',
    },
    summary: {
      ar: 'يعرض متطلبات نظام سلامة المنتجات وآليات مسح السوق ورصد المنتجات غير المطابقة وسحبها من الأسواق.',
      en: 'Sets out product safety system requirements, market surveillance mechanisms, and procedures for detecting and withdrawing non-compliant products.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'سلامة', 'safety', 'منتجات', 'products', 'مسح', 'surveillance', 'سوق',
      'market', 'رقابة', 'مطابقة', 'conformity', 'حماية', 'protection',
      'مستهلك', 'consumer', 'دليل', 'guide',
    ],
  },
  {
    id: 'standardization-quality-strategy',
    href: '/standardization/strategies',
    cover: '/latest-cover/b-2.png',
    type: 'strategy',
    year: '2019–2023',
    pages: 88,
    language: 'both',
    featured: true,
    title: {
      ar: 'الاستراتيجية العربية للتقييس والجودة 2019–2023',
      en: 'Arab Standardization and Quality Strategy 2019–2023',
    },
    summary: {
      ar: 'الوثيقة المرجعية لأهداف التقييس والجودة على المستوى العربي، ومحاورها التنفيذية ومؤشرات متابعة الأداء.',
      en: 'The reference document for regional standardization and quality objectives, its implementation pillars, and performance monitoring indicators.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'استراتيجية', 'strategy', 'جودة', 'quality', 'تقييس', 'standardization',
      'خطة', 'plan', 'اهداف', 'objectives', 'بنية', 'infrastructure',
      'عربية', 'arab',
    ],
  },
  {
    id: 'industrial-integration-strategy',
    href: '/industry/integration-strategy',
    cover: '/latest-cover/b-4.png',
    type: 'strategy',
    year: '2025–2035',
    pages: 196,
    language: 'ar',
    featured: true,
    title: {
      ar: 'استراتيجية التكامل الصناعي العربي 2025–2035',
      en: 'Arab Industrial Integration Strategy 2025–2035',
    },
    summary: {
      ar: 'خارطة طريق التكامل الصناعي بين الدول العربية حتى 2035، وتشمل سلاسل القيمة الإقليمية وأولويات القطاعات وآليات التنفيذ.',
      en: 'The roadmap for industrial integration among Arab states through 2035: regional value chains, sector priorities, and implementation mechanisms.',
    },
    category: CAT_INDUSTRY,
    publisher: AIDSMO,
    keywords: [
      'تكامل', 'integration', 'استراتيجية', 'strategy', 'صناعي', 'industrial',
      'سلاسل', 'chains', 'قيمة', 'value', 'تعاون', 'cooperation', 'تخطيط',
      'planning', 'قطاعات', 'sectors',
    ],
  },
  {
    id: 'measuring-instruments-directive',
    href: '/standardization/directives',
    cover: '/bookCovers/i-3.png',
    type: 'directive',
    year: '2015',
    pages: 42,
    language: 'ar',
    title: {
      ar: 'التوجيه العربي رقم 1 لسنة 2015 — أدوات القياس',
      en: 'Arab Directive No. 1 of 2015 — Measuring Instruments',
    },
    summary: {
      ar: 'التوجيه الفني الخاص بأدوات القياس ومتطلبات المترولوجيا القانونية وإجراءات التحقق الدوري.',
      en: 'The technical directive covering measuring instruments, legal metrology requirements, and periodic verification procedures.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'توجيه', 'directive', 'قياس', 'measurement', 'measuring', 'ادوات',
      'instruments', 'مترولوجيا', 'metrology', 'معايرة', 'calibration',
      'قانونية', 'legal', 'تحقق', 'verification', 'لوائح', 'regulations',
    ],
  },
  {
    id: 'prepackaged-goods-directive',
    href: '/standardization/directives',
    cover: '/trendingSection/t-5.png',
    type: 'directive',
    year: '2020',
    pages: 38,
    language: 'ar',
    title: {
      ar: 'التوجيه العربي رقم 2 لسنة 2020 — المواد المعبأة مسبقاً',
      en: 'Arab Directive No. 2 of 2020 — Prepackaged Goods',
    },
    summary: {
      ar: 'يحدد متطلبات المواد المعبأة مسبقاً بالوزن أو الحجم، وحدود التسامح المسموح بها وطرق التحقق منها.',
      en: 'Defines requirements for goods prepackaged by weight or volume, permitted tolerance limits, and verification methods.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'توجيه', 'directive', 'تعبئة', 'packaging', 'prepackaged', 'وزن',
      'weight', 'حجم', 'volume', 'معبأة', 'goods', 'مترولوجيا', 'metrology',
      'تسامح', 'tolerance',
    ],
  },
  {
    id: 'legal-metrology-glossary',
    href: '/standardization/glossaries',
    cover: '/bookCovers/i-1-3.png',
    type: 'glossary',
    year: '2022',
    pages: 268,
    language: 'both',
    title: {
      ar: 'المعجم الدولي لمصطلحات المترولوجيا القانونية',
      en: 'International Vocabulary of Legal Metrology',
    },
    summary: {
      ar: 'معجم ثنائي اللغة يوحّد مصطلحات المترولوجيا القانونية المستخدمة في الجهات الوطنية العربية.',
      en: 'A bilingual vocabulary unifying the legal metrology terminology used by Arab national bodies.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'معجم', 'glossary', 'vocabulary', 'مصطلحات', 'terms', 'terminology',
      'مترولوجيا', 'metrology', 'قانونية', 'legal', 'قاموس', 'dictionary',
      'ترجمة', 'translation',
    ],
  },
  {
    id: 'conformity-terms-glossary',
    href: '/standardization/glossaries',
    cover: '/bookCovers/i-2-2.png',
    type: 'glossary',
    year: '2021',
    pages: 154,
    language: 'both',
    title: {
      ar: 'معجم مصطلحات ومبادئ تقييم المطابقة',
      en: 'Glossary of Conformity Assessment Terms and Principles',
    },
    summary: {
      ar: 'يجمع المصطلحات والمبادئ العامة لتقييم المطابقة بصياغة موحدة تسهّل الاعتراف المتبادل بين الدول العربية.',
      en: 'Collects the general terms and principles of conformity assessment in unified wording that supports mutual recognition between Arab states.',
    },
    category: CAT_STANDARDIZATION,
    publisher: AIDSMO,
    keywords: [
      'معجم', 'glossary', 'مصطلحات', 'terms', 'مطابقة', 'conformity',
      'مبادئ', 'principles', 'اعتراف', 'recognition', 'تقييم', 'assessment',
    ],
  },
  {
    id: 'arab-industry-report',
    href: '/info/statistics/arab-industry-report',
    cover: '/latest-cover/b-1.png',
    type: 'report',
    year: '2022',
    pages: 284,
    language: 'both',
    featured: true,
    title: {
      ar: 'تقرير الصناعة العربية',
      en: 'Arab Industry Report',
    },
    summary: {
      ar: 'التقرير المرجعي لأداء القطاع الصناعي في الدول العربية، ويشمل القيمة المضافة والتشغيل والصادرات الصناعية.',
      en: 'The reference report on industrial performance across Arab states, covering value added, employment, and industrial exports.',
    },
    category: CAT_STATISTICS,
    publisher: AIDSMO,
    keywords: [
      'تقرير', 'report', 'صناعة', 'industry', 'industrial', 'اداء',
      'performance', 'احصاء', 'statistics', 'صادرات', 'exports', 'تشغيل',
      'employment', 'اقتصاد', 'economy',
    ],
  },
  {
    id: 'indicators-booklet',
    href: '/info/statistics/indicators-booklet',
    cover: '/latest-cover/b-3.png',
    type: 'bulletin',
    year: '2024',
    pages: 76,
    language: 'both',
    title: {
      ar: 'كتيب المؤشرات الاقتصادية والصناعية في الدول العربية',
      en: 'Economic and Industrial Indicators Booklet for Arab States',
    },
    summary: {
      ar: 'كتيب إحصائي يجمع أبرز المؤشرات الاقتصادية والصناعية للدول العربية في جداول ورسوم قابلة للمقارنة.',
      en: 'A statistical booklet gathering headline economic and industrial indicators for Arab states in comparable tables and charts.',
    },
    category: CAT_STATISTICS,
    publisher: AIDSMO,
    keywords: [
      'مؤشرات', 'indicators', 'احصاء', 'statistics', 'ارقام', 'numbers',
      'بيانات', 'data', 'كتيب', 'booklet', 'اقتصادية', 'economic', 'جداول',
      'tables', 'مقارنة', 'comparison',
    ],
  },
  {
    id: 'industrial-statistics-bulletin',
    href: '/info/statistics/bulletin',
    cover: '/trendingSection/t-11.png',
    type: 'bulletin',
    year: '2019',
    pages: 118,
    language: 'both',
    title: {
      ar: 'نشرة الإحصاءات الصناعية للبلدان العربية',
      en: 'Industrial Statistics Bulletin for Arab Countries',
    },
    summary: {
      ar: 'نشرة دورية تعرض السلاسل الزمنية للإحصاءات الصناعية في البلدان العربية حسب النشاط الاقتصادي.',
      en: 'A periodic bulletin presenting industrial statistics time series for Arab countries by economic activity.',
    },
    category: CAT_STATISTICS,
    publisher: AIDSMO,
    keywords: [
      'نشرة', 'bulletin', 'احصاءات', 'statistics', 'صناعية', 'industrial',
      'سلاسل', 'series', 'بيانات', 'data', 'نشاط', 'activity', 'دورية',
      'periodic',
    ],
  },
  {
    id: 'ai-in-industry-study',
    href: '/industry/studies/guides',
    cover: '/trendingSection/t-3.png',
    type: 'study',
    year: '2022',
    pages: 142,
    language: 'ar',
    title: {
      ar: 'دراسة حول استخدامات تقنيات الذكاء الاصطناعي في القطاع الصناعي',
      en: 'Study on Applications of Artificial Intelligence in the Industrial Sector',
    },
    summary: {
      ar: 'دراسة تستعرض تطبيقات الذكاء الاصطناعي في الصناعة العربية: الصيانة التنبؤية، وضبط الجودة، وتحسين الإنتاجية.',
      en: 'A study reviewing AI applications in Arab industry: predictive maintenance, quality control, and productivity improvement.',
    },
    category: CAT_INDUSTRY,
    publisher: AIDSMO,
    keywords: [
      'ذكاء', 'اصطناعي', 'ai', 'artificial', 'intelligence', 'تقنيات',
      'technology', 'رقمي', 'digital', 'اتمتة', 'automation', 'دراسة',
      'study', 'صناعي', 'industrial', 'انتاجية', 'productivity',
    ],
  },
  {
    id: 'cleaner-production-steel',
    href: '/industry/studies/guides',
    cover: '/industry-covers/b-3-1.jpg',
    type: 'guide',
    year: '2022',
    pages: 108,
    language: 'ar',
    title: {
      ar: 'دليل تطبيقات الإنتاج الأنظف في صناعة الحديد والصلب',
      en: 'Guide to Cleaner Production Applications in the Iron and Steel Industry',
    },
    summary: {
      ar: 'دليل عملي لخفض الاستهلاك والانبعاثات في صناعة الحديد والصلب عبر تطبيقات الإنتاج الأنظف وكفاءة الطاقة.',
      en: 'A practical guide to cutting consumption and emissions in the iron and steel industry through cleaner production and energy efficiency.',
    },
    category: CAT_INDUSTRY,
    publisher: AIDSMO,
    keywords: [
      'انتاج', 'production', 'انظف', 'cleaner', 'حديد', 'iron', 'صلب',
      'steel', 'بيئة', 'environment', 'طاقة', 'energy', 'انبعاثات',
      'emissions', 'استدامة', 'sustainability', 'كفاءة', 'efficiency',
    ],
  },
  {
    id: 'academia-industry-linkage',
    href: '/industry/studies/guides',
    cover: '/industry-covers/b-2.jpg',
    type: 'study',
    year: '2024',
    pages: 96,
    language: 'ar',
    title: {
      ar: 'دراسة حول التجارب العربية في مجال ربط الأكاديميا بالصناعة',
      en: 'Study on Arab Experiences in Linking Academia with Industry',
    },
    summary: {
      ar: 'تستعرض نماذج عربية ناجحة في الربط بين مؤسسات البحث والجامعات والقطاع الصناعي، وآليات نقل التكنولوجيا.',
      en: 'Reviews successful Arab models linking research institutions and universities with industry, and technology transfer mechanisms.',
    },
    category: CAT_INDUSTRY,
    publisher: AIDSMO,
    keywords: [
      'اكاديميا', 'academia', 'جامعات', 'universities', 'بحث', 'research',
      'صناعة', 'industry', 'ربط', 'linkage', 'نقل', 'transfer', 'تكنولوجيا',
      'technology', 'ابتكار', 'innovation', 'دراسة', 'study',
    ],
  },
  {
    id: 'tyre-recycling-study',
    href: '/info/publications',
    cover: '/trendingSection/t-7.png',
    type: 'study',
    year: '2022',
    pages: 64,
    language: 'ar',
    title: {
      ar: 'إعادة تدوير إطارات السيارات بين البعد البيئي وتشجيع الاستثمار',
      en: 'Tyre Recycling: Environmental Impact and Investment Incentives',
    },
    summary: {
      ar: 'دراسة تتناول صناعة إعادة تدوير الإطارات في الدول العربية، وأثرها البيئي وفرص الاستثمار فيها.',
      en: 'A study of the tyre recycling industry in Arab states, its environmental impact, and the investment opportunities it offers.',
    },
    category: CAT_INDUSTRY,
    publisher: AIDSMO,
    keywords: [
      'تدوير', 'recycling', 'اطارات', 'tyre', 'tire', 'بيئة', 'environment',
      'استثمار', 'investment', 'نفايات', 'waste', 'دائري', 'circular',
      'استدامة', 'sustainability',
    ],
  },
  {
    id: 'arab-mining-system',
    href: '/catalog/mining-industry',
    cover: '/industry-covers/b-1.jpg',
    type: 'guide',
    year: '2026',
    pages: 152,
    language: 'ar',
    title: {
      ar: 'النظام الاسترشادي التعديني للدول العربية',
      en: 'Guiding Mining Code for Arab States',
    },
    summary: {
      ar: 'نظام استرشادي يوحّد الإطار التشريعي والتنظيمي للنشاط التعديني في الدول العربية ويشجع الاستثمار في القطاع.',
      en: 'A guiding code harmonising the legislative and regulatory framework for mining activity across Arab states and encouraging sector investment.',
    },
    category: CAT_MINING,
    publisher: AIDSMO,
    keywords: [
      'تعدين', 'mining', 'معادن', 'minerals', 'نظام', 'code', 'تشريع',
      'legislation', 'استثمار', 'investment', 'خامات', 'ores', 'جيولوجيا',
      'geology',
    ],
  },
  {
    id: 'industrial-development-magazine',
    href: '/info/magazine',
    cover: '/trendingSection/t-9.png',
    type: 'magazine',
    year: '2025',
    pages: 68,
    language: 'ar',
    title: {
      ar: 'مجلة التنمية الصناعية',
      en: 'Industrial Development Magazine',
    },
    summary: {
      ar: 'المجلة الدورية للمنظمة، وتضم ملفات القطاعات الصناعية وأخبار المنظمة وحوارات مع صنّاع القرار.',
      en: "The organisation's periodical, featuring industrial sector files, organisation news, and interviews with decision makers.",
    },
    category: CAT_STATISTICS,
    publisher: AIDSMO,
    keywords: [
      'مجلة', 'magazine', 'عدد', 'issue', 'اخبار', 'news', 'دورية',
      'periodical', 'مقالات', 'articles', 'تنمية', 'development',
    ],
  },
];

export function getDocById(id: string): LibraryDoc | undefined {
  return DEMO_DOCS.find((doc) => doc.id === id);
}
