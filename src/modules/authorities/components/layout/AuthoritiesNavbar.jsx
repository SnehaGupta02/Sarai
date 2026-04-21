import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import { useState } from "react";

export default function AuthoritiesNavbar() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setShowMessage(true);

    setTimeout(() => {
      navigate("/authorities/auth");
    }, 1500);
  };

  return (
    <>
      {/* 🔷 Navbar */}
      <div className="h-[64px] flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shadow-sm">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            A
          </div>
           
          <div>
            <h1 className="text-white text-lg font-semibold leading-none">
              Authorities Panel
            </h1>
            <p className="text-xs text-slate-400">
              Disaster Management Dashboard
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* User badge (static for now) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-slate-300">Online</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.03] transition-all duration-200"
          >
            <span className="text-lg">⎋</span>
            <span className="text-sm font-medium">Logout</span>
          </button>

        </div>
      </div>

      {/* ✅ Toast Message */}
      {showMessage && (
        <div className="fixed top-5 right-5 bg-slate-900 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          <span className="font-medium">Logged out successfully</span>
        </div>
      )}
    </>
  );
}