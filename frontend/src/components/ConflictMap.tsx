import { CircleMarker, MapContainer,  Popup, TileLayer, useMapEvents  } from 'react-leaflet';
import type { LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RiskLevel, TicketConflict } from '../api/tickets';


const RISK_COLORS: Record<RiskLevel, string> = {

    HIGH: '#FF0000',
    MEDIUM: '#ecc40e',
    LOW: '#00bc09',
};

function BoundsWatcher({ onBoundsChange }: { onBoundsChange: (bbox: string) => void }) {
    useMapEvents(

        {
            moveend: (e: LeafletEvent) => {
                const map = e.target as import('leaflet').Map;
                const b = map.getBounds();
                const bbox = [

                    b.getWest().toFixed(5),
                    b.getSouth().toFixed(5),
                    b.getEast().toFixed(5),
                    b.getNorth().toFixed(5),
                ].join(',');
                onBoundsChange(bbox);
            },

        });
    return null;
}

interface ConflictMapProps {
    tickets: TicketConflict[];
    center: [number, number];
    onBoundsChange: (bbox: string) => void;
}

export function ConflictMap({ tickets, center, onBoundsChange }: ConflictMapProps) {
    return (
        <MapContainer center={center} zoom={13} style={{ height: 450, width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <BoundsWatcher onBoundsChange={onBoundsChange} />
            {tickets.map((ticket) => (
                <CircleMarker
                    key={ticket.id}
                    center={[ticket.latitude, ticket.longitude]}
                    radius={9}
                    pathOptions={{
                        color: RISK_COLORS[ticket.riskLevel],
                        fillColor: RISK_COLORS[ticket.riskLevel],
                        fillOpacity: 0.6,
                    }}>
                    <Popup>
                        <strong>{ticket.ticketNo}</strong><br/>
                            <strong>Risk:{ticket.riskLevel}</strong><br/>
                                <strong>Status:{ticket.status}</strong><br/>
                                    Station: {ticket.stationCode}({ticket.utilityType})
                    </Popup>
                </CircleMarker>
      ))}

        </MapContainer>
    );
}