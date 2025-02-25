
import { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { AircraftList } from "@/components/AircraftList";
import { AircraftDetail } from "@/components/AircraftDetail";
import { StatusBar } from "@/components/StatusBar";

interface Aircraft {
  id: string;
  callsign: string;
  altitude: number;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
}

const Index = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="terminal-window min-h-screen">
        <TerminalHeader />
        <AircraftList onSelect={setSelectedAircraft} />
      </div>
      <AircraftDetail aircraft={selectedAircraft} onClose={() => setSelectedAircraft(null)} />
      <StatusBar />
    </div>
  );
};

export default Index;
