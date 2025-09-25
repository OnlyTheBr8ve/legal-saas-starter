"use client";

import { useMemo, useState } from "react";
import { SECTORS } from "@/lib/sector-config";
import SaveDraftButton from "@/components/SaveDraftButton";

// Normalize whatever SECTORS looks like into [{ value, label }]
function normalizeSectors(raw: unknown): Array<{ value: string; label: string }> {
  if (Array.isArray(raw)) {
    return (raw as any[]).map((o) => {
      if (typeof o === "string") return { value: o, label: o };
      const value =
        (o as any).value ??
        (o as any).slug ??
        (o as any).id ??
        (o as any).key ??
        "";
      const label =
        (o as any).label ??
        (o as any).name ??
        (o as any).title ??
        value ??
        "";
      return { value: String(value ?? ""), label: String(label ?? "") };
    });
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, string>).map(([value, label]) => ({
      value,
      label,
    }));
  }
  return [];
}

export default function DashboardClient() {
  const options = useMemo(() => normalizeSectors(SECTORS), []);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sector, setSector] = useState<string>("");

  const sectorLabel = useMemo(() => {
    const found = options.find((o) => o.value === sector);
    return found?.label ?? "";
  }, [sector, options]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Draft workspace</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Choose a sector, add a title and draft your content. Click “Save Draft” to store it.
        </p>
      </header>

      {/* Sector picker */}
      <section className="mb-6">
        <label htmlFor="sector" className="block text-sm font-medium mb-2">
          Sector
        </label>
        <select
          id="sector"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">— Choose a sector —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {sectorLabel && (
          <p className="mt-2 text-xs text-zinc-500">Selected: {sectorLabel}</p>
        )}
      </section>

      {/* Title input */}
      <section className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          placeholder="e.g., Website Cookies Policy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>

      {/* Content editor (simple textarea placeholder) */}
      <section className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          id="content"
          className="w-full min-h-[280px] rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          placeholder="Start drafting here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-2 text-xs text-zinc-500">
          {content.length.toLocaleString()} characters
        </div>
      </section>

      <div className="flex items-center gap-3">
        {/* IMPORTANT: SaveDraftButton needs content; title/sector are optional */}
        <SaveDraftButton content={content} title={title} sector={sector || undefined} />
      </div>
    </main>
  );
}
