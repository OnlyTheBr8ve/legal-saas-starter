"use client";

import React, { useMemo, useState } from "react";
import DraftLibraryPanel from "@/components/DraftLibraryPanel";
import { SECTORS, type SectorKey } from "@/lib/sector-config";

export default function DashboardPage() {
  // If sector comes from router/query/URL, wire that in later.
  const [sector, setSector] = useState<SectorKey | "">("");

  // Helper that is resilient to different SectorOption shapes
  const sectorLabel = useMemo(() => {
    if (!sector) return "";

    // Treat SECTORS as unknown list so we can safely probe keys
    const list = SECTORS as unknown as Array<Record<string, unknown>>;
    const found = list.find((o) => {
      const key =
        (o?.value as string | undefined) ??
        (o?.id as string | undefined) ??
        (o?.slug as string | undefined);
      return key === sector;
    });

    const label =
      (found?.label as string | undefined) ??
      (found?.name as string | undefined);

    return label ?? sector;
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

      {/* TEMP sector selector to verify the label mapping works */}
      <section className="rounded-md border border-white/10 bg-black/30 p-4">
        <label className="block text-sm mb-2">Sector</label>
        <select
          className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
          value={sector}
          onChange={(e) => setSector(e.target.value as SectorKey | "")}
        >
          <option value="">— Choose a sector —</option>
          {/* Render LABEL flexibly as well */}
          {(SECTORS as unknown as Array<Record<string, unknown>>).map((s, i) => {
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
          })}
        </select>
      </section>

      {/* Your saved drafts & library */}
      <DraftLibraryPanel />
    </main>
  );
}
