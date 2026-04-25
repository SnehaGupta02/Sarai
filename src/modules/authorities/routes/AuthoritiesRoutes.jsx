import { Routes, Route } from "react-router-dom";

import AuthoritiesAuth from "../pages/AuthoritiesAuth";
import AuthoritiesDashboard from "../pages/AuthoritiesDashboard";
import IncidentDetail from "../pages/IncidentDetail";
import TeamSelectionPage from "../pages/TeamSelectionPage";
import AuthoritiesLayout from "../components/layout/AuthoritiesLayout";
import ResourceAllocationPage from "../pages/ResourceAllocationPage";
import IncidentStatusPage from "../pages/IncidentStatusPage";
import AuthoritiesChat from "../pages/AuthoritiesChat";
import VolunteerManagementPage from "../pages/VolunteerManagementPage";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AuthoritiesRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="auth" element={<AuthoritiesAuth />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRole="district">
            <AuthoritiesLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AuthoritiesDashboard />} />

        {/* IMPORTANT: SAME PARAM NAME */}
        <Route path="incident/:id" element={<IncidentDetail />} />

        {/* FIXED ROUTE */}
        <Route path="incident/:id/assign-team" element={<TeamSelectionPage />} />
        <Route
  path="incident/:id/allocate-resources"
  element={<ResourceAllocationPage />}
/>
<Route path="incident/:id/status" element={<IncidentStatusPage />} />
      </Route>
      <Route
  path="incident/:id/volunteers"
  element={<VolunteerManagementPage />}
/>
<Route path="chat" element={<AuthoritiesChat />} />
    </Routes>
  );
}