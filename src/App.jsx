import { Routes, Route, Navigate } from "react-router-dom";

import Gateway from "./pages/Gateway";
import CitizenRoutes from "./modules/citizen/routes/CitizenRoutes";
import AuthoritiesRoutes from "./modules/authorities/routes/AuthoritiesRoutes";
import SeocRoutes from "./modules/seoc/routes/SeocRoutes";

import CentralRoutes from "./modules/central/routes/CentralRoutes";
import ProtectedRoute from "./modules/central/routes/ProtectedRoute";
import Auth from "./modules/central/pages/Auth";

function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route path="/" element={<Gateway />} />

      {/* Public */}
      <Route path="/citizen/*" element={<CitizenRoutes />} />

      {/* Other modules */}
      <Route path="/authorities/*" element={<AuthoritiesRoutes />} />
      <Route path="/seoc/*" element={<SeocRoutes />} />

      {/* Central */}
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