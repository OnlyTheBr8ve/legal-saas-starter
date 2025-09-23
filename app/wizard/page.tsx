"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { SECTORS, SECTOR_QUESTIONS, type SectorKey } from "@/lib/sector-config";

type QA = { id: string; label: string; help?: string };

// Helper: robustly resolve a sector label from whatever shape SECTORS uses.
function resolveSectorLabel(sector: string | null | undefined): string {
  if (!sector) return "";
  const list = SECTORS as unknown as Array<Record<string, unknown>>;
  const found = list.find((o) => {
    const key =
      (o.value as string | undefined) ??
      (o.id as string | undefined) ??
      (o.slug as string | undefined);
    return key === sector;
  });
  const label =
    (found?.label as string | undefined) ??
    (found?.name as string | undefined);
  return label ?? sector;
}

export default function WizardPage() {
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [sector, setSector] = useState<SectorKey | "">("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const sectorLabel = useMemo(() => resolveSectorLabel(sector), [sector]);

  // Pull sector-specific questions safely (fallback to empty array)
  const sectorQuestions: QA[] = useMemo(() => {
    const map = (SECTOR_QUESTIONS || {}) as Record<string, QA[] | undefined>;
    return (sector ? map[sector] : undefined) ?? [];
  }, [sector]);

  const onAnswer = useCallback((id: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }, []);

  // Build a single markdown-ish brief (what your generator reads)
  const brief = useMemo(() => {
    const lines: string[] = ["# Role Brief"];
    if (roleTitle) lines.push(`Role: ${roleTitle}`);
    if (location) lines.push(`Location: ${location}`);
    if (sector) lines.push(`Sector: ${sectorLabel}`);

    if (sectorQuestions.length > 0) {
      lines.push("", "## Sector-specific considerations");
      for (const q of sectorQuestions) {
        const a = answers[q.id];
        if (a && a.trim().length > 0) {
          lines.push(`- ${q.label}: ${a.trim()}`);
        }
      }
    }
    return lines.join("\n");
  }, [roleTitle, location, sector, sectorLabel, sectorQuestions, answers]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Contract Wizard</h1>
        <p className="text-white/70">
          Fill the details below. We’ll tailor prompts and clauses to the
          chosen sector automatically.
        </p>
      </header>

      <section className="rounded-md border border-white/10 bg-black/30 p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Role title</label>
            <input
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
              placeholder="e.g., Family Solicitor"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
              placeholder="e.g., London / Remote (UK)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Sector</label>
            <select
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
              value={sector}
              onChange={(e) => setSector(e.target.value as SectorKey | "")}
            >
              <option value="">— Choose a sector —</option>
              {(SECTORS as unknown as Array<Record<string, unknown>>).map(
                (s, i) => {
                  const value =
                    (s.value as string | undefined) ??
                    (s.id as string | undefined) ??
                    (s.slug as string | undefined) ??
                    "";
                  const label =
                    (s.label as string | undefined) ??
                    (s.name as string | undefined) ??
                    value;
                  return (
                    <option key={`${value || i}`} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </select>
            {sectorLabel && (
              <p className="text-sm text-white/60 mt-1">
                Selected: {sectorLabel}
              </p>
            )}
          </div>
        </div>
      </section>

      {sectorQuestions.length > 0 && (
        <section className="rounded-md border border-white/10 bg-black/30 p-4 space-y-3">
          <h2 className="text-lg font-semibold">Sector-specific questions</h2>
          <div className="space-y-3">
            {sectorQuestions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm mb-1">{q.label}</label>
                <input
                  className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
                  placeholder={q.help || ""}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-md border border-white/10 bg-black/30 p-4">
        <h2 className="text-lg font-semibold mb-2">Generated brief</h2>
        <pre className="whitespace-pre-wrap text-sm bg-black/40 p-3 rounded border border-white/10">
          {brief}
        </pre>
        <div className="mt-3 flex gap-3">
          <Link
            href={{
              pathname: "/dashboard",
              query: {
                sector,
                role: roleTitle,
                location,
                brief,
              },
            }}
            className="inline-flex items-center rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/15"
          >
            Continue to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

// Keep this page fully dynamic to avoid static export issues with client hooks
export const dynamic = "force-dynamic";
