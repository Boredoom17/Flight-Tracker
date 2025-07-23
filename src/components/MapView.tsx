import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Types
interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: LatLngExpression;
  toCoords?: LatLngExpression;
  flightNumber?: string;
}

interface Plane {
  icao24: string;
  callsign?: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  velocity?: number;
  altitude?: number;
}

interface MapViewProps {
  searchData: SearchData | null;
  livePlanes?: Plane[];
  isLiveView?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  searchData,
  livePlanes = [],
  isLiveView = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const defaultCenter: LatLngExpression = [27.7172, 85.324]; // Kathmandu

  // Fit bounds to show all relevant markers
  useEffect(() => {
    if (mapRef.current) {
      const bounds = new L.LatLngBounds([]);

      // Add default center if no other points exist
      if (
        !searchData?.fromCoords &&
        !searchData?.toCoords &&
        livePlanes.length === 0
      ) {
        bounds.extend(defaultCenter);
      }

      // Add route markers
      if (searchData?.fromCoords) bounds.extend(searchData.fromCoords);
      if (searchData?.toCoords) bounds.extend(searchData.toCoords);

      // Add live planes
      livePlanes.forEach((plane) => {
        if (plane.latitude && plane.longitude) {
          bounds.extend([plane.latitude, plane.longitude]);
        }
      });

      if (!bounds.isValid()) {
        bounds.extend(defaultCenter);
      }

      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [searchData, livePlanes]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        className="h-full w-full"
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Live Flight Markers */}
        {isLiveView &&
          livePlanes.map(
            (plane) =>
              plane.latitude &&
              plane.longitude && (
                <Marker
                  key={plane.icao24}
                  position={[plane.latitude, plane.longitude]}
                >
                  <Popup>
                    <div className="space-y-1">
                      <div>
                        <strong>Flight:</strong> {plane.callsign || "N/A"}
                      </div>
                      <div>
                        <strong>From:</strong> {plane.origin_country}
                      </div>
                      <div>
                        <strong>Altitude:</strong>{" "}
                        {Math.round(plane.altitude || 0)} ft
                      </div>
                      <div>
                        <strong>Speed:</strong>{" "}
                        {Math.round(plane.velocity || 0)} kts
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
          )}

        {/* Route Markers */}
        {!isLiveView && searchData?.fromCoords && (
          <Marker position={searchData.fromCoords}>
            <Popup>{searchData.from || "Departure"}</Popup>
          </Marker>
        )}

        {!isLiveView && searchData?.toCoords && (
          <Marker position={searchData.toCoords}>
            <Popup>{searchData.to || "Destination"}</Popup>
          </Marker>
        )}

        {/* Route Line */}
        {!isLiveView && searchData?.fromCoords && searchData?.toCoords && (
          <Polyline
            positions={[searchData.fromCoords, searchData.toCoords]}
            color="#3b82f6"
            weight={3}
            dashArray="5,5"
          />
        )}

        {/* Default Marker */}
        {!isLiveView && (!searchData?.fromCoords || !searchData?.toCoords) && (
          <Marker position={defaultCenter}>
            <Popup>Kathmandu, Nepal</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Live Flights Counter */}
      {isLiveView && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded shadow-md z-[1000]">
          <div className="text-sm font-semibold text-gray-800">
            Tracking: <span className="text-blue-600">{livePlanes.length}</span>{" "}
            flights
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
