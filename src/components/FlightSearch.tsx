import React, { useState } from "react";

interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
  flightNumber?: string;
}

interface FlightSearchProps {
  onSearch: (data: SearchData) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState<"route" | "flightNumber">("route");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getCoordinates = async (location: string): Promise<[number, number] | null> => {
    const locations: Record<string, [number, number]> = {
      kathmandu: [27.7172, 85.324],
      delhi: [28.6139, 77.209],
      mumbai: [19.076, 72.8777],
      bangkok: [13.7563, 100.5018],
      singapore: [1.3521, 103.8198],
      dubai: [25.2048, 55.2708],
    };
    return locations[location.toLowerCase()] || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (searchType === "route") {
        if (!from.trim() || !to.trim()) return;
        
        const fromCoords = await getCoordinates(from.trim());
        const toCoords = await getCoordinates(to.trim());

        onSearch({
          from: from.trim(),
          to: to.trim(),
          fromCoords: fromCoords || undefined,
          toCoords: toCoords || undefined
        });
      } else {
        if (!flightNumber.trim()) return;
        onSearch({ flightNumber: flightNumber.trim().toUpperCase() });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Search Flights</h2>
      
      <div className="flex mb-4 border-b">
        <button
          className={`flex-1 py-2 font-medium ${searchType === "route" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setSearchType("route")}
        >
          Route
        </button>
        <button
          className={`flex-1 py-2 font-medium ${searchType === "flightNumber" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setSearchType("flightNumber")}
        >
          Flight Number
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
        {searchType === "route" ? (
          <>
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                id="from"
                type="text"
                placeholder="e.g., Kathmandu, Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                id="to"
                type="text"
                placeholder="e.g., Bangkok, Singapore"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Flight Number
            </label>
            <input
              id="flightNumber"
              type="text"
              placeholder="e.g., CA2451, AI101"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {searchType === "route" 
          ? "Try: Kathmandu, Delhi, Mumbai, Bangkok"
          : "Try: CA2451, AI101, EK512"}
      </div>
    </div>
  );
};

export default FlightSearch;