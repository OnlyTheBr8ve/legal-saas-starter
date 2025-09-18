import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b1020",
          color: "white",
          padding: 64,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        ClauseCraft
      </div>
    ),
    { ...size }
  );
}
