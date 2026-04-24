import { useState } from "react";

const skillsList = [
  "First Aid",
  "Swimming",
  "Driving",
  "Medical Assistance",
  "Technical",
  "General Help"
];

export default function SkillSelector({ onChange }) {
  const [selected, setSelected] = useState([]);

  const toggleSkill = (skill) => {
    let updated;

    if (selected.includes(skill)) {
      updated = selected.filter((s) => s !== skill);
    } else {
      updated = [...selected, skill];
    }

    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm text-gray-300">Select Skills</p>

     <div className="flex flex-wrap gap-2">
  {skillsList.map((skill) => (
    <button
      key={skill}
      onClick={() => toggleSkill(skill)}
    className={`px-3 py-2 rounded-full text-sm transition ${
  selected.includes(skill)
    ? "bg-blue-500 text-white shadow-md"
    : "bg-slate-700 text-gray-200 hover:bg-slate-600"
}`}
    >
      {skill}
    </button>
  ))}
</div>
    </div>
  );
}