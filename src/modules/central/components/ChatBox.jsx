export default function ChatBox({ selectedIncident, actions = [], incidents = [] }) {

  const incident = incidents.find(i => String(i.id) === String(selectedIncident));

  const incidentActions = actions
    .filter(a => String(a.incident_id) === String(selectedIncident))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔥 latest first

  // 🔥 Generate SEOC updates
  const generateUpdates = () => {
    if (!incident) return [];

    let updates = [];

    // 📢 Initial alert (only once)
    updates.push({
      type: "alert",
      text: `${incident.disaster_type} situation reported in ${incident.district}`,
      time: new Date(incident.created_at || Date.now())
    });

    incidentActions.forEach(a => {

      // 🟥 SENT
      if (a.command_status === "sent") {
        updates.push({
          type: "info",
          text: `${a.action_type} team notified and preparing`,
          time: new Date(a.created_at)
        });
      }

      // 🟨 IN PROGRESS
      if (a.command_status === "in_progress") {
        updates.push({
          type: "progress",
          text: `${a.action_type} team deployed and working on ground`,
          time: new Date(a.updated_at || a.created_at)
        });
      }

      // 🟩 COMPLETED
      if (a.command_status === "completed") {
        updates.push({
          type: "done",
          text: `${a.action_type} operation completed successfully`,
          time: new Date(a.updated_at || a.created_at)
        });
      }
    });

    return updates;
  };

  const updates = generateUpdates();

  return (
    <div className="card p-3">
      <h5>📢 SEOC Updates</h5>

      {!selectedIncident ? (
        <div className="text-muted mt-2">
          Select an incident to view updates
        </div>
      ) : updates.length === 0 ? (
        <div className="text-muted mt-2">
          No updates yet
        </div>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {updates.map((u, index) => (
            <div
              key={index}
              className="mb-2 p-2 rounded"
              style={{
                background:
                  u.type === "alert"
                    ? "#1e293b"
                    : u.type === "progress"
                    ? "#1f2937"
                    : "#0f172a",
                borderLeft: `3px solid ${
                  u.type === "done"
                    ? "#22c55e"
                    : u.type === "progress"
                    ? "#facc15"
                    : "#3b82f6"
                }`
              }}
            >
              {/* MESSAGE */}
              <div style={{ fontSize: "0.9rem" }}>
                📢 {u.text}
              </div>

              {/* TIME (NEW 🔥) */}
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {u.time.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}