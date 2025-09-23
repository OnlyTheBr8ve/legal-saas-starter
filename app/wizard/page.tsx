"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SECTORS,
  SECTOR_QUESTIONS,
  type SectorKey,
} from "@/lib/sector-config";

// Ensure this is a client-only page (no revalidate / no SSR issues)
export default function WizardPage() {
  const search = useSearchParams();

  // Basic form state
  const [sector, setSector] = useState<SectorKey | "">(
    (search.get("sector") as SectorKey) || ""
  );
  const [roleTitle, setRoleTitle] = useState(search.get("role") || "");
  const [companyName, setCompanyName] = useState(search.get("company") || "");
  const [location, setLocation] = useState(search.get("location") || "");
  const [extraNotes, setExtraNotes] = useState(search.get("notes") || "");

  // Dynamic, sector-specific answers bucket
  const sectorQuestions = sector ? SECTOR_QUESTIONS[sector] ?? [] : [];
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  // Compose the final prompt the Dashboard will receive
  const composedPrompt = useMemo(() => {
    const lines: string[] = [];

    if (companyName) lines.push(`Company: ${companyName}`);
    if (roleTitle) lines.push(`Role: ${roleTitle}`);
    if (location) lines.push(`Location: ${location}`);
    if (sector) lines.push(`Sector: ${SECTORS[sector].label}`);

    if (sectorQuestions.length > 0) {
      lines.push("", "## Sector-specific considerations");
      for (const q of sectorQuestions) {
        const val = answers[q.key];
        if (val && val.trim()) {
          lines.push(`- ${q.label}: ${val.trim()}`);
        }
      }
    }

    if (extraNotes && extraNotes.trim()) {
      lines.push("", "## Extra notes", extraNotes.trim());
    }

    lines.push(
      "",
      "## Task",
      "Draft a contract/letter/policy tailored to the above. Use plain English, flag any assumptions you make, and suggest any missing inputs I should confirm."
    );

    return lines.join("\n");
  }, [companyName, roleTitle, location, sector, sectorQuestions, answers, extraNotes]);

  const dashHref = `/dashboard?prompt=${encodeURIComponent(composedPrompt)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Contract Wizard</h1>
          <p className="text-sm text-white/60">
            Answer a few targeted questions and send the context straight into your Dashboard.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(composedPrompt);
            }}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Copy prompt
          </button>

          <Link
            href={dashHref}
            className="rounded-md border border-white/15 bg-white px-3 py-2 text-sm text-black hover:opacity-90"
          >
            Use in Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <section className="rounded-lg border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold">Your context</h2>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm mb-1">Sector</label>
              <select
                className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                value={sector}
                onChange={(e) => {
                  setSector(e.target.value as SectorKey | "");
                  setAnswers({});
                }}
              >
                <option value="">Select a sector…</option>
                {Object.entries(SECTORS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Role / Title</label>
                <input
                  className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Bar Supervisor / Family Solicitor"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Company</label>
                <input
                  className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company or trading name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Location</label>
              <input
                className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jurisdiction or work location"
              />
            </div>

            {sector && sectorQuestions.length > 0 && (
              <div className="pt-2">
                <h3 className="font-semibold mb-2 text-sm">
                  Sector-specific questions
                </h3>
                <div className="space-y-3">
                  {sectorQuestions.map((q) => (
                    <div key={q.key}>
                      <label className="block text-sm mb-1">{q.label}</label>
                      {q.type === "select" ? (
                        <select
                          className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                          value={answers[q.key] ?? ""}
                          onChange={(e) => setAnswer(q.key, e.target.value)}
                        >
                          <option value="">Select…</option>
                          {(q.options ?? []).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="w-full rounded-md bg-black/20 border border-white/15 px-3 py-2"
                          value={answers[q.key] ?? ""}
                          onChange={(e) => setAnswer(q.key, e.target.value)}
                          placeholder={q.placeholder ?? ""}
                        />
                      )}
                      {q.hint && (
                        <p className="text-xs text-white/50 mt-1">{q.hint}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Extra notes (optional)</label>
              <textarea
                className="w-full min-h-[120px] rounded-md bg-black/20 border border-white/15 px-3 py-2"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Anything unusual? Add specific instructions here."
              />
            </div>
          </div>
        </section>

        {/* RIGHT: Composed prompt preview */}
        <section className="rounded-lg border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Composed prompt</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(composedPrompt)}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Copy
              </button>
              <Link
                href={dashHref}
                className="rounded-md border border-white/15 bg-white px-3 py-2 text-sm text-black hover:opacity-90"
              >
                Use in Dashboard
              </Link>
            </div>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm leading-6">
              {composedPrompt}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}

