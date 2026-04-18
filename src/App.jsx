import { Routes, Route } from "react-router-dom";
import Gateway from "./pages/Gateway";
import CitizenRoutes from "./modules/citizen/routes/CitizenRoutes";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Gateway />} />
      <Route path="/citizen/*" element={<CitizenRoutes />} />
  
    </Routes>
  );
}

export default App;