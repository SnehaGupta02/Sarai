import { useNavigate } from "react-router-dom";

export default function VolunteerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          🤝 Join as Volunteer
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/volunteer/quick")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition"
          >
            🚀 Help Now
          </button>

          <button
            onClick={() => navigate("/volunteer/register")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
          >
            📝 Register
          </button>
        </div>

      </div>
    </div>
  );
}