"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// These should exist in your repo. We also add safe fallbacks if missing.
import type { SectorKey } from "@/lib/sector-config";
import {
  SECTORS as EXPORTED_SECTORS,
  SECTOR_QUESTIONS as EXPORTED_QUESTIONS,
} from "@/lib/sector-config";

// ------- Safe fallbacks (in case names differ or file is empty) -------
const FALLBACK_SECTORS: { key: string; label: string }[] = [
  { key: "construction", label: "Construction" },
  { key: "hospitality", label: "Hospitality" },
  { key: "healthcare", label: "Healthcare" },
  { key: "retail", label: "Retail" },
  { key: "it_software", label: "IT / Software" },
];

const FALLBACK_QUESTIONS: Record<
  string,
  Array<
    | { id: string; label: string; type: "boolean" }
    | { id: string; label: string; type: "text"; placeholder?: string }
    | { id: string; label: string; type: "select"; options: string[] }
  >
> = {
  construction: [
    { id: "cscs_required", label: "Does the role require a CSCS card?", type: "boolean" },
    { id: "tools_provided", label: "Are tools/PPE provided by employer?", type: "boolean" },
    { id: "site_induction", label: "Site induction notes", type: "text", placeholder: "Any site-specific instructions…" },
  ],
  hospitality: [
    { id: "personal_license", label: "Is a Personal Licence required (alcohol)?", type: "boolean" },
    { id: "food_safety_level", label: "Required food safety certificate", type: "select", options: ["None", "Level 1", "Level 2", "Level 3"] },
    { id: "tips_policy", label: "Tips/gratuities policy summary", type: "text", placeholder: "How tips/service charge are distributed…" },
  ],
  healthcare: [
    { id: "dbs_required", label: "Enhanced DBS required?", type: "boolean" },
    { id: "registration_body", label: "Professional registration (e.g., NMC/HCPC)", type: "text", placeholder: "NMC / HCPC / GMC…" },
  ],
  retail: [
    { id: "till_authority", label: "Cash handling/till authority?", type: "boolean" },
    { id: "uniform_provided", label: "Uniform provided?", type: "boolean" },
  ],
  it_software: [
    { id: "probation_code_review", label: "Code review standard during probation?", type: "text", placeholder: "e.g., PR approvals required…" },
    { id: "oncall", label: "On-call participation?", type: "boolean" },
  ],
};

// Try to use exports; otherwise fall back.
const SECTORS =
  (Array.isArray((EXPORTED_SECTORS as any)) &&
    (EXPORTED_SECTORS as any).map((s: any) =>
      typeof s === "string" ? { key: s, label: s } : s
    )) ||
  FALLBACK_SECTORS;

const SECTOR_QUESTIONS =
  (EXPORTED_QUESTIONS as any) || FALLBACK_QUESTIONS;

// ---------------------- Wizard state types ----------------------
type Flags = Record<string, boolean | string>;

type WizardState = {
  sector: string;
  role: string;
  seniority: string;
  flags: Flags;
  extra: string; // user free-text
};

// ---------------------- Helpers ----------------------
function toTitle(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildSmartPrompt({ sector, role, seniority, flags, extra }: WizardState) {
  const bullets: string[] = [];
  if (sector) bullets.push(`Sector: ${toTitle(sector)}`);
  if (role) bullets.push(`Role: ${role}`);
  if (seniority) bullets.push(`Seniority: ${toTitle(seniority)}`);

  Object.entries(flags || {}).forEach(([k, v]) => {
    const label = toTitle(k);
    if (v === true) bullets.push(`${label}: required`);
    else if (v === false) bullets.push(`${label}: not required`);
    else if (typeof v === "string" && v.trim()) bullets.push(`${label}: ${v}`);
  });

  const extraPart = extra?.trim()
    ? `\n\nAdditional specifics from the employer:\n${extra}`
    : "";

  return `Draft an SME-friendly, UK-compliant employment agreement.

Reflect the following specifics:
${bullets.map((b) => `- ${b}`).join("\n")}${extraPart}

Write concise, plain English clauses. Include sector-critical conditions (e.g., licenses, registrations, DBS/CSCS, safeguarding). If the licence/registration is lost, add a performance review or role reassignment clause. Use headings, lists, and clear definitions.`;
}

function scaffoldMarkdownFromPrompt(finalPrompt: string) {
  return `# Employment Agreement (Draft)

*Generated from the following brief:*

> ${finalPrompt.replace(/\n/g, "\n> ")}

---

## Parties
- Employer: **[Insert legal name]**
- Employee: **[Insert employee name]**

## Role & Scope
Describe the core duties, KPIs, and reporting lines.

## Sector-critical Conditions
List required licences/registrations. State consequences if lost or not maintained.

## Pay & Hours
- Pay: **[Insert]**
- Hours: **[Insert]**
- Overtime/On-call (if applicable): **[Insert]**

## Benefits & Leave
Summarise entitlement to benefits and leave.

## Conduct, Confidentiality & IP
Standard conduct; confidentiality; IP assignment if relevant.

## Probation & Performance
Length of probation; performance review cadence; remediation steps.

## Termination
Notice periods and grounds (misconduct, breach, loss of mandatory credentials).

---

*This is a generated working draft. Obtain legal advice before signing.*`;
}

// Persist to URL without reload
function writeUrlParams(state: WizardState) {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  if (state.sector) params.set("sector", state.sector);
  else params.delete("sector");
  if (state.role) params.set("role", state.role);
  else params.delete("role");
  if (state.seniority) params.set("seniority", state.seniority);
  else params.delete("seniority");
  // We don’t dump flags into URL (can get long); feel free to add selected short ones.
  history.replaceState(null, "", `?${params.toString()}`);
}

// ---------------------- Component ----------------------
export default function WizardClient() {
  const router = useRouter();
  const search = useSearchParams();

  // Hydrate initial state from URL -> localStorage (in that order)
  const initialState: WizardState = useMemo(() => {
    const urlState: Partial<WizardState> = {
      sector: search.get("sector") || "",
      role: search.get("role") || "",
      seniority: search.get("seniority") || "",
    };
    // localStorage fallback
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("wizardState");
      if (raw) {
        try {
          const saved = JSON.parse(raw) as WizardState;
          // URL overrides saved
          return {
            sector: urlState.sector || saved.sector || "",
            role: urlState.role || saved.role || "",
            seniority: urlState.seniority || saved.seniority || "",
            flags: saved.flags || {},
            extra: saved.extra || "",
          };
        } catch {}
      }
    }
    return {
      sector: urlState.sector || "",
      role: urlState.role || "",
      seniority: urlState.seniority || "",
      flags: {},
      extra: "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const [state, setState] = useState<WizardState>(initialState);

  // Keep URL + localStorage in sync whenever state changes
  useEffect(() => {
    writeUrlParams(state);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wizardState", JSON.stringify(state));
    }
  }, [state]);

  const sectorQuestions = SECTOR_QUESTIONS[state.sector] || [];

  // Handlers
  const updateFlag = (id: string, value: boolean | string) =>
    setState((s) => ({ ...s, flags: { ...s.flags, [id]: value } }));

  const onGenerate = () => {
    const finalPrompt = buildSmartPrompt(state);
    const markdown = scaffoldMarkdownFromPrompt(finalPrompt);

    // Persist for the Dashboard page to pick up
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastContractMarkdown", markdown);
    }

    router.push(`/dashboard?prompt=${encodeURIComponent(state.role || state.sector || "contract")}`);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Contract Wizard</h1>
        <p className="text-white/70">
          Answer a few questions. We’ll think for you and draft a sector-aware contract.
        </p>
      </header>

      {/* Core fields */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70">Sector</label>
          <select
            className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
            value={state.sector}
            onChange={(e) =>
              setState((s) => ({ ...s, sector: e.target.value }))
            }
          >
            <option value="">Select…</option>
            {SECTORS.map((s: any) => (
              <option key={s.key} value={s.key}>
                {s.label || toTitle(s.key)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Role</label>
          <input
            className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
            placeholder="e.g., Bar Manager, Family Solicitor, Site Supervisor"
            value={state.role}
            onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Seniority</label>
          <select
            className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
            value={state.seniority}
            onChange={(e) =>
              setState((s) => ({ ...s, seniority: e.target.value }))
            }
          >
            <option value="">Select…</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </section>

      {/* Sector-smart prompts */}
      <section className="space-y-3">
        <h2 className="font-semibold">Sector-specific considerations</h2>
        {sectorQuestions.length === 0 ? (
          <p className="text-sm text-white/60">
            Pick a sector to see relevant prompts (licenses, cards, safeguarding, etc.).
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sectorQuestions.map((q: any) => {
              if (q.type === "boolean") {
                return (
                  <label
                    key={q.id}
                    className="flex items-center gap-2 rounded-md bg-black/30 border border-white/15 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      className="accent-white"
                      checked={Boolean(state.flags[q.id])}
                      onChange={(e) => updateFlag(q.id, e.target.checked)}
                    />
                    <span>{q.label}</span>
                  </label>
                );
              }
              if (q.type === "select") {
                return (
                  <div key={q.id} className="space-y-1">
                    <label className="text-sm text-white/70">{q.label}</label>
                    <select
                      className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
                      value={(state.flags[q.id] as string) || ""}
                      onChange={(e) => updateFlag(q.id, e.target.value)}
                    >
                      <option value="">Select…</option>
                      {q.options?.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              // text
              return (
                <div key={q.id} className="space-y-1">
                  <label className="text-sm text-white/70">{q.label}</label>
                  <input
                    className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
                    placeholder={q.placeholder || ""}
                    value={(state.flags[q.id] as string) || ""}
                    onChange={(e) => updateFlag(q.id, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Extra free text */}
      <section className="space-y-2">
        <label className="text-sm text-white/70">
          Anything else we should account for?
        </label>
        <textarea
          rows={5}
          className="w-full rounded-md bg-black/30 border border-white/15 px-3 py-2"
          placeholder="KPIs, rota expectations, commission plan, uniform deductions, data handling, overtime rules, etc."
          value={state.extra}
          onChange={(e) => setState((s) => ({ ...s, extra: e.target.value }))}
        />
      </section>

      {/* Actions */}
      <section className="flex items-center gap-3">
        <button
          onClick={onGenerate}
          className="rounded-lg border border-white/15 px-4 py-2 font-medium hover:bg-white/5"
        >
          Generate Contract
        </button>
        <Link
          href="/templates"
          className="text-sm text-white/70 hover:text-white/90 underline underline-offset-4"
        >
          Browse templates
        </Link>
      </section>
    </main>
  );
}
