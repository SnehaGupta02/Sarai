//Gateway.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roles = [
  {
    title: "Citizen",
    desc: "Report disaster & get alerts",
    route: "/citizen",
    icon: "👤",
  },
  {
    title: "Rescue Team",
    desc: "Access missions & operations",
    route: "/rescue",
    icon: "🚑",
  },
  {
    title: "Authorities",
    desc: "Manage incidents & teams",
    route: "/authorities/auth",
    icon: "🧑‍💼",
  },
  {
    title: "Central Govt",
    desc: "Monitor nationwide data",
    route: "/central",
    icon: "🏛️",
  },
  {
    title: "Volunteer",
    desc: "Assist in rescue missions",
    route: "/volunteer",
    icon: "🤝",
  },
];

export default function Gateway() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <h1 style={styles.title}>SAR-AI</h1>
      <p style={styles.subtitle}>
        Intelligent Disaster Response & Coordination System
      </p>

      <div style={styles.grid}>
        {roles.map((role, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => navigate(role.route)}
            
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
            <div style={styles.icon}>{role.icon}</div>
            <h2 style={styles.cardTitle}>{role.title}</h2>
            <p style={styles.desc}>{role.desc}</p>
          </div>
        ))}
      </div>

      <p style={styles.footer}>© SAR-AI System</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
    color: "white",
    textAlign: "center",
    padding: "60px 20px",
    fontFamily: "Inter, sans-serif",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.15), transparent)",
    zIndex: 0,
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "10px",
    zIndex: 1,
    position: "relative",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "50px",
    color: "#cbd5f5",
    zIndex: 1,
    position: "relative",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
    zIndex: 1,
    position: "relative",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "30px 20px",
    borderRadius: "18px",
    cursor: "pointer",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    transition: "all 0.3s ease",
  },
  cardTitle: {
    margin: "10px 0",
  },
  icon: {
    fontSize: "42px",
  },
  desc: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  footer: {
    marginTop: "50px",
    fontSize: "12px",
    color: "#64748b",
  },
};