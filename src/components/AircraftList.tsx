
import { useEffect, useState } from "react";
import { Plane, ArrowUp, ArrowDown, Navigation2 } from "lucide-react";
import type { Aircraft } from "@/pages/Index";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useQuery } from "@tanstack/react-query";
import { aircraftModelsMap, airlinesMap, initializeDataMaps } from "@/utils/csvUtils";

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

// Function to determine airline from callsign
const getAirlineFromCallsign = (callsign: string): { name: string, icao: string } | null => {
  // Airline codes are usually the first 3 characters of the callsign
  const airlineCode = callsign.trim().substring(0, 3);
  
  // Check if we can find this airline code
  for (const [icao, airline] of airlinesMap.entries()) {
    if (airlineCode === airline.icao) {
      return { name: airline.airlinename, icao };
    }
  }
  
  return null;
};

// Function to extract model designation from type string
const getAircraftTypeInfo = (type: string): { model: string, name: string } => {
  if (aircraftModelsMap.has(type)) {
    const aircraft = aircraftModelsMap.get(type)!;
    return { model: aircraft.ICAO, name: aircraft.model };
  }
  return { model: type, name: "Unknown" };
};

// Function to fetch aircraft data
const fetchAircraftData = async () => {
  try {
    const response = await fetch("http://192.168.3.200/run/readsb/aircraft.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    
    // Transform the data into our Aircraft type format
    if (data && data.aircraft && Array.isArray(data.aircraft)) {
      return data.aircraft.map((a: any) => {
        const callsign = a.flight?.trim() || "N/A";
        const airline = getAirlineFromCallsign(callsign);
        const typeInfo = getAircraftTypeInfo(a.t || "Unknown");
        
        return {
          id: a.hex || String(Math.random()),
          callsign,
          altitude: a.alt_baro || 0,
          previousAltitude: a.alt_baro || 0,
          speed: a.gs || 0, // ground speed
          heading: a.track || 0,
          lat: a.lat || 0,
          lon: a.lon || 0,
          type: a.t || "Unknown",
          isMilitary: a.military === 1 || false,
          owner: a.r || undefined,
          category: a.category || "",
          airline: airline?.name || "Unknown",
          airlineCode: airline?.icao || "",
          model: typeInfo.name,
          modelCode: typeInfo.model
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching aircraft data:", error);
    return [];
  }
};

type SortField = 'distance' | 'altitude' | 'callsign' | 'speed' | 'airline';

export const AircraftList = ({ 
  onSelect,
  userLocation
}: { 
  onSelect: (aircraft: Aircraft) => void;
  userLocation: { lat: number; lon: number };
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('distance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { preferences } = useUserPreferences();
  
  // Initialize CSV data
  useEffect(() => {
    initializeDataMaps();
  }, []);

  // Use react-query to fetch and cache the aircraft data
  const { data: aircraft = [], isLoading, error } = useQuery({
    queryKey: ['aircraftData'],
    queryFn: fetchAircraftData,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const sortedAircraft = [...aircraft]
    .filter((a) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return a.callsign.toLowerCase().includes(term) || 
             a.airline?.toLowerCase().includes(term) || 
             a.model?.toLowerCase().includes(term);
    })
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
        case 'airline':
          return (a.airline || "").localeCompare(b.airline || "") * multiplier;
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
      <div className="flex items-center mb-4">
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          className="terminal-input"
          placeholder="search aircraft, airline, or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading && <div className="text-primary">Loading aircraft data...</div>}
      
      {error && (
        <div className="text-destructive">
          Error loading aircraft data. Check your connection to http://192.168.3.200
        </div>
      )}
      
      {!isLoading && !error && aircraft.length === 0 && (
        <div className="text-primary">No aircraft data available</div>
      )}
      
      {sortedAircraft.length > 0 && (
        <table className="terminal-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('callsign')} className="cursor-pointer hover:text-primary">
                Callsign {sortField === 'callsign' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('airline')} className="cursor-pointer hover:text-primary">
                Airline {sortField === 'airline' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Type</th>
              <th onClick={() => handleSort('altitude')} className="cursor-pointer hover:text-primary">
                Altitude {sortField === 'altitude' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('speed')} className="cursor-pointer hover:text-primary">
                Speed {sortField === 'speed' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('distance')} className="cursor-pointer hover:text-primary">
                Distance {sortField === 'distance' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                <td>{a.airline || "N/A"}</td>
                <td>{a.model || a.type}</td>
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
      )}
    </div>
  );
};
