import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("mha_auth");

  if (!isAuth) {
    return <Navigate to="/central/auth" replace />;
  }

  return children;
}