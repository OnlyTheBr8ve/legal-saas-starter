"use client";

import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SECTORS, getSectorLabel } from "@/lib/sector-config";
import { TEMPLATE_QUESTIONS, type WizardField } from "@/lib/wizard-questions";

/** What the <select> expects */
type SectorOption = { value: string; label: string };

/** Cosmetic title-casing for headings/labels */
function toTitleCase(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Normalize SECTORS (array or map) into [{value,label}] */
function normalizeSectors(input: unknown): SectorOption[] {
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length === 0) return [];
    const first = arr[0];
    // Already shaped [{ value, label }]
    if (first && typeof first === "object" && "value" in first && "label" in first) {
      return arr as SectorOption[];
    }
    // String[] -> map into { value, label }
    if (typeof first === "string") {
      return (arr as string[]).map((v) => ({ value: v, label: toTitleCase(v) }));
    }
  }
  // Record<string,string> -> entries to {value,label}
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, string>);
    return entries.map(([value, label]) => ({
      value,
      label: label ?? toTitleCase(value),
    }));
  }
  return [];
}

/** Assemble the drafting brief/prompt preview */
function buildPrompt(templateSlug: string, sector: string, answers: Record<string, string>) {
  const heading = `Draft: ${toTitleCase(templateSlug.replace(/-/g, " "))}`;
  const lines: string[] = [];
  lines.push(`# ${heading}`);
  lines.push(`Sector: ${getSectorLabel(sector) || sector || "general"}`);
  lines.push("");
  lines.push("## Context / Inputs");
  for (const [k, v] of Object.entries(answers)) {
    if (v?.trim()) lines.push(`- **${toTitleCase(k)}:** ${v.trim()}`);
  }
  lines.push("");
  lines.push("## Instructions");
  lines.push(
    "Use the above to produce a compliant, plain-English first draft. Where information is missing, add TODO placeholders. Keep formatting clean with headings and bullet lists."
  );
  return lines.join("\n");
}

export default function WizardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** 1) Template slug comes from ?type= (how Templates page links here) */
  const templateSlug = (searchParams.get("type") || "cookies-policy").trim();

  /** 2) Sector options + initial value from URL (or first option) */
  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);
  const firstOptionValue = sectorOptions[0]?.value || "general";

  // If URL has a sector, honor it *only if* it exists in our options; otherwise fall back.
  const urlSector = searchParams.get("sector") || "";
  const urlSectorValid = sectorOptions.some((o) => o.value === urlSector);
  const initialSector = urlSectorValid ? urlSector : firstOptionValue;

  const [sector, setSector] = useState<string>(initialSector);

  // Keep URL synced with current sector (initially and on change)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!urlSectorValid || urlSector !== initialSector) {
      params.set("sector", initialSector);
      router.replace(`${pathname}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSector]); // run when firstOptionValue/SECTORS snapshot gives us initialSector

  const updateUrl = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value.length > 0) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSector(val);
    updateUrl("sector", val);
  };

  /** 3) Dynamic questions for the chosen template */
  const fields: WizardField[] = useMemo(() => {
    return TEMPLATE_QUESTIONS[templateSlug] ?? [];
  }, [templateSlug]);

  /** 4) Collect answers */
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const setAnswer = (name: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [name]: value }));

  /** 5) Live prompt preview */
  const prompt = useMemo(() => buildPrompt(templateSlug, sector, answers), [templateSlug, sector, answers]);

  /** 6) Hand-off to Dashboard with prompt + sector in query */
  const gotoDashboardWithPrompt = () => {
    const url = `/dashboard?prompt=${encodeURIComponent(prompt)}&sector=${encodeURIComponent(sector)}`;
    router.push(url);
  };

  return (
    <main className="p-6 space-y-8">
      {/* Heading */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Document Wizard</h1>
        <p className="text-sm text-zinc-500">
          You chose:&nbsp;
          <span className="font-medium">{toTitleCase(templateSlug.replace(/-/g, " "))}</span>. Fill in the details
          and we’ll assemble a clean drafting brief.
        </p>
      </header>

      {/* Sector selector */}
      <section className="space-y-2">
        <label htmlFor="wiz-sector" className="block text-sm font-medium">
          Sector
        </label>

        <select
          id="wiz-sector"
          value={sector}
          onChange={onSectorChange}
          className="w-full sm:w-80 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {sectorOptions.length === 0 ? (
            <option value="general">General</option>
          ) : (
            sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>

        <p className="text-xs text-zinc-500">
          Selected:&nbsp;
          <span className="text-zinc-700">
            {getSectorLabel(sector) || sector || "general"}
          </span>
          . This is also reflected in the URL.
        </p>
      </section>

      {/* Dynamic form */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Questions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.length === 0 && (
            <div className="sm:col-span-2 text-sm text-zinc-500">
              No predefined questions for this template yet. You can still proceed.
            </div>
          )}

          {fields.map((f) => {
            const value = answers[f.name] ?? "";
            const common = "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400";

            return (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>

                {f.type === "text" && (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setAnswer(f.name, e.target.value)}
                    placeholder={"placeholder" in f ? f.placeholder : undefined}
                    className={common}
                  />
                )}

                {f.type === "number" && (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setAnswer(f.name, e.target.value)}
                    placeholder={"placeholder" in f ? f.placeholder : undefined}
                    className={common}
                  />
                )}

                {f.type === "date" && (
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => setAnswer(f.name, e.target.value)}
                    className={common}
                  />
                )}

                {f.type === "textarea" && (
                  <textarea
                    value={value}
                    onChange={(e) => setAnswer(f.name, e.target.value)}
                    placeholder={"placeholder" in f ? f.placeholder : undefined}
                    className="min-h-[120px] w-full rounded-md border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                )}

                {f.type === "select" && (
                  <select
                    value={value}
                    onChange={(e) => setAnswer(f.name, e.target.value)}
                    className={common}
                  >
                    <option value="">Select…</option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Preview + action */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Preview of drafting brief</h2>
        <textarea
          readOnly
          value={prompt}
          className="min-h-[240px] w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm font-mono outline-none"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={gotoDashboardWithPrompt}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Use this in Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}
