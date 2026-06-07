-- 1) Add nullable first (safe on existing rows)
ALTER TABLE "shows" ADD COLUMN "priceMap" JSONB;

-- 2) Backfill from existing per-seat prices → row label map
UPDATE "shows" s
SET "priceMap" = (
  SELECT COALESCE(
    jsonb_object_agg(distinct_rows.label, to_jsonb(distinct_rows.price)),
    '{}'::jsonb
  )
  FROM (
    SELECT DISTINCT ON (r.label)
      r.label,
      ss.price
    FROM "show_seats" ss
    INNER JOIN "seats" st ON st.id = ss."seatId"
    INNER JOIN "rows" r ON r.id = st."rowId"
    WHERE ss."showId" = s.id
    ORDER BY r.label, ss.price
  ) AS distinct_rows
);

-- 3) Fallback for shows with no seats (shouldn't happen, but safe)
UPDATE "shows"
SET "priceMap" = '{}'::jsonb
WHERE "priceMap" IS NULL;

-- 4) Now enforce NOT NULL
ALTER TABLE "shows" ALTER COLUMN "priceMap" SET NOT NULL;

-- 5) Remove duplicated per-seat price
ALTER TABLE "show_seats" DROP COLUMN "price";