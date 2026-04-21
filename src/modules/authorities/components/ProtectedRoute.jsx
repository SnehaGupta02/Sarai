import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function ProtectedRoute({ children, allowedRole }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user;

      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // 🔍 fetch role from your table
      const { data: userData } = await supabase
        .from("authorities_users")
        .select("role")
        .eq("auth_id", currentUser.id)
        .single();

      setRole(userData?.role || null);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Checking access...
      </div>
    );
  }

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/authorities/auth" replace />;
  }

  // ❌ wrong role
  if (allowedRole && role !== allowedRole) {
    // redirect to correct dashboard
    if (role === "district") return <Navigate to="/authorities" replace />;
    if (role === "state") return <Navigate to="/seoc" replace />;
    return <Navigate to="/authorities/auth" replace />;
  }

  // ✅ allowed
  return children;
}