
// Function to fetch and parse a CSV file
export const fetchCSV = async (filePath: string): Promise<Record<string, any>[]> => {
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
        const record: Record<string, any> = {};
        
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

// Map to store aircraft data (ICAO code to model/info)
export const aircraftModelsMap = new Map<string, { model: string, IATA: string, ICAO: string }>();

// Map to store airline data (ICAO code to airline info)
export const airlinesMap = new Map<string, { airlinename: string, IATA: string, icao: string }>();

// Function to initialize the data maps
export const initializeDataMaps = async () => {
  try {
    // Load aircraft models
    const aircraftModels = await fetchCSV('/aircraft-models.csv');
    aircraftModels.forEach(model => {
      if (model.ICAO) {
        aircraftModelsMap.set(model.ICAO, model);
      }
    });
    
    // Load airlines
    const airlines = await fetchCSV('/airlines.csv');
    airlines.forEach(airline => {
      if (airline.icao) {
        airlinesMap.set(airline.icao, airline);
      }
    });
    
    console.log(`Loaded ${aircraftModelsMap.size} aircraft models and ${airlinesMap.size} airlines`);
  } catch (error) {
    console.error('Error initializing data maps:', error);
  }
};
