import { prisma } from "@/lib/prisma";
import { createDocumentCoverFromPublicPath } from "@/lib/document-cover";
import { documentFilesValue } from "@/lib/document-files";
import { mirrorPublicUploadToDrive } from "@/lib/uploads";
import { isGoogleDriveConfigured } from "@/lib/google-drive";

async function main() {
  const entries = await prisma.libraryEntry.findMany({
    where: {
      coverImagePath: null,
    },
    select: {
      id: true,
      title: true,
      filePath: true,
      documentFiles: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const files = documentFilesValue(entry.documentFiles, entry.filePath);
    if (entry.filePath && !files.some((file) => file.path === entry.filePath)) {
      files.push({ path: entry.filePath, title: null });
    }
    if (files.length === 0) {
      skipped++;
      console.log(`Skipped (no document files): ${entry.title}`);
      continue;
    }

    let coverImagePath: string | null = null;
    for (const file of files) {
      try {
        coverImagePath = await createDocumentCoverFromPublicPath(file.path);
        if (coverImagePath) {
          console.log(`Cover source: ${entry.title} <- ${file.path}`);
          break;
        }
        console.log(`Unavailable or unsupported file: ${entry.title} (${file.path})`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`File cover failed: ${entry.title} (${file.path}): ${message}`);
      }
    }

    if (!coverImagePath) {
      failed++;
      console.log(`No usable cover source: ${entry.title}`);
      continue;
    }

    let driveCoverImagePath: string | null = null;
    if (isGoogleDriveConfigured()) {
      try {
        driveCoverImagePath = (await mirrorPublicUploadToDrive(coverImagePath, "covers"))?.path ?? null;
      } catch (error) {
        console.log(`Drive mirror failed: ${entry.title} (${error instanceof Error ? error.message : String(error)})`);
      }
    }

    const updated = await prisma.libraryEntry.updateMany({
      where: { id: entry.id, coverImagePath: null, updatedAt: entry.updatedAt },
      // Maintenance must not replace the editorial date. The timestamp guard
      // also prevents overwriting an edit made while the cover was rendering.
      data: { coverImagePath, updatedAt: entry.updatedAt, ...(driveCoverImagePath ? { driveCoverImagePath } : {}) },
    });
    if (updated.count) {
      generated++;
      console.log(`Generated cover: ${entry.title} -> ${coverImagePath}`);
    } else {
      skipped++;
      console.log(`Skipped (entry changed during run): ${entry.title}`);
    }
  }

  console.log(`Done. Generated ${generated} cover(s), skipped ${skipped}, failed ${failed}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
