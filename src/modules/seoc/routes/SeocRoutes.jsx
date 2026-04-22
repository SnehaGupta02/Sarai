import { Routes, Route } from "react-router-dom";

import SeocLayout from "../components/layout/SeocLayout";
import SeocDashboard from "../pages/SeocDashboard";
import SeocDistrictList from "../pages/SeocDistrictList";
import SeocDistrictIncidents from "../pages/SeocDistrictIncidents";
import IncidentDetail from "../pages/IncidentDetail";
import SeocAssignTeam from "../pages/SeocAssignTeam";
import SeocResources from "../pages/SeocResources";
import SeocDeployments from "../pages/SeocDeployments";
import SeocChat from "../pages/SeocChat";

import ProtectedRoute from "../../authorities/components/ProtectedRoute";

export default function SeocRoutes() {
  return (
    <Routes>

      {/* 🔐 PROTECTED + LAYOUT WRAPPER */}
      <Route
        element={
          <ProtectedRoute allowedRole="state">
            <SeocLayout />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD */}
        <Route path="/" element={<SeocDashboard />} />

        {/* DISTRICTS */}
        <Route path="districts" element={<SeocDistrictList />} />
        <Route path="district/:district" element={<SeocDistrictIncidents />} />

        {/* INCIDENT DETAIL */}
        <Route path="incident/:id" element={<IncidentDetail />} />

        {/* TEAM ASSIGN */}
        <Route path="incident/:id/assign-team" element={<SeocAssignTeam />} />

        {/* RESOURCES */}
        <Route path="incident/:id/resources" element={<SeocResources />} />

        {/* 🔥 DEPLOYMENTS (STATE VIEW) */}
        <Route path="deployments" element={<SeocDeployments />} />

      </Route>
<Route path="chat" element={<SeocChat />} />
    </Routes>
  );
}