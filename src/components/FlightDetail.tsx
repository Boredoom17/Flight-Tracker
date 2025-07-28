import React, { useState, useEffect } from "react";
import {
  fetchFlightDetails,
  fetchRouteFlights,
  FlightDetails as IFlightDetails,
  RouteInfo,
} from "../utils/fetchPlanes";

interface FlightDetailsProps {
  searchData?: any;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ searchData }) => {
  const [flightData, setFlightData] = useState<IFlightDetails | null>(null);
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchData) {
      setFlightData(null);
      setRouteData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (searchData.type === "flight" && searchData.flightNumber) {
          // Fetch flight details by flight number
          const details = await fetchFlightDetails(searchData.flightNumber);
          setFlightData(details);
          setRouteData(null);
        } else if (searchData.from && searchData.to) {
          // Fetch route information
          const route = await fetchRouteFlights(searchData.from, searchData.to);
          setRouteData(route);
          setFlightData(null);
        }
      } catch (err) {
        setError("Failed to fetch flight information. Please try again.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchData]);

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

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🛫</div>
            <h2 className="text-xl font-semibold text-gray-700">
              Loading flight data...
            </h2>
            <p className="text-gray-500 mt-2">Fetching real-time information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow-md">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600">❌</span>
            <h4 className="font-semibold text-red-800">Error</h4>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
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

      {/* Flight Number Results */}
      {searchData.type === "flight" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">
                  Flight {searchData.flightNumber}
                </h3>
                <p className="text-blue-700 mt-1">
                  {flightData ? `${flightData.airline}` : "Flight information"}
                </p>
              </div>
              <div className="text-3xl">✈️</div>
            </div>
          </div>

          {flightData ? (
            <>
              {/* Flight Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        flightData.status === "active"
                          ? "bg-green-500 animate-pulse"
                          : flightData.status === "landed"
                          ? "bg-gray-500"
                          : flightData.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <p
                      className={`font-medium capitalize ${
                        flightData.status === "active"
                          ? "text-green-600"
                          : flightData.status === "landed"
                          ? "text-gray-600"
                          : flightData.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {flightData.status}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">Aircraft</h4>
                  <p className="text-gray-600">
                    {flightData.aircraft_type || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
                  <p className="text-gray-600">
                    ⏱️ {flightData.duration || "N/A"}
                  </p>
                </div>
              </div>

              {/* Departure & Arrival */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span>🛫</span> Departure
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Airport:</strong> {flightData.departure.airport}
                    </p>
                    <p>
                      <strong>Code:</strong> {flightData.departure.iata}
                    </p>
                    <p>
                      <strong>Scheduled:</strong>{" "}
                      {new Date(
                        flightData.departure.scheduled
                      ).toLocaleString()}
                    </p>
                    {flightData.departure.actual && (
                      <p>
                        <strong>Actual:</strong>{" "}
                        {new Date(flightData.departure.actual).toLocaleString()}
                      </p>
                    )}
                    {flightData.departure.gate && (
                      <p>
                        <strong>Gate:</strong> {flightData.departure.gate}
                      </p>
                    )}
                    {flightData.departure.terminal && (
                      <p>
                        <strong>Terminal:</strong>{" "}
                        {flightData.departure.terminal}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span>🛬</span> Arrival
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Airport:</strong> {flightData.arrival.airport}
                    </p>
                    <p>
                      <strong>Code:</strong> {flightData.arrival.iata}
                    </p>
                    <p>
                      <strong>Scheduled:</strong>{" "}
                      {new Date(flightData.arrival.scheduled).toLocaleString()}
                    </p>
                    {flightData.arrival.estimated && (
                      <p>
                        <strong>Estimated:</strong>{" "}
                        {new Date(
                          flightData.arrival.estimated
                        ).toLocaleString()}
                      </p>
                    )}
                    {flightData.arrival.gate && (
                      <p>
                        <strong>Gate:</strong> {flightData.arrival.gate}
                      </p>
                    )}
                    {flightData.arrival.terminal && (
                      <p>
                        <strong>Terminal:</strong> {flightData.arrival.terminal}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <h4 className="font-semibold text-yellow-800">
                  Flight Not Found
                </h4>
              </div>
              <p className="text-yellow-700 text-sm">
                No information found for flight {searchData.flightNumber}.
                Please check the flight number and try again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Route Results */}
      {searchData.type !== "flight" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Route: {searchData.from} → {searchData.to}
                </h3>
                <p className="text-green-700 mt-1">
                  {routeData
                    ? `${routeData.flights.length} flights found`
                    : "Searching for flights..."}
                </p>
              </div>
              <div className="text-3xl">🗺️</div>
            </div>
          </div>

          {routeData ? (
            <>
              {/* Route Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Flights Today
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {routeData.flights.length}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">Airlines</h4>
                  <p className="text-gray-600">
                    {routeData.airlines.join(", ")}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Avg Duration
                  </h4>
                  <p className="text-gray-600">
                    ⏱️ {routeData.average_duration}
                  </p>
                </div>
              </div>

              {/* Flight List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  Available Flights
                </h4>
                {routeData.flights.slice(0, 5).map((flight, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-lg">
                          {flight.flight_number}
                        </h5>
                        <p className="text-gray-600">{flight.airline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(
                            flight.departure.scheduled
                          ).toLocaleTimeString()}{" "}
                          →
                          {new Date(
                            flight.arrival.scheduled
                          ).toLocaleTimeString()}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            flight.status === "active"
                              ? "bg-green-100 text-green-800"
                              : flight.status === "landed"
                              ? "bg-gray-100 text-gray-800"
                              : flight.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {flight.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <h4 className="font-semibold text-yellow-800">
                  No Flights Found
                </h4>
              </div>
              <p className="text-yellow-700 text-sm">
                No flights found for the route {searchData.from} →{" "}
                {searchData.to}. Please check the airport codes and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
