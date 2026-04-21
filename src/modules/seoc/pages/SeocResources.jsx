import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocResources() {
  const { id } = useParams();

  const [resources, setResources] = useState([]);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: resData } = await supabase
      .from("resources")
      .select("*");

    const { data: incidentData } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    setResources(resData || []);
    setIncident(incidentData);
  };

  const allocate = async (resource) => {
    await supabase
      .from("incidents")
      .update({
        resources_allocated: resource,
      })
      .eq("id", id);

    alert("Resource Allocated");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Allocate Resources
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {resources.map((r) => (
          <div
            key={r.id}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700"
          >
            <p className="font-semibold">{r.name}</p>

            {/* 🔥 RECOMMENDATION */}
            {r.district === incident?.district && (
              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                Nearby Recommended
              </span>
            )}

            <button
              onClick={() => allocate(r)}
              className="mt-3 bg-yellow-600 px-3 py-1 rounded"
            >
              Allocate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}