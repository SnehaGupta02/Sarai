import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Layout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbar />

        <div className="p-4 flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
}