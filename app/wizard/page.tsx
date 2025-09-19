"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SECTOR_CONFIG, type SectorKey } from "@/lib/sector-config";
import { TEMPLATES, type TemplateDef } from "@/lib/templates";

export default function WizardPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Preselect from URL (?type=slug)
  const initialType = sp.get("type") ?? "employment-contract";

  const [sector, setSector] = useState<SectorKey>("general");
  const [roleTitle, setRoleTitle] = useState("");
  const [orgName, setOrgName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("England & Wales");
  const [templateSlug, setTemplateSlug] = useState(initialType);
  const [selectedToggles, setSelectedToggles] = useState<string[]>([]);

  const sectorToggles = SECTOR_CONFIG[sector].toggles;

  const chosenTemplate: TemplateDef | undefined = useMemo(
    () => TEMPLATES.find((t) => t.slug === templateSlug),
    [templateSlug]
  );

  function toggle(id: string) {
    setSelectedToggles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function buildPrompt() {
    const lines: string[] = [];

    lines.push(
      `You are an experienced SME commercial lawyer. Draft a ${chosenTemplate?.title ?? "contract"} tailored to the inputs below.`
    );

    if (orgName) lines.push(`Organisation: ${orgName}`);
    if (roleTitle) lines.push(`Role/Counterparty: ${roleTitle}`);
    lines.push(`Sector: ${SECTOR_CONFIG[sector].name}`);
    lines.push(`Jurisdiction: ${jurisdiction}`);

    const snippets = sectorToggles
      .filter((t) => selectedToggles.includes(t.id))
      .map((t) => `- ${t.clauseSnippet}`);
    if (snippets.length) {
      lines.push(`Sector-specific requirements:\n${snippets.join("\n")}`);
    }

    lines.push(
      [
        "Draft in clear, professional UK English.",
        "Use numbered clauses and subheadings.",
        "Include definitions, term, termination/notice, governing law, dispute resolution, confidentiality, IP, data protection (if relevant), and liability caps.",
        "Add a concise cover summary at the top (3–5 bullets).",
        "End with signature blocks (for both parties) and date lines."
      ].join(" ")
    );

    if (chosenTemplate?.examplePrompt) {
      lines.push(`Reference baseline: ${chosenTemplate.examplePrompt}`);
    }

    return lines.join("\n\n");
  }

  function launch() {
    const prompt = buildPrompt();
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Contract Wizard</h1>
      <p className="text-white/70">
        Choose a template, add sector specifics, and we’ll prefill the dashboard with a
        laser-focused prompt.
      </p>

      {/* Template picker */}
      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <h2 className="font-semibold mb-3">Template type</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TEMPLATES.slice(0, 12).map((t) => (
            <button
              key={t.slug}
              onClick={() => setTemplateSlug(t.slug)}
              className={`text-left rounded-md border px-3 py-2 transition ${
                templateSlug === t.slug
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-white/70 mt-1 line-clamp-2">{t.summary}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Basics */}
      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <h2 className="font-semibold mb-3">Basics</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Sector</label>
            <select
              className="mt-1 w-full rounded-md bg-black/30 border border-white/10 p-2"
              value={sector}
              onChange={(e) => setSector(e.target.value as SectorKey)}
            >
              <option value="general">General</option>
              <option value="hospitality">Hospitality</option>
              <option value="construction">Construction</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Jurisdiction</label>
            <input
              className="mt-1 w-full rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="e.g., England & Wales"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Organisation (optional)</label>
            <input
              className="mt-1 w-full rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="Your company or trading name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Role / Counterparty</label>
            <input
              className="mt-1 w-full rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="e.g., Bar Supervisor, Subcontractor, Consultant"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Sector toggles */}
      <section className="rounded-lg border border-white/10 bg-black/20 p-4">
        <h2 className="font-semibold mb-3">Sector specifics</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {sectorToggles.map((tg) => {
            const checked = selectedToggles.includes(tg.id);
            return (
              <label
                key={tg.id}
                className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${
                  checked
                    ? "border-white/60 bg-white/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => toggle(tg.id)}
                />
                <div>
                  <div className="font-medium">{tg.label}</div>
                  {tg.description && (
                    <div className="text-xs text-white/70">{tg.description}</div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={launch}
          className="rounded-md px-4 py-2 bg-white text-black font-medium hover:opacity-90"
        >
          Prefill Dashboard
        </button>
        <button
          onClick={() => {
            setSelectedToggles([]);
            setRoleTitle("");
            setOrgName("");
          }}
          className="rounded-md px-4 py-2 border border-white/20 hover:border-white/40"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
