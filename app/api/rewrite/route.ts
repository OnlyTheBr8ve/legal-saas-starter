import { NextRequest } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { excerpt, context, jurisdiction } = await req.json();

  if (!excerpt || typeof excerpt !== "string") {
    return new Response("Missing excerpt", { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response("Server missing OPENAI_API_KEY.", { status: 500 });

  const sys = `Rewrite the excerpt into plain-English, SME-friendly language.
- Do NOT add commentary or explanations—output the rewritten clause ONLY.
- Keep meaning intact. Jurisdiction: ${jurisdiction || "unspecified"}.
- If the user appears to ask for statutory specifics, insert [TODO: legal review].`;

  const user = `Context (surrounding text):
${context || "(none)"}

Excerpt to rewrite:
${excerpt}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      temperature: 0.2,
      max_tokens: 500
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    return new Response("OpenAI error: " + t, { status: 500 });
  }

  const j = await resp.json();
  const text = j?.choices?.[0]?.message?.content || "";
  return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
