"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { patients, Patient } from "@/data/patients";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date();
const DATE_LABEL = TODAY.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const CPT_MONTHLY = 98980; // 20-min review code
const CPT_ADDITIONAL = 98981; // each additional 20 min
const RATE_INITIAL = 50; // reimbursement estimate per code
const RATE_ADD = 40;

// Simulated activity data per patient
const ACTIVITY: Record<string, { label: string; daysAgo: number }> = {
  sarah: { label: "Journal", daysAgo: 1 },
  james: { label: "Thought Record", daysAgo: 2 },
  elena: { label: "Diary Card", daysAgo: 1 },
  michael: { label: "Memory Keeper", daysAgo: 3 },
  aisha: { label: "Safe Place", daysAgo: 2 },
  tyler: { label: "Courage Ladder", daysAgo: 4 },
};

function activityDot(daysAgo: number) {
  if (daysAgo <= 2) return "var(--color-primary-light)";
  if (daysAgo <= 3) return "var(--color-accent)";
  return "var(--color-quiet)";
}

// RTM log state per patient (minutes reviewed this month)
const INITIAL_LOGS: Record<string, number> = {
  sarah: 34,
  james: 22,
  elena: 28,
  michael: 18,
  aisha: 24,
  tyler: 14,
};

function rtmEstimate(minutesMap: Record<string, number>) {
  return Object.values(minutesMap).reduce((sum, mins) => {
    if (mins < 20) return sum;
    const units = Math.floor(mins / 20);
    return sum + RATE_INITIAL + Math.max(0, units - 1) * RATE_ADD;
  }, 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sparkline({ values }: { values: number[] }) {
  const max = 10;
  const h = 28;
  return (
    <div className="flex items-end gap-0.5" style={{ height: h }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: Math.max(2, (v / max) * h),
            backgroundColor:
              v >= 7 ? "var(--color-primary-light)"
              : v >= 4 ? "var(--color-sage)"
              : "var(--color-border)",
            opacity: 0.75 + (v / max) * 0.25,
          }}
        />
      ))}
    </div>
  );
}

function RTMBar({ minutes }: { minutes: number }) {
  const pct = Math.min(100, (minutes / 20) * 100);
  const met = minutes >= 20;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, backgroundColor: "var(--color-border)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: met ? "var(--color-primary-light)" : "var(--color-accent)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        className="text-xs tabular-nums w-8 text-right flex-shrink-0"
        style={{ fontFamily: "var(--font-jost)", color: met ? "var(--color-primary-light)" : "var(--color-muted)" }}
      >
        {minutes}m
      </span>
    </div>
  );
}

// ─── Send Prompt Modal ────────────────────────────────────────────────────────

function SendPromptModal({
  patient,
  onClose,
}: {
  patient: Patient;
  onClose: () => void;
}) {
  const [text, setText] = useState(patient.therapistNote.slice(0, 160) + "…");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "var(--color-card)", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
      >
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 56, height: 56, backgroundColor: "rgba(74,139,108,0.1)", border: "2px solid rgba(74,139,108,0.3)" }}
            >
              <span style={{ fontSize: 24, color: "var(--color-primary-light)" }}>✓</span>
            </div>
            <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              Prompt sent to {patient.name.split(" ")[0]}
            </p>
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              They'll see it the next time they open their portal.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Send prompt to {patient.name}
              </p>
              <button onClick={onClose} className="text-xl leading-none" style={{ color: "var(--color-quiet)" }}>×</button>
            </div>
            <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              This will appear in {patient.name.split(" ")[0]}'s Journal as "From Dr. Harrison."
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full resize-none outline-none rounded-xl"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                padding: "20px 24px",
                minHeight: 160,
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                {text.length} characters
              </span>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full text-sm"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="px-6 py-2 rounded-full text-sm font-medium"
                  style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
                >
                  Send prompt
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({
  minutesMap,
  onClose,
}: {
  minutesMap: Record<string, number>;
  onClose: () => void;
}) {
  const monthYear = TODAY.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const eligible = patients.filter((p) => minutesMap[p.id] >= 20);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "var(--color-card)", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", maxHeight: "85vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
            RTM Billing Summary
          </p>
          <button onClick={onClose} className="text-xl" style={{ color: "var(--color-quiet)" }}>×</button>
        </div>
        <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          Dr. Harrison · {monthYear}
        </p>

        <div
          className="rounded-xl p-5 font-mono text-xs flex flex-col gap-3"
          style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", lineHeight: 1.7, color: "var(--color-muted)" }}
        >
          <p>CONTINUA RTM BILLING EXPORT</p>
          <p>Provider: Dr. Harrison · NPI: [DEMO]</p>
          <p>Period: {monthYear}</p>
          <p>─────────────────────────────────</p>
          {eligible.map((p) => {
            const mins = minutesMap[p.id];
            const units = Math.floor(mins / 20);
            const rev = RATE_INITIAL + Math.max(0, units - 1) * RATE_ADD;
            return (
              <div key={p.id}>
                <p>{p.name} (DOB: [DEMO])</p>
                <p>  CPT {CPT_MONTHLY} — {mins}min reviewed — ${rev} est.</p>
                {units > 1 && <p>  CPT {CPT_ADDITIONAL} × {units - 1} additional unit(s)</p>}
              </div>
            );
          })}
          <p>─────────────────────────────────</p>
          <p>TOTAL ESTIMATED: ${rtmEstimate(minutesMap)}</p>
          <p>This is an estimate. Actual reimbursement varies by payer.</p>
        </div>

        <button
          onClick={onClose}
          className="self-end px-6 py-2 rounded-full text-sm"
          style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Journal Review Panel ─────────────────────────────────────────────────────

const DEMO_ENTRY = {
  patientName: "Sarah Chen",
  date: "Tuesday",
  text: "I drove to the pharmacy today — not the highway, just surface streets. But I noticed the moment I got near the on-ramp and felt my chest tighten. I didn't get on. I turned around. Is that bad? It didn't feel like defeat, it felt like I knew my limit. The container thing helped though — I just pictured it. The lock clicking. And I breathed.",
  reflection: "There is so much self-awareness in what you've written — noticing the limit, naming the feeling without being swallowed by it, and reaching for the container at exactly the right moment. That isn't defeat. That's the work, happening in real life. Bring this to your next session.",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClinicianDashboard() {
  const [promptTarget, setPromptTarget] = useState<Patient | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [rtmLogs, setRtmLogs] = useState<Record<string, number>>(INITIAL_LOGS);
  const [selectedPatient, setSelectedPatient] = useState<string | null>("sarah");
  const [loggedNow, setLoggedNow] = useState(false);

  const totalMinutes = Object.values(rtmLogs).reduce((a, b) => a + b, 0);
  const patientsAtThreshold = patients.filter((p) => rtmLogs[p.id] >= 20).length;
  const estimated = rtmEstimate(rtmLogs);

  const handleLogReview = () => {
    setRtmLogs((prev) => ({ ...prev, sarah: prev.sarah + 8 }));
    setLoggedNow(true);
    setTimeout(() => setLoggedNow(false), 3000);
  };

  const viewed = selectedPatient ? patients.find((p) => p.id === selectedPatient) : null;

  return (
    <div className="min-h-full" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Modals */}
      {promptTarget && <SendPromptModal patient={promptTarget} onClose={() => setPromptTarget(null)} />}
      {showExport && <ExportModal minutesMap={rtmLogs} onClose={() => setShowExport(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
              {DATE_LABEL}
            </p>
            <h1 className="text-4xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              Dr. Harrison's Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
              6 active Continua patients · Est. RTM billing this month:{" "}
              <span style={{ color: "var(--color-primary-mid)", fontWeight: 500 }}>${estimated}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <span
              className="px-3 py-1.5 rounded-full text-xs border"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-accent)",
                borderColor: "rgba(200,146,46,0.3)",
                backgroundColor: "rgba(200,146,46,0.06)",
              }}
            >
              Demo Mode
            </span>
          </div>
        </div>

        {/* ── Main grid: patient cards + RTM sidebar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Patient grid (takes 2/3 width) */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patients.map((patient, index) => {
                const act = ACTIVITY[patient.id];
                const mins = rtmLogs[patient.id];
                const isSelected = selectedPatient === patient.id;
                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.06 }}
                    whileHover={{ y: -2, boxShadow: isSelected ? "0 0 0 2px rgba(28,61,46,0.12), 0 8px 24px rgba(28,61,46,0.12)" : "0 4px 16px rgba(28,61,46,0.09)" }}
                    className="rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
                    style={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid ${isSelected ? "rgba(28,61,46,0.35)" : "var(--color-border)"}`,
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(28,61,46,0.12), 0 4px 16px rgba(28,61,46,0.08)"
                        : "0 1px 3px rgba(28,61,46,0.04)",
                    }}
                    onClick={() => setSelectedPatient(patient.id === selectedPatient ? null : patient.id)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: 40, height: 40,
                            backgroundColor: "rgba(28,61,46,0.08)",
                            fontFamily: "var(--font-jost)",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {patient.initials}
                        </div>
                        <div>
                          <p className="text-base leading-tight" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                            {patient.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                            {patient.badge}
                          </p>
                        </div>
                      </div>
                      {/* Activity dot */}
                      <div
                        className="rounded-full flex-shrink-0 mt-1"
                        style={{ width: 8, height: 8, backgroundColor: activityDot(act.daysAgo) }}
                        title={`Last active ${act.daysAgo}d ago`}
                      />
                    </div>

                    {/* Sparkline */}
                    <div>
                      <p className="text-xs mb-1.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                        7-day mood
                      </p>
                      <Sparkline values={patient.checkIns} />
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                        Last session: {patient.lastSession}
                      </span>
                      <span style={{ fontFamily: "var(--font-jost)", color: activityDot(act.daysAgo) }}>
                        {act.label} · {act.daysAgo}d ago
                      </span>
                    </div>

                    {/* EMDR SUDS */}
                    {patient.modality === "emdr" && patient.sudsBaseline !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                          SUDS baseline:
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: "var(--font-jost)",
                            color: "var(--color-accent)",
                            backgroundColor: "rgba(200,146,46,0.08)",
                          }}
                        >
                          {patient.sudsBaseline}/10
                        </span>
                      </div>
                    )}

                    {/* RTM bar */}
                    <RTMBar minutes={mins} />

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPromptTarget(patient); }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          fontFamily: "var(--font-jost)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-muted)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        Send Prompt
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient.id); }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          fontFamily: "var(--font-jost)",
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-cream)",
                        }}
                      >
                        View Journal
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Journal review panel */}
            <div
              className="rounded-xl p-7 flex flex-col gap-5"
              style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                    Journal Review · {DEMO_ENTRY.patientName}
                  </p>
                  <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                    Entry from {DEMO_ENTRY.date}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-mid)", backgroundColor: "rgba(45,94,70,0.06)", border: "1px solid rgba(45,94,70,0.2)" }}>
                  Unreviewed
                </span>
              </div>

              {/* Patient entry */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  Sarah's entry
                </p>
                <p className="text-base leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85, fontSize: "1.05rem" }}>
                  {DEMO_ENTRY.text}
                </p>
              </div>

              {/* Continua's reflection */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(168,196,181,0.08)", border: "1px solid rgba(168,196,181,0.3)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                  Continua reflected
                </p>
                <p className="italic text-base leading-loose" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-text)", lineHeight: 1.85, fontSize: "1.05rem" }}>
                  {DEMO_ENTRY.reflection}
                </p>
              </div>

              {/* RTM note */}
              <div
                className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ backgroundColor: "rgba(200,146,46,0.04)", border: "1px solid rgba(200,146,46,0.15)" }}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}>
                    RTM Note
                  </p>
                  <p className="text-sm" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                    CPT {CPT_MONTHLY} · Reviewed patient-generated data · Clinician review of journal entry, Continua reflection, and between-session activity.
                  </p>
                  <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                    Sarah Chen · {DEMO_ENTRY.date} · {rtmLogs.sarah}min reviewed this month
                  </p>
                </div>
                <button
                  onClick={handleLogReview}
                  className="flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    fontFamily: "var(--font-jost)",
                    backgroundColor: loggedNow ? "rgba(74,139,108,0.1)" : "var(--color-primary)",
                    color: loggedNow ? "var(--color-primary-light)" : "var(--color-cream)",
                    border: loggedNow ? "1px solid rgba(74,139,108,0.3)" : "none",
                  }}
                >
                  {loggedNow ? "✓ +8 min logged" : "Log Review Time"}
                </button>
              </div>
            </div>
          </div>

          {/* RTM Sidebar */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            <div
              className="rounded-xl p-6 flex flex-col gap-5 sticky top-24"
              style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                RTM Summary · This month
              </p>

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total review time", value: `${totalMinutes}m`, sub: "across 6 patients" },
                  { label: "At threshold", value: `${patientsAtThreshold}/6`, sub: "≥ 20 min reviewed" },
                  { label: "Est. RTM revenue", value: `$${estimated}`, sub: "this month", accent: true },
                  { label: "Annual projection", value: `$${(estimated * 12).toLocaleString()}`, sub: "at current pace" },
                ].map(({ label, value, sub, accent }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: accent ? "rgba(28,61,46,0.05)" : "var(--color-surface)",
                      border: `1px solid ${accent ? "rgba(28,61,46,0.15)" : "var(--color-border)"}`,
                    }}
                  >
                    <p className="text-xl leading-tight" style={{ fontFamily: "var(--font-cormorant)", color: accent ? "var(--color-primary)" : "var(--color-text)" }}>
                      {value}
                    </p>
                    <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                      {label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)", opacity: 0.7 }}>
                      {sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Per-patient RTM bars */}
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                  Per patient
                </p>
                {patients.map((p) => (
                  <div key={p.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                        {p.name.split(" ")[0]}
                      </p>
                      {rtmLogs[p.id] >= 20 && (
                        <span className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}>
                          ✓ billable
                        </span>
                      )}
                    </div>
                    <RTMBar minutes={rtmLogs[p.id]} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowExport(true)}
                className="w-full py-3 rounded-xl text-sm font-medium"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-cream)",
                }}
              >
                Export for Billing
              </button>

              <p className="text-xs leading-relaxed text-center" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                Estimates based on CMS averages. Actual reimbursement varies by payer and contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
