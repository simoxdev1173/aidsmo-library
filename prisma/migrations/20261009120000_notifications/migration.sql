CREATE TYPE "NotificationType" AS ENUM ('COMMENT_REPLY', 'NEW_PUBLICATION', 'SAVED_PUBLICATION_UPDATED', 'EVENT_ANNOUNCEMENT');

CREATE TABLE "CategoryFollow" (
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CategoryFollow_pkey" PRIMARY KEY ("userId", "categoryId")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entryId" TEXT,
    "type" "NotificationType" NOT NULL,
    "sourceKey" VARCHAR(180) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "href" VARCHAR(500) NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CategoryFollow_categoryId_idx" ON "CategoryFollow"("categoryId");
CREATE UNIQUE INDEX "Notification_userId_sourceKey_key" ON "Notification"("userId", "sourceKey");
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");
CREATE INDEX "Notification_entryId_idx" ON "Notification"("entryId");

ALTER TABLE "CategoryFollow" ADD CONSTRAINT "CategoryFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CategoryFollow" ADD CONSTRAINT "CategoryFollow_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
