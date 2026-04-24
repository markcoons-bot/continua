"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { patients } from "@/data/patients";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

// ─── Product Mockup ───────────────────────────────────────────────────────────

function ProductMockup() {
  const activePatient = patients[0];

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{
        border: "1px solid var(--color-border)",
        boxShadow: "0 32px 80px rgba(28,61,46,0.14)",
        backgroundColor: "var(--color-card)",
      }}
    >
      {/* Simulated nav bar */}
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          padding: "0 20px",
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "var(--color-cream)",
            fontSize: "1rem",
            letterSpacing: "0.18em",
          }}
        >
          CONTINUA
        </span>
        <div className="hidden sm:flex gap-4 ml-2">
          {["Patient Portal", "Clinician View", "RTM Calculator"].map((link, i) => (
            <span
              key={link}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.72rem",
                color: i === 0 ? "var(--color-cream)" : "rgba(168,196,181,0.45)",
                letterSpacing: "0.02em",
              }}
            >
              {link}
            </span>
          ))}
        </div>
        <div className="ml-auto hidden sm:flex items-center">
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.65rem",
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent)",
              borderRadius: 999,
              padding: "2px 8px",
              letterSpacing: "0.06em",
            }}
          >
            Demo Mode
          </span>
        </div>
      </div>

      {/* Patient switcher */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "10px 20px 8px",
        }}
      >
        <div className="flex gap-1.5" style={{ overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          {patients.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.75rem",
                backgroundColor: i === 0 ? "var(--color-primary)" : "transparent",
                color: i === 0 ? "var(--color-cream)" : "var(--color-muted)",
                border: `1px solid ${i === 0 ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.5rem",
                  letterSpacing: "0.01em",
                  backgroundColor:
                    i === 0
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(28,61,46,0.07)",
                  color:
                    i === 0 ? "var(--color-cream)" : "var(--color-primary)",
                  flexShrink: 0,
                }}
              >
                {p.initials}
              </span>
              {p.name.split(" ")[0]}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.68rem",
              color: "var(--color-quiet)",
            }}
          >
            {activePatient.badge}
          </span>
          <span style={{ color: "var(--color-border)", fontSize: "0.75rem" }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.68rem",
              color: "var(--color-quiet)",
            }}
          >
            {activePatient.phase}
          </span>
        </div>
      </div>

      {/* Journal preview */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
          >
            Sarah&apos;s entry · Tuesday
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1rem",
              color: "var(--color-text)",
              lineHeight: 1.85,
            }}
          >
            I drove to the pharmacy today — not the highway, just surface
            streets. I noticed the moment I got near the on-ramp and felt my
            chest tighten. The container thing helped. I just pictured it. The
            lock clicking.
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "rgba(168,196,181,0.08)",
            border: "1px solid rgba(168,196,181,0.3)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{
              fontFamily: "var(--font-jost)",
              color: "var(--color-primary-light)",
            }}
          >
            Continua reflected
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "var(--color-text)",
              lineHeight: 1.85,
            }}
          >
            There is so much self-awareness in what you&apos;ve written —
            noticing the limit, naming the feeling without being swallowed by
            it. That isn&apos;t defeat. That&apos;s the work, happening in
            real life.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main landing page ────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="px-5 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-20"
        style={{
          backgroundColor: "var(--color-bg)",
          minHeight: "calc(100svh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          textAlign: "center",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ maxWidth: 820, width: "100%" }}
          className="flex flex-col items-center gap-8"
        >
          {/* Pill */}
          <motion.div variants={fadeUp}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs border"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-primary-mid)",
                borderColor: "rgba(45,94,70,0.3)",
                backgroundColor: "rgba(45,94,70,0.06)",
                letterSpacing: "0.05em",
              }}
            >
              For clinicians · For patients · For the 167 hours in between
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(40px, 8vw, 92px)",
              lineHeight: 1.07,
              color: "var(--color-primary)",
              fontWeight: 400,
            }}
          >
            Therapy doesn&apos;t stop
            <br />
            when the session ends.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "1.125rem",
              color: "var(--color-muted)",
              lineHeight: 1.8,
              maxWidth: 560,
            }}
          >
            A weekly session is 50 minutes. The rest of the week — 167 hours —
            patients navigate their lives with whatever they absorbed in the
            room. Continua bridges that gap.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-full text-sm font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-cream)",
                letterSpacing: "0.04em",
              }}
            >
              Explore the Demo →
            </Link>
            <a
              href="#business-case"
              className="px-8 py-3.5 rounded-full text-sm font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-primary)",
                border: "2px solid rgba(28,61,46,0.28)",
                letterSpacing: "0.04em",
              }}
            >
              See the Business Case
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            opacity: 0.3,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              color: "var(--color-primary)",
            }}
          >
            SCROLL
          </span>
          <span
            style={{
              color: "var(--color-primary)",
              fontSize: "0.9rem",
              animation: "wot-pulse 2.5s ease-in-out infinite",
            }}
          >
            ↓
          </span>
        </div>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6" style={{ backgroundColor: "var(--color-primary)" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ maxWidth: 1080, margin: "0 auto" }}
          className="flex flex-col gap-12"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)" }}
            >
              The Problem
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(36px, 5vw, 58px)",
                color: "var(--color-cream)",
                fontWeight: 400,
                lineHeight: 1.12,
              }}
            >
              50 minutes of therapy.
              <br />
              167 hours of life.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                stat: "167",
                unit: "hours",
                desc: "Between weekly sessions — largely unsupported by the clinical relationship",
              },
              {
                stat: "42%",
                unit: "",
                desc: "Improvement in outcomes when patients have structured between-session support",
              },
              {
                stat: "$51.61",
                unit: "/ patient / mo",
                desc: "CMS reimbursement per patient per month via RTM billing (CPT 98980)",
              },
            ].map(({ stat, unit, desc }) => (
              <motion.div
                key={stat}
                variants={fadeUp}
                className="rounded-2xl p-8 flex flex-col gap-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(168,196,181,0.18)",
                }}
              >
                <div className="flex items-baseline gap-2">
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "3.75rem",
                      lineHeight: 1,
                      color: "var(--color-sage)",
                      fontWeight: 400,
                    }}
                  >
                    {stat}
                  </p>
                  {unit && (
                    <p
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: "0.72rem",
                        color: "var(--color-sage)",
                        opacity: 0.65,
                      }}
                    >
                      {unit}
                    </p>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.875rem",
                    color: "rgba(168,196,181,0.7)",
                    lineHeight: 1.7,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.9375rem",
              color: "rgba(168,196,181,0.65)",
              lineHeight: 1.85,
              maxWidth: 620,
            }}
          >
            Research consistently shows that between-session support —
            structured activities, journaling, skills practice — is among the
            strongest predictors of therapeutic outcome. Most practices offer
            none of it.
          </motion.p>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ maxWidth: 1080, margin: "0 auto" }}
          className="flex flex-col gap-16"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
            >
              The Product
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                color: "var(--color-primary)",
                fontWeight: 400,
                lineHeight: 1.15,
                maxWidth: 580,
              }}
            >
              Built for the work that happens between sessions
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10"
          >
            {[
              {
                icon: "◉",
                title: "Patient Portal",
                desc: "Grounding tools, smart journaling with AI reflection, session memory, and modality-specific tools — EMDR bilateral stimulation, CBT thought records, DBT skills, grief space.",
              },
              {
                icon: "▦",
                title: "Clinician Dashboard",
                desc: "Patient activity feed, journal review with embedded reflections, between-session prompts, and RTM time logging — everything in one place.",
              },
              {
                icon: "◈",
                title: "RTM Billing",
                desc: "CPT 98980–98981 generate real reimbursable clinical activity. Continua logs the review trail automatically — billing is a byproduct of good clinical work.",
              },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="flex flex-col gap-4"
              >
                <span
                  style={{ fontSize: "1.6rem", color: "var(--color-primary-light)" }}
                >
                  {icon}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.45rem",
                    color: "var(--color-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.875rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Product mockup */}
          <motion.div variants={fadeUp}>
            <ProductMockup />
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-cream)",
                letterSpacing: "0.04em",
              }}
            >
              Explore the Demo →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CLINICAL FOUNDATION ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6" style={{ backgroundColor: "var(--color-surface)" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ maxWidth: 1080, margin: "0 auto" }}
          className="flex flex-col gap-12"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
            >
              Clinical Grounding
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                color: "var(--color-primary)",
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            >
              Designed around how therapy actually works
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              {
                label: "EMDR Between Sessions",
                title: "Bilateral stimulation for resource installation",
                desc: "Containment visualization, safe place reinforcement, SUDS tracking, and named resource selection — matching established EMDR clinical protocol.",
                color: "#2D5E46",
                bg: "rgba(45,94,70,0.05)",
                border: "rgba(45,94,70,0.16)",
              },
              {
                label: "Window of Tolerance",
                title: "Dr. Dan Siegel's arousal model",
                desc: "Zone-aware tool routing — hyper-arousal routes to calming interventions, hypo-arousal routes to activation tools. Grounded in nervous system science.",
                color: "#4A8B6C",
                bg: "rgba(74,139,108,0.05)",
                border: "rgba(74,139,108,0.18)",
              },
              {
                label: "CBT Skills Practice",
                title: "Thought records and belief tracking",
                desc: "Cognitive distortion identification, core belief work, automatic thought capture — structured for meaningful between-session practice.",
                color: "#C8922E",
                bg: "rgba(200,146,46,0.05)",
                border: "rgba(200,146,46,0.16)",
              },
              {
                label: "DBT Distress Tolerance",
                title: "TIPP, ACCEPTS, radical acceptance",
                desc: "Diary card tracking, crisis survival skills, interpersonal effectiveness — the full DBT skills set in a structured, accessible interface.",
                color: "#6478a0",
                bg: "rgba(100,120,148,0.05)",
                border: "rgba(100,120,148,0.18)",
              },
            ].map(({ label, title, desc, color, bg, border }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="rounded-xl p-7 flex flex-col gap-3"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-jost)", color, opacity: 0.85 }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.3rem",
                    color: "var(--color-primary)",
                    lineHeight: 1.25,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.875rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.78,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.8125rem",
              color: "var(--color-quiet)",
              lineHeight: 1.75,
            }}
          >
            Built in consultation with established clinical frameworks. Not a replacement for therapy.
          </motion.p>
        </motion.div>
      </section>

      {/* ── BUSINESS CASE ────────────────────────────────────────────── */}
      <section
        id="business-case"
        className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ maxWidth: 1080, margin: "0 auto" }}
          className="flex flex-col gap-14"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)" }}
            >
              For Clinicians
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(32px, 4.5vw, 54px)",
                color: "var(--color-cream)",
                fontWeight: 400,
                lineHeight: 1.12,
              }}
            >
              The tool that pays for itself —
              <br />
              and then some.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* RTM math */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(168,196,181,0.18)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)" }}
              >
                RTM Revenue Math
              </p>
              <div className="flex flex-col">
                {[
                  { label: "20 patients × $51.61", value: "$1,032 / month", big: false },
                  { label: "Platform cost", value: "−$300 / month", big: false },
                  { label: "Net gain", value: "$732 / month", big: true },
                  { label: "Annual additional revenue", value: "$8,784", big: true },
                ].map(({ label, value, big }, i) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 py-4"
                    style={{
                      borderBottom: i < 3 ? "1px solid rgba(168,196,181,0.1)" : "none",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: "0.875rem",
                        color: "rgba(168,196,181,0.65)",
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: big ? "1.5rem" : "1.1rem",
                        color: big ? "var(--color-sage)" : "rgba(168,196,181,0.85)",
                        lineHeight: 1,
                        textAlign: "right",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Roadmap */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 pt-2">
              <p
                className="text-xs uppercase tracking-widest mb-5"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)" }}
              >
                Growth Roadmap
              </p>
              {[
                {
                  num: "1",
                  title: "Your practice",
                  desc: "Validate with existing patients. Establish clinical protocol, outcome data, and RTM billing process.",
                },
                {
                  num: "2",
                  title: "EMDR network",
                  desc: "License to fellow EMDR practitioners at $200–400/mo per practice. Outcome data becomes the sales floor.",
                },
                {
                  num: "3",
                  title: "General counseling",
                  desc: "Expand to CBT, DBT, grief practices. Outcome data is the product moat — no one else has it.",
                },
              ].map(({ num, title, desc }, i) => (
                <div key={num} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-jost)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        backgroundColor: "rgba(168,196,181,0.12)",
                        color: "var(--color-sage)",
                        border: "1px solid rgba(168,196,181,0.25)",
                        flexShrink: 0,
                      }}
                    >
                      {num}
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          width: 1,
                          flex: 1,
                          minHeight: 28,
                          backgroundColor: "rgba(168,196,181,0.12)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pb-8">
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "1.25rem",
                        color: "var(--color-cream)",
                        lineHeight: 1.2,
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: "0.8125rem",
                        color: "rgba(168,196,181,0.6)",
                        lineHeight: 1.75,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link
              href="/calculator"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.875rem",
                color: "var(--color-sage)",
                letterSpacing: "0.03em",
                opacity: 0.85,
              }}
            >
              See the full RTM calculator →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-14 px-5 sm:px-6" style={{ backgroundColor: "#0d1f18" }}>
        <div
          style={{ maxWidth: 1080, margin: "0 auto" }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2rem",
              color: "var(--color-sage)",
              letterSpacing: "0.22em",
              fontWeight: 400,
            }}
          >
            CONTINUA
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.875rem",
              color: "rgba(168,196,181,0.45)",
            }}
          >
            Demo prototype — built to start a conversation
          </p>
          <a
            href="mailto:?subject=Interested%20in%20piloting%20Continua"
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.875rem",
              color: "var(--color-sage)",
              opacity: 0.75,
            }}
          >
            Interested in piloting Continua? →
          </a>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.72rem",
              color: "rgba(168,196,181,0.25)",
              marginTop: 8,
            }}
          >
            This is a demonstration. All patient data is fictional.
          </p>
        </div>
      </footer>

    </div>
  );
}
