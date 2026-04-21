import { useEffect, useState } from "react";

export default function LiveStreamPlayer() {
  const [liveData, setLiveData] = useState({
    people: 0,
    vehicles: 0,
    alert: "No alerts",
  });

  // 🔥 TEMP: simulate API (replace later with real YOLO API)
  useEffect(() => {
    const interval = setInterval(() => {
      // this will be replaced by real backend call
      setLiveData({
        people: Math.floor(Math.random() * 50),
    
        alert: "Monitoring...",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

 return (
  <div className="h-[300px] flex flex-col justify-center items-center">
    
    <h3 className="font-semibold mb-3">Live Drone Feed</h3>

    <p className="text-slate-400 text-sm">
      👥 People detected: {liveData.people}
    </p>

    <p className="text-slate-400 text-sm">
      ⚠️ Alert: {liveData.alert}
    </p>

    <p className="text-xs text-slate-500 mt-2">
      (Real-time AI data)
    </p>

  </div>
);
}