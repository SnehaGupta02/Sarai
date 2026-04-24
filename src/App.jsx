import { Routes, Route } from "react-router-dom";

import Gateway from "./pages/Gateway";
import CitizenRoutes from "./modules/citizen/routes/CitizenRoutes";
import AuthoritiesRoutes from "./modules/authorities/routes/AuthoritiesRoutes";
import SeocRoutes from "./modules/seoc/routes/SeocRoutes";
import RescueRoutes from "./modules/rescue/routes/RescueRoutes";

import CentralRoutes from "./modules/central/routes/CentralRoutes";
import ProtectedRoute from "./modules/central/routes/ProtectedRoute";
import Auth from "./modules/central/pages/Auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Gateway />} />
      <Route path="/citizen/*" element={<CitizenRoutes />} />
      <Route path="/authorities/*" element={<AuthoritiesRoutes />} />
      <Route path="/seoc/*" element={<SeocRoutes />} />
      <Route path="/rescue/*" element={<RescueRoutes />} />
      <Route path="/central/auth" element={<Auth />} />

      <Route
        path="/central/*"
        element={
          <ProtectedRoute>
            <CentralRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;