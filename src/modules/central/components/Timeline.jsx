export default function Timeline({ actions = [] }) {
  return (
    <div className="card mb-4 p-3">
      <h5 className="mb-3">🕒 Command Timeline</h5>

      {actions.length === 0 ? (
        <div className="text-muted">
          🚫 No commands yet — issue intervention from MHA
        </div>
      ) : (
        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          {actions.map((a) => (
            <div
              key={a.id}
              className="mb-3 p-3 rounded"
              style={{
                background: "#0f172a",
                borderLeft: `4px solid ${
                  a.command_status === "completed"
                    ? "#22c55e"
                    : a.command_status === "in_progress"
                    ? "#facc15"
                    : "#ef4444"
                }`,
              }}
            >
              {/* 🔥 ACTION */}
              <div className="fw-bold text-info">
                ⚡ {a.action_type || "UNKNOWN"} COMMAND
              </div>

              {/* 👤 WHO */}
              <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                👤 Issued by: <b>{a.issued_by || "MHA"}</b>
              </div>

              {/* 📍 LOCATION */}
              <div className="text-light">
                📍 {a.incidents?.district || "Unknown Location"}
              </div>

              {/* 🚦 STATUS */}
              <div className="mt-1">
                🚦 Status:{" "}
                <span
                  className={`fw-bold ${
                    a.command_status === "completed"
                      ? "text-success"
                      : a.command_status === "in_progress"
                      ? "text-warning"
                      : "text-danger"
                  }`}
                >
                  {a.command_status === "sent" &&
                    "🟥 SENT (MHA Command)"}
                  {a.command_status === "in_progress" &&
                    "🟨 IN PROGRESS (SEOC Working)"}
                  {a.command_status === "completed" &&
                    "🟩 COMPLETED (Executed)"}
                </span>
              </div>
              

              {/* 🔥 PRIORITY */}
              <div>
                🔥{" "}
                <span
                  className={`fw-bold ${
                    a.priority === "high"
                      ? "text-danger"
                      : a.priority === "medium"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {(a.priority || "unknown").toUpperCase()}
                </span>
              </div>

              {/* ⏱ CREATED TIME */}
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                🕒 Created:{" "}
                {a.created_at
                  ? new Date(a.created_at).toLocaleString()
                  : "No timestamp"}
              </div>

              {/* 🔄 UPDATED TIME (NEW) */}
              {a.updated_at && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  🔄 Updated:{" "}
                  {new Date(a.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}