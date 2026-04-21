import { useNavigate } from "react-router-dom";

export default function SeocSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-[220px] bg-slate-900/50 border-r border-slate-700 p-5 space-y-4">

      <p
        onClick={() => navigate("/seoc/")}
        className="cursor-pointer hover:text-slate-300"
      >
        Dashboard
      </p>

      <p
        onClick={() => navigate("/seoc/districts")}
        className="cursor-pointer hover:text-slate-300"
      >
         Actions Required
      </p>
      <p
  onClick={() => navigate("/seoc/deployments")}
  className="cursor-pointer hover:text-slate-300"
>
  Deployments
</p>

    </div>
  );
}