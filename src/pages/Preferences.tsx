
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Monitor, MapPin, Tv, Film } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const Preferences = () => {
  const navigate = useNavigate();
  const { preferences, setLocation, toggleMetric, updateTheme } = useUserPreferences();
  const [lat, setLat] = useState(preferences.location.lat.toString());
  const [lon, setLon] = useState(preferences.location.lon.toString());

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(parseFloat(lat), parseFloat(lon));
  };

  const handleThemeChange = (key: keyof typeof preferences.theme, value: boolean | string) => {
    updateTheme({ [key]: value });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                    Latitude
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
                    Longitude
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
                className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
              >
                Update Location
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
                    onChange={(e) => handleThemeChange('terminalTheme', e.target.value)}
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
