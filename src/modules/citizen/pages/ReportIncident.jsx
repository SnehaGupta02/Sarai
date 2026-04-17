//ReportIncident.jsx
import { supabase } from "../../../lib/supabase";
import { useState, useRef } from "react";
import CitizenNavbar from "../components/CitizenNavbar";
import { useAuth } from "../../../context/AuthContext";
import Step1Location from "../components/report/Step1Location";
import Step2DisasterLocation from "../components/report/Step2DisasterLocation";
import Step3People from "../components/report/Step3People";
import Step4Media from "../components/report/Step4Media";
import Step5Description from "../components/report/Step5Description";
import Step6Success from "../components/report/Step6Success";

export default function ReportIncident() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [autoLocation, setAutoLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);

  const [people, setPeople] = useState("");
  const [description, setDescription] = useState("");

  const [preview, setPreview] = useState(null);
  const [fileData, setFileData] = useState(null);

  const fileRef = useRef(null);

  // 📏 GEO DISTANCE
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const next = () => {
    if (step === 1 && !autoLocation) return alert("Detect your location first");

    if (step === 2) {
      if (!manualLocation) return alert("Select location");

      if (autoLocation) {
        const dist = calculateDistance(
          autoLocation.lat,
          autoLocation.lng,
          manualLocation.lat,
          manualLocation.lng
        );
        if (dist > 10) return alert("Too far from location");
      }
    }

    if (step === 3 && !people) return alert("Select people");

    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const submitReport = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }
  
    if (!manualLocation) {
      alert("Location missing");
      return;
    }
  
    const { error } = await supabase.from("Reports").insert([
      {
        phone: user.phone, // ✅ from auth
        role: "citizen",
  
        lat: manualLocation.lat, // ✅ real selected location
        lng: manualLocation.lng,
        address: manualLocation.address,
  
        people, // ✅ selected option
        description, // ✅ textarea input
  
        status: "pending",
      },
    ]);
  
    if (error) {
      console.error(error);
      alert("Failed to submit ❌");
      return;
    }
  
    alert("Report submitted successfully ✅");
    setStep(6);
  };

  return (
    <>
      <CitizenNavbar />

      <div style={styles.container}>
        <h1>🚨 Report Incident</h1>

        {step === 1 && (
          <Step1Location
            autoLocation={autoLocation}
            setAutoLocation={setAutoLocation}
            next={next}
          />
        )}

        {step === 2 && (
          <Step2DisasterLocation
            manualLocation={manualLocation}
            setManualLocation={setManualLocation}
            next={next}
            back={back}
          />
        )}

        {step === 3 && (
          <Step3People
            people={people}
            setPeople={setPeople}
            next={next}
            back={back}
          />
        )}

        {step === 4 && (
          <Step4Media
            fileRef={fileRef}
            preview={preview}
            setPreview={setPreview}
            fileData={fileData}
            setFileData={setFileData}
            next={next}
            back={back}
          />
        )}

        {step === 5 && (
          <Step5Description
            setDescription={setDescription}
            submitReport={submitReport}
            back={back}
          />
        )}

        {step === 6 && <Step6Success />}
      </div>
    </>
  );
}

const styles = {
  container: {
    background: "#020617",
    color: "white",
    minHeight: "calc(100vh - 60px)",
    padding: "20px",
    textAlign: "center",
  },
};