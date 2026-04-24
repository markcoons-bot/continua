"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
  onBack: () => void;
}

interface SavedEntry {
  text: string;
  reflection: string;
  timestamp: string;
}

export default function Journal({ patient, onBack }: Props) {
  const [journalText, setJournalText] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  const handleReflect = async () => {
    if (!journalText.trim() || loading) return;
    setLoading(true);
    setReflection(null);
    setError(null);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          journalText,
          modality: patient.modality,
          sessionSummary: patient.sessionSummary,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setReflection(data.reflection);
      }
    } catch {
      setError("Unable to connect. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!journalText.trim()) return;
    setSavedEntries((prev) => [
      {
        text: journalText,
        reflection: reflection ?? "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
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
          Open Journal
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: therapist prompt */}
        <div className="lg:col-span-1">
          <div
            className="rounded-xl p-6 sticky top-32"
            style={{
              backgroundColor: "rgba(200,146,46,0.06)",
              border: "1px solid rgba(200,146,46,0.2)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}
            >
              From Dr. Harrison
            </p>
            <p
              className="text-lg leading-loose italic"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--color-text)",
                lineHeight: 1.85,
              }}
            >
              {patient.journalPrompt}
            </p>
          </div>

          {/* Saved entries */}
          {savedEntries.length > 0 && (
            <div className="mt-6">
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
              >
                This session
              </p>
              <div className="flex flex-col gap-2">
                {savedEntries.map((entry, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className="text-xs"
                        style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
                      >
                        {entry.timestamp}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "var(--font-jost)",
                          color: "var(--color-primary-light)",
                          backgroundColor: "rgba(74,139,108,0.08)",
                        }}
                      >
                        ✓ saved
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}
                    >
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main writing area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Textarea */}
          <div
            className="rounded-xl flex flex-col"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write freely. This space is yours."
              className="flex-1 resize-none outline-none bg-transparent text-base leading-loose w-full rounded-xl"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-text)",
                padding: "28px 32px",
                minHeight: 280,
                caretColor: "var(--color-primary)",
                lineHeight: 1.8,
              }}
            />
            <div
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                onClick={handleSave}
                disabled={!journalText.trim()}
                className="text-sm px-4 py-2 rounded-full transition-colors"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: justSaved ? "var(--color-primary-light)" : "var(--color-quiet)",
                  border: `1px solid ${justSaved ? "var(--color-primary-light)" : "var(--color-border)"}`,
                  opacity: journalText.trim() ? 1 : 0.4,
                }}
              >
                {justSaved ? "✓ Entry saved" : "Save entry"}
              </button>
              <button
                onClick={handleReflect}
                disabled={!journalText.trim() || loading}
                className="text-sm px-6 py-2 rounded-full font-medium transition-all"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor:
                    journalText.trim() && !loading
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                  color:
                    journalText.trim() && !loading
                      ? "var(--color-cream)"
                      : "var(--color-quiet)",
                  cursor: journalText.trim() && !loading ? "pointer" : "not-allowed",
                }}
              >
                Reflect with Continua
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div
              className="rounded-xl p-6 flex items-center gap-3"
              style={{
                backgroundColor: "rgba(168,196,181,0.08)",
                border: "1px solid rgba(168,196,181,0.3)",
              }}
            >
              <p
                className="text-base italic"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "var(--color-primary-light)",
                }}
              >
                Continua is with you
              </p>
              <div className="flex items-end gap-1 pb-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      backgroundColor: "var(--color-primary-light)",
                      animation: `dot-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "rgba(200,146,46,0.06)",
                border: "1px solid rgba(200,146,46,0.2)",
              }}
            >
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Reflection */}
          {reflection && !loading && (
            <div
              className="rounded-xl p-7 flex flex-col gap-4"
              style={{
                backgroundColor: "rgba(168,196,181,0.1)",
                border: "1px solid rgba(168,196,181,0.35)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}
              >
                Continua reflects
              </p>
              <p
                className="italic leading-loose"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "var(--color-text)",
                  fontSize: "1.25rem",
                  lineHeight: 1.85,
                }}
              >
                {reflection}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
              >
                Continua is a between-session companion, not a therapist. It cannot provide clinical guidance.
                If you're in crisis, please call or text 988, or contact Dr. Harrison directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
