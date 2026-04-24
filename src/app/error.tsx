"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-md text-center flex flex-col gap-6 items-center">
        <h2
          className="text-4xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--color-primary)" }}
        >
          Something went wrong
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-muted)" }}
        >
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{
            fontFamily: "var(--font-jost)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-cream)",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
