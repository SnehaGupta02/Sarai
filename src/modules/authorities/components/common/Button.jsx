export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
}) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md",

    secondary:
      "bg-slate-700/60 backdrop-blur text-white border border-slate-600",

    outline:
      "border border-blue-400 text-blue-400 bg-transparent",

    success:
      "bg-green-600 text-white",

    danger:
      "bg-red-600 text-white",
  };

  const hover = {
    primary: "hover:scale-105 hover:shadow-lg",
    secondary: "hover:bg-slate-600",
    outline: "hover:bg-blue-500 hover:text-white",
    success: "hover:bg-green-500",
    danger: "hover:bg-red-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        !disabled ? hover[variant] : "opacity-50 cursor-not-allowed"
      }`}
    >
      {children}
    </button>
  );
}