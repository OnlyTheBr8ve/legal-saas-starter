// app/api/drafts/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import type { DraftRow } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/drafts -> list drafts (simple)
export async function GET() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("drafts" as any)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json((data ?? []) as DraftRow[]);
}

// POST /api/drafts -> create a draft
export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const body = await req.json().catch(() => ({}));

  const title =
    typeof body.title === "string" && body.title.trim()
      ? (body.title as string)
      : "Untitled";

  const content =
    typeof body.content === "string" ? (body.content as string) : "";

  const sector =
    typeof body.sector === "string" || body.sector === null
      ? (body.sector as string | null)
      : null;

  const now = new Date().toISOString();

  const insertRow = {
    title,
    content,
    sector,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await (supabase as any)
    .from("drafts")
    .insert([insertRow] as any)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data as DraftRow, { status: 201 });
}
