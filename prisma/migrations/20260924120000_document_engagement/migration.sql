CREATE TABLE "DocumentComment" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentRating" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DocumentRating_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DocumentRating_value_check" CHECK ("value" BETWEEN 1 AND 5)
);

CREATE TABLE "DocumentView" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "viewedOn" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DocumentComment_entryId_createdAt_idx" ON "DocumentComment"("entryId", "createdAt");
CREATE INDEX "DocumentComment_userId_createdAt_idx" ON "DocumentComment"("userId", "createdAt");
CREATE UNIQUE INDEX "DocumentRating_entryId_userId_key" ON "DocumentRating"("entryId", "userId");
CREATE INDEX "DocumentRating_entryId_idx" ON "DocumentRating"("entryId");
CREATE UNIQUE INDEX "DocumentView_entryId_visitorId_viewedOn_key" ON "DocumentView"("entryId", "visitorId", "viewedOn");
CREATE INDEX "DocumentView_entryId_idx" ON "DocumentView"("entryId");

ALTER TABLE "DocumentComment" ADD CONSTRAINT "DocumentComment_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentComment" ADD CONSTRAINT "DocumentComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentRating" ADD CONSTRAINT "DocumentRating_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentRating" ADD CONSTRAINT "DocumentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentView" ADD CONSTRAINT "DocumentView_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
