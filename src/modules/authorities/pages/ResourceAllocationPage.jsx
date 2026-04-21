import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import Button from "../components/common/Button";

export default function ResourceAllocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    fetchIncident();
  }, []);

  const fetchIncident = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Incident fetch error:", error);
      setLoading(false);
      return;
    }

    setIncident(data);
    fetchResources(data);
  };

  const fetchResources = async (incidentData) => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("district", incidentData.district);

    if (error) {
      console.error("Resources fetch error:", error);
      setResources([]);
    } else {
      setResources(data || []);
    }

    setLoading(false);
  };

  // ✅ STRICT INPUT CONTROL (NO OVERFLOW)
  const handleChange = (resourceId, value, max) => {
    let num = Number(value);

    if (num < 0) num = 0;
    if (num > max) num = max;

    setSelected((prev) => ({
      ...prev,
      [resourceId]: num,
    }));
  };

  const handleAllocate = async () => {
    if (!incident) return;

    try {
      setAllocating(true);

      const allocated = [];

      for (const res of resources) {
        const count = selected[res.id] || 0;

        // ❌ HARD BLOCK (NO CHEATING ALLOWED)
        if (count > res.available_quantity) {
          alert(`Only ${res.available_quantity} ${res.name} available`);
          setAllocating(false);
          return;
        }

        if (count > 0) {
          // update stock safely
          await supabase
            .from("resources")
            .update({
              available_quantity: res.available_quantity - count,
            })
            .eq("id", res.id);

          allocated.push({
            resource_id: res.id,
            name: res.name,
            count,
          });
        }
      }

      // save allocation
      await supabase
        .from("incidents")
        .update({
          resources_allocated: allocated,
        })
        .eq("id", incident.id);

      navigate(`/authorities/incident/${incident.id}`, {
        state: { message: "Resources allocated successfully" },
      });

    } catch (err) {
      console.error("Allocation error:", err);
      alert("Allocation failed");
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="p-6 text-white">

      <h2 className="text-2xl font-semibold mb-6">
        Allocate Resources
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {resources.map((res) => {
            const count = selected[res.id] || 0;

            return (
              <div
                key={res.id}
                className="bg-slate-800 p-5 rounded-xl border border-slate-600 shadow-md hover:border-slate-400 transition"
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {res.name}
                  </h3>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      res.available_quantity === 0
                        ? "bg-red-600"
                        : res.available_quantity <= 3
                        ? "bg-yellow-500 text-black"
                        : "bg-green-600"
                    }`}
                  >
                    Available: {res.available_quantity}
                  </span>
                </div>

                {/* INPUT */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-400">
                    Allocate quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={res.available_quantity}
                    value={count}
                    disabled={res.available_quantity === 0}
                    onChange={(e) =>
                      handleChange(
                        res.id,
                        e.target.value,
                        res.available_quantity
                      )
                    }
                    className="w-full p-2 rounded-md bg-slate-700 border border-slate-500 focus:outline-none focus:border-blue-400 text-center"
                  />
                </div>

                {/* WARNING */}
                {count > res.available_quantity && (
                  <p className="text-red-400 text-xs mt-2">
                    Cannot exceed available quantity
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-8 flex gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate(`/authorities/incident/${id}`)}
        >
          Back
        </Button>

        <Button
          variant="primary"
          onClick={handleAllocate}
          disabled={allocating}
        >
          {allocating ? "Allocating..." : "Allocate Resources"}
        </Button>
      </div>
    </div>
  );
}