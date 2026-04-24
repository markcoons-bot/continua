import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Continua — Between-Session Therapy Support";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1C3D2E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 25% 35%, rgba(74,139,108,0.3) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Subtle top-right accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 400,
            height: 400,
            background:
              "radial-gradient(ellipse at 100% 0%, rgba(168,196,181,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
          }}
        >
          {/* Pill */}
          <div
            style={{
              background: "rgba(168,196,181,0.1)",
              border: "1px solid rgba(168,196,181,0.22)",
              borderRadius: 999,
              padding: "7px 22px",
              display: "flex",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                color: "#A8C4B5",
                fontSize: 15,
                letterSpacing: 3,
                fontFamily: "sans-serif",
              }}
            >
              FOR CLINICIANS · FOR PATIENTS
            </span>
          </div>

          {/* Wordmark */}
          <p
            style={{
              fontSize: 100,
              color: "#F5EDD8",
              letterSpacing: 22,
              margin: 0,
              lineHeight: 1,
              fontFamily: "serif",
              fontWeight: 300,
            }}
          >
            CONTINUA
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: 30,
              color: "rgba(245,237,216,0.6)",
              margin: 0,
              maxWidth: 620,
              lineHeight: 1.5,
              fontFamily: "sans-serif",
              fontWeight: 300,
            }}
          >
            Therapy doesn&apos;t stop when the session ends.
          </p>
        </div>

        {/* Bottom-right: stat */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <p
            style={{
              fontSize: 52,
              color: "#A8C4B5",
              margin: 0,
              lineHeight: 1,
              fontFamily: "serif",
              fontWeight: 300,
            }}
          >
            167
          </p>
          <p
            style={{
              fontSize: 14,
              color: "rgba(168,196,181,0.45)",
              margin: 0,
              letterSpacing: 2,
              fontFamily: "sans-serif",
              textTransform: "uppercase",
            }}
          >
            HOURS BETWEEN SESSIONS
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
