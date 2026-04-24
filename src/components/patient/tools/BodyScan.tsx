"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

const REGIONS = [
  { id: "crown", label: "Crown of your head", instruction: "Bring your attention to the very top of your head. Notice any sensation — warmth, tingling, pressure, or simply the feeling of existing there." },
  { id: "forehead", label: "Forehead & temples", instruction: "Let your attention move to your forehead. Notice if there's any holding or tension there. You don't need to change it — just notice." },
  { id: "eyes", label: "Eyes & jaw", instruction: "Soften around your eyes. Notice your jaw — is it clenched? Allow it to relax slightly, let your lips part just a little." },
  { id: "neck", label: "Neck & throat", instruction: "Bring awareness to your neck and throat. Notice the feeling of breathing passing through. Any tightness? Any holding?" },
  { id: "shoulders", label: "Shoulders", instruction: "Notice your shoulders. Are they raised, or held forward? Allow them to drop slightly — not forcing, just allowing." },
  { id: "chest", label: "Chest", instruction: "Feel your chest rise and fall. Place a hand there if you like. Notice the rhythm of your breath from the inside." },
  { id: "belly", label: "Belly & abdomen", instruction: "Bring awareness to your belly. Notice if it's held tight or soft. With each exhale, allow it to be a little more at ease." },
  { id: "lower-back", label: "Lower back & hips", instruction: "Notice your lower back where it meets whatever you're sitting or lying on. Feel the weight, the contact, the support." },
  { id: "thighs", label: "Thighs & knees", instruction: "Feel the weight of your legs. Notice where your thighs make contact with the surface beneath you." },
  { id: "calves", label: "Calves & shins", instruction: "Bring awareness to your lower legs. Notice the temperature of the air around them, any feeling of heaviness or lightness." },
  { id: "feet", label: "Feet & toes", instruction: "Arrive at your feet. Notice all the small sensations — the contact with the floor, the temperature, the subtle aliveness of each toe." },
  { id: "whole", label: "Your whole body", instruction: "Now expand your awareness to take in your whole body at once — a single field of sensation, from the crown of your head to the soles of your feet. You are here. You are present." },
];

const AUTO_ADVANCE_MS = 18000;

export default function BodyScan({ onClose }: Props) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTO_ADVANCE_MS / 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!autoMode || !started) return;

    setTimeLeft(AUTO_ADVANCE_MS / 1000);
    let t = AUTO_ADVANCE_MS / 1000;

    intervalRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(intervalRef.current);
        if (index + 1 >= REGIONS.length) {
          setDone(true);
        } else {
          setIndex((i) => i + 1);
        }
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [autoMode, index, started]);

  const advance = () => {
    clearInterval(intervalRef.current);
    if (index + 1 >= REGIONS.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      if (autoMode) setTimeLeft(AUTO_ADVANCE_MS / 1000);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 max-w-lg mx-auto text-center">
        <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          ← Back to tools
        </button>
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Body Scan</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          A slow, guided journey through your body — from the crown of your head to your feet. You're not trying to change anything. Just noticing. Takes about 10–15 minutes at a comfortable pace.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setAutoMode(false); setStarted(true); }}
            className="px-8 py-2.5 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}
          >
            My own pace
          </button>
          <button
            onClick={() => { setAutoMode(true); setStarted(true); }}
            className="px-8 py-2.5 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
          >
            Auto-advance
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 max-w-lg mx-auto text-center">
        <p className="text-4xl leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)", lineHeight: 1.5 }}>
          You've arrived.
        </p>
        <p className="text-sm leading-loose" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Take a moment before you move. Notice the difference between how your body feels now and when you began.
        </p>
        <div className="flex gap-4">
          <button onClick={() => { setIndex(0); setDone(false); setStarted(false); }} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}>
            Again
          </button>
          <button onClick={onClose} className="px-8 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const region = REGIONS[index];
  const progress = (index / REGIONS.length) * 100;

  return (
    <div className="flex flex-col min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      <div className="text-center">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Body Scan</h2>
        <p className="text-xs mt-1" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          {index + 1} of {REGIONS.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full" style={{ height: 2, backgroundColor: "var(--color-border)" }}>
        <div
          className="rounded-full"
          style={{ height: 2, width: `${progress}%`, backgroundColor: "var(--color-primary)", transition: "width 0.5s ease" }}
        />
      </div>

      {/* Body region indicator — simple vertical line with dot */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center" style={{ minWidth: 20 }}>
          <div className="rounded-full" style={{ width: 12, height: 12, backgroundColor: "var(--color-primary)" }} />
        </div>
        <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          {region.label}
        </p>
      </div>

      <div
        className="rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-lg leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.8 }}>
          {region.instruction}
        </p>

        {autoMode && (
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-full" style={{ height: 2, backgroundColor: "var(--color-border)" }}>
              <div
                className="rounded-full"
                style={{
                  height: 2,
                  width: `${(timeLeft / (AUTO_ADVANCE_MS / 1000)) * 100}%`,
                  backgroundColor: "var(--color-sage)",
                  transition: "width 1s linear",
                }}
              />
            </div>
            <p className="text-xs tabular-nums" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
              {timeLeft}s
            </p>
          </div>
        )}

        <button
          onClick={advance}
          className="self-start px-8 py-2.5 rounded-full text-sm font-medium"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
        >
          {index + 1 >= REGIONS.length ? "Complete" : "Next →"}
        </button>
      </div>
    </div>
  );
}
