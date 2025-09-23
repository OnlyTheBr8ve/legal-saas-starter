// app/api/list-drafts/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // No server store configured — return empty result so UI still works with local storage
    return NextResponse.json([], { status: 200 });
  }

  try {
    // Lazy import to avoid build error if dep is missing
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("drafts")
      .select("id, title, content, prompt, sector, template_slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const payload = (data || []).map((r) => ({
      id: r.id,
      title: r.title || "Untitled draft",
      content: r.content || "",
      prompt: r.prompt || "",
      sector: r.sector || "",
      templateSlug: r.template_slug || "",
      updatedAt: r.updated_at || new Date().toISOString(),
      source: "server" as const,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    // Fail soft — the UI will still show local drafts
    return NextResponse.json([], { status: 200 });
  }
}
