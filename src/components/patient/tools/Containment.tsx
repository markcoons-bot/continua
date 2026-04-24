"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

const PARAGRAPHS = [
  {
    id: "intro",
    text: "Find a comfortable position. Let your body settle. You don't need to do anything right now except read — and imagine.",
  },
  {
    id: "container",
    text: "Find a container in your mind. It can be anything — a wooden chest, a fireproof safe, an ornate box, a vault door set into stone. Something with weight and substance. Something that holds.",
  },
  {
    id: "lock",
    text: "Give it a lock. Only you hold the key. No one else can open it. You choose what goes in, and you choose when — and if — to open it. It exists only for you.",
  },
  {
    id: "place",
    text: "Now place anything that feels too heavy inside. It doesn't have to be one thing. A memory. A feeling that keeps returning. The weight of something unresolved. You can put as much as you need to. The container expands to hold it.",
  },
  {
    id: "seal",
    text: "Close the lid. Hear the click of the lock. Notice the weight shift — it's still there, but you're not holding it alone right now. It will wait for you. You can come back to it with Dr. Harrison when the time is right.",
  },
  {
    id: "place-it",
    text: "Now place the container somewhere in your mind — a shelf, a vault room, a space at the bottom of the ocean, a cave behind a waterfall. Somewhere it can rest safely until you're ready.",
  },
  {
    id: "return",
    text: "Take a breath. You're still here. Notice where your body meets the chair, the floor. The container holds what it holds. You are free to be present right now.",
  },
];

export default function Containment({ onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const advance = () => {
    if (index + 1 >= PARAGRAPHS.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 max-w-lg mx-auto text-center">
        <p
          className="text-4xl leading-relaxed"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)", lineHeight: 1.5 }}
        >
          It's held.
        </p>
        <p className="text-sm leading-loose" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          You can return to this container any time things feel too heavy between sessions.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setIndex(0); setDone(false); }}
            className="px-8 py-2.5 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}
          >
            Again
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const current = PARAGRAPHS[index];

  return (
    <div className="flex flex-col min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      <div className="text-center">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Container Visualization
        </h2>
        <span
          className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs border"
          style={{
            fontFamily: "var(--font-jost)",
            color: "var(--color-primary-mid)",
            borderColor: "rgba(45,94,70,0.3)",
            backgroundColor: "rgba(45,94,70,0.06)",
          }}
        >
          EMDR Stabilization
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {PARAGRAPHS.map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full"
            style={{ height: 2, backgroundColor: i <= index ? "var(--color-primary)" : "var(--color-border)" }}
          />
        ))}
      </div>

      {/* Text */}
      <div
        className="flex-1 rounded-2xl p-8 flex flex-col justify-between gap-8"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", minHeight: 280 }}
      >
        <p
          className="text-xl leading-loose"
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "var(--color-text)",
            lineHeight: 1.9,
          }}
        >
          {current.text}
        </p>

        <button
          onClick={advance}
          className="self-end px-8 py-2.5 rounded-full text-sm font-medium"
          style={{
            fontFamily: "var(--font-jost)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-cream)",
          }}
        >
          {index + 1 >= PARAGRAPHS.length ? "Complete" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
