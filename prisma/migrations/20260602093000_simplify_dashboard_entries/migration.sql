ALTER TABLE "LibraryEntry" ALTER COLUMN "description" DROP NOT NULL;

ALTER TABLE "LibraryEntry" ADD COLUMN "tag" TEXT;
