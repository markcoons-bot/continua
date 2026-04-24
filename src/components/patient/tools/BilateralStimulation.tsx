"use client";

import { useEffect, useRef, useState } from "react";
import { Patient, EMDRResource } from "@/data/patients";

interface Props {
  onClose: () => void;
  patient: Patient;
  isEMDR?: boolean;
}

type Mode = "resource" | "calm";
type Speed = "gentle" | "standard" | "active";
type SessionLength = 1 | 3 | 5 | null;
type Phase = "setup" | "running" | "paused" | "complete";

const SPEED_CONFIG: Record<Speed, { ms: number; label: string; sub: string }> = {
  gentle:   { ms: 4000, label: "Gentle · 4s",   sub: "Resource installation, calming" },
  standard: { ms: 2000, label: "Standard · 2s",  sub: "General use" },
  active:   { ms: 1000, label: "Active · 1s",    sub: "Higher activation reduction" },
};

const RESOURCE_TYPE_LABELS: Record<EMDRResource["type"], string> = {
  safe_place:  "Safe Place",
  calm_place:  "Calm Place",
  nurturing:   "Nurturing Figure",
  protector:   "Protector",
};

const DOT_SIZE    = 28;
const TRACK_PAD   = 20;

export default function BilateralStimulation({ onClose, patient, isEMDR = false }: Props) {
  // ─── UI state ────────────────────────────────────────────────────────────────
  const [phase,            setPhase]            = useState<Phase>("setup");
  const [mode,             setMode]             = useState<Mode>(isEMDR ? "resource" : "calm");
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [howWorksOpen,     setHowWorksOpen]     = useState(false);
  const [speed,            setSpeed]            = useState<Speed>(isEMDR ? "gentle" : "standard");
  const [widthPct,         setWidthPct]         = useState<50 | 75 | 100>(100);
  const [sessionLength,    setSessionLength]    = useState<SessionLength>(3);
  const [audioEnabled,     setAudioEnabled]     = useState(false);
  const [audioPending,     setAudioPending]     = useState(false);

  // ─── Session state ────────────────────────────────────────────────────────────
  const [timeRemaining,  setTimeRemaining]  = useState(0);
  const [totalTime,      setTotalTime]      = useState(0);
  const [sudsBefore,     setSudsBefore]     = useState<number | null>(null);
  const [sudsBeforeVal,  setSudsBeforeVal]  = useState(patient.sudsBaseline ?? 5);
  const [sudsAfterVal,   setSudsAfterVal]   = useState(5);
  const [sudsAfterLogged, setSudsAfterLogged] = useState(false);
  const [showSudsBefore, setShowSudsBefore] = useState(false);

  // ─── Animation state ──────────────────────────────────────────────────────────
  const [containerWidth, setContainerWidth] = useState(0);
  const [animKey,        setAnimKey]        = useState(0);

  // ─── Refs ─────────────────────────────────────────────────────────────────────
  const containerRef     = useRef<HTMLDivElement>(null);
  const isRunningRef     = useRef(false);
  const animStartRef     = useRef(0);
  const durationRef      = useRef(SPEED_CONFIG["standard"].ms);
  const timerRef         = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const pannerRef        = useRef<StereoPannerNode | null>(null);
  const gainRef          = useRef<GainNode | null>(null);
  const audioRafRef      = useRef<number | null>(null);

  // ─── ResizeObserver ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // ─── Visibility API ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      if (document.hidden && isRunningRef.current) doPause();
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  });

  // ─── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stopAudioRaf();
      audioCtxRef.current?.close();
    };
  }, []);

  // ─── Derived geometry ─────────────────────────────────────────────────────────
  const maxTravel  = Math.max(0, containerWidth - DOT_SIZE - TRACK_PAD * 2);
  const dotTravel  = Math.round((widthPct / 100) * maxTravel);
  const trackOffset = Math.round((maxTravel - dotTravel) / 2); // center the travel band

  // ─── CSS custom properties applied to the container ──────────────────────────
  const containerStyle = {
    "--travel-width":  `${dotTravel}px`,
    "--bls-duration":  `${SPEED_CONFIG[speed].ms}ms`,
  } as React.CSSProperties;

  // ─── Audio helpers ────────────────────────────────────────────────────────────
  function initAudio() {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().then(() => setAudioPending(false));
      }
      return;
    }
    try {
      const ctx  = new AudioContext();
      const osc  = ctx.createOscillator();
      const pan  = ctx.createStereoPanner();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 440;
      gain.gain.value = 0.15;
      osc.connect(pan);
      pan.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioCtxRef.current = ctx;
      pannerRef.current   = pan;
      gainRef.current     = gain;
      if (ctx.state === "suspended") setAudioPending(true);
    } catch {
      setAudioEnabled(false);
    }
  }

  function startAudioRaf() {
    if (audioRafRef.current) cancelAnimationFrame(audioRafRef.current);
    const startSnap = animStartRef.current;
    function loop(now: DOMHighResTimeStamp) {
      if (!pannerRef.current || !isRunningRef.current) return;
      const dur      = durationRef.current;
      const elapsed  = now - startSnap;
      const passNum  = Math.floor(elapsed / dur);
      const progress = (elapsed % dur) / dur;
      const isRev    = passNum % 2 === 1;
      const pan      = isRev ? 1 - progress * 2 : progress * 2 - 1;
      pannerRef.current.pan.value = Math.max(-1, Math.min(1, pan));
      audioRafRef.current = requestAnimationFrame(loop);
    }
    audioRafRef.current = requestAnimationFrame(loop);
  }

  function stopAudioRaf() {
    if (audioRafRef.current) { cancelAnimationFrame(audioRafRef.current); audioRafRef.current = null; }
    if (pannerRef.current)     pannerRef.current.pan.value = 0;
  }

  // ─── Timer helpers ────────────────────────────────────────────────────────────
  function startTimer(seconds: number) {
    clearInterval(timerRef.current);
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); doComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  function resumeTimer(remaining: number) {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); doComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
    void remaining;
  }

  // ─── Session actions ─────────────────────────────────────────────────────────
  function restartAnimation() {
    animStartRef.current  = performance.now();
    durationRef.current   = SPEED_CONFIG[speed].ms;
    isRunningRef.current  = true;
    setAnimKey(k => k + 1);
  }

  function doStart() {
    restartAnimation();
    setPhase("running");
    setSudsAfterLogged(false);
    if (sessionLength !== null) startTimer(sessionLength * 60);
    if (audioEnabled) { initAudio(); startAudioRaf(); }
  }

  function doPause() {
    isRunningRef.current = false;
    setPhase("paused");
    clearInterval(timerRef.current);
    stopAudioRaf();
  }

  function doResume() {
    restartAnimation();
    setPhase("running");
    if (sessionLength !== null && timeRemaining > 0) resumeTimer(timeRemaining);
    if (audioEnabled) startAudioRaf();
  }

  function doStop() {
    isRunningRef.current = false;
    clearInterval(timerRef.current);
    stopAudioRaf();
    setPhase("setup");
    setTimeRemaining(0);
    setTotalTime(0);
  }

  function doComplete() {
    isRunningRef.current = false;
    stopAudioRaf();
    clearInterval(timerRef.current);
    setPhase("complete");
  }

  // ─── Speed change ─────────────────────────────────────────────────────────────
  function changeSpeed(s: Speed) {
    if (mode === "resource" && s === "active") return;
    setSpeed(s);
    durationRef.current = SPEED_CONFIG[s].ms;
    if (phase === "running") {
      animStartRef.current = performance.now();
      setAnimKey(k => k + 1);
      if (audioEnabled) { stopAudioRaf(); startAudioRaf(); }
    }
  }

  // ─── Audio toggle ─────────────────────────────────────────────────────────────
  function toggleAudio() {
    const next = !audioEnabled;
    setAudioEnabled(next);
    if (next) { initAudio(); if (phase === "running") startAudioRaf(); }
    else stopAudioRaf();
  }

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const availableSpeeds: Speed[] = mode === "resource" ? ["gentle", "standard"] : ["gentle", "standard", "active"];
  const timerProgress   = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const mins            = Math.floor(timeRemaining / 60);
  const secs            = timeRemaining % 60;
  const hasResources    = isEMDR && (patient.resources?.length ?? 0) > 0;
  const inSetup         = phase === "setup";
  const inRunning       = phase === "running";
  const inPaused        = phase === "paused";
  const inComplete      = phase === "complete";

  // ─── Running reminder text ────────────────────────────────────────────────────
  const reminderText =
    mode === "resource" && selectedResource && selectedResource !== "own"
      ? `Hold your ${selectedResource} in mind… feel it in your body…`
      : mode === "resource"
      ? "Hold your resource… let the image become vivid… feel it in your body…"
      : "Follow the dot. Keep your head still. Breathe naturally.";

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-8">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <button
          onClick={onClose}
          className="text-sm mt-1 flex-shrink-0"
          style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}
        >
          ← Back
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              Bilateral Stimulation
            </h2>
            {isEMDR && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full border flex-shrink-0"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-mid)", borderColor: "rgba(45,94,70,0.3)", backgroundColor: "rgba(45,94,70,0.06)" }}
              >
                EMDR Resource Tool
              </span>
            )}
          </div>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            Dual-attention stimulation for resource installation and emotional regulation — a core mechanism of EMDR therapy.
          </p>
        </div>
      </div>

      {/* ── "How this works" accordion ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-left"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", backgroundColor: "var(--color-surface)" }}
          onClick={() => setHowWorksOpen(v => !v)}
        >
          <span>How this works</span>
          <span
            style={{
              color: "var(--color-quiet)",
              display: "inline-block",
              transform: howWorksOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          >↓</span>
        </button>
        {howWorksOpen && (
          <div className="px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
              Bilateral stimulation activates alternating hemispheric processing, engaging the same neural mechanism used in EMDR therapy. Between sessions, BLS is most effective for strengthening positive resources — a safe place, a calm memory, a felt sense of safety. Follow the dot with your eyes, hold your chosen resource in mind, and notice what shifts.
            </p>
            <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-quiet)", fontSize: "1rem", lineHeight: 1.8 }}>
              Dr. Francine Shapiro first observed the calming effect of lateral eye movements on emotional distress in 1987 — this became the foundation of EMDR therapy.
            </p>
          </div>
        )}
      </div>

      {/* ── Mode selector (setup + paused) ── */}
      {(inSetup || inPaused) && (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Session type
          </p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "resource" as Mode, icon: "◈", title: "Resource Installation", desc: "Strengthen a safe place, calm memory, or installed EMDR resource with BLS" },
              { id: "calm"     as Mode, icon: "◉", title: "General Calming",        desc: "Follow the dot and breathe — for anxiety reduction and grounding" },
            ]).map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); if (m.id === "resource" && speed === "active") setSpeed("standard"); }}
                className="rounded-xl p-4 text-left flex flex-col gap-2 transition-all"
                style={{
                  backgroundColor: mode === m.id ? "rgba(28,61,46,0.05)" : "var(--color-surface)",
                  border: `2px solid ${mode === m.id ? "var(--color-primary-mid)" : "var(--color-border)"}`,
                }}
              >
                <span className="text-xl" style={{ color: mode === m.id ? "var(--color-primary)" : "var(--color-sage)" }}>{m.icon}</span>
                <p className="text-base leading-tight" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>{m.title}</p>
                <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Resource selector ── */}
      {inSetup && mode === "resource" && hasResources && (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            What resource will you bring to mind?
          </p>
          <div className="flex flex-wrap gap-2">
            {patient.resources!.map(r => (
              <button
                key={r.name}
                onClick={() => setSelectedResource(r.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor: selectedResource === r.name ? "var(--color-primary)" : "var(--color-surface)",
                  color:           selectedResource === r.name ? "var(--color-cream)"   : "var(--color-muted)",
                  border:          `1px solid ${selectedResource === r.name ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                <span className="opacity-60 text-xs">{RESOURCE_TYPE_LABELS[r.type]}</span>
                <span className="opacity-40 text-xs">·</span>
                <span>{r.name}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedResource("own")}
              className="px-3 py-1.5 rounded-full text-sm italic transition-all"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.95rem",
                backgroundColor: selectedResource === "own" ? "var(--color-primary)" : "var(--color-surface)",
                color:           selectedResource === "own" ? "var(--color-cream)"   : "var(--color-quiet)",
                border:          `1px solid ${selectedResource === "own" ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              I&apos;ll bring my own
            </button>
          </div>

          {selectedResource && selectedResource !== "own" && (
            <div className="rounded-lg p-4 mt-1" style={{ backgroundColor: "rgba(168,196,181,0.08)", border: "1px solid rgba(168,196,181,0.3)" }}>
              <p className="text-base italic leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)", lineHeight: 1.85 }}>
                Bring your {selectedResource} to mind. Hold the image, the feelings, the sensations in your body. When it feels vivid — when you can almost be there — press Begin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resource prompt without named resources */}
      {inSetup && mode === "resource" && !hasResources && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(168,196,181,0.08)", border: "1px solid rgba(168,196,181,0.3)" }}>
          <p className="text-base italic leading-relaxed" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)", lineHeight: 1.85 }}>
            Bring your safe place or calm memory to mind. Hold the image, the feelings, the sensations. When it feels vivid, press Begin.
          </p>
        </div>
      )}

      {/* ── Controls (setup + paused) ── */}
      {(inSetup || inPaused) && (
        <div className="flex flex-col gap-4">
          {/* Speed */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Speed</p>
            <div className="flex flex-wrap gap-2">
              {(["gentle", "standard", "active"] as Speed[]).map(s => {
                const ok  = availableSpeeds.includes(s);
                const sel = speed === s;
                return (
                  <button
                    key={s}
                    onClick={() => ok && changeSpeed(s)}
                    disabled={!ok}
                    className="flex flex-col px-4 py-2 rounded-lg text-left transition-all flex-1 min-w-0"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: sel ? "var(--color-primary)" : ok ? "var(--color-surface)" : "transparent",
                      border: `1px solid ${sel ? "var(--color-primary)" : "var(--color-border)"}`,
                      opacity: ok ? 1 : 0.4,
                      cursor:  ok ? "pointer" : "not-allowed",
                    }}
                  >
                    <span className="text-xs font-medium" style={{ color: sel ? "var(--color-cream)" : "var(--color-text)" }}>
                      {SPEED_CONFIG[s].label}
                    </span>
                    <span className="text-xs mt-0.5 leading-tight" style={{ color: sel ? "rgba(245,237,216,0.65)" : "var(--color-quiet)" }}>
                      {SPEED_CONFIG[s].sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Width · Session length · Audio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Width */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Travel width</p>
              <div className="flex gap-1">
                {([50, 75, 100] as const).map(w => (
                  <button key={w} onClick={() => setWidthPct(w)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: widthPct === w ? "var(--color-primary)" : "var(--color-surface)",
                      color:           widthPct === w ? "var(--color-cream)"   : "var(--color-muted)",
                      border:          `1px solid ${widthPct === w ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >{w}%</button>
                ))}
              </div>
            </div>

            {/* Session length */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Duration</p>
              <div className="flex gap-1">
                {([1, 3, 5, null] as SessionLength[]).map(l => (
                  <button key={l ?? "c"} onClick={() => setSessionLength(l)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: sessionLength === l ? "var(--color-primary)" : "var(--color-surface)",
                      color:           sessionLength === l ? "var(--color-cream)"   : "var(--color-muted)",
                      border:          `1px solid ${sessionLength === l ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >{l === null ? "∞" : `${l}m`}</button>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Audio BLS</p>
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs transition-all"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor: audioEnabled ? "rgba(74,139,108,0.1)" : "var(--color-surface)",
                  color:           audioEnabled ? "var(--color-primary-light)" : "var(--color-muted)",
                  border:          `1px solid ${audioEnabled ? "rgba(74,139,108,0.3)" : "var(--color-border)"}`,
                  minHeight: 34,
                }}
              >
                <span>🎧</span>
                <span>{audioEnabled ? "Audio on" : "Audio off"}</span>
              </button>
              {audioEnabled && (
                <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  Use headphones for bilateral effect
                </p>
              )}
              {audioPending && (
                <button
                  onClick={() => { audioCtxRef.current?.resume(); setAudioPending(false); }}
                  className="text-xs px-2 py-1 rounded"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)", backgroundColor: "rgba(200,146,46,0.08)", border: "1px solid rgba(200,146,46,0.2)" }}
                >
                  Tap to activate audio
                </button>
              )}
            </div>
          </div>

          {/* SUDS before (EMDR only) */}
          {isEMDR && !showSudsBefore && sudsBefore === null && (
            <button
              onClick={() => setShowSudsBefore(true)}
              className="self-start text-xs"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", textDecoration: "underline" }}
            >
              Log a SUDS before session (optional)
            </button>
          )}
          {isEMDR && showSudsBefore && sudsBefore === null && (
            <div className="flex flex-col gap-2">
              <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                SUDS before: <strong style={{ color: "var(--color-primary)" }}>{sudsBeforeVal}</strong>
              </p>
              <input type="range" min={0} max={10} value={sudsBeforeVal}
                onChange={e => setSudsBeforeVal(Number(e.target.value))}
                className="w-full max-w-xs"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <button
                onClick={() => { setSudsBefore(sudsBeforeVal); setShowSudsBefore(false); }}
                className="self-start text-xs px-3 py-1 rounded-full"
                style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
              >
                Log {sudsBeforeVal}
              </button>
            </div>
          )}
          {isEMDR && sudsBefore !== null && (
            <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
              ✓ SUDS before: {sudsBefore}
            </p>
          )}
        </div>
      )}

      {/* ── DOT TRACK ── */}
      {!inComplete && (
        <div className="flex flex-col gap-2">
          <div
            ref={containerRef}
            className="w-full relative rounded-xl overflow-hidden"
            style={{
              height: 80,
              backgroundColor: "rgba(168,196,181,0.08)",
              border: `1px solid ${inRunning ? "rgba(168,196,181,0.4)" : "var(--color-border)"}`,
              transition: "border-color 400ms ease",
              ...containerStyle,
            }}
          >
            {/* Track line */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left:  TRACK_PAD + trackOffset + DOT_SIZE / 2,
                width: dotTravel,
                height: 1,
                backgroundColor: "rgba(168,196,181,0.3)",
                transform: "translateY(-0.5px)",
                pointerEvents: "none",
              }}
            />

            {/* The dot */}
            <div
              key={animKey}
              style={{
                position: "absolute",
                top:  "50%",
                left: TRACK_PAD + trackOffset,
                width:  DOT_SIZE,
                height: DOT_SIZE,
                marginTop: -(DOT_SIZE / 2),
                borderRadius: "50%",
                backgroundColor: "#A8C4B5",
                border: "1.5px solid #4A8B6C",
                boxShadow: inRunning
                  ? "0 0 12px rgba(74,139,108,0.5), 0 0 4px rgba(74,139,108,0.8)"
                  : "none",
                transition: inRunning ? undefined : "box-shadow 400ms ease",
                animation: inRunning
                  ? "bls-pass var(--bls-duration) linear infinite alternate"
                  : "none",
                willChange: "transform",
              }}
            />
          </div>

          {/* Timer bar */}
          {inRunning && sessionLength !== null && totalTime > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, backgroundColor: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${timerProgress * 100}%`,
                    backgroundColor: "var(--color-primary)",
                    transition: "width 1s linear",
                  }}
                />
              </div>
              <span className="text-xs tabular-nums flex-shrink-0" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                {mins}:{secs.toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Running reminder ── */}
      {inRunning && (
        <p className="text-center text-base italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)", fontSize: "1.1rem", lineHeight: 1.8 }}>
          {reminderText}
        </p>
      )}

      {/* ── Primary action buttons ── */}
      {inSetup && (
        <button
          onClick={doStart}
          className="py-3.5 rounded-full text-sm font-medium"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)", letterSpacing: "0.06em" }}
        >
          Begin Session
        </button>
      )}

      {inRunning && (
        <div className="flex gap-3">
          <button onClick={doPause}
            className="flex-1 py-3 rounded-full text-sm font-medium"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary)", border: "2px solid var(--color-primary)", backgroundColor: "transparent" }}
          >Pause</button>
          <button onClick={doStop}
            className="px-6 py-3 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", border: "1px solid var(--color-border)" }}
          >End</button>
        </div>
      )}

      {inPaused && (
        <div className="flex gap-3">
          <button onClick={doResume}
            className="flex-1 py-3 rounded-full text-sm font-medium"
            style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
          >Resume</button>
          <button onClick={doStop}
            className="px-6 py-3 rounded-full text-sm"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", border: "1px solid var(--color-border)" }}
          >End Session</button>
        </div>
      )}

      {/* Speed change while running/paused */}
      {(inRunning || inPaused) && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Speed:</span>
          {availableSpeeds.map(s => (
            <button key={s} onClick={() => changeSpeed(s)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: speed === s ? "var(--color-primary)" : "transparent",
                color:           speed === s ? "var(--color-cream)"   : "var(--color-muted)",
                border:          `1px solid ${speed === s ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >{SPEED_CONFIG[s].label}</button>
          ))}
        </div>
      )}

      {/* ── Complete screen ── */}
      {inComplete && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-6 text-center flex flex-col gap-3" style={{ backgroundColor: "rgba(74,139,108,0.06)", border: "1px solid rgba(74,139,108,0.25)" }}>
            <p className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              Session complete
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              {mode === "resource"
                ? "How does your resource feel now? Notice any strengthening, any deepening of the feeling."
                : "How do you feel now? Take a breath and notice what shifted."}
            </p>
          </div>

          {/* SUDS after */}
          {isEMDR && !sudsAfterLogged && (
            <div className="flex flex-col gap-3 rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                How activated do you feel now? (0–10)
              </p>
              <div className="flex items-center gap-4">
                <p className="text-4xl flex-shrink-0" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-light)" }}>
                  {sudsAfterVal}
                </p>
                <input type="range" min={0} max={10} value={sudsAfterVal}
                  onChange={e => setSudsAfterVal(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: "var(--color-primary-light)" }}
                />
              </div>
              <button
                onClick={() => setSudsAfterLogged(true)}
                className="self-start px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
              >
                Log {sudsAfterVal}
              </button>
            </div>
          )}

          {/* Before / after comparison */}
          {isEMDR && sudsAfterLogged && sudsBefore !== null && (
            <div className="rounded-xl p-5 flex items-center gap-4" style={{ backgroundColor: "rgba(74,139,108,0.05)", border: "1px solid rgba(74,139,108,0.2)" }}>
              <div className="text-center flex-1">
                <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-accent)" }}>{sudsBefore}</p>
                <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Before</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-lg" style={{ fontFamily: "var(--font-cormorant)", color: sudsAfterVal < sudsBefore ? "var(--color-primary-light)" : "var(--color-quiet)" }}>
                  {sudsAfterVal < sudsBefore
                    ? `↓ ${sudsBefore - sudsAfterVal} pt${sudsBefore - sudsAfterVal !== 1 ? "s" : ""}`
                    : sudsAfterVal === sudsBefore ? "no change" : `↑ ${sudsAfterVal - sudsBefore}`}
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  {sudsAfterVal < sudsBefore ? "Resource strengthened" : "Note for your next session"}
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-light)" }}>{sudsAfterVal}</p>
                <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>After</p>
              </div>
            </div>
          )}

          <button onClick={doStop}
            className="py-3 rounded-full text-sm font-medium"
            style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
          >
            New session
          </button>
        </div>
      )}

      {/* ── Clinical note ── */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(200,146,46,0.04)", border: "1px solid rgba(200,146,46,0.15)" }}>
        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          <span className="font-medium" style={{ color: "var(--color-accent)" }}>Important: </span>
          Bilateral stimulation between sessions is for resource installation and calming only. For trauma processing, always work with Dr. Harrison. If distressing material arises during a session, stop and use your containment tool.
        </p>
      </div>

    </div>
  );
}
