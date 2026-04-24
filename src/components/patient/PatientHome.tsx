"use client";

import { Patient } from "@/data/patients";

type Section = "home" | "ground" | "journal" | "memory" | "tools";

interface Props {
  patient: Patient;
  setSection: (s: Section) => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Good night";
}

const MODALITY_TOOL: Record<Patient["modality"], { label: string; section: Section }> = {
  emdr: { label: "EMDR Tools", section: "tools" },
  cbt: { label: "Thought Records", section: "tools" },
  dbt: { label: "DBT Skills", section: "tools" },
  grief: { label: "Grief Space", section: "tools" },
  adolescent: { label: "Skills & Tools", section: "tools" },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function moodColor(val: number) {
  if (val >= 7) return "var(--color-primary-light)";
  if (val >= 4) return "var(--color-sage)";
  return "var(--color-quiet)";
}

export default function PatientHome({ patient, setSection }: Props) {
  const greeting = getGreeting();
  const firstName = patient.name.split(" ")[0];
  const modalityTool = MODALITY_TOOL[patient.modality];
  const maxCheckIn = 10;
  const barMaxHeight = 72;

  const navTiles = [
    {
      label: "Ground Me Now",
      sublabel: "Breathing, grounding & EMDR tools",
      icon: "◎",
      section: "ground" as Section,
      dark: true,
    },
    {
      label: "Open Journal",
      sublabel: patient.journalPrompt.slice(0, 60) + "…",
      icon: "✦",
      section: "journal" as Section,
      dark: false,
    },
    {
      label: "Session Memory",
      sublabel: "Anchors, summaries & your last session",
      icon: "⬡",
      section: "memory" as Section,
      dark: false,
    },
    {
      label: modalityTool.label,
      sublabel: `Modality-specific tools for ${patient.modality.toUpperCase()}`,
      icon: "◈",
      section: modalityTool.section,
      dark: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Hero greeting card */}
      <div
        className="rounded-2xl p-8 sm:p-10 flex flex-col gap-4"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, #254d38 50%, var(--color-primary-mid) 100%)",
          boxShadow: "0 8px 40px rgba(28,61,46,0.25)",
        }}
      >
        <div>
          <p className="text-sm mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)", letterSpacing: "0.06em" }}>
            {greeting},
          </p>
          <h1 className="text-5xl sm:text-6xl leading-none" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}>
            {firstName}.
          </h1>
        </div>

        <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "rgba(168,196,181,0.7)", letterSpacing: "0.05em" }}>
          Last session with Dr. Harrison · {patient.lastSession}
        </p>

        <div
          className="mt-2 border-l-2 pl-5"
          style={{ borderColor: "rgba(168,196,181,0.4)" }}
        >
          <p
            className="text-base sm:text-lg italic leading-loose"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "rgba(245,237,216,0.9)",
              lineHeight: 1.8,
            }}
          >
            {patient.therapistNote}
          </p>
          <p className="mt-3 text-xs" style={{ fontFamily: "var(--font-jost)", color: "rgba(168,196,181,0.6)" }}>
            — Dr. Harrison
          </p>
        </div>
      </div>

      {/* Navigation tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navTiles.map((tile) => (
          <button
            key={tile.section}
            onClick={() => setSection(tile.section)}
            className="text-left rounded-xl p-6 flex flex-col gap-3 transition-all duration-150"
            style={
              tile.dark
                ? {
                    background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 4px 20px rgba(28,61,46,0.2)",
                  }
                : {
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 1px 4px rgba(28,61,46,0.06)",
                  }
            }
          >
            <span
              className="text-2xl"
              style={{ color: tile.dark ? "var(--color-sage)" : "var(--color-primary-light)" }}
            >
              {tile.icon}
            </span>
            <div>
              <p
                className="text-xl leading-snug"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: tile.dark ? "var(--color-cream)" : "var(--color-primary)",
                }}
              >
                {tile.label}
              </p>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: tile.dark ? "rgba(168,196,181,0.75)" : "var(--color-muted)",
                }}
              >
                {tile.sublabel}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Mood chart */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          This week · Check-in mood
        </p>
        <div className="flex items-end gap-2 sm:gap-3" style={{ height: barMaxHeight + 24 }}>
          {patient.checkIns.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <p className="text-xs tabular-nums" style={{ fontFamily: "var(--font-jost)", color: moodColor(val) }}>
                {val}
              </p>
              <div
                className="w-full rounded-t-md"
                style={{
                  height: Math.max(4, (val / maxCheckIn) * barMaxHeight),
                  backgroundColor: moodColor(val),
                  opacity: 0.7 + (val / maxCheckIn) * 0.3,
                }}
              />
              <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                {DAY_LABELS[i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EMDR indicators */}
      {patient.modality === "emdr" && patient.sudsBaseline !== undefined && (
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              Current SUDS Baseline
            </p>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs border"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-primary-mid)",
                borderColor: "rgba(45,94,70,0.25)",
                backgroundColor: "rgba(45,94,70,0.06)",
              }}
            >
              EMDR
            </span>
          </div>

          <div className="flex items-end gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: 32,
                    backgroundColor:
                      i === patient.sudsBaseline
                        ? "var(--color-accent)"
                        : i < (patient.sudsBaseline ?? 0)
                        ? "rgba(200,146,46,0.2)"
                        : "var(--color-border)",
                  }}
                />
                {(i === 0 || i === 5 || i === 10) && (
                  <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                    {i}
                  </p>
                )}
              </div>
            ))}
          </div>

          {patient.currentPhase && (
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              {patient.currentPhase}
            </p>
          )}
        </div>
      )}

      {/* Demo disclaimer */}
      <div className="flex justify-center">
        <span
          className="px-3 py-1.5 rounded-full text-xs border"
          style={{
            fontFamily: "var(--font-jost)",
            color: "var(--color-quiet)",
            borderColor: "var(--color-border)",
            backgroundColor: "transparent",
          }}
        >
          Demo Mode · Not a real patient record
        </span>
      </div>
    </div>
  );
}
