ALTER TABLE "DocumentComment" ADD COLUMN "parentId" TEXT;

CREATE INDEX "DocumentComment_parentId_createdAt_id_idx" ON "DocumentComment"("parentId", "createdAt", "id");

ALTER TABLE "DocumentComment" ADD CONSTRAINT "DocumentComment_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "DocumentComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
