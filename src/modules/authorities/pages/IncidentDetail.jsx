import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "/src/lib/supabase";

import LiveStreamPlayer from "../components/incident/LiveStreamPlayer";
import DetectionPanel from "../components/incident/DetectionPanel";
import ActionPanel from "../components/incident/ActionPanel";
import Button from "../components/common/Button";

import DroneStream from "../../../components/DroneStream";

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchIncident = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("❌ Fetch error:", error);
      setLoading(false);
      return;
    }

    setIncident(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchIncident();
  }, [id, fetchIncident]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      fetchIncident();
      setTimeout(() => setMessage(""), 3000);
    }
  }, [location.state, fetchIncident]);

  const assignDrone = async () => {
    const { error } = await supabase
      .from("incidents")
      .update({
        stream_url: "http://10.57.54.227:8080/live/drone1.m3u8",
      })
      .eq("id", id);

    if (error) {
      console.error("❌ Drone assign failed:", error);
    } else {
      setMessage("🚁 Drone assigned successfully");
      fetchIncident();
    }
  };

  const getStatusStyle = () => {
    if (incident?.status === "resolved")
      return "bg-blue-500/20 text-blue-400";

    if (incident?.status === "verified")
      return "bg-green-500/20 text-green-400";

    if (incident?.severity === "high")
      return "bg-red-500/20 text-red-400";

    return "bg-yellow-500/20 text-yellow-400";
  };

  const getIncidentTitle = () => {
    if (!incident) return "";

    const type = incident.disaster_type
      ? incident.disaster_type.charAt(0).toUpperCase() +
        incident.disaster_type.slice(1)
      : "Incident";

    return `${type} Incident – ${incident.location || ""}`;
  };

  if (loading) {
    return <p className="text-white p-6">Loading...</p>;
  }

  return (
    <div className="flex-1 p-6 text-white space-y-6">

      {/* MESSAGE */}
      {message && (
        <div className="p-3 bg-green-600/20 border border-green-500 rounded-lg text-green-300">
          {message}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">
            {getIncidentTitle()}
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            📍 {incident.location}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle()}`}>
            {incident.status}
          </span>

          {!incident.stream_url && (
            <Button onClick={assignDrone}>
              🚁 Assign Drone
            </Button>
          )}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🔥 LIVE STREAM WITH OVERLAY */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4">

          {incident.stream_url ? (
            <DroneStream>
              <LiveStreamPlayer />
            </DroneStream>
          ) : (
            <p className="text-slate-400 text-center">
              No drone assigned
            </p>
          )}

        </div>

        {/* ANALYSIS */}
        <div className="bg-slate-800 rounded-xl p-4">
          <DetectionPanel incident={incident} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Actions</h3>

          <div className="flex gap-3">
            {/* ✅ NEW BUTTON ADDED */}
            <Button
              onClick={() =>
                navigate(`/authorities/incident/${incident.id}/volunteers`)
              }
            >
              Manage Volunteers
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigate(`/authorities/incident/${incident.id}/status`)
              }
            >
              View Status
            </Button>
          </div>
        </div>

        <ActionPanel
          status={incident.status}
          setStatus={fetchIncident}
          setTeam={fetchIncident}
          setResources={fetchIncident}
          setEscalated={fetchIncident}
          incident={incident}
        />
      </div>
    </div>
  );
}