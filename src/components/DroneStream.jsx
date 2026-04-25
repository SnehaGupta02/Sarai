import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const DroneStream = ({ className = "" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const url = "http://10.57.54.227:8080/live/drone1.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default DroneStream;