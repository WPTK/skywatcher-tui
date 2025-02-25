
import React, { createContext, useContext, useState } from 'react';

interface UserPreferences {
  location: {
    lat: number;
    lon: number;
  };
  useMetric: boolean;
  favoriteCallsigns: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setLocation: (lat: number, lon: number) => void;
  toggleMetric: () => void;
  toggleFavorite: (callsign: string) => void;
}

const defaultPreferences: UserPreferences = {
  location: { lat: 51.5074, lon: -0.1278 }, // Default to London
  useMetric: false,
  favoriteCallsigns: [],
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const setLocation = (lat: number, lon: number) => {
    setPreferences(prev => ({
      ...prev,
      location: { lat, lon },
    }));
  };

  const toggleMetric = () => {
    setPreferences(prev => ({
      ...prev,
      useMetric: !prev.useMetric,
    }));
  };

  const toggleFavorite = (callsign: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCallsigns: prev.favoriteCallsigns.includes(callsign)
        ? prev.favoriteCallsigns.filter(cs => cs !== callsign)
        : [...prev.favoriteCallsigns, callsign],
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, setLocation, toggleMetric, toggleFavorite }}>
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
