
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function safeJSON(input: string): Record<string, any> {
  try { return JSON.parse(input); } catch { return {}; }
}

export async function POST(req: NextRequest) {
  const { template, variables, instructions, jurisdiction } = await req.json();
  const vars = safeJSON(variables || "{}");

  const sys = `You are a legal-document drafting assistant. 
- You do NOT provide legal advice.
- You generate plain-language, SME-friendly documents.
- Reflect jurisdiction: ${jurisdiction || "unspecified"}; include only generally applicable terms unless asked for local statutes.
- Do not hallucinate laws; if a specific law is requested, include a bracketed TODO note.
- Include variable substitutions. 
- Output Markdown unless the user asks for another format.
- Add a short version footer: "This document is provided 'as is' without warranties and is not legal advice."`;

  const user = `Template:\n\n${template}\n\nVariables (JSON):\n${JSON.stringify(vars, null, 2)}\n\nInstructions:\n${instructions || ""}`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Server missing OPENAI_API_KEY.", { status: 500 });
  }

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      temperature: 0.3
    })
  });

  if (!resp.ok) {
    const t = await resp.text();
    return new Response("OpenAI error: " + t, { status: 500 });
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "No content";
  return new Response(text, { status: 200 });
}
