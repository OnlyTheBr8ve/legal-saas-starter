import { NextRequest, NextResponse } from "next/server";
import { buildEmploymentPrompt } from "@/lib/prompt-templates";

export const runtime = "edge";

async function callModel(prompt: string) {
  // Minimal mock: replace with your actual model call (OpenAI/Fireworks/etc.)
  // Must return pure Markdown.
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Model error: ${res.status} ${err}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, sectorClauses } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }
    const composed = buildEmploymentPrompt(prompt, sectorClauses);
    const text = await callModel(composed);
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
