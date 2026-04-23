export default function Sidebar() {
  return (
    <div
      className="sidebar text-white p-3 d-flex flex-column"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <h5 className="mb-4 text-center">🏛️ MHA Control</h5>

      <ul className="nav flex-column">
        <li className="nav-item">
          <span className="nav-link text-white">
            📊 Command Center
          </span>
        </li>
      </ul>
    </div>
  );
}