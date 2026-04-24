import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase"; // ✅ FIXED IMPORT

function Auth() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "ndrf",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // 🔥 fetch team by role
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("team_type", form.role)
        .single(); // only one record

      if (error) {
        console.error(error);
        alert("Error fetching team");
        return;
      }

      if (!data) {
        alert("No team found");
        return;
      }

      // 🔥 store in localStorage
      localStorage.setItem("team_id", data.team_id);
      localStorage.setItem("team_name", data.team_name);
      localStorage.setItem("rescueUser", JSON.stringify(form));

      console.log("Logged in Team:", data);

      // 🔥 redirect
      navigate("/rescue/dashboard");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-700">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">
            Rescue Control System
          </h1>
          <p className="text-lg">
            NDRF / SDRF Emergency Response Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-2xl w-[380px] shadow-2xl">

          <h2 className="text-2xl font-bold text-center mb-6">
            Rescue Team Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Official Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 mb-6 bg-gray-700 rounded-lg"
          >
            <option value="ndrf">NDRF Team</option>
            <option value="medical">Medical Team</option>
            <option value="fire">Fire Team</option>
            <option value="rescue">Rescue Team</option>
          </select>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Auth;