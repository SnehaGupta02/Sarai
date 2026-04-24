import LocationInput from "../LocationInput";

export default function Step2DisasterLocation({
  manualLocation,
  setManualLocation,
  next,
  back,
}) {
  return (
    <div style={styles.card}>
      <h2>📍 Disaster Location</h2>

      <LocationInput onSelect={setManualLocation} />

      {manualLocation && (
        <p style={styles.info}>{manualLocation.address}</p>
      )}

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
  info: {
    fontSize: "13px",
    color: "#94a3b8",
  },
};