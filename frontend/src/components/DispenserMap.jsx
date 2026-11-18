
import { useEffect } from 'react';
import {
  CircleMarker, MapContainer, Popup, TileLayer, useMap
} from 'react-leaflet';

import { count } from '../utils/inventory.js';
import 'leaflet/dist/leaflet.css';

// Approximate center of the UIUC campus
const CAMPUS_CENTER = [40.1106, -88.2272];

// Move the map when a dispenser or user location is selected
function MapFocus({ dispensers, selectedId, position }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId == null) return;

    const selected = dispensers.find(
      dispenser => String(dispenser.id) === String(selectedId)
    );

    if (
      selected &&
      selected.latitude != null &&
      selected.longitude != null &&
      Number.isFinite(Number(selected.latitude)) &&
      Number.isFinite(Number(selected.longitude))
    ) {
      map.flyTo(
        [Number(selected.latitude), Number(selected.longitude)],
        17,
        { duration: 0.6 }
      );
    }
  }, [selectedId, dispensers, map]);

  useEffect(() => {
    if (position && selectedId == null) {
      map.flyTo(
        [position.latitude, position.longitude],
        15,
        { duration: 0.6 }
      );
    }
  }, [position, selectedId, map]);

  return null;
}

export default function DispenserMap({
  dispensers,
  position,
  selectedId,
  onSelect
}) {
  const validDispensers = dispensers.filter(dispenser =>
    dispenser.latitude != null &&
    dispenser.longitude != null &&
    Number.isFinite(Number(dispenser.latitude)) &&
    Number.isFinite(Number(dispenser.longitude)) &&
    Math.abs(Number(dispenser.latitude)) <= 90 &&
    Math.abs(Number(dispenser.longitude)) <= 180
  );

  return (
    <MapContainer
      center={CAMPUS_CENTER}
      zoom={15}
      scrollWheelZoom={true}
      className="campus-map"
      aria-label="Map of campus dispensers"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFocus
        dispensers={validDispensers}
        selectedId={selectedId}
        position={position}
      />

      {validDispensers.map(dispenser => {
        const pads = count(dispenser.pad_count);
        const tampons = count(dispenser.tampon_count);
        const selected = String(dispenser.id) === String(selectedId);

        return (
          <CircleMarker
            key={dispenser.id}
            center={[
              Number(dispenser.latitude),
              Number(dispenser.longitude)
            ]}
            radius={selected ? 13 : 10}
            pathOptions={{
              color: '#ffffff',
              weight: 2.5,
              fillColor: pads + tampons > 0 ? '#d65d8c' : '#a0a6b4',
              fillOpacity: 1
            }}
            eventHandlers={{
              click: () => onSelect(dispenser.id)
            }}
          >
            <Popup>
              <strong>
                {dispenser.name || dispenser.building ||
                  `Dispenser ${dispenser.id}`}
              </strong>

              {dispenser.building && (
                <p>{dispenser.building}</p>
              )}

              <div>Pads: {pads}</div>
              <div>Tampons: {tampons}</div>
            </Popup>
          </CircleMarker>
        );
      })}

      {position && (
        <CircleMarker
          center={[position.latitude, position.longitude]}
          radius={8}
          pathOptions={{
            color: '#ffffff',
            weight: 3,
            fillColor: '#2686d4',
            fillOpacity: 1
          }}
        >
          <Popup>Your approximate location</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
