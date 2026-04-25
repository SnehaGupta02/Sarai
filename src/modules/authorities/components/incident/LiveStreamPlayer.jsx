import { useEffect, useState } from "react";

export default function LiveStreamPlayer() {
  const [liveData, setLiveData] = useState({
    people: 0,
    alert: "Monitoring...",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        people: Math.floor(Math.random() * 50),
        alert: "Monitoring...",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm space-y-1 shadow-lg">
      
      <p>👥 {liveData.people} people</p>
      <p>⚠️ {liveData.alert}</p>

    </div>
  );
}