import { useNavigate } from "react-router-dom";

export default function IncidentCard({ incident }) {
  const navigate = useNavigate();

  // ✅ STATUS COLOR
  const getStatusStyle = () => {
    if (incident.status === "resolved")
      return "bg-blue-500/20 text-blue-400";

    if (incident.status === "verified")
      return "bg-green-500/20 text-green-400";

    if (incident.severity === "high")
      return "bg-red-500/20 text-red-400";

    return "bg-yellow-500/20 text-yellow-400";
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-3 flex justify-between items-center border border-slate-700">

      <div>
        <h3 className="font-semibold capitalize">
          {incident.disaster_type}
        </h3>

        <p className="text-sm text-slate-400">
          Location: {incident.location}
        </p>

        {/* ✅ STATUS BADGE */}
        <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusStyle()}`}>
          {incident.status}
        </span>
      </div>

      <button
        onClick={() =>
          navigate(`/authorities/incident/${incident.id}`)
        }
        className="bg-slate-700 px-3 py-1 rounded-md text-sm hover:bg-slate-600"
      >
        View Details
      </button>
    </div>
  );
}