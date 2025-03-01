
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Monitor, MapPin, Tv, Film, Save, Compass } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { toast } from "@/components/ui/use-toast";

/**
 * User preferences page
 * Allows configuring:
 * - Location coordinates
 * - Maximum radius for aircraft display
 * - Unit preferences (metric/imperial)
 * - Terminal theme and CRT effects
 */
const Preferences = () => {
  const navigate = useNavigate();
  const { preferences, setLocation, setMaxRadius, toggleMetric, updateTheme, getThemeClass } = useUserPreferences();
  const [lat, setLat] = useState(preferences.location.lat.toString());
  const [lon, setLon] = useState(preferences.location.lon.toString());
  const [radius, setRadius] = useState(preferences.maxRadius.toString());

  // Get theme classes
  const themeClasses = getThemeClass();

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate coordinates
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid numbers for latitude and longitude",
        variant: "destructive",
      });
      return;
    }
    
    if (latNum < -90 || latNum > 90) {
      toast({
        title: "Invalid Latitude",
        description: "Latitude must be between -90 and 90 degrees",
        variant: "destructive",
      });
      return;
    }
    
    if (lonNum < -180 || lonNum > 180) {
      toast({
        title: "Invalid Longitude",
        description: "Longitude must be between -180 and 180 degrees",
        variant: "destructive",
      });
      return;
    }
    
    setLocation(latNum, lonNum);
    toast({
      title: "Location Updated",
      description: `Coordinates saved: ${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`,
    });
  };

  const handleRadiusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate radius
    const radiusNum = parseFloat(radius);
    
    if (isNaN(radiusNum) || radiusNum <= 0) {
      toast({
        title: "Invalid Radius",
        description: "Please enter a positive number for the radius",
        variant: "destructive",
      });
      return;
    }
    
    setMaxRadius(radiusNum);
  };

  const handleThemeChange = (key: keyof typeof preferences.theme, value: boolean | string) => {
    updateTheme({ [key]: value });
    
    // Show feedback for theme changes
    const readableKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('CRT', 'CRT');
      
    toast({
      title: `${readableKey} Updated`,
      description: `New setting: ${typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}`,
    });
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${themeClasses}`}>
      <div className="terminal-window min-h-screen p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Settings size={24} />
            User Preferences
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:text-primary/80"
          >
            Back to Radar
          </button>
        </div>

        <div className="space-y-8">
          {/* Location Settings */}
          <section className="space-y-4">
            <h2 className="text-xl text-primary flex items-center gap-2">
              <MapPin size={20} />
              Location Settings
            </h2>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="latitude" className="text-sm text-muted-foreground">
                    Latitude (-90 to 90)
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-secondary text-foreground p-2 rounded-none border border-border"
                    placeholder="Enter latitude..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="longitude" className="text-sm text-muted-foreground">
                    Longitude (-180 to 180)
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="w-full bg-secondary text-foreground p-2 rounded-none border border-border"
                    placeholder="Enter longitude..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 flex items-center gap-2"
              >
                <Save size={16} />
                Update Location
              </button>
            </form>
          </section>

          {/* Radius Settings */}
          <section className="space-y-4">
            <h2 className="text-xl text-primary flex items-center gap-2">
              <Compass size={20} />
              Radius Settings
            </h2>
            <form onSubmit={handleRadiusSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="radius" className="text-sm text-muted-foreground">
                  Maximum Radius ({preferences.useMetric ? 'kilometers' : 'miles'})
                </label>
                <input
                  id="radius"
                  type="text"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full bg-secondary text-foreground p-2 rounded-none border border-border"
                  placeholder="Enter radius..."
                />
                <p className="text-xs text-muted-foreground">
                  Only aircraft within this distance from your location will be displayed
                </p>
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 flex items-center gap-2"
              >
                <Save size={16} />
                Update Radius
              </button>
            </form>
          </section>

          {/* Display Settings */}
          <section className="space-y-4">
            <h2 className="text-xl text-primary flex items-center gap-2">
              <Monitor size={20} />
              Display Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.useMetric}
                  onChange={toggleMetric}
                  className="form-checkbox text-primary rounded-none border-primary"
                />
                <span>Use Metric Units (km/h, km)</span>
              </label>
            </div>
          </section>

          {/* Terminal Theme Settings */}
          <section className="space-y-4">
            <h2 className="text-xl text-primary flex items-center gap-2">
              <Tv size={20} />
              Terminal Theme
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Terminal Color Theme
                  </label>
                  <select
                    value={preferences.theme.terminalTheme}
                    onChange={(e) => handleThemeChange('terminalTheme', e.target.value as any)}
                    className="w-full bg-secondary text-foreground p-2 rounded-none border border-border"
                  >
                    <option value="modern">Modern</option>
                    <option value="amber">Amber</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* CRT Effects Settings */}
          <section className="space-y-4">
            <h2 className="text-xl text-primary flex items-center gap-2">
              <Film size={20} />
              CRT Effects
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.theme.enableCRT}
                  onChange={(e) => handleThemeChange('enableCRT', e.target.checked)}
                  className="form-checkbox text-primary rounded-none border-primary"
                />
                <span>Enable CRT Effect</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.theme.enableScanlines}
                  onChange={(e) => handleThemeChange('enableScanlines', e.target.checked)}
                  className="form-checkbox text-primary rounded-none border-primary"
                />
                <span>Enable Scanlines</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.theme.enableFlicker}
                  onChange={(e) => handleThemeChange('enableFlicker', e.target.checked)}
                  className="form-checkbox text-primary rounded-none border-primary"
                />
                <span>Enable Screen Flicker</span>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
