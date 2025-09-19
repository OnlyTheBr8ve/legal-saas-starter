// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_TOKEN;

const SYSTEM_FULL_DRAFT = `
You are ClauseCraft AI, a contracts assistant.
If the user does NOT supply a full base document, you must DRAFT a complete, professional,
jurisdiction-aware contract yourself from scratch using their details.

Style:
- Clear headings, numbered clauses, and definitions section.
- Concise, plain English where possible.
- Include typical employment terms: Parties, Role & Duties, Place of Work (incl. remote/onsite),
  Hours & Working Time/Overtime, Pay & Deductions, Probation, Holidays, Benefits, Equipment,
  Confidentiality, IP Assignment (if applicable), Data Protection, Conduct/Policies, Health & Safety,
  Termination & Notice, Post-termination restrictions (if justified), Governing Law, Signatures.
- Include any sector-specific compliance/requirements given (e.g., licenses, PPE, permits).
- Where information is missing, use square-bracket placeholders like [Job Title] / [Salary] rather than asking questions.

Output:
- Markdown. No prefaces. Start with the document title.
- Include a short “Schedule A: Key Terms” table capturing core variables (job title, pay, hours, location, start date).
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, sectorClauses } = await req.json();

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Build the final user prompt. If sectorClauses exist, append clearly.
    const userPrompt = [
      `USER REQUEST:`,
      prompt.trim(),
      sectorClauses && sectorClauses.trim()
        ? `\nSECTOR-SPECIFIC REQUIREMENTS (must be reflected as enforceable clauses):\n${sectorClauses.trim()}`
        : "",
      `\nPlease draft the full contract as per the instructions.`
    ].join("\n");

    // Call OpenAI (chat completions) via REST to avoid extra deps
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_FULL_DRAFT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `OpenAI error: ${text}` }, { status: 500 });
    }

    const json = await resp.json();
    const text =
      json?.choices?.[0]?.message?.content?.trim() ||
      "Sorry — the generator returned an empty result.";

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
