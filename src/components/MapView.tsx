import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SearchData {
  from?: string;
  to?: string;
  fromCoords?: [number, number];
  toCoords?: [number, number];
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
  livePlanes: Plane[];
  isLiveView: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  searchData,
  livePlanes,
  isLiveView,
}) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([20.0, 0.0], 2); // Default world view
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add search route markers if searchData exists
    if (searchData?.fromCoords && searchData.toCoords) {
      L.marker(searchData.fromCoords)
        .addTo(map)
        .bindPopup(searchData.from || "Origin");
      L.marker(searchData.toCoords)
        .addTo(map)
        .bindPopup(searchData.to || "Destination");
      map.fitBounds([searchData.fromCoords, searchData.toCoords]);
    }

    // Add live plane markers
    if (isLiveView && livePlanes.length > 0) {
      livePlanes.forEach((plane) => {
        if (plane.latitude && plane.longitude) {
          L.marker([plane.latitude, plane.longitude])
            .addTo(map)
            .bindPopup(
              `<strong>${plane.callsign || plane.icao24}</strong><br>Country: ${
                plane.origin_country
              }<br>Alt: ${plane.altitude || "N/A"}ft`
            );
        }
      });
      map.fitBounds(
        livePlanes.map((plane) => [plane.latitude, plane.longitude])
      );
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [searchData, livePlanes, isLiveView]);

  return <div id="map" className="w-full h-full"></div>;
};

export default MapView;
