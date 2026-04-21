import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocDistrictIncidents() {
  const { district } = useParams();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, [district]);

  const fetchIncidents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("district", district)
      .eq("escalation_level", "district_to_state")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching incidents:", error);
    } else {
      setIncidents(data);
    }

    setLoading(false);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {district} – Escalated Incidents
        </h2>
        <p className="text-sm text-gray-400">
          Select an incident to manage
        </p>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-400">No escalated incidents found</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">

          {incidents.map((i) => (
            <div
              key={i.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3"
            >

              {/* LOCATION */}
              <div>
                <p className="font-semibold text-lg">
                  {i.location}
                </p>
                <p className="text-sm text-gray-400">
                  {i.disaster_type}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex gap-2 text-xs">
                <span className="bg-slate-600 px-2 py-1 rounded">
                  {i.status}
                </span>

                {i.severity === "high" && (
                  <span className="bg-red-600 px-2 py-1 rounded">
                    HIGH
                  </span>
                )}
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() =>
                  navigate(`/seoc/incident/${i.id}`)
                }
                className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
              >
                Manage Incident
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}