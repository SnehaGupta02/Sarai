import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import Button from "../components/common/Button";

export default function TeamSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (id) fetchIncident();
  }, [id]);

  // 🔥 FETCH INCIDENT
  const fetchIncident = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Incident fetch error:", error);
      setLoading(false);
      return;
    }

    setIncident(data);
    fetchTeams(data);
  };

  // 🔥 SAFE PARSER
  const parseSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) return skills;

    if (typeof skills === "string") {
      try {
        return JSON.parse(skills);
      } catch {
        return [];
      }
    }

    return [];
  };

  // 🔥 FETCH ONLY DISTRICT TEAMS
  const fetchTeams = async (incidentData) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("availability_status", "available")
      .eq("district", incidentData.district);

    if (error) {
      console.error("❌ Teams fetch error:", error);
      setTeams([]);
      setLoading(false);
      return;
    }

    setTeams(data || []);
    setLoading(false);
  };

  // 🔥 RECOMMENDED CHECK (STRICT)
  const isRecommended = (team) => {
    if (!incident) return false;

    const skills = parseSkills(team.skills)
      .map(s => s.toLowerCase().trim());

    const type = incident.disaster_type.toLowerCase().trim();

    return skills.includes(type);
  };

  const handleAssign = async () => {
    if (!selectedTeam || !incident) return;

    if (incident.status !== "verified") {
      alert("Verify incident first");
      return;
    }

    try {
      setAssigning(true);

      const updated = [
        ...(incident.assigned_team_ids || []),
        selectedTeam.team_id,
      ];

      await supabase
        .from("incidents")
        .update({ assigned_team_ids: updated })
        .eq("id", incident.id);

      await supabase
        .from("teams")
        .update({ availability_status: "busy" })
        .eq("team_id", selectedTeam.team_id);

      navigate(`/authorities/incident/${incident.id}`, {
        state: { message: "✅ Team assigned successfully" },
      });

    } catch (err) {
      console.error("❌ Assign error:", err);
      alert("Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Assign Team</h2>

      {loading ? (
        <p>Loading...</p>
      ) : teams.length === 0 ? (
        <p>No teams available</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {teams.map((team) => {
            const recommended = isRecommended(team);

            return (
              <div
                key={team.team_id}
                onClick={() => setSelectedTeam(team)}
                className={`p-4 rounded-xl border cursor-pointer relative ${
                  selectedTeam?.team_id === team.team_id
                    ? "bg-blue-500 border-blue-400"
                    : "bg-slate-700 border-slate-600"
                }`}
              >
                {/* ⭐ BADGE ONLY IF MATCH EXISTS */}
                {recommended && (
                  <span className="absolute top-2 right-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                    ⭐ Recommended
                  </span>
                )}

                <div className="font-medium">{team.team_name}</div>
                <div className="text-sm text-slate-300">{team.team_type}</div>

                <div className="text-xs text-slate-400">
                  👥 {team.members_count}
                </div>

                <div className="text-xs text-slate-400">
                  📍 {team.district}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/authorities/incident/${id}`)}
        >
          Back
        </Button>

        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={!selectedTeam || assigning}
        >
          {assigning ? "Assigning..." : "Assign Team"}
        </Button>
      </div>
    </div>
  );
}