
// Function to fetch and parse a CSV file
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

// Function to initialize the data maps
export const initializeDataMaps = async () => {
  try {
    // Load aircraft models
    const aircraftModels = await fetchCSV('/aircraft-models.csv');
    aircraftModels.forEach(model => {
      if (model.ICAO) {
        // Ensure we're casting the record to the correct interface
        aircraftModelsMap.set(model.ICAO, {
          model: model.model || '',
          IATA: model.IATA || '',
          ICAO: model.ICAO || ''
        });
      }
    });
    
    // Load airlines
    const airlines = await fetchCSV('/airlines.csv');
    airlines.forEach(airline => {
      if (airline.icao) {
        // Ensure we're casting the record to the correct interface
        airlinesMap.set(airline.icao, {
          airlinename: airline.airlinename || '',
          IATA: airline.IATA || '',
          icao: airline.icao || ''
        });
      }
    });
    
    console.log(`Loaded ${aircraftModelsMap.size} aircraft models and ${airlinesMap.size} airlines`);
  } catch (error) {
    console.error('Error initializing data maps:', error);
  }
};
