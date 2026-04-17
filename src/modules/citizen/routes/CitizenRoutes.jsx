//CitizenRoutes.jsx
import { Routes, Route } from "react-router-dom";

import CitizenHome from "../pages/CitizenHome";
import ReportIncident from "../pages/ReportIncident";
import TrackReport from "../pages/TrackReport";
import ViewAlerts from "../pages/ViewAlerts";
import Auth from "../pages/Auth";

import ProtectedRoute from "../../../components/ProtectedRoute";

export default function CitizenRoutes() {
  return (
    <Routes>
      <Route path="auth" element={<Auth />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <CitizenHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="report"
        element={
          <ProtectedRoute>
            <ReportIncident />
          </ProtectedRoute>
        }
      />

      <Route
        path="alerts"
        element={
          <ProtectedRoute>
            <ViewAlerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="track"
        element={
          <ProtectedRoute>
            <TrackReport />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}