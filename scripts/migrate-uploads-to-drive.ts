import "dotenv/config";
import { documentFilesValue } from "../lib/document-files";
import { driveDocumentFilesValue, driveStoredFilesValue } from "../lib/drive-files";
import { findDriveFileBySourcePath, type DriveFolder, type DriveStoredFile } from "../lib/google-drive";
import { prisma } from "../lib/prisma";
import { mirrorPublicUploadToDrive, resolvePublicUploadFilePath } from "../lib/uploads";

const apply = process.argv.includes("--apply");
const uploadLimit = integerOption("--limit");
const delayMs = integerOption("--delay-ms") ?? 0;
const batchSize = integerOption("--batch-size") ?? 0;
const batchDelayMs = integerOption("--batch-delay-ms") ?? delayMs;
const checkedPaths = new Set<string>();
let uploaded = 0;
let reused = 0;
let staleRecords = 0;
let missing = 0;
let failedEntries = 0;
let driveOperations = 0;
let stoppedAtLimit = false;

class UploadLimitReached extends Error {
  constructor() {
    super("Upload limit reached");
  }
}

function integerOption(name: string) {
  const inline = process.argv.find((argument) => argument.startsWith(`${name}=`));
  const optionIndex = process.argv.indexOf(name);
  const rawValue = inline?.slice(name.length + 1)
    ?? (optionIndex >= 0 ? process.argv[optionIndex + 1] : undefined);

  if (rawValue === undefined) return null;

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return value;
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function paceDriveOperation() {
  if (driveOperations > 0) {
    const startsNewBatch = batchSize > 0 && driveOperations % batchSize === 0;
    const waitMs = startsNewBatch ? Math.max(delayMs, batchDelayMs) : delayMs;

    if (startsNewBatch && waitMs > 0) {
      console.log(`PAUSE ${waitMs}ms after ${driveOperations} Drive file operations`);
    }

    if (waitMs > 0) await sleep(waitMs);
  }

  driveOperations += 1;
}

function localImagePaths(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.startsWith("/uploads/"))
    : [];
}

async function copyFile(
  sourcePath: string,
  folder: DriveFolder,
  existing: DriveStoredFile | null,
) {
  checkedPaths.add(sourcePath);
  await paceDriveOperation();

  // Database shadow fields may point at a previous Drive account. Only reuse a
  // file when the currently authorized account can find its source-path marker.
  const currentDriveFile = await findDriveFileBySourcePath(sourcePath);
  if (currentDriveFile) {
    reused += 1;
    return currentDriveFile;
  }

  if (existing) {
    staleRecords += 1;
    console.log(`STALE DRIVE RECORD ${sourcePath} (${existing.fileId})`);
  }

  const localPath = await resolvePublicUploadFilePath(sourcePath);
  if (!localPath) {
    missing += 1;
    console.error(`MISSING ${sourcePath}`);
    return null;
  }

  if (!apply) {
    console.log(`WOULD COPY ${sourcePath}`);
    return null;
  }

  if (uploadLimit !== null && uploaded >= uploadLimit) {
    throw new UploadLimitReached();
  }

  const driveFile = await mirrorPublicUploadToDrive(sourcePath, folder);
  uploaded += 1;
  console.log(`COPIED ${sourcePath} -> ${driveFile.path}`);
  return driveFile;
}

async function main() {
  console.log(apply ? "Google Drive migration: APPLY mode" : "Google Drive migration: DRY RUN (no uploads or database writes)");
  console.log(`Pacing: ${delayMs}ms between file operations${batchSize > 0 ? `; ${batchDelayMs}ms after each group of ${batchSize}` : ""}`);
  if (uploadLimit !== null) console.log(`Upload limit: ${uploadLimit} new files this run`);

  const entries = await prisma.libraryEntry.findMany({
    orderBy: { createdAt: "asc" },
  });

  for (const entry of entries) {
    try {
      let entryFailed = false;
      const localDocuments = documentFilesValue(entry.documentFiles, entry.filePath);
      const existingDocuments = driveDocumentFilesValue(entry.driveDocumentFiles);
      const driveDocuments = [];

      for (const document of localDocuments) {
        const existing = existingDocuments.find((file) => file.sourcePath === document.path) ?? null;
        const copied = await copyFile(document.path, "documents", existing);
        if (!copied) {
          if (apply || !(await resolvePublicUploadFilePath(document.path))) entryFailed = true;
          continue;
        }
        driveDocuments.push({ ...copied, title: document.title });
      }

      const existingCover = entry.coverImagePath
        ? driveStoredFilesValue(
            entry.driveCoverImagePath
              ? [{
                  fileId: entry.driveCoverImagePath.match(/\/d\/([^/]+)/)?.[1],
                  path: entry.driveCoverImagePath,
                  sourcePath: entry.coverImagePath,
                  name: entry.coverImagePath.split("/").pop(),
                  mimeType: "image/*",
                  size: null,
                  md5Checksum: null,
                }]
              : [],
          )[0] ?? null
        : null;
      const driveCover = entry.coverImagePath
        ? await copyFile(entry.coverImagePath, "covers", existingCover)
        : null;
      if (entry.coverImagePath && !driveCover && (apply || !(await resolvePublicUploadFilePath(entry.coverImagePath)))) {
        entryFailed = true;
      }

      const localEvents = localImagePaths(entry.eventImages);
      const existingEvents = driveStoredFilesValue(entry.driveEventImages);
      const driveEvents = [];
      for (const imagePath of localEvents) {
        const existing = existingEvents.find((file) => file.sourcePath === imagePath) ?? null;
        const copied = await copyFile(imagePath, "events", existing);
        if (!copied) {
          if (apply || !(await resolvePublicUploadFilePath(imagePath))) entryFailed = true;
          continue;
        }
        driveEvents.push(copied);
      }

      if (entryFailed) {
        failedEntries += 1;
        console.error(`SKIPPED DATABASE UPDATE ${entry.id} (${entry.title})`);
        continue;
      }

      if (apply) {
        await prisma.libraryEntry.update({
          where: { id: entry.id },
          data: {
            driveFilePath: driveDocuments[0]?.path ?? entry.driveFilePath,
            driveDocumentFiles: driveDocuments,
            driveCoverImagePath: driveCover?.path ?? entry.driveCoverImagePath,
            driveEventImages: driveEvents,
          },
        });
      }
    } catch (error) {
      if (error instanceof UploadLimitReached) {
        stoppedAtLimit = true;
        console.log(`UPLOAD LIMIT REACHED after ${uploaded} new files; rerun the same command to resume.`);
        break;
      }

      failedEntries += 1;
      console.error(`FAILED ${entry.id} (${entry.title})`, error);
    }
  }

  console.log("\nMigration summary");
  console.log(`Entries: ${entries.length}`);
  console.log(`Unique local paths checked: ${checkedPaths.size}`);
  console.log(`Uploaded this run: ${uploaded}`);
  console.log(`Files reused from the current Drive account: ${reused}`);
  console.log(`Stale records from another/inaccessible Drive: ${staleRecords}`);
  console.log(`Missing local files: ${missing}`);
  console.log(`Entries not updated: ${failedEntries}`);
  console.log(`Stopped at upload limit: ${stoppedAtLimit ? "yes" : "no"}`);

  if (!apply) {
    console.log("\nRun with --apply only after OAuth and the database migration are configured.");
  }

  if (missing > 0 || failedEntries > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
