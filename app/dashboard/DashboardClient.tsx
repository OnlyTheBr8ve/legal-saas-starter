"use client";

import { useMemo, useState } from "react";
import DraftLibraryPanel, { DraftItem } from "@/components/DraftLibraryPanel";
import SaveDraftButton from "@/components/SaveDraftButton";
import { SECTORS } from "@/lib/sector-config";

/**
 * Full dashboard client:
 * - Sector dropdown (works with SECTORS as array or record)
 * - Title + Editor
 * - Save Draft button (uses your existing SaveDraftButton component)
 * - Draft library list; click an item to load it back into the editor
 */
export default function DashboardClient() {
  const [sector, setSector] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Normalize SECTORS => [{ value, label }]
  const sectorOptions = useMemo(() => {
    if (Array.isArray(SECTORS)) {
      // Already of shape { value, label }
      return SECTORS as Array<{ value: string; label: string }>;
    }
    // Record<string, string>
    return Object.entries(SECTORS as Record<string, string>).map(
      ([value, label]) => ({ value, label })
    );
  }, []);

  // When user clicks a draft in the library
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
          {/* Save with current values */}
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
