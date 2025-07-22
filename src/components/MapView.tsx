import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// Better type definition for search data
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
  // Default center (Nepal)
  const defaultCenter: [number, number] = [27.7, 85.3];
  
  // Determine map center based on search data
  const getMapCenter = (): [number, number] => {
    if (searchData?.fromCoords) {
      return searchData.fromCoords;
    }
    return defaultCenter;
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={getMapCenter()}
        zoom={7}
        className="h-full w-full rounded-md shadow-md"
        style={{ minHeight: '400px' }}
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
            <Popup>{searchData.from || 'Departure'}</Popup>
          </Marker>
        )}
        
        {searchData?.toCoords && (
          <Marker position={searchData.toCoords}>
            <Popup>{searchData.to || 'Destination'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;