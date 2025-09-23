// app/api/generate-contract/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const input = await req.json(); // { role, company, ... } — extend as needed
  const role = (input?.role || "Role").toString();
  const company = (input?.company || "Your Company Ltd").toString();

  // Build your markdown server-side (swap for your real generator)
  const markdown = [
    `# Employment Contract — ${role}`,
    ``,
    `**Employer:** ${company}`,
    `**Employee:** ___________________________`,
    ``,
    `## 1. Start Date`,
    `The employment will commence on ___/___/____.`,
    ``,
    `## 2. Duties`,
    `The Employee will perform duties reasonably associated with the role of ${role}.`,
    ``,
    `## 3. Compensation`,
    `Pay and benefits as agreed.`,
    ``,
    `---`,
    `_Generated via ClauseCraft API_`,
  ].join("\n");

  return NextResponse.json({ markdown });
}
