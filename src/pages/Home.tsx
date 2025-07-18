import React from "react";
import FlightSearch from "../components/FlightSeearch";
import FlightDetails from "../components/FlightDetails";
import MapView from "../components/MapView";

export default function Home() {
  return (
    <div className="grid grid-cols-3 h-screen">
      {/* Left panel */}
      <div className="col-span-1 p-4 bg-white overflow-y-auto shadow-md">
        <h1 className="text-2xl font-bold mb-4">Flight Tracker</h1>
        <FlightSearch />
        <FlightDetails />
      </div>

      {/* Right panel */}
      <div className="col-span-2">
        <MapView />
      </div>
    </div>
  );
}
