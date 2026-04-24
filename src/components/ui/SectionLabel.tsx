import { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-medium uppercase tracking-widest ${className}`}
      style={{
        fontFamily: "var(--font-jost)",
        color: "var(--color-quiet)",
        letterSpacing: "0.12em",
      }}
    >
      {children}
    </p>
  );
}
