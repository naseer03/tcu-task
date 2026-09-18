SELECT 'station_codes' AS table_name, COUNT(*) FROM station_codes
UNION ALL
SELECT 'service_areas' AS table_name, COUNT(*) FROM service_areas
UNION ALL
SELECT 'tickets' AS table_name, COUNT(*) FROM tickets;

SELECT ticket_no, ST_X(geom) AS longitude, ST_Y(geom) AS latitude
FROM tickets
ORDER BY ticket_no;

-- Expected counts after running 01_schema.sql and 02_seed.sql:
-- station_codes = 4
-- service_areas = 4
-- tickets = 10

-- Demo bbox used in sample requests should include 9 tickets:
-- bbox=-80.00,43.18,-79.65,43.38
SELECT COUNT(*) AS demo_bbox_ticket_count
FROM tickets
WHERE ST_Intersects(
  geom,
  ST_MakeEnvelope(-80.00, 43.18, -79.65, 43.38, 4326)
);
