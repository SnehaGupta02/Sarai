import { useState, useEffect } from "react";
import Button from "../common/Button";
import { supabase } from "/src/lib/supabase";

export default function TeamModal({ isOpen, onClose, onAssign, incident }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && incident) {
      fetchTeams();
      setSelectedTeam(null);
    }
  }, [isOpen, incident]);

  // ✅ FETCH TEAMS (based on district + skill + availability)
  const fetchTeams = async () => {
    if (!incident?.district || !incident?.disaster_type) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("district", incident.district)
      .eq("availability_status", "available")
      .contains("skills", [incident.disaster_type]);

    if (error) {
      console.error("❌ Teams fetch error:", error);
      setTeams([]);
    } else {
      setTeams(data);
    }

    setLoading(false);
  };

  // ✅ ASSIGN TEAM → UPDATE INCIDENT + TEAM STATUS
  const handleAssignTeam = async () => {
    if (!selectedTeam || !incident) return;

    // 🔒 Validation (important)
    if (incident.status !== "verified") {
      alert("Please verify the incident before assigning a team.");
      return;
    }

    try {
      setAssigning(true);

      // 1. Get existing assigned teams
      const { data: incidentData, error: fetchError } = await supabase
        .from("incidents")
        .select("assigned_team_ids")
        .eq("id", incident.id)
        .single();

      if (fetchError) throw fetchError;

      const existing = incidentData?.assigned_team_ids || [];

      // 2. Append team_id (avoid duplicates)
      const updated = existing.includes(selectedTeam.team_id)
        ? existing
        : [...existing, selectedTeam.team_id];

      // 3. Update incident with assigned teams
      const { error: updateError } = await supabase
        .from("incidents")
        .update({ assigned_team_ids: updated })
        .eq("id", incident.id);

      if (updateError) throw updateError;

      // 4. Mark team as busy
      const { error: teamUpdateError } = await supabase
        .from("teams")
        .update({ availability_status: "busy" })
        .eq("team_id", selectedTeam.team_id);

      if (teamUpdateError) throw teamUpdateError;

      // 5. Success
      alert("Team assigned successfully");

      // 6. Update parent state
      onAssign(updated);

      // 7. Close modal
      onClose();

    } catch (err) {
      console.error("❌ Assign error:", err.message);
      alert("Failed to assign team");
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-[400px] border border-slate-700 shadow-xl">

        <h2 className="text-lg font-semibold mb-4 text-white">
          Assign Local Team
        </h2>

        {/* TEAM LIST */}
        <div className="space-y-3 mb-4 max-h-[220px] overflow-y-auto">
          {loading ? (
            <p className="text-slate-400 text-center">
              Loading teams...
            </p>
          ) : teams.length === 0 ? (
            <p className="text-slate-400 text-center">
              No teams available
            </p>
          ) : (
            teams.map((team) => (
              <div
                key={team.team_id}
                onClick={() => setSelectedTeam(team)}
                className={`p-3 rounded-lg cursor-pointer border transition ${
                  selectedTeam?.team_id === team.team_id
                    ? "bg-blue-500 border-blue-400"
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                }`}
              >
                <div className="font-medium text-white">
                  {team.team_name}
                </div>

                <div className="text-xs text-slate-400">
                  {team.team_type}
                </div>

                <div className="text-xs text-slate-500">
                  👥 {team.members_count} members
                </div>
              </div>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={assigning}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleAssignTeam}
            disabled={!selectedTeam || assigning}
          >
            {assigning ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}