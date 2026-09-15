export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TicketConflict{
    id: number,
    ticketNo: string,
    status: string,
    priority: string,
    stationCode: string,
    utilityType: string,
    longitude: number,
    latitude: number,
    insideServiceArea: boolean,
    nearestEmergencyTicketNo: string | null,
    distanceToNearestEmergencyMeters: number | null,
    riskLevel: RiskLevel;
}


export interface ConflictsSummary{
    total: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    outsideServiceArea: number;
    byUtilityType: Record<string, number>
}

export interface ConflictsResponse{

    tickets:TicketConflict[];
    summary:ConflictsSummary;
}


