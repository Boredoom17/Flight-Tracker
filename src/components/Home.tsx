import React from "react";
import Header from "./Header";
import FlightSearch from "./FlightSearch";
import Footer from "./Footer";

const Home: React.FC = () => {
  const handleSearch = (data: any) => {
    console.log("Search data:", data); // Placeholder for search handling
    // You can add navigation to /search with search data if needed
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <FlightSearch onSearch={handleSearch} />
      </main>
      <section className="bg-white py-20 px-4 text-center shadow-inner">
        <h2 className="text-3xl font-bold mb-4">Data Center</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Flight statistics and analytics will be displayed here.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
