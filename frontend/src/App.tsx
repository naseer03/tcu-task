import { useEffect, useState } from 'react';
import { createLocation, fetchLocations, type LocationRecord } from './api/client';
import './App.css';

function App() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [name, setName] = useState('');
  const [lng, setLng] = useState('');
  const [lat, setLat] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadLocations = () => {
    fetchLocations()
      .then(setLocations)
      .catch((err: Error) => setError(err.message));
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createLocation({ name, lng: Number(lng), lat: Number(lat) });
      setName('');
      setLng('');
      setLat('');
      loadLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create location');
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>TCU GIS</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Lng" value={lng} onChange={(e) => setLng(e.target.value)} required />
        <input placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} required />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            {loc.name} — [{loc.geom.coordinates[0]}, {loc.geom.coordinates[1]}]
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
