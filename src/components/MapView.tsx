import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
// Fix Leaflet default icon issue
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
}

interface MapViewProps {
  searchData: SearchData | null;
}

const MapView: React.FC<MapViewProps> = ({ searchData }) => {
  // Default center (Kathmandu)
  const defaultCenter: [number, number] = [27.7172, 85.324];
  const mapRef = useRef<L.Map | null>(null);

  // Calculate bounds to fit all markers
  const getBounds = () => {
    const positions: [number, number][] = [defaultCenter];

    if (searchData?.fromCoords) positions.push(searchData.fromCoords);
    if (searchData?.toCoords) positions.push(searchData.toCoords);

    return L.latLngBounds(positions);
  };

  // Handle map initialization and auto-zoom
  useEffect(() => {
    if (mapRef.current && (searchData?.fromCoords || searchData?.toCoords)) {
      setTimeout(() => {
        mapRef.current?.fitBounds(getBounds(), { padding: [50, 50] });
      }, 100);
    }
  }, [searchData]);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        className="h-full w-full rounded-md shadow-md"
        style={{ minHeight: "400px" }}
        whenReady={() => {
          if (
            mapRef.current &&
            (searchData?.fromCoords || searchData?.toCoords)
          ) {
            setTimeout(() => {
              mapRef.current?.fitBounds(getBounds(), { padding: [50, 50] });
            }, 100);
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Default marker */}
        <Marker position={defaultCenter}>
          <Popup>Kathmandu, Nepal</Popup>
        </Marker>

        {/* Search-based markers */}
        {searchData?.fromCoords && (
          <Marker position={searchData.fromCoords}>
            <Popup>{searchData.from || "Departure"}</Popup>
          </Marker>
        )}

        {searchData?.toCoords && (
          <Marker position={searchData.toCoords}>
            <Popup>{searchData.to || "Destination"}</Popup>
          </Marker>
        )}

        {/* Draw line between points if both exist */}
        {searchData?.fromCoords && searchData?.toCoords && (
          <Polyline
            positions={[searchData.fromCoords, searchData.toCoords]}
            color="blue"
            weight={3}
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
