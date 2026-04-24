"use client";

import { useState } from "react";
import { patients, getPatient } from "@/data/patients";
import PatientSwitcher from "./PatientSwitcher";
import PatientHome from "./PatientHome";
import GroundingHub from "./GroundingHub";
import Journal from "./Journal";
import SessionMemory from "./SessionMemory";
import ModalityTools from "./ModalityTools";

type Section = "home" | "ground" | "journal" | "memory" | "tools";

export default function PatientPortal() {
  const [selectedPatientId, setSelectedPatientId] = useState("sarah");
  const [section, setSection] = useState<Section>("home");

  const patient = getPatient(selectedPatientId) ?? patients[0];

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setSection("home");
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: "var(--color-bg)" }}>
      <PatientSwitcher selectedId={selectedPatientId} onSelect={handleSelectPatient} />

      {section === "home" && (
        <PatientHome patient={patient} setSection={setSection} />
      )}
      {section === "ground" && (
        <GroundingHub patient={patient} onBack={() => setSection("home")} />
      )}
      {section === "journal" && (
        <Journal patient={patient} onBack={() => setSection("home")} />
      )}
      {section === "memory" && (
        <SessionMemory patient={patient} onBack={() => setSection("home")} />
      )}
      {section === "tools" && (
        <ModalityTools patient={patient} onBack={() => setSection("home")} />
      )}
    </div>
  );
}
