"use client";

import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
  onBack: () => void;
}

export default function JournalSection({ patient, onBack }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
        >
          ← Home
        </button>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Open Journal
        </h1>
      </div>

      {/* Prompt card */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          This week's prompt from Dr. Harrison
        </p>
        <p
          className="text-lg leading-loose italic"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.9 }}
        >
          {patient.journalPrompt}
        </p>
      </div>

      {/* Writing area placeholder */}
      <div
        className="rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", minHeight: 300 }}
      >
        <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          Your response
        </p>
        <textarea
          className="flex-1 resize-none outline-none bg-transparent text-base leading-loose w-full"
          style={{
            fontFamily: "var(--font-jost)",
            color: "var(--color-text)",
            minHeight: 240,
            caretColor: "var(--color-primary)",
          }}
          placeholder="Write freely. This is yours."
        />
      </div>

      <p className="text-xs text-center" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
        Demo Mode · Journal entries are not saved
      </p>
    </div>
  );
}
