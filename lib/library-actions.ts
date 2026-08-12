"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { mirrorPublicUploadToDrive, readUpload, saveUploadCopies } from "@/lib/uploads";
import { createPdfCoverFromBytes, createPdfCoverFromPublicPath } from "@/lib/pdf-cover";
import { countPdfPagesFromBytes, countPdfPagesFromPublicPath } from "@/lib/pdf-pages";
import { createDocumentFile, documentFilesValue, parseDocumentFilesInput, primaryDocumentFilePath, type DocumentFile } from "@/lib/document-files";
import { driveDocumentFilesValue, driveStoredFilesValue, type DriveDocumentFile } from "@/lib/drive-files";

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

  return "تعذر إكمال العملية. يرجى المحاولة مرة أخرى، وإذا استمرت المشكلة تواصل مع مسؤول النظام.";
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
  "industry-sme",
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
    throw new Error("تاريخ الفعالية غير صحيح. يرجى مراجعة تاريخ البداية أو النهاية.");
  }

  return date;
}

function eventDates(formData: FormData) {
  const startDate = optionalDate(formData, "eventStartDate");
  const endDate = optionalDate(formData, "eventEndDate");

  if (startDate && endDate && endDate < startDate) {
    throw new Error("تاريخ نهاية الفعالية يجب أن يكون بعد تاريخ البداية.");
  }

  return { startDate, endDate };
}

function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.startsWith("/uploads/"));
}

async function saveDocumentUploads(formData: FormData) {
  const fileEntries = formData.getAll("documents");
  const titleEntries = formData.getAll("documentUploadTitles");
  let primaryUpload: Awaited<ReturnType<typeof readUpload>> = null;
  const savedFiles = [];
  const driveFiles: DriveDocumentFile[] = [];
  // Page counts for the freshly uploaded files, keyed by their saved public
  // path. Counted from the in-memory bytes we already read for the upload, so
  // no extra file I/O and no client-side work is involved.
  const pagesByPath = new Map<string, number>();

  for (let index = 0; index < fileEntries.length; index += 1) {
    const file = fileEntries[index];
    if (!(file instanceof File) || file.size === 0) {
      continue;
    }

    const upload = await readUpload(file, "documents");
    if (!primaryUpload) {
      primaryUpload = upload;
    }

    const { localPath: savedPath, driveFile } = await saveUploadCopies(upload, "documents");
    const documentFile = savedPath ? createDocumentFile(savedPath, titleEntries[index] ?? null) : null;
    if (documentFile) {
      savedFiles.push(documentFile);
      if (driveFile) {
        driveFiles.push({ ...driveFile, title: documentFile.title });
      }

      if (upload) {
        const pages = await countPdfPagesFromBytes(upload.bytes);
        if (pages != null) {
          pagesByPath.set(documentFile.path, pages);
        }
      }
    }
  }

  return {
    primaryUpload,
    files: savedFiles,
    driveFiles,
    pagesByPath,
  };
}

// Auto-calculates the total number of pages across every PDF attached to an
// entry. `manualPageCount` (a value the admin typed in the field) always wins
// so existing/manually-curated counts are never overwritten. Page counts for
// newly uploaded files come from `pagesByPath` (already in memory); any
// remaining files are read from disk. Returns `fallback` when nothing could be
// counted so we never clobber an existing value with null.
async function resolveEntryPageCount(
  documentFiles: DocumentFile[],
  manualPageCount: number | null,
  pagesByPath: Map<string, number>,
  fallback: number | null,
): Promise<number | null> {
  if (manualPageCount != null) {
    return manualPageCount;
  }

  if (documentFiles.length === 0) {
    return fallback;
  }

  let total = 0;
  let countedAny = false;

  for (const file of documentFiles) {
    const known = pagesByPath.get(file.path);
    const pages = known != null ? known : await countPdfPagesFromPublicPath(file.path);

    if (pages != null) {
      total += pages;
      countedAny = true;
    }
  }

  return countedAny ? total : fallback;
}

async function saveEventImages(
  formData: FormData,
  existingImages: string[] = [],
  existingDriveImages: ReturnType<typeof driveStoredFilesValue> = [],
) {
  const files = formData
    .getAll("eventImages")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0) {
    return {
      images: existingImages,
      driveImages: existingDriveImages.filter((file) => existingImages.includes(file.sourcePath)),
    };
  }

  if (existingImages.length + files.length > 3) {
    throw new Error("يمكن رفع 3 صور فقط للفعالية. احذف صورة قديمة أو اختر عددا أقل من الصور.");
  }

  const savedImages: string[] = [];
  const savedDriveImages = [];
  for (const file of files) {
    const upload = await readUpload(file, "events");
    const { localPath: savedPath, driveFile } = await saveUploadCopies(upload, "events");
    if (savedPath) {
      savedImages.push(savedPath);
      if (driveFile) savedDriveImages.push(driveFile);
    }
  }

  return {
    images: [...existingImages, ...savedImages],
    driveImages: [
      ...existingDriveImages.filter((file) => existingImages.includes(file.sourcePath)),
      ...savedDriveImages,
    ],
  };
}

export async function loginAction(formData: FormData) {
  let admin: Awaited<ReturnType<typeof authenticateAdmin>> = null;

  try {
    admin = await authenticateAdmin(text(formData, "email"), text(formData, "password"));
  } catch {
    redirect(errorUrl("/dashboard/login", "تعذر الاتصال بقاعدة البيانات. يرجى التحقق من اتصال الخادم ثم المحاولة مرة أخرى."));
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
    const driveDocumentFiles = documentUploads.driveFiles;
    const eventUploads = isEvent
      ? await saveEventImages(formData)
      : { images: [], driveImages: [] };
    const eventImages = eventUploads.images;
    const dates = isEvent ? eventDates(formData) : { startDate: null, endDate: null };
    const filePath = documentFiles[0]?.path ?? null;
    const coverCopies = isEvent
      ? { localPath: null, driveFile: null }
      : await saveUploadCopies(coverUpload, "covers");
    const uploadedCoverImagePath = isEvent ? eventImages[0] ?? null : coverCopies.localPath;
    const primaryUpload = documentUploads.primaryUpload;
    const coverGeneration = uploadedCoverImagePath || isEvent
      ? { path: null, failed: false }
      : await tryCreatePdfCover(primaryUpload?.bytes, `new entry "${title}"`, filePath);
    const coverImagePath = uploadedCoverImagePath ?? coverGeneration.path;
    const generatedDriveCover = coverGeneration.path
      ? await mirrorPublicUploadToDrive(coverGeneration.path, "covers")
      : null;
    const driveCoverImagePath = isEvent
      ? eventUploads.driveImages[0]?.path ?? null
      : coverCopies.driveFile?.path ?? generatedDriveCover?.path ?? null;
    const driveFilePath = driveDocumentFiles.find((file) => file.sourcePath === filePath)?.path ?? null;
    const pageCount = isEvent
      ? null
      : await resolveEntryPageCount(documentFiles, optionalInt(formData, "pageCount"), documentUploads.pagesByPath, null);
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
        driveCoverImagePath,
        driveFilePath,
        driveDocumentFiles,
        publisher: isEvent ? null : optionalText(formData, "publisher"),
        author: isEvent ? null : optionalText(formData, "author"),
        year: isEvent ? null : optionalYearLabel(formData, "year"),
        language: text(formData, "language") || "العربية",
        pageCount,
        eventStartDate: dates.startDate,
        eventEndDate: dates.endDate,
        eventLocation: isEvent ? optionalText(formData, "eventLocation") : null,
        eventImages,
        driveEventImages: eventUploads.driveImages,
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
    const documentUploads = await saveDocumentUploads(formData);
    const documentFiles = documentFilesValue([...existingDocumentFiles, ...documentUploads.files], existing.filePath);
    const retainedDriveDocumentFiles = driveDocumentFilesValue(existing.driveDocumentFiles)
      .filter((file) => existingDocumentFiles.some((localFile) => localFile.path === file.sourcePath))
      .map((file) => ({
        ...file,
        title: existingDocumentFiles.find((localFile) => localFile.path === file.sourcePath)?.title ?? null,
      }));
    const driveDocumentFiles = [...retainedDriveDocumentFiles, ...documentUploads.driveFiles];
    const existingEventImages = imageList(existing.eventImages);
    const eventUploads = isEvent
      ? await saveEventImages(formData, existingEventImages, driveStoredFilesValue(existing.driveEventImages))
      : { images: existingEventImages, driveImages: driveStoredFilesValue(existing.driveEventImages) };
    const eventImages = eventUploads.images;
    const dates = isEvent ? eventDates(formData) : { startDate: existing.eventStartDate, endDate: existing.eventEndDate };
    const filePath = documentFiles[0]?.path ?? null;
    const coverCopies = isEvent
      ? { localPath: null, driveFile: null }
      : await saveUploadCopies(coverUpload, "covers");
    const uploadedCoverImagePath = isEvent ? eventImages[0] ?? existing.coverImagePath : coverCopies.localPath;
    const primaryUpload = existingDocumentFiles.length === 0 ? documentUploads.primaryUpload : null;
    const coverGeneration =
      uploadedCoverImagePath || existing.coverImagePath || isEvent
        ? { path: null, failed: false }
        : await tryCreatePdfCover(primaryUpload?.bytes, `entry "${existing.title}" (${id})`, filePath);
    const coverImagePath = uploadedCoverImagePath ?? existing.coverImagePath ?? coverGeneration.path;
    const generatedDriveCover = coverGeneration.path
      ? await mirrorPublicUploadToDrive(coverGeneration.path, "covers")
      : null;
    const driveCoverImagePath = isEvent
      ? eventUploads.driveImages[0]?.path ?? existing.driveCoverImagePath
      : coverCopies.driveFile?.path ?? existing.driveCoverImagePath ?? generatedDriveCover?.path ?? null;
    const driveFilePath = driveDocumentFiles.find((file) => file.sourcePath === filePath)?.path ?? null;
    const pageCount = isEvent
      ? existing.pageCount
      : await resolveEntryPageCount(documentFiles, optionalInt(formData, "pageCount"), documentUploads.pagesByPath, existing.pageCount);
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
        driveCoverImagePath,
        driveFilePath,
        driveDocumentFiles,
        publisher: isEvent ? existing.publisher : optionalText(formData, "publisher"),
        author: isEvent ? existing.author : optionalText(formData, "author"),
        year: isEvent ? existing.year : optionalYearLabel(formData, "year"),
        language: isEvent ? existing.language : text(formData, "language") || "العربية",
        pageCount,
        eventStartDate: dates.startDate,
        eventEndDate: dates.endDate,
        eventLocation: isEvent ? optionalText(formData, "eventLocation") : existing.eventLocation,
        eventImages,
        driveEventImages: eventUploads.driveImages,
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
    select: {
      id: true,
      title: true,
      coverImagePath: true,
      filePath: true,
      documentFiles: true,
    },
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
    const driveCover = await mirrorPublicUploadToDrive(coverImagePath, "covers");
    await prisma.libraryEntry.update({
      where: { id },
      data: { coverImagePath, driveCoverImagePath: driveCover.path },
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
