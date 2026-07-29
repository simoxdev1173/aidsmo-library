/**
 * Demo agent for the smart assistant.
 *
 * Everything here runs client side against the hardcoded corpus in
 * `demo-data.ts`. It mimics the shape of a real tool-calling agent — intent
 * detection, retrieval, metadata filtering, ranking, composition — so the UI
 * can render a believable tool trace, and so swapping in a real backend later
 * only means replacing `runAgent`.
 */

import { DEMO_DOCS, type Bilingual, type DocType, type LibraryDoc } from './demo-data';

export type ToolName =
  | 'understand_query'
  | 'search_library'
  | 'filter_metadata'
  | 'rank_results'
  | 'compare_documents'
  | 'fetch_statistics'
  | 'compose_answer';

export type ToolStep = {
  tool: ToolName;
  label: Bilingual;
  detail: Bilingual;
  /** How long the UI should dwell on this step before revealing the next. */
  durationMs: number;
};

export type StatTile = { label: Bilingual; value: string };

export type AgentRun = {
  steps: ToolStep[];
  answer: Bilingual;
  docs: LibraryDoc[];
  /** 0–100 relevance per doc, index-aligned with `docs`. */
  relevance: number[];
  stats?: StatTile[];
  followUps: Bilingual[];
};

/* ------------------------------------------------------------------ */
/* Text normalisation                                                  */
/* ------------------------------------------------------------------ */

const ARABIC_DIACRITICS = /[ً-ْـ]/g;

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s.]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set([
  // Arabic
  'عن', 'في', 'من', 'على', 'الى', 'الي', 'هل', 'ما', 'ماذا', 'كيف', 'اين', 'هذا',
  'هذه', 'التي', 'الذي', 'مع', 'او', 'و', 'ابحث', 'اريد', 'اعطني', 'اظهر', 'لدي',
  'يوجد', 'عندكم', 'وثائق', 'وثيقه', 'مستندات', 'ملفات', 'كل', 'اي', 'بعض', 'حول',
  'لو', 'سمحت', 'من فضلك', 'مرحبا',
  // English
  'the', 'a', 'an', 'of', 'on', 'in', 'to', 'for', 'about', 'is', 'are', 'do',
  'you', 'have', 'i', 'want', 'need', 'show', 'me', 'find', 'search', 'looking',
  'look', 'any', 'all', 'some', 'please', 'can', 'what', 'which', 'how', 'where',
  'and', 'or', 'with', 'documents', 'document', 'docs', 'files', 'give',
]);

/** Drops the Arabic definite article so "الحلال" matches the keyword "حلال". */
function stripArticle(token: string): string {
  return token.startsWith('ال') && token.length > 4 ? token.slice(2) : token;
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(' ')
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stripArticle)
    .filter((token) => !STOPWORDS.has(token));
}

/* ------------------------------------------------------------------ */
/* Intent detection                                                    */
/* ------------------------------------------------------------------ */

export type Intent = 'greeting' | 'statistics' | 'compare' | 'browse' | 'search';

// Matched against normalised text, so no `\b` — word boundaries are defined by
// [A-Za-z0-9_] in JS and never fire next to Arabic letters.
const GREETINGS = new Set([
  'hi', 'hey', 'hello', 'salam', 'assalam', 'greetings',
  'مرحبا', 'السلام', 'اهلا', 'صباح', 'مساء', 'سلام',
]);
const STATS_RE = /(احصائ|إحصائ|ارقام|أرقام|مؤشر|نسبه|نسبة|كم عدد|statistic|indicator|number|figure|how many)/i;
const COMPARE_RE = /(قارن|مقارنه|مقارنة|الفرق بين|compare|comparison|difference between|versus|\bvs\b)/i;
const BROWSE_RE = /(ماذا لديكم|ما المتوفر|اعرض الكل|جميع الاصدارات|كل الاصدارات|what do you have|browse|catalog|catalogue|everything|list all)/i;

function detectIntent(query: string): Intent {
  const trimmed = query.trim();
  const words = normalize(trimmed).split(' ').filter(Boolean);

  if (words.length > 0 && words.length <= 4 && GREETINGS.has(words[0])) return 'greeting';
  if (COMPARE_RE.test(trimmed)) return 'compare';
  if (STATS_RE.test(trimmed)) return 'statistics';
  // "What do you have?" is a browse; "What do you have on SME financing?" is a
  // search that merely opens with browse-like phrasing.
  if (BROWSE_RE.test(trimmed) && tokenize(trimmed).length <= 1) return 'browse';
  return 'search';
}

/* ------------------------------------------------------------------ */
/* Metadata filters                                                    */
/* ------------------------------------------------------------------ */

type Filters = {
  year?: string;
  type?: DocType;
  language?: 'ar' | 'en';
  /**
   * A bare "show me the reports" narrows the pool; "halal standards" merely
   * prefers standards, because there the type word is also the topic.
   */
  typeMode?: 'filter' | 'boost';
};

const TYPE_HINTS: Array<{ type: DocType; re: RegExp }> = [
  { type: 'report', re: /(تقرير|تقارير|report)/i },
  { type: 'guide', re: /(دليل|ادله|أدلة|الادله|guide|guidebook|handbook)/i },
  { type: 'directive', re: /(توجيه|توجيهات|لائحه|لائحة|لوائح|directive|regulation)/i },
  { type: 'study', re: /(دراسه|دراسة|دراسات|study|studies|research)/i },
  { type: 'strategy', re: /(استراتيجيه|استراتيجية|إستراتيجية|strategy|strategies)/i },
  { type: 'bulletin', re: /(نشره|نشرة|كتيب|bulletin|booklet)/i },
  { type: 'magazine', re: /(مجله|مجلة|magazine)/i },
  { type: 'glossary', re: /(معجم|معاجم|مصطلحات|glossary|vocabulary|terminology)/i },
];

function detectFilters(query: string): Filters {
  const filters: Filters = {};

  const year = query.match(/\b(20[12]\d)\b/);
  if (year) filters.year = year[1];

  const typeHint = TYPE_HINTS.find((hint) => hint.re.test(query));
  if (typeHint) {
    filters.type = typeHint.type;
    const remainder = tokenize(query.replace(new RegExp(typeHint.re, 'gi'), ' '));
    filters.typeMode = remainder.length === 0 ? 'filter' : 'boost';
  }

  if (/(بالانجليزي|بالإنجليزي|english|in english)/i.test(query)) filters.language = 'en';
  else if (/(بالعربي|بالعربية|arabic|in arabic)/i.test(query)) filters.language = 'ar';

  return filters;
}

function filterLabel(filters: Filters, locale: 'ar' | 'en'): string {
  const parts: string[] = [];
  if (filters.year) parts.push(locale === 'ar' ? `السنة: ${filters.year}` : `year: ${filters.year}`);
  if (filters.type && filters.typeMode === 'filter') {
    const label = TYPE_LABELS[filters.type][locale];
    parts.push(locale === 'ar' ? `النوع: ${label}` : `type: ${label}`);
  }
  if (filters.language) {
    const lang =
      filters.language === 'ar'
        ? locale === 'ar' ? 'العربية' : 'Arabic'
        : locale === 'ar' ? 'الإنجليزية' : 'English';
    parts.push(locale === 'ar' ? `اللغة: ${lang}` : `language: ${lang}`);
  }
  return parts.join(locale === 'ar' ? '، ' : ', ');
}

export const TYPE_LABELS: Record<DocType, Bilingual> = {
  report: { ar: 'تقرير', en: 'Report' },
  guide: { ar: 'دليل', en: 'Guide' },
  directive: { ar: 'توجيه', en: 'Directive' },
  study: { ar: 'دراسة', en: 'Study' },
  strategy: { ar: 'إستراتيجية', en: 'Strategy' },
  bulletin: { ar: 'نشرة', en: 'Bulletin' },
  magazine: { ar: 'مجلة', en: 'Magazine' },
  glossary: { ar: 'معجم', en: 'Glossary' },
};

/* ------------------------------------------------------------------ */
/* Retrieval                                                           */
/* ------------------------------------------------------------------ */

type Scored = { doc: LibraryDoc; score: number };

/**
 * Short tokens must match whole words. Substring matching on something like
 * "ai" would hit "chains" and "sustainability", which both inflates its score
 * and wrecks its IDF weight.
 */
const FUZZY_MIN_LENGTH = 4;

function matches(haystack: string, token: string): boolean {
  return token.length >= FUZZY_MIN_LENGTH
    ? haystack.includes(token)
    : haystack.split(' ').includes(token);
}

/** Raw, unweighted contribution of a single token to a single document. */
function tokenScore(doc: LibraryDoc, token: string): number {
  const haystackTitle = normalize(`${doc.title.ar} ${doc.title.en}`);
  const haystackSummary = normalize(`${doc.summary.ar} ${doc.summary.en}`);
  const haystackCategory = normalize(`${doc.category.ar} ${doc.category.en}`);
  const keywords = doc.keywords.map(normalize);

  let score = 0;
  if (keywords.some((keyword) => keyword === token)) score += 3;
  else if (
    token.length >= FUZZY_MIN_LENGTH &&
    keywords.some((keyword) => keyword.includes(token) || token.includes(keyword))
  ) {
    score += 1.8;
  }

  if (matches(haystackTitle, token)) score += 2.5;
  if (matches(haystackSummary, token)) score += 1.4;
  if (matches(haystackCategory, token)) score += 1;
  return score;
}

/**
 * Inverse document frequency per token. Without this a broad term like
 * "industrial", which hits most of the corpus, outweighs the rare term that
 * actually carries the query's intent — so "AI in the industrial sector" would
 * rank a general industrial strategy above the AI study.
 */
function buildIdf(tokens: string[]): Map<string, number> {
  const total = DEMO_DOCS.length;
  const idf = new Map<string, number>();
  for (const token of tokens) {
    const df = DEMO_DOCS.filter((doc) => tokenScore(doc, token) > 0).length;
    idf.set(token, Math.log(1 + total / (1 + df)));
  }
  return idf;
}

function scoreDoc(
  doc: LibraryDoc,
  tokens: string[],
  idf: Map<string, number>,
  filters?: Filters,
): number {
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    score += tokenScore(doc, token) * (idf.get(token) ?? 1);
  }

  // Bonuses only lift documents that already matched something, otherwise a
  // nonsense query would still surface every featured publication.
  if (score === 0) return 0;
  if (filters?.typeMode === 'boost' && doc.type === filters.type) score += 1.5;
  if (doc.featured) score += 0.4;
  return score;
}

function retrieve(query: string, filters: Filters, limit = 4): Scored[] {
  const tokens = tokenize(query);
  const idf = buildIdf(tokens);

  const pool = DEMO_DOCS.filter((doc) => {
    // `includes` rather than equality so a query for 2023 still reaches a
    // publication whose year is recorded as a range, e.g. "2019–2023".
    if (filters.year && !doc.year.includes(filters.year)) return false;
    if (filters.type && filters.typeMode === 'filter' && doc.type !== filters.type) return false;
    if (filters.language && doc.language !== filters.language && doc.language !== 'both') return false;
    return true;
  });

  const scored = pool
    .map((doc) => ({ doc, score: scoreDoc(doc, tokens, idf, filters) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  // A filter-only query ("show me 2025 reports") has no meaningful tokens left
  // to score against, so fall back to the filtered pool itself.
  if (
    scored.length === 0 &&
    (filters.year || filters.typeMode === 'filter' || filters.language) &&
    pool.length > 0
  ) {
    return pool.slice(0, limit).map((doc) => ({ doc, score: 1 }));
  }

  return scored.slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Suggested prompts                                                   */
/* ------------------------------------------------------------------ */

/**
 * Phrased the way a visitor actually asks, and every one of them resolves to a
 * publication that exists in the library.
 */
export const SUGGESTED_PROMPTS: Bilingual[] = [
  {
    ar: 'أبحث عن دليل تقييم المطابقة',
    en: "I'm looking for the conformity assessment guide",
  },
  {
    ar: 'أريد معلومات عن الاستراتيجية العربية للتقييس والجودة',
    en: 'I need information on the Arab standardization and quality strategy',
  },
  {
    ar: 'ما لديكم عن الذكاء الاصطناعي في القطاع الصناعي؟',
    en: 'What do you have on AI in the industrial sector?',
  },
  {
    ar: 'أبحث عن مؤشرات وإحصاءات الصناعة العربية',
    en: "I'm looking for Arab industry indicators and statistics",
  },
  {
    ar: 'التوجيهات العربية الخاصة بأدوات القياس والمترولوجيا',
    en: 'Arab directives on measuring instruments and metrology',
  },
  {
    ar: 'قارن بين استراتيجية التكامل الصناعي وتقرير الصناعة العربية',
    en: 'Compare the industrial integration strategy with the Arab industry report',
  },
];

/* ------------------------------------------------------------------ */
/* The agent                                                           */
/* ------------------------------------------------------------------ */

export function runAgent(query: string, locale: 'ar' | 'en'): AgentRun {
  const intent = detectIntent(query);

  if (intent === 'greeting') {
    return {
      steps: [
        {
          tool: 'understand_query',
          label: { ar: 'تحليل الطلب', en: 'Understanding the request' },
          detail: { ar: 'تحية — لا حاجة للبحث', en: 'Greeting — no retrieval needed' },
          durationMs: 420,
        },
      ],
      answer: {
        ar: 'أهلاً بك. اكتب الموضوع الذي تبحث عنه — تقييم المطابقة، المترولوجيا، الإحصاءات الصناعية، التعدين — وسأعرض لك الإصدارات المطابقة مع روابطها.',
        en: "Welcome. Type the topic you're after — conformity assessment, metrology, industrial statistics, mining — and I'll show you the matching publications with links.",
      },
      docs: [],
      relevance: [],
      followUps: SUGGESTED_PROMPTS.slice(0, 3),
    };
  }

  const filters = detectFilters(query);
  const hasFilters = Boolean(
    filters.year || filters.language || filters.typeMode === 'filter',
  );
  const limit = intent === 'browse' ? 6 : intent === 'compare' ? 4 : 4;
  const scored = retrieve(query, filters, limit);
  const docs = scored.map((entry) => entry.doc);

  const steps: ToolStep[] = [
    {
      tool: 'understand_query',
      label: { ar: 'تحليل الطلب', en: 'Understanding the request' },
      detail: {
        ar: `النية: ${INTENT_LABELS[intent].ar} · ${tokenize(query).length} مصطلح مفتاحي`,
        en: `intent: ${INTENT_LABELS[intent].en} · ${tokenize(query).length} key terms`,
      },
      durationMs: 430,
    },
    {
      tool: 'search_library',
      label: { ar: 'البحث في فهرس المكتبة', en: 'Searching the library index' },
      detail: {
        ar: `${DEMO_DOCS.length} إصداراً تم مسحه`,
        en: `${DEMO_DOCS.length} publications scanned`,
      },
      durationMs: 780,
    },
  ];

  if (hasFilters) {
    steps.push({
      tool: 'filter_metadata',
      label: { ar: 'تصفية حسب البيانات الوصفية', en: 'Filtering by metadata' },
      detail: { ar: filterLabel(filters, 'ar'), en: filterLabel(filters, 'en') },
      durationMs: 480,
    });
  }

  if (intent === 'statistics') {
    steps.push({
      tool: 'fetch_statistics',
      label: { ar: 'استخراج المؤشرات', en: 'Pulling indicators' },
      detail: { ar: '4 مؤشرات رئيسية', en: '4 headline indicators' },
      durationMs: 620,
    });
  }

  if (intent === 'compare' && docs.length >= 2) {
    steps.push({
      tool: 'compare_documents',
      label: { ar: 'مقارنة الإصدارات', en: 'Comparing publications' },
      detail: {
        ar: `${Math.min(docs.length, 2)} إصدارات قيد المقارنة`,
        en: `${Math.min(docs.length, 2)} publications compared`,
      },
      durationMs: 700,
    });
  }

  steps.push({
    tool: 'rank_results',
    label: { ar: 'ترتيب النتائج حسب الصلة', en: 'Ranking results by relevance' },
    detail: {
      ar: docs.length ? `${docs.length} نتائج مطابقة` : 'لا توجد نتائج مطابقة',
      en: docs.length ? `${docs.length} matching results` : 'no matching results',
    },
    durationMs: 520,
  });

  steps.push({
    tool: 'compose_answer',
    label: { ar: 'صياغة الإجابة', en: 'Composing the answer' },
    detail: { ar: 'مع الاستشهاد بالمصادر', en: 'with source citations' },
    durationMs: 460,
  });

  if (docs.length === 0) {
    return {
      steps,
      answer: {
        ar: 'لا يوجد إصدار مطابق لهذه الصياغة. جرّب كلمات أعم، أو ابدأ من أحد الموضوعات أدناه.',
        en: 'Nothing matches that phrasing. Try broader terms, or start from one of the topics below.',
      },
      docs: [],
      relevance: [],
      followUps: SUGGESTED_PROMPTS.slice(0, 3),
    };
  }

  const top = docs[0];
  const rest = docs.length - 1;
  let answer: Bilingual;
  let stats: StatTile[] | undefined;

  if (intent === 'statistics') {
    stats = [
      { label: { ar: 'دولة عربية مشمولة', en: 'Arab states covered' }, value: '21' },
      { label: { ar: 'مؤشر صناعي', en: 'industrial indicators' }, value: '148' },
      { label: { ar: 'سلسلة زمنية', en: 'years of time series' }, value: '2010–2025' },
      { label: { ar: 'تحديث البيانات', en: 'data refresh' }, value: locale === 'ar' ? 'ربع سنوي' : 'Quarterly' },
    ];
    answer = {
      ar: `تُنشر المؤشرات الصناعية في «${top.title.ar}». تغطي البيانات 21 دولة عربية وتُحدَّث ربع سنوياً، وتشمل القيمة المضافة الصناعية والتشغيل والصادرات.`,
      en: `Industrial indicators are published in "${top.title.en}". The data covers 21 Arab states, refreshed quarterly, and spans industrial value added, employment, and exports.`,
    };
  } else if (intent === 'compare' && docs.length >= 2) {
    answer = {
      ar: `الفرق بينهما في زاوية المعالجة: «${docs[0].title.ar}» يغطي ${docs[0].category.ar} (${docs[0].year}، ${docs[0].pages} صفحة)، بينما يتناول «${docs[1].title.ar}» ${docs[1].category.ar} (${docs[1].year}، ${docs[1].pages} صفحة). كلاهما متاح كاملاً أدناه.`,
      en: `The difference is one of angle: "${docs[0].title.en}" covers ${docs[0].category.en} (${docs[0].year}, ${docs[0].pages} pages), while "${docs[1].title.en}" addresses ${docs[1].category.en} (${docs[1].year}, ${docs[1].pages} pages). Both are available in full below.`,
    };
  } else if (intent === 'browse') {
    answer = {
      ar: `المكتبة موزعة على ثلاثة أقسام: التقييس، والصناعة، والإحصاء والمعلومات. إليك ${docs.length} إصدارات تعطيك فكرة عمّا هو متاح.`,
      en: `The library is organised into three sections: standardization, industry, and statistics & information. Here are ${docs.length} publications to give you a sense of what's available.`,
    };
  } else {
    answer = {
      ar:
        `«${top.title.ar}» هو أقرب ما لدينا: ${TYPE_LABELS[top.type].ar} من قسم ${top.category.ar}، صدر عام ${top.year} في ${top.pages} صفحة.` +
        (rest > 0
          ? ` وأضفت أدناه ${rest} ${rest === 1 ? 'إصداراً آخر يتقاطع' : 'إصدارات أخرى تتقاطع'} مع الموضوع نفسه.`
          : ''),
      en:
        `"${top.title.en}" is the closest match: a ${TYPE_LABELS[top.type].en.toLowerCase()} from the ${top.category.en} section, published in ${top.year} across ${top.pages} pages.` +
        (rest > 0
          ? ` I've added ${rest} more ${rest === 1 ? 'publication' : 'publications'} below that overlap with the same topic.`
          : ''),
    };
  }

  const followUps: Bilingual[] = [
    { ar: `لخّص لي «${top.title.ar}»`, en: `Summarise "${top.title.en}"` },
    { ar: `ماذا يوجد أيضاً في ${top.category.ar}؟`, en: `What else is in ${top.category.en}?` },
    { ar: 'مؤشرات وإحصاءات الصناعة العربية', en: 'Arab industry indicators and statistics' },
  ];

  return { steps, answer, docs, relevance: scoreDocsFor(query, docs), stats, followUps };
}

const INTENT_LABELS: Record<Intent, Bilingual> = {
  greeting: { ar: 'تحية', en: 'greeting' },
  statistics: { ar: 'استعلام إحصائي', en: 'statistics lookup' },
  compare: { ar: 'مقارنة', en: 'comparison' },
  browse: { ar: 'استعراض', en: 'browse' },
  search: { ar: 'بحث عن وثائق', en: 'document search' },
};

/** Relevance figures for the result cards, normalised against the top hit. */
function scoreDocsFor(query: string, docs: LibraryDoc[]): number[] {
  const tokens = tokenize(query);
  const idf = buildIdf(tokens);
  const raw = docs.map((doc) => scoreDoc(doc, tokens, idf));
  const top = Math.max(...raw, 1);
  return raw.map((value) => Math.round(Math.max(0.45, Math.min(1, value / top)) * 100));
}
