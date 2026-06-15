WITH parent AS (
  SELECT "id"
  FROM "Category"
  WHERE "slug" = 'infographics'
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
  'category-infographics-2023',
  '2023',
  'infographics-2023',
  '/info/statistics/infographics/2023',
  4041,
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

UPDATE "Category"
SET "order" = CASE "slug"
  WHEN 'infographics-2024' THEN 4042
  WHEN 'infographics-2025' THEN 4043
  WHEN 'infographics-2026' THEN 4044
  ELSE "order"
END,
"updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN ('infographics-2024', 'infographics-2025', 'infographics-2026');
