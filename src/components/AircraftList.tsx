
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import type { Aircraft } from "@/pages/Index";

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

// Haversine formula to calculate distance between two points
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

export const AircraftList = ({ 
  onSelect,
  userLocation
}: { 
  onSelect: (aircraft: Aircraft) => void;
  userLocation: { lat: number; lon: number };
}) => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAircraft(mockAircraft);
    const interval = setInterval(() => {
      setAircraft((prev) =>
        prev.map((a) => ({
          ...a,
          altitude: a.altitude + Math.floor(Math.random() * 100 - 50),
          speed: a.speed + Math.floor(Math.random() * 10 - 5),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredAircraft = aircraft.filter((a) =>
    a.callsign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="terminal-content">
      <div className="flex items-center mb-4">
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          className="terminal-input"
          placeholder="search aircraft..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="terminal-table">
        <thead>
          <tr>
            <th>Callsign</th>
            <th>Type</th>
            <th>Altitude</th>
            <th>Speed</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {filteredAircraft.map((a, index) => (
            <tr
              key={a.id}
              onClick={() => onSelect(a)}
              className={`terminal-line`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <td className="flex items-center gap-2">
                <Plane size={16} className={a.isMilitary ? "text-red-500" : ""} />
                {a.callsign}
              </td>
              <td>{a.type}</td>
              <td>{a.altitude} ft</td>
              <td>{Math.round(a.speed * 1.15)} mph</td>
              <td>
                {calculateDistance(
                  userLocation.lat,
                  userLocation.lon,
                  a.lat,
                  a.lon
                ).toFixed(1)} mi
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
