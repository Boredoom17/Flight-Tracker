import React, { useState, useEffect } from "react";
import Header from "./Header";
import MapView from "./MapView";
import FlightSearch from "./FlightSearch";
import Footer from "./Footer";
import "leaflet/dist/leaflet.css";
import { fetchLivePlanes } from "../utils/fetchPlanes";

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

const Home: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [livePlanes, setLivePlanes] = useState<Plane[]>([]);
  const [isLiveView, setIsLiveView] = useState(false);

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
          altitude: state[7]
        }));
        setLivePlanes(planes);
      } catch (error) {
        console.error("Error fetching planes:", error);
      }
    };

    if (isLiveView) {
      loadPlanes();
      const interval = setInterval(loadPlanes, 10000);
      return () => clearInterval(interval);
    }
  }, [isLiveView]);

  const handleShowMap = () => {
    setShowMap(true);
    setIsLiveView(false);
    setTimeout(() => {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLiveView = () => {
    setShowMap(true);
    setIsLiveView(true);
    setTimeout(() => {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setShowMap(true);
    setIsLiveView(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header onShowMap={handleShowMap} onLiveView={handleLiveView} />

      {showMap && (
        <section id="map" className="w-full h-[calc(100vh-80px)] bg-white">
          <MapView 
            searchData={searchData} 
            livePlanes={isLiveView ? livePlanes : []} 
            isLiveView={isLiveView}
          />
        </section>
      )}

      {!isLiveView && (
        <main className="max-w-6xl mx-auto px-4 py-10">
          <FlightSearch onSearch={handleSearch} />
        </main>
      )}

      {!isLiveView && (
        <>
          <section className="bg-white py-20 px-4 text-center shadow-inner">
            <h2 className="text-3xl font-bold mb-4">Data Center</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flight statistics and analytics will be displayed here.
            </p>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;