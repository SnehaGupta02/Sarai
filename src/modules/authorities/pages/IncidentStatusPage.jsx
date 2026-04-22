import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";
import Button from "../components/common/Button";

export default function IncidentStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    setIncident(data);

    if (data?.assigned_team_ids?.length > 0) {
      const { data: teamData } = await supabase
        .from("teams")
        .select("*")
        .in("team_id", data.assigned_team_ids);

      setTeams(teamData || []);
    }

    setLoading(false);
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return new Date(time).toLocaleString();
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="p-6 text-white space-y-6">

      <h2 className="text-2xl font-semibold">
        Incident Status Dashboard
      </h2>

      {/* TEAMS */}
      <div>
        <h3 className="text-lg mb-3 text-blue-400">👥 Teams</h3>

        {teams.length === 0 ? (
          <p className="text-slate-400">No teams assigned</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => (
              <div
                key={team.team_id}
                className="bg-slate-800 p-4 rounded-xl border border-slate-600"
              >
                <p className="font-medium">{team.team_name}</p>
                <p className="text-sm text-slate-400">{team.team_type}</p>
                <p className="text-xs text-slate-500">
                  👥 {team.members_count}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESOURCES */}
      <div>
        <h3 className="text-lg mb-3 text-green-400">🚑 Resources</h3>

        {incident?.resources_allocated?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {incident.resources_allocated.map((res, i) => (
              <div
                key={i}
                className="bg-slate-800 p-4 rounded-xl border border-slate-600"
              >
                <p className="font-medium">{res.name}</p>
                <p className="text-sm text-slate-400">
                  Qty: {res.count}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No resources allocated</p>
        )}
      </div>

      {/* 🔥 TIMELINE (NEW PROPER IMPLEMENTATION) */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-3">

        <h3 className="text-lg font-semibold">📡 Incident Timeline</h3>

        <p>
          🚨 Created: {formatTime(incident.created_at)}
        </p>

        {incident.status === "escalated"&& (
          <p className="text-yellow-400">
            ⬆️ Escalated at: {formatTime(incident.escalated_at)}
          </p>
        )}

        {incident.status === "resolved" && (
          <>
            <p className="text-blue-400">
              ✅ Resolved at: {formatTime(incident.resolved_at)}
            </p>

            <p className="text-purple-400">
              👤 Resolved by:{" "}
              {incident.resolved_by
                ? incident.resolved_by.toUpperCase()
                : "N/A"}
            </p>
          </>
        )}

      </div>

      {/* BACK BUTTON */}
      <div>
        <Button onClick={() => navigate(`/authorities/incident/${id}`)}>
          Back
        </Button>
      </div>

    </div>
  );
}