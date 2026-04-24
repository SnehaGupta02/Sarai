import { useState } from "react";
import { createVolunteer } from "./services/volunteerService";
import SkillSelector from "./components/SkillSelector";
import toast from "react-hot-toast";

export default function VolunteerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!form.name || !form.email || !form.phone || !form.location) {
      toast.error("Please fill all required fields ⚠️");
      return;
    }

    if (form.phone.length !== 10) {
      toast.error("Phone must be 10 digits 📱");
      return;
    }

    setLoading(true);

    const { error } = await createVolunteer({
      ...form,
      role: "volunteer",
      trustlevel: "low",
      status: "pending",
    });

    setLoading(false);

    if (error) {
      if (error.message?.includes("duplicate")) {
        toast.error("You already registered ⚠️");
      } else {
        toast.error("Something went wrong ❌");
      }
      return;
    }

    toast.success("Registration submitted for approval ✅");

    // ✅ Reset form after success
    setForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      skills: [],
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          📝 Register as Volunteer
        </h2>

        <div className="flex flex-col gap-4">

          {/* Name */}
          <input
            placeholder="Full Name"
            value={form.name}
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Email */}
          <input
            placeholder="Email"
            value={form.email}
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            maxLength={10}
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: value });
            }}
          />

          {/* Location */}
          <input
            placeholder="Location (City / District)"
            value={form.location}
            className="p-3 rounded-lg bg-slate-700 text-white"
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          {/* Skills */}
          <SkillSelector
            onChange={(skills) =>
              setForm({ ...form, skills })
            }
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

        </div>
      </div>
    </div>
  );
}