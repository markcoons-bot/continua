"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

type Phase = "idle" | "inhale" | "hold" | "exhale";

const PHASES = [
  { name: "inhale" as Phase, label: "Inhale", hint: "through your nose", duration: 4000, scale: 1.4, transitionMs: 4000 },
  { name: "hold" as Phase, label: "Hold", hint: "gently", duration: 7000, scale: 1.4, transitionMs: 0 },
  { name: "exhale" as Phase, label: "Exhale", hint: "completely through your mouth", duration: 8000, scale: 1.0, transitionMs: 8000 },
];

export default function FourSevenEight({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scale, setScale] = useState(1.0);
  const [transitionMs, setTransitionMs] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!isRunning) {
      clearTimeout(startRef.current);
      clearTimeout(timeoutRef.current);
      setPhase("idle");
      setScale(1.0);
      setTransitionMs(0);
      return;
    }

    setScale(1.0);
    setTransitionMs(0);

    function runPhase(i: number) {
      if (i > 0 && i % PHASES.length === 0) setCycles((c) => c + 1);
      const p = PHASES[i % PHASES.length];
      setPhase(p.name);
      setTransitionMs(p.transitionMs);
      setScale(p.scale);
      timeoutRef.current = setTimeout(() => runPhase(i + 1), p.duration);
    }

    startRef.current = setTimeout(() => runPhase(0), 80);
    return () => {
      clearTimeout(startRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isRunning]);

  const current = PHASES.find((p) => p.name === phase);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      <button
        onClick={onClose}
        className="self-start flex items-center gap-2 text-sm mb-2"
        style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
      >
        ← Back to tools
      </button>

      <div className="text-center max-w-sm">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          4-7-8 Breathing
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Dr. Andrew Weil's relaxation breath. Inhale for 4, hold for 7, exhale for 8. The extended exhale activates your parasympathetic nervous system.
        </p>
      </div>

      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        <div className="absolute rounded-full" style={{ width: 240, height: 240, border: "1px solid rgba(168,196,181,0.3)" }} />
        <div
          className="rounded-full"
          style={{
            width: 160,
            height: 160,
            backgroundColor: "rgba(168,196,181,0.18)",
            border: "2px solid rgba(74,139,108,0.5)",
            transform: `scale(${scale})`,
            transition: transitionMs > 0 ? `transform ${transitionMs}ms ease-in-out` : "none",
            boxShadow: isRunning ? "0 0 40px rgba(74,139,108,0.2)" : "none",
          }}
        />
        <div className="absolute flex flex-col items-center gap-1 text-center px-6">
          <p className="text-2xl leading-none" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
            {phase === "idle" ? "Ready" : current?.label}
          </p>
          {current?.hint && phase !== "idle" && (
            <p className="text-xs mt-1" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
              {current.hint}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-8 text-center">
        {PHASES.map((p) => (
          <div key={p.name}>
            <p className="text-2xl font-light" style={{ fontFamily: "var(--font-cormorant)", color: phase === p.name ? "var(--color-primary)" : "var(--color-border)" }}>
              {p.name === "inhale" ? "4" : p.name === "hold" ? "7" : "8"}
            </p>
            <p className="text-xs" style={{ color: phase === p.name ? "var(--color-muted)" : "var(--color-border)", fontFamily: "var(--font-jost)" }}>
              {p.label.toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      {cycles > 0 && (
        <p className="text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          {cycles} cycle{cycles !== 1 ? "s" : ""} completed
        </p>
      )}

      <button
        onClick={() => { setIsRunning((r) => !r); if (!isRunning) setCycles(0); }}
        className="px-10 py-3 rounded-full text-sm font-medium"
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
