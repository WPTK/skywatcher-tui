
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface UserPreferences {
  location: {
    lat: number;
    lon: number;
  };
  useMetric: boolean;
  favoriteCallsigns: string[];
  theme: {
    enableCRT: boolean;
    enableScanlines: boolean;
    enableFlicker: boolean;
    terminalTheme: 'modern' | 'amber' | 'green' | 'blue';
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setLocation: (lat: number, lon: number) => void;
  toggleMetric: () => void;
  toggleFavorite: (callsign: string) => void;
  updateTheme: (theme: Partial<UserPreferences['theme']>) => void;
}

// Default preferences if none are saved
const defaultPreferences: UserPreferences = {
  location: { lat: 30.802, lon: -81.6159828 }, // Default coordinates
  useMetric: false,
  favoriteCallsigns: [],
  theme: {
    enableCRT: false,
    enableScanlines: false,
    enableFlicker: false,
    terminalTheme: 'modern',
  },
};

// Local storage key for persisting preferences
const STORAGE_KEY = 'skyradar-user-preferences';

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

/**
 * Provider component for user preferences
 * - Loads preferences from localStorage on initial render
 * - Persists any preference changes to localStorage
 */
export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or use defaults
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const savedPrefs = localStorage.getItem(STORAGE_KEY);
      return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
    } catch (error) {
      console.error('Error loading saved preferences:', error);
      return defaultPreferences;
    }
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [preferences]);

  const setLocation = (lat: number, lon: number) => {
    setPreferences(prev => ({
      ...prev,
      location: { lat, lon },
    }));
    toast({
      title: "Location Updated",
      description: `New coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    });
  };

  const toggleMetric = () => {
    setPreferences(prev => ({
      ...prev,
      useMetric: !prev.useMetric,
    }));
  };

  const toggleFavorite = (callsign: string) => {
    setPreferences(prev => {
      const newFavorites = prev.favoriteCallsigns.includes(callsign)
        ? prev.favoriteCallsigns.filter(cs => cs !== callsign)
        : [...prev.favoriteCallsigns, callsign];
      
      return {
        ...prev,
        favoriteCallsigns: newFavorites,
      };
    });
  };

  const updateTheme = (theme: Partial<UserPreferences['theme']>) => {
    setPreferences(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ preferences, setLocation, toggleMetric, toggleFavorite, updateTheme }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
