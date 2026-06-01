"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { saveUpload } from "@/lib/uploads";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function optionalInt(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function entryType(formData: FormData): "BOOK" | "PAGE" | "OTHER" {
  const value = text(formData, "entryType");
  if (value === "PAGE" || value === "OTHER") return value;
  return "BOOK";
}

function contentSections(formData: FormData) {
  const titles = formData
    .getAll("sectionTitle")
    .map((value) => (typeof value === "string" ? value.trim() : ""));
  const bodies = formData
    .getAll("sectionBody")
    .map((value) => (typeof value === "string" ? value.trim() : ""));

  return titles
    .map((title, index) => ({ title, body: bodies[index] ?? "" }))
    .filter((section) => section.title.length > 0 || section.body.length > 0);
}

function errorUrl(path: string, error: string) {
  return `${path}?error=${encodeURIComponent(error)}`;
}

function getActionError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

async function uniqueEntrySlug(baseValue: string, currentId?: string) {
  const base = createSlug(baseValue);
  let slug = base;
  let suffix = 2;

  while (
    await prisma.libraryEntry.findFirst({
      where: { slug, ...(currentId ? { id: { not: currentId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function uniqueCategorySlug(baseValue: string, currentId?: string) {
  const base = createSlug(baseValue);
  let slug = base;
  let suffix = 2;

  while (
    await prisma.category.findFirst({
      where: { slug, ...(currentId ? { id: { not: currentId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function loginAction(formData: FormData) {
  let admin: Awaited<ReturnType<typeof authenticateAdmin>> = null;

  try {
    admin = await authenticateAdmin(text(formData, "email"), text(formData, "password"));
  } catch {
    redirect(errorUrl("/dashboard/login", "Could not reach the database. Please check the server connection and try again."));
  }

  if (!admin) {
    redirect("/dashboard/login?error=invalid");
  }

  await createAdminSession(admin);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/dashboard/login");
}

export async function createEntryAction(formData: FormData) {
  await requireAdmin();

  const title = text(formData, "title");
  const categoryId = text(formData, "categoryId");
  const description = text(formData, "description");

  if (!title || !categoryId || !description) {
    redirect("/dashboard/entries/new?error=missing");
  }

  try {
    const status = text(formData, "status") || "DRAFT";
    const coverImagePath = await saveUpload(formData.get("cover") as File | null, "covers");
    const filePath = await saveUpload(formData.get("document") as File | null, "documents");
    const slug = await uniqueEntrySlug(text(formData, "slug") || title);

    await prisma.libraryEntry.create({
      data: {
        title,
        slug,
        entryType: entryType(formData),
        description,
        notes: optionalText(formData, "notes"),
        contentSections: contentSections(formData),
        categoryId,
        coverImagePath,
        filePath,
        publisher: optionalText(formData, "publisher"),
        author: optionalText(formData, "author"),
        year: optionalInt(formData, "year"),
        language: text(formData, "language") || "العربية",
        pageCount: optionalInt(formData, "pageCount"),
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured: formData.get("featured") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/entries");
  } catch (error) {
    redirect(errorUrl("/dashboard/entries/new", getActionError(error)));
  }

  redirect("/dashboard/entries?saved=created");
}

export async function updateEntryAction(id: string, formData: FormData) {
  await requireAdmin();

  const title = text(formData, "title");
  const categoryId = text(formData, "categoryId");
  const description = text(formData, "description");

  if (!title || !categoryId || !description) {
    redirect(`/dashboard/entries/${id}?error=missing`);
  }

  const existing = await prisma.libraryEntry.findUnique({ where: { id } });
  if (!existing) {
    redirect("/dashboard/entries");
  }

  try {
    const status = text(formData, "status") || "DRAFT";
    const coverImagePath =
      (await saveUpload(formData.get("cover") as File | null, "covers")) ?? existing.coverImagePath;
    const filePath =
      (await saveUpload(formData.get("document") as File | null, "documents")) ?? existing.filePath;
    const slug = await uniqueEntrySlug(text(formData, "slug") || title, id);

    await prisma.libraryEntry.update({
      where: { id },
      data: {
        title,
        slug,
        entryType: entryType(formData),
        description,
        notes: optionalText(formData, "notes"),
        contentSections: contentSections(formData),
        categoryId,
        coverImagePath,
        filePath,
        publisher: optionalText(formData, "publisher"),
        author: optionalText(formData, "author"),
        year: optionalInt(formData, "year"),
        language: text(formData, "language") || "العربية",
        pageCount: optionalInt(formData, "pageCount"),
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured: formData.get("featured") === "on",
        publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/entries");
    revalidatePath(`/dashboard/entries/${id}`);
  } catch (error) {
    redirect(errorUrl(`/dashboard/entries/${id}`, getActionError(error)));
  }

  redirect(`/dashboard/entries/${id}?saved=1`);
}

export async function deleteEntryAction(id: string) {
  await requireAdmin();
  await prisma.libraryEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/entries");
  redirect("/dashboard/entries?saved=deleted");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const name = text(formData, "name");
  if (!name) {
    redirect("/dashboard/categories?error=missing");
  }

  try {
    await prisma.category.create({
      data: {
        name,
        slug: await uniqueCategorySlug(text(formData, "slug") || name),
        description: optionalText(formData, "description"),
        navHref: optionalText(formData, "navHref"),
        parentId: optionalText(formData, "parentId"),
        order: optionalInt(formData, "order") ?? 0,
        isNavVisible: formData.get("isNavVisible") === "on",
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/categories");
  } catch (error) {
    redirect(errorUrl("/dashboard/categories", getActionError(error)));
  }

  redirect("/dashboard/categories?saved=1");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = text(formData, "name");
  if (!name) {
    redirect("/dashboard/categories?error=missing");
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: await uniqueCategorySlug(text(formData, "slug") || name, id),
        description: optionalText(formData, "description"),
        navHref: optionalText(formData, "navHref"),
        parentId: optionalText(formData, "parentId"),
        order: optionalInt(formData, "order") ?? 0,
        isNavVisible: formData.get("isNavVisible") === "on",
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/categories");
  } catch (error) {
    redirect(errorUrl("/dashboard/categories", getActionError(error)));
  }

  redirect("/dashboard/categories?saved=1");
}
