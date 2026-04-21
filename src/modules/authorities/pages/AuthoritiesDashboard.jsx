import { useState, useEffect } from "react";
import { supabase } from "/src/lib/supabase";

import StatsCard from "../components/dashboard/StatsCard";
import IncidentCard from "../components/dashboard/IncidentCard";
import GoogleMapView from "../components/dashboard/GoogleMapView";

export default function AuthoritiesDashboard() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  // 🔥 AUTO REFRESH WHEN PAGE FOCUSED (IMPORTANT)
  useEffect(() => {
    const handleFocus = () => fetchIncidents();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchIncidents = async () => {
    const district = localStorage.getItem("district");
    const role = localStorage.getItem("role");

    let query = supabase.from("incidents").select("*");

    if (role === "district") {
      query = query.ilike("district", district);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      setIncidents(data || []);
    }
  };

  return (
    <div className="flex-1 p-5">

      {/* MAP */}
      <div className="mb-6">
        <GoogleMapView incidents={incidents} />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Incidents" value={incidents.length} />

        {/* ✅ FIXED LOWERCASE */}
        <StatsCard 
          title="Active" 
          value={incidents.filter(i => i.status !== "resolved").length} 
        />

        <StatsCard 
          title="Resolved" 
          value={incidents.filter(i => i.status === "resolved").length} 
        />

        <StatsCard 
          title="Critical" 
          value={incidents.filter(i => i.severity === "high").length} 
        />
      </div>

      {/* INCIDENT LIST */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Incidents</h2>

        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>

    </div>
  );
}