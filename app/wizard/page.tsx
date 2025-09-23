// app/wizard/page.tsx
"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  SECTORS,
  SECTOR_QUESTIONS,
  type SectorKey,
} from "@/lib/sector-config";

/**
 * Important: Avoid prerender and any cache weirdness.
 * - dynamic: force runtime render
 * - revalidate: false (must be boolean or a positive number)
 */
export const dynamic = "force-dynamic";
export const revalidate = false;

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10">Loading…</div>}>
      <WizardInner />
    </Suspense>
  );
}

function WizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefillRole = searchParams.get("role") ?? "";
  const prefillSector = (searchParams.get("sector") as SectorKey | null) ?? "general";

  const [sector, setSector] = useState<SectorKey>(prefillSector);
  const [roleTitle, setRoleTitle] = useState<string>(prefillRole);
  const [location, setLocation] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<"employee" | "worker" | "contractor">("employee");
  const [notes, setNotes] = useState<string>("");

  const sectorQuestions = SECTOR_QUESTIONS[sector] ?? [];
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) =>
    setChecks((c) => ({ ...c, [key]: !c[key] }));

  const chosenChecks = useMemo(
    () => sectorQuestions.filter((q) => checks[q.key]).map((q) => q.label),
    [checks, sectorQuestions]
  );

  function buildPrompt() {
    const lines: string[] = [];
    lines.push(`Create a UK-compliant ${employmentType} contract.`);
    if (roleTitle) lines.push(`Role title: ${roleTitle}.`);
    if (sector) lines.push(`Sector: ${sector}.`);
    if (location) lines.push(`Location: ${location}.`);
    if (hours) lines.push(`Hours: ${hours}.`);
    if (salary) lines.push(`Pay/Salary: ${salary}.`);

    if (chosenChecks.length) {
      lines.push(`Include sector-specific clauses for: ${chosenChecks.join(", ")}.`);
    }

    if (notes.trim()) {
      lines.push(`Additional instructions: ${notes.trim()}`);
    }

    lines.push(
      "Format with clear section headings, numbered clauses, and bullet points where helpful. Start with Parties, Role & Duties, Place of Work, Hours, Pay, Benefits, Holiday, Probation (if applicable), Training/Qualifications, Confidentiality & IP, Health & Safety, Equality & Conduct, Data Protection, Termination, Notice, Post-termination (if applicable). Use plain English suitable for UK SMEs."
    );

    return lines.join("\n");
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const prompt = buildPrompt();
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Smart Contract Wizard</h1>
        <p className="text-white/70">
          Tell us the role and sector, tick any relevant requirements, and
          we’ll prefill a high-quality contract draft on your dashboard.
        </p>
      </header>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as SectorKey)}
            className="w-full rounded-md bg-black/30 border border-white/10 p-3"
          >
            {SECTORS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Role title</label>
            <input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Bar Supervisor, Site Labourer"
              className="w-full rounded-md bg-black/30 border border-white/10 p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Employment type</label>
            <select
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(e.target.value as "employee" | "worker" | "contractor")
              }
              className="w-full rounded-md bg-black/30 border border-white/10 p-3"
            >
              <option value="employee">Employee</option>
              <option value="worker">Worker</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, hybrid"
              className="w-full rounded-md bg-black/30 border border-white/10 p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Hours</label>
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 37.5/week, rota"
              className="w-full rounded-md bg-black/30 border border-white/10 p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Pay / Salary</label>
            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. £28,000 + tips"
              className="w-full rounded-md bg-black/30 border border-white/10 p-3"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Sector prompts</label>
            <span className="text-xs text-white/50">
              Shown for: <strong className="text-white/80">{sector}</strong>
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {sectorQuestions.map((q) => (
              <label
                key={q.key}
                className="flex items-center gap-2 rounded-md bg-black/20 border border-white/10 p-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!checks[q.key]}
                  onChange={() => toggleCheck(q.key)}
                />
                <span>{q.label}</span>
              </label>
            ))}
            {!sectorQuestions.length && (
              <p className="text-white/60">No extra prompts for this sector.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Anything else?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="e.g. 6-month probation, uniform provided, on-call rota, confidentiality around recipes, etc."
            className="w-full rounded-md bg-black/30 border border-white/10 p-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-white text-black px-5 py-3 font-semibold hover:bg-white/90"
          >
            Generate in Dashboard
          </button>
          <Link
            href="/templates"
            className="text-white/80 hover:text-white underline underline-offset-4"
          >
            Browse templates
          </Link>
        </div>
      </form>
    </main>
  );
}
