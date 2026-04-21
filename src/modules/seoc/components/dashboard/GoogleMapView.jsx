import { useEffect, useRef } from "react";

export default function GoogleMapView({ incidents = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    // ✅ CREATE MAP ONLY ONCE
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 26.8467, lng: 80.9462 }, // ✅ Uttar Pradesh center
        zoom: 6, // state-level view
      });
    }

    const map = mapInstance.current;

    // 🔥 CLEAR OLD MARKERS
    if (map.markers) {
      map.markers.forEach((m) => m.setMap(null));
    }
    map.markers = [];

    // 🔥 SEVERITY COLOR LOGIC
    const getIcon = (severity) => {
      if (severity === "high") {
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      }
      if (severity === "medium") {
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      }
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    };

    // 🔥 FIT BOUNDS (IMPORTANT FOR STATE VIEW)
    const bounds = new window.google.maps.LatLngBounds();

    incidents.forEach((incident) => {
      if (!incident.lat || !incident.lng) return;

      const position = {
        lat: Number(incident.lat),
        lng: Number(incident.lng),
      };

      bounds.extend(position);

      const marker = new window.google.maps.Marker({
        position,
        map,
        icon: getIcon(incident.severity),
      });

      const info = new window.google.maps.InfoWindow({
        content: `
          <div style="color:black; font-size:14px;">
            <strong>${incident.disaster_type || "Incident"}</strong><br/>
            📍 ${incident.location}<br/>
            🏙️ ${incident.district || ""}<br/>
            ⚠️ Severity: ${incident.severity}<br/>
            📊 Status: ${incident.status}
          </div>
        `,
      });

      marker.addListener("click", () => {
        info.open(map, marker);
      });

      map.markers.push(marker);
    });

    // 🔥 AUTO FIT MAP (only if incidents exist)
    if (incidents.length > 0) {
      map.fitBounds(bounds);

      // prevent over-zoom when only 1 marker
      if (incidents.length === 1) {
        map.setZoom(10);
      }
    }
  }, [incidents]);

  return (
    <div className="w-full">
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-700"
      />

      {/* 🔥 LEGEND */}
      <div className="flex gap-6 text-sm text-slate-400 mt-2 px-2">
        <span>🔴 High Severity</span>
        <span>🟡 Medium Severity</span>
        <span>🟢 Low Severity</span>
      </div>
    </div>
  );
}