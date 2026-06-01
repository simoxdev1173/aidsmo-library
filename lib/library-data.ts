import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [entries, publishedEntries, draftEntries, categories, recentEntries] = await Promise.all([
    prisma.libraryEntry.count(),
    prisma.libraryEntry.count({ where: { status: "PUBLISHED" } }),
    prisma.libraryEntry.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.libraryEntry.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
  ]);

  return { entries, publishedEntries, draftEntries, categories, recentEntries };
}

export async function getCategoryOptions() {
  return prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      parent: true,
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

  return prisma.libraryEntry.findMany({
    where: {
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.status ? { status: filters.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { author: { contains: q, mode: "insensitive" } },
              { publisher: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
}

export async function getPublishedEntryBySlug(slug: string) {
  return prisma.libraryEntry.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: { include: { parent: true } } },
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

  const ids = new Set<string>([category.id]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const item of categories) {
      if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) {
        ids.add(item.id);
        changed = true;
      }
    }
  }

  const entries = await prisma.libraryEntry.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: { in: Array.from(ids) },
    },
    orderBy: [{ featured: "desc" }, { year: "desc" }, { title: "asc" }],
    include: { category: true },
  });

  return { category, entries };
}
