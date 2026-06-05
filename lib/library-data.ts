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
    where: { isNavVisible: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      parent: { include: { parent: true } },
      _count: { select: { entries: true, children: true } },
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
  slug: string,
  filters: {
    q?: string;
    tag?: string;
    year?: string;
    sort?: string;
  } = {},
) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return null;
  }

  const q = filters.q?.trim();
  const tag = filters.tag?.trim();
  const year = filters.year?.trim();

  const baseWhere = {
    status: "PUBLISHED" as const,
    categoryId: category.id,
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
