//TrackReport.jsx
import { useEffect, useState } from "react";
import CitizenNavbar from "../components/CitizenNavbar";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
export default function TrackReport() {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("Reports")
      .select("*")
      .eq("phone", user.phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setReports([]);
      return;
    }

    setReports(data);
  };

  return (
    <>
      <CitizenNavbar />
    <div style={styles.container}>
      <h1>📊 Your Reports</h1>

      {reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        reports.map((r) => (
          <div key={r._id} style={styles.card}>
            <p><strong>Location of Disaster:</strong> {r.address}</p>
            <p><strong>Number of People:</strong> {r.people}</p>
            <p><strong>Description:</strong> {r.description}</p>
            <p><strong>Time of reporting:</strong> {" "}{new Date(r.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {r.status}</p>
          </div>
        ))
      )}
    </div>
    </>
  );
}

const styles = {
  container: {
    background: "#020617",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  },
};