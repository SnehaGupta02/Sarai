export default function StatCard({ title, value, onClick }) {
  return (
    <div
      className="card p-3"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h6 >{title}</h6>
      <h3 className="fw-bold">{value}</h3>
    </div>
  );
}