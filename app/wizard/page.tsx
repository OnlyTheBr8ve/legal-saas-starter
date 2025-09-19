// app/wizard/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SECTORS,
  SECTOR_QUESTIONS,
  type SectorKey,
} from "@/lib/sector-config";

// Prevent static generation so we don't SSR useSearchParams
export const dynamic = "force-dynamic";

export default function WizardPage() {
  const sp = useSearchParams();

  const initialSector = (sp.get("type") as SectorKey) || "general";
  const [sector, setSector] = useState<SectorKey>(initialSector);
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [pay, setPay] = useState("");
  const [extras, setExtras] = useState<Record<string, boolean>>({});

  const sectorQuestions = useMemo(
    () => SECTOR_QUESTIONS[sector] ?? [],
    [sector]
  );

  const examplePrompt = useMemo(() => {
    const checks = Object.entries(extras)
      .filter(([, v]) => v)
      .map(([k]) => k.replaceAll("_", " "))
      .join(", ");

    return (
      `Draft a UK-compliant employment contract for a ${roleTitle || "role"} in the ${sector} sector. ` +
      `Base location: ${location || "unspecified"}. Hours: ${hours || "unspecified"}. ` +
      `Pay/comp: ${pay || "unspecified"}. ` +
      (checks ? `Consider these sector-specific requirements: ${checks}. ` : "") +
      `Use plain English and add clear termination, probation, confidentiality, IP, dispute resolution, and data protection clauses.`
    );
  }, [sector, roleTitle, location, hours, pay, extras]);

  const dashboardUrl = `/dashboard?prompt=${encodeURIComponent(examplePrompt)}`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Smart Contract Wizard</h1>
        <Link
          href="/templates"
          className="text-sm text-white/70 hover:underline"
        >
          Browse Templates
        </Link>
      </div>

      {/* Sector */}
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value as SectorKey)}
          className="bg-black/20 border border-white/10 rounded px-3 py-2"
        >
          {SECTORS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Basics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Role title</label>
          <input
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Bar Supervisor / Site Manager"
            className="bg-black/20 border border-white/10 rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-white/70">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. London, on-site"
            className="bg-black/20 border border-white/10 rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-white/70">Hours</label>
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 40 hrs/week, shifts"
            className="bg-black/20 border border-white/10 rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-white/70">Pay / Compensation</label>
          <input
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            placeholder="e.g. £14/hr + tips"
            className="bg-black/20 border border-white/10 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Sector-specific prompts */}
      {sectorQuestions.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <h2 className="font-semibold mb-3">Sector-specific considerations</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sectorQuestions.map((q) => {
              const id = q.key;
              const checked = !!extras[id];
              return (
                <label
                  key={id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setExtras((prev) => ({
                        ...prev,
                        [id]: !checked,
                      }))
                    }
                  />
                  <span>{q.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="rounded-lg border border-white/10 bg-black/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Generated prompt preview</h3>
          <Link
            href={dashboardUrl}
            className="rounded-md px-3 py-1.5 bg-white text-black text-sm font-medium hover:opacity-90"
          >
            Use in Dashboard
          </Link>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-white/80">
          {examplePrompt}
        </pre>
      </div>
    </main>
  );
}
