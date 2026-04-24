"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
}

const DISTORTIONS = [
  { id: "catastrophizing", label: "Catastrophizing", description: "Imagining the worst possible outcome" },
  { id: "mind-reading", label: "Mind reading", description: "Assuming you know what others think" },
  { id: "fortune-telling", label: "Fortune telling", description: "Predicting negative outcomes as if certain" },
  { id: "all-or-nothing", label: "All-or-nothing", description: "Seeing things as black or white, no middle ground" },
  { id: "personalization", label: "Personalization", description: "Taking excessive blame or responsibility" },
  { id: "should-statements", label: "Should statements", description: "Rigid rules about how things 'should' be" },
  { id: "filtering", label: "Mental filtering", description: "Focusing only on negatives, discarding positives" },
  { id: "emotional-reasoning", label: "Emotional reasoning", description: "'I feel stupid, therefore I am stupid'" },
];

interface ThoughtRecord {
  activating: string;
  beliefs: string;
  consequences: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balanced: string;
  distortions: string[];
  timestamp: string;
}

const STEPS = [
  { id: "activating", label: "A — Activating Event", placeholder: "What happened? Describe the situation factually, as a camera would have seen it." },
  { id: "beliefs", label: "B — Beliefs & Thoughts", placeholder: "What went through your mind? What did you tell yourself about this event?" },
  { id: "consequences", label: "C — Consequences", placeholder: "How did you feel emotionally? What did you do or want to do?" },
  { id: "evidenceFor", label: "Evidence FOR the thought", placeholder: "What facts support this belief being true?" },
  { id: "evidenceAgainst", label: "Evidence AGAINST the thought", placeholder: "What facts contradict this belief? What would a friend say?" },
  { id: "balanced", label: "Balanced thought", placeholder: "Taking the evidence together — what's a more accurate, balanced way to see this?" },
];

export default function CBTTools({ patient }: Props) {
  const [tab, setTab] = useState<"record" | "beliefs">("record");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [savedRecords, setSavedRecords] = useState<ThoughtRecord[]>([]);
  const [complete, setComplete] = useState(false);

  const current = STEPS[step];

  const updateField = (val: string) => {
    setFormData((prev) => ({ ...prev, [current.id]: val }));
  };

  const toggleDistortion = (id: string) => {
    setSelectedDistortions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const saveRecord = () => {
    const record: ThoughtRecord = {
      activating: formData.activating ?? "",
      beliefs: formData.beliefs ?? "",
      consequences: formData.consequences ?? "",
      evidenceFor: formData.evidenceFor ?? "",
      evidenceAgainst: formData.evidenceAgainst ?? "",
      balanced: formData.balanced ?? "",
      distortions: selectedDistortions,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setSavedRecords((prev) => [record, ...prev]);
    setComplete(true);
  };

  const resetRecord = () => {
    setStep(0);
    setFormData({});
    setSelectedDistortions([]);
    setComplete(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {(["record", "beliefs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: tab === t ? "var(--color-primary)" : "transparent",
              color: tab === t ? "var(--color-cream)" : "var(--color-muted)",
            }}
          >
            {t === "record" ? "Thought Record" : "Core Beliefs"}
          </button>
        ))}
      </div>

      {/* Thought Record */}
      {tab === "record" && (
        <>
          {complete ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(74,139,108,0.06)", border: "1px solid rgba(74,139,108,0.25)" }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                  Record saved
                </p>
                <p className="text-lg italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  "{formData.balanced}"
                </p>
                {selectedDistortions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedDistortions.map((d) => {
                      const dist = DISTORTIONS.find((x) => x.id === d);
                      return (
                        <span key={d} className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                          {dist?.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={resetRecord}
                className="self-start px-6 py-2.5 rounded-full text-sm"
                style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}
              >
                New record
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Progress */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{
                      height: 3,
                      backgroundColor:
                        i < step ? "var(--color-primary-light)" :
                        i === step ? "var(--color-primary)" :
                        "var(--color-border)",
                    }}
                  />
                ))}
                <div className="flex-1 rounded-full" style={{ height: 3, backgroundColor: "var(--color-border)" }} />
              </div>

              {step < STEPS.length ? (
                <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                    Step {step + 1} of {STEPS.length + 1}
                  </p>
                  <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                    {current.label}
                  </p>
                  <textarea
                    className="w-full resize-none outline-none bg-transparent text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: "var(--color-text)",
                      minHeight: 120,
                      caretColor: "var(--color-primary)",
                      lineHeight: 1.75,
                    }}
                    placeholder={current.placeholder}
                    value={formData[current.id] ?? ""}
                    onChange={(e) => updateField(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    {step > 0 ? (
                      <button onClick={() => setStep((s) => s - 1)} className="text-sm px-4 py-2 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", border: "1px solid var(--color-border)" }}>
                        ← Back
                      </button>
                    ) : <div />}
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!formData[current.id]?.trim()}
                      className="text-sm px-6 py-2 rounded-full font-medium"
                      style={{
                        fontFamily: "var(--font-jost)",
                        backgroundColor: formData[current.id]?.trim() ? "var(--color-primary)" : "var(--color-border)",
                        color: formData[current.id]?.trim() ? "var(--color-cream)" : "var(--color-quiet)",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              ) : (
                /* Distortions step */
                <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                    Step {STEPS.length + 1} of {STEPS.length + 1} · Cognitive distortions
                  </p>
                  <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                    Which patterns appeared?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DISTORTIONS.map((d) => {
                      const selected = selectedDistortions.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          onClick={() => toggleDistortion(d.id)}
                          className="text-left rounded-lg p-3 transition-all"
                          style={{
                            backgroundColor: selected ? "rgba(28,61,46,0.07)" : "transparent",
                            border: `1px solid ${selected ? "rgba(28,61,46,0.3)" : "var(--color-border)"}`,
                          }}
                        >
                          <p className="text-sm font-medium" style={{ fontFamily: "var(--font-jost)", color: selected ? "var(--color-primary)" : "var(--color-text)" }}>
                            {d.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                            {d.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => setStep((s) => s - 1)} className="text-sm px-4 py-2 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", border: "1px solid var(--color-border)" }}>
                      ← Back
                    </button>
                    <button
                      onClick={saveRecord}
                      className="text-sm px-6 py-2 rounded-full font-medium"
                      style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
                    >
                      Save record
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Core beliefs */}
      {tab === "beliefs" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            These are the core beliefs identified in your work with Dr. Harrison. The goal is not to suppress them, but to hold them more loosely over time.
          </p>
          {patient.coreBeliefs?.map((belief, i) => (
            <div key={i} className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Identified belief
              </p>
              <p className="text-base italic mb-4" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-muted)", fontSize: "1.1rem" }}>
                "{belief}"
              </p>
              <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                  What Dr. Harrison wants you to hold alongside it
                </p>
                <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {patient.anchors[0]?.body?.split(".")[0]}.
                </p>
              </div>
            </div>
          ))}
          {!patient.coreBeliefs?.length && (
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              No core beliefs recorded for this patient.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
