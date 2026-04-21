import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

import ActionPanel from "../components/incident/ActionPanel";

export default function IncidentDetail() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch error:", error);
      setLoading(false);
      return;
    }

    setIncident(data);

    if (data.assigned_team_ids?.length) {
      fetchAssignedTeams(data.assigned_team_ids);
    }

    setLoading(false);
  };

  const fetchAssignedTeams = async (teamIds) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .in("id", teamIds);

    if (error) {
      console.error("Team fetch error:", error);
    } else {
      setAssignedTeams(data || []);
    }
  };

  if (loading) {
    return <p className="p-5">Loading...</p>;
  }

  if (!incident) {
    return <p className="p-5 text-red-400">Incident not found</p>;
  }

  return (
    <div className="space-y-6">

      {/* 🔥 PAGE HEADER (NO BOX) */}
      <div>
        <h1 className="text-2xl font-semibold">
          {incident.location}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {incident.district}
        </p>
      </div>

      {/* 🔥 INCIDENT INFO */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
        <p>
          ⚠️ <span className="font-medium">{incident.disaster_type}</span>
        </p>

        <div className="flex gap-2 text-xs">
          <span className="bg-slate-600 px-2 py-1 rounded">
            {incident.status}
          </span>

          {incident.severity === "high" && (
            <span className="bg-red-600 px-2 py-1 rounded">
              HIGH
            </span>
          )}
        </div>
      </div>

      {/* 🔥 ASSIGNED TEAMS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-3">Assigned Teams</h3>

        {assignedTeams.length === 0 ? (
          <p className="text-sm text-gray-400">No teams assigned</p>
        ) : (
          assignedTeams.map((team) => (
            <div key={team.id} className="text-sm mb-2">
              🚑 {team.name} ({team.team_type})
            </div>
          ))
        )}
      </div>

      {/* 🔥 ACTION PANEL */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <ActionPanel
          incident={incident}
          onTeamAssigned={(newTeam) =>
            setAssignedTeams((prev) => [...prev, newTeam])
          }
        />
      </div>

    </div>
  );
}