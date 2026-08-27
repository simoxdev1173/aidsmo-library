CREATE TYPE "DocumentAnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE "DocumentAnalysis" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "sourceTitle" TEXT,
    "status" "DocumentAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "summary" TEXT,
    "questions" JSONB NOT NULL DEFAULT '[]',
    "extractedText" TEXT,
    "sampledPages" JSONB NOT NULL DEFAULT '[]',
    "pageCount" INTEGER,
    "extractionMode" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "sourceChecksum" TEXT,
    "error" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocumentAnalysis_entryId_sourcePath_key" ON "DocumentAnalysis"("entryId", "sourcePath");
CREATE INDEX "DocumentAnalysis_entryId_idx" ON "DocumentAnalysis"("entryId");
CREATE INDEX "DocumentAnalysis_status_idx" ON "DocumentAnalysis"("status");
CREATE INDEX "DocumentAnalysis_sourceChecksum_idx" ON "DocumentAnalysis"("sourceChecksum");

ALTER TABLE "DocumentAnalysis"
ADD CONSTRAINT "DocumentAnalysis_entryId_fkey"
FOREIGN KEY ("entryId") REFERENCES "LibraryEntry"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
