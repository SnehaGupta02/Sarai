//Step5Description.jsx
export default function Step5Description({
    setDescription,
    submitReport,
    back,
  }) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>📝 Describe the Situation</h2>
  
          <p style={styles.subtitle}>
            Provide details about damage, urgency, and current conditions
          </p>
  
          <textarea
            style={styles.textarea}
            placeholder="Example: Flood water has entered houses, people are stranded on rooftops..."
            onChange={(e) => setDescription(e.target.value)}
          />
  
          <div style={styles.buttonGroup}>
            <button style={styles.backBtn} onClick={back}>
              ⬅ Back
            </button>
  
            <button style={styles.submitBtn} onClick={submitReport}>
              Submit 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }
  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 120px)", // keeps center below CitizenNavbar
    },
  
    card: {
      background: "rgba(30, 41, 59, 0.8)",
      backdropFilter: "blur(10px)",
      padding: "25px",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "500px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      textAlign: "center",
    },
  
    title: {
      marginBottom: "10px",
    },
  
    subtitle: {
      fontSize: "13px",
      color: "#94a3b8",
      marginBottom: "15px",
    },
  
    textarea: {
        width: "100%",
        height: "400px",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #334155",
        background: "#020617",
        color: "white",
        resize: "none",
        outline: "none",
        marginBottom: "15px",
        fontFamily: "inherit",
        boxSizing: "border-box", // ✅ FIX
      },
  
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
    },
  
    backBtn: {
      flex: 1,
      padding: "10px",
      background: "#334155",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  
    submitBtn: {
      flex: 1,
      padding: "10px",
      background: "#38bdf8",
      color: "#020617",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };