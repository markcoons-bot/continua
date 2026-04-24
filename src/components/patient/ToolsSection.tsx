"use client";

import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
  onBack: () => void;
}

const MODALITY_CONTENT: Record<Patient["modality"], { title: string; subtitle: string; items: string[] }> = {
  emdr: {
    title: "EMDR Tools",
    subtitle: "Extended tools for EMDR protocol support",
    items: ["Resource Team review", "BLS practice", "Positive cognition reinforcement", "SUDS tracking", "Phase tracking"],
  },
  cbt: {
    title: "Thought Records",
    subtitle: "Structured CBT tools for cognitive work between sessions",
    items: ["Thought record worksheet", "Evidence for/against", "Core belief tracker", "Behavioral activation log"],
  },
  dbt: {
    title: "DBT Skills",
    subtitle: "DBT skill reminders and practice tools",
    items: ["TIPP", "ACCEPTS", "IMPROVE", "Radical Acceptance", "Wise Mind check-in", "Diary card"],
  },
  grief: {
    title: "Grief Space",
    subtitle: "A dedicated space for grief work",
    items: ["Memory preservation", "Letter writing", "Oscillation check-in", "Restoration focus"],
  },
  adolescent: {
    title: "Skills & Tools",
    subtitle: "Tools adapted for you",
    items: ["Courage ladder", "Thought challenge", "Social situation review", "Brave thing log"],
  },
};

export default function ToolsSection({ patient, onBack }: Props) {
  const content = MODALITY_CONTENT[patient.modality];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
        >
          ← Home
        </button>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          {content.title}
        </h1>
      </div>

      <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
        {content.subtitle}
      </p>

      <div className="flex flex-col gap-3">
        {content.items.map((item) => (
          <div
            key={item}
            className="rounded-xl p-5 flex items-center justify-between"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
          >
            <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              {item}
            </p>
            <span className="text-xs px-3 py-1 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", backgroundColor: "var(--color-surface)" }}>
              Coming soon
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
        Full modality tools are in development
      </p>
    </div>
  );
}
