-- Run with: psql -U postgres -f db/setup.sql
CREATE DATABASE tcu_gis;

\c tcu_gis

CREATE EXTENSION IF NOT EXISTS postgis;
