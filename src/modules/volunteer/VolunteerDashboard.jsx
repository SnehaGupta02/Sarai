import { useEffect, useState } from "react";
import { getVolunteers } from "./services/volunteerService";
import StatusBadge from "./components/StatusBadge";

export default function VolunteerDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getVolunteers();
    setData(res);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl mb-4">Volunteer Dashboard</h2>

      {data.map((v) => (
        <div
          key={v.id}
          className="border border-gray-600 p-4 mb-3 rounded-lg"
        >
          <p className="font-semibold">{v.name}</p>
          <p className="text-sm text-gray-300">{v.role}</p>

          {/* ✅ Status Badge */}
          <StatusBadge status={v.status} />
        </div>
      ))}
    </div>
  );
}