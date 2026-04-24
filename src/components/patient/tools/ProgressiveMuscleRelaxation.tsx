"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

const REGIONS = [
  { id: "feet", label: "Feet & Toes", instruction: "Curl your toes tightly downward." },
  { id: "calves", label: "Calves", instruction: "Flex your feet upward, tensing your calf muscles." },
  { id: "thighs", label: "Thighs", instruction: "Squeeze your thigh muscles firmly." },
  { id: "abdomen", label: "Abdomen", instruction: "Tighten your stomach muscles as if bracing for a punch." },
  { id: "chest", label: "Chest", instruction: "Take a deep breath in and hold it, tensing your chest." },
  { id: "shoulders", label: "Shoulders", instruction: "Raise your shoulders toward your ears." },
  { id: "arms", label: "Arms", instruction: "Extend your arms and make tight fists." },
  { id: "hands", label: "Hands", instruction: "Squeeze both hands into the tightest fists you can." },
  { id: "face", label: "Face & Jaw", instruction: "Scrunch your entire face — eyes, nose, jaw." },
];

const TENSE_DURATION = 5;

type PhaseState = "intro" | "tense" | "release" | "done";

export default function ProgressiveMuscleRelaxation({ onClose }: Props) {
  const [started, setStarted] = useState(false);
  const [regionIndex, setRegionIndex] = useState(0);
  const [phase, setPhase] = useState<PhaseState>("intro");
  const [timer, setTimer] = useState(TENSE_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const region = REGIONS[regionIndex];

  const clearTimers = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  };

  const startTense = () => {
    setPhase("tense");
    setTimer(TENSE_DURATION);
    let t = TENSE_DURATION;
    intervalRef.current = setInterval(() => {
      t -= 1;
      setTimer(t);
      if (t <= 0) {
        clearInterval(intervalRef.current);
        setPhase("release");
        timeoutRef.current = setTimeout(() => {
          // Advance or finish
          if (regionIndex + 1 >= REGIONS.length) {
            setPhase("done");
          } else {
            setRegionIndex((i) => i + 1);
            setPhase("intro");
          }
        }, 4000); // 4s release observation
      }
    }, 1000);
  };

  useEffect(() => () => clearTimers(), []);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 max-w-lg mx-auto text-center">
        <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          ← Back to tools
        </button>
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Progressive Muscle Relaxation
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          You'll move through 9 muscle groups. For each one: tense for 5 seconds, then release and notice the difference. The contrast between tension and release teaches your body what relaxation feels like.
        </p>
        <p className="text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          Takes about 8–10 minutes · Find a comfortable position first
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-10 py-3 rounded-full text-sm font-medium"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
        >
          Begin
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 max-w-lg mx-auto text-center">
        <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          Complete
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
          Take a moment to notice how your body feels now compared to when you started. This is what relaxation feels like. You can return here anytime.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setStarted(false); setRegionIndex(0); setPhase("intro"); }}
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

  return (
    <div className="flex flex-col items-center min-h-[60vh] gap-6 px-4 py-6 max-w-lg mx-auto w-full">
      <button onClick={onClose} className="self-start flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        ← Back to tools
      </button>

      {/* Progress */}
      <div className="flex gap-1.5 w-full">
        {REGIONS.map((r, i) => (
          <div
            key={r.id}
            className="flex-1 rounded-full"
            style={{
              height: 3,
              backgroundColor:
                i < regionIndex ? "var(--color-primary-light)" :
                i === regionIndex ? "var(--color-primary)" :
                "var(--color-border)",
            }}
          />
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
        {regionIndex + 1} of {REGIONS.length} · {region.label}
      </p>

      {/* Main content */}
      <div
        className="w-full rounded-2xl p-8 text-center flex flex-col items-center gap-6"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          {region.label}
        </p>

        {phase === "intro" && (
          <>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
              {region.instruction}
            </p>
            <button
              onClick={startTense}
              className="px-10 py-3 rounded-full text-sm font-medium"
              style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
            >
              Tense now
            </button>
          </>
        )}

        {phase === "tense" && (
          <>
            <p className="text-sm" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
              {region.instruction}
            </p>
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 88, height: 88, backgroundColor: "rgba(28,61,46,0.08)", border: "2px solid var(--color-primary)" }}
            >
              <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                {timer}
              </p>
            </div>
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
              Hold the tension
            </p>
          </>
        )}

        {phase === "release" && (
          <>
            <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)" }}>
              Release
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)", fontFamily: "var(--font-jost)" }}>
              Let go completely. Notice the warmth, the heaviness, the difference between tension and release. Stay with that feeling.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
