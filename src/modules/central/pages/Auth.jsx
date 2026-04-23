import { useState } from "react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    // 🔐 FIXED MHA CREDENTIALS
    const ADMIN_EMAIL = "mha@india.gov";
    const ADMIN_PASSWORD = "mha123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("mha_auth", "true");
      window.location.href = "/central";
    } else {
      alert("Invalid MHA credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <h4 className="mb-3 text-center">🏛️ MHA Login</h4>

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}