// app/api/save-draft/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Echo back the payload for now (no server DB persistence yet)
    const json = await req.json();
    return NextResponse.json({ ok: true, received: json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Invalid JSON" }, { status: 400 });
  }
}
