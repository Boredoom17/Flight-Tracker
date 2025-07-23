import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  searchData: SearchData | null;
  livePlanes: Plane[];
  isLiveView: boolean;
}

const MapView: React.FC<MapViewProps> = ({ searchData, livePlanes, isLiveView }) => {
  const defaultCenter: [number, number] = [27.7172, 85.3240];
  
  const getBounds = (): L.LatLngBounds => {
    const bounds = new L.LatLngBounds([defaultCenter, defaultCenter]);
    
    if (searchData?.fromCoords) bounds.extend(searchData.fromCoords);
    if (searchData?.toCoords) bounds.extend(searchData.toCoords);
    
    if (isLiveView && livePlanes.length > 0) {
      livePlanes.forEach(plane => {
        if (plane.latitude && plane.longitude) {
          bounds.extend([plane.latitude, plane.longitude]);
        }
      });
    }
    
    return bounds;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        className="h-full w-full"
        whenReady={(map) => {
          setTimeout(() => {
            map.target.fitBounds(getBounds(), { padding: [50, 50] });
          }, 100);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {isLiveView && livePlanes.map((plane) => (
          plane.callsign && plane.latitude && plane.longitude && (
            <Marker key={plane.icao24} position={[plane.latitude, plane.longitude]}>
              <Popup>
                <div className="space-y-1">
                  <div><strong>Flight:</strong> {plane.callsign}</div>
                  <div><strong>From:</strong> {plane.origin_country}</div>
                  <div><strong>Altitude:</strong> {Math.round(plane.altitude || 0)} ft</div>
                  <div><strong>Speed:</strong> {Math.round(plane.velocity || 0)} kts</div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {!isLiveView && searchData?.fromCoords && (
          <Marker position={searchData.fromCoords}>
            <Popup>{searchData.from || 'Departure'}</Popup>
          </Marker>
        )}

        {!isLiveView && searchData?.toCoords && (
          <Marker position={searchData.toCoords}>
            <Popup>{searchData.to || 'Destination'}</Popup>
          </Marker>
        )}

        {!isLiveView && searchData?.fromCoords && searchData?.toCoords && (
          <Polyline
            positions={[searchData.fromCoords, searchData.toCoords]}
            color="blue"
            weight={3}
            dashArray="5,5"
          />
        )}
      </MapContainer>

      {isLiveView && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow z-[1000]">
          <div className="text-sm font-semibold">
            Live Flights: {livePlanes.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;