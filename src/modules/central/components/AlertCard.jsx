export default function AlertCard({ alert }) {
  return (
    <div className="alert-card d-flex justify-content-between align-items-center mb-3">
      
      <div>
        <h6 className="mb-1 text-danger fw-bold">
          🚨 {alert.title}
        </h6>

        <small className="text-warning">
          📍 {alert.location}
        </small>

        <p className="mb-0 text-light">
          {alert.description}
        </p>
      </div>

      <span className="badge bg-danger px-3 py-2">
        HIGH
      </span>
    </div>
  );
}