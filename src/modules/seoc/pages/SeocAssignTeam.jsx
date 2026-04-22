import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocAssignTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: incidentData } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    const { data: teamData } = await supabase
      .from("teams")
      .select("*");

    setIncident(incidentData);
    setTeams(teamData || []);
  };

  const assignTeam = async (team) => {
    // ❌ prevent assigning busy team
    if (team.availability_status === "busy") {
      alert("Team already assigned");
      return;
    }

    const updated = [
      ...(incident.assigned_team_ids || []),
      team.id,
    ];

    await supabase
      .from("incidents")
      .update({ assigned_team_ids: updated })
      .eq("id", id);

    await supabase
      .from("teams")
      .update({ availability_status: "busy" })
      .eq("id", team.id);

    alert("✅ Team Assigned");

    fetchData(); // refresh UI
  };

  return (
    <div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-400 hover:underline mb-4"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Assign Team (State Level)
        </h2>
        <p className="text-sm text-gray-400">
          Available teams across state
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

        {/* HEADER ROW */}
        <div className="grid grid-cols-6 bg-slate-700 text-sm font-semibold p-3">
          <span>Team Name</span>
          <span>District</span>
          <span>Type</span>
          <span>Members</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* DATA */}
        {teams.map((team) => {
          const isMatch = team.skills?.includes(
            incident?.disaster_type
          );

          const isBusy = team.availability_status === "busy";

          return (
            <div
              key={team.id}
              className="grid grid-cols-6 items-center p-3 border-t border-slate-700 text-sm"
            >
              <span>{team.name}</span>

              <span className="text-gray-400">
                {team.district}
              </span>

              <span className="text-gray-400">
                {team.team_type}
              </span>

              <span>👥 {team.members_count}</span>

              {/* STATUS */}
              <span>
                {isBusy ? (
                  <span className="bg-red-600 text-xs px-2 py-1 rounded">
                    Busy
                  </span>
                ) : (
                  <span className="bg-green-600 text-xs px-2 py-1 rounded">
                    Available
                  </span>
                )}
              </span>

              {/* ACTION */}
              {isBusy ? (
                <span className="text-gray-400 text-xs">
                  Already Assigned
                </span>
              ) : (
                <button
                  onClick={() => assignTeam(team)}
                  className={`px-3 py-1 rounded text-xs ${
                    isMatch
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Assign
                </button>
              )}
            </div>
          );
        })}

      </div>

    </div>
  );
}