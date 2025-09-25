// app/api/drafts/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import type { DraftRow } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/drafts/:id  -> fetch one draft
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("drafts" as any) // keep typing simple until you add generated types
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data as DraftRow);
}

// PATCH /api/drafts/:id  -> update one draft (partial)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const update: Partial<DraftRow> = {};

  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.content === "string") update.content = body.content;
  if (typeof body.sector === "string" || body.sector === null)
    update.sector = body.sector;

  update.updated_at = new Date().toISOString();

  const supabase = createServerSupabase();

  const { data, error } = await (supabase as any)
    .from("drafts")
    .update(update as any)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data as DraftRow);
}

// DELETE /api/drafts/:id -> delete one draft
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabase();

  const { error } = await (supabase as any)
    .from("drafts")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
