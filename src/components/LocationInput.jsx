//LocationInput.jsx
import { useEffect, useRef } from "react";

export default function LocationInput({ onSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.google || !containerRef.current) return;

    const autocomplete = document.createElement("gmp-place-autocomplete");

    autocomplete.setAttribute("placeholder", "Search disaster location...");
    autocomplete.style.width = "100%";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(autocomplete);

    // ✅ FIXED EVENT
    autocomplete.addEventListener("gmp-select", async (event) => {
      const place = event.placePrediction;

      if (!place) return;

      // fetch full details
      const placeDetails = await place.toPlace();
      await placeDetails.fetchFields({
        fields: ["formattedAddress", "location"],
      });

      if (!placeDetails.location) return;

      onSelect({
        address: placeDetails.formattedAddress,
        lat: placeDetails.location.lat(),
        lng: placeDetails.location.lng(),
      });
    });
  }, []);

  return <div ref={containerRef}></div>;
}