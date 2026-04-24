import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import MapPlaceholder from "../components/MapPlaceholder";

function RescueHome() {
  const [incidents, setIncidents] = useState([]);
  const [peopleCount, setPeopleCount] = useState(0);
  const [ambulances, setAmbulances] = useState(0);
  const [medicalKits, setMedicalKits] = useState(0);
  const [rescueVans, setRescueVans] = useState(0);

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (incidents.length > 0) {
      const interval = setInterval(fetchML, 2000);
      return () => clearInterval(interval);
    }
  }, [incidents]);

  const fetchIncidents = async () => {
    const team_id = localStorage.getItem("team_id");

    const { data } = await supabase
      .from("incidents")
      .select("*")
      .contains("assigned_team_ids", [team_id])
      .order("created_at", { ascending: false })
      .limit(1);

    setIncidents(data || []);
  };

  const fetchML = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/count");
      const data = await res.json();

      setPeopleCount(data.people);
      setAmbulances(data.ambulances);
      setMedicalKits(data.medical_kits);
      setRescueVans(data.rescue_vans);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriority = () => {
    if (peopleCount > 10) return "High";
    if (peopleCount > 5) return "Medium";
    return "Low";
  };

  const priority = getPriority();

  return (
    <div
      style={{
        padding: "20px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "#e2e8f0",
        fontFamily: "system-ui",
      }}
    >
      {/* 🔴 HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
          padding: "18px 24px",
          borderRadius: "14px",
          marginBottom: "20px",
          boxShadow: "0 6px 25px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ margin: 0 }}>🚨 Emergency Rescue Dashboard</h1>
      </div>

      {incidents.map((item) => {
        const priority = getPriority();

        return (
          <div key={item.id}>
            {/* 🔥 INCIDENT SUMMARY */}
            <div
              style={{
                background: "#1e293b",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #334155",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <span>📍 {item.location}, {item.district}</span>
              <span>⚠ {item.disaster_type}</span>
              <span>👥 {peopleCount} People</span>
              <span>🚑 {ambulances}</span>

              <span
                style={{
                  background:
                    priority === "High"
                      ? "#dc2626"
                      : priority === "Medium"
                      ? "#f59e0b"
                      : "#16a34a",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  color: "#fff",
                  fontWeight: "600",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
              >
                {priority}
              </span>
            </div>

            {/* 🔥 MAIN GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr",
                gap: "20px",
              }}
            >
              {/* 🟢 LEFT PANEL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* INCIDENT DETAILS */}
                <div
                  style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  <h3 style={{ color: "#93c5fd" }}>📌 Incident Details</h3>
                  <p><b>Status:</b> {item.status}</p>
                  <p><b>Priority:</b> {priority}</p>
                </div>

                {/* ACTION PLAN */}
                <div
                  style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  <h3 style={{ color: "#93c5fd" }}>🚑 Action Plan</h3>
                  <p>Ambulances: {ambulances}</p>
                  <p>Medical Kits: {medicalKits}</p>
                  <p>Rescue Vans: {rescueVans}</p>
                </div>
              </div>

              {/* 🔵 RIGHT PANEL */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #334155",
                }}
              >
                <img
                  src={`http://127.0.0.1:5000/video?source=${item.video_url || 0}`}
                  style={{ width: "100%" }}
                />

                {/* OVERLAY */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    background: "rgba(15, 23, 42, 0.9)",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #334155",
                    backdropFilter: "blur(6px)",
                    color: "#fff",
                  }}
                >
                  👥 {peopleCount} <br />
                  🚑 {ambulances} <br />
                  💊 {medicalKits}
                </div>
              </div>
            </div>

            {/* 🗺 MAP */}
            <div
              style={{
                marginTop: "20px",
                background: "#1e293b",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #334155",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ color: "#93c5fd" }}>📍 Location Map</h3>
              <MapPlaceholder incidents={incidents} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RescueHome;