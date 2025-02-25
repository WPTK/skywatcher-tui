
import { X } from "lucide-react";

interface Aircraft {
  id: string;
  callsign: string;
  altitude: number;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
}

export const AircraftDetail = ({
  aircraft,
  onClose,
}: {
  aircraft: Aircraft | null;
  onClose: () => void;
}) => {
  if (!aircraft) return null;

  return (
    <div className={`aircraft-detail ${!aircraft ? "closed" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-primary font-bold">{aircraft.callsign}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground">Position</div>
          <div>{`${aircraft.lat.toFixed(4)}°N, ${aircraft.lon.toFixed(4)}°E`}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Altitude</div>
          <div>{aircraft.altitude} ft</div>
        </div>
        <div>
          <div className="text-muted-foreground">Speed</div>
          <div>{aircraft.speed} kts</div>
        </div>
        <div>
          <div className="text-muted-foreground">Heading</div>
          <div>{aircraft.heading}°</div>
        </div>
      </div>
    </div>
  );
};
