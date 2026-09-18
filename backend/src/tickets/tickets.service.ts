import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { GetConflictsQueryDto } from './dto/get-conflicts-query.dto.js';
import type { ConflictsResponse, ConflictsSummary, RiskLevel, TicketConflict } from './tickets.types.js';

interface Bbox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

interface ConflictRow {
  id: number;
  ticketNo: string;
  status: string;
  priority: string;
  stationCode: string;
  utilityType: string;
  longitude: number;
  latitude: number;
  insideServiceArea: boolean;
  nearestEmergencyTicketNo: string | null;
  distanceToNearestEmergencyMeters: number | null;
  isOverdue: boolean;
}

const DEFAULT_RADIUS_METERS = 250;

@Injectable()
export class TicketsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getConflicts(query: GetConflictsQueryDto): Promise<ConflictsResponse> {
    const bbox = this.parseBbox(query.bbox);
    const radiusMeters = this.parseRadiusMeters(query.radiusMeters);
    const stationCode = query.stationCode?.trim() || null;
    const utilityType = query.utilityType?.trim() || null;

    const rows: ConflictRow[] = await this.dataSource.query(
      `
      SELECT
        t.id AS "id",
        t.ticket_no AS "ticketNo",
        t.status AS "status",
        t.priority AS "priority",
        sc.code AS "stationCode",
        sc.utility_type AS "utilityType",
        ST_X(t.geom) AS "longitude",
        ST_Y(t.geom) AS "latitude",
        COALESCE(ST_Covers(sa.geom, t.geom), false) AS "insideServiceArea",
        e."ticketNo" AS "nearestEmergencyTicketNo",
        e."distanceMeters" AS "distanceToNearestEmergencyMeters",
        (t.status = 'PRE_COMPLETED' AND t.due_at < NOW()) AS "isOverdue"
      FROM tickets t
      JOIN station_codes sc ON sc.id = t.station_code_id
      LEFT JOIN service_areas sa ON sa.station_code_id = t.station_code_id
      LEFT JOIN LATERAL (
        SELECT
          et.ticket_no AS "ticketNo",
          ST_Distance(t.geom::geography, et.geom::geography) AS "distanceMeters"
        FROM tickets et
        WHERE et.priority = 'EMERGENCY'
          AND et.id <> t.id
          AND ST_DWithin(t.geom::geography, et.geom::geography, $5)
        ORDER BY t.geom <-> et.geom
        LIMIT 1
      ) e ON true
      WHERE ST_Intersects(t.geom, ST_MakeEnvelope($1, $2, $3, $4, 4326))
        AND ($6::varchar IS NULL OR sc.code = $6)
        AND ($7::varchar IS NULL OR sc.utility_type = $7)
      ORDER BY t.ticket_no ASC
      `,
      [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat, radiusMeters, stationCode, utilityType],
    );

    const tickets = rows.map((row) => this.toTicketConflict(row));
    const summary = this.buildSummary(tickets);

    return { tickets, summary };
  }

  private toTicketConflict(row: ConflictRow): TicketConflict {
    const distanceToNearestEmergencyMeters =
      row.distanceToNearestEmergencyMeters === null ? null : Math.round(Number(row.distanceToNearestEmergencyMeters));

    return {
      id: row.id,
      ticketNo: row.ticketNo,
      status: row.status,
      priority: row.priority,
      stationCode: row.stationCode,
      utilityType: row.utilityType,
      longitude: Number(row.longitude),
      latitude: Number(row.latitude),
      insideServiceArea: row.insideServiceArea,
      nearestEmergencyTicketNo: row.nearestEmergencyTicketNo,
      distanceToNearestEmergencyMeters,
      riskLevel: this.computeRiskLevel(row),
    };
  }

  private computeRiskLevel(row: ConflictRow): RiskLevel {
    const isHigh = row.priority === 'EMERGENCY' || row.nearestEmergencyTicketNo !== null;
    if (isHigh) return 'HIGH';

    const isMedium = !row.insideServiceArea || row.isOverdue;
    if (isMedium) return 'MEDIUM';

    return 'LOW';
  }

  private buildSummary(tickets: TicketConflict[]): ConflictsSummary {
    const byUtilityType: Record<string, number> = {};
    let highRisk = 0;
    let mediumRisk = 0;
    let lowRisk = 0;
    let outsideServiceArea = 0;

    for (const ticket of tickets) {
      byUtilityType[ticket.utilityType] = (byUtilityType[ticket.utilityType] ?? 0) + 1;
      if (ticket.riskLevel === 'HIGH') highRisk++;
      else if (ticket.riskLevel === 'MEDIUM') mediumRisk++;
      else lowRisk++;
      if (!ticket.insideServiceArea) outsideServiceArea++;
    }

    return {
      total: tickets.length,
      highRisk,
      mediumRisk,
      lowRisk,
      outsideServiceArea,
      byUtilityType,
    };
  }

  private parseBbox(bbox: string): Bbox {
    const parts = bbox.split(',').map((part) => Number(part));
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
      throw new BadRequestException('bbox must be in the format minLng,minLat,maxLng,maxLat');
    }

    const [minLng, minLat, maxLng, maxLat] = parts;

    if (minLng < -180 || maxLng > 180 || minLat < -90 || maxLat > 90) {
      throw new BadRequestException('bbox coordinates must be within valid longitude/latitude ranges');
    }

    if (minLng >= maxLng || minLat >= maxLat) {
      throw new BadRequestException('bbox min values must be less than max values');
    }

    return { minLng, minLat, maxLng, maxLat };
  }

  private parseRadiusMeters(radiusMeters?: string): number {
    if (radiusMeters === undefined) return DEFAULT_RADIUS_METERS;

    const value = Number(radiusMeters);
    if (Number.isNaN(value) || value <= 0) {
      throw new BadRequestException('radiusMeters must be a positive number');
    }

    return value;
  }
}
