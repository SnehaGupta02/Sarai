import { Outlet } from "react-router-dom";
import SeocNavbar from "./SeocNavbar";
import SeocSidebar from "./SeocSidebar";

export default function SeocLayout() {
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">

      {/* NAVBAR */}
      <SeocNavbar />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <SeocSidebar />

        {/* CONTENT */}
        <div className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}