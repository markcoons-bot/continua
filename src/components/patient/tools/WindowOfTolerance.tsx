"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Patient } from "@/data/patients";

interface Props {
  onClose: () => void;
  patient: Patient;
  onOpenTool: (toolId: string) => void;
}

type Zone = "hyper" | "window" | "hypo";

interface CheckIn {
  zone: Zone;
  time: string;
}

// ─── Zone definitions ─────────────────────────────────────────────────────────

const ZONES = {
  hyper: {
    label:    "Hyper-Arousal",
    subtitle: "Survival mode — too much activation",
    arrow:    "↑",
    arrowLabel: "Too activated",
    pills: ["anxiety", "panic", "hypervigilance", "rage", "overwhelm", "racing thoughts", "intrusive images", "physical tension", "feeling out of control"],
    bg:      "rgba(200,146,46,0.1)",
    bgSel:   "rgba(200,146,46,0.18)",
    border:  "rgba(200,146,46,0.3)",
    pillColor: "#C8922E",
    pillBg:    "rgba(200,146,46,0.1)",
    pillBorder:"rgba(200,146,46,0.25)",
    indicatorBg: "rgba(200,146,46,0.88)",
  },
  window: {
    label:    "Window of Tolerance",
    subtitle: "Present, engaged, able to process",
    arrow:    null,
    arrowLabel: null,
    pills: ["present", "grounded", "able to think clearly", "connected", "regulated", "responsive", "curious", "open"],
    bg:      "rgba(74,139,108,0.09)",
    bgSel:   "rgba(74,139,108,0.16)",
    border:  "rgba(74,139,108,0.35)",
    pillColor: "#4A8B6C",
    pillBg:    "rgba(74,139,108,0.12)",
    pillBorder:"rgba(74,139,108,0.28)",
    indicatorBg: "rgba(74,139,108,0.88)",
  },
  hypo: {
    label:    "Hypo-Arousal",
    subtitle: "Shut-down mode — too little activation",
    arrow:    "↓",
    arrowLabel: "Too shut down",
    pills: ["numbness", "disconnection", "dissociation", "emptiness", "fatigue", "fogginess", "collapsed", "withdrawn", "flat"],
    bg:      "rgba(100,120,148,0.09)",
    bgSel:   "rgba(100,120,148,0.16)",
    border:  "rgba(100,120,148,0.3)",
    pillColor: "#6478a0",
    pillBg:    "rgba(100,120,148,0.1)",
    pillBorder:"rgba(100,120,148,0.22)",
    indicatorBg: "rgba(100,120,148,0.82)",
  },
};

const ZONE_ORDER: Zone[] = ["hyper", "window", "hypo"];

// ─── Response panel data ──────────────────────────────────────────────────────

interface ToolRec { id: string; label: string; desc: string; emdrOnly?: boolean; }

const TOOL_RECS: Record<Zone, ToolRec[]> = {
  hyper: [
    { id: "physiological-sigh", label: "Physiological Sigh",         desc: "Fastest way to shift the nervous system down" },
    { id: "box-breathing",      label: "Box Breathing",               desc: "Activates the parasympathetic system" },
    { id: "bilateral",          label: "Bilateral Stimulation",       desc: "Dual-attention to reduce activation",       emdrOnly: true },
    { id: "havening",           label: "Havening Touch",              desc: "Somatic technique to interrupt the amygdala response" },
    { id: "containment",        label: "Container Visualization",     desc: "If intrusive material is present",          emdrOnly: true },
  ],
  window: [],
  hypo: [
    { id: "physiological-sigh", label: "Physiological Sigh",         desc: "Physical activation to bring you back online" },
    { id: "pmr",                label: "Progressive Muscle Relaxation", desc: "Wake the body up from the outside in" },
    { id: "five-senses",        label: "5-4-3-2-1 Grounding",        desc: "Sensory input to re-engage the present moment" },
    { id: "body-scan",          label: "Body Scan",                   desc: "Find where you are in your body right now" },
  ],
};

// ─── Zone entry animation ─────────────────────────────────────────────────────

const zoneVariants = {
  hidden: { opacity: 0, y: 6 },
  show:   (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const, delay: i * 0.12 } }),
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function WindowOfTolerance({ onClose, patient, onOpenTool }: Props) {
  const [selectedZone,  setSelectedZone]  = useState<Zone | null>(null);
  const [history,       setHistory]       = useState<CheckIn[]>([]);
  const [educationOpen, setEducationOpen] = useState(false);
  const [windowNote,    setWindowNote]    = useState("");

  const isEMDR = patient.modality === "emdr";

  function handleZoneClick(zone: Zone) {
    const isDeselect = zone === selectedZone;
    setSelectedZone(isDeselect ? null : zone);
    if (!isDeselect) {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setHistory(prev => [...prev, { zone, time }].slice(-5));
    }
  }

  const lastTwo = history.length >= 2 ? [history[history.length - 2], history[history.length - 1]] : null;

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-8">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <button onClick={onClose} className="text-sm mt-1 flex-shrink-0" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          ← Back
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              Window of Tolerance
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full border flex-shrink-0"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-mid)", borderColor: "rgba(45,94,70,0.3)", backgroundColor: "rgba(45,94,70,0.06)" }}>
              Nervous System Tool
            </span>
          </div>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Where are you right now? Tap the zone that feels most like your current state.
          </p>
        </div>
      </div>

      {/* ── Three-zone diagram ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>

        {ZONE_ORDER.map((zoneId, i) => {
          const z   = ZONES[zoneId];
          const sel = selectedZone === zoneId;

          return (
            <motion.div
              key={zoneId}
              custom={i}
              variants={zoneVariants}
              initial="hidden"
              animate="show"
            >
              {/* Divider lines between zones */}
              {zoneId === "window" && (
                <div className="relative" style={{ height: 1 }}>
                  <div style={{ position: "absolute", inset: 0, borderTop: `2px dashed ${ZONES.hyper.border}` }} />
                  <span
                    className="absolute text-xs px-1.5"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: ZONES.hyper.pillColor,
                      backgroundColor: sel ? ZONES.window.bgSel : ZONES.window.bg,
                      top: -8,
                      right: 16,
                      fontSize: "0.65rem",
                      letterSpacing: "0.05em",
                    }}
                  >Upper limit</span>
                </div>
              )}
              {zoneId === "hypo" && (
                <div className="relative" style={{ height: 1 }}>
                  <div style={{ position: "absolute", inset: 0, borderTop: `2px dashed ${ZONES.hypo.border}` }} />
                  <span
                    className="absolute text-xs px-1.5"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: ZONES.hypo.pillColor,
                      backgroundColor: sel ? ZONES.hypo.bgSel : ZONES.window.bg,
                      top: -8,
                      right: 16,
                      fontSize: "0.65rem",
                      letterSpacing: "0.05em",
                    }}
                  >Lower limit</span>
                </div>
              )}

              <button
                onClick={() => handleZoneClick(zoneId)}
                className="w-full text-left relative"
                style={{
                  backgroundColor: sel ? z.bgSel : z.bg,
                  transition: "background-color 250ms ease",
                  minHeight: zoneId === "window" ? 160 : 130,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Label row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={zoneId === "window" ? "text-2xl" : "text-lg"}
                      style={{ fontFamily: "var(--font-cormorant)", color: z.pillColor, lineHeight: 1.2 }}
                    >
                      {z.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: z.pillColor, opacity: 0.75 }}>
                      {z.subtitle}
                    </p>
                  </div>
                  {z.arrow && (
                    <div className="flex flex-col items-end flex-shrink-0 gap-0.5 mt-0.5">
                      <span className="text-lg leading-none" style={{ color: z.pillColor }}>{z.arrow}</span>
                      <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: z.pillColor, opacity: 0.65, fontSize: "0.6rem", letterSpacing: "0.04em" }}>
                        {z.arrowLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Symptom pills */}
                <div className="flex flex-wrap gap-1.5">
                  {z.pills.map(pill => (
                    <span
                      key={pill}
                      className="text-xs px-2.5 py-0.5 rounded-full"
                      style={{
                        fontFamily: "var(--font-jost)",
                        color:           z.pillColor,
                        backgroundColor: z.pillBg,
                        border:          `1px solid ${z.pillBorder}`,
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* "You are here" indicator */}
                <AnimatePresence>
                  {sel && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{   scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 20,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: z.indicatorBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "wot-pulse 2s ease-in-out infinite",
                        boxShadow: `0 0 0 4px ${z.pillBg}`,
                      }}
                    >
                      <span className="text-xs font-medium" style={{ fontFamily: "var(--font-jost)", color: "#fff", fontSize: "0.65rem", letterSpacing: "0.02em" }}>
                        {patient.initials}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Window of Tolerance subtle shimmer overlay */}
                {zoneId === "window" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(ellipse at 50% 50%, rgba(74,139,108,0.06) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Response panel ── */}
      <AnimatePresence mode="wait">
        {selectedZone && (
          <motion.div
            key={selectedZone}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {selectedZone === "hyper" && (
              <HyperResponse tools={TOOL_RECS.hyper} isEMDR={isEMDR} onOpenTool={onOpenTool} />
            )}
            {selectedZone === "window" && (
              <WindowResponse note={windowNote} setNote={setWindowNote} />
            )}
            {selectedZone === "hypo" && (
              <HypoResponse tools={TOOL_RECS.hypo} onOpenTool={onOpenTool} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── History tracker ── */}
      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Your check-ins today
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: 10, height: 10,
                    backgroundColor:
                      h.zone === "hyper"  ? ZONES.hyper.indicatorBg :
                      h.zone === "window" ? ZONES.window.indicatorBg : ZONES.hypo.indicatorBg,
                  }}
                />
                <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>{h.time}</span>
              </div>
            ))}
          </div>

          {/* Movement affirmation */}
          {lastTwo && lastTwo[0].zone !== lastTwo[1].zone && (
            <p className="text-sm italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)", fontSize: "0.95rem" }}>
              {lastTwo[1].zone === "window"
                ? `You moved from ${ZONES[lastTwo[0].zone].label} toward your window. That shift matters.`
                : lastTwo[0].zone === "hyper" && lastTwo[1].zone === "hypo"
                ? "You moved from activation toward stillness. Notice what your body needed."
                : `You moved from ${ZONES[lastTwo[0].zone].label} to ${ZONES[lastTwo[1].zone].label}.`}
            </p>
          )}
        </div>
      )}

      {/* ── Educational section ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-left"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", backgroundColor: "var(--color-surface)" }}
          onClick={() => setEducationOpen(v => !v)}
        >
          <span>About the Window of Tolerance</span>
          <span
            style={{
              color: "var(--color-quiet)",
              display: "inline-block",
              transform: educationOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          >↓</span>
        </button>
        {educationOpen && (
          <div className="px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.85 }}>
              The Window of Tolerance is the zone of arousal where your nervous system can take in and process experience. When you&apos;re inside the window, you can feel emotions without being overwhelmed by them, think clearly, and do the work of healing.
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.85 }}>
              What pushes you outside it? Triggers, accumulated stress, trauma responses, not enough sleep, or too much happening at once. Both directions — too activated and too shut down — are the nervous system doing its job of protecting you. The problem is they block processing.
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.85 }}>
              What widens the window? The work you&apos;re doing in therapy. Practicing the skills between sessions. Resource building. Body awareness. Over time, the window grows — meaning you can tolerate more emotional experience without leaving it.
            </p>
            <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", lineHeight: 1.75 }}>
              Concept developed by Dr. Dan Siegel, MD. Expanded for trauma treatment by Pat Ogden and others. Your therapist uses this model in your treatment.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Response sub-components ──────────────────────────────────────────────────

function ToolCard({ tool, onOpenTool }: { tool: ToolRec; onOpenTool: (id: string) => void }) {
  return (
    <button
      onClick={() => onOpenTool(tool.id)}
      className="text-left rounded-lg px-4 py-3 flex items-start gap-3 transition-all w-full"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary-light)" }}>→</span>
      <div>
        <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>{tool.label}</p>
        <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>{tool.desc}</p>
      </div>
    </button>
  );
}

function HyperResponse({ tools, isEMDR, onOpenTool }: { tools: ToolRec[]; isEMDR: boolean; onOpenTool: (id: string) => void }) {
  const visible = tools.filter(t => !t.emdrOnly || isEMDR);
  return (
    <div className="rounded-xl p-5 flex flex-col gap-4" style={{ backgroundColor: "rgba(200,146,46,0.06)", border: "1px solid rgba(200,146,46,0.2)" }}>
      <div>
        <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "#C8922E" }}>
          Your nervous system is activated
        </p>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          When we&apos;re above the window, the thinking brain goes offline. This isn&apos;t weakness — it&apos;s biology. Your nervous system is trying to protect you.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {visible.map(t => <ToolCard key={t.id} tool={t} onOpenTool={onOpenTool} />)}
      </div>
      <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", lineHeight: 1.75 }}>
        If you&apos;re feeling unsafe or unable to cope, please contact Dr. Harrison directly or text 988.
      </p>
    </div>
  );
}

function WindowResponse({ note, setNote }: { note: string; setNote: (v: string) => void }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-4" style={{ backgroundColor: "rgba(74,139,108,0.07)", border: "1px solid rgba(74,139,108,0.25)" }}>
      <div>
        <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "#2D5E46" }}>
          You&apos;re in your window — this is the work
        </p>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          When you&apos;re here, your brain can integrate, process, and grow. This is exactly where therapy happens. Notice what brought you here today.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          What helped you get to this place?
        </p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write freely — even a word or two…"
          className="w-full resize-none outline-none rounded-lg text-sm"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1rem",
            lineHeight: 1.8,
            padding: "12px 14px",
            minHeight: 80,
            backgroundColor: "var(--color-card)",
            border: "1px solid rgba(74,139,108,0.25)",
            color: "var(--color-text)",
          }}
        />
      </div>
      <p className="text-xs italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)", fontSize: "0.95rem" }}>
        Your window has been widening. Dr. Harrison will want to hear about this.
      </p>
    </div>
  );
}

function HypoResponse({ tools, onOpenTool }: { tools: ToolRec[]; onOpenTool: (id: string) => void }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-4" style={{ backgroundColor: "rgba(100,120,148,0.07)", border: "1px solid rgba(100,120,148,0.22)" }}>
      <div>
        <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "#6478a0" }}>
          Your nervous system has shut down
        </p>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          Hypo-arousal is the freeze response — the body conserving energy after overwhelm. It can feel like emptiness, fog, or going through the motions. It&apos;s protective, but it keeps you from processing.
        </p>
      </div>
      <div
        className="rounded-lg px-4 py-3 flex items-start gap-3"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: "#6478a0" }}>→</span>
        <div>
          <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>Physical movement</p>
          <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
            Stand up. Shake your hands. Jump 10 times. Movement is the fastest way out of hypo-arousal.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {tools.map(t => <ToolCard key={t.id} tool={t} onOpenTool={onOpenTool} />)}
      </div>
    </div>
  );
}
