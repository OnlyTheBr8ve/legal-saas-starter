export function buildEmploymentPrompt(userPrompt: string, sectorClauses?: string) {
  return `
You are a senior employment lawyer. Draft a UK-compliant, plain-English **employment contract**.

## Output format
- Return **Markdown** only. No preamble.
- Use clear section headings.
- Include a **Schedule of Key Terms** table near the top.

## Drafting rules
- Fill anything missing with **[placeholders]** the user can replace.
- Keep language balanced and SME-friendly.
- Add sector-specific compliance and operational clauses when relevant.
- Add an “Amendments & Variation” clause.

## Inputs
User brief:
${userPrompt.trim()}

${sectorClauses?.trim() ? `Sector considerations:\n${sectorClauses.trim()}` : ""}
`.trim();
}
