import { X, Navigation2, ArrowUp, ArrowDown, Star, ExternalLink } from "lucide-react";
import type { Aircraft } from "@/pages/Index";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

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

export const AircraftDetail = ({
  aircraft,
  onClose,
  userLocation,
}: {
  aircraft: Aircraft | null;
  onClose: () => void;
  userLocation: { lat: number; lon: number };
}) => {
  const { preferences, toggleFavorite } = useUserPreferences();
  
  if (!aircraft) return null;

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    aircraft.lat,
    aircraft.lon
  );

  const isFavorite = preferences.favoriteCallsigns.includes(aircraft.callsign);
  
  const adsbExchangeUrl = `https://globe.adsbexchange.com/?icao=${aircraft.id}`;

  return (
    <div className={`aircraft-detail ${!aircraft ? "closed" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-primary font-bold">
            {aircraft.callsign}
            {aircraft.isMilitary && <span className="text-red-500 ml-2">(Military)</span>}
          </h2>
          <button 
            onClick={() => toggleFavorite(aircraft.callsign)}
            className={`text-muted-foreground hover:text-primary ${isFavorite ? 'text-primary' : ''}`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground">ICAO Hex</div>
          <div className="flex items-center gap-2">
            <span>{aircraft.id}</span>
            <a 
              href={adsbExchangeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center"
              title="View on ADSBExchange"
            >
              <ExternalLink size={14} />
              <span className="ml-1">View on ADSBExchange</span>
            </a>
          </div>
        </div>
        {aircraft.airline && (
          <div>
            <div className="text-muted-foreground">Airline</div>
            <div>{aircraft.airline} {aircraft.airlineCode ? `(${aircraft.airlineCode})` : ''}</div>
          </div>
        )}
        <div>
          <div className="text-muted-foreground">Aircraft Type</div>
          <div>{aircraft.model || aircraft.type}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Owner/Operator</div>
          <div>{aircraft.owner || 'Unknown'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Position</div>
          <div>{`${aircraft.lat.toFixed(4)}°N, ${aircraft.lon.toFixed(4)}°E`}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Distance</div>
          <div>{distance.toFixed(1)} {preferences.useMetric ? 'km' : 'mi'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Altitude</div>
          <div className="flex items-center gap-2">
            {aircraft.altitude} ft
            {aircraft.previousAltitude && (
              aircraft.altitude > aircraft.previousAltitude ? (
                <ArrowUp size={14} className="text-primary" />
              ) : aircraft.altitude < aircraft.previousAltitude ? (
                <ArrowDown size={14} className="text-destructive" />
              ) : null
            )}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Speed</div>
          <div>
            {Math.round(aircraft.speed * (preferences.useMetric ? 1.852 : 1.15))} {preferences.useMetric ? 'km/h' : 'mph'}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Heading</div>
          <div className="flex items-center gap-2">
            {aircraft.heading}°
            <Navigation2 
              size={14} 
              className="text-muted-foreground"
              style={{ transform: `rotate(${aircraft.heading}deg)` }}
            />
          </div>
        </div>
        {aircraft.category && (
          <div>
            <div className="text-muted-foreground">Category</div>
            <div>{aircraft.category}</div>
          </div>
        )}
      </div>
    </div>
  );
};
