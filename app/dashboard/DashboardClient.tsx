"use client";

import { useMemo, useState } from "react";
import DraftLibraryPanel, { DraftItem } from "@/components/DraftLibraryPanel";
import SaveDraftButton from "@/components/SaveDraftButton";
import { SECTORS } from "@/lib/sector-config";

/** Robust normalizer: accepts many shapes and returns [{value,label}] */
function normalizeSectors(input: unknown): Array<{ value: string; label: string }> {
  // Array case
  if (Array.isArray(input)) {
    return (input as any[]).map((x) => {
      if (typeof x === "string") {
        return { value: x, label: x };
      }
      if (x && typeof x === "object") {
        const obj = x as Record<string, unknown>;
        // Try a bunch of sensible keys
        const valueRaw =
          obj.value ??
          obj.id ??
          obj.slug ??
          obj.key ??
          obj.code ??
          obj.name ??
          obj.label;
        const labelRaw = obj.label ?? obj.name ?? obj.title ?? valueRaw;

        const value = String(valueRaw ?? "");
        const label = String(labelRaw ?? value);
        return { value, label };
      }
      // Fallback
      return { value: String(x), label: String(x) };
    });
  }

  // Record map case
  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, unknown>).map(([k, v]) => ({
      value: k,
      label: String(v ?? k),
    }));
  }

  return [];
}

export default function DashboardClient() {
  const [sector, setSector] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);

  const onPickDraft = (d: DraftItem) => {
    setTitle(d.title || "");
    setContent(d.content || "");
    if (d.sector) setSector(d.sector);
  };

  return (
    <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-zinc-400">
        Select a sector below to personalize your drafts.
      </p>

      {/* Sector select */}
      <section className="space-y-2">
        <label className="block text-sm text-zinc-400">Sector</label>
        <select
          className="w-full rounded-md bg-zinc-900/60 px-3 py-2 text-sm outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">— Choose a sector —</option>
          {sectorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>

      {/* Editor */}
      <section className="space-y-2">
        <label className="block text-sm text-zinc-400">Title</label>
        <input
          className="w-full rounded-md bg-zinc-900/60 px-3 py-2 text-sm outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          placeholder="Untitled draft"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="mt-3 block text-sm text-zinc-400">Editor</label>
        <textarea
          className="h-64 w-full resize-y rounded-md bg-zinc-900/60 px-3 py-2 text-sm outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          placeholder="Write your draft here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-3">
          <SaveDraftButton title={title} content={content} sector={sector} />
        </div>
      </section>

      {/* Library */}
      <section className="space-y-2">
        <h3 className="text-sm text-zinc-400">Your drafts</h3>
        <DraftLibraryPanel sector={sector} onPick={onPickDraft} />
      </section>
    </main>
  );
}
