"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

const STEPS = [
  {
    count: 5,
    sense: "See",
    prompt: "Look around. Name 5 things you can see right now.",
    hint: "A lamp. A corner of the ceiling. Your own hands. The texture of a wall. A shadow.",
    color: "var(--color-primary)",
  },
  {
    count: 4,
    sense: "Feel",
    prompt: "Notice 4 things you can physically feel.",
    hint: "The pressure of the chair. Your feet on the floor. The temperature of the air. The fabric against your skin.",
    color: "var(--color-primary-mid)",
  },
  {
    count: 3,
    sense: "Hear",
    prompt: "Listen. Identify 3 sounds you can hear.",
    hint: "Traffic outside. Your own breathing. The hum of something electronic. A distant voice.",
    color: "var(--color-primary-light)",
  },
  {
    count: 2,
    sense: "Smell",
    prompt: "Notice 2 things you can smell — or take a breath and find them.",
    hint: "The air in the room. Your clothing. Something nearby. Even the absence of smell is an answer.",
    color: "var(--color-accent)",
  },
  {
    count: 1,
    sense: "Taste",
    prompt: "Notice 1 thing you can taste.",
    hint: "The inside of your mouth. A residual flavor. Run your tongue along your teeth if you need to.",
    color: "var(--color-sage)",
  },
];

export default function FiveSenses({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = STEPS[step];

  const advance = () => {
    setShowHint(false);
    if (step + 1 >= STEPS.length) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setDone(false);
    setShowHint(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 max-w-md mx-auto text-center">
        <p className="text-5xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          You are here.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Five senses. This moment. Your nervous system has landed. Take a breath and notice where you are.
        </p>
        <div className="flex gap-4">
          <button onClick={reset} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}>
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
    <div className="flex flex-col items-center min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      <div className="text-center">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          5-4-3-2-1 Grounding
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          Anchor yourself in the present moment
        </p>
      </div>

      {/* Step dots */}
      <div className="flex gap-3">
        {STEPS.map((s, i) => (
          <div
            key={s.count}
            className="rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              width: 32,
              height: 32,
              backgroundColor: i === step ? "var(--color-primary)" : i < step ? "rgba(74,139,108,0.3)" : "var(--color-border)",
              color: i === step ? "var(--color-cream)" : i < step ? "var(--color-primary)" : "var(--color-quiet)",
              fontFamily: "var(--font-jost)",
            }}
          >
            {s.count}
          </div>
        ))}
      </div>

      {/* Main card */}
      <div
        className="w-full rounded-2xl p-8 text-center flex flex-col items-center gap-6"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 80, height: 80, backgroundColor: `${current.color}15`, border: `2px solid ${current.color}40` }}
        >
          <p className="text-3xl font-light" style={{ fontFamily: "var(--font-cormorant)", color: current.color }}>
            {current.count}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
            {current.sense}
          </p>
          <p className="text-xl leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)" }}>
            {current.prompt}
          </p>
        </div>

        {showHint ? (
          <p className="text-sm leading-relaxed italic" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
            {current.hint}
          </p>
        ) : (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs underline"
            style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
          >
            Need a hint?
          </button>
        )}

        <button
          onClick={advance}
          className="px-10 py-3 rounded-full text-sm font-medium"
          style={{
            fontFamily: "var(--font-jost)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-cream)",
          }}
        >
          {step + 1 >= STEPS.length ? "Finish" : "Next sense →"}
        </button>
      </div>
    </div>
  );
}
