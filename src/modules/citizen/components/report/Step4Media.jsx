//Step4Media.jsx
export default function Step4Media({
    fileRef,
    preview,
    setPreview,
    fileData,
    setFileData,
    next,
    back,
  }) {
    const handleFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const validTypes = ["image/png", "image/jpeg", "video/mp4"];
  
      if (!validTypes.includes(file.type)) {
        alert("Only PNG, JPG, MP4 allowed");
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        alert("Max size 5MB");
        return;
      }
  
      setFileData(file);
      setPreview(URL.createObjectURL(file));
    };
  
    const removeMedia = () => {
      setPreview(null);
      setFileData(null);
      if (fileRef.current) fileRef.current.value = "";
    };
  
    return (
      <div style={styles.card}>
        <h2>📸 Evidence (Optional)</h2>
  
        <p style={styles.info}>
          Allowed: PNG, JPG, MP4 | Max size: 5MB
        </p>
  
        <input ref={fileRef} type="file" onChange={handleFile} />
  
        {preview && (
          <div>
            {fileData?.type.startsWith("video") ? (
              <video src={preview} controls style={styles.preview} />
            ) : (
              <img src={preview} style={styles.preview} />
            )}
            <button onClick={removeMedia}>❌ Remove</button>
          </div>
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
    preview: {
      width: "100%",
      marginTop: "10px",
    },
    info: {
      fontSize: "13px",
      color: "#94a3b8",
    },
  };