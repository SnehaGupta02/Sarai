import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

export default function VolunteerManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [approved, setApproved] = useState([]);
  const [selected, setSelected] = useState([]);

  // 🔥 Haversine Formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🔹 Generate Team Name
  const generateTeamName = () => {
    if (!incident) return "";

    const type = incident.disaster_type
      ? incident.disaster_type.charAt(0).toUpperCase() +
        incident.disaster_type.slice(1)
      : "Incident";

    return `${incident.location} ${type} Volunteer Team`;
  };

  // 🔹 Fetch Incident
  const fetchIncident = async () => {
    const { data } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    setIncident(data);
  };

  // 🔹 Fetch Volunteers
  const fetchVolunteers = async () => {
    const { data } = await supabase.from("volunteers").select("*");

    if (!data || !incident) return;

    const updated = data.map((v) => {
      if (!v.lat || !v.lng || !incident.lat || !incident.lng) {
        return { ...v, distance: null, eligible: false };
      }

      const dist = getDistance(
        incident.lat,
        incident.lng,
        v.lat,
        v.lng
      );

      return {
        ...v,
        distance: dist.toFixed(2),
        eligible: dist <= 5,
      };
    });

    setVolunteers(
      updated.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    );
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  useEffect(() => {
    if (incident) fetchVolunteers();
  }, [incident]);

  // ✅ Approve
  const approveVolunteer = async (v) => {
    if (approved.find((a) => a.id === v.id)) return;

    setApproved((prev) => [...prev, v]);

    await supabase.from("volunteer_requests").insert({
      volunteer_id: v.id,
      incident_id: id,
      distance_km: v.distance,
      status: "approved",
    });
  };

  // ❌ Reject
  const rejectVolunteer = async (v) => {
    await supabase.from("volunteer_requests").insert({
      volunteer_id: v.id,
      incident_id: id,
      distance_km: v.distance,
      status: "rejected",
    });
  };

  // ☑ Select
  const toggleSelect = (v) => {
    if (selected.includes(v.id)) {
      setSelected(selected.filter((id) => id !== v.id));
    } else {
      setSelected([...selected, v.id]);
    }
  };

  // 🚀 Create Team
  const createTeam = async () => {
    const teamName = generateTeamName();

    if (!teamName || selected.length === 0) return;

    const { data } = await supabase
      .from("volunteer_teams")
      .insert({
        incident_id: id,
        team_name: teamName,
      })
      .select()
      .single();

    const teamId = data.id;

    const members = selected.map((vid) => ({
      team_id: teamId,
      volunteer_id: vid,
    }));

    await supabase.from("volunteer_team_members").insert(members);

    alert("✅ Volunteer Team Created!");
    setSelected([]);
  };

  return (
    <div className="flex-1 p-6 text-white space-y-6">

      {/* HEADER */}
      <div className="bg-slate-800 p-5 rounded-xl flex justify-between">
        <h1 className="text-xl font-semibold">Manage Volunteers</h1>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* VOLUNTEERS */}
      <div className="bg-slate-800 p-5 rounded-xl space-y-3">
        <h2 className="text-lg font-semibold">Nearby Volunteers</h2>

        {volunteers.map((v) => {
          const isApproved = approved.find((a) => a.id === v.id);

          return (
            <div
              key={v.id}
              className="flex justify-between items-center bg-slate-700 p-3 rounded-lg"
            >
              <div>
                <p>{v.name}</p>
                <p className="text-sm text-gray-400">
                  {v.distance ? `${v.distance} km` : "No location"}
                </p>
              </div>

              <div className="flex gap-2 items-center">

                {v.eligible ? (
                  <span className="text-green-400">Within 5km</span>
                ) : (
                  <span className="text-red-400">Too far</span>
                )}

                {isApproved ? (
                  <span className="text-blue-400 font-medium">
                    Approved ✅
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => approveVolunteer(v)}
                      disabled={!v.eligible}
                      className={`px-2 py-1 rounded ${
                        v.eligible
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectVolunteer(v)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* APPROVED */}
      <div className="bg-slate-800 p-5 rounded-xl space-y-3">
        <h2 className="text-lg font-semibold">Approved Volunteers</h2>

        {approved.map((v) => (
          <div key={v.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={() => toggleSelect(v)}
            />
            <p>{v.name}</p>
          </div>
        ))}
      </div>

      {/* CREATE TEAM */}
      <div className="bg-slate-800 p-5 rounded-xl space-y-3">
        <h2 className="text-lg font-semibold">Create Team</h2>

        <p className="text-slate-300">
          Team Name:{" "}
          <span className="text-indigo-400 font-medium">
            {generateTeamName()}
          </span>
        </p>

        <button
          onClick={createTeam}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Create Volunteer Team
        </button>
      </div>
    </div>
  );
}