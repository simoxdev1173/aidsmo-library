-- Rename: Arab Economic & Social Summit -> Economic, Developmental & Social Summit Resolutions
UPDATE "Category"
SET "name" = 'قرارات القمة الاقتصادية و التنموية و الاجتماعية',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'archive-league-summit-economic-social';

-- Rename: Organizations & Coordination Committee -> Organizations, Coordination & Follow-up Committee
UPDATE "Category"
SET "name" = 'لجنة المنظمات والتنسيق و المتابعة المنبثقة عن المجلس الاقتصادي و الاجتماعي',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'archive-league-coordination';

-- Add: Administrative Court (child of League of Arab States)
WITH parent AS (
  SELECT "id"
  FROM "Category"
  WHERE "slug" = 'archive-league'
)
INSERT INTO "Category" (
  "id",
  "name",
  "slug",
  "navHref",
  "order",
  "isNavVisible",
  "parentId",
  "createdAt",
  "updatedAt"
)
SELECT
  'category-archive-league-administrative-court',
  'المحكمة الإدارية',
  'archive-league-administrative-court',
  '/archive/league/administrative-court',
  628,
  true,
  parent."id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM parent
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "navHref" = EXCLUDED."navHref",
  "order" = EXCLUDED."order",
  "isNavVisible" = true,
  "parentId" = EXCLUDED."parentId",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Add: Statute & Bylaws (child of Administrative Court)
WITH parent AS (
  SELECT "id"
  FROM "Category"
  WHERE "slug" = 'archive-league-administrative-court'
)
INSERT INTO "Category" (
  "id",
  "name",
  "slug",
  "navHref",
  "order",
  "isNavVisible",
  "parentId",
  "createdAt",
  "updatedAt"
)
SELECT
  'category-archive-league-administrative-court-statute',
  'النظام الأساسي و الداخلي',
  'archive-league-administrative-court-statute',
  '/archive/league/administrative-court/statute',
  6281,
  true,
  parent."id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM parent
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "navHref" = EXCLUDED."navHref",
  "order" = EXCLUDED."order",
  "isNavVisible" = true,
  "parentId" = EXCLUDED."parentId",
  "updatedAt" = CURRENT_TIMESTAMP;
