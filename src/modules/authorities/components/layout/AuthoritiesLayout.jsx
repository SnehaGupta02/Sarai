import { Outlet } from "react-router-dom";
import AuthoritiesNavbar from "./AuthoritiesNavbar";
import AuthoritiesSidebar from "./AuthoritiesSidebar";


export default function AuthoritiesLayout() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      
      {/* NAVBAR */}
      <AuthoritiesNavbar />

      {/* MAIN LAYOUT */}
      <div className="flex">
        
        {/* SIDEBAR */}
        <AuthoritiesSidebar />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-5">
          <Outlet />
        </div>

      </div>
    </div>
  );
}