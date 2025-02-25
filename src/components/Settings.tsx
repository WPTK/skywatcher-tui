
import React from 'react';
import { Settings2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const SettingsMenu = () => {
  const { preferences, toggleVisualEffect, setLocation, toggleMetric } = useUserPreferences();

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lat = parseFloat(formData.get('lat') as string);
    const lon = parseFloat(formData.get('lon') as string);
    if (!isNaN(lat) && !isNaN(lon)) {
      setLocation(lat, lon);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed top-4 right-4 p-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
          <Settings2 className="text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-primary">Terminal Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="text-primary mb-2">Visual Effects</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="scanlines">Scanlines</Label>
                <Switch
                  id="scanlines"
                  checked={preferences.visualEffects.scanlines}
                  onCheckedChange={() => toggleVisualEffect('scanlines')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="textGlow">Text Glow</Label>
                <Switch
                  id="textGlow"
                  checked={preferences.visualEffects.textGlow}
                  onCheckedChange={() => toggleVisualEffect('textGlow')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="screenFlicker">Screen Flicker</Label>
                <Switch
                  id="screenFlicker"
                  checked={preferences.visualEffects.screenFlicker}
                  onCheckedChange={() => toggleVisualEffect('screenFlicker')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cursorBlink">Cursor Blink</Label>
                <Switch
                  id="cursorBlink"
                  checked={preferences.visualEffects.cursorBlink}
                  onCheckedChange={() => toggleVisualEffect('cursorBlink')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-primary mb-2">Location Settings</div>
            <form onSubmit={handleLocationChange} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    defaultValue={preferences.location.lat}
                    className="w-full bg-background border border-primary/50 rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lon">Longitude</Label>
                  <input
                    id="lon"
                    name="lon"
                    type="number"
                    step="any"
                    defaultValue={preferences.location.lon}
                    className="w-full bg-background border border-primary/50 rounded px-2 py-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded transition-colors"
              >
                Update Location
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="text-primary mb-2">Unit Settings</div>
            <div className="flex items-center justify-between">
              <Label htmlFor="metric">Use Metric Units</Label>
              <Switch
                id="metric"
                checked={preferences.useMetric}
                onCheckedChange={toggleMetric}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
