-- Google Drive shadow metadata. Existing local paths remain the active source
-- during the verification phase and are intentionally left unchanged.
ALTER TABLE "LibraryEntry"
ADD COLUMN "driveCoverImagePath" TEXT,
ADD COLUMN "driveFilePath" TEXT,
ADD COLUMN "driveDocumentFiles" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "driveEventImages" JSONB NOT NULL DEFAULT '[]';
