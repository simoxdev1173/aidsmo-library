-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('BOOK', 'PAGE');

-- AlterTable
ALTER TABLE "LibraryEntry"
ADD COLUMN "entryType" "EntryType" NOT NULL DEFAULT 'BOOK',
ADD COLUMN "notes" TEXT,
ADD COLUMN "contentSections" JSONB NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE INDEX "LibraryEntry_entryType_idx" ON "LibraryEntry"("entryType");
