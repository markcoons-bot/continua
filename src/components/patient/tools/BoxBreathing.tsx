"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

type Phase = "idle" | "inhale" | "hold" | "exhale";

const PHASES: { name: Phase; label: string; duration: number; scale: number; transitionMs: number; easing: string }[] = [
  { name: "inhale", label: "Inhale", duration: 4000, scale: 1.4, transitionMs: 4000, easing: "ease-in" },
  { name: "hold", label: "Hold", duration: 4000, scale: 1.4, transitionMs: 0, easing: "linear" },
  { name: "exhale", label: "Exhale", duration: 6000, scale: 1.0, transitionMs: 6000, easing: "ease-out" },
];

export default function BoxBreathing({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scale, setScale] = useState(1.0);
  const [transitionMs, setTransitionMs] = useState(0);
  const [transitionEasing, setTransitionEasing] = useState("linear");
  const [cycles, setCycles] = useState(0);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!isRunning) {
      clearTimeout(startTimeoutRef.current);
      clearTimeout(phaseTimeoutRef.current);
      setPhase("idle");
      setScale(1.0);
      setTransitionMs(0);
      return;
    }

    setScale(1.0);
    setTransitionMs(0);

    function runPhase(i: number) {
      const p = PHASES[i % PHASES.length];
      if (i > 0 && i % PHASES.length === 0) setCycles((c) => c + 1);
      setPhase(p.name);
      setTransitionMs(p.transitionMs);
      setTransitionEasing(p.easing);
      setScale(p.scale);
      phaseTimeoutRef.current = setTimeout(() => runPhase(i + 1), p.duration);
    }

    startTimeoutRef.current = setTimeout(() => runPhase(0), 80);

    return () => {
      clearTimeout(startTimeoutRef.current);
      clearTimeout(phaseTimeoutRef.current);
    };
  }, [isRunning]);

  const phaseLabel =
    phase === "idle" ? "Press start" :
    phase === "inhale" ? "Inhale" :
    phase === "hold" ? "Hold" : "Exhale";

  const subLabel =
    phase === "inhale" ? "4 seconds" :
    phase === "hold" ? "4 seconds" :
    phase === "exhale" ? "6 seconds" : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      <button
        onClick={onClose}
        className="self-start flex items-center gap-2 text-sm mb-2"
        style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
      >
        ← Back to tools
      </button>

      <div>
        <h2
          className="text-3xl text-center"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Box Breathing
        </h2>
        <p className="text-center text-sm mt-1" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          Inhale 4 · Hold 4 · Exhale 6
        </p>
      </div>

      {/* Animated circle */}
      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        {/* Outer ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 240,
            border: "1px solid rgba(168,196,181,0.3)",
          }}
        />
        {/* Animated circle */}
        <div
          className="rounded-full"
          style={{
            width: 160,
            height: 160,
            backgroundColor: "rgba(168,196,181,0.18)",
            border: "2px solid rgba(74,139,108,0.5)",
            transform: `scale(${scale})`,
            transition: transitionMs > 0 ? `transform ${transitionMs}ms ${transitionEasing}` : "none",
            boxShadow: isRunning
              ? "0 0 40px rgba(74,139,108,0.2), 0 0 80px rgba(74,139,108,0.1)"
              : "none",
          }}
        />
        {/* Labels */}
        <div className="absolute flex flex-col items-center">
          <p
            className="text-2xl leading-none"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
          >
            {phaseLabel}
          </p>
          {subLabel && (
            <p className="text-xs mt-1" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
              {subLabel}
            </p>
          )}
        </div>
      </div>

      {cycles > 0 && (
        <p className="text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          {cycles} cycle{cycles !== 1 ? "s" : ""} completed
        </p>
      )}

      <button
        onClick={() => { setIsRunning((r) => !r); if (!isRunning) setCycles(0); }}
        className="px-10 py-3 rounded-full text-sm font-medium transition-colors"
        style={{
          fontFamily: "var(--font-jost)",
          backgroundColor: isRunning ? "transparent" : "var(--color-primary)",
          color: isRunning ? "var(--color-primary)" : "var(--color-cream)",
          border: "2px solid var(--color-primary)",
        }}
      >
        {isRunning ? "Pause" : "Begin"}
      </button>
    </div>
  );
}
