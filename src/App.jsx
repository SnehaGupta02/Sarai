import { Routes, Route } from "react-router-dom";

import Gateway from "./pages/Gateway";
import CitizenRoutes from "./modules/citizen/routes/CitizenRoutes";
import AuthoritiesRoutes from "./modules/authorities/routes/AuthoritiesRoutes";
import SeocRoutes from "./modules/seoc/routes/SeocRoutes";
import RescueRoutes from "./modules/rescue/routes/RescueRoutes";

import { Toaster } from "react-hot-toast";

import CentralRoutes from "./modules/central/routes/CentralRoutes";
import ProtectedRoute from "./modules/central/routes/ProtectedRoute";
import Auth from "./modules/central/pages/Auth";

import VolunteerRegister from "./modules/volunteer/VolunteerRegister";
import VolunteerDashboard from "./modules/volunteer/VolunteerDashboard";

function App() {
  return (
    <>
      {/* ✅ TOASTER (IMPORTANT) */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* MAIN */}
        <Route path="/" element={<Gateway />} />
        <Route path="/citizen/*" element={<CitizenRoutes />} />
        <Route path="/authorities/*" element={<AuthoritiesRoutes />} />
        <Route path="/seoc/*" element={<SeocRoutes />} />
        <Route path="/rescue/*" element={<RescueRoutes />} />

        {/* CENTRAL */}
        <Route path="/central/auth" element={<Auth />} />
        <Route
          path="/central/*"
          element={
            <ProtectedRoute>
              <CentralRoutes />
            </ProtectedRoute>
          }
        />

        {/* VOLUNTEER */}
        <Route path="/volunteer" element={<VolunteerRegister />} />
        <Route path="/volunteer/register" element={<VolunteerRegister />} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </>
  );
}

export default App;