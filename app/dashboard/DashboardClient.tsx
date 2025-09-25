"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DraftLibraryPanel from "@/components/DraftLibraryPanel";
import SaveDraftButton from "@/components/SaveDraftButton";
import { SECTORS } from "@/lib/sector-config";

// ---- Helper: make options regardless of SECTORS shape (array vs map) ----
type Option = { value: string; label: string };

function toOptions(input: unknown): Option[] {
  if (!input) return [];
  // Array form: [{ value, label }]
  if (Array.isArray(input)) {
    return (input as any[])
      .filter((o) => o && typeof o.value === "string")
      .map((o) => ({ value: o.value as string, label: String(o.label ?? o.value) }));
  }
  // Map form: { key: "Label" } or { key: { label } }
  if (typeof input === "object") {
    return Object.entries(input as Record<string, any>).map(([k, v]) => {
      const label = typeof v === "string" ? v : v?.label ?? k;
      return { value: k, label: String(label) };
    });
  }
  return [];
}

const sectorOptions = toOptions(SECTORS);

export default function DashboardClient() {
  const params = useSearchParams();
  const initialSector = params?.get("sector") ?? "";
  const [sector, setSector] = useState<string>(initialSector);

  // If URL changes (rare), update once
  useEffect(() => {
    const urlSector = params?.get("sector") ?? "";
    setSector((prev) => (prev || urlSector ? (prev || urlSector) : ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const sectorLabel = useMemo(() => {
    const found = sectorOptions.find((o) => o.value === sector);
    return found?.label ?? sector ?? "";
  }, [sector]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Sector picker (native select = always works) */}
      <section>
        <label className="block text-sm text-zinc-400 mb-1">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none"
        >
          <option value="">— Choose a sector —</option>
          {sectorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {sector && (
          <p className="mt-2 text-xs text-zinc-400">
            Selected: <span className="text-zinc-200">{sectorLabel}</span>
          </p>
        )}
      </section>

      {/* Your editor / actions */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {/* Put your text editor / prompt UI here. If you already have it, keep it. */}
          {/* Example action button keeps sector flowing through to save */}
          <SaveDraftButton sector={sector} />
        </div>

        <div>
          <DraftLibraryPanel sector={sector} />
        </div>
      </section>
    </main>
  );
}
