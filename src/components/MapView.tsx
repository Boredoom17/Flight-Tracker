import React, { useEffect, useRef, useState } from "react";
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
  heading?: number;
  vertical_rate?: number;
  on_ground?: boolean;
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
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedPlane, setSelectedPlane] = useState<Plane | null>(null);

  const createPlaneIcon = (plane: Plane, isSelected: boolean = false) => {
    const rotation = plane.heading || 0;
    const size = isSelected ? 24 : 16;
    const color = isSelected
      ? "#ff4444"
      : plane.on_ground
      ? "#888888"
      : "#4444ff";

    return L.divIcon({
      html: `
        <div style="
          transform: rotate(${rotation}deg);
          font-size: ${size}px;
          color: ${color};
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        ">✈️</div>
      `,
      className: "plane-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const createRouteLine = (from: [number, number], to: [number, number]) => {
    return L.polyline([from, to], {
      color: "#4444ff",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [20.0, 0.0],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      const osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      );

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
        }
      );

      const darkLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© CartoDB",
        }
      );

      // Default layer
      osmLayer.addTo(mapRef.current);

      // Layer control
      const baseLayers = {
        "Street Map": osmLayer,
        Satellite: satelliteLayer,
        "Dark Mode": darkLayer,
      };

      L.control.layers(baseLayers).addTo(mapRef.current);

      // Create layer groups
      markersRef.current = L.layerGroup().addTo(mapRef.current);
      routeLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add scale control
      L.control.scale().addTo(mapRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;

    // Clear existing route layers
    routeLayerRef.current.clearLayers();

    if (searchData?.fromCoords && searchData.toCoords) {
      const map = mapRef.current;

      // Add departure airport marker
      const departureMarker = L.marker(searchData.fromCoords, {
        icon: L.divIcon({
          html: `<div style="background: #22c55e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">🛫</div>`,
          className: "airport-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).bindPopup(`
        <div style="text-align: center;">
          <strong>${searchData.from || "Origin"}</strong><br>
          <small>Departure Airport</small>
        </div>
      `);

      // Add arrival airport marker
      const arrivalMarker = L.marker(searchData.toCoords, {
        icon: L.divIcon({
          html: `<div style="background: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">🛬</div>`,
          className: "airport-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).bindPopup(`
        <div style="text-align: center;">
          <strong>${searchData.to || "Destination"}</strong><br>
          <small>Arrival Airport</small>
        </div>
      `);

      // Add route line
      const routeLine = createRouteLine(
        searchData.fromCoords,
        searchData.toCoords
      );

      // Add great circle route (more realistic flight path)
      const greatCircleLine = L.polyline(
        [searchData.fromCoords, searchData.toCoords],
        {
          color: "#ff6b6b",
          weight: 2,
          opacity: 0.6,
          dashArray: "5, 10",
        }
      );

      // Add all to route layer
      routeLayerRef.current.addLayer(departureMarker);
      routeLayerRef.current.addLayer(arrivalMarker);
      routeLayerRef.current.addLayer(routeLine);
      routeLayerRef.current.addLayer(greatCircleLine);

      // Fit map to route
      const group = new L.FeatureGroup([departureMarker, arrivalMarker]);
      map.fitBounds(group.getBounds().pad(0.1));

      // Add route info popup
      const midpoint: [number, number] = [
        (searchData.fromCoords[0] + searchData.toCoords[0]) / 2,
        (searchData.fromCoords[1] + searchData.toCoords[1]) / 2,
      ];

      const distance =
        map.distance(searchData.fromCoords, searchData.toCoords) / 1000; // km
      const routeInfo = L.marker(midpoint, {
        icon: L.divIcon({
          html: `<div style="background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #ccc;">📏 ${Math.round(
            distance
          )} km</div>`,
          className: "route-info",
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        }),
      });

      routeLayerRef.current.addLayer(routeInfo);
    }
  }, [searchData]);

  // Handle live planes
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !isLiveView) return;

    const map = mapRef.current;
    const markersLayer = markersRef.current;

    // Clear existing markers
    markersLayer.clearLayers();

    if (livePlanes.length === 0) return;

    // Add plane markers
    livePlanes.forEach((plane) => {
      if (!plane.latitude || !plane.longitude) return;

      const isSelected = selectedPlane?.icao24 === plane.icao24;
      const planeIcon = createPlaneIcon(plane, isSelected);

      const marker = L.marker([plane.latitude, plane.longitude], {
        icon: planeIcon,
      });

      const popupContent = `
        <div style="min-width: 200px;">
          <div style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px;">
            <strong style="font-size: 16px; color: #333;">${
              plane.callsign || plane.icao24
            }</strong>
            <br>
            <small style="color: #666;">${plane.origin_country}</small>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div>
              <strong>Altitude:</strong><br>
              ${plane.altitude ? `${Math.round(plane.altitude)} m` : "N/A"}
            </div>
            <div>
              <strong>Speed:</strong><br>
              ${
                plane.velocity
                  ? `${Math.round(plane.velocity * 3.6)} km/h`
                  : "N/A"
              }
            </div>
            <div>
              <strong>Heading:</strong><br>
              ${plane.heading ? `${Math.round(plane.heading)}°` : "N/A"}
            </div>
            <div>
              <strong>Status:</strong><br>
              <span style="color: ${plane.on_ground ? "#f59e0b" : "#10b981"};">
                ${plane.on_ground ? "🛬 Ground" : "✈️ Flying"}
              </span>
            </div>
          </div>
          
          ${
            plane.vertical_rate
              ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 12px;">
              <strong>Vertical Rate:</strong> ${
                plane.vertical_rate > 0
                  ? "📈"
                  : plane.vertical_rate < 0
                  ? "📉"
                  : "➡️"
              } ${Math.round(plane.vertical_rate)} m/s
            </div>
          `
              : ""
          }
          
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <button onclick="trackPlane('${
              plane.icao24
            }')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              🎯 Track Flight
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Click handler for plane selection
      marker.on("click", () => {
        setSelectedPlane(plane);
        map.setView(
          [plane.latitude, plane.longitude],
          Math.max(map.getZoom(), 8)
        );
      });

      markersLayer.addLayer(marker);
    });

    // Auto-fit bounds if many planes
    if (livePlanes.length > 0 && livePlanes.length < 100) {
      const bounds = L.latLngBounds(
        livePlanes.map((plane) => [plane.latitude, plane.longitude])
      );
      map.fitBounds(bounds.pad(0.05));
    }

    // Add planes count info
    const planesInfo = L.control({ position: "topright" });
    planesInfo.onAdd = () => {
      const div = L.DomUtil.create("div", "planes-info");
      div.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 4px; font-size: 14px; font-weight: bold; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ✈️ ${livePlanes.length} Live Flights
        </div>
      `;
      return div;
    };
    planesInfo.addTo(map);

    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Control && layer.getPosition() === "topright") {
          map.removeControl(layer);
        }
      });
    };
  }, [livePlanes, isLiveView, selectedPlane]);

  useEffect(() => {
    (window as any).trackPlane = (icao24: string) => {
      const plane = livePlanes.find((p) => p.icao24 === icao24);
      if (plane && mapRef.current) {
        setSelectedPlane(plane);
        mapRef.current.setView([plane.latitude, plane.longitude], 10);

        const trackingCircle = L.circle([plane.latitude, plane.longitude], {
          radius: 10000, // 10km radius
          color: "#ff4444",
          fillColor: "#ff4444",
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "5, 5",
        });

        if (markersRef.current) {
          markersRef.current.addLayer(trackingCircle);

          setTimeout(() => {
            if (markersRef.current) {
              markersRef.current.removeLayer(trackingCircle);
            }
          }, 10000);
        }
      }
    };
  }, [livePlanes]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full"></div>

      {/* Live View Controls */}
      {isLiveView && (
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Radar
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Tracking {livePlanes.length} active flights worldwide
            </p>

            {selectedPlane && (
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold text-sm mb-1">Selected Flight:</h4>
                <p className="text-sm">
                  <strong>
                    {selectedPlane.callsign || selectedPlane.icao24}
                  </strong>
                  <br />
                  <span className="text-gray-600">
                    {selectedPlane.origin_country}
                  </span>
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {selectedPlane.altitude
                      ? `${Math.round(selectedPlane.altitude)}m`
                      : "N/A"}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {selectedPlane.velocity
                      ? `${Math.round(selectedPlane.velocity * 3.6)}km/h`
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search View Info */}
      {searchData && !isLiveView && (
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2">
              {searchData.flightNumber ? "✈️ Flight Route" : "🗺️ Route Map"}
            </h3>
            {searchData.from && searchData.to ? (
              <p className="text-sm text-gray-600">
                Showing route: <strong>{searchData.from}</strong> →{" "}
                <strong>{searchData.to}</strong>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Flight: <strong>{searchData.flightNumber}</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
