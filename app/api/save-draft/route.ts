// app/api/save-draft/route.ts
import { NextResponse } from "next/server";
import { saveDraft } from "@/lib/save-draft";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expecting: { title: string; content: string; prompt?: string; templateSlug?: string; sector?: string }
    const { title, content, prompt, templateSlug, sector } = body || {};

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "Missing title or content" }, { status: 400 });
    }

    const id = await saveDraft({
      title,
      output: content,
      prompt: prompt ?? "",
      templateSlug: templateSlug ?? "",
      sector: sector ?? "",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("save-draft error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
