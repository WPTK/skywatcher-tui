
import { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { AircraftList } from "@/components/AircraftList";
import { AircraftDetail } from "@/components/AircraftDetail";
import { StatusBar } from "@/components/StatusBar";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

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
  // New properties
  airline?: string;
  airlineCode?: string;
  model?: string;
  modelCode?: string;
  category?: string;
}

const Index = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const { preferences } = useUserPreferences();

  const getThemeClasses = () => {
    const classes = [
      preferences.theme.enableCRT ? 'crt-effect' : '',
      preferences.theme.enableScanlines ? 'scanlines' : '',
      preferences.theme.enableFlicker ? 'screen-flicker' : '',
      `theme-${preferences.theme.terminalTheme}`
    ].filter(Boolean).join(' ');
    
    return classes;
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${getThemeClasses()}`}>
      <div className="terminal-window min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <TerminalHeader />
          <Link
            to="/preferences"
            className="text-primary hover:text-primary/80 flex items-center gap-2"
          >
            <Settings size={16} />
            Settings
          </Link>
        </div>
        <AircraftList 
          onSelect={setSelectedAircraft} 
          userLocation={preferences.location}
        />
      </div>
      <AircraftDetail 
        aircraft={selectedAircraft} 
        onClose={() => setSelectedAircraft(null)} 
        userLocation={preferences.location}
      />
      <StatusBar />
    </div>
  );
};

export default Index;
