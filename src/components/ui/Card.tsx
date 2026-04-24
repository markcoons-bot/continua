import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border ${noPadding ? "" : "p-6"} ${className}`}
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
        boxShadow: "0 1px 4px rgba(28,61,46,0.06), 0 4px 16px rgba(28,61,46,0.04)",
      }}
    >
      {children}
    </div>
  );
}
