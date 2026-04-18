//Auth.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/citizen";

  // 📱 SEND OTP
  const sendOTP = () => {
    if (phone.length !== 10) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      console.log("Send OTP to:", phone);
      setStep(2);
      setLoading(false);
    }, 800);
  };

  // 🔐 VERIFY OTP
  const verifyOTP = () => {
    if (otp.length !== 4) {
      setError("Enter valid 4-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      login(phone);
      navigate(from, { replace: true });
    }, 800);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>📱 Verify Your Number</h1>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p style={styles.subtitle}>
              Enter your phone number to continue
            </p>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
                setError("");
              }}
              maxLength={10}
              style={styles.input}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={styles.primaryBtn}
              onClick={sendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p style={styles.subtitle}>
              Enter OTP sent to +91 {phone}
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 4);
                setOtp(value);
                setError("");
              }}
              style={styles.input}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={styles.primaryBtn}
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              style={styles.linkBtn}
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
            >
              Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "18px",
    width: "320px",
    textAlign: "center",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },

  error: {
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "10px",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#38bdf8",
    color: "#020617",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  linkBtn: {
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#38bdf8",
    cursor: "pointer",
    fontSize: "13px",
  },
};