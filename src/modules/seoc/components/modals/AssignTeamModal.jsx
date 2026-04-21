import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

export default function AssignTeamModal({
  isOpen,
  onClose,
  incident,
  onAssign,
}) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
      setSelectedTeam(null);
    }
  }, [isOpen]);

  const fetchTeams = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("availability_status", "available")
      .contains("skills", [incident.disaster_type]);

    if (error) {
      console.error("❌ Team fetch error:", error);
      setTeams([]);
    } else {
      setTeams(data);
    }

    setLoading(false);
  };

  const assignTeam = async () => {
    if (!selectedTeam) return;

    // 🔥 Update incident with new team
    const updatedIds = [
      ...(incident.assigned_team_ids || []),
      selectedTeam.id,
    ];

    const { error } = await supabase
      .from("incidents")
      .update({ assigned_team_ids: updatedIds })
      .eq("id", incident.id);

    if (error) {
      console.error("❌ Assign error:", error);
    } else {
      // 🔥 Update team status
      await supabase
        .from("teams")
        .update({ availability_status: "busy" })
        .eq("id", selectedTeam.id);

      onAssign(selectedTeam);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-xl w-[400px] border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Add Team (SEOC)</h2>

        {loading ? (
          <p>Loading...</p>
        ) : teams.length === 0 ? (
          <p className="text-slate-400">No teams available</p>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`p-2 rounded cursor-pointer ${
                  selectedTeam?.id === team.id
                    ? "bg-blue-600"
                    : "bg-slate-700"
                }`}
              >
                <p>{team.name}</p>
                <p className="text-xs text-slate-400">
                  {team.team_type} • 👥 {team.members_count}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={assignTeam}
            disabled={!selectedTeam}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}