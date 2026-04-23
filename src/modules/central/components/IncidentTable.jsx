export default function IncidentTable({ 
  incidents = [], 
  setSelectedIncident,
  selectedIncident 
}) {
  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">📊 Incident Reports</h5>

      <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
  <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Type</th>
              <th>District</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No incidents available
                </td>
              </tr>
            ) : (
              incidents.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => setSelectedIncident(i.id)}
                  style={{
                    cursor: "pointer",
                    background:
                      selectedIncident === i.id
                        ? "#1e293b"
                        : "transparent",
                    transition: "0.2s"
                  }}
                >
                  <td>{i.disaster_type}</td>
                  <td>{i.district}</td>

                  {/* 🔴 SEVERITY */}
                  <td>
                    <span
                      className={`badge ${
                        i.severity === "high"
                          ? "bg-danger"
                          : i.severity === "medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {i.severity}
                    </span>
                  </td>

                  {/* 🟢 STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        i.status === "resolved"
                          ? "bg-success"
                          : i.status === "pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}