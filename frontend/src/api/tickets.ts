const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TicketConflict{
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
  riskLevel: RiskLevel;

}
export interface ConflictsSummary {
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  outsideServiceArea: number;
  byUtilityType: Record<string, number>;
}

export interface ConflictsResponse {
  tickets: TicketConflict[];
  summary: ConflictsSummary;
}


export interface conflictsQuery{
    bbox: string;
    stationCode?: string;
    utilityType?: string;
    radiusMeters?: string;
}

export async function fetchConflicts(query:conflictsQuery): Promise<ConflictsResponse> {
 const params = new URLSearchParams({bbox: query.bbox});

 if(query.stationCode) params.set('stationCode', query.stationCode);
 if(query.utilityType) params.set('utilityType', query.utilityType);
 if(query.radiusMeters) params.set('radiusMeters', query.radiusMeters);

 const res = await fetch(`${API_URL}/api/tickets/conflicts?${params.toString()}`);

 if(!res.ok){

    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)? body.message.join(', '):body?.message;
    throw new Error(message || `Request failed with status ${res.status}`);
 }
    return res.json();
}

