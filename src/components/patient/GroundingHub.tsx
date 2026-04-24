"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Patient } from "@/data/patients";
import BoxBreathing from "./tools/BoxBreathing";
import PhysiologicalSigh from "./tools/PhysiologicalSigh";
import FourSevenEight from "./tools/FourSevenEight";
import BilateralStimulation from "./tools/BilateralStimulation";
import ProgressiveMuscleRelaxation from "./tools/ProgressiveMuscleRelaxation";
import FiveSenses from "./tools/FiveSenses";
import Containment from "./tools/Containment";
import SafePlace from "./tools/SafePlace";
import HaveningSelf from "./tools/HaveningSelf";
import BodyScan from "./tools/BodyScan";
import WindowOfTolerance from "./tools/WindowOfTolerance";

interface Props {
  patient: Patient;
  onBack: () => void;
}

type ToolId =
  | "box-breathing"
  | "physiological-sigh"
  | "four-seven-eight"
  | "bilateral"
  | "pmr"
  | "five-senses"
  | "containment"
  | "safe-place"
  | "havening"
  | "body-scan"
  | "window-of-tolerance";

interface ToolMeta {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  modality: "EMDR" | "CBT" | "DBT" | "Universal";
  emdrFeatured?: boolean;
}

const TOOLS: ToolMeta[] = [
  { id: "bilateral",           name: "Bilateral Stimulation",   description: "Follow the dot with your eyes. The crown jewel of EMDR resourcing.",          icon: "◉", modality: "EMDR",      emdrFeatured: true },
  { id: "containment",         name: "Container Visualization", description: "Place what's too heavy inside a container only you can open.",                 icon: "⬡", modality: "EMDR",      emdrFeatured: true },
  { id: "window-of-tolerance", name: "Window of Tolerance",     description: "Where are you in your nervous system right now? Tap your zone.",               icon: "⊿", modality: "EMDR" },
  { id: "safe-place",          name: "Safe Place",              description: "Return to your installed safe place — or build a new one.",                    icon: "◈", modality: "EMDR" },
  { id: "box-breathing",       name: "Box Breathing",           description: "Inhale 4 · Hold 4 · Exhale 6. Activates your calming response.",              icon: "▣", modality: "Universal" },
  { id: "physiological-sigh",  name: "Physiological Sigh",      description: "The fastest known way to reduce physiological stress.",                       icon: "↯", modality: "Universal" },
  { id: "four-seven-eight",    name: "4-7-8 Breathing",         description: "Dr. Weil's relaxation breath. Extended exhale shifts your state.",            icon: "∿", modality: "Universal" },
  { id: "five-senses",         name: "5-4-3-2-1 Grounding",    description: "Five senses, present moment. Anchor yourself here.",                          icon: "✦", modality: "Universal" },
  { id: "pmr",                 name: "Muscle Relaxation",       description: "Tense and release through 9 muscle groups.",                                  icon: "◎", modality: "Universal" },
  { id: "body-scan",           name: "Body Scan",               description: "A slow guided journey from head to feet. Just noticing.",                     icon: "⊙", modality: "Universal" },
  { id: "havening",            name: "Havening Touch",          description: "Self-administered touch that disrupts distress encoding.",                     icon: "⌖", modality: "Universal" },
];

const MODALITY_BADGE_COLORS: Record<ToolMeta["modality"], { color: string; bg: string; border: string }> = {
  EMDR:      { color: "var(--color-primary-mid)",  bg: "rgba(45,94,70,0.07)",    border: "rgba(45,94,70,0.2)" },
  CBT:       { color: "var(--color-accent)",       bg: "rgba(200,146,46,0.07)",  border: "rgba(200,146,46,0.2)" },
  DBT:       { color: "var(--color-primary-light)",bg: "rgba(74,139,108,0.07)",  border: "rgba(74,139,108,0.2)" },
  Universal: { color: "var(--color-quiet)",        bg: "rgba(138,138,132,0.06)", border: "rgba(138,138,132,0.15)" },
};

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function GroundingHub({ patient, onBack }: Props) {
  const [openTool, setOpenTool] = useState<ToolId | null>(null);

  const isEMDR = patient.modality === "emdr";

  const renderTool = (id: ToolId) => {
    const close = () => setOpenTool(null);
    const navigateTo = (toolId: string) => setOpenTool(toolId as ToolId);
    switch (id) {
      case "box-breathing":       return <BoxBreathing onClose={close} />;
      case "physiological-sigh":  return <PhysiologicalSigh onClose={close} />;
      case "four-seven-eight":    return <FourSevenEight onClose={close} />;
      case "bilateral":           return <BilateralStimulation onClose={close} isEMDR={isEMDR} patient={patient} />;
      case "pmr":                 return <ProgressiveMuscleRelaxation onClose={close} />;
      case "five-senses":         return <FiveSenses onClose={close} />;
      case "containment":         return <Containment onClose={close} />;
      case "safe-place":          return <SafePlace onClose={close} patient={patient} />;
      case "havening":            return <HaveningSelf onClose={close} />;
      case "body-scan":           return <BodyScan onClose={close} />;
      case "window-of-tolerance": return <WindowOfTolerance onClose={close} patient={patient} onOpenTool={navigateTo} />;
    }
  };

  if (openTool) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 py-6">
        {renderTool(openTool)}
      </div>
    );
  }

  const featuredTools = isEMDR ? TOOLS.filter(t => t.emdrFeatured) : [];
  const gridTools     = isEMDR
    ? TOOLS.filter(t => !t.emdrFeatured)
    : TOOLS.map(t =>
        t.id === "bilateral"
          ? { ...t, name: "Visual Tracking", description: "Follow a moving dot with your eyes. Bilateral visual stimulation." }
          : t
      );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
          ← Home
        </button>
        <div>
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>
            Ground Me Now
          </h1>
          <p className="text-sm" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
            Tools to help you regulate and return to the present moment
          </p>
        </div>
      </div>

      {/* EMDR featured row */}
      {featuredTools.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-quiet)", fontFamily: "var(--font-jost)" }}>
            Your EMDR Resources
          </p>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="show">
            {featuredTools.map(tool => (
              <motion.div key={tool.id} variants={itemVariants}>
                <FeaturedToolCard tool={tool} onClick={() => setOpenTool(tool.id)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Main grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants} initial="hidden" animate="show">
        {gridTools.map(tool => (
          <motion.div key={tool.id} variants={itemVariants}>
            <ToolCard tool={tool} onClick={() => setOpenTool(tool.id)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ToolCard({ tool, onClick }: { tool: ToolMeta; onClick: () => void }) {
  const badge = MODALITY_BADGE_COLORS[tool.modality];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(28,61,46,0.12)" }}
      transition={{ duration: 0.15 }}
      className="text-left rounded-xl p-5 flex flex-col gap-3 w-full"
      style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 3px rgba(28,61,46,0.05)", minHeight: 44 }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl leading-none" style={{ color: "var(--color-sage)" }}>{tool.icon}</span>
        <span className="text-xs px-2 py-0.5 rounded-full border"
          style={{ fontFamily: "var(--font-jost)", color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}>
          {tool.modality}
        </span>
      </div>
      <div>
        <p className="text-lg leading-snug" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}>{tool.name}</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}>{tool.description}</p>
      </div>
    </motion.button>
  );
}

function FeaturedToolCard({ tool, onClick }: { tool: ToolMeta; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(28,61,46,0.35)" }}
      transition={{ duration: 0.15 }}
      className="text-left rounded-xl p-6 flex flex-col gap-4 w-full"
      style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(28,61,46,0.2)",
        minHeight: 44,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none" style={{ color: "var(--color-sage)" }}>{tool.icon}</span>
        <span className="text-xs px-2 py-0.5 rounded-full border"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-cream)", borderColor: "rgba(245,237,216,0.3)", backgroundColor: "rgba(245,237,216,0.08)" }}>
          EMDR Resource
        </span>
      </div>
      <div>
        <p className="text-xl leading-snug" style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-cream)" }}>{tool.name}</p>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-jost)", color: "rgba(168,196,181,0.8)" }}>{tool.description}</p>
      </div>
    </motion.button>
  );
}
