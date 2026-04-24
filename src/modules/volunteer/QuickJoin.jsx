import { useState } from "react";
import { createVolunteer } from "./services/volunteerService";

export default function QuickJoin() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    skill: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    await createVolunteer({
      ...form,
      role: "instant_volunteer",
      trustLevel: "low",
    });

    alert("Joined successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          ⚡ Quick Join
        </h2>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Full Name"
            className="p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            className="p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) => setForm({ ...form, skill: e.target.value })}
          >
            <option value="">Select Skill</option>
            <option>First Aid</option>
            <option>Driving</option>
            <option>General Help</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold transition"
          >
            Join Now
          </button>

        </div>
      </div>
    </div>
  );
}