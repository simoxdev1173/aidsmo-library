DO $$
DECLARE
  standardization_id TEXT;
BEGIN
  SELECT "id" INTO standardization_id
  FROM "Category"
  WHERE "slug" = 'standardization'
  LIMIT 1;

  IF standardization_id IS NOT NULL THEN
    INSERT INTO "Category" ("id", "name", "slug", "navHref", "order", "isNavVisible", "parentId", "createdAt", "updatedAt")
    VALUES
      ('standardization-training-courses', 'دورات تدريبية', 'standardization-training-courses', '/standardization/training-courses', 261, true, standardization_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('standardization-workshops-events', 'ورش عمل', 'standardization-workshops-events', '/standardization/workshops', 262, true, standardization_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('standardization-seminars', 'ندوات', 'standardization-seminars', '/standardization/seminars', 263, true, standardization_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('standardization-meetings', 'إجتماعات', 'standardization-meetings', '/standardization/meetings', 264, true, standardization_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT ("slug") DO UPDATE SET
      "name" = EXCLUDED."name",
      "navHref" = EXCLUDED."navHref",
      "order" = EXCLUDED."order",
      "isNavVisible" = EXCLUDED."isNavVisible",
      "parentId" = EXCLUDED."parentId",
      "updatedAt" = CURRENT_TIMESTAMP;

    UPDATE "Category"
    SET "isNavVisible" = false,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "slug" = 'standardization-workshops';
  END IF;
END $$;
