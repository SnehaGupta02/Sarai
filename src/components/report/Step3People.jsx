export default function Step3People({ people, setPeople, next, back }) {
    const options = ["1-5", "5-10", "More than 10", "More than 50"];
  
    return (
      <div style={styles.card}>
        <h2>👥 People Affected</h2>
  
        {options.map((p) => (
          <button
            key={p}
            onClick={() => setPeople(p)}
            style={{
              ...styles.btn,
              background: people === p ? "#38bdf8" : "#334155",
            }}
          >
            {p}
          </button>
        ))}
  
        <button onClick={next}>Next ➡</button>
        <button onClick={back}>⬅ Back</button>
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
    btn: {
      display: "block",
      width: "100%",
      margin: "8px 0",
      padding: "10px",
      border: "none",
      color: "white",
      cursor: "pointer",
    },
  };