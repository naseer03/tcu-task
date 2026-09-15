const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface LocationRecord {
  id: string;
  name: string;
  createdAt: string;
  geom: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export async function fetchLocations(): Promise<LocationRecord[]> {
  const res = await fetch(`${API_URL}/locations`);
  if (!res.ok) {
    throw new Error(`Failed to fetch locations: ${res.status}`);
  }
  const rows: { id: string; name: string; createdAt: string; geom: string }[] =
    await res.json();
  return rows.map((row) => ({
    ...row,
    geom: JSON.parse(row.geom),
  }));
}

export async function createLocation(input: {
  name: string;
  lng: number;
  lat: number;
}): Promise<void> {
  const res = await fetch(`${API_URL}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create location: ${res.status}`);
  }
}
