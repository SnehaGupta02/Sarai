export default function StatsCard({ label, value }) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}