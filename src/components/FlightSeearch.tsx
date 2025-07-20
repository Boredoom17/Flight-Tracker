import React, { useState } from "react";

const FlightSearch: React.FC = () => {
  const [flightNumber, setFlightNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching flight: ${flightNumber}`);
    // You can integrate API call here later
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Flight Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter flight number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          style={{ padding: 8, width: 250, marginRight: 10 }}
          required
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Search
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;
