UPDATE "Category"
SET "navHref" = '/industry',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'industry';
