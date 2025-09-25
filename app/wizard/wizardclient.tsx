// app/wizard/WizardClient.tsx
"use client";

import { useMemo, useState } from "react";
import { SECTORS as RAW_SECTORS } from "@/lib/sector-config";

// Normalize sectors like on dashboard
type SectorOption = { value: string; label: string };
function toOptions(input: unknown): SectorOption[] {
  if (Array.isArray(input)) {
    return (input as any[])
      .map((it) =>
        it && typeof it.value === "string" && typeof it.label === "string"
          ? ({ value: it.value, label: it.label } as SectorOption)
          : null
      )
      .filter(Boolean) as SectorOption[];
  }
  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, string>).map(
      ([value, label]) => ({ value, label })
    );
  }
  return [];
}

// A tiny, template-specific question bank.
// Add more slugs over time.
const TEMPLATE_QUESTIONS: Record<
  string,
  { id: string; label: string; placeholder?: string }[]
> = {
  "cookies-policy": [
    { id: "site_name", label: "Website / App name" },
    { id: "site_url", label: "Website URL", placeholder: "https://…" },
    {
      id: "cookies_types",
      label:
        "What cookies do you use? (e.g., strictly necessary, analytics, advertising)",
    },
    {
      id: "third_parties",
      label:
        "Any third-party tools that set cookies? (e.g., Google Analytics, Meta, Hotjar)",
    },
    {
      id: "consent_method",
      label:
        "How do you obtain consent? (e.g., banner, settings, reject all option)",
    },
    {
      id: "retention",
      label: "Typical retention periods (if known)",
    },
    {
      id: "contact",
      label: "Contact for privacy queries (email / address)",
    },
  ],

  // default fallback if slug not found:
  _default: [
    { id: "party_a", label: "Party A (name/entity)" },
    { id: "party_b", label: "Party B (name/entity)" },
    { id: "effective_date", label: "Effective date" },
    { id: "term", label: "Term / duration" },
    { id: "governing_law", label: "Governing law / jurisdiction" },
  ],
};

type Props = {
  templateSlug?: string;
  initialSector?: string;
};

export default function WizardClient({ templateSlug, initialSector }: Props) {
  const sectors = useMemo(() => toOptions(RAW_SECTORS), []);
  const [sector, setSector] = useState<string>(initialSector || "");
  const questions =
    TEMPLATE_QUESTIONS[templateSlug || ""] ?? TEMPLATE_QUESTIONS._default;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Wizard</h1>
      <p className="mt-1 text-zinc-400">
        {templateSlug
          ? `Template: ${templateSlug.replace(/-/g, " ")}`
          : "Generic template"}
      </p>

      {/* Sector selection (now actually sets state) */}
      <section className="mt-6">
        <label className="block text-sm mb-2">Sector</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">— Choose a sector —</option>
          {sectors.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {sector && (
          <p className="mt-2 text-xs text-zinc-400">
            Selected sector: <span className="font-medium">{sector}</span>
          </p>
        )}
      </section>

      {/* Dynamic questions based on template slug */}
      <section className="mt-8 grid gap-4">
        {questions.map((q) => (
          <div key={q.id} className="grid gap-2">
            <label className="text-sm">{q.label}</label>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
              placeholder={q.placeholder || ""}
            />
          </div>
        ))}
      </section>

      <div className="mt-6">
        <button
          type="button"
          className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
          onClick={() =>
            alert(
              "This is the skeleton wizard. Next step is wiring these answers into a draft!"
            )
          }
        >
          Continue
        </button>
      </div>
    </main>
  );
}
