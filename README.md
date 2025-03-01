
# SkyRadar Aircraft Tracking Terminal

A retro-terminal style aircraft tracking application that displays real-time aircraft data from an ADS-B receiver.

## Features

- Real-time tracking of aircraft in your area
- Terminal-style UI with customizable themes (Modern, Amber, Green, Blue)
- Retro CRT effects (scanlines, screen flicker)
- Detailed aircraft information
- Customizable location settings
- Support for both metric and imperial units
- Favorite callsign tracking

## Prerequisites

- A running readsb/dump1090 server accessible via HTTP
- Node.js and npm for development

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Add the required CSV data files (see below)
4. Configure the application for your environment (see Configuration section)
5. Run `npm run build` to build the application
6. Deploy the built files to your web server

## Required CSV Data Files

The application requires two CSV files with specific formats:

### 1. Aircraft Models CSV File

**Development:** Place file at `public/aircraft-models.csv`
**Production:** Place file at `/tracker/aircraft-models.csv` on your web server

This file should contain aircraft model information with the following columns:
- `model`: Full name of the aircraft model (e.g., "Boeing 737-800")
- `IATA`: IATA code for the aircraft (e.g., "738")
- `ICAO`: ICAO type designator (e.g., "B738")

Example content:
```
model,IATA,ICAO
Boeing 737-800,738,B738
Airbus A320,320,A320
Cessna 172,C72,C172
```

### 2. Airlines CSV File

**Development:** Place file at `public/airlines.csv`
**Production:** Place file at `/tracker/airlines.csv` on your web server

This file should contain airline information with the following columns:
- `airlinename`: Full name of the airline (e.g., "American Airlines")
- `IATA`: IATA code for the airline (e.g., "AA")
- `icao`: ICAO code for the airline (e.g., "AAL")

Example content:
```
airlinename,IATA,icao
American Airlines,AA,AAL
Delta Air Lines,DL,DAL
United Airlines,UA,UAL
```

## Configuration

The application can be configured by modifying the `src/config/appConfig.ts` file:

- `readsbApiUrl`: URL to your readsb/dump1090 API
  - Development default: "http://192.168.3.200/run/readsb"
  - Production default: "/run/readsb" (relative path when hosted on same server)
- `csvPaths`: Paths to the CSV data files (see above for details)
- `aircraftRefreshInterval`: How often to refresh aircraft data (in milliseconds)

## Deployment to adsb.cc/tracker

To deploy to adsb.cc/tracker:

1. Build the application with `npm run build`
2. Copy the contents of the `dist` folder to your web server's `/tracker` directory
3. Ensure the CSV files are copied to the correct location:
   - `/tracker/aircraft-models.csv`
   - `/tracker/airlines.csv`
4. If your readsb server is on the same host, consider changing `readsbApiUrl` to a relative path

## Development

- Run `npm run dev` for a development server
- The application will automatically update when you make code changes

## Troubleshooting

If you encounter issues with data not displaying:

1. Check the browser console for errors
2. Verify your readsb/dump1090 server is accessible
3. **CSV File Issues:**
   - Confirm the CSV files are in the correct location (public folder for development)
   - Check that the file names match exactly: `aircraft-models.csv` and `airlines.csv`
   - Verify the CSV files have the correct column headers as described above
   - Make sure the CSV files use proper CSV formatting (commas as separators, no extra spaces)
4. Check that the `readsbApiUrl` in `appConfig.ts` is correctly configured

## License

MIT License
