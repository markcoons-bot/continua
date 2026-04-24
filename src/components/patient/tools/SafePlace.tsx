"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  onClose: () => void;
  patient?: Patient;
}

const GENERIC_PARAGRAPHS = [
  {
    id: "begin",
    text: "Close your eyes if that feels comfortable, or soften your gaze downward. Take a slow breath in and let it out.",
  },
  {
    id: "create",
    text: "Bring to mind a place — real or imagined — where you feel completely safe. It might be a room you loved, a place in nature, somewhere from a dream, or somewhere entirely invented. There is no wrong answer.",
  },
  {
    id: "sense",
    text: "Begin to fill it in. What do you see there? Let the colors, light, and space take shape. Notice what surrounds you.",
  },
  {
    id: "sound",
    text: "What sounds are present? Or is it quiet? Let yourself hear this place.",
  },
  {
    id: "body",
    text: "Notice how your body feels in this place. What does the air feel like? Is there warmth? Coolness? A sense of openness or gentle enclosure?",
  },
  {
    id: "safe",
    text: "In this place, nothing can harm you. No one needs anything from you. You exist here simply because you are allowed to exist — fully, completely, as you are.",
  },
  {
    id: "anchor",
    text: "Take a moment to anchor this place. Give it a name if you like. Notice one detail — a sound, a color, a texture — that you can return to when you need it.",
  },
  {
    id: "return",
    text: "Take a breath. Begin to come back — feeling your body in the chair, your feet on the floor, the present moment. Carry a thread of this place with you.",
  },
];

export default function SafePlace({ onClose, patient }: Props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const safePlace = patient?.resources?.find((r) => r.type === "safe_place");
  const isPersonalized = !!safePlace;

  const paragraphs = isPersonalized
    ? [
        {
          id: "greeting",
          text: `Let's visit ${safePlace.name}. Close your eyes if that feels comfortable. Take a slow breath.`,
        },
        {
          id: "arrive",
          text: `Imagine yourself arriving at ${safePlace.name}. ${safePlace.description}`,
        },
        {
          id: "settle",
          text: "Let yourself settle in. Notice what you see, hear, and feel in this place. You've been here before. It remembers you.",
        },
        {
          id: "body",
          text: "Feel your body in this place. What does the air feel like? The light? Notice any sense of ease that begins to arrive.",
        },
        {
          id: "safe",
          text: "In this place, you are completely safe. Nothing here can reach you. No demands, no threats, no pain. You exist here fully and freely.",
        },
        {
          id: "anchor",
          text: "Take a moment to anchor this. Notice one detail — a specific sound, a scent, a color — that you can hold in your memory and return to.",
        },
        {
          id: "return",
          text: "When you're ready, begin to come back. Feel the chair, the floor, the room around you. You can return here anytime.",
        },
      ]
    : GENERIC_PARAGRAPHS;

  const advance = () => {
    if (index + 1 >= paragraphs.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 max-w-lg mx-auto text-center">
        <p className="text-4xl leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)", lineHeight: 1.5 }}>
          {isPersonalized ? `${safePlace!.name} is always there for you.` : "Your safe place is yours."}
        </p>
        <p className="text-sm leading-loose" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          {isPersonalized
            ? "Dr. Harrison installed this resource with you. You can access it anytime you need a moment of safety."
            : "You can visit this place anytime. The more you practice returning to it, the more accessible it becomes."}
        </p>
        <div className="flex gap-4">
          <button onClick={() => { setIndex(0); setDone(false); }} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}>
            Again
          </button>
          <button onClick={onClose} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const current = paragraphs[index];

  return (
    <div className="flex flex-col min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      <div className="text-center">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          {isPersonalized ? safePlace!.name : "Safe Place"}
        </h2>
        {isPersonalized && (
          <span
            className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs border"
            style={{
              fontFamily: "var(--font-jost)",
              color: "var(--color-primary-mid)",
              borderColor: "rgba(45,94,70,0.3)",
              backgroundColor: "rgba(45,94,70,0.06)",
            }}
          >
            Your installed resource
          </span>
        )}
      </div>

      {/* Calm visual */}
      <div
        className="w-full rounded-xl flex items-center justify-center"
        style={{ height: 4, background: "linear-gradient(to right, var(--color-sage), var(--color-primary-light), var(--color-sage))", opacity: 0.4 }}
      />

      {/* Progress */}
      <div className="flex gap-1">
        {paragraphs.map((_, i) => (
          <div key={i} className="flex-1 rounded-full" style={{ height: 2, backgroundColor: i <= index ? "var(--color-primary)" : "var(--color-border)" }} />
        ))}
      </div>

      <div
        className="flex-1 rounded-2xl p-8 flex flex-col justify-between gap-8"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", minHeight: 240 }}
      >
        <p
          className="text-xl leading-loose"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.9 }}
        >
          {current.text}
        </p>

        <button
          onClick={advance}
          className="self-end px-8 py-2.5 rounded-full text-sm font-medium"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
        >
          {index + 1 >= paragraphs.length ? "Complete" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
