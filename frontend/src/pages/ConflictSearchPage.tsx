import {useState} from 'react';
import { fetchConflicts, type ConflictsResponse } from '../api/tickets';
import { RiskBadge } from '../components/RiskBadge';
import { ConflictMap } from '../components/ConflictMap';


const DEFAULT_BBOX ='-80.00,43.18,-79.65,43.38';
const UTILITY_TYPES = ['WATER', 'GAS', 'SANITARY', 'TELECOM'];
function bboxCenter(bbox: string):[number, number]{
    const parts = bbox.split(',').map(Number);
    if(parts.length !== 4 || parts.some(Number.isNaN)) return [43.28, -79.65];
    const [minLng, minLat, maxLng, maxLat] = parts;
    return[(minLat + maxLat)/2, (minLng + maxLng)/2];
}


export function ConflictSearcjPage(){
    const [bbox, setBbox] = useState(DEFAULT_BBOX);
    const [stationCode, setStationCode] = useState('');
    const [utilityType, setUtilityType] = useState('');
    const [radiusMeters, setRadiusMeters] = useState('250');

    const [data, setData] = useState<ConflictsResponse | null> (null);
    const [loading, setLoading] =useState(false);
    const[error, setError] = useState<string | null>(null);

    const runSearch = async (overrideBbox?: string) => {

        const effectiveBbox = overrideBbox ?? bbox;

        setLoading(true);
        setError(null);
        try{

            const result = await fetchConflicts({
                 bbox: effectiveBbox,
                 stationCode: stationCode.trim() || undefined,
                 utilityType: utilityType || undefined,
            });
            setData(result);
            if (overrideBbox) setBbox(overrideBbox);
        } catch (err) {

            setError(err instanceof Error ? err. message: 'Failed to load Conflicts');
        } finally{
            setLoading(false);
        }

        };
       const handleSubmit =(e: React.FormEvent) => {

        e.preventDefault();
        runSearch();
       };
       const handleMapBoundsChange = (newBbox: string) =>{

        setBbox(newBbox);
       }

       return(
        <main>

            <h1>Utitlity Ticket Conflict Search</h1>
            <form onSubmit={handleSubmit}>
                <label>Bbox
                    <input value={bbox} onChange={(e) => setBbox(e.target.value)} />
                </label>

                <label>Station code <input value={stationCode} onChange={(e) => setStationCode(e.target.value)}></input></label>
                <label>Utility Type 
                    <select value={utilityType} onChange={(e) => setUtilityType(e.target.value)}>
                        <option value="">All</option>

                        {UTILITY_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Radius
                 <input type="number" min={1} value={radiusMeters} onChange={(e) => setRadiusMeters(e.target.value) } />
                </label>
                <button type="submit" disabled={loading}>
                    {loading? 'Searching..':'Search'}
                </button>
            </form>

            {loading && <p className="status">Loading Conflicts..</p>}
            {error && <p>{error}</p>}
            {data && (
                <>
                  <section className="summary">
                      <div>
                         <span>{data.summary.total}</span>
                         <span>Total</span>
                      </div>

                      <div>
                         <span>{data.summary.highRisk}</span>
                         <span>High risk</span>
                      </div>
                      <div>
                         <span>{data.summary.mediumRisk}</span>
                         <span>Medium risk</span>
                      </div>
                      <div>
                         <span>{data.summary.lowRisk}</span>
                         <span>Low risk</span>
                      </div>
                      <div>
                         <span>{data.summary.outsideServiceArea}</span>
                         <span>Outside service area</span>
                      </div>
                      <div>
                         <span>{Object.entries(data.summary.byUtilityType)}</span>
                         <span>By Utility Type</span>
                      </div>

                  </section>
                  <ConflictMap tickets={data.tickets} center={bboxCenter(bbox)} onBoundsChange={handleMapBoundsChange} />
                  <div className="result-table">
                    <table>
                        <tr><th>Tticket #</th>
                        <th>Status</th>
                        <th>Priority #</th>
                        <th>Station #</th>
                        <th>Utility #</th>
                        <th>longitude #</th>
                        <th>latitude</th>
                        <th>inside Service Area</th>

                        <th>nearest Emergency TicketNo</th>
                        <th>distance Meters</th>

                        <th>riskLevel</th>
                        </tr>

                        
                        {data.tickets.length === 0 &&(
                          <tr>

                            <td> no tickets found for this seach</td>
                            </tr>

                        )} 
                        {data.tickets.map((ticket) =>(
                        <tr key={ticket.id}>   
                        <td>{ticket.ticketNo}</td>

                        <td>{ticket.status}</td>

                        <td>{ticket.priority}</td>

                        <td>{ticket.stationCode}</td>

                        <td>{ticket.utilityType}</td>
                        <td>{ticket.longitude}</td>

                        <td>{ticket.latitude}</td>

                        <td>{ticket.insideServiceArea}</td>

                        <td>{ticket.nearestEmergencyTicketNo}</td>

                        <td>{ticket.distanceToNearestEmergencyMeters}</td>
                        
                        <td><RiskBadge level={ticket.riskLevel}/></td>
                           
                        </tr>
                        ))}

                    </table>
                  </div>
                </>
            )}
        </main>
       );
}

