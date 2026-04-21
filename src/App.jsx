import { Routes, Route } from "react-router-dom";

import Gateway from "./pages/Gateway";
import CitizenRoutes from "./modules/citizen/routes/CitizenRoutes";
import AuthoritiesRoutes from "./modules/authorities/routes/AuthoritiesRoutes";
import SeocRoutes from "./modules/seoc/routes/SeocRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Gateway />} />

      {/* Public */}
      <Route path="/citizen/*" element={<CitizenRoutes />} />

      {/* Modules */}
      <Route path="/authorities/*" element={<AuthoritiesRoutes />} />
      <Route path="/seoc/*" element={<SeocRoutes />} />
    </Routes>
  );
}

export default App;