import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocAssignTeam() {
  const { id } = useParams();

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
    // ❌ already assigned to THIS incident
    if (incident.assigned_team_ids?.includes(team.team_id)) {
      alert("⚠️ Team already assigned to this incident");
      return;
    }

    // ❌ busy somewhere else
    if (team.availability_status !== "available") {
      alert("❌ Team is already busy in another incident");
      return;
    }

    const updated = [
      ...(incident.assigned_team_ids || []),
      team.team_id,
    ];

    // update incident
    const { error: incidentError } = await supabase
      .from("incidents")
      .update({ assigned_team_ids: updated })
      .eq("id", id);

    if (incidentError) {
      console.error(incidentError);
      return;
    }

    // update team status
    const { error: teamError } = await supabase
      .from("teams")
      .update({ availability_status: "busy" })
      .eq("team_id", team.team_id);

    if (teamError) {
      console.error(teamError);
      return;
    }

    alert("✅ Team Assigned");

    fetchData(); // refresh UI
  };

  // 🔥 nearby logic (simple static for now)
  const nearbyDistricts = {
    Noida: ["Delhi", "Ghaziabad"],
    Varanasi: ["Allahabad"],
    Lucknow: ["Kanpur"],
  };

  const processedTeams = teams.map((team) => {
    const skillMatch = team.skills?.includes(
      incident?.disaster_type
    );

    const isSame = team.district === incident?.district;

    const isNearby =
      nearbyDistricts[incident?.district]?.includes(
        team.district
      );

    let proximity = "Distant";
    if (isSame) proximity = "Same District";
    else if (isNearby) proximity = "Nearby District";

    let suitability = skillMatch ? "Suitable" : "Not Suitable";

    const isAssigned =
      incident?.assigned_team_ids?.includes(team.team_id);

    return {
      ...team,
      proximity,
      suitability,
      isAssigned,
    };
  });

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Assign Team (State Level)
        </h2>
        <p className="text-sm text-gray-400">
          Select team based on location, capability and availability
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-7 bg-slate-700 text-sm font-semibold p-3">
          <span>Team</span>
          <span>Type</span>
          <span>Members</span>
          <span>Status</span>
          <span>Capability</span>
          <span>Location</span>
          <span>Action</span>
        </div>

        {/* DATA */}
        {processedTeams.map((team) => (
          <div
            key={team.team_id}
            className="grid grid-cols-7 items-center p-3 border-t border-slate-700 text-sm"
          >
            {/* TEAM */}
            <span className="font-medium">
              {team.team_name}
              <div className="text-xs text-gray-400">
                {team.district}
              </div>
            </span>

            {/* TYPE */}
            <span className="text-gray-400">
              {team.team_type}
            </span>

            {/* MEMBERS */}
            <span>👥 {team.members_count}</span>

            {/* STATUS (FIXED CLEAN LOGIC) */}
            <span>
              {team.isAssigned ? (
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">
                  Assigned
                </span>
              ) : team.availability_status === "available" ? (
                <span className="bg-green-600 text-xs px-2 py-1 rounded">
                  Available
                </span>
              ) : (
                <span className="bg-red-600 text-xs px-2 py-1 rounded">
                  Busy
                </span>
              )}
            </span>

            {/* CAPABILITY */}
            <span>
              {team.suitability === "Suitable" ? (
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">
                  Suitable
                </span>
              ) : (
                <span className="text-gray-500 text-xs">
                  Not Suitable
                </span>
              )}
            </span>

            {/* LOCATION */}
            <span>
              {team.proximity === "Same District" && (
                <span className="bg-green-600 text-xs px-2 py-1 rounded">
                  Same district
                </span>
              )}
              {team.proximity === "Nearby District" && (
                <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                  Nearby
                </span>
              )}
              {team.proximity === "Distant" && (
                <span className="text-gray-400 text-xs">
                  Distant
                </span>
              )}
            </span>

            {/* ACTION */}
            <button
              onClick={() => assignTeam(team)}
              disabled={
                team.availability_status !== "available" ||
                team.isAssigned
              }
              className={`px-3 py-1 rounded text-xs ${
                team.availability_status !== "available" ||
                team.isAssigned
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {team.isAssigned
                ? "Assigned"
                : team.availability_status !== "available"
                ? "Busy"
                : "Assign"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}