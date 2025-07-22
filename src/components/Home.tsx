import React, { useState } from "react";
import Header from "./Header";
import MapView from "./MapView";
import FlightSearch from "./FlightSearch";
import FlightDetails from "./FlightDetails";
import Footer from "./Footer";

const Home: React.FC = () => {
  const [searchData, setSearchData] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  // Allow Header to trigger map visibility
  const handleShowMap = () => {
    setShowMap(true);
    // Smooth scroll to map section
    setTimeout(() => {
      const el = document.getElementById("map");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100); // delay to ensure map appears before scrolling
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header onShowMap={handleShowMap} />

      {/* Conditionally show map */}
      {showMap && (
        <section id="map" className="w-full h-[400px]">
          <MapView searchData={searchData} />
        </section>
      )}

      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">
        <FlightSearch onSearch={setSearchData} />
        <FlightDetails />
      </main>

      <section
        id="data-center"
        className="bg-white py-20 px-4 text-center shadow-inner"
      >
        <h2 className="text-3xl font-bold mb-4">Data Center</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Display flight stats, live trends, and visualizations here.
        </p>
      </section>

      <section
        id="about"
        className="bg-gray-50 py-20 px-4 text-center border-t border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This live flight tracker is built using React, TypeScript,
          TailwindCSS, and Leaflet.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
