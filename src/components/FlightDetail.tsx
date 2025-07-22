import React from "react";

interface FlightDetailsProps {
  searchData?: any;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ searchData }) => {
  if (!searchData) {
    return (
      <div className="text-center py-20 text-gray-600">
        <div className="text-6xl mb-4">✈️</div>
        <h2 className="text-2xl font-semibold mb-4">Flight Information</h2>
        <p className="text-lg">
          Enter a flight number or route above to see flight details
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Try searching for popular flights like
              "AA123" or routes like "JFK to LAX"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🔍</span>
        Search Results
      </h2>

      {searchData.type === "flight" ? (
        <div className="space-y-6">
          {/* Flight Number Display */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">
                  Flight {searchData.flightNumber}
                </h3>
                <p className="text-blue-700 mt-1">
                  📡 Searching for real-time flight information...
                </p>
              </div>
              <div className="text-3xl">✈️</div>
            </div>
          </div>

          {/* Flight Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-green-600 font-medium">Tracking Active</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">Next Update</h4>
              <p className="text-gray-600">⏱️ In 30 seconds</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">Data Source</h4>
              <p className="text-gray-600">🛰️ Live API</p>
            </div>
          </div>

          {/* Placeholder for actual flight data */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-600">⚠️</span>
              <h4 className="font-semibold text-yellow-800">
                Development Notice
              </h4>
            </div>
            <p className="text-yellow-700 text-sm">
              This is a demo interface. In production, this would display:
              departure/arrival times, gate information, aircraft type, current
              position, etc.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Route Display */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Route: {searchData.from} → {searchData.to}
                </h3>
                <p className="text-green-700 mt-1">
                  🛫 Searching for available flights on this route...
                </p>
              </div>
              <div className="text-3xl">🗺️</div>
            </div>
          </div>

          {/* Route Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">
                Available Flights
              </h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <p className="text-blue-600 font-medium">Searching...</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">Best Times</h4>
              <p className="text-gray-600">📊 Analyzing routes...</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-2">Airlines</h4>
              <p className="text-gray-600">🏢 Loading carriers...</p>
            </div>
          </div>

          {/* Placeholder for route data */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">ℹ️</span>
              <h4 className="font-semibold text-blue-800">Route Information</h4>
            </div>
            <p className="text-blue-700 text-sm">
              In production, this would show: available flights, schedules,
              airlines, prices, average flight time, and route popularity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
