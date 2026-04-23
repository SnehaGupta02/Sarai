import { supabase } from "../../../lib/supabase";
import { useState } from "react";
import toast from "react-hot-toast";

export default function InterventionBox({ selectedIncident, incidents, refresh }) {
  const [loading, setLoading] = useState(null);

  const incident = incidents.find(i => i.id === selectedIncident);

  // 🧠 RISK SCORE (ONLY FOR ACTIVE INCIDENTS)
  const getRiskScore = () => {
    if (!incident || incident.status === "resolved") return 0;

    let score = 0;

    // Severity
    if (incident.severity === "high") score += 3;
    else if (incident.severity === "medium") score += 2;
    else score += 1;

    // Verification
    if (incident.status === "verified") score += 2;

    // Time escalation
    if (incident.created_at) {
      const minutes =
        (Date.now() - new Date(incident.created_at)) / (1000 * 60);
      if (minutes > 30) score += 2; // stronger escalation
    }

    return score;
  };

  const riskScore = getRiskScore();

  // ✅ FINAL DECISION
  const canIntervene =
    incident &&
    incident.status !== "resolved" &&
    riskScore >= 4;

  // 💡 RECOMMENDATION (CONSISTENT)
  const getRecommendation = () => {
    if (!incident) return "";

    if (incident.status === "resolved") {
      return "✅ Incident already resolved — no action needed";
    }

    if (riskScore >= 6) return "🚨 Deploy NDRF + ARMY immediately";
    if (riskScore >= 4) return "⚠️ Deploy NDRF";
    if (riskScore >= 3) return "👀 Monitor closely";
    return "✅ No immediate action needed";
  };

  const handleAction = async (type) => {
    if (!incident) {
      toast.error("⚠️ Please select an incident first");
      return;
    }

    if (!canIntervene) {
      toast.error("⚠️ Intervention not allowed");
      return;
    }

    setLoading(type);

    try {
      const { error } = await supabase
        .from("actions")
        .insert([
          {
            incident_id: incident.id,
            action_type: type,
            priority: incident.severity,
            command_status: "sent",
            issued_by: "MHA",
            created_at: new Date()
          }
        ]);

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }

      toast.success(`✅ ${type} deployed`);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("❌ Action failed");
    }

    setLoading(null);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>⚙️ Intervention Panel</h5>

      {/* INCIDENT */}
      {incident ? (
        <div className="mb-3 p-2 rounded bg-dark border border-secondary">
          <small className="text-muted">Selected Incident</small>
          <div className="fw-bold">
            🚨 {incident.disaster_type} ({incident.district})
          </div>
        </div>
      ) : (
        <div className="text-warning mb-3">
          ⚠️ Select an incident first
        </div>
      )}

      {/* RESOLVED MESSAGE */}
      {incident && incident.status === "resolved" && (
        <div className="text-success mb-2">
          ✅ Incident already resolved — no intervention required
        </div>
      )}

      {/* ACTIVE INCIDENT INFO */}
      {incident && incident.status !== "resolved" && (
        <>
          {/* RISK SCORE */}
          <div className="mb-2 text-info">
            📊 Risk Score: <b>{riskScore}</b>
          </div>

          {/* RECOMMENDATION */}
          <div className="mb-3 text-primary">
            💡 {getRecommendation()}
          </div>

          {/* BLOCK MESSAGE */}
          {!canIntervene && (
            <div className="text-warning mb-2">
              ⚠️ Intervention locked — insufficient risk level (Score &lt; 4)
            </div>
          )}
        </>
      )}

      {/* BUTTONS */}
      <div className="row">
        {["NDRF", "ARMY", "FUNDS"].map(type => (
          <div className="col-md-4" key={type}>
            <button
              className={`w-100 mb-2 ${
                type === "NDRF"
                  ? "btn btn-danger"
                  : type === "ARMY"
                  ? "btn btn-warning"
                  : "btn btn-success"
              }`}
              onClick={() => handleAction(type)}
              disabled={!canIntervene || loading === type}
            >
              {loading === type ? "Processing..." : type}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}