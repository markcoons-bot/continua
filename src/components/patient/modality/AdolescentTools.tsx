"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
}

interface LadderRung {
  label: string;
  done: boolean;
  isNew?: boolean;
}

const BODY_ZONES = [
  {
    id: "head",
    label: "Head / Mind",
    position: { top: "0%", left: "50%", transform: "translateX(-50%)" },
    prompt: "Racing thoughts? That's your brain trying to protect you. Take a slow breath and name five things you can actually see right now.",
  },
  {
    id: "throat",
    label: "Throat",
    position: { top: "18%", left: "50%", transform: "translateX(-50%)" },
    prompt: "Tight throat can mean something wants to be said but you're holding it back. That's okay. You don't have to say it out loud — just notice it.",
  },
  {
    id: "shoulders",
    label: "Shoulders",
    position: { top: "30%", left: "50%", transform: "translateX(-50%)" },
    prompt: "Shoulders carry a lot. Can you let them drop just a little — even 10%? You've been holding more than you need to.",
  },
  {
    id: "chest",
    label: "Chest",
    position: { top: "42%", left: "35%" },
    prompt: "Chest tightness is anxiety looking for an exit. Try this: put a hand there, breathe in slowly for 4 counts, out for 6. You're okay.",
  },
  {
    id: "stomach",
    label: "Stomach",
    position: { top: "42%", left: "65%", transform: "translateX(-100%)" },
    prompt: "The knot in your stomach is real information, not a malfunction. What's it trying to tell you? You don't have to fix it — just notice what it's about.",
  },
  {
    id: "hands",
    label: "Hands",
    position: { top: "62%", left: "50%", transform: "translateX(-50%)" },
    prompt: "Try this: press your palms together firmly for 5 seconds, then release. Or hold something cool. Your hands can help reset your nervous system.",
  },
  {
    id: "legs",
    label: "Legs",
    position: { top: "78%", left: "50%", transform: "translateX(-50%)" },
    prompt: "Legs want to carry you somewhere when danger is nearby — that's what anxiety feels like in the body. Try slow stomping: left, right, left. Tell your body you're okay right here.",
  },
];

const REPLAY_STEPS = [
  { id: "facts", label: "What actually happened", placeholder: "Just the facts — what would a video camera have recorded? No interpretations, just what happened." },
  { id: "self-talk", label: "What my brain told me", placeholder: "What thoughts ran through your head? What did you tell yourself about it?" },
  { id: "friend", label: "What I'd tell a friend", placeholder: "If your friend described this exact situation to you, what would you say to them?" },
  { id: "reframe", label: "A more helpful thought", placeholder: "Taking the friend perspective — what's a more useful way to think about this?" },
];

const INITIAL_RUNGS: LadderRung[] = [
  { label: "Said hi to someone in the hall", done: true },
  { label: "Answered a question in class when I knew the answer", done: true },
  { label: "Stayed at lunch with people I didn't know for 12 minutes", done: true },
];

export default function AdolescentTools({ patient }: Props) {
  const [tab, setTab] = useState<"ladder" | "replay" | "body">("ladder");
  const [rungs, setRungs] = useState<LadderRung[]>(INITIAL_RUNGS);
  const [newRungText, setNewRungText] = useState("");
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [replayStep, setReplayStep] = useState(0);
  const [replayData, setReplayData] = useState<Record<string, string>>({});
  const [replayComplete, setReplayComplete] = useState(false);

  const addRung = () => {
    if (!newRungText.trim()) return;
    setRungs((prev) => [...prev, { label: newRungText.trim(), done: false, isNew: true }]);
    setNewRungText("");
  };

  const toggleRung = (i: number) => {
    setRungs((prev) => prev.map((r, idx) => idx === i ? { ...r, done: !r.done } : r));
  };

  const currentStep = REPLAY_STEPS[replayStep];
  const finishReplay = () => { setReplayComplete(true); };
  const resetReplay = () => { setReplayStep(0); setReplayData({}); setReplayComplete(false); };

  const activeZoneData = BODY_ZONES.find((z) => z.id === activeZone);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {(["ladder", "replay", "body"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all" style={{ fontFamily: "var(--font-jost)", backgroundColor: tab === t ? "var(--color-primary)" : "transparent", color: tab === t ? "var(--color-cream)" : "var(--color-muted)" }}>
            {t === "ladder" ? "Courage Ladder" : t === "replay" ? "Situation Replay" : "Body Check-in"}
          </button>
        ))}
      </div>

      {/* Courage Ladder */}
      {tab === "ladder" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            These are things you've actually done. Each one is a rung. You are further up this ladder than you think.
          </p>

          {/* Ladder visual */}
          <div className="flex flex-col-reverse gap-0">
            {rungs.map((rung, i) => (
              <div key={i} className="flex items-center gap-0">
                {/* Left rail */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
                  {i < rungs.length - 1 && (
                    <div className="w-0.5 flex-1" style={{ minHeight: 16, backgroundColor: "var(--color-border)" }} />
                  )}
                  <button
                    onClick={() => toggleRung(i)}
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: rung.done ? "var(--color-primary)" : "transparent",
                      border: `2px solid ${rung.done ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {rung.done && <span className="text-white" style={{ fontSize: 10 }}>✓</span>}
                  </button>
                  {i > 0 && (
                    <div className="w-0.5 flex-1" style={{ minHeight: 16, backgroundColor: "var(--color-border)" }} />
                  )}
                </div>

                {/* Rung content */}
                <div
                  className="flex-1 ml-3 my-1 rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: rung.done
                      ? rung.isNew
                        ? "rgba(200,146,46,0.06)"
                        : "rgba(74,139,108,0.06)"
                      : "var(--color-surface)",
                    border: `1px solid ${rung.done ? rung.isNew ? "rgba(200,146,46,0.2)" : "rgba(74,139,108,0.2)" : "var(--color-border)"}`,
                  }}
                >
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: rung.done ? "var(--color-primary)" : "var(--color-muted)",
                      textDecoration: rung.done && !rung.isNew ? "none" : "none",
                    }}
                  >
                    {rung.done && "✓ "}{rung.label}
                  </p>
                  {rung.isNew && !rung.done && (
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}>
                      Next brave thing
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add new rung */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRungText}
              onChange={(e) => setNewRungText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRung()}
              placeholder="Add a next brave thing…"
              className="flex-1 rounded-lg px-4 py-2.5 outline-none text-sm"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <button
              onClick={addRung}
              disabled={!newRungText.trim()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: newRungText.trim() ? "var(--color-primary)" : "var(--color-border)",
                color: newRungText.trim() ? "var(--color-cream)" : "var(--color-quiet)",
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Social Situation Replay */}
      {tab === "replay" && (
        <div className="flex flex-col gap-5">
          {replayComplete ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(74,139,108,0.06)", border: "1px solid rgba(74,139,108,0.2)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                  More helpful thought
                </p>
                <p className="text-lg italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  "{replayData.reframe}"
                </p>
              </div>
              <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                That's the thought to carry. You might want to write it somewhere you'll see it.
              </p>
              <button onClick={resetReplay} className="self-start px-6 py-2.5 rounded-full text-sm" style={{ fontFamily: "var(--font-jost)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}>
                Replay another situation
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex gap-1.5">
                {REPLAY_STEPS.map((_, i) => (
                  <div key={i} className="flex-1 rounded-full" style={{ height: 3, backgroundColor: i < replayStep ? "var(--color-primary-light)" : i === replayStep ? "var(--color-primary)" : "var(--color-border)" }} />
                ))}
              </div>

              <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  Step {replayStep + 1} of {REPLAY_STEPS.length}
                </p>
                <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {currentStep.label}
                </p>
                <textarea
                  className="w-full resize-none outline-none bg-transparent text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-text)", minHeight: 120, caretColor: "var(--color-primary)", lineHeight: 1.75 }}
                  placeholder={currentStep.placeholder}
                  value={replayData[currentStep.id] ?? ""}
                  onChange={(e) => setReplayData((prev) => ({ ...prev, [currentStep.id]: e.target.value }))}
                />
                <div className="flex justify-between">
                  {replayStep > 0 ? (
                    <button onClick={() => setReplayStep((s) => s - 1)} className="text-sm px-4 py-2 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", border: "1px solid var(--color-border)" }}>
                      ← Back
                    </button>
                  ) : <div />}
                  <button
                    onClick={() => {
                      if (replayStep + 1 >= REPLAY_STEPS.length) finishReplay();
                      else setReplayStep((s) => s + 1);
                    }}
                    disabled={!replayData[currentStep.id]?.trim()}
                    className="text-sm px-6 py-2 rounded-full font-medium"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: replayData[currentStep.id]?.trim() ? "var(--color-primary)" : "var(--color-border)",
                      color: replayData[currentStep.id]?.trim() ? "var(--color-cream)" : "var(--color-quiet)",
                    }}
                  >
                    {replayStep + 1 >= REPLAY_STEPS.length ? "Finish" : "Next →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Body check-in */}
      {tab === "body" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            Tap a body zone to notice what's happening there right now.
          </p>

          {/* Simplified body zones as a vertical list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BODY_ZONES.map((zone) => {
              const isActive = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(isActive ? null : zone.id)}
                  className="rounded-xl py-4 px-3 text-sm font-medium transition-all"
                  style={{
                    fontFamily: "var(--font-jost)",
                    backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                    color: isActive ? "var(--color-cream)" : "var(--color-muted)",
                    border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  {zone.label}
                </button>
              );
            })}
          </div>

          {activeZoneData && (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "rgba(168,196,181,0.08)", border: "1px solid rgba(168,196,181,0.3)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                {activeZoneData.label}
              </p>
              <p className="text-base leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85 }}>
                {activeZoneData.prompt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
