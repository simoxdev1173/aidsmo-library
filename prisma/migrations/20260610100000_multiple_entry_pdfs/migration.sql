ALTER TABLE "LibraryEntry"
ADD COLUMN "documentFiles" JSONB NOT NULL DEFAULT '[]';

UPDATE "LibraryEntry"
SET "documentFiles" = jsonb_build_array("filePath")
WHERE "filePath" IS NOT NULL
  AND "documentFiles" = '[]'::jsonb;
