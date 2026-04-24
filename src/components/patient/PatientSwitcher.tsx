"use client";

import { patients } from "@/data/patients";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PatientSwitcher({ selectedId, onSelect }: Props) {
  const selected = patients.find((p) => p.id === selectedId);

  return (
    <div
      className="border-b sticky top-16 z-40"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-hide">
          {patients.map((patient) => {
            const isActive = patient.id === selectedId;
            return (
              <button
                key={patient.id}
                onClick={() => onSelect(patient.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-150"
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.8125rem",
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-cream)" : "var(--color-muted)",
                  border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full text-xs font-medium flex-shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(28,61,46,0.07)",
                    color: isActive ? "var(--color-cream)" : "var(--color-primary)",
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {patient.initials}
                </span>
                <span>{patient.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active patient badge */}
        {selected && (
          <div className="pb-2.5 flex items-center gap-2">
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
            >
              {selected.badge}
            </span>
            <span style={{ color: "var(--color-border)" }}>·</span>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
            >
              {selected.phase}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
