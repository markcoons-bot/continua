"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const demoLinks = [
  { href: "/demo",       label: "Patient Portal" },
  { href: "/clinician",  label: "Clinician View" },
  { href: "/calculator", label: "RTM Calculator" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = pathname === "/";

  // ── Landing nav ──────────────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: "rgba(28,61,46,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <span
                className="text-2xl tracking-[0.2em] font-medium"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "var(--color-primary)",
                }}
              >
                CONTINUA
              </span>
            </Link>

            {/* Center — For Clinicians anchor */}
            <a
              href="#business-case"
              className="hidden sm:block text-sm"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-muted)",
                letterSpacing: "0.03em",
              }}
            >
              For Clinicians
            </a>

            {/* CTA */}
            <Link
              href="/demo"
              className="px-4 sm:px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap"
              style={{
                fontFamily: "var(--font-jost)",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-cream)",
                letterSpacing: "0.03em",
              }}
            >
              <span className="sm:hidden">Demo →</span>
              <span className="hidden sm:inline">Explore the Demo →</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // ── Demo / app nav ───────────────────────────────────────────────────────────
  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + back link */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:block text-sm flex-shrink-0"
              style={{
                fontFamily: "var(--font-jost)",
                color: "rgba(168,196,181,0.55)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              ← Overview
            </Link>
            <Link href="/demo" className="flex items-center gap-3">
              <span
                className="text-2xl tracking-[0.2em] font-medium"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "var(--color-cream)",
                }}
              >
                CONTINUA
              </span>
              <span
                className="hidden sm:block text-xs tracking-wider opacity-60"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: "var(--color-sage)",
                }}
              >
                Demo Mode
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {demoLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-md text-sm transition-colors duration-150"
                  style={{
                    fontFamily: "var(--font-jost)",
                    color: isActive
                      ? "var(--color-cream)"
                      : "var(--color-sage)",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    letterSpacing: "0.03em",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <span
              className="ml-4 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--color-accent)",
                borderColor: "var(--color-accent)",
                backgroundColor: "rgba(200,146,46,0.08)",
                letterSpacing: "0.05em",
              }}
            >
              Demo Mode
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 transition-transform duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                transform: menuOpen
                  ? "translateY(8px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 transition-opacity duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-transform duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                transform: menuOpen
                  ? "translateY(-8px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t overflow-hidden"
            style={{
              borderColor: "rgba(168,196,181,0.2)",
              backgroundColor: "var(--color-primary)",
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: "rgba(168,196,181,0.55)",
                }}
              >
                ← Back to Overview
              </Link>
              {demoLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-md text-sm"
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: isActive
                        ? "var(--color-cream)"
                        : "var(--color-sage)",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
