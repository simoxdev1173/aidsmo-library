WITH parent AS (
  SELECT "id"
  FROM "Category"
  WHERE "slug" = 'newsletter'
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
    ('category-newsletter-2024', '2024', 'newsletter-2024', '/info/newsletter/2024', 431),
    ('category-newsletter-2025', '2025', 'newsletter-2025', '/info/newsletter/2025', 432),
    ('category-newsletter-2026', '2026', 'newsletter-2026', '/info/newsletter/2026', 433)
) AS item(id, name, slug, "navHref", "order")
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "navHref" = EXCLUDED."navHref",
  "order" = EXCLUDED."order",
  "isNavVisible" = true,
  "parentId" = EXCLUDED."parentId",
  "updatedAt" = CURRENT_TIMESTAMP;
