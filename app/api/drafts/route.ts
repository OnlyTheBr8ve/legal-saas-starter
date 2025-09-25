// app/api/drafts/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

// GET /api/drafts  — list (you can trim/expand as you like)
export async function GET() {
  const supabase = createServerSupabase();

  const { data, error } = await (supabase as any)
    .from("drafts")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ drafts: data ?? [] });
}

// POST /api/drafts  — create
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<{
    title: string;
    content: string;
    sector: string | null;
  }>;

  // basic normalization
  const title = (body.title ?? "Untitled").slice(0, 200);
  const content = body.content ?? "";
  const sector = (body.sector ?? null) as string | null;

  const supabase = createServerSupabase();

  // IMPORTANT: cast client to `any` to avoid TS inferring `never` without generated DB types
  const { data, error } = await (supabase as any)
    .from("drafts")
    .insert([{ title, content, sector }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ draft: data }, { status: 201 });
}

// (Optional) preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
