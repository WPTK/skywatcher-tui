import { useEffect, useState } from "react";
import { Plane, ArrowUp, ArrowDown, Navigation2 } from "lucide-react";
import type { Aircraft } from "@/pages/Index";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const mockAircraft: Aircraft[] = [
  {
    id: "1",
    callsign: "UAL123",
    altitude: 35000,
    speed: 450,
    heading: 270,
    lat: 51.5074,
    lon: -0.1278,
    type: "B737-800",
    isMilitary: false,
    owner: "United Airlines",
    previousAltitude: 34000,
  },
  {
    id: "2",
    callsign: "BAW456",
    altitude: 28000,
    speed: 420,
    heading: 90,
    lat: 51.4700,
    lon: -0.4543,
    type: "A320neo",
    isMilitary: false,
  },
  {
    id: "3",
    callsign: "RCH285",
    altitude: 31000,
    speed: 480,
    heading: 180,
    lat: 51.6000,
    lon: -0.2000,
    type: "C-17A",
    isMilitary: true,
  },
];

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type SortField = 'distance' | 'altitude' | 'callsign' | 'speed';

export const AircraftList = ({ 
  onSelect,
  userLocation
}: { 
  onSelect: (aircraft: Aircraft) => void;
  userLocation: { lat: number; lon: number };
}) => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('distance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { preferences, toggleVisualEffect } = useUserPreferences();

  useEffect(() => {
    const initialAircraft = mockAircraft.map(a => ({ ...a, previousAltitude: a.altitude }));
    setAircraft(initialAircraft);
    
    const interval = setInterval(() => {
      setAircraft((prev) =>
        prev.map((a) => ({
          ...a,
          previousAltitude: a.altitude,
          altitude: a.altitude + Math.floor(Math.random() * 100 - 50),
          speed: a.speed + Math.floor(Math.random() * 10 - 5),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortedAircraft = [...aircraft]
    .filter((a) => a.callsign.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'distance':
          return (calculateDistance(userLocation.lat, userLocation.lon, a.lat, a.lon) -
            calculateDistance(userLocation.lat, userLocation.lon, b.lat, b.lon)) * multiplier;
        case 'altitude':
          return (a.altitude - b.altitude) * multiplier;
        case 'speed':
          return (a.speed - b.speed) * multiplier;
        case 'callsign':
          return a.callsign.localeCompare(b.callsign) * multiplier;
        default:
          return 0;
      }
    });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="terminal-content">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center">
          <span className="terminal-prompt">╭── Search ──╮</span>
          <input
            type="text"
            className={`terminal-input ${preferences.visualEffects.cursorBlink ? 'cursor-blink-enabled' : ''} 
                       ${preferences.visualEffects.textGlow ? 'text-glow-enabled' : ''}`}
            placeholder="search aircraft..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.visualEffects.scanlines}
              onChange={() => toggleVisualEffect('scanlines')}
            />
            Scanlines
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.visualEffects.textGlow}
              onChange={() => toggleVisualEffect('textGlow')}
            />
            Text Glow
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.visualEffects.screenFlicker}
              onChange={() => toggleVisualEffect('screenFlicker')}
            />
            Screen Flicker
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.visualEffects.cursorBlink}
              onChange={() => toggleVisualEffect('cursorBlink')}
            />
            Cursor Blink
          </label>
        </div>
      </div>
      <div className={`terminal-window ${preferences.visualEffects.scanlines ? 'scanlines-enabled' : ''} 
                      ${preferences.visualEffects.screenFlicker ? 'flicker-enabled' : ''}`}>
        <table className="terminal-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('callsign')} className="cursor-pointer hover:text-primary">
                ┌─ Callsign ─┐ {sortField === 'callsign' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>│ Type │</th>
              <th onClick={() => handleSort('altitude')} className="cursor-pointer hover:text-primary">
                │ Altitude │ {sortField === 'altitude' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('speed')} className="cursor-pointer hover:text-primary">
                │ Speed │ {sortField === 'speed' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('distance')} className="cursor-pointer hover:text-primary">
                └─ Distance ─┘ {sortField === 'distance' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAircraft.map((a, index) => (
              <tr
                key={a.id}
                onClick={() => onSelect(a)}
                className={`terminal-line`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="flex items-center gap-2">
                  <Plane size={16} className={a.isMilitary ? "text-red-500" : ""} />
                  {a.callsign}
                  {preferences.favoriteCallsigns.includes(a.callsign) && 
                    <span className="text-primary">★</span>}
                </td>
                <td>{a.type}</td>
                <td className="flex items-center gap-1">
                  {a.altitude} ft
                  {a.altitude > (a.previousAltitude || a.altitude) ? (
                    <ArrowUp size={14} className="text-primary" />
                  ) : a.altitude < (a.previousAltitude || a.altitude) ? (
                    <ArrowDown size={14} className="text-destructive" />
                  ) : null}
                </td>
                <td>{Math.round(a.speed * (preferences.useMetric ? 1.852 : 1.15))} {preferences.useMetric ? 'km/h' : 'mph'}</td>
                <td className="flex items-center gap-2">
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lon,
                    a.lat,
                    a.lon
                  ).toFixed(1)} {preferences.useMetric ? 'km' : 'mi'}
                  <Navigation2 
                    size={14} 
                    className="text-muted-foreground"
                    style={{ transform: `rotate(${a.heading}deg)` }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
