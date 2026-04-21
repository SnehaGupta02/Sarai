import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

export default function SeocDeployments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setLoading(true);

    // 🔥 Step 1: Get all incidents that have assigned teams
    const { data: incidents, error } = await supabase
      .from("incidents")
      .select("*")
      .not("assigned_team_ids", "is", null);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // 🔥 Step 2: Flatten team IDs
    const allTeamIds = [
      ...new Set(
        incidents.flatMap((i) => i.assigned_team_ids || [])
      ),
    ];

    // 🔥 Step 3: Fetch teams
    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .in("team_id", allTeamIds);

    // 🔥 Step 4: Merge data
    const deployments = [];

    incidents.forEach((incident) => {
      (incident.assigned_team_ids || []).forEach((teamId) => {
        const team = teams.find((t) => t.team_id === teamId);

        if (team) {
          deployments.push({
            team_name: team.team_name,
            team_district: team.district,
            incident_location: incident.location,
            incident_type: incident.disaster_type,
            incident_district: incident.district,
            status: incident.status,
            time: incident.created_at,
          });
        }
      });
    });

    setData(deployments);
    setLoading(false);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          State Deployments
        </h2>
        <p className="text-sm text-gray-400">
          All teams currently assigned across incidents
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-6 bg-slate-700 text-sm font-semibold p-3">
          <span>Team</span>
          <span>Team District</span>
          <span>Incident</span>
          <span>Incident District</span>
          <span>Status</span>
          <span>Time</span>
        </div>

        {/* DATA */}
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : data.length === 0 ? (
          <p className="p-4 text-gray-400">
            No deployments yet
          </p>
        ) : (
          data.map((d, index) => (
            <div
              key={index}
              className="grid grid-cols-6 items-center p-3 border-t border-slate-700 text-sm"
            >
              <span className="font-medium">
                {d.team_name}
              </span>

              <span>{d.team_district}</span>

              <span>
                {d.incident_type} – {d.incident_location}
              </span>

              <span>{d.incident_district}</span>

              <span>
                {d.status === "resolved" ? (
                  <span className="bg-green-600 text-xs px-2 py-1 rounded">
                    Resolved
                  </span>
                ) : (
                  <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(d.time).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}