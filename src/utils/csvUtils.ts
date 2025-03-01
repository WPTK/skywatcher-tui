
import config from '@/config/appConfig';
import { toast } from "@/components/ui/use-toast";

/**
 * Fetches and parses a CSV file from the given path
 * @param filePath Path to the CSV file
 * @returns Array of records parsed from the CSV
 */
export const fetchCSV = async (filePath: string): Promise<Record<string, string>[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',').map(v => v.trim());
        const record: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        return record;
      });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    toast({
      title: "CSV Data Error",
      description: `Failed to load data from ${filePath}. Check console for details.`,
      variant: "destructive"
    });
    return [];
  }
};

// Define interface types to match the CSV structure
interface AircraftModel {
  model: string;
  IATA: string;
  ICAO: string;
}

interface Airline {
  airlinename: string;
  IATA: string;
  icao: string;
}

// Map to store aircraft data (ICAO code to model/info)
export const aircraftModelsMap = new Map<string, AircraftModel>();

// Map to store airline data (ICAO code to airline info)
export const airlinesMap = new Map<string, Airline>();

/**
 * Initializes data maps by loading CSV files
 * - Aircraft models data contains model names, ICAO and IATA codes
 * - Airlines data contains airline names and codes
 * 
 * CSV files should be placed in the public folder:
 * - public/aircraft-models.csv (or public/tracker/aircraft-models.csv in production)
 * - public/airlines.csv (or public/tracker/airlines.csv in production)
 */
export const initializeDataMaps = async () => {
  try {
    console.log("Loading CSV data from:", config.csvPaths);
    
    // Load aircraft models
    const aircraftModels = await fetchCSV(config.csvPaths.aircraftModels);
    let aircraftCount = 0;
    
    aircraftModels.forEach(record => {
      if (record.ICAO) {
        // Create a properly typed AircraftModel object
        const model: AircraftModel = {
          model: record.model || 'Unknown',
          IATA: record.IATA || '',
          ICAO: record.ICAO || ''
        };
        
        aircraftModelsMap.set(record.ICAO, model);
        aircraftCount++;
      }
    });
    
    // Load airlines
    const airlines = await fetchCSV(config.csvPaths.airlines);
    let airlineCount = 0;
    
    airlines.forEach(record => {
      if (record.icao) {
        // Create a properly typed Airline object
        const airline: Airline = {
          airlinename: record.airlinename || 'Unknown',
          IATA: record.IATA || '',
          icao: record.icao || ''
        };
        
        airlinesMap.set(record.icao, airline);
        airlineCount++;
      }
    });
    
    console.log(`Successfully loaded ${aircraftCount} aircraft models and ${airlineCount} airlines`);
    
    if (aircraftCount === 0 || airlineCount === 0) {
      toast({
        title: "Warning: Missing Data",
        description: "Aircraft or airline data couldn't be loaded. Some features may not work correctly.",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('Error initializing data maps:', error);
    toast({
      title: "Data Loading Error",
      description: "Failed to load aircraft and airline data. Check console for details.",
      variant: "destructive"
    });
  }
};
