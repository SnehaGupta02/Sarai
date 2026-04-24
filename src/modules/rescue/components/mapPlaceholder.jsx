import React, { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "320px",
  borderRadius: "12px",
};

export default function MapPlaceholder({ incidents = [] }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDWSyNyys3Crqr5808LsOMC52FR6z7_1MM",
  });

  // ✅ Center map based on first incident
  const center = useMemo(() => {
    if (incidents.length > 0 && incidents[0].lat && incidents[0].lng) {
      return {
        lat: Number(incidents[0].lat),
        lng: Number(incidents[0].lng),
      };
    }
    return { lat: 28.61, lng: 77.21 }; // fallback (Delhi)
  }, [incidents]);

  if (loadError) return <p style={{ color: "red" }}>Map failed to load</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {/* ✅ Show ALL incidents as markers */}
      {incidents.map((incident) => {
        if (!incident.lat || !incident.lng) return null;

        return (
          <Marker
            key={incident.id}
            position={{
              lat: Number(incident.lat),
              lng: Number(incident.lng),
            }}
            title={incident.location}
          />
        );
      })}
    </GoogleMap>
  );
}