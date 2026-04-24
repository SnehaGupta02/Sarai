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

  // 🔥 REAL-WORLD LOGIC
  const getPriority = () => {
    if (peopleCount > 10) return { label: "High", color: "#ef4444" };
    if (peopleCount > 5) return { label: "Medium", color: "#f59e0b" };
    return { label: "Low", color: "#10b981" };
  };

  const priority = getPriority();

  return (
  <div style={{ padding: "20px", background: "#f1f5f9", minHeight: "100vh" }}>

    {/* 🔴 HEADER */}
    <div style={{
      background: "#1e293b",
      color: "white",
      padding: "15px 20px",
      borderRadius: "12px",
      marginBottom: "20px"
    }}>
      <h1>🚨Emergency Rescue Dashboard</h1>
    </div>

    {incidents.map((item) => {

      const priority =
        peopleCount > 10 ? "High" :
        peopleCount > 5 ? "Medium" : "Low";

      return (

        <div key={item.id}>

          {/* 🔥 INCIDENT SUMMARY (TOP BAR) */}
          <div style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>📍 {item.location}, {item.district}</span>
            <span>⚠ {item.disaster_type}</span>
            <span>👥 {peopleCount} People</span>
            <span>🚑 {ambulances}</span>
            <span style={{
              background: priority === "High" ? "red" :
                          priority === "Medium" ? "orange" : "green",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "8px"
            }}>
              {priority}
            </span>
          </div>

          {/* 🔥 MAIN GRID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "20px"
          }}>

            {/* 🟢 LEFT PANEL */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>

              {/* INCIDENT DETAILS */}
              <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px"
              }}>
                <h3>📌 Incident Details</h3>
                <p><b>Status:</b> {item.status}</p>
                <p><b>Priority:</b> {priority}</p>
              </div>

              {/* DECISION BOX */}
              <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px"
              }}>
                <h3>🚑 Action Plan</h3>
                <p>Ambulances: {ambulances}</p>
                <p>Medical Kits: {medicalKits}</p>
                <p>Rescue Vans: {rescueVans}</p>
              </div>

            </div>

            {/* 🔵 RIGHT PANEL (VIDEO) */}
            <div style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              <img
                src={`http://127.0.0.1:5000/video?source=${item.video_url || 0}`}
                style={{ width: "100%" }}
              />

              {/* CLEAN PANEL */}
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                background: "rgba(0,0,0,0.7)",
                padding: "10px",
                borderRadius: "10px",
                color: "#fff"
              }}>
                👥 {peopleCount} <br />
                🚑 {ambulances} <br />
                💊 {medicalKits}
              </div>
            </div>

          </div>

          {/* 🗺 MAP FULL WIDTH */}
          <div style={{
            marginTop: "20px",
            background: "#fff",
            padding: "15px",
            borderRadius: "12px"
          }}>
            <h3>📍 Location Map</h3>
            <MapPlaceholder incidents={incidents} />
          </div>

        </div>
      );
    })}
  </div>
);
}

export default RescueHome;