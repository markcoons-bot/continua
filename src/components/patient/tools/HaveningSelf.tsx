"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

const PHASES = [
  {
    id: "intro",
    title: "Havening Touch",
    body: "Havening is a psychosensory technique that uses gentle touch to disrupt the encoding of distressing memories in the amygdala. You're essentially doing bilateral stimulation through your own hands. It sounds unusual. It works.",
    instruction: null,
    action: "Begin",
  },
  {
    id: "face",
    title: "Face Havening",
    body: "Place the palms of both hands gently on your cheeks, fingertips near your temples. Now stroke slowly downward — from your temples, across your cheeks, down to your jaw.",
    instruction: "Stroke slowly and gently, 10–15 times. Close your eyes if comfortable. Hum or count softly if it helps.",
    action: "Next →",
  },
  {
    id: "arms",
    title: "Arm Havening",
    body: "Cross your arms over your chest, hands resting on your upper arms. Now stroke slowly downward — from your shoulders down toward your elbows. Both arms simultaneously.",
    instruction: "Stroke gently, 10–15 times. Keep your breathing slow and easy.",
    action: "Next →",
  },
  {
    id: "palms",
    title: "Palm Havening",
    body: "Hold both hands in front of you, palms facing up. Using one hand, stroke the palm of the other from the base of the fingers to the wrist. Then switch.",
    instruction: "Slow, gentle strokes. Notice the sensation. Stay with the touch.",
    action: "Complete",
  },
];

export default function HaveningSelf({ onClose }: Props) {
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  const current = PHASES[phase];

  const advance = () => {
    if (phase + 1 >= PHASES.length) {
      setDone(true);
    } else {
      setPhase((p) => p + 1);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 max-w-lg mx-auto text-center">
        <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Notice the shift.
        </p>
        <p className="text-sm leading-loose" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Havening works by generating delta waves through gentle touch, disrupting the emotional charge of encoded distress. With practice, it becomes a fast and reliable tool.
        </p>
        <div className="flex gap-4">
          <button onClick={() => { setPhase(0); setDone(false); }} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}>
            Again
          </button>
          <button onClick={onClose} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      <div className="text-center">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Havening Touch
        </h2>
        <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          Self-administered psychosensory technique
        </p>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-2 items-center justify-center">
        {PHASES.slice(1).map((p, i) => (
          <div
            key={p.id}
            className="rounded-full"
            style={{
              width: i + 1 < phase ? 24 : 8,
              height: 8,
              backgroundColor: i + 1 <= phase ? "var(--color-primary)" : "var(--color-border)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <div
        className="flex-1 rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", minHeight: 280 }}
      >
        <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          {current.title}
        </p>
        <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}>
          {current.body}
        </p>
        {current.instruction && (
          <p
            className="text-sm leading-relaxed italic border-l-2 pl-4"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", borderColor: "var(--color-sage)" }}
          >
            {current.instruction}
          </p>
        )}
        <button
          onClick={advance}
          className="self-start mt-auto px-8 py-2.5 rounded-full text-sm font-medium"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
        >
          {current.action}
        </button>
      </div>
    </div>
  );
}
