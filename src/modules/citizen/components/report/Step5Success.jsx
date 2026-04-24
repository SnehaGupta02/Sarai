//Step6Success.jsx
export default function Step6Success() {
    return (
      <div style={styles.card}>
        <h2>✅ Report Submitted</h2>
        <p>Your report has been sent successfully.</p>
  
        <button onClick={() => (window.location.href = "/citizen")}>
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  const styles = {
    card: {
      background: "#1e293b",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "400px",
      margin: "auto",
    },
  };