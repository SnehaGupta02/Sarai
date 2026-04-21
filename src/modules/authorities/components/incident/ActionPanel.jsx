import { useState } from "react";
import Button from "../common/Button";
import { supabase } from "/src/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ActionPanel({
  status,
  setStatus,
  setTeam,
  setResources,
  setEscalated,
  incident,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isResolved = status === "resolved"; // 🔥 GLOBAL LOCK

  // VERIFY
  const handleVerify = async () => {
    if (status === "verified" || isResolved) return;

    setLoading(true);

    const { error } = await supabase
      .from("incidents")
      .update({ status: "verified" })
      .eq("id", incident.id);

    if (error) {
      console.error("❌ Verify error:", error);
    } else {
      setStatus(); // 🔥 refresh from DB
    }

    setLoading(false);
  };

  // MARK HIGH
  const handleCritical = async () => {
    if (status !== "verified" || isResolved) return;

    setLoading(true);

    const { error } = await supabase
      .from("incidents")
      .update({ severity: "high" })
      .eq("id", incident.id);

    if (error) {
      console.error("❌ Severity error:", error);
    } else {
      setTeam(); // 🔥 refresh
    }

    setLoading(false);
  };

  // ✅ ESCALATE (FIXED)
  const handleEscalate = async () => {
    if (incident.severity !== "high" || isResolved) return;

    setLoading(true);

    const { error } = await supabase
      .from("incidents")
      .update({
        is_escalated: true,
        escalation_level: "district_to_state", // ✅ IMPORTANT FIX
        escalated_at: new Date().toISOString(),
      })
      .eq("id", incident.id);

    if (error) {
      console.error("❌ Escalate error:", error);
    } else {
      setEscalated(); // 🔥 refresh
    }

    setLoading(false);
  };

  // ✅ RESOLVE
  const handleResolve = async () => {
    if (status !== "verified" || isResolved) return;

    setLoading(true);

    const { error } = await supabase
      .from("incidents")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        resolved_by: "district", // 🔥 DM side
      })
      .eq("id", incident.id);

    if (error) {
      console.error("❌ Resolve error:", error);
    } else {
      setStatus(); // 🔥 refresh
    }

    setLoading(false);
  };

  // RULES
  const isVerified = status === "verified";
  const isHigh = incident?.severity === "high";
  const hasTeam = incident?.assigned_team_ids?.length > 0;
  const isEscalated = incident?.is_escalated;

  return (
    <div className="flex flex-wrap gap-3">

      {/* VERIFY */}
      <Button
        variant="success"
        onClick={handleVerify}
        disabled={isVerified || loading || isResolved}
      >
        Verify
      </Button>

      {/* ASSIGN TEAM */}
      <Button
        onClick={() =>
          navigate(`/authorities/incident/${incident.id}/assign-team`)
        }
        disabled={!isVerified || isResolved}
      >
        Assign Local Team
      </Button>

      {/* RESOURCES */}
      <Button
        variant="secondary"
        onClick={() =>
          navigate(`/authorities/incident/${incident.id}/allocate-resources`)
        }
        disabled={!hasTeam || isResolved}
      >
        Allocate Resources
      </Button>

      {/* HIGH */}
      <Button
        variant="danger"
        onClick={handleCritical}
        disabled={!isVerified || isHigh || loading || isResolved}
      >
        Mark High Severity
      </Button>

      {/* ESCALATE */}
      <Button
        variant="primary"
        onClick={handleEscalate}
        disabled={!isHigh || isEscalated || loading || isResolved}
      >
        Escalate to SEOC
      </Button>

      {/* RESOLVE */}
      <Button
        variant="success"
        onClick={handleResolve}
        disabled={!isVerified || isResolved || loading}
      >
        Resolve Incident
      </Button>
    </div>
  );
}