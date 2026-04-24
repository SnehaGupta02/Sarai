import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

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

      {/* <p
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
      </p> */}

      {/* 💬 Chat (NEW) */}
      <NavLink
        to="/authorities/chat"
        className="block px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
      >
         Chat
      </NavLink>

    </div>
  );
}