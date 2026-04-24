import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.nav}>
      <h3 style={styles.logo}>SAR-AI</h3>

      <div style={styles.links}>
        <button
          onClick={() => navigate("/citizen")}
          style={isActive("/citizen") ? styles.active : styles.btn}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/report")}
          style={isActive("/report") ? styles.active : styles.btn}
        >
          Report
        </button>

        <button
          onClick={() => navigate("/alerts")}
          style={isActive("/alerts") ? styles.active : styles.btn}
          disabled={isActive("/alerts")} // ✅ disable current
        >
          Alerts
        </button>

        <button
          onClick={() => navigate("/track")}
          style={isActive("/track") ? styles.active : styles.btn}
        >
          Track
        </button>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#020617",
    color: "white",
    borderBottom: "1px solid #1e293b",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "10px",
  },
  btn: {
    background: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  active: {
    background: "#38bdf8",
    color: "#020617",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "default",
  },
};