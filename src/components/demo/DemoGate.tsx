"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "continua_demo_welcomed";

export default function DemoGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(false);
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            key="demo-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
              backgroundColor: "rgba(12,30,22,0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-md w-full rounded-2xl flex flex-col gap-6"
              style={{
                backgroundColor: "var(--color-card)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
                padding: "44px 40px 40px",
              }}
            >
              {/* Label */}
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{
                    fontFamily: "var(--font-jost)",
                    color: "var(--color-primary-light)",
                  }}
                >
                  Demo Mode
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "2rem",
                    color: "var(--color-primary)",
                    lineHeight: 1.15,
                  }}
                >
                  You&apos;re now in Demo Mode
                </p>
              </div>

              {/* Body */}
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.9375rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.8,
                }}
              >
                Explore the patient portal across 6 fictional clinical profiles.
                Switch between patients using the selector above. The journal AI
                reflection is live — try writing something.
              </p>

              {/* CTA */}
              <button
                onClick={dismiss}
                className="w-full py-3.5 rounded-full text-sm font-medium"
                style={{
                  fontFamily: "var(--font-jost)",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-cream)",
                  letterSpacing: "0.05em",
                }}
              >
                Enter Demo
              </button>

              {/* Back link */}
              <Link
                href="/"
                className="text-center text-xs"
                style={{
                  fontFamily: "var(--font-jost)",
                  color: "var(--color-quiet)",
                }}
              >
                ← Back to overview
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
