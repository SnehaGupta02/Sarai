import React, { useEffect, useState } from "react";

export default function LiveStream({ streamUrl, isLive }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!streamUrl) return;

    function fetchAI() {
      const data = {
        peopleDetected: 5,
        ambulances: 1,
        rescueVans: 2,
        oxygenCylinders: 3,
        medicalKits: 4
      };

      setAnalysis(data);
    }

    fetchAI();

    let interval;
    if (isLive) {
      interval = setInterval(fetchAI, 5000);
    }

    return () => interval && clearInterval(interval);
  }, [streamUrl, isLive]);

  const isMJPEG = isLive && streamUrl.includes("/video");

  return (
    <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden" }}>
      
      {isMJPEG ? (
        <img src={streamUrl} alt="Live Feed" style={{ width: "100%" }} />
      ) : (
        <video src={streamUrl} width="100%" autoPlay loop muted />
      )}

      {/* TOP */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "rgba(0,0,0,0.6)",
        color: "#00eaff",
        padding: "5px",
        borderRadius: "5px"
      }}>
        {analysis ? `🧍 ${analysis.peopleDetected} People` : "⏳ Analyzing..."}
      </div>

      {/* BOTTOM */}
      {analysis && (
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "5px",
          borderRadius: "5px"
        }}>
          🚑 {analysis.ambulances} Ambulances <br />
          🚚 {analysis.rescueVans} Vans <br />
          🧯 {analysis.oxygenCylinders} Oxygen <br />
          💊 {analysis.medicalKits} Kits
        </div>
      )}
    </div>
  );
}