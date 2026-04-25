export default function StatusBadge({ status }) {
  let color = "";

  switch (status) {
    case "approved":
      color = "bg-green-500";
      break;
    case "pending":
      color = "bg-yellow-500";
      break;
    case "rejected":
      color = "bg-red-500";
      break;
    default:
      color = "bg-gray-500";
  }

  return (
    <span className={`${color} px-3 py-1 rounded-full text-sm`}>
      {status}
    </span>
  );
}