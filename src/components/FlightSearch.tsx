import React, { useState } from "react";

// Define the search data type
interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
}

interface FlightSearchProps {
  onSearch: (data: SearchData) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock coordinate lookup - in real app, you'd use a geocoding API
  const getCoordinates = async (
    location: string
  ): Promise<[number, number] | null> => {
    // Simple mock data for common airports/cities
    const locations: Record<string, [number, number]> = {
      kathmandu: [27.7172, 85.324],
      delhi: [28.6139, 77.209],
      mumbai: [19.076, 72.8777],
      bangkok: [13.7563, 100.5018],
      singapore: [1.3521, 103.8198],
      dubai: [25.2048, 55.2708],
    };

    const key = location.toLowerCase();
    return locations[key] || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;

    setIsLoading(true);

    try {
      const fromCoords = await getCoordinates(from.trim());
      const toCoords = await getCoordinates(to.trim());

      const searchData: SearchData = {
        from: from.trim(),
        to: to.trim(),
        fromCoords: fromCoords || undefined,
        toCoords: toCoords || undefined,
      };

      onSearch(searchData);
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Search Flights</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto"
      >
        <div>
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From
          </label>
          <input
            id="from"
            type="text"
            placeholder="e.g., Kathmandu, Delhi, Mumbai"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To
          </label>
          <input
            id="to"
            type="text"
            placeholder="e.g., Bangkok, Singapore, Dubai"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Try: Kathmandu, Delhi, Mumbai, Bangkok, Singapore, Dubai
      </div>
    </div>
  );
};

export default FlightSearch;
