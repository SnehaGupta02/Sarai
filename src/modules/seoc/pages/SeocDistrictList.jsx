import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";

export default function SeocDistrictList() {
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("escalation_level", "district_to_state");

    if (error) {
      console.error(error);
      return;
    }

    const grouped = {};

    data.forEach((i) => {
      if (!grouped[i.district]) {
        grouped[i.district] = {
          district: i.district,
          count: 0,
        };
      }

      grouped[i.district].count++;
    });

    setDistricts(Object.values(grouped));
  };

  return (
    <div> {/* ✅ ROOT WRAPPER FIX */}

      <h2 className="text-xl font-semibold mb-4">
        Districts Requiring Action
      </h2>

      {districts.length === 0 ? (
        <p className="text-gray-400">No escalated incidents</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {districts.map((d) => (
            <div
              key={d.district}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4"
            >
              <p className="text-lg font-semibold">
                {d.district}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {d.count} incidents
              </p>

              <button
                onClick={() =>
                  navigate(`/seoc/district/${d.district}`)
                }
                className="mt-3 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                View Incidents
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}