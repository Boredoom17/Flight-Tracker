// src/components/FlightSearch.tsx
import React, { useState } from "react";

interface FlightSearchProps {
  onSearch: (data: any) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<"flight" | "route">("flight");
  const [flightNumber, setFlightNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchData = {
      type: "flight",
      flightNumber: flightNumber.trim(),
    };

    onSearch(searchData); // Pass data to App
  };

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchData = {
      type: "route",
      from: from.trim(),
      to: to.trim(),
    };

    onSearch(searchData); // Pass data to App
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("flight")}
          className={`flex-1 py-3 font-semibold ${
            activeTab === "flight"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Search by Flight Number
        </button>
        <button
          onClick={() => setActiveTab("route")}
          className={`flex-1 py-3 font-semibold ${
            activeTab === "route"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Search by Route
        </button>
      </div>

      {/* Forms */}
      {activeTab === "flight" ? (
        <form onSubmit={handleFlightSubmit} className="flex gap-4">
          <input
            type="text"
            placeholder="Enter flight number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      ) : (
        <form onSubmit={handleRouteSubmit} className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-grow min-w-[150px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-grow min-w-[150px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      )}
    </div>
  );
};

export default FlightSearch;
