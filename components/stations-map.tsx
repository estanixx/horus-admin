"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// This is a fix for a known issue with webpack and leaflet's default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Define the shape of a single station object
interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

// Define the props for our component
interface StationsMapProps {
  stations: Station[];
}

const StationsMap: React.FC<StationsMapProps> = ({ stations }) => {
  if (typeof window === "undefined") {
    return null; // Don't render on the server
  }
  return (
    <MapContainer
      center={[10, 0]} // Default center
      zoom={2}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lon]}>
            <Popup>
              <b>{station.name}</b>
              <br />
              Lat: {station.lat}, Lon: {station.lon}
              <br />
              <a
                href={`/stations/${station.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </a>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default StationsMap;