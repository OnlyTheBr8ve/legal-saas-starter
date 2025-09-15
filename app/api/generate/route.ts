// app/api/generate/route.ts
import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type GenPayload = {
  template?: string;
  variables?: string | Record<string, any>;
  instructions?: string;
  jurisdiction?: string;
};

function safeJSON(input: unknown): Record<string, any> {
  if (typeof input === "string") {
    try { return JSON.parse(input); } catch { return {}; }
  }
  if (input && typeof input === "object") return input as Record<string, any>;
  return {};
}

function interpolate(tpl: string, data: Record<string, any>) {
  return (tpl || "").replace(/{{\s*([\w.-]+)\s*}}/g, (_m, k) =>
    data && data[k] !== undefined ? String(data[k]) : `{{${k}}}`
  );
}

// Lazy init Supabase only when envs exist
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  let body: GenPayload;
  try { body = await req.json(); } catch { return new Response("Bad JSON body", { status: 400 }); }
  const { template = "", variables = "{}", instructions = "", jurisdiction = "" } = body;

  const vars = safeJSON(variables);
  const filled = interpolate(template, vars);

  const supabase = getSupabase();

  // --- Rate limit: 3/day/IP ---
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const today = new Date().toISOString().slice(0, 10);
  if (supabase) {
    const { data: rl } = await supabase.from("rate_limits").select("count").eq("ip", ip).eq("day", today).maybeSingle();
    if ((rl?.count ?? 0) >= 3) {
      return new Response("Daily free limit reached. Try again tomorrow or upgrade to Pro.", { status: 429 });
    }
    await supabase.from("rate_limits").upsert({ ip, day: today, count: (rl?.count ?? 0) + 1 }).select();
  }

  // --- Cache lookup ---
  const payloadForHash = JSON.stringify({ filled, instructions, jurisdiction, model: "gpt-4o-mini" });
  const hash = crypto.createHash("sha256").update(payloadForHash).digest("hex");

  if (supabase) {
    const { data: cached } = await supabase.from("cache_entries").select("result").eq("hash", hash).maybeSingle();
    if (cached?.result) {
      return new Response(cached.result, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Cache": "HIT" } });
    }
  }

  const sys = `You are a legal-document drafting assistant.
- You do NOT provide legal advice.
- Output the final document text ONLY (no explanations).
- Use plain-English, SME-friendly phrasing.
- Jurisdiction: ${jurisdiction || "unspecified"}.
- Do not cite or invent statutes. If a specific statute is requested, insert [TODO: legal review] without naming a statute.`;

  const user = `Base document (already filled with variables):

${filled}

Instructions:
${instructions || ""}

If any {{placeholders}} remain, replace or clearly mark them. Output only the final document.`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response("Server missing OPENAI_API_KEY.", { status: 500 });

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      temperature: 0.2,
      max_tokens: 1600
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    try {
      const j = JSON.parse(txt);
      if (j?.error?.code === "insufficient_quota") {
        return new Response("OpenAI quota exceeded for this API key. Add credits and retry.", { status: 402 });
      }
      if (j?.error?.message) return new Response(`OpenAI error: ${j.error.message}`, { status: 500 });
    } catch {}
    return new Response("OpenAI error: " + txt, { status: 500 });
  }

  const data = await resp.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "No content generated.";

  if (supabase && text) {
    await supabase.from("cache_entries").upsert({ hash, result: text }).select();
  }

  return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Cache": "MISS" } });
}
