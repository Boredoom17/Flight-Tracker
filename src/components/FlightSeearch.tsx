import React, { useState } from "react";

const FlightSearch: React.FC = () => {
  const [flightNumber, setFlightNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for flight: ${flightNumber}`);
    // Add API logic later
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h2 className="text-3xl font-semibold text-blue-600 mb-6">
        Search Your Flight
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter flight number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          className="p-3 w-72 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;
