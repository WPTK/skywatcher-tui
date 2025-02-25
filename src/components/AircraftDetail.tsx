
import { X } from "lucide-react";
import type { Aircraft } from "@/pages/Index";

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
  if (!aircraft) return null;

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    aircraft.lat,
    aircraft.lon
  );

  return (
    <div className={`aircraft-detail ${!aircraft ? "closed" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-primary font-bold">
          {aircraft.callsign} 
          {aircraft.isMilitary && <span className="text-red-500 ml-2">(Military)</span>}
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground">Type</div>
          <div>{aircraft.type}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Position</div>
          <div>{`${aircraft.lat.toFixed(4)}°N, ${aircraft.lon.toFixed(4)}°E`}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Distance</div>
          <div>{distance.toFixed(1)} mi</div>
        </div>
        <div>
          <div className="text-muted-foreground">Altitude</div>
          <div>{aircraft.altitude} ft</div>
        </div>
        <div>
          <div className="text-muted-foreground">Speed</div>
          <div>{Math.round(aircraft.speed * 1.15)} mph</div>
        </div>
        <div>
          <div className="text-muted-foreground">Heading</div>
          <div>{aircraft.heading}°</div>
        </div>
      </div>
    </div>
  );
};
