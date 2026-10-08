import { ImageResponse } from "next/og";

export const alt = "Bobby Washburn | Parenting Support";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sitewide default OG card — any route without its own opengraph-image file
// falls back to this one. Text-only by design: the real logo SVGs use a
// self-referencing clip-path that renders blank through next/image/<img>
// (see the Logo Behavior note in CLAUDE.md), so this avoids that trap
// entirely rather than working around it.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #111111 0%, #9F0000 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "#F8F8F8",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          Bobby Washburn
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#F8F8F8",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Parenting Support
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 28,
            color: "#F8F8F8",
            opacity: 0.75,
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          Peer support for parents at their wits&apos; end — whatever the challenge.
        </div>
      </div>
    ),
    { ...size },
  );
}
