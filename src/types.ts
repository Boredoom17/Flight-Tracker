export interface FlightSearchData {
  flightNumber?: string;
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
}

export interface Plane {
  icao24: string;
  callsign?: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  velocity?: number;
  altitude?: number;
}

export interface FlightSearchProps {
  onSearch: (data: FlightSearchData) => void;
  onLiveViewClick?: () => void;
}