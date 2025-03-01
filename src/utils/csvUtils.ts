
import config from '@/config/appConfig';
import { toast } from "@/components/ui/use-toast";

/**
 * Fetches and parses a CSV file from the given path
 * @param filePath Path to the CSV file
 * @returns Array of records parsed from the CSV
 */
export const fetchCSV = async (filePath: string): Promise<Record<string, string>[]> => {
  try {
    console.log(`Attempting to fetch CSV file from: ${filePath}`);
    const response = await fetch(filePath);
    
    if (!response.ok) {
      const errorMsg = `Failed to fetch CSV: ${response.statusText} (${response.status})`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const text = await response.text();
    // Check if we got HTML instead of CSV (which indicates the file wasn't found)
    if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('<html')) {
      throw new Error(`CSV file not found at ${filePath}. Got HTML instead.`);
    }
    
    const lines = text.split('\n');
    if (lines.length < 2) {
      throw new Error(`CSV file at ${filePath} appears to be empty or malformed.`);
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    console.log(`Successfully loaded CSV headers: ${headers.join(', ')}`);
    
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
      description: `Failed to load data from ${filePath}. Please check that the CSV files are in the correct location: public folder for development or /tracker folder in production.`,
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
 */
export const initializeDataMaps = async () => {
  try {
    console.log("Loading CSV data from:", config.csvPaths);
    console.log("Current environment:", import.meta.env.PROD ? "production" : "development");
    console.log("Make sure CSV files are in the correct location:");
    console.log("- Development: public/aircraft-models.csv and public/airlines.csv");
    console.log("- Production: /tracker/aircraft-models.csv and /tracker/airlines.csv");
    
    // Load aircraft models
    const aircraftModels = await fetchCSV(config.csvPaths.aircraftModels);
    let aircraftCount = 0;
    
    aircraftModels.forEach(record => {
      if (record.ICAO) {
        // Create a properly typed AircraftModel object
        const model = {
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
        const airline = {
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
        description: "Aircraft or airline data couldn't be loaded. Check that the CSV files are in the correct location with proper formatting.",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('Error initializing data maps:', error);
    toast({
      title: "Data Loading Error",
      description: "Failed to load aircraft and airline data. Check console for details and ensure CSV files are in the correct location.",
      variant: "destructive"
    });
  }
};
