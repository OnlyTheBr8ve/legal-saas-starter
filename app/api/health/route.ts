// app/api/health/route.ts
import { NextResponse, NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

  return NextResponse.json({
    ok: true,
    service: "ClauseCraft",
    time: new Date().toISOString(),
    url: url.origin,
    vercel: {
      env: process.env.VERCEL_ENV || "unknown",
      region: process.env.VERCEL_REGION || "unknown",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    },
    client: { ip },
  });
}
