import React from "react";

function IncidentCard({ incident, onOpen }) {
  return (
    <div 
      onClick={onOpen}
      className="bg-gray-800 p-4 mb-4 rounded-lg cursor-pointer"
    >
      <h3 className="text-lg font-bold">{incident.title}</h3>

      <p className="text-sm text-gray-300">
        {incident.description}
      </p>

      <p className="text-xs mt-2">
        Priority: {incident.priority}
      </p>

      <p className="text-xs">
        Status: {incident.status}
      </p>
    </div>
  );
}

export default IncidentCard;