export default function IncidentHeader({ incident }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h2>{incident.location}</h2>
      <p>{incident.district}</p>
    </div>
  );
}