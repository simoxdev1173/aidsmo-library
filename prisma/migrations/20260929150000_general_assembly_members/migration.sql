CREATE TABLE "GeneralAssemblyMember" (
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
    CONSTRAINT "GeneralAssemblyMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GeneralAssemblyMember_slug_key" ON "GeneralAssemblyMember"("slug");
CREATE INDEX "GeneralAssemblyMember_isActive_sortOrder_idx" ON "GeneralAssemblyMember"("isActive", "sortOrder");
CREATE INDEX "GeneralAssemblyMember_country_idx" ON "GeneralAssemblyMember"("country");
