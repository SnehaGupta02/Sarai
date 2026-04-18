//CitizenHome.jsx
import { useNavigate } from "react-router-dom";

export default function CitizenHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Citizen Dashboard</h1>
      <p style={styles.subtitle}>
        Report incidents and stay informed during disasters
      </p>

      <div style={styles.cardContainer}>
        <div
          style={styles.card}
          onClick={() => navigate("/citizen/report")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(56,189,248,0.3)";
            e.currentTarget.style.border =
              "1px solid rgba(56,189,248,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.border =
              "1px solid rgba(148, 163, 184, 0.2)";
          }}
        >
          <div style={styles.icon}>🚨</div>
          <h2>Report Incident</h2>
          <p>Submit a disaster report with location and media</p>
        </div>
        <div
          style={styles.card}
          onClick={() => navigate("/citizen/track")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(56,189,248,0.3)";
            e.currentTarget.style.border =
              "1px solid rgba(56,189,248,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.border =
              "1px solid rgba(148, 163, 184, 0.2)";
          }}
        >
          <div style={styles.icon}>📊</div>
          <h2>Track Reports</h2>
          <p>Check status of your submitted reports</p>
        </div>
        <div
          style={styles.card}
          onClick={() => navigate("/citizen/alerts")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(56,189,248,0.3)";
            e.currentTarget.style.border =
              "1px solid rgba(56,189,248,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.border =
              "1px solid rgba(148, 163, 184, 0.2)";
          }}
        >
          <div style={styles.icon}>📍</div>
          <h2>View Alerts</h2>
          <p>See nearby disaster alerts and warnings</p>
        </div>
      </div>
    </div>
    
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    color: "white",
    textAlign: "center",
    padding: "50px 20px",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "40px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "18px",
    width: "260px",
    cursor: "pointer",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    transition: "all 0.3s ease",
  },
  icon: {
    fontSize: "42px",
    marginBottom: "10px",
  },
};