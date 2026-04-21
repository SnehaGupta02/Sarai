import { useNavigate } from "react-router-dom";

export default function AuthoritiesSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-[220px] bg-slate-900 border-r border-slate-700 min-h-screen p-5 space-y-4 text-white">
      
      <p
        onClick={() => navigate("/authorities/")}
        className="cursor-pointer hover:text-white text-slate-400"
      >
        Dashboard
      </p>

      <p
        onClick={() => navigate("/authorities/")}
        className="cursor-pointer hover:text-white text-slate-400"
      >
        Incidents
      </p>

      <p
        onClick={() => navigate("/authorities/")}
        className="cursor-pointer hover:text-white text-slate-400"
      >
        Resources
      </p>

    </div>
  );
}