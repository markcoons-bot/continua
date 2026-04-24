"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
  onBack: () => void;
}

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  safe_place: "Safe Place",
  calm_place: "Calm Place",
  nurturing: "Nurturing Figure",
  protector: "Protector Figure",
};

const RESOURCE_TYPE_ICONS: Record<string, string> = {
  safe_place: "◈",
  calm_place: "∿",
  nurturing: "♡",
  protector: "◉",
};

const ANCHOR_ICONS = ["⬡", "◎", "✦", "◈"];

export default function SessionMemory({ patient, onBack }: Props) {
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const toggleReviewed = (i: number) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const isEMDR = patient.modality === "emdr";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
        >
          ← Home
        </button>
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Session Memory
        </h1>
      </div>

      {/* Clinical summary */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Last session summary · {patient.lastSession}
          </p>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full border"
            style={{
              fontFamily: "var(--font-jost)",
              color: "var(--color-muted)",
              borderColor: "var(--color-border)",
            }}
          >
            {patient.phase}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.85 }}
        >
          {patient.sessionSummary}
        </p>
      </div>

      {/* Anchors grid */}
      <div>
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
        >
          Your anchors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patient.anchors.map((anchor, i) => {
            const isReviewed = reviewed.has(i);
            return (
              <div
                key={anchor.title}
                className="rounded-xl p-6 flex flex-col gap-3 transition-all duration-200"
                style={{
                  backgroundColor: isReviewed ? "rgba(74,139,108,0.05)" : "var(--color-surface)",
                  border: `1px solid ${isReviewed ? "rgba(74,139,108,0.3)" : "var(--color-border)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-xl"
                    style={{ color: isReviewed ? "var(--color-primary-light)" : "var(--color-sage)" }}
                  >
                    {ANCHOR_ICONS[i % ANCHOR_ICONS.length]}
                  </span>
                  <button
                    onClick={() => toggleReviewed(i)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-all"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: isReviewed
                        ? "rgba(74,139,108,0.1)"
                        : "transparent",
                      color: isReviewed
                        ? "var(--color-primary-light)"
                        : "var(--color-quiet)",
                      border: `1px solid ${isReviewed ? "rgba(74,139,108,0.3)" : "var(--color-border)"}`,
                    }}
                  >
                    {isReviewed ? "✓ Reviewed" : "Mark reviewed"}
                  </button>
                </div>
                <p
                  className="text-lg leading-snug"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
                >
                  {anchor.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}
                >
                  {anchor.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* EMDR: Resource Team */}
      {isEMDR && patient.resources && patient.resources.length > 0 && (
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Your resource team
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patient.resources.map((resource) => (
              <div
                key={resource.name}
                className="rounded-xl p-6 flex flex-col gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(28,61,46,0.04) 0%, rgba(168,196,181,0.08) 100%)",
                  border: "1px solid rgba(168,196,181,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl"
                    style={{ color: "var(--color-sage)" }}
                  >
                    {RESOURCE_TYPE_ICONS[resource.type] ?? "◎"}
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full border"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: "var(--color-primary-mid)",
                      borderColor: "rgba(45,94,70,0.25)",
                      backgroundColor: "rgba(45,94,70,0.06)",
                    }}
                  >
                    {RESOURCE_TYPE_LABELS[resource.type] ?? resource.type}
                  </span>
                </div>
                <p
                  className="text-lg"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
                >
                  {resource.name}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}
                >
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMDR: Positive Cognition + VOC Meter */}
      {isEMDR && patient.cognition && (
        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Positive Cognition
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="text-sm line-through"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
            >
              {patient.cognition.negative}
            </span>
            <span style={{ color: "var(--color-border)" }}>→</span>
            <span
              className="text-lg"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)" }}
            >
              "{patient.cognition.positive}"
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}
              >
                Validity of Cognition (VOC)
              </p>
              <span
                className="text-2xl"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
              >
                {patient.cognition.voc}
                <span
                  className="text-sm ml-1"
                  style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
                >
                  / 7
                </span>
              </span>
            </div>

            {/* VOC meter */}
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }, (_, i) => {
                const filled = i < (patient.cognition?.voc ?? 0);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded"
                    style={{
                      height: 8,
                      backgroundColor: filled
                        ? "var(--color-primary-light)"
                        : "var(--color-border)",
                    }}
                  />
                );
              })}
            </div>

            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", lineHeight: 1.7 }}
            >
              This is your current VOC — how true the positive belief feels right now on a 1–7 scale. As therapy progresses and memories process, this number rises. A lower VOC early in treatment is completely normal.
            </p>
          </div>
        </div>
      )}

      {/* CBT: Core beliefs */}
      {patient.coreBeliefs && patient.coreBeliefs.length > 0 && (
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Identified core beliefs
          </p>
          <div className="flex flex-col gap-3">
            {patient.coreBeliefs.map((belief) => (
              <div
                key={belief}
                className="rounded-xl p-5 flex items-start gap-4"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="text-lg mt-0.5" style={{ color: "var(--color-border)" }}>
                  —
                </span>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}
                >
                  {belief}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DBT skills */}
      {patient.dbtSkillsFocus && patient.dbtSkillsFocus.length > 0 && (
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Skills in focus
          </p>
          <div className="flex flex-wrap gap-2">
            {patient.dbtSkillsFocus.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full text-sm"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: "var(--color-primary-mid)",
                  backgroundColor: "rgba(45,94,70,0.08)",
                  border: "1px solid rgba(45,94,70,0.2)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
