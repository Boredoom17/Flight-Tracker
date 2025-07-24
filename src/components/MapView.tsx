// src/components/SearchOnlyMap.tsx
import React, { useEffect, useState } from "react";
import Header from "./Header";
import MapView from "./MapView";
import { fetchLivePlanes } from "../utils/fetchPlanes";
import "leaflet/dist/leaflet.css";

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <section id="map" className="w-full h-[calc(100vh-80px)] bg-white">
        <MapView searchData={null} livePlanes={livePlanes} isLiveView={true} />
      </section>
    </div>
  );
};

export default SearchOnlyMap;
