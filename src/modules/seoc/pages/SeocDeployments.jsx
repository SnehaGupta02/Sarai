import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

export default function SeocDeployments() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setLoading(true);

    const { data: incidents } = await supabase
      .from("incidents")
      .select("*");

    const { data: resources } = await supabase
      .from("resources")
      .select("*");

    const { data: logs } = await supabase
      .from("resource_logs")
      .select("*");

    console.log("RAW LOGS:", logs); // 🔥 CHECK THIS

    // 🔥 GROUPING
    const groupedMap = {};

    (logs || []).forEach((log) => {
      const key = `${log.incident_id}-${log.resource_id}`;

      if (!groupedMap[key]) {
        groupedMap[key] = {
          incident_id: log.incident_id,
          resource_id: log.resource_id,
          total: 0,
        };
      }

      groupedMap[key].total += log.allocated_quantity;
    });

    console.log("GROUPED:", groupedMap); // 🔥 CHECK THIS

    const deployments = [];

    Object.values(groupedMap).forEach((item) => {
      const incident = incidents.find(
        (i) => i.id === item.incident_id
      );

      const resource = resources.find(
        (r) => r.id === item.resource_id
      );

      if (!incident || !resource) return;

      deployments.push({
        name: resource.name,
        source: resource.district,
        incident: `${incident.disaster_type} – ${incident.location}`,
        district: incident.district,
        status: incident.status,
        quantity: item.total,
      });
    });

    setData(deployments);
    setLoading(false);
  };

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-semibold">
        State Control Room
      </h2>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

        <div className="grid grid-cols-6 bg-slate-700 text-sm font-semibold px-4 py-3">
          <span>Resource</span>
          <span>Source</span>
          <span>Incident</span>
          <span>District</span>
          <span>Status</span>
          <span>Quantity</span>
        </div>

        {loading ? (
          <p className="p-4">Loading...</p>
        ) : data.length === 0 ? (
          <p className="p-4 text-gray-400">
            No data
          </p>
        ) : (
          data.map((d, i) => (
            <div
              key={i}
              className="grid grid-cols-6 px-4 py-3 border-t border-slate-700"
            >
              <span>{d.name}</span>
              <span>{d.source}</span>
              <span>{d.incident}</span>
              <span>{d.district}</span>

              <span>
                {d.status === "resolved" ? (
                  <span className="bg-green-600 px-2 py-1 text-xs rounded">
                    Resolved
                  </span>
                ) : (
                  <span className="bg-yellow-600 px-2 py-1 text-xs rounded">
                    Active
                  </span>
                )}
              </span>

              <span className="font-semibold">
                {d.quantity} units
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}