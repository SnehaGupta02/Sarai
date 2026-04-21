import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function IncidentTable({ filters }) {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const fetchIncidents = async () => {
    setLoading(true);

    let query = supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    // Optional filters (safe for future use)
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.severity) {
      query = query.eq("severity", filters.severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching incidents:", error);
    } else {
      setIncidents(data);
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      {loading ? (
        <p>Loading...</p>
      ) : incidents.length === 0 ? (
        <p>No incidents found</p>
      ) : (
        incidents.map((i) => {
          const isActionable =
            i.is_escalated && i.status !== "resolved";

          return (
            <div
              key={i.id}
              className="flex justify-between items-center p-3 border-b border-slate-700 hover:bg-slate-700 transition"
            >
              {/* LEFT INFO */}
              <div>
                <p className="font-semibold">{i.location}</p>

                <p className="text-sm text-gray-400">
                  {i.disaster_type} | {i.district}
                </p>

                {/* TAGS */}
                <div className="flex gap-2 mt-1 text-xs">
                  {i.is_escalated && (
                    <span className="bg-red-600 px-2 py-1 rounded">
                      ESCALATED
                    </span>
                  )}

                  <span className="bg-slate-600 px-2 py-1 rounded">
                    {i.status}
                  </span>

                  {i.severity === "high" && (
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded">
                      HIGH
                    </span>
                  )}

                  {i.resolved_by && (
                    <span className="bg-green-600 px-2 py-1 rounded">
                      Resolved by {i.resolved_by}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT ACTION */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => navigate(`/seoc/incident/${i.id}`)}
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                  View
                </button>

                {!isActionable && i.is_escalated && (
                  <span className="text-xs text-gray-400">
                    Closed
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}