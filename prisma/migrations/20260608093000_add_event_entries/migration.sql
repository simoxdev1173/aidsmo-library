ALTER TYPE "EntryType" ADD VALUE IF NOT EXISTS 'EVENT';

ALTER TABLE "LibraryEntry"
ADD COLUMN "eventStartDate" TIMESTAMP(3),
ADD COLUMN "eventEndDate" TIMESTAMP(3),
ADD COLUMN "eventLocation" TEXT,
ADD COLUMN "eventImages" JSONB NOT NULL DEFAULT '[]';

CREATE INDEX "LibraryEntry_eventStartDate_idx" ON "LibraryEntry"("eventStartDate");
