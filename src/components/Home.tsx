// src/components/Home.tsx
import React from "react";
import FlightSeearch from "./FlightSeearch";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-16 px-6 space-y-10">
      <h1 className="text-5xl font-bold text-gray-800">
        Welcome to Flight Tracker
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
        Track flights easily by flight number or route. Use the search option
        below to start tracking flights and view their live positions and route
        on the map.
      </p>

      {/* Flight Search UI */}
      <div className="w-full max-w-4xl">
        <FlightSeearch />
      </div>
    </div>
  );
};

export default Home;
