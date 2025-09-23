"use client";

import React, { useMemo, useState } from "react";
import DraftLibraryPanel from "@/components/DraftLibraryPanel";
import { SECTORS, type SectorKey } from "@/lib/sector-config";

export default function DashboardPage() {
  // If you’re pulling sector from a form/router, wire it in here:
  const [sector, setSector] = useState<SectorKey | "">("");

  // Correctly map the sector value to a label from the SECTORS array
  const sectorLabel = useMemo(() => {
    if (!sector) return "";
    const opt = SECTORS.find(
      (o: { value: string; label: string }) => o.value === sector
    );
    return opt?.label ?? sector;
  }, [sector]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {sectorLabel ? (
            <p className="text-white/70">Selected sector: {sectorLabel}</p>
          ) : (
            <p className="text-white/50">
              Select a sector below to personalize your drafts.
            </p>
          )}
        </div>
      </header>

      {/* TEMP sector selector just so you can verify the label mapping works */}
      <section className="rounded-md border border-white/10 bg-black/30 p-4">
        <label className="block text-sm mb-2">Sector</label>
        <select
          className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
          value={sector}
          onChange={(e) => setSector(e.target.value as SectorKey | "")}
        >
          <option value="">— Choose a sector —</option>
          {SECTORS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </section>

      {/* Your saved drafts & library */}
      <DraftLibraryPanel />
    </main>
  );
}
