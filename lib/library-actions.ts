"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { readUpload, saveUploadBytes } from "@/lib/uploads";
import { createPdfCoverFromBytes, createPdfCoverFromPublicPath } from "@/lib/pdf-cover";
import { MAX_DOCUMENT_FILES, documentFilesValue, parseDocumentFilesInput, primaryDocumentFilePath } from "@/lib/document-files";

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

function optionalYearLabel(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;

  return value.replace(/[–—]/g, "-").replace(/\s*-\s*/g, " - ");
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

type CoverGenerationResult = {
  path: string | null;
  failed: boolean;
};

async function tryCreatePdfCover(
  bytes: Buffer | null | undefined,
  context: string,
  savedFilePath?: string | null,
): Promise<CoverGenerationResult> {
  if (!bytes && !savedFilePath) {
    return { path: null, failed: false };
  }

  if (bytes) {
    try {
      return {
        path: await createPdfCoverFromBytes(bytes),
        failed: false,
      };
    } catch (error) {
      console.error(`PDF cover generation from upload bytes failed: ${context}`, error);
    }
  }

  if (savedFilePath) {
    try {
      const path = await createPdfCoverFromPublicPath(savedFilePath);

      if (path) {
        return { path, failed: false };
      }
    } catch (error) {
      console.error(`PDF cover generation from saved file failed: ${context}`, error);
    }
  }

  return { path: null, failed: true };
}

function coverStatusParam(result: CoverGenerationResult, attempted: boolean) {
  if (!attempted) return "";
  return result.path ? "&cover=generated" : result.failed ? "&cover=failed" : "";
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

const eventCategorySlugs = new Set([
  "industry-events",
  "conferences",
  "standardization-training-courses",
  "standardization-workshops-events",
  "standardization-seminars",
  "standardization-meetings",
  "training-plan-2024",
  "training-plan-2025",
  "training-plan-2026",
]);

async function isEventCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      slug: true,
      parent: { select: { slug: true } },
    },
  });

  return Boolean(category && (eventCategorySlugs.has(category.slug) || (category.parent?.slug && eventCategorySlugs.has(category.parent.slug))));
}

function optionalDate(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid event date.");
  }

  return date;
}

function eventDates(formData: FormData) {
  const startDate = optionalDate(formData, "eventStartDate");
  const endDate = optionalDate(formData, "eventEndDate");

  if (startDate && endDate && endDate < startDate) {
    throw new Error("Event end date must be after the start date.");
  }

  return { startDate, endDate };
}

function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.startsWith("/uploads/"));
}

async function saveDocumentUploads(formData: FormData, availableSlots = MAX_DOCUMENT_FILES) {
  const files = formData
    .getAll("documents")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length > availableSlots) {
    throw new Error(`PDF files are limited to ${MAX_DOCUMENT_FILES}.`);
  }

  const uploads = [];
  for (const file of files) {
    uploads.push(await readUpload(file, "documents"));
  }

  const savedFiles: string[] = [];
  for (const upload of uploads) {
    const savedPath = await saveUploadBytes(upload, "documents");
    if (savedPath) {
      savedFiles.push(savedPath);
    }
  }

  return {
    uploads,
    files: savedFiles,
  };
}

function assertDocumentLimit(files: string[]) {
  if (files.length > MAX_DOCUMENT_FILES) {
    throw new Error(`PDF files are limited to ${MAX_DOCUMENT_FILES}.`);
  }
}

async function saveEventImages(formData: FormData, existingImages: string[] = []) {
  const files = formData
    .getAll("eventImages")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0) {
    return existingImages;
  }

  if (existingImages.length + files.length > 3) {
    throw new Error("Event images are limited to 3 images.");
  }

  const savedImages: string[] = [];
  for (const file of files) {
    const upload = await readUpload(file, "events");
    const savedPath = await saveUploadBytes(upload, "events");
    if (savedPath) {
      savedImages.push(savedPath);
    }
  }

  return [...existingImages, ...savedImages];
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

  if (!title || !categoryId) {
    redirect("/dashboard/entries/new?error=missing");
  }

  let coverRedirectStatus = "";

  try {
    const status = text(formData, "status") || "DRAFT";
    const isEvent = await isEventCategory(categoryId);
    const coverFile = isEvent ? null : (formData.get("cover") as File | null);
    const coverUpload = await readUpload(coverFile, "covers");
    const documentUploads = await saveDocumentUploads(formData);
    const documentFiles = documentFilesValue(documentUploads.files);
    assertDocumentLimit(documentFiles);
    const eventImages = isEvent ? await saveEventImages(formData) : [];
    const dates = isEvent ? eventDates(formData) : { startDate: null, endDate: null };
    const filePath = documentFiles[0] ?? null;
    const uploadedCoverImagePath = isEvent ? eventImages[0] ?? null : await saveUploadBytes(coverUpload, "covers");
    const primaryUpload = documentUploads.uploads[0] ?? null;
    const coverGeneration = uploadedCoverImagePath || isEvent
      ? { path: null, failed: false }
      : await tryCreatePdfCover(primaryUpload?.bytes, `new entry "${title}"`, filePath);
    const coverImagePath = uploadedCoverImagePath ?? coverGeneration.path;
    const slug = await uniqueEntrySlug(text(formData, "slug") || title);

    await prisma.libraryEntry.create({
      data: {
        title,
        slug,
        entryType: isEvent ? "EVENT" : "BOOK",
        description: isEvent ? null : optionalText(formData, "description"),
        notes: optionalText(formData, "notes"),
        contentSections: [],
        tag: optionalText(formData, "tag"),
        categoryId,
        coverImagePath,
        filePath,
        documentFiles,
        publisher: isEvent ? null : optionalText(formData, "publisher"),
        author: isEvent ? null : optionalText(formData, "author"),
        year: isEvent ? null : optionalYearLabel(formData, "year"),
        language: text(formData, "language") || "العربية",
        pageCount: isEvent ? null : optionalInt(formData, "pageCount"),
        eventStartDate: dates.startDate,
        eventEndDate: dates.endDate,
        eventLocation: isEvent ? optionalText(formData, "eventLocation") : null,
        eventImages,
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured: formData.get("featured") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/entries");
    coverRedirectStatus = coverStatusParam(coverGeneration, Boolean(filePath && !uploadedCoverImagePath));
  } catch (error) {
    redirect(errorUrl("/dashboard/entries/new", getActionError(error)));
  }

  redirect(`/dashboard/entries?saved=created${coverRedirectStatus}`);
}

export async function updateEntryAction(id: string, formData: FormData) {
  await requireAdmin();

  const title = text(formData, "title");
  const categoryId = text(formData, "categoryId");

  if (!title || !categoryId) {
    redirect(`/dashboard/entries/${id}?error=missing`);
  }

  const existing = await prisma.libraryEntry.findUnique({ where: { id } });
  if (!existing) {
    redirect("/dashboard/entries");
  }

  let coverRedirectStatus = "";

  try {
    const status = text(formData, "status") || "DRAFT";
    const isEvent = await isEventCategory(categoryId);
    const coverFile = isEvent ? null : (formData.get("cover") as File | null);
    const coverUpload = await readUpload(coverFile, "covers");
    const existingDocumentFiles = parseDocumentFilesInput(formData.get("documentFilesExisting"));
    assertDocumentLimit(existingDocumentFiles);
    const documentUploads = await saveDocumentUploads(formData, MAX_DOCUMENT_FILES - existingDocumentFiles.length);
    const documentFiles = documentFilesValue([...existingDocumentFiles, ...documentUploads.files], existing.filePath);
    assertDocumentLimit(documentFiles);
    const eventImages = isEvent ? await saveEventImages(formData, imageList(existing.eventImages)) : imageList(existing.eventImages);
    const dates = isEvent ? eventDates(formData) : { startDate: existing.eventStartDate, endDate: existing.eventEndDate };
    const filePath = documentFiles[0] ?? null;
    const uploadedCoverImagePath = isEvent ? eventImages[0] ?? existing.coverImagePath : await saveUploadBytes(coverUpload, "covers");
    const primaryUpload = existingDocumentFiles.length === 0 ? documentUploads.uploads[0] ?? null : null;
    const coverGeneration =
      uploadedCoverImagePath || existing.coverImagePath || isEvent
        ? { path: null, failed: false }
        : await tryCreatePdfCover(primaryUpload?.bytes, `entry "${existing.title}" (${id})`, filePath);
    const coverImagePath = uploadedCoverImagePath ?? existing.coverImagePath ?? coverGeneration.path;
    const slug = await uniqueEntrySlug(text(formData, "slug") || title, id);

    await prisma.libraryEntry.update({
      where: { id },
      data: {
        title,
        slug,
        entryType: isEvent ? "EVENT" : "BOOK",
        description: isEvent ? existing.description : optionalText(formData, "description"),
        notes: optionalText(formData, "notes"),
        tag: optionalText(formData, "tag"),
        categoryId,
        coverImagePath,
        filePath,
        documentFiles,
        publisher: isEvent ? existing.publisher : optionalText(formData, "publisher"),
        author: isEvent ? existing.author : optionalText(formData, "author"),
        year: isEvent ? existing.year : optionalYearLabel(formData, "year"),
        language: isEvent ? existing.language : text(formData, "language") || "العربية",
        pageCount: isEvent ? existing.pageCount : optionalInt(formData, "pageCount"),
        eventStartDate: dates.startDate,
        eventEndDate: dates.endDate,
        eventLocation: isEvent ? optionalText(formData, "eventLocation") : existing.eventLocation,
        eventImages,
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        featured: formData.get("featured") === "on",
        publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/entries");
    revalidatePath(`/dashboard/entries/${id}`);
    coverRedirectStatus = coverStatusParam(coverGeneration, Boolean(filePath && !uploadedCoverImagePath && !existing.coverImagePath));
  } catch (error) {
    redirect(errorUrl(`/dashboard/entries/${id}`, getActionError(error)));
  }

  redirect(`/dashboard/entries/${id}?saved=1${coverRedirectStatus}`);
}

export async function generateEntryCoverAction(id: string) {
  await requireAdmin();

  const entry = await prisma.libraryEntry.findUnique({
    where: { id },
    select: { id: true, title: true, coverImagePath: true, filePath: true, documentFiles: true },
  });

  if (!entry) {
    redirect("/dashboard/entries");
  }

  const primaryFilePath = primaryDocumentFilePath(entry.documentFiles, entry.filePath);

  if (entry.coverImagePath || !primaryFilePath) {
    redirect(`/dashboard/entries/${id}?cover=skipped`);
  }

  let coverImagePath: string | null = null;

  try {
    coverImagePath = await createPdfCoverFromPublicPath(primaryFilePath);
  } catch (error) {
    console.error(`PDF cover generation failed: existing entry "${entry.title}" (${id})`, error);
    redirect(`/dashboard/entries/${id}?cover=failed`);
  }

  if (!coverImagePath) {
    redirect(`/dashboard/entries/${id}?cover=missing-pdf`);
  }

  try {
    await prisma.libraryEntry.update({
      where: { id },
      data: { coverImagePath },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/entries");
    revalidatePath(`/dashboard/entries/${id}`);
  } catch (error) {
    console.error(`PDF cover save failed: existing entry "${entry.title}" (${id})`, error);
    redirect(`/dashboard/entries/${id}?cover=failed`);
  }

  redirect(`/dashboard/entries/${id}?saved=1&cover=generated`);
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
