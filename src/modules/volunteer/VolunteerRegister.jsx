import { useState } from "react";
import { createVolunteer } from "./services/volunteerService";
import SkillSelector from "./components/SkillSelector";

export default function VolunteerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("All fields required");
      return;
    }

    await createVolunteer({
      ...form,
      role: "verified_volunteer",
      trustLevel: "high",
      status: "pending",
    });

    alert("Registration submitted!");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-700">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          📝 Register as Volunteer
        </h2>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Full Name"
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <SkillSelector
            onChange={(skills) => setForm({ ...form, skills })}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold transition"
          >
            Submit Registration
          </button>

        </div>
      </div>
    </div>
  );
}