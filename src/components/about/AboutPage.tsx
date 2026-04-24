"use client";

import { useEffect, useRef, useState } from "react";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, triggered: boolean = false) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!triggered || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const step = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);

  return value;
}

// ─── Intersection observer hook ───────────────────────────────────────────────

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Stat card with count-up ──────────────────────────────────────────────────

function StatCard({
  value,
  suffix = "",
  prefix = "",
  label,
  sub,
  triggered,
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sub: string;
  triggered: boolean;
  duration?: number;
}) {
  const count = useCountUp(value, duration, triggered);
  return (
    <div
      className="rounded-2xl p-7 flex flex-col gap-2"
      style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(28,61,46,0.05)" }}
    >
      <p className="text-5xl leading-none" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-base font-medium" style={{ fontFamily: "var(--font-jost)", color: "var(--color-text)" }}>
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>
        {sub}
      </p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  id,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`} style={style}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs uppercase tracking-widest mb-4"
      style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
    >
      {children}
    </p>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { ref: statsRef, inView: statsInView } = useInView(0.2);

  return (
    <div style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <Section>
        <div className="max-w-3xl">
          <p
            className="text-sm mb-6 inline-block px-3 py-1 rounded-full border"
            style={{
              fontFamily: "var(--font-jost)",
              color: "var(--color-primary-mid)",
              borderColor: "rgba(45,94,70,0.25)",
              backgroundColor: "rgba(45,94,70,0.05)",
            }}
          >
            For clinicians · For patients · For the 167 hours in between
          </p>
          <h1
            className="text-6xl sm:text-7xl lg:text-8xl leading-none mb-8"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)", letterSpacing: "-0.01em" }}
          >
            Therapy doesn't stop when the session ends.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.75 }}
          >
            A weekly therapy session is 50 minutes. The rest of the week — 167 hours — patients navigate
            their lives with whatever they absorbed in the room. Continua bridges that gap.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-full text-sm font-medium"
              style={{ fontFamily: "var(--font-jost)", backgroundColor: "var(--color-primary)", color: "var(--color-cream)" }}
            >
              See how it works
            </a>
            <a
              href="#cta"
              className="px-8 py-3.5 rounded-full text-sm font-medium"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-primary)", border: "2px solid var(--color-primary)" }}
            >
              Talk to us
            </a>
          </div>
        </div>
      </Section>

      {/* ── 2. The Problem ───────────────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "var(--color-primary)" }}>
        <Label>
          <span style={{ color: "rgba(168,196,181,0.6)" }}>The problem</span>
        </Label>
        <h2
          className="text-5xl sm:text-6xl leading-tight mb-6 max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}
        >
          50 minutes of therapy. 167 hours of life.
        </h2>
        <p
          className="text-base leading-relaxed max-w-xl mb-14"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)", lineHeight: 1.8 }}
        >
          Between sessions, patients forget key insights, lose access to coping tools, and have no
          one to hold space when something difficult happens. For EMDR patients mid-processing, the
          window is especially narrow — resources need to be accessible, not locked in the therapist's office.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" ref={statsRef}>
          <StatCard
            value={76}
            suffix="%"
            label="of patients forget key insights"
            sub="within 48 hours of a therapy session without structured between-session support"
            triggered={statsInView}
            duration={1200}
          />
          <StatCard
            value={167}
            label="hours between sessions"
            sub="The average patient has 50 minutes of therapy contact per week — and 167 hours without it"
            triggered={statsInView}
            duration={900}
          />
          <StatCard
            value={40}
            suffix="%"
            label="therapy dropout reduction"
            sub="Patients with between-session contact show significantly higher retention and treatment completion"
            triggered={statsInView}
            duration={1500}
          />
        </div>
      </Section>

      {/* ── 3. How It Works ──────────────────────────────────────────────────── */}
      <Section id="how-it-works">
        <Label>How it works</Label>
        <h2
          className="text-5xl leading-tight mb-14 max-w-xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Three experiences. One platform.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "◈",
              title: "Patient experience",
              color: "var(--color-sage)",
              items: [
                "Personalized portal with therapist's note and this week's journal prompt",
                "10 grounding tools including bilateral stimulation, box breathing, and containment visualization",
                "Between-session journaling with Continua AI reflection — compassionate, non-clinical",
                "Session memory anchors, resource team, and modality-specific tools",
                "Mood check-ins and progress tracking",
              ],
            },
            {
              icon: "◉",
              title: "Clinician dashboard",
              color: "var(--color-primary-light)",
              items: [
                "Overview of all patients with mood sparklines and activity indicators",
                "Journal review panel with Continua's AI reflection visible alongside patient entry",
                "Send personalized prompts between sessions",
                "RTM time logging built into every review action",
                "Billing summary and export for CPT 98980/98981",
              ],
            },
            {
              icon: "⬡",
              title: "RTM billing pathway",
              color: "var(--color-accent)",
              items: [
                "Every clinician review action logs time automatically",
                "Dashboard tracks per-patient monthly minutes against RTM thresholds",
                "CPT 98980 (first 20 min) and 98981 (each additional 20 min) supported",
                "One-click billing export with patient-level CPT notation",
                "$50–$60 per patient/month in additional revenue, before overhead",
              ],
            },
          ].map(({ icon, title, color, items }) => (
            <div
              key={title}
              className="rounded-2xl p-7 flex flex-col gap-5"
              style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
            >
              <span className="text-3xl" style={{ color }}>{icon}</span>
              <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
                {title}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.7 }}
                  >
                    <span className="flex-shrink-0 mt-1" style={{ color }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. Clinical Foundation ────────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <Label>Clinical foundation</Label>
            <h2
              className="text-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
            >
              Built on evidence, not wishful thinking.
            </h2>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}
            >
              Between-session interventions are among the most consistently supported findings in
              psychotherapy research. Bryant et al. (2003), Kazantzis et al. (2010), and the broader
              homework compliance literature all point to the same conclusion: what happens outside the
              room determines a significant portion of treatment outcome.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}
            >
              For EMDR patients specifically, between-session stability is not optional — it is a
              protocol requirement. Francine Shapiro's original work emphasized resource installation
              and containment as prerequisites for active processing. Continua operationalizes this:
              the safe place, container visualization, bilateral stimulation, and Window of Tolerance
              tracker are available to patients at any hour, not just during the session.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                tag: "EMDR",
                title: "Bilateral stimulation between sessions",
                body: "Patients can access a smooth-tracking bilateral stimulation tool for resourcing and self-regulation — available anytime, calibrated to their preferred speed.",
              },
              {
                tag: "Stabilization",
                title: "Resource installation reinforcement",
                body: "Safe place, calm place, nurturing figure, and protector figure visualizations are available as guided, personalized tools — reinforcing the installed resources from session.",
              },
              {
                tag: "Regulation",
                title: "Window of Tolerance awareness",
                body: "Patients can identify their current arousal state — hyper, window, or hypo — and receive immediate, appropriate grounding tool recommendations.",
              },
              {
                tag: "RTM",
                title: "Remote Therapeutic Monitoring framework",
                body: "CMS added RTM codes (98975–98981) to incentivize exactly this type of between-session digital support. Continua is built from the ground up around these billing pathways.",
              },
            ].map(({ tag, title, body }) => (
              <div
                key={title}
                className="rounded-xl p-5 flex flex-col gap-2"
                style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: "var(--color-primary-mid)",
                      borderColor: "rgba(45,94,70,0.25)",
                      backgroundColor: "rgba(45,94,70,0.05)",
                    }}
                  >
                    {tag}
                  </span>
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
      </Section>

      {/* ── 5. Three Pillars ─────────────────────────────────────────────────── */}
      <Section>
        <Label>Our principles</Label>
        <h2
          className="text-5xl leading-tight mb-14 max-w-xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Three pillars. No compromises.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              title: "Clinical value",
              body: "Every feature in Continua has a clinical rationale. The bilateral stimulation tool is calibrated to EMDR protocols. The containment visualization follows EMDR stabilization guidelines. The journal reflection AI is constrained to holding space — it never advises. We built this with clinicians, not around them.",
              accent: "var(--color-primary)",
            },
            {
              number: "02",
              title: "Ethical AI",
              body: "Continua's AI companion operates within a narrow, explicitly defined role: reflect, witness, hold space. It does not diagnose, advise, or interpret clinically. Crisis keywords trigger an immediate human redirect — to the therapist and to 988. The model is constrained at the system level, not just by instruction.",
              accent: "var(--color-primary-mid)",
            },
            {
              number: "03",
              title: "Revenue expansion",
              body: "RTM billing is the first payment model in the history of US healthcare to reimburse clinicians for exactly the kind of between-session work that improves outcomes. Continua is built to make RTM billing frictionless — logging, thresholds, and export are built into the workflow.",
              accent: "var(--color-accent)",
            },
          ].map(({ number, title, body, accent }) => (
            <div key={number} className="flex flex-col gap-5">
              <p
                className="text-6xl leading-none"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-border)" }}
              >
                {number}
              </p>
              <p
                className="text-2xl"
                style={{ fontFamily: "var(--font-cormorant)", color: accent }}
              >
                {title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.85 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. Who It's For ───────────────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "var(--color-primary)" }}>
        <Label>
          <span style={{ color: "rgba(168,196,181,0.6)" }}>Who it's for</span>
        </Label>
        <h2
          className="text-5xl leading-tight mb-12 max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}
        >
          Built for practitioners with a capped hourly model and a desire to do more.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "EMDR practitioners",
              body: "Continua is purpose-built for EMDR. Resource installation reinforcement, bilateral stimulation, SUDS tracking, Window of Tolerance, and phase-aware guidance are all standard features — not add-ons.",
            },
            {
              title: "CBT therapists",
              body: "Thought records, cognitive distortion checkers, core belief reminders, and behavioral activation prompts — all assigned and reviewed through the clinician dashboard.",
            },
            {
              title: "Group practices",
              body: "Multi-clinician dashboards, per-patient RTM tracking, and billing export designed to work across a full caseload. Continua scales from solo practitioners to group practices.",
            },
            {
              title: "Any capped-hourly practice",
              body: "If you're limited by how many sessions you can see per week, RTM billing is the mechanism to expand revenue without expanding hours. Continua is the infrastructure to make that happen.",
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-xl p-6 flex flex-col gap-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(168,196,181,0.15)",
              }}
            >
              <p className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}>
                {title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)", lineHeight: 1.75 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 7. Licensing model ────────────────────────────────────────────────── */}
      <Section>
        <Label>Licensing model</Label>
        <h2
          className="text-5xl leading-tight mb-14 max-w-xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          A phased rollout built for trust.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              phase: "Phase 1",
              title: "Your practice",
              status: "Current",
              body: "Continua launches with a single-practice model. One clinician, up to 50 patients, full feature set. Monthly licensing with per-patient tiering. The goal is to prove the model — clinically and financially — before expanding.",
              color: "var(--color-primary)",
            },
            {
              phase: "Phase 2",
              title: "EMDR network",
              status: "2026",
              body: "Partnership with EMDR Institute and regional EMDR networks. Purpose-built tooling for EMDR protocol support — resource installation reinforcement, BLS tools, SUDS tracking, and phase-aware guidance — distributed to member practitioners.",
              color: "var(--color-primary-mid)",
            },
            {
              phase: "Phase 3",
              title: "General counseling",
              status: "2027",
              body: "Expansion to CBT networks, DBT programs, grief counseling groups, and adolescent/school-based therapy programs. Platform opens to additional modality configurations, multi-clinician practices, and institutional licensing.",
              color: "var(--color-primary-light)",
            },
          ].map(({ phase, title, status, body, color }) => (
            <div
              key={phase}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    fontFamily: "var(--font-jost)",
                    color,
                    backgroundColor: `${color}12`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {phase}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-quiet)" }}
                >
                  {status}
                </span>
              </div>
              <p className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color }}>
                {title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)", lineHeight: 1.8 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 8. CTA ───────────────────────────────────────────────────────────── */}
      <Section
        id="cta"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, #1e4535 50%, var(--color-primary-mid) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-jost)", color: "rgba(168,196,181,0.6)" }}
          >
            This is a demo
          </p>
          <h2
            className="text-5xl sm:text-6xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}
          >
            Built to start a conversation.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-sage)", lineHeight: 1.8 }}
          >
            Continua is a working proof of concept. Every screen, every tool, every billing pathway
            you've seen is functional. If you're a clinician interested in piloting Continua with
            your practice — or a potential partner, investor, or collaborator — we'd like to hear from you.
          </p>
          <a
            href="mailto:hello@continuatherapy.com"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-medium"
            style={{
              fontFamily: "var(--font-jost)",
              backgroundColor: "var(--color-cream)",
              color: "var(--color-primary)",
            }}
          >
            Reach out
            <span>→</span>
          </a>
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-jost)", color: "rgba(168,196,181,0.4)" }}
          >
            hello@continuatherapy.com · Response within 48 hours
          </p>
        </div>
      </Section>

    </div>
  );
}
