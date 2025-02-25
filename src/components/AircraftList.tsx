
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

interface Aircraft {
  id: string;
  callsign: string;
  altitude: number;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
}

const mockAircraft: Aircraft[] = [
  {
    id: "1",
    callsign: "UAL123",
    altitude: 35000,
    speed: 450,
    heading: 270,
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    id: "2",
    callsign: "BAW456",
    altitude: 28000,
    speed: 420,
    heading: 90,
    lat: 51.4700,
    lon: -0.4543,
  },
];

export const AircraftList = ({ onSelect }: { onSelect: (aircraft: Aircraft) => void }) => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulating real-time updates
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
            <th>Altitude</th>
            <th>Speed</th>
            <th>Heading</th>
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
                <Plane size={16} />
                {a.callsign}
              </td>
              <td>{a.altitude} ft</td>
              <td>{a.speed} kts</td>
              <td>{a.heading}°</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
