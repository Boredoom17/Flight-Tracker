// Enhanced API utilities for flight tracking
export interface Plane {
  icao24: string;
  callsign?: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  velocity?: number;
  altitude?: number;
  heading?: number;
  vertical_rate?: number;
  on_ground?: boolean;
}

export interface FlightDetails {
  flight_number: string;
  airline: string;
  aircraft_type?: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
  };
  status: string;
  duration?: string;
}

export interface RouteInfo {
  flights: FlightDetails[];
  route_distance?: number;
  average_duration?: string;
  airlines: string[];
}

// Your existing OpenSky function - enhanced
export async function fetchLivePlanes(bounds?: {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}): Promise<Plane[]> {
  try {
    let url = "https://opensky-network.org/api/states/all";

    // Add bounding box for better performance (like FlightRadar24)
    if (bounds) {
      url += `?lamin=${bounds.lamin}&lomin=${bounds.lomin}&lamax=${bounds.lamax}&lomax=${bounds.lomax}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.states) {
      return [];
    }

    return data.states
      .filter(
        (state: any[]) =>
          state[5] !== null && // longitude
          state[6] !== null && // latitude
          !state[8] // not on ground (optional filter)
      )
      .map((state: any[]) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || null,
        origin_country: state[2],
        longitude: state[5],
        latitude: state[6],
        altitude: state[7],
        on_ground: state[8],
        velocity: state[9],
        heading: state[10],
        vertical_rate: state[11],
      }));
  } catch (error) {
    console.error("Error fetching live planes:", error);
    throw error;
  }
}

// NEW: Fetch specific flight details by flight number
export async function fetchFlightDetails(
  flightNumber: string
): Promise<FlightDetails | null> {
  try {
    // Using AviationStack API (you'll need to get a free API key)
    const API_KEY = "e3324d758afed7af5f1098105abf71ad"; // Replace with your key
    const response = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}&limit=1`
    );

    if (!response.ok) {
      throw new Error(`AviationStack API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const flight = data.data[0];
    return {
      flight_number: flight.flight.iata || flight.flight.icao,
      airline: flight.airline.name,
      aircraft_type: flight.aircraft?.registration,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        estimated: flight.departure.estimated,
        actual: flight.departure.actual,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate,
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        estimated: flight.arrival.estimated,
        actual: flight.arrival.actual,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate,
      },
      status: flight.flight_status,
      duration: flight.flight.duration,
    };
  } catch (error) {
    console.error("Error fetching flight details:", error);

    // Fallback: Try OpenSky for basic info
    try {
      const openSkyData = await fetchFlightFromOpenSky(flightNumber);
      return openSkyData;
    } catch (fallbackError) {
      console.error("OpenSky fallback also failed:", fallbackError);
      return null;
    }
  }
}

// NEW: Fetch route information
export async function fetchRouteFlights(
  from: string,
  to: string,
  date?: string
): Promise<RouteInfo | null> {
  try {
    const API_KEY = "e3324d758afed7af5f1098105abf71ad";
    const searchDate = date || new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${from}&arr_iata=${to}&flight_date=${searchDate}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`Route API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const flights = data.data.map((flight: any) => ({
      flight_number: flight.flight.iata || flight.flight.icao,
      airline: flight.airline.name,
      aircraft_type: flight.aircraft?.registration,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        estimated: flight.departure.estimated,
        actual: flight.departure.actual,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate,
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        estimated: flight.arrival.estimated,
        actual: flight.arrival.actual,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate,
      },
      status: flight.flight_status,
      duration: flight.flight.duration,
    }));

    const uniqueAirlines = [...new Set(flights.map((f) => f.airline))];

    return {
      flights,
      airlines: uniqueAirlines,
      route_distance: data.data[0]?.distance,
      average_duration: calculateAverageDuration(flights),
    };
  } catch (error) {
    console.error("Error fetching route flights:", error);
    return null;
  }
}

// NEW: OpenSky fallback for flight details
async function fetchFlightFromOpenSky(
  callsign: string
): Promise<FlightDetails | null> {
  try {
    const response = await fetch(
      `https://opensky-network.org/api/states/all?icao24=${callsign.toLowerCase()}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.states || data.states.length === 0) return null;

    const state = data.states[0];

    // Basic info from OpenSky (limited compared to AviationStack)
    return {
      flight_number: callsign,
      airline: "Unknown",
      departure: {
        airport: "Unknown",
        iata: "N/A",
        scheduled: "N/A",
      },
      arrival: {
        airport: "Unknown",
        iata: "N/A",
        scheduled: "N/A",
      },
      status: state[8] ? "On Ground" : "In Flight",
    } as FlightDetails;
  } catch (error) {
    return null;
  }
}

// Helper function
function calculateAverageDuration(flights: FlightDetails[]): string {
  const durations = flights
    .map((f) => f.duration)
    .filter((d) => d && d !== "N/A")
    .map((d) => parseInt(d!));

  if (durations.length === 0) return "N/A";

  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  const hours = Math.floor(average / 60);
  const minutes = average % 60;

  return `${hours}h ${minutes}m`;
}

// NEW: Get airport coordinates for route mapping
export async function getAirportCoords(
  iataCode: string
): Promise<[number, number] | null> {
  // Common airports database (can be expanded)
  const airports: Record<string, [number, number]> = {
    // Major hubs
    JFK: [40.6413, -73.7781],
    LAX: [33.9425, -118.4081],
    LHR: [51.47, -0.4543],
    CDG: [49.0097, 2.5479],
    DXB: [25.2532, 55.3657],
    NRT: [35.7647, 140.3864],
    SIN: [1.3644, 103.9915],
    BKK: [13.69, 100.7501],

    // Your existing locations
    KTM: [27.6966, 85.3591], // Kathmandu
    DEL: [28.5562, 77.1], // Delhi
    BOM: [19.0896, 72.8656], // Mumbai

    // Add more as needed...
  };

  const coords = airports[iataCode.toUpperCase()];
  if (coords) return coords;

  // If not in our database, you could call an airport API here
  // For now, return null
  return null;
}

// NEW: Error handling wrapper
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  errorMessage: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
}
