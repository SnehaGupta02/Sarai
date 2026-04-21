import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function AuthoritiesAuth() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    // 🔐 LOGIN
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // 🔍 GET ROLE USING auth_id
    const { data: userData, error: roleError } = await supabase
      .from("authorities_users")
      .select("role, district")
      .eq("auth_id", user.id)
      .single();
      if (roleError || !userData) {
      alert("User not found in authorities table");
      setLoading(false);
      return;
    }
      localStorage.setItem("district", userData.district);
      localStorage.setItem("role", userData.role);
      
    

    // 🚀 REDIRECT BASED ON ROLE
    if (userData.role === "district") {
      navigate("/authorities");
    } else if (userData.role === "state") {
      navigate("/seoc");
    } else {
      alert("Invalid role");
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-[350px] shadow-lg">
        
        <h2 className="text-xl font-semibold mb-6 text-center">
          Authorities Login
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-2 mb-4 rounded bg-slate-700 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 mb-4 rounded bg-slate-700 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}