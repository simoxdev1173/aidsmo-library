import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

type CategoryTreeItem = {
  id: string;
  parentId: string | null;
};

function collectDescendantCategoryIds(categories: CategoryTreeItem[], rootId: string) {
  const ids = new Set<string>([rootId]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return Array.from(ids);
}

async function getCategoryFilterIds(categoryId?: string) {
  if (!categoryId) return undefined;

  const categories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });

  return collectDescendantCategoryIds(categories, categoryId);
}

type LibraryStatKey =
  | "magazines"
  | "studies"
  | "reports"
  | "scientificPapers"
  | "memorandums";

type LibraryStatDefinition = {
  categorySlugs: readonly string[];
  categoryNames: readonly string[];
  matchesEntryText: (text: string) => boolean;
};

// Historical imports can use a different category name or place a document in
// a broader category, so titles and tags are a fallback for these public stats.
const LIBRARY_STAT_DEFINITIONS: Record<LibraryStatKey, LibraryStatDefinition> = {
  magazines: {
    categorySlugs: ["industrial-development-magazine"],
    categoryNames: ["مجلة التنمية الصناعية", "المجلات المتخصصة"],
    matchesEntryText: (text) =>
      text.includes("مجله") || text.includes("magazine") || text.includes("journal"),
  },
  studies: {
    categorySlugs: ["industry-studies-studies", "standardization-studies"],
    categoryNames: ["الدراسات", "البحوث والدراسات"],
    matchesEntryText: (text) =>
      text.includes("دراسه") || text.includes("دراسات") || text.includes("study"),
  },
  reports: {
    categorySlugs: ["arab-industry-report"],
    categoryNames: ["تقرير الصناعة العربية", "التقارير الصناعية"],
    matchesEntryText: (text) =>
      (text.includes("تقرير") && (text.includes("صناع") || text.includes("الصناعه العربيه"))) ||
      text.includes("industrial report") ||
      text.includes("arab industry report"),
  },
  scientificPapers: {
    categorySlugs: ["scientific-papers", "research-papers"],
    categoryNames: ["أوراق علمية", "البحوث العلمية", "الأبحاث العلمية"],
    matchesEntryText: (text) =>
      (text.includes("ورق") && (text.includes("علم") || text.includes("بحث"))) ||
      (text.includes("بحث") && text.includes("علم")) ||
      text.includes("scientific paper") ||
      text.includes("research paper"),
  },
  memorandums: {
    categorySlugs: ["archive-org-mou", "memoranda-of-understanding", "mou"],
    categoryNames: ["مذكرات التفاهم واتفاقيات", "مذكرات التفاهم", "اتفاقيات ومذكرات التفاهم"],
    matchesEntryText: (text) =>
      text.includes("مذكره تفاهم") ||
      text.includes("مذكرات التفاهم") ||
      text.includes("memorandum of understanding") ||
      /\bmou\b/.test(text),
  },
};

// The source catalogue's verified total includes pages from source PDFs whose
// individual pageCount metadata has not yet been imported into this database.
const VERIFIED_NUMBERED_PAGES_TOTAL = 120_000;
const VERIFIED_SCIENTIFIC_DOCUMENTS_TOTAL = 1_400;
const VERIFIED_MAGAZINES_TOTAL = 18;
const VERIFIED_STUDIES_TOTAL = 60;
const VERIFIED_INDUSTRIAL_REPORTS_TOTAL = 24;
const VERIFIED_MEMORANDUMS_TOTAL = 58;

function normalizeStatText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function categoryMatchesStat(
  category: { slug: string; name: string },
  definition: LibraryStatDefinition,
) {
  const normalizedSlug = normalizeStatText(category.slug);
  const normalizedName = normalizeStatText(category.name);

  return (
    definition.categorySlugs.some((slug) => normalizedSlug === normalizeStatText(slug)) ||
    definition.categoryNames.some((name) => normalizedName === normalizeStatText(name))
  );
}

function categoryPath(
  categoryId: string,
  categoryById: Map<string, { id: string; parentId: string | null; slug: string; name: string }>,
) {
  const path = [];
  const visited = new Set<string>();
  let category = categoryById.get(categoryId);

  while (category && !visited.has(category.id)) {
    path.push(category);
    visited.add(category.id);
    category = category.parentId ? categoryById.get(category.parentId) : undefined;
  }

  return path;
}

/** Counts the published content represented by the library statistics section. */
export async function getLibraryStats() {
  // These numbers are part of the public catalogue, so do not include drafts
  // or archived entries that visitors cannot access.
  await connection();

  const [categories, entries] = await Promise.all([
    prisma.category.findMany({ select: { id: true, parentId: true, slug: true, name: true } }),
    prisma.libraryEntry.findMany({
      where: { status: "PUBLISHED" },
      select: { categoryId: true, entryType: true, title: true, tag: true },
    }),
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const countFor = (definition: LibraryStatDefinition) =>
    entries.filter((entry) => {
      if (categoryPath(entry.categoryId, categoryById).some((category) => categoryMatchesStat(category, definition))) {
        return true;
      }

      return definition.matchesEntryText(normalizeStatText(`${entry.title} ${entry.tag ?? ""}`));
    }).length;

  return {
    books: entries.filter((entry) => entry.entryType === "BOOK").length,
    magazines: Math.max(VERIFIED_MAGAZINES_TOTAL, countFor(LIBRARY_STAT_DEFINITIONS.magazines)),
    studies: VERIFIED_STUDIES_TOTAL,
    reports: VERIFIED_INDUSTRIAL_REPORTS_TOTAL,
    scientificPapers: VERIFIED_SCIENTIFIC_DOCUMENTS_TOTAL,
    numberedPapers: VERIFIED_NUMBERED_PAGES_TOTAL,
    memorandums: Math.max(VERIFIED_MEMORANDUMS_TOTAL, countFor(LIBRARY_STAT_DEFINITIONS.memorandums)),
  };
}

export async function getDashboardStats() {
  const [entries, publishedEntries, draftEntries, archivedEntries, documentEntries, coverEntries, recentEntries] = await Promise.all([
    prisma.libraryEntry.count(),
    prisma.libraryEntry.count({ where: { status: "PUBLISHED" } }),
    prisma.libraryEntry.count({ where: { status: "DRAFT" } }),
    prisma.libraryEntry.count({ where: { status: "ARCHIVED" } }),
    prisma.libraryEntry.count({ where: { filePath: { not: null } } }),
    prisma.libraryEntry.count({ where: { coverImagePath: { not: null } } }),
    prisma.libraryEntry.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { category: { include: { parent: { include: { parent: true } } } } },
    }),
  ]);

  return { entries, publishedEntries, draftEntries, archivedEntries, documentEntries, coverEntries, recentEntries };
}

export async function getCategoryOptions() {
  return prisma.category.findMany({
    where: {
      isNavVisible: true,
      OR: [{ children: { none: {} } }, { entries: { some: {} } }],
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parent: {
        select: {
          name: true,
          slug: true,
          parent: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getEntryForEdit(id: string) {
  return prisma.libraryEntry.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getEntries(filters: {
  q?: string;
  categoryId?: string;
  status?: string;
}) {
  const q = filters.q?.trim();
  const categoryIds = await getCategoryFilterIds(filters.categoryId);

  return prisma.libraryEntry.findMany({
    where: {
      ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
      ...(filters.status ? { status: filters.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { tag: { contains: q, mode: "insensitive" } },
              { author: { contains: q, mode: "insensitive" } },
              { publisher: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { category: { include: { parent: { include: { parent: true } } } } },
  });
}

export async function getPublishedEntryBySlug(slug: string) {
  return prisma.libraryEntry.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: { include: { parent: { include: { parent: true } } } },
      documentAnalyses: {
        where: { status: "COMPLETED" },
        select: { sourcePath: true, summary: true, questions: true, generatedAt: true },
        orderBy: { generatedAt: "desc" },
      },
    },
  });
}

export async function getRelatedEntries(entry: { id: string; categoryId: string }, take = 6) {
  const categories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });

  let rootId = entry.categoryId;
  let parentId = categories.find((category) => category.id === rootId)?.parentId ?? null;
  while (parentId) {
    rootId = parentId;
    parentId = categories.find((category) => category.id === rootId)?.parentId ?? null;
  }

  const ids = collectDescendantCategoryIds(categories, rootId);

  return prisma.libraryEntry.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: { in: ids },
      NOT: { id: entry.id },
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take,
    include: { category: { include: { parent: { include: { parent: true } } } } },
  });
}

export async function getCategoryWithEntries(slug: string) {
  const categories = await prisma.category.findMany({
    include: { children: true, parent: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return null;
  }

  const ids = collectDescendantCategoryIds(categories, category.id);

  const entries = await prisma.libraryEntry.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: { in: ids },
    },
    orderBy: [{ featured: "desc" }, { year: "desc" }, { title: "asc" }],
    include: { category: { include: { parent: { include: { parent: true } } } } },
  });

  return { category, entries };
}

export async function getStandardizationPageData(
  slug: string | string[],
  filters: {
    q?: string;
    tag?: string;
    year?: string;
    sort?: string;
  } = {},
) {
  const slugs = Array.isArray(slug) ? slug : [slug];
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
  });

  if (categories.length === 0) {
    return null;
  }

  const category = slugs
    .map((item) => categories.find((candidate) => candidate.slug === item))
    .find((item): item is (typeof categories)[number] => Boolean(item)) ?? categories[0];
  const q = filters.q?.trim();
  const tag = filters.tag?.trim();
  const year = filters.year?.trim();

  const baseWhere = {
    status: "PUBLISHED" as const,
    categoryId: { in: categories.map((item) => item.id) },
  };

  const where = {
    ...baseWhere,
    ...(tag ? { tag } : {}),
    ...(year ? { year } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { tag: { contains: q, mode: "insensitive" as const } },
            { author: { contains: q, mode: "insensitive" as const } },
            { publisher: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    filters.sort === "featured"
      ? [{ featured: "desc" as const }, { updatedAt: "desc" as const }]
      : filters.sort === "year"
        ? [{ year: "desc" as const }, { updatedAt: "desc" as const }]
        : filters.sort === "title"
          ? [{ title: "asc" as const }]
          : [{ publishedAt: "desc" as const }, { updatedAt: "desc" as const }];

  const [entries, facetEntries] = await Promise.all([
    prisma.libraryEntry.findMany({
      where,
      orderBy,
      include: { category: { include: { parent: { include: { parent: true } } } } },
    }),
    prisma.libraryEntry.findMany({
      where: baseWhere,
      select: { tag: true, year: true },
      orderBy: [{ year: "desc" }, { tag: "asc" }],
    }),
  ]);

  const tags = Array.from(new Set(facetEntries.map((entry) => entry.tag).filter((item): item is string => Boolean(item))));
  const years = Array.from(new Set(facetEntries.map((entry) => entry.year).filter((item): item is string => Boolean(item))));

  return {
    category,
    entries,
    facets: {
      tags,
      years,
    },
  };
}

export type TrendingItem = {
  id: string;
  title: string;
  meta: string;
  type: string;
  cover: string | null;
  href: string;
};

export type TrendingRow = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: string;
  items: TrendingItem[];
};

const TRENDING_SECTORS = [
  { slug: "industry", title: "الصناعة", description: "تقارير ومراجع حول التنمية، سلاسل القيمة، والتنافسية الصناعية.", href: "/catalog/industry" },
  { slug: "standardization", title: "التقييس والجودة", description: "أدلة ومصطلحات ومراجع تساعد على فهم المواصفات والجودة.", href: "/catalog/standardization" },
  { slug: "mining", title: "التعدين", description: "مراجع جيولوجية ودراسات حول الموارد المعدنية والاستدامة.", href: "/catalog/mining" },
  { slug: "industrial-info", title: "المعلومات الصناعية", description: "إحصاءات ونشرات ومرئيات تساند البحث واتخاذ القرار.", href: "/catalog/industrial-info" },
] as const;

const TRENDING_ROW_LIMIT = 9;
const TRENDING_YEAR = "2026";

const ENTRY_TYPE_LABEL: Record<string, string> = {
  BOOK: "كتاب",
  PAGE: "صفحة",
  OTHER: "وثيقة",
  EVENT: "فعالية",
};

// Mining titles live outside this library, so they are curated by hand and
// their covers are served from the source library (arabpfm.org).
const MINING_ITEMS: TrendingItem[] = [
  {
    id: "mining-guideline-system",
    title: "النظام الاسترشادي التعديني للدول العربية",
    meta: "الصناعة التعدينية",
    type: "2026",
    cover: "https://api-library.arabpfm.org/storage/Photos_Etudes/q1LcOoaw9aiIBaxtOAPgDpwn8pYkDZBY9YiosLmr.jpg",
    href: "/catalog/mining",
  },
  {
    id: "mining-energy-transition-roadmap",
    title: "خارطة الطريق الاسترشادية لمعادن الانتقال الطاقي بالمنطقة العربية",
    meta: "الطاقة",
    type: "2026",
    cover: "https://api-library.arabpfm.org/storage/Photos_Etudes/fqkn13vnWyay90raGUkZVOhsVXNA02Xn2N1D2E0h.jpg",
    href: "/catalog/mining",
  },
  {
    id: "mining-rehabilitation",
    title: "إعادة تأهيل المناجم والمحاجر القديمة لتحقيق تنمية مستدامة",
    meta: "الصناعة التعدينية",
    type: "2026",
    cover: "https://api-library.arabpfm.org/storage/Photos_Etudes/DmJgEppKt9MLH2n5C2KuMa6vm3qAjBZPquBvgmk9.jpg",
    href: "/catalog/mining",
  },
];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

// Newest-first, sector-grouped shelves for the homepage.
export async function getTrendingLibraryRows(): Promise<TrendingRow[]> {
  // Keep the shelf dynamic so newly published entries appear immediately.
  await connection();

  const [categories, entries] = await Promise.all([
    prisma.category.findMany({ select: { id: true, parentId: true, name: true, slug: true } }),
    prisma.libraryEntry.findMany({
      // Homepage shelves are visual browsing surfaces. Only include entries
      // that can render a real cover, allowing older covered entries from the
      // same sector to fill any slots a coverless upload would have occupied.
      where: { status: "PUBLISHED", coverImagePath: { not: null } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImagePath: true,
        tag: true,
        year: true,
        entryType: true,
        categoryId: true,
      },
    }),
  ]);

  // The database filter removes nulls; this also guards against legacy rows
  // whose cover path is an empty or whitespace-only string.
  const coveredEntries = entries.filter((entry) => Boolean(entry.coverImagePath?.trim()));

  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const topLevelSlug = (categoryId: string | null) => {
    let current = categoryId ? categoryById.get(categoryId) : undefined;
    let slug: string | null = null;
    while (current) {
      slug = current.slug;
      current = current.parentId ? categoryById.get(current.parentId) : undefined;
    }
    return slug;
  };

  type Entry = (typeof entries)[number];

  const grouped = new Map<string, Entry[]>();
  for (const entry of coveredEntries) {
    const slug = topLevelSlug(entry.categoryId);
    if (!slug) continue;
    const bucket = grouped.get(slug);
    if (bucket) bucket.push(entry);
    else grouped.set(slug, [entry]);
  }

  const toItem = (entry: Entry): TrendingItem => ({
    id: entry.id,
    title: entry.title,
    meta: entry.tag ?? categoryById.get(entry.categoryId)?.name ?? "AIDSMO",
    type: entry.year ?? ENTRY_TYPE_LABEL[entry.entryType] ?? "وثيقة",
    cover: entry.coverImagePath,
    href: `/book/${entry.slug}`,
  });

  const pickLatestUploads = (pool: Entry[], limit: number) => pool.slice(0, limit);

  const pickDiversifiedTrending = (pool: Entry[], limit: number) => {
    const byDepartment = new Map<string, Entry[]>();

    for (const entry of pool) {
      const department = topLevelSlug(entry.categoryId) ?? entry.categoryId;
      const bucket = byDepartment.get(department);
      if (bucket) bucket.push(entry);
      else byDepartment.set(department, [entry]);
    }

    const buckets = shuffle(
      Array.from(byDepartment.values(), (items) => shuffle(items)),
    );
    const selected: Entry[] = [];

    // Take one random title per department in each pass so a large department
    // cannot occupy the whole shelf merely because it has more publications.
    while (selected.length < limit && buckets.some((bucket) => bucket.length > 0)) {
      for (const bucket of shuffle(buckets)) {
        const entry = bucket.pop();
        if (entry) selected.push(entry);
        if (selected.length === limit) break;
      }
    }

    return selected;
  };

  // Mining is curated by hand; every other sector keeps the database's latest-upload order.
  const sectorItems = new Map<string, TrendingItem[]>();
  for (const sector of TRENDING_SECTORS) {
    sectorItems.set(
      sector.slug,
      sector.slug === "mining"
        ? MINING_ITEMS
        : pickLatestUploads(grouped.get(sector.slug) ?? [], TRENDING_ROW_LIMIT).map(toItem),
    );
  }

  const rows: TrendingRow[] = [];

  // Trending is a fresh random selection from covered 2026 publications;
  // category shelves below continue to use newest-upload order.
  const trendingItems = pickDiversifiedTrending(
    coveredEntries.filter((entry) => entry.year?.trim() === TRENDING_YEAR),
    TRENDING_ROW_LIMIT,
  )
    .map(toItem);
  if (trendingItems.length > 0) {
    rows.push({
      id: "trending",
      title: "العناوين الرائجة",
      description: "",
      href: "/library",
      iconKey: "trending",
      items: trendingItems,
    });
  }

  for (const sector of TRENDING_SECTORS) {
    const items = sectorItems.get(sector.slug) ?? [];
    if (items.length === 0) continue;
    rows.push({
      id: sector.slug,
      title: sector.title,
      description: sector.description,
      href: sector.href,
      iconKey: sector.slug,
      items,
    });
  }

  return rows;
}
