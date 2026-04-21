import { useEffect, useRef } from "react";

export default function GoogleMapView({ incidents }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    // ✅ CREATE MAP ONLY ONCE
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // default
        zoom: 10,
      });
    }

    const map = mapInstance.current;

    // 🔥 AUTO CENTER BASED ON INCIDENTS
    if (incidents.length > 0) {
      map.setCenter({
        lat: incidents[0].lat,
        lng: incidents[0].lng,
      });
    }

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

    // 🔥 ADD MARKERS
    incidents.forEach((incident) => {
      if (!incident.lat || !incident.lng) return;

      const marker = new window.google.maps.Marker({
        position: { lat: incident.lat, lng: incident.lng },
        map,
        icon: getIcon(incident.severity),
      });

      const info = new window.google.maps.InfoWindow({
        content: `
          <div style="color:black; font-size:14px;">
            <strong>${incident.disaster_type || "Incident"}</strong><br/>
            📍 ${incident.location}<br/>
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
  }, [incidents]);

  return (
    <div
      style={{ width: "100%", height: "350px", borderRadius: "12px", overflow: "hidden" }}
    >
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* 🔥 LEGEND */}
      <div className="flex gap-4 text-xs text-slate-400 mt-2 px-2">
        <span>🔴 High</span>
        <span>🟡 Medium</span>
        <span>🟢 Low</span>
      </div>
    </div>
  );
}