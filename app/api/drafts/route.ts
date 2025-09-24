// app/api/drafts/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase, type DraftRow } from "@/lib/supabase";

export const runtime = "nodejs";

// GET /api/drafts  -> list latest 50
export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ drafts: (data || []) as DraftRow[] });
}

// POST /api/drafts  -> create
// Body: { title?: string, content: string, sector?: string }
export async function POST(req: Request) {
  const payload = (await req.json().catch(() => ({}))) as Partial<DraftRow> & {
    content?: string;
    title?: string;
    sector?: string | null;
  };

  const title = (payload.title ?? "Untitled").toString().slice(0, 200);
  const content = (payload.content ?? "").toString();
  const sector =
    payload.sector === undefined || payload.sector === null
      ? null
      : String(payload.sector);

  if (!content.trim()) {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("drafts")
    .insert([{ title, content, sector }])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ draft: data as DraftRow }, { status: 201 });
}
