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
  item.id,
  item.name,
  item.slug,
  item."navHref",
  item."order",
  true,
  parent."id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM parent
CROSS JOIN (
  VALUES
    ('category-infographics-2024', '2024', 'infographics-2024', '/info/statistics/infographics/2024', 4041),
    ('category-infographics-2025', '2025', 'infographics-2025', '/info/statistics/infographics/2025', 4042),
    ('category-infographics-2026', '2026', 'infographics-2026', '/info/statistics/infographics/2026', 4043)
) AS item(id, name, slug, "navHref", "order")
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "navHref" = EXCLUDED."navHref",
  "order" = EXCLUDED."order",
  "isNavVisible" = true,
  "parentId" = EXCLUDED."parentId",
  "updatedAt" = CURRENT_TIMESTAMP;
