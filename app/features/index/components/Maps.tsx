import { useEffect } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import { Marker } from 'react-leaflet'


// Component untuk handle click pada map
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: [number, number] | null; 
  setPosition: (pos: [number, number]) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component untuk fly to location
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

interface MapsProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  height?: string;
  zoom?: number;
}

export default function Maps({ 
  position, 
  setPosition, 
  height = "h-64",
  zoom = 13 
}: MapsProps) {
  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${height} relative`}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
}