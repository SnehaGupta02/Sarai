import { useNavigate } from "react-router-dom";

export default function ActionPanel({ incident }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">

      {/* ADD TEAM → PAGE */}
      <button
        onClick={() =>
          navigate(`/seoc/incident/${incident.id}/assign-team`)
        }
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Team (SEOC)
      </button>

      {/* RESOURCES */}
      <button
        onClick={() =>
          navigate(`/seoc/incident/${incident.id}/resources`)
        }
        className="bg-slate-600 px-4 py-2 rounded hover:bg-slate-700"
      >
        Allocate Resources
      </button>

      {/* STATUS */}
      <button
        onClick={() =>
          navigate(`/seoc/incident/${incident.id}/status`)
        }
        className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
      >
        Update Status
      </button>

    </div>
  );
}