"use client";

import { useEffect, useRef, useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
}

const ACCEPTS_SKILLS = [
  {
    letter: "A",
    name: "Activities",
    description: "Keep busy with something you enjoy or need to do.",
    ideas: ["Exercise or take a walk", "Clean or organize a space", "Watch something absorbing", "Cook or bake", "Play a game"],
  },
  {
    letter: "C",
    name: "Contributing",
    description: "Help someone else. Acts of service take you out of your own head.",
    ideas: ["Text someone who needs to hear from you", "Do one kind thing for a stranger", "Volunteer, even briefly", "Leave a genuine compliment"],
  },
  {
    letter: "C",
    name: "Comparisons",
    description: "Compare this moment to other times you've made it through.",
    ideas: ["Recall a harder thing you survived", "Notice others facing greater difficulty", "Remember your own past resilience"],
  },
  {
    letter: "E",
    name: "Emotions (opposite)",
    description: "Act opposite to what the emotion is urging.",
    ideas: ["Watch something funny when sad", "Listen to energizing music when numb", "Move your body when anxious", "Do something kind when angry"],
  },
  {
    letter: "P",
    name: "Pushing away",
    description: "Mentally put the problem in a box. Leave it there for now.",
    ideas: ["Visualize placing it in a container", "Say: 'I'll deal with this later'", "Build an imaginary wall", "Write it down and close the notebook"],
  },
  {
    letter: "T",
    name: "Thoughts",
    description: "Replace distressing thoughts with neutral or positive ones.",
    ideas: ["Count things in the room", "Describe your environment out loud", "Read something engaging", "Do a mental puzzle or trivia"],
  },
  {
    letter: "S",
    name: "Sensations",
    description: "Use intense sensations to shift your body's focus.",
    ideas: ["Hold an ice cube", "Splash cold water on your face", "Eat something spicy or sour", "Listen to very loud music for one minute"],
  },
];

const DIARY_EMOTIONS = [
  { id: "misery", label: "Misery / Sadness" },
  { id: "shame", label: "Shame / Guilt" },
  { id: "anger", label: "Anger / Irritability" },
  { id: "fear", label: "Fear / Anxiety" },
  { id: "happiness", label: "Happiness" },
];

export default function DBTTools({ patient }: Props) {
  const [tab, setTab] = useState<"tipp" | "accepts" | "diary">("tipp");
  const [tippTab, setTippTab] = useState<"T" | "I" | "P1" | "P2">("T");
  const [acceptsIndex, setAcceptsIndex] = useState(0);
  const [jumpingJacksRunning, setJumpingJacksRunning] = useState(false);
  const [jumpingJacksCount, setJumpingJacksCount] = useState(20);
  const [breathScale, setBreathScale] = useState(1.0);
  const [breathPhase, setBreathPhase] = useState<"idle" | "inhale" | "exhale">("idle");
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathTransitionMs, setBreathTransitionMs] = useState(0);
  const [diaryEmotions, setDiaryEmotions] = useState<Record<string, number>>({});
  const [diarySkills, setDiarySkills] = useState<string[]>([]);
  const [diarySaved, setDiarySaved] = useState(false);

  const jjRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const breathRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const breathStartRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Jumping jacks timer
  useEffect(() => {
    if (!jumpingJacksRunning) {
      clearInterval(jjRef.current);
      return;
    }
    setJumpingJacksCount(20);
    jjRef.current = setInterval(() => {
      setJumpingJacksCount((c) => {
        if (c <= 1) {
          clearInterval(jjRef.current);
          setJumpingJacksRunning(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(jjRef.current);
  }, [jumpingJacksRunning]);

  // Paced breathing
  useEffect(() => {
    if (!breathRunning) {
      clearTimeout(breathRef.current);
      clearTimeout(breathStartRef.current);
      setBreathPhase("idle");
      setBreathScale(1.0);
      setBreathTransitionMs(0);
      return;
    }
    setBreathScale(1.0);
    setBreathTransitionMs(0);

    function runPhase(p: "inhale" | "exhale") {
      setBreathPhase(p);
      setBreathTransitionMs(p === "inhale" ? 5000 : 7000);
      setBreathScale(p === "inhale" ? 1.4 : 1.0);
      breathRef.current = setTimeout(() => runPhase(p === "inhale" ? "exhale" : "inhale"), p === "inhale" ? 5100 : 7100);
    }

    breathStartRef.current = setTimeout(() => runPhase("inhale"), 80);
    return () => { clearTimeout(breathRef.current); clearTimeout(breathStartRef.current); };
  }, [breathRunning]);

  useEffect(() => () => { clearInterval(jjRef.current); clearTimeout(breathRef.current); clearTimeout(breathStartRef.current); }, []);

  const skills = patient.dbtSkillsFocus ?? ["TIPP", "ACCEPTS", "IMPROVE", "Radical Acceptance"];

  const saveDiary = () => {
    setDiarySaved(true);
    setTimeout(() => setDiarySaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {(["tipp", "accepts", "diary"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all" style={{ fontFamily: "var(--font-jost)", backgroundColor: tab === t ? "var(--color-primary)" : "transparent", color: tab === t ? "var(--color-cream)" : "var(--color-muted)" }}>
            {t === "tipp" ? "TIPP" : t === "accepts" ? "ACCEPTS" : "Diary Card"}
          </button>
        ))}
      </div>

      {/* TIPP */}
      {tab === "tipp" && (
        <div className="flex flex-col gap-5">
          <div className="flex gap-1.5">
            {(["T", "I", "P1", "P2"] as const).map((t) => (
              <button key={t} onClick={() => setTippTab(t)} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ fontFamily: "var(--font-jost)", backgroundColor: tippTab === t ? "var(--color-primary-mid)" : "var(--color-surface)", color: tippTab === t ? "var(--color-cream)" : "var(--color-muted)", border: "1px solid var(--color-border)" }}>
                {t === "P1" ? "P" : t === "P2" ? "P" : t}
              </button>
            ))}
          </div>

          {tippTab === "T" && (
            <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Temperature</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}>
                Cold water activates the mammalian dive reflex — your heart rate drops within seconds, pulling you down from emotional flooding.
              </p>
              <ul className="flex flex-col gap-2">
                {["Hold an ice cube in each hand", "Splash cold water on your face", "Submerge your face in a bowl of cold water for 30 seconds", "Drink a glass of ice water quickly"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-sage)" }}>→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tippTab === "I" && (
            <div className="rounded-xl p-6 flex flex-col items-center gap-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-2xl self-start" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Intense Exercise</p>
              <p className="text-sm self-start leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                20 jumping jacks burns off adrenaline and shifts your body's state. It doesn't need to be pretty.
              </p>
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 100, height: 100, backgroundColor: "rgba(28,61,46,0.06)", border: "2px solid var(--color-primary)" }}
              >
                <p className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {jumpingJacksRunning ? jumpingJacksCount : "20"}
                </p>
              </div>
              <button
                onClick={() => { setJumpingJacksRunning((r) => !r); setJumpingJacksCount(20); }}
                className="px-8 py-2.5 rounded-full text-sm font-medium"
                style={{ fontFamily: "var(--font-jost)", backgroundColor: jumpingJacksRunning ? "transparent" : "var(--color-primary)", color: jumpingJacksRunning ? "var(--color-primary)" : "var(--color-cream)", border: "2px solid var(--color-primary)" }}
              >
                {jumpingJacksRunning ? "Stop" : "Start"}
              </button>
            </div>
          )}

          {tippTab === "P1" && (
            <div className="rounded-xl p-6 flex flex-col items-center gap-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-2xl self-start" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Paced Breathing</p>
              <p className="text-sm self-start" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                Inhale 5 seconds · Exhale 7 seconds. The longer exhale activates the parasympathetic nervous system.
              </p>
              <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                <div className="absolute rounded-full" style={{ width: 180, height: 180, border: "1px solid rgba(168,196,181,0.3)" }} />
                <div className="rounded-full" style={{ width: 120, height: 120, backgroundColor: "rgba(168,196,181,0.18)", border: "2px solid rgba(74,139,108,0.5)", transform: `scale(${breathScale})`, transition: breathTransitionMs > 0 ? `transform ${breathTransitionMs}ms ease-in-out` : "none" }} />
                <p className="absolute text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {breathPhase === "idle" ? "Ready" : breathPhase === "inhale" ? "Inhale" : "Exhale"}
                </p>
              </div>
              <button
                onClick={() => setBreathRunning((r) => !r)}
                className="px-8 py-2.5 rounded-full text-sm font-medium"
                style={{ fontFamily: "var(--font-jost)", backgroundColor: breathRunning ? "transparent" : "var(--color-primary)", color: breathRunning ? "var(--color-primary)" : "var(--color-cream)", border: "2px solid var(--color-primary)" }}
              >
                {breathRunning ? "Stop" : "Begin"}
              </button>
            </div>
          )}

          {tippTab === "P2" && (
            <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Paired Muscle Relaxation</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}>
                Tense a muscle group as you inhale, release completely as you exhale. The contrast teaches your body what relaxation feels like.
              </p>
              <ul className="flex flex-col gap-3">
                {["Hands: make tight fists on inhale, release on exhale", "Shoulders: raise toward ears on inhale, drop on exhale", "Face: scrunch everything on inhale, soften on exhale", "Full body: tense everything on inhale, release all at once"].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span className="flex-shrink-0 text-xs" style={{ color: "var(--color-quiet)", paddingTop: 1 }}>{i + 1}.</span> {tip}
                  </li>
                ))}
              </ul>
              <p className="text-xs italic" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                For the full guided version, visit Ground Me Now → Muscle Relaxation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACCEPTS */}
      {tab === "accepts" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              {acceptsIndex + 1} of {ACCEPTS_SKILLS.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setAcceptsIndex((i) => Math.max(0, i - 1))} disabled={acceptsIndex === 0} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)", opacity: acceptsIndex === 0 ? 0.4 : 1 }}>←</button>
              <button onClick={() => setAcceptsIndex((i) => Math.min(ACCEPTS_SKILLS.length - 1, i + 1))} disabled={acceptsIndex === ACCEPTS_SKILLS.length - 1} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)", opacity: acceptsIndex === ACCEPTS_SKILLS.length - 1 ? 0.4 : 1 }}>→</button>
            </div>
          </div>
          {(() => {
            const skill = ACCEPTS_SKILLS[acceptsIndex];
            return (
              <div className="rounded-xl p-7 flex flex-col gap-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: "rgba(28,61,46,0.06)", border: "2px solid rgba(28,61,46,0.15)" }}>
                    <p className="text-2xl font-light" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>{skill.letter}</p>
                  </div>
                  <div>
                    <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>{skill.name}</p>
                    <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>{skill.description}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {skill.ideas.map((idea) => (
                    <li key={idea} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                      <span style={{ color: "var(--color-sage)" }}>→</span> {idea}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
          {/* Letter navigation dots */}
          <div className="flex gap-2 justify-center">
            {ACCEPTS_SKILLS.map((s, i) => (
              <button key={i} onClick={() => setAcceptsIndex(i)} className="text-xs font-medium rounded-full" style={{ width: 28, height: 28, backgroundColor: i === acceptsIndex ? "var(--color-primary)" : "transparent", color: i === acceptsIndex ? "var(--color-cream)" : "var(--color-quiet)", border: "1px solid var(--color-border)", fontFamily: "var(--font-jost)" }}>
                {s.letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Diary card */}
      {tab === "diary" && (
        <div className="flex flex-col gap-6">
          <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>Rate each emotion from 0 (not present) to 5 (extreme).</p>
          <div className="flex flex-col gap-4">
            {DIARY_EMOTIONS.map((em) => (
              <div key={em.id} className="flex items-center gap-4">
                <p className="text-sm w-36 flex-shrink-0" style={{ fontFamily: "var(--font-jost)", color: "var(--color-text)" }}>{em.label}</p>
                <div className="flex gap-1.5 flex-1">
                  {[0, 1, 2, 3, 4, 5].map((n) => {
                    const val = diaryEmotions[em.id] ?? -1;
                    const filled = val >= n;
                    return (
                      <button
                        key={n}
                        onClick={() => setDiaryEmotions((prev) => ({ ...prev, [em.id]: n }))}
                        className="flex-1 rounded py-1.5 text-xs font-medium transition-all"
                        style={{
                          fontFamily: "var(--font-jost)",
                          backgroundColor: filled ? "var(--color-primary)" : "var(--color-surface)",
                          color: filled ? "var(--color-cream)" : "var(--color-quiet)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Skills used today</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const used = diarySkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => setDiarySkills((prev) => used ? prev.filter((s) => s !== skill) : [...prev, skill])}
                    className="px-4 py-2 rounded-full text-sm transition-all"
                    style={{
                      fontFamily: "var(--font-jost)",
                      backgroundColor: used ? "var(--color-primary)" : "transparent",
                      color: used ? "var(--color-cream)" : "var(--color-muted)",
                      border: `1px solid ${used ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {used ? "✓ " : ""}{skill}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={saveDiary}
            className="self-start px-8 py-2.5 rounded-full text-sm font-medium"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: diarySaved ? "rgba(74,139,108,0.1)" : "var(--color-primary)",
              color: diarySaved ? "var(--color-primary-light)" : "var(--color-cream)",
              border: diarySaved ? "1px solid var(--color-primary-light)" : "none",
            }}
          >
            {diarySaved ? "✓ Diary saved" : "Save diary card"}
          </button>
        </div>
      )}
    </div>
  );
}
