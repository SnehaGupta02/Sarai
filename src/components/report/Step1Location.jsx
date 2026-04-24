export default function Step1Location({ autoLocation, setAutoLocation, next }) {
    const detectLocation = () => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setAutoLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    };
  
    return (
      <div style={styles.card}>
        <h2>📍 Your Location</h2>
  
        <button onClick={detectLocation}>Detect Location</button>
  
        {autoLocation && (
          <iframe
            src={`https://www.google.com/maps?q=${autoLocation.lat},${autoLocation.lng}&z=15&output=embed`}
            style={styles.map}
          />
        )}
  
        <button onClick={next}>Next ➡</button>
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
    map: {
      width: "100%",
      height: "200px",
    },
  };