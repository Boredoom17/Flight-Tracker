import React, { useState, useEffect } from "react";
import Header from "./Header";
import FlightSearchForm from "./FlightSearch"; // Import the search form component
import MapView from "./MapView";
import { fetchLivePlanes } from "../utils/fetchPlanes";
import "leaflet/dist/leaflet.css";

interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
  flightNumber?: string;
}

interface Plane {
  icao24: string;
  callsign?: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  velocity?: number;
  altitude?: number;
}

const SearchOnlyMap: React.FC = () => {
  const [livePlanes, setLivePlanes] = useState<Plane[]>([]);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  useEffect(() => {
    const loadPlanes = async () => {
      try {
        const data = await fetchLivePlanes();
        const planes = data.map((state: any) => ({
          icao24: state[0],
          callsign: state[1]?.trim(),
          origin_country: state[2],
          longitude: state[5],
          latitude: state[6],
          velocity: state[9],
          altitude: state[7],
        }));
        setLivePlanes(planes);
      } catch (error) {
        console.error("Error fetching planes:", error);
      }
    };

    loadPlanes();
    const interval = setInterval(loadPlanes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <FlightSearchForm onSearch={handleSearch} />{" "}
        {/* Use the form component */}
      </main>
      <section id="map" className="w-full h-[calc(100vh-80px)] bg-white">
        <MapView
          searchData={searchData}
          livePlanes={livePlanes}
          isLiveView={true}
        />
      </section>
    </div>
  );
};

export default SearchOnlyMap;
