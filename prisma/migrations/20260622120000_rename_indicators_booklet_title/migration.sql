UPDATE "Category"
SET "name" = 'كتيب المؤشرات الاقتصادية و الصناعية في الدول العربية'
WHERE "slug" = 'indicators-booklet';

UPDATE "LibraryEntry"
SET "title" = 'كتيب المؤشرات الاقتصادية و الصناعية في الدول العربية'
WHERE "title" IN (
  'كتيب المؤشرات الاقتصادية والصناعية',
  'المؤشرات الاقتصادية والصناعية في الدول العربية'
);
