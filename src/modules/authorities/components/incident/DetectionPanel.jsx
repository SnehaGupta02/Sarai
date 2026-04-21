import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

export default function DetectionPanel({ incident }) {
  const [loading, setLoading] = useState(true);
  const [peopleCount, setPeopleCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [severity, setSeverity] = useState("Low");
  const [lastUpdate, setLastUpdate] = useState("N/A");
  const [trend, setTrend] = useState("Stable");

  useEffect(() => {
    if (incident?.id) {
      fetchReportsData();
    }
  }, [incident]);

  const parsePeople = (value) => {
    if (!value) return 0;

    const v = value.toLowerCase();

    if (v.includes("more than 50")) return 60;
    if (v.includes("more than 10")) return 20;

    if (v.includes("-")) {
      const [min, max] = v.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        return Math.floor((min + max) / 2);
      }
    }

    const num = parseInt(v);
    return isNaN(num) ? 0 : num;
  };

  const calculateSeverity = (count) => {
    if (count >= 50) return "High";
    if (count >= 20) return "Medium";
    return "Low";
  };

  const getSeverityColor = (sev) => {
    const s = sev.toLowerCase();
    if (s === "high") return "text-red-400";
    if (s === "medium") return "text-yellow-400";
    return "text-green-400";
  };

  const fetchReportsData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("Reports")
      .select("people, created_at")
      .eq("incident_id", incident.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Reports fetch error:", error);
      setLoading(false);
      return;
    }

    let totalPeople = 0;

    (data || []).forEach((report) => {
      totalPeople += parsePeople(report.people);
    });

    const finalSeverity = calculateSeverity(totalPeople);

    let last = "N/A";
    let minutesAgo = null;

    if (data && data.length > 0) {
      const latest = data[data.length - 1];

      minutesAgo = Math.floor(
        (Date.now() - new Date(latest.created_at)) / 60000
      );

      if (minutesAgo < 1) last = "Just now";
      else if (minutesAgo < 60) last = `${minutesAgo} mins ago`;
      else if (minutesAgo < 1440) {
        const hours = Math.floor(minutesAgo / 60);
        last = `${hours} hr${hours > 1 ? "s" : ""} ago`;
      } else {
        const days = Math.floor(minutesAgo / 1440);
        last = `${days} day${days > 1 ? "s" : ""} ago`;
      }
    }

    let trendValue = "Stable";

    if (data && data.length >= 2) {
      const last5MinReports = data.filter((r) => {
        const diff =
          (Date.now() - new Date(r.created_at)) / 60000;
        return diff <= 5;
      });

      if (last5MinReports.length >= 3) {
        trendValue = "Increasing";
      } else if (minutesAgo > 30) {
        trendValue = "Inactive";
      }
    }

    setReportCount(data?.length || 0);
    setPeopleCount(totalPeople);
    setSeverity(finalSeverity);
    setLastUpdate(last);
    setTrend(trendValue);

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-3">Reports Analysis</h3>

      {loading ? (
        <p className="text-slate-400 text-sm">Fetching data...</p>
      ) : (
        <>
          <p className="text-slate-400 text-sm">
            👥 People affected: {peopleCount}
          </p>

          <p className={`text-sm ${getSeverityColor(severity)}`}>
            ⚠️ Severity: {severity}
          </p>

          <p className="text-slate-400 text-sm">
            📍 {incident.location}
          </p>

          <p className="text-slate-400 text-sm">
            📊 Reports: {reportCount}
          </p>

          <p className="text-slate-400 text-sm">
            🕒 Last update: {lastUpdate}
          </p>

          <p className="text-slate-400 text-sm">
            📈 Trend: {trend}
          </p>
        </>
      )}
    </div>
  );
}