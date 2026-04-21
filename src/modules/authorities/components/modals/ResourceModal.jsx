import { useState, useEffect } from "react";
import Button from "../common/Button";
import { supabase } from "/src/lib/supabase";

export default function ResourceModal({ isOpen, onClose, onAllocate, incident }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    if (isOpen && incident) {
      fetchResources();
    }
  }, [isOpen, incident]);

  // ✅ Fetch resources from DB
  const fetchResources = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("district", incident.district);

    if (error) {
      console.error("❌ Fetch resources error:", error);
      setResources([]);
    } else {
      // add count field for UI
      const formatted = data.map(r => ({
        ...r,
        count: 0
      }));
      setResources(formatted);
    }

    setLoading(false);
  };

  const handleChange = (index, value) => {
    const updated = [...resources];
    updated[index].count = Number(value);
    setResources(updated);
  };

  const handleAllocate = async () => {
    if (!incident) return;

    // 🔒 validation
    if (!incident.assigned_team_ids || incident.assigned_team_ids.length === 0) {
      alert("Assign a team before allocating resources.");
      return;
    }

    const selected = resources.filter(r => r.count > 0);

    if (selected.length === 0) {
      alert("Select at least one resource.");
      return;
    }

    // ❌ check availability
    for (let r of selected) {
      if (r.count > r.available_quantity) {
        alert(`Not enough ${r.name} available`);
        return;
      }
    }

    try {
      setAllocating(true);

      // 🔥 STEP 1: Deduct resources
      for (let r of selected) {
        const { error } = await supabase
          .from("resources")
          .update({
            available_quantity: r.available_quantity - r.count
          })
          .eq("id", r.id);

        if (error) throw error;
      }

      // 🔥 STEP 2: Save in incidents
      const incidentPayload = selected.map(r => ({
        resource_id: r.id,
        name: r.name,
        count: r.count
      }));

      const { error: incidentError } = await supabase
        .from("incidents")
        .update({
          resources_allocated: incidentPayload
        })
        .eq("id", incident.id);

      if (incidentError) throw incidentError;

      // 🔥 STEP 3: Insert logs
      for (let r of selected) {
        const { error } = await supabase
          .from("resource_logs")
          .insert({
            incident_id: incident.id,
            resource_id: r.id,
            allocated_quantity: r.count,
            action_type: "allocated"
          });

        if (error) throw error;
      }

      alert("Resources allocated successfully");

      onAllocate(incidentPayload);
      onClose();

    } catch (err) {
      console.error("❌ Allocation error:", err.message);
      alert("Allocation failed");
    } finally {
      setAllocating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-[420px] border border-slate-700 shadow-xl">

        <h2 className="text-lg font-semibold mb-4 text-white">
          Allocate Resources
        </h2>

        {/* LIST */}
        <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto">
          {loading ? (
            <p className="text-slate-400 text-center">Loading...</p>
          ) : resources.length === 0 ? (
            <p className="text-slate-400 text-center">No resources available</p>
          ) : (
            resources.map((res, index) => (
              <div key={res.id} className="flex justify-between items-center">
                <div>
                  <div className="text-white text-sm">{res.name}</div>
                  <div className="text-xs text-slate-400">
                    Available: {res.available_quantity}
                  </div>
                </div>

                <input
                  type="number"
                  min="0"
                  value={res.count}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-20 p-1 rounded bg-slate-700 text-white border border-slate-600"
                />
              </div>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={allocating}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleAllocate}
            disabled={allocating}
          >
            {allocating ? "Allocating..." : "Allocate"}
          </Button>
        </div>
      </div>
    </div>
  );
}