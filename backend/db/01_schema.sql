CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS service_areas;
DROP TABLE IF EXISTS station_codes;

CREATE TABLE station_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  utility_type VARCHAR(50) NOT NULL
);

CREATE TABLE service_areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  station_code_id INT REFERENCES station_codes(id),
  geom GEOMETRY(Polygon, 4326) NOT NULL
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  ticket_no VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  station_code_id INT REFERENCES station_codes(id),
  due_at TIMESTAMP NULL,
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX tickets_geom_idx ON tickets USING GIST (geom);
CREATE INDEX service_areas_geom_idx ON service_areas USING GIST (geom);
CREATE INDEX tickets_station_code_idx ON tickets (station_code_id);
CREATE INDEX tickets_status_idx ON tickets (status);
CREATE INDEX tickets_priority_idx ON tickets (priority);
