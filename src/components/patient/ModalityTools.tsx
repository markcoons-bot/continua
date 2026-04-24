"use client";

import { Patient } from "@/data/patients";
import EMDRTools from "./modality/EMDRTools";
import CBTTools from "./modality/CBTTools";
import DBTTools from "./modality/DBTTools";
import GriefTools from "./modality/GriefTools";
import AdolescentTools from "./modality/AdolescentTools";

interface Props {
  patient: Patient;
  onBack: () => void;
}

const MODALITY_LABELS: Record<Patient["modality"], string> = {
  emdr: "EMDR Tools",
  cbt: "Thought Records",
  dbt: "DBT Skills",
  grief: "Grief Space",
  adolescent: "Skills & Tools",
};

const MODALITY_BADGE: Record<Patient["modality"], string> = {
  emdr: "EMDR",
  cbt: "CBT",
  dbt: "DBT",
  grief: "Grief",
  adolescent: "CBT · Adolescent",
};

export default function ModalityTools({ patient, onBack }: Props) {
  const title = MODALITY_LABELS[patient.modality];
  const badge = MODALITY_BADGE[patient.modality];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm mt-1"
          style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
        >
          ← Home
        </button>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
            >
              {title}
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs border"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-primary-mid)",
                borderColor: "rgba(45,94,70,0.25)",
                backgroundColor: "rgba(45,94,70,0.06)",
              }}
            >
              {badge}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            {patient.phase}
          </p>
        </div>
      </div>

      {patient.modality === "emdr" && <EMDRTools patient={patient} />}
      {patient.modality === "cbt" && <CBTTools patient={patient} />}
      {patient.modality === "dbt" && <DBTTools patient={patient} />}
      {patient.modality === "grief" && <GriefTools patient={patient} />}
      {patient.modality === "adolescent" && <AdolescentTools patient={patient} />}
    </div>
  );
}
