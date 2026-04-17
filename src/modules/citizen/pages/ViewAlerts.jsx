//ViewAlerts.jsx
import { useEffect, useRef, useState } from "react";
import CitizenNavbar from "../components/CitizenNavbar";
import { supabase } from "../../../lib/supabase";

export default function ViewAlerts() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("Reports")
      .select("*");
  
    if (error) {
      console.error(error);
      setAlerts([]);
      return;
    }
  
    setAlerts(data);
  };

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
  
    // ✅ create map only once
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: alerts.length
  ? { lat: alerts[0].lat, lng: alerts[0].lng }
  : { lat: 28.6139, lng: 77.2090 },
        zoom: 10,
      });
    }
  
    const map = mapInstance.current;
  
    // ✅ clear old markers (important)
    if (map.markers) {
      map.markers.forEach((m) => m.setMap(null));
    }
    map.markers = [];
  
    // ✅ add new markers
    alerts.forEach((alert) => {
      if (!alert.lat || !alert.lng) return;
  
      const marker = new window.google.maps.Marker({
        position: { lat: alert.lat, lng: alert.lng },
        map,
      });
  
      const info = new window.google.maps.InfoWindow({
        content: `
  <div style="color:black; font-size:14px;">
    <strong>📍 ${alert.address}</strong><br/>
    👥 ${alert.people}<br/>
    📝 ${alert.description}<br/>
    ⏱ ${new Date(alert.created_at).toLocaleString()}
  </div>
`,
      });
  
      marker.addListener("click", () => {
        info.open(map, marker);
      });
  
      map.markers.push(marker);
    });
  }, [alerts]);

  return (
    <>
      <CitizenNavbar />
  
      <div style={{ height: "calc(100vh - 60px)" }}>
        <div
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
}