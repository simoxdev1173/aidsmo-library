CREATE TABLE "ExecutiveBoardMember" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceProfileName" TEXT,
    "role" TEXT,
    "ministry" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "imageUrl" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "websiteUrl" TEXT,
    "vCardUrl" TEXT,
    "bio" TEXT,
    "sourceNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutiveBoardMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExecutiveBoardMember_slug_key" ON "ExecutiveBoardMember"("slug");
CREATE INDEX "ExecutiveBoardMember_isActive_sortOrder_idx" ON "ExecutiveBoardMember"("isActive", "sortOrder");
CREATE INDEX "ExecutiveBoardMember_country_idx" ON "ExecutiveBoardMember"("country");
