
/**
 * Application configuration
 * 
 * This file centralizes all configuration parameters that might change
 * between environments (development, production, etc.)
 */

interface AppConfig {
  /** Base URL for the readsb API */
  readsbApiUrl: string;
  
  /** Paths to CSV data files */
  csvPaths: {
    aircraftModels: string;
    airlines: string;
  };
  
  /** Refresh interval for aircraft data in milliseconds */
  aircraftRefreshInterval: number;
}

// Development configuration
const devConfig: AppConfig = {
  readsbApiUrl: "http://192.168.3.200/run/readsb",
  csvPaths: {
    // These paths are relative to the public folder
    aircraftModels: "/aircraft-models.csv",
    airlines: "/airlines.csv",
  },
  aircraftRefreshInterval: 5000,
};

// Production configuration
const prodConfig: AppConfig = {
  readsbApiUrl: "/run/readsb", // Relative path when hosted on same server
  csvPaths: {
    // These paths are relative to the web server root
    aircraftModels: "/tracker/aircraft-models.csv",
    airlines: "/tracker/airlines.csv",
  },
  aircraftRefreshInterval: 5000,
};

// Export the appropriate configuration based on environment
const isProd = import.meta.env.PROD;
const config: AppConfig = isProd ? prodConfig : devConfig;

export default config;
