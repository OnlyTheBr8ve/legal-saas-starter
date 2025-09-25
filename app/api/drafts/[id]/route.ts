// app/api/drafts/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase, type DraftRow } from "@/lib/supabase";

export const runtime = "nodejs";

// GET /api/drafts/:id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({ draft: data as DraftRow });
}

// PATCH /api/drafts/:id
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = (await req.json().catch(() => ({}))) as Partial<{
    title: string;
    content: string;
    sector: string | null;
  }>;

  const update: Partial<DraftRow> = {};
  if (typeof body.title === "string") update.title = body.title.slice(0, 200);
  if (typeof body.content === "string") update.content = body.content;
  if (body.sector === null) update.sector = null;
  if (typeof body.sector === "string") update.sector = body.sector;
  update.updated_at = new Date().toISOString();

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("drafts")
    // IMPORTANT: avoid strict generic typing here until we add generated types
    .update(update as any)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ draft: data as DraftRow });
}

// DELETE /api/drafts/:id
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("drafts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
