"use client";

import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
  onBack: () => void;
}

export default function MemorySection({ patient, onBack }: Props) {
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
          Session Memory
        </h1>
      </div>

      {/* Session summary */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          Last session summary · {patient.lastSession}
        </p>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          {patient.sessionSummary}
        </p>
      </div>

      {/* Anchors */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          Your anchors
        </p>
        <div className="flex flex-col gap-4">
          {patient.anchors.map((anchor) => (
            <div
              key={anchor.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <p
                className="text-lg mb-2"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
              >
                {anchor.title}
              </p>
              <p className="text-sm leading-loose" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}>
                {anchor.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modality-specific extras */}
      {patient.cognition && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Positive cognition installation
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs line-through" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                {patient.cognition.negative}
              </span>
              <span style={{ color: "var(--color-border)" }}>→</span>
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-mid)" }}>
                {patient.cognition.positive}
              </span>
            </div>
            <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              Validity of Cognition (VOC): {patient.cognition.voc}/7
            </p>
          </div>
        </div>
      )}

      {patient.coreBeliefs && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Identified core beliefs
          </p>
          <ul className="flex flex-col gap-2">
            {patient.coreBeliefs.map((belief) => (
              <li key={belief} className="flex items-start gap-2">
                <span style={{ color: "var(--color-border)" }}>—</span>
                <span className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                  {belief}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
