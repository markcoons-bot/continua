"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

type Phase = "idle" | "first-inhale" | "second-inhale" | "exhale" | "done";

const TOTAL_CYCLES = 3;

export default function PhysiologicalSigh({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [transitionMs, setTransitionMs] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!isRunning) {
      clearTimeout(timeoutRef.current);
      setPhase("idle");
      setScale(1.0);
      setTransitionMs(0);
      return;
    }

    setCycle(0);
    setScale(1.0);
    setTransitionMs(0);

    function runCycle(c: number) {
      if (c >= TOTAL_CYCLES) {
        setPhase("done");
        setIsRunning(false);
        return;
      }
      setCycle(c + 1);

      // First inhale: 1.5s, expand to 70%
      setPhase("first-inhale");
      setTransitionMs(1500);
      setScale(1.25);
      timeoutRef.current = setTimeout(() => {
        // Second inhale: 0.5s, expand to 100%
        setPhase("second-inhale");
        setTransitionMs(500);
        setScale(1.45);
        timeoutRef.current = setTimeout(() => {
          // Long exhale: 4s
          setPhase("exhale");
          setTransitionMs(4000);
          setScale(1.0);
          timeoutRef.current = setTimeout(() => runCycle(c + 1), 4200);
        }, 600);
      }, 1600);
    }

    const startId = setTimeout(() => runCycle(0), 100);
    return () => {
      clearTimeout(startId);
      clearTimeout(timeoutRef.current);
    };
  }, [isRunning]);

  const phaseLabel =
    phase === "idle" ? "Ready" :
    phase === "first-inhale" ? "Inhale" :
    phase === "second-inhale" ? "Inhale again" :
    phase === "exhale" ? "Exhale slowly" :
    "Complete";

  const phaseHint =
    phase === "first-inhale" ? "through your nose" :
    phase === "second-inhale" ? "a second breath, top it off" :
    phase === "exhale" ? "long and slow through your mouth" : "";

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
        <h2
          className="text-3xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Physiological Sigh
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Dr. Andrew Huberman's research shows this is the fastest way to reduce physiological stress — two quick inhales followed by one long exhale.
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
        <div className="absolute flex flex-col items-center gap-1 text-center px-4">
          <p className="text-xl leading-tight" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
            {phaseLabel}
          </p>
          {phaseHint && (
            <p className="text-xs" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
              {phaseHint}
            </p>
          )}
        </div>
      </div>

      {cycle > 0 && phase !== "done" && (
        <p className="text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          Cycle {cycle} of {TOTAL_CYCLES}
        </p>
      )}

      {phase === "done" && (
        <p className="text-base" style={{ color: "var(--color-primary-mid)", fontFamily: "var(--font-cormorant)" }}>
          Your nervous system is settling. Notice the shift.
        </p>
      )}

      <button
        onClick={() => { setIsRunning((r) => !r); setCycle(0); setPhase("idle"); }}
        className="px-10 py-3 rounded-full text-sm font-medium"
        style={{
          fontFamily: "var(--font-jost)",
          backgroundColor: isRunning ? "transparent" : "var(--color-primary)",
          color: isRunning ? "var(--color-primary)" : "var(--color-cream)",
          border: "2px solid var(--color-primary)",
        }}
      >
        {phase === "done" ? "Again" : isRunning ? "Stop" : "Begin"}
      </button>
    </div>
  );
}
