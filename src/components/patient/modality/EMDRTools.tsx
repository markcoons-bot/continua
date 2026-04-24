"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";

interface Props {
  patient: Patient;
}

type WoTZone = "hypo" | "window" | "hyper" | null;

interface SUDSLog {
  before: number;
  after: number | null;
  time: string;
}

const EMDR_PHASES = [
  { num: 1, label: "History-taking & Treatment Planning" },
  { num: 2, label: "Preparation & Resource Installation" },
  { num: 3, label: "Assessment" },
  { num: 4, label: "Desensitization" },
  { num: 5, label: "Installation" },
  { num: 6, label: "Body Scan" },
  { num: 7, label: "Closure" },
  { num: 8, label: "Reevaluation" },
];

function sudsColor(v: number): string {
  if (v <= 3) return "#4A8B6C";
  if (v <= 6) return "#C8922E";
  return "#dc2626";
}

function parseCurrentPhases(phaseStr: string): number[] {
  const matches = phaseStr.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

export default function EMDRTools({ patient }: Props) {
  const [tab, setTab] = useState<"suds" | "wot" | "phases">("suds");
  const [beforeSUDS, setBeforeSUDS] = useState(patient.sudsBaseline ?? 5);
  const [afterSUDS, setAfterSUDS] = useState(5);
  const [pendingLog, setPendingLog] = useState<{ before: number } | null>(null);
  const [logs, setLogs] = useState<SUDSLog[]>([]);
  const [wotZone, setWotZone] = useState<WoTZone>(null);

  const activePhases = parseCurrentPhases(patient.phase ?? "");

  const logBefore = () => {
    setPendingLog({ before: beforeSUDS });
  };

  const logAfter = () => {
    if (!pendingLog) return;
    const newLog: SUDSLog = {
      before: pendingLog.before,
      after: afterSUDS,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 5));
    setPendingLog(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {(["suds", "wot", "phases"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: tab === t ? "var(--color-primary)" : "transparent",
              color: tab === t ? "var(--color-cream)" : "var(--color-muted)",
            }}
          >
            {t === "suds" ? "SUDS Tracker" : t === "wot" ? "Window of Tolerance" : "Phase Map"}
          </button>
        ))}
      </div>

      {/* SUDS Tracker */}
      {tab === "suds" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Before using a resource
              </p>
              <div className="flex items-end gap-4">
                <p className="text-5xl leading-none" style={{ fontFamily: "var(--font-cormorant)", color: sudsColor(beforeSUDS), transition: "color 300ms ease" }}>
                  {beforeSUDS}
                </p>
                <p className="text-xs mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  {beforeSUDS === 0 ? "No distress" : beforeSUDS <= 3 ? "Mild" : beforeSUDS <= 6 ? "Moderate" : beforeSUDS <= 8 ? "High" : "Highest imaginable"}
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={beforeSUDS}
                onChange={(e) => setBeforeSUDS(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: sudsColor(beforeSUDS), transition: "accent-color 300ms ease" }}
              />
              <div className="flex justify-between">
                {[0, 2, 4, 6, 8, 10].map((n) => (
                  <span key={n} className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>{n}</span>
                ))}
              </div>
              <button
                onClick={logBefore}
                className="py-2 rounded-lg text-sm font-medium"
                style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
              >
                Log before
              </button>
            </div>

            {/* After */}
            <div
              className="rounded-xl p-5 flex flex-col gap-4"
              style={{
                backgroundColor: "var(--color-surface)",
                border: `1px solid ${pendingLog ? "rgba(74,139,108,0.4)" : "var(--color-border)"}`,
                opacity: pendingLog ? 1 : 0.5,
              }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                After using a resource
              </p>
              <div className="flex items-end gap-4">
                <p className="text-5xl leading-none" style={{ fontFamily: "var(--font-cormorant)", color: sudsColor(afterSUDS), transition: "color 300ms ease" }}>
                  {afterSUDS}
                </p>
                {pendingLog && afterSUDS < pendingLog.before && (
                  <p className="text-xs mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                    ↓ {pendingLog.before - afterSUDS} points
                  </p>
                )}
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={afterSUDS}
                disabled={!pendingLog}
                onChange={(e) => setAfterSUDS(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: sudsColor(afterSUDS), transition: "accent-color 300ms ease" }}
              />
              <div className="flex justify-between">
                {[0, 2, 4, 6, 8, 10].map((n) => (
                  <span key={n} className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>{n}</span>
                ))}
              </div>
              <button
                onClick={logAfter}
                disabled={!pendingLog}
                className="py-2 rounded-lg text-sm font-medium"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor: pendingLog ? "var(--color-primary-light)" : "var(--color-border)",
                  color: pendingLog ? "var(--color-cream)" : "var(--color-quiet)",
                  cursor: pendingLog ? "pointer" : "not-allowed",
                }}
              >
                Log after
              </button>
            </div>
          </div>

          {/* Mini chart */}
          {logs.length > 0 && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Recent logs
              </p>
              <div className="flex items-end gap-4">
                {logs.map((log, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-end gap-0.5 w-full" style={{ height: 60 }}>
                      <div
                        className="flex-1 rounded-t"
                        style={{
                          height: `${(log.before / 10) * 100}%`,
                          backgroundColor: "rgba(200,146,46,0.5)",
                        }}
                      />
                      {log.after !== null && (
                        <div
                          className="flex-1 rounded-t"
                          style={{
                            height: `${(log.after / 10) * 100}%`,
                            backgroundColor: "rgba(74,139,108,0.5)",
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                      {log.time}
                    </p>
                  </div>
                ))}
                <div className="flex flex-col gap-1 ml-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(200,146,46,0.5)" }} />
                    <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>Before</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(74,139,108,0.5)" }} />
                    <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>After</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Window of Tolerance */}
      {tab === "wot" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            Tap the zone that best describes where you are right now.
          </p>

          {/* Hyper-arousal */}
          <button
            onClick={() => setWotZone(wotZone === "hyper" ? null : "hyper")}
            className="w-full rounded-xl p-5 text-left transition-all"
            style={{
              backgroundColor: wotZone === "hyper" ? "rgba(200,146,46,0.1)" : "rgba(200,146,46,0.04)",
              border: `2px solid ${wotZone === "hyper" ? "rgba(200,146,46,0.5)" : "rgba(200,146,46,0.15)"}`,
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}>
              ↑ Hyper-arousal
            </p>
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              Anxious · Racing thoughts · Overwhelmed · Reactive · Panicked
            </p>
          </button>

          {/* Window */}
          <button
            onClick={() => setWotZone(wotZone === "window" ? null : "window")}
            className="w-full rounded-xl p-5 text-left transition-all"
            style={{
              backgroundColor: wotZone === "window" ? "rgba(74,139,108,0.1)" : "rgba(74,139,108,0.04)",
              border: `2px solid ${wotZone === "window" ? "rgba(74,139,108,0.5)" : "rgba(74,139,108,0.15)"}`,
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
              ◉ Window of Tolerance
            </p>
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              Present · Grounded · Connected · Curious · Calm
            </p>
          </button>

          {/* Hypo-arousal */}
          <button
            onClick={() => setWotZone(wotZone === "hypo" ? null : "hypo")}
            className="w-full rounded-xl p-5 text-left transition-all"
            style={{
              backgroundColor: wotZone === "hypo" ? "rgba(138,138,132,0.1)" : "rgba(138,138,132,0.04)",
              border: `2px solid ${wotZone === "hypo" ? "rgba(138,138,132,0.4)" : "rgba(138,138,132,0.15)"}`,
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              ↓ Hypo-arousal
            </p>
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              Numb · Dissociated · Empty · Shut down · Exhausted
            </p>
          </button>

          {/* Response */}
          {wotZone === "window" && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(74,139,108,0.06)", border: "1px solid rgba(74,139,108,0.2)" }}>
              <p className="text-base italic leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary-mid)" }}>
                You're in your window right now. This is where growth, connection, and processing happen. Stay here.
              </p>
            </div>
          )}
          {wotZone === "hyper" && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(200,146,46,0.06)", border: "1px solid rgba(200,146,46,0.2)" }}>
              <p className="text-sm mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                Your system is activated — it's trying to protect you. This is normal. Try:
              </p>
              <ul className="flex flex-col gap-1.5">
                {["Box Breathing (4-4-6)", "Bilateral Stimulation — follow the dot", "Cold water on your face or wrists"].map((s) => (
                  <li key={s} className="text-sm flex items-start gap-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-accent)" }}>→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {wotZone === "hypo" && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(138,138,132,0.06)", border: "1px solid rgba(138,138,132,0.2)" }}>
              <p className="text-sm mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                You may be in a shutdown response. Gentle activation can help:
              </p>
              <ul className="flex flex-col gap-1.5">
                {["Physiological Sigh — two inhales, one long exhale", "Slow movement — stand up, roll your shoulders", "5-4-3-2-1 Grounding to re-engage your senses"].map((s) => (
                  <li key={s} className="text-sm flex items-start gap-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-quiet)" }}>→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Phase map */}
      {tab === "phases" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
            EMDR therapy follows 8 structured phases. Your current work is highlighted below.
          </p>
          {EMDR_PHASES.map((phase) => {
            const isActive = activePhases.includes(phase.num);
            return (
              <div
                key={phase.num}
                className="rounded-xl p-4 flex items-center gap-4"
                style={{
                  backgroundColor: isActive ? "rgba(28,61,46,0.06)" : "var(--color-surface)",
                  border: `1px solid ${isActive ? "rgba(28,61,46,0.3)" : "var(--color-border)"}`,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                    color: isActive ? "var(--color-cream)" : "var(--color-quiet)",
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {phase.num}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: isActive ? "var(--color-primary)" : "var(--color-muted)",
                    }}
                  >
                    {phase.label}
                  </p>
                  {isActive && (
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                      Current phase
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
