import { useEffect, useState } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import GoogleMapView from "../components/dashboard/GoogleMapView";
import { supabase } from "/src/lib/supabase";

export default function SeocDashboard() {
  const [incidents, setIncidents] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    escalated: 0,
    critical: 0,
    resolvedByState: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setIncidents(data);

    const total = data.length;

    const escalated = data.filter(
      (i) => i.escalation_level === "district_to_state"
    ).length;

    const critical = data.filter(
      (i) =>
        i.escalation_level === "district_to_state" &&
        i.severity === "high" &&
        i.status !== "resolved"
    ).length;

    const resolvedByState = data.filter(
      (i) => i.resolved_by === "state"
    ).length;

    setStats({ total, escalated, critical, resolvedByState });
  };

  return (
    <div> {/* ✅ ROOT WRAPPER */}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Incidents" value={stats.total} />
        <StatsCard label="Escalated" value={stats.escalated} />
        <StatsCard label="Critical" value={stats.critical} />
        <StatsCard label="Resolved by State" value={stats.resolvedByState} />
      </div>

      {/* MAP */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          State Incident Overview
        </h2>
        <GoogleMapView incidents={incidents} />
      </div>

    </div>
  );
}