"use client";

import { useState } from "react";

const CPT_CODES = [
  {
    code: "98975",
    label: "RTM Setup",
    description: "Initial setup of RTM device/program. Billed once per patient when onboarding.",
    rate: "$19–$25",
  },
  {
    code: "98977",
    label: "Device Supply",
    description: "Monthly supply of device/software for musculoskeletal or respiratory conditions.",
    rate: "$55–$65",
  },
  {
    code: "98980",
    label: "Clinical Review — First 20 min",
    description: "Clinician review of patient-generated data, first 20 minutes per calendar month.",
    rate: "$50–$60",
  },
  {
    code: "98981",
    label: "Clinical Review — Additional 20 min",
    description: "Each additional 20-minute increment of clinician review per calendar month.",
    rate: "$40–$48",
  },
];

const PLATFORM_COST_PER_PATIENT = 29; // hypothetical monthly licensing

export default function RTMCalculator() {
  const [patients, setPatients] = useState(12);
  const [sessionFee, setSessionFee] = useState(175);

  const platformCost = patients * PLATFORM_COST_PER_PATIENT;
  const rtmRevenue = patients * 50; // CPT 98980 baseline, one per patient/month
  const netGain = rtmRevenue - platformCost;
  const annualProjection = netGain * 12;
  const rtmAsPctOfSession = ((rtmRevenue / (patients * sessionFee * 4)) * 100).toFixed(1);

  const metrics = [
    {
      label: "Monthly RTM revenue",
      value: `$${rtmRevenue.toLocaleString()}`,
      sub: `${patients} patients × CPT 98980`,
      accent: false,
    },
    {
      label: "Platform cost",
      value: `-$${platformCost.toLocaleString()}`,
      sub: `$${PLATFORM_COST_PER_PATIENT}/patient/month`,
      accent: false,
      negative: true,
    },
    {
      label: "Net monthly gain",
      value: netGain >= 0 ? `$${netGain.toLocaleString()}` : `-$${Math.abs(netGain).toLocaleString()}`,
      sub: "after platform cost",
      accent: true,
      positive: netGain >= 0,
    },
    {
      label: "Annual projection",
      value: `$${annualProjection.toLocaleString()}`,
      sub: "at current patient count",
      accent: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
          Remote Therapeutic Monitoring
        </p>
        <h1 className="text-5xl leading-tight" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          RTM Calculator
        </h1>
        <p className="text-base mt-3 max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
          Estimate the revenue impact of adding Remote Therapeutic Monitoring to your practice. These are conservative estimates based on CMS published rates.
        </p>
      </div>

      {/* Sliders */}
      <div
        className="rounded-2xl p-8 flex flex-col gap-8"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ fontFamily: "var(--font-jost)", color: "var(--color-text)" }}>
              Active Continua patients
            </label>
            <span className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
              {patients}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={75}
            step={1}
            value={patients}
            onChange={(e) => setPatients(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--color-primary)" }}
          />
          <div className="flex justify-between">
            {[5, 20, 40, 60, 75].map((n) => (
              <span key={n} className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ fontFamily: "var(--font-jost)", color: "var(--color-text)" }}>
              Average session fee
            </label>
            <div className="text-right">
              <span className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                ${sessionFee}
              </span>
              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                RTM = {rtmAsPctOfSession}% of monthly session revenue per patient
              </p>
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={400}
            step={5}
            value={sessionFee}
            onChange={(e) => setSessionFee(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--color-primary-mid)" }}
          />
          <div className="flex justify-between">
            {[100, 175, 250, 325, 400].map((n) => (
              <span key={n} className="text-xs" style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}>
                ${n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, sub, accent, negative, positive }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex flex-col gap-2"
            style={{
              backgroundColor: accent ? "var(--color-primary)" : "var(--color-card)",
              border: `1px solid ${accent ? "transparent" : "var(--color-border)"}`,
              boxShadow: accent ? "0 4px 24px rgba(28,61,46,0.2)" : "0 1px 3px rgba(28,61,46,0.04)",
            }}
          >
            <p
              className="text-3xl leading-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: accent
                  ? "var(--color-cream)"
                  : negative
                  ? "var(--color-quiet)"
                  : "var(--color-primary)",
              }}
            >
              {value}
            </p>
            <p
              className="text-xs font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                color: accent ? "var(--color-sage)" : "var(--color-text)",
              }}
            >
              {label}
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-jost)",
                color: accent ? "rgba(168,196,181,0.7)" : "var(--color-quiet)",
              }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          How RTM billing works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Patient uses Continua",
              body: "Between sessions, patients journal, use grounding tools, and check in with their mood. All activity is logged as patient-generated data.",
            },
            {
              step: "2",
              title: "Clinician reviews data",
              body: "You spend 20+ minutes per month reviewing patient data in the clinician dashboard — journals, reflections, mood trends, and tool usage.",
            },
            {
              step: "3",
              title: "Bill RTM codes",
              body: "CPT 98980 covers the first 20 minutes of clinician review. Each additional 20 minutes is billed under CPT 98981. Export your log for billing.",
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="rounded-xl p-6 flex flex-col gap-3"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, backgroundColor: "rgba(28,61,46,0.07)", border: "1px solid rgba(28,61,46,0.15)" }}
              >
                <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {step}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                {title}
              </p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CPT code reference */}
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
          CPT code reference
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          {CPT_CODES.map((cpt, i) => (
            <div
              key={cpt.code}
              className="flex items-start gap-4 p-5"
              style={{
                borderTop: i > 0 ? `1px solid var(--color-border)` : "none",
                backgroundColor: i % 2 === 0 ? "var(--color-card)" : "var(--color-surface)",
              }}
            >
              <span
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-mono font-medium"
                style={{
                  backgroundColor: "rgba(28,61,46,0.07)",
                  color: "var(--color-primary)",
                  fontFamily: "monospace",
                }}
              >
                {cpt.code}
              </span>
              <div className="flex-1">
                <p className="text-base" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                  {cpt.label}
                </p>
                <p className="text-sm mt-1 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
                  {cpt.description}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-sm font-medium"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary-light)" }}
              >
                {cpt.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "rgba(200,146,46,0.04)", border: "1px solid rgba(200,146,46,0.15)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-jost)", color: "var(--color-accent)" }}>
          Important disclaimer
        </p>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}>
          These figures are estimates based on Medicare published rates and should not be taken as billing guarantees. Actual reimbursement depends on payer contracts, patient coverage, geographic adjustments, and practice overhead. Consult your billing specialist or practice administrator before implementing an RTM program. Continua is a clinical support platform, not a billing service.
        </p>
      </div>
    </div>
  );
}
