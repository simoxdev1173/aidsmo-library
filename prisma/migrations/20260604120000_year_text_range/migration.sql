DROP INDEX IF EXISTS "LibraryEntry_year_idx";

ALTER TABLE "LibraryEntry"
ALTER COLUMN "year" TYPE TEXT
USING "year"::TEXT;

CREATE INDEX "LibraryEntry_year_idx" ON "LibraryEntry"("year");
