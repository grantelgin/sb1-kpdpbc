import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEarthquakeStore } from '../store/earthquakeStore';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const { selectedEarthquake, groundMotionData } = useEarthquakeStore();

  const center = selectedEarthquake
    ? [
        selectedEarthquake.geometry.coordinates[1],
        selectedEarthquake.geometry.coordinates[0],
      ]
    : [0, 0];

  return (
    <MapContainer
      center={[center[0], center[1]]}
      zoom={6}
      className="w-full h-[600px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {selectedEarthquake && (
        <CircleMarker
          center={[
            selectedEarthquake.geometry.coordinates[1],
            selectedEarthquake.geometry.coordinates[0],
          ]}
          radius={10}
          color="red"
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{selectedEarthquake.properties.title}</h3>
              <p>Magnitude: {selectedEarthquake.properties.mag}</p>
              <p>Depth: {selectedEarthquake.geometry.coordinates[2]} km</p>
            </div>
          </Popup>
        </CircleMarker>
      )}

      {groundMotionData.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point.latitude, point.longitude]}
          radius={3}
          color={`rgb(${Math.min(255, point.pga * 500)}, 0, 0)`}
          fillOpacity={0.5}
        >
          <Popup>
            <div className="p-2">
              <p>PGA: {point.pga.toFixed(3)} g</p>
              <p>PGV: {point.pgv.toFixed(1)} cm/s</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}