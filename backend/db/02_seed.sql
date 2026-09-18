INSERT INTO station_codes (code, utility_type)
VALUES
('HLTNW02', 'WATER'),
('HLTGS01', 'GAS'),
('HLTST01', 'SANITARY'),
('HLDT01', 'TELECOM');

INSERT INTO service_areas (name, station_code_id, geom)
VALUES
(
  'Water Area West',
  1,
  ST_GeomFromText('POLYGON((-79.95 43.20, -79.75 43.20, -79.75 43.35, -79.95 43.35, -79.95 43.20))', 4326)
),
(
  'Gas Area South',
  2,
  ST_GeomFromText('POLYGON((-79.98 43.18, -79.80 43.18, -79.80 43.30, -79.98 43.30, -79.98 43.18))', 4326)
),
(
  'Sanitary Area Central',
  3,
  ST_GeomFromText('POLYGON((-79.90 43.22, -79.70 43.22, -79.70 43.36, -79.90 43.36, -79.90 43.22))', 4326)
),
(
  'Telecom Area East',
  4,
  ST_GeomFromText('POLYGON((-79.85 43.25, -79.65 43.25, -79.65 43.38, -79.85 43.38, -79.85 43.25))', 4326)
);

INSERT INTO tickets (
  ticket_no,
  status,
  priority,
  station_code_id,
  due_at,
  geom
)
VALUES
('20261318930', 'PRE_COMPLETED', 'STANDARD', 1, NOW() + INTERVAL '2 hours', ST_SetSRID(ST_MakePoint(-79.8711, 43.2557), 4326)),
('2026133783', 'OPEN', 'EMERGENCY', 1, NOW() + INTERVAL '30 minutes', ST_SetSRID(ST_MakePoint(-79.8720, 43.2560), 4326)),
('2026136548', 'PRE_COMPLETED', 'STANDARD', 4, NOW() - INTERVAL '1 hour', ST_SetSRID(ST_MakePoint(-79.7624, 43.3135), 4326)),
('2026124098', 'COMPLETED', 'STANDARD', 3, NOW() + INTERVAL '1 day', ST_SetSRID(ST_MakePoint(-79.9205, 43.2756), 4326)),
('2026125725', 'PRE_COMPLETED', 'STANDARD', 2, NOW() - INTERVAL '3 hours', ST_SetSRID(ST_MakePoint(-79.8012, 43.2912), 4326)),
('2026120668', 'OPEN', 'EMERGENCY', 2, NOW() + INTERVAL '15 minutes', ST_SetSRID(ST_MakePoint(-79.9441, 43.2201), 4326)),
('2026114064', 'COMPLETED', 'STANDARD', 1, NOW() + INTERVAL '5 hours', ST_SetSRID(ST_MakePoint(-79.7342, 43.3462), 4326)),
('20261310134', 'PRE_COMPLETED', 'STANDARD', 3, NOW() + INTERVAL '4 hours', ST_SetSRID(ST_MakePoint(-80.0412, 43.1902), 4326)),
('20261400001', 'OPEN', 'STANDARD', 1, NOW() + INTERVAL '6 hours', ST_SetSRID(ST_MakePoint(-79.8800, 43.2600), 4326)),
('20261400002', 'OPEN', 'STANDARD', 4, NOW() + INTERVAL '8 hours', ST_SetSRID(ST_MakePoint(-79.7000, 43.3400), 4326));
