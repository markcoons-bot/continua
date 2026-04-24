import { ReactNode } from "react";

type BadgeVariant = "green" | "amber" | "sage" | "primary";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { color: string; bg: string; border: string }> = {
  green: {
    color: "var(--color-primary-mid)",
    bg: "rgba(45,94,70,0.08)",
    border: "rgba(45,94,70,0.2)",
  },
  amber: {
    color: "var(--color-accent)",
    bg: "rgba(200,146,46,0.08)",
    border: "rgba(200,146,46,0.2)",
  },
  sage: {
    color: "var(--color-primary-light)",
    bg: "rgba(168,196,181,0.2)",
    border: "rgba(168,196,181,0.4)",
  },
  primary: {
    color: "var(--color-cream)",
    bg: "var(--color-primary)",
    border: "var(--color-primary)",
  },
};

export default function Badge({
  children,
  variant = "sage",
  className = "",
}: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={{
        fontFamily: "var(--font-jost)",
        color: styles.color,
        backgroundColor: styles.bg,
        borderColor: styles.border,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}
