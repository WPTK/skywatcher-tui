
import { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { AircraftList } from "@/components/AircraftList";
import { AircraftDetail } from "@/components/AircraftDetail";
import { StatusBar } from "@/components/StatusBar";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";

export interface Aircraft {
  id: string;
  callsign: string;
  altitude: number;
  previousAltitude?: number;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
  type: string;
  isMilitary: boolean;
  owner?: string;
}

const Index = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 51.5074, lon: -0.1278 }); // Default to London

  const content = (
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

  return (
    <UserPreferencesProvider>
      {content}
    </UserPreferencesProvider>
  );
};

export default Index;
