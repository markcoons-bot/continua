"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
}

const LOSS_ITEMS = [
  "Grief and yearning",
  "Intrusion of loss",
  "Denial or avoidance",
  "Bereavement focus",
  "Letting yourself cry",
];

const RESTORATION_ITEMS = [
  "Attending to life changes",
  "Taking on new roles or tasks",
  "Distraction from grief",
  "New identity and relationships",
  "Moments of ordinary living",
];

export default function GriefTools({ patient }: Props) {
  const [tab, setTab] = useState<"model" | "memory" | "letter">("model");
  const [memoryText, setMemoryText] = useState("");
  const [memorySaved, setMemorySaved] = useState(false);
  const [savedMemory, setSavedMemory] = useState<string | null>(null);
  const [letterText, setLetterText] = useState("");
  const [letterSaved, setLetterSaved] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"loss" | "restoration" | null>(null);

  const lostName = "Linda"; // For Michael — in a real app, this would come from patient data

  const saveMemory = () => {
    if (!memoryText.trim()) return;
    setSavedMemory(memoryText);
    setMemorySaved(true);
    setTimeout(() => setMemorySaved(false), 3000);
  };

  const saveLetter = () => {
    if (!letterText.trim()) return;
    setLetterSaved(true);
    setTimeout(() => setLetterSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {(["model", "memory", "letter"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all" style={{ fontFamily: "var(--font-jost)", backgroundColor: tab === t ? "var(--color-primary)" : "transparent", color: tab === t ? "var(--color-cream)" : "var(--color-muted)" }}>
            {t === "model" ? "Dual Process" : t === "memory" ? "Memory Keeper" : "Write to Linda"}
          </button>
        ))}
      </div>

      {/* Dual Process Model */}
      {tab === "model" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>About this model</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
              The Dual Process Model of grief says that healthy grieving means moving back and forth — oscillating — between loss-oriented work (sitting with grief) and restoration-oriented work (re-engaging with life). Neither side is wrong. Both are necessary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Loss-oriented */}
            <button
              onClick={() => setSelectedSide(selectedSide === "loss" ? null : "loss")}
              className="rounded-xl p-5 text-left transition-all"
              style={{
                backgroundColor: selectedSide === "loss" ? "rgba(138,138,132,0.1)" : "rgba(138,138,132,0.04)",
                border: `2px solid ${selectedSide === "loss" ? "rgba(138,138,132,0.4)" : "rgba(138,138,132,0.15)"}`,
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Loss-oriented
              </p>
              <ul className="flex flex-col gap-2">
                {LOSS_ITEMS.map((item) => (
                  <li key={item} className="text-xs flex items-start gap-1.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-quiet)" }}>—</span> {item}
                  </li>
                ))}
              </ul>
            </button>

            {/* Restoration-oriented */}
            <button
              onClick={() => setSelectedSide(selectedSide === "restoration" ? null : "restoration")}
              className="rounded-xl p-5 text-left transition-all"
              style={{
                backgroundColor: selectedSide === "restoration" ? "rgba(74,139,108,0.07)" : "rgba(74,139,108,0.03)",
                border: `2px solid ${selectedSide === "restoration" ? "rgba(74,139,108,0.3)" : "rgba(74,139,108,0.12)"}`,
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                Restoration-oriented
              </p>
              <ul className="flex flex-col gap-2">
                {RESTORATION_ITEMS.map((item) => (
                  <li key={item} className="text-xs flex items-start gap-1.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-sage)" }}>—</span> {item}
                  </li>
                ))}
              </ul>
            </button>
          </div>

          {/* Oscillation indicator */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              ← oscillation →
            </p>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          </div>

          {selectedSide === "loss" && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(138,138,132,0.06)", border: "1px solid rgba(138,138,132,0.2)" }}>
              <p className="text-base italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)" }}>
                You're in loss-oriented space right now. This is where you feel the grief most directly. It's real, it's valid, and it's part of the work. You don't have to rush through it.
              </p>
            </div>
          )}
          {selectedSide === "restoration" && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(74,139,108,0.06)", border: "1px solid rgba(74,139,108,0.2)" }}>
              <p className="text-base italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)" }}>
                You're in restoration-oriented space — re-engaging with life. This is not betrayal. This is healthy. {lostName} would not want you to stop living. Both things can be true.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Memory Keeper */}
      {tab === "memory" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(200,146,46,0.05)", border: "1px solid rgba(200,146,46,0.18)" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}>
              Memories worth keeping
            </p>
            <p className="text-base italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85 }}>
              Write about a memory of {lostName} — something small or large that captures who she was. The way she laughed. Something she always said. A moment you shared. Just let it come.
            </p>
          </div>

          {savedMemory && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Saved memory
              </p>
              <p className="text-base leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85 }}>
                {savedMemory}
              </p>
            </div>
          )}

          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            placeholder={`Write about ${lostName}…`}
            className="w-full resize-none outline-none rounded-xl"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--color-text)",
              fontSize: "1.1rem",
              lineHeight: 1.85,
              padding: "24px 28px",
              minHeight: 200,
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              caretColor: "var(--color-primary)",
            }}
          />

          <button
            onClick={saveMemory}
            disabled={!memoryText.trim()}
            className="self-start px-8 py-2.5 rounded-full text-sm font-medium"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: memorySaved ? "rgba(74,139,108,0.1)" : "var(--color-primary)",
              color: memorySaved ? "var(--color-primary-light)" : "var(--color-cream)",
              border: memorySaved ? "1px solid var(--color-primary-light)" : "none",
              opacity: memoryText.trim() ? 1 : 0.5,
            }}
          >
            {memorySaved ? "✓ Memory saved" : "Keep this memory"}
          </button>
        </div>
      )}

      {/* Letter writing */}
      {tab === "letter" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(168,196,181,0.07)", border: "1px solid rgba(168,196,181,0.25)" }}>
            <p className="text-base italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85 }}>
              Write a few sentences to {lostName} — what do you want her to know today? There's no format. Just say what's true right now.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <div className="px-6 py-3 border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                Dear {lostName},
              </p>
            </div>
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              placeholder="…"
              className="w-full resize-none outline-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--color-text)",
                fontSize: "1.1rem",
                lineHeight: 1.85,
                padding: "24px 24px",
                minHeight: 220,
                backgroundColor: "var(--color-card)",
                caretColor: "var(--color-primary)",
              }}
            />
          </div>

          <button
            onClick={saveLetter}
            disabled={!letterText.trim()}
            className="self-start px-8 py-2.5 rounded-full text-sm font-medium"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: letterSaved ? "rgba(74,139,108,0.1)" : "var(--color-primary)",
              color: letterSaved ? "var(--color-primary-light)" : "var(--color-cream)",
              border: letterSaved ? "1px solid var(--color-primary-light)" : "none",
              opacity: letterText.trim() ? 1 : 0.5,
            }}
          >
            {letterSaved ? "✓ Saved" : "Save letter"}
          </button>

          <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            This letter stays with you. You may want to bring it to your next session with Dr. Harrison.
          </p>
        </div>
      )}
    </div>
  );
}
