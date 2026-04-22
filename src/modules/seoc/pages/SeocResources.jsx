import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocResources() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [incident, setIncident] = useState(null);
  const [inputQty, setInputQty] = useState({});

  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");

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
    const qty = parseInt(inputQty[resource.id] || 0);

    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (qty > resource.available_quantity) {
      alert("Not enough stock");
      return;
    }

    await supabase.from("resource_logs").insert({
      incident_id: id,
      resource_id: resource.id,
      allocated_quantity: qty,
      action_type: "allocated",
    });

    await supabase
      .from("resources")
      .update({
        available_quantity: resource.available_quantity - qty,
      })
      .eq("id", resource.id);

    alert("✅ Resource Allocated");
    fetchData();
  };

  const nearbyDistricts = {
    Noida: ["Delhi", "Ghaziabad"],
    Varanasi: ["Allahabad"],
    Lucknow: ["Kanpur"],
  };

  const districts = useMemo(
    () => ["all", ...new Set(resources.map((r) => r.district))],
    [resources]
  );

  const resourceNames = useMemo(
    () => ["all", ...new Set(resources.map((r) => r.name))],
    [resources]
  );

  const processedResources = useMemo(() => {
    let data = resources.filter((r) => {
      const matchSearch = r.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchDistrict =
        districtFilter === "all" || r.district === districtFilter;

      const matchResource =
        resourceFilter === "all" || r.name === resourceFilter;

      return matchSearch && matchDistrict && matchResource;
    });

    return data
      .map((r) => {
        const isSame = r.district === incident?.district;
        const isNearby =
          nearbyDistricts[incident?.district]?.includes(r.district);

        let proximity = "Distant";
        let priority = 0;

        if (isSame) {
          proximity = "Same District";
          priority = 2;
        } else if (isNearby) {
          proximity = "Nearby District";
          priority = 1;
        }

        return { ...r, proximity, priority };
      })
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return b.available_quantity - a.available_quantity;
      });
  }, [resources, search, districtFilter, resourceFilter, incident]);

  return (
    <div className="space-y-5">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-400 hover:underline"
      >
        ← Back
      </button>

      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Allocate Resources
          </h2>
          <p className="text-sm text-gray-400">
            {incident?.disaster_type} – {incident?.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 px-3 py-2 rounded text-sm border border-slate-700 w-[140px]"
          />

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-900 px-3 py-2 rounded text-sm border border-slate-700"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Districts" : d}
              </option>
            ))}
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="bg-slate-900 px-3 py-2 rounded text-sm border border-slate-700"
          >
            {resourceNames.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All Resources" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE SAME AS BEFORE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
        <div className="min-w-[900px]">

          <div className="grid grid-cols-8 bg-slate-700 text-sm font-semibold px-4 py-3">
            <span>Resource</span>
            <span>Source</span>
            <span>Total</span>
            <span>Available</span>
            <span>Required</span>
            <span>Status</span>
            <span>Location</span>
            <span>Action</span>
          </div>

          {processedResources.map((r) => {
            const isAvailable = r.available_quantity > 0;

            return (
              <div
                key={r.id}
                className="grid grid-cols-8 items-center px-4 py-3 border-t border-slate-700 text-sm"
              >
                <span className="font-medium">{r.name}</span>
                <span>{r.district}</span>
                <span>{r.total_quantity}</span>
                <span className="font-semibold">{r.available_quantity}</span>

                <input
                  type="number"
                  placeholder="Qty"
                  value={inputQty[r.id] || ""}
                  onChange={(e) =>
                    setInputQty({
                      ...inputQty,
                      [r.id]: e.target.value,
                    })
                  }
                  className="bg-slate-900 px-2 py-1 rounded border border-slate-700 w-20"
                />

                <span>
                  {isAvailable ? (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                </span>

                <span>
                  {r.proximity === "Same District" && (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded">
                      Same
                    </span>
                  )}
                  {r.proximity === "Nearby District" && (
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Nearby
                    </span>
                  )}
                  {r.proximity === "Distant" && (
                    <span className="text-gray-400 text-xs">
                      Distant
                    </span>
                  )}
                </span>

                <button
                  disabled={!isAvailable}
                  onClick={() => allocate(r)}
                  className={`px-3 py-1 rounded text-xs ${
                    !isAvailable
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Allocate
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}