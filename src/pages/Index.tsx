
import { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { AircraftList } from "@/components/AircraftList";
import { AircraftDetail } from "@/components/AircraftDetail";
import { StatusBar } from "@/components/StatusBar";

export interface Aircraft {
  id: string;
  callsign: string;
  altitude: number;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
  type: string;
  isMilitary: boolean;
}

const Index = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 51.5074, lon: -0.1278 }); // Default to London

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="terminal-window min-h-screen">
        <TerminalHeader />
        <AircraftList onSelect={setSelectedAircraft} userLocation={userLocation} />
      </div>
      <AircraftDetail 
        aircraft={selectedAircraft} 
        onClose={() => setSelectedAircraft(null)} 
        userLocation={userLocation}
      />
      <StatusBar />
    </div>
  );
};

export default Index;
