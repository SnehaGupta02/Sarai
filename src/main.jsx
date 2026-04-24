import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from './App.jsx'
import "./index.css";
//import 'bootstrap/dist/css/bootstrap.min.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "./modules/central/styles/global.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ✅ ADD THIS */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)