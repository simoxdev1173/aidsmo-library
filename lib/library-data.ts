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
const TRENDING_PER_SECTOR = 3;

const ENTRY_TYPE_LABEL: Record<string, string> = {
  BOOK: "كتاب",
  PAGE: "صفحة",
  OTHER: "وثيقة",
  EVENT: "فعالية",
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Randomised, sector-grouped shelves for the homepage. Prefers entries that
// have a cover so the shelf stays visually rich, but keeps the selection random.
export async function getTrendingLibraryRows(): Promise<TrendingRow[]> {
  // Opt this shelf into per-request rendering so the random selection refreshes.
  await connection();

  const [categories, entries] = await Promise.all([
    prisma.category.findMany({ select: { id: true, parentId: true, name: true, slug: true } }),
    prisma.libraryEntry.findMany({
      where: { status: "PUBLISHED" },
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
  for (const entry of entries) {
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

  // Cover-bearing entries first (still shuffled), then the rest — random but polished.
  const pick = (pool: Entry[], limit: number) => {
    const withCover = shuffle(pool.filter((entry) => entry.coverImagePath));
    const withoutCover = shuffle(pool.filter((entry) => !entry.coverImagePath));
    return [...withCover, ...withoutCover].slice(0, limit);
  };

  const rows: TrendingRow[] = [];

  // Mixed "trending" shelf: a handful from every sector so it feels varied.
  const trendingPool = TRENDING_SECTORS.flatMap((sector) =>
    pick(grouped.get(sector.slug) ?? [], TRENDING_PER_SECTOR),
  );
  const trendingItems = shuffle(trendingPool).slice(0, TRENDING_ROW_LIMIT).map(toItem);
  if (trendingItems.length > 0) {
    rows.push({
      id: "trending",
      title: "العناوين الرائجة",
      description: "مختارات متجددة من مختلف قطاعات المكتبة الرقمية.",
      href: "/catalog/industrial-info",
      iconKey: "trending",
      items: trendingItems,
    });
  }

  for (const sector of TRENDING_SECTORS) {
    const items = pick(grouped.get(sector.slug) ?? [], TRENDING_ROW_LIMIT).map(toItem);
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
