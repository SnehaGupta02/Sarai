import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import { useState } from "react";

export default function SeocNavbar() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setShowMessage(true);

    setTimeout(() => {
     navigate("/authorities/auth");// 🔥 redirect to SEOC auth page
    }, 1500);
  };

  return (
    <>
      {/* 🔷 Navbar */}
      <div className="h-[60px] backdrop-blur-md bg-slate-800/60 border-b border-slate-700 flex items-center justify-between px-5 text-white">

        {/* LEFT */}
        <div className="font-semibold text-lg">
          SEOC Dashboard
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* STATUS */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-slate-300">Online</span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.03] transition-all duration-200"
          >
            <span className="text-lg">⎋</span>
            <span className="text-sm font-medium">Logout</span>
          </button>

        </div>
      </div>

      {/* ✅ TOAST */}
      {showMessage && (
        <div className="fixed top-5 right-5 bg-slate-900 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl shadow-lg">
          <span className="font-medium">Logged out successfully</span>
        </div>
      )}
    </>
  );
}