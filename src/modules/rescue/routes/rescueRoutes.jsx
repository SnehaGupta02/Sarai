import { Routes, Route } from "react-router-dom";
import Auth from "../pages/Auth";
import RescueHome from "../pages/RescueHome";
import AccessGate from "../pages/AccessGate";

function RescueRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AccessGate />} />
      <Route path="login" element={<Auth />} />
      <Route path="dashboard" element={<RescueHome />} />
    </Routes>
  );
}

export default RescueRoutes;