import type { RiskLevel } from "../api/tickets";

const LABELS: Record<RiskLevel, string> = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
};
export function RiskBadge({level}: {level: RiskLevel}){

    return <span>{LABELS[level]}</span>
}
