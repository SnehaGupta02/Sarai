import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccessGate() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP login (backend later)
    if (name === "ndrf" && password === "1234") {
      navigate("/rescue/login");
    } else {
      alert("Access Denied ❌");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "30px",
          background: "#1e293b",
          borderRadius: "12px",
          width: "300px",
          color: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Government Access
        </h2>

        <input
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "none",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "none",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Verify
        </button>
      </form>
    </div>
  );
}