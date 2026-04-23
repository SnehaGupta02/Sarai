import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import StatCard from "../components/StatCard";
import AlertCard from "../components/AlertCard";
import IncidentTable from "../components/IncidentTable";
import InterventionBox from "../components/InterventionBox";
import Timeline from "../components/Timeline";
import ChatBox from "../components/ChatBox";

export default function CommandCenter() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [actions, setActions] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filter, setFilter] = useState("all");

  // 🔥 LOAD DATA
  const load = async () => {
    const { data: incidentsData } = await supabase
      .from("incidents")
      .select("*")
      .order("severity", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: actionsData, error: actionsError } = await supabase
      .from("actions")
      .select(`
        *,
        incidents (
          district,
          disaster_type
        )
      `)
      .order("created_at", { ascending: false });

    if (actionsError) {
      console.error("Actions fetch error:", actionsError);
    }

    setIncidents(incidentsData || []);
    setActions(actionsData || []);

    // 🚨 Alerts
    const highAlerts = (incidentsData || [])
      .filter(i => i.severity === "high" && i.status !== "resolved")
      .map(i => ({
        id: i.id,
        title: i.disaster_type,
        location: i.district,
        description: `Severe ${i.disaster_type} in ${i.district}`,
        severity: i.severity
      }));

    setAlerts(highAlerts);
  };

  useEffect(() => {
    load();

    // 🔄 REALTIME UPDATE
    const channel = supabase
      .channel("actions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "actions" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔥 FILTER LOGIC
  const filteredIncidents = incidents.filter(i => {
    if (filter === "high") return i.severity === "high";
    if (filter === "active") return i.status !== "resolved";
    return true;
  });

  return (
    <div className="container-fluid">

      <h2 className="mb-4 fw-bold">🏛️ MHA Command Center</h2>

      {/* 🔷 STATS */}
      <div className="row mb-4">

        <div className="col-md-4">
          <StatCard
            title="Total Incidents"
            value={incidents.length}
            onClick={() => {
              setFilter("all");
              setSelectedIncident(null);
            }}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="High Severity"
            value={incidents.filter(i => i.severity === "high").length}
            onClick={() => {
              setFilter("high");
              setSelectedIncident(null);
            }}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Active Cases"
            value={incidents.filter(i => i.status !== "resolved").length}
            onClick={() => {
              setFilter("active");
              setSelectedIncident(null);
            }}
          />
        </div>

      </div>

      {/* 🚨 ALERTS */}
      <div className="mb-4">
        <h5 className="mb-3 text-danger">🚨 Critical Alerts</h5>

        {alerts.length === 0 ? (
          <p className="text-muted">No critical alerts</p>
        ) : (
          alerts.map(a => <AlertCard key={a.id} alert={a} />)
        )}
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-8">

          {/* ⭐ FILTER TITLE + RESET */}
          <div className="d-flex justify-content-between align-items-center mb-2">

            <h6 className="text-info m-0">
              {filter === "all" && "All Incidents"}
              {filter === "high" && "High Severity Incidents"}
              {filter === "active" && "Active Incidents"}
            </h6>

            {filter !== "all" && (
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => {
                  setFilter("all");
                  setSelectedIncident(null);
                }}
              >
                Reset
              </button>
            )}

          </div>

          {/* 📊 TABLE */}
          <IncidentTable
            incidents={filteredIncidents}
            setSelectedIncident={setSelectedIncident}
            selectedIncident={selectedIncident}
          />

          {/* 🕒 TIMELINE */}
          <Timeline
            actions={actions.filter(
              a => String(a.incident_id) === String(selectedIncident)
            )}
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">

          <InterventionBox
            selectedIncident={selectedIncident}
            incidents={incidents}
            refresh={load}
          />

          <ChatBox
            selectedIncident={selectedIncident}
            actions={actions}
            incidents={incidents}
          />

        </div>

      </div>

    </div>
  );
}