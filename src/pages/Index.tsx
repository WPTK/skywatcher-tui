
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

  return (
    <UserPreferencesProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="terminal-window">
          <div className="ascii-border-top text-primary mb-4">
            ╔════════════════════════════════════════════╗
          </div>
          <TerminalHeader />
          <AircraftList onSelect={setSelectedAircraft} userLocation={userLocation} />
          <div className="ascii-border-bottom text-primary mt-4">
            ╚════════════════════════════════════════════╝
          </div>
        </div>
        <AircraftDetail 
          aircraft={selectedAircraft} 
          onClose={() => setSelectedAircraft(null)} 
          userLocation={userLocation}
        />
        <StatusBar />
      </div>
    </UserPreferencesProvider>
  );
};

export default Index;
