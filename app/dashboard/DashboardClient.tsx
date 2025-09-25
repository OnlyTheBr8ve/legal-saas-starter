// app/dashboard/DashboardClient.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// We normalize whatever you exported from lib/sector-config
// Works if SECTORS is an array of { value, label } OR an object map {slug: "Label"}
import { SECTORS as RAW_SECTORS } from "@/lib/sector-config";

// ---- Helpers to normalize sectors to array ----
type SectorOption = { value: string; label: string };

function toOptions(input: unknown): SectorOption[] {
  // Array format
  if (Array.isArray(input)) {
    // trust shape: { value, label }
    // filter out bad records defensively
    return input
      .map((it: any) =>
        it && typeof it.value === "string" && typeof it.label === "string"
          ? ({ value: it.value, label: it.label } as SectorOption)
          : null
      )
      .filter(Boolean) as SectorOption[];
  }

  // Record format
  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, string>).map(
      ([value, label]) => ({ value, label })
    );
  }

  return [];
}

export default function DashboardClient() {
  const sectors = useMemo(() => toOptions(RAW_SECTORS), []);
  const [sector, setSector] = useState<string>(""); // <— this makes the select actually selectable
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Sector selector */}
      <section className="mt-6">
        <label className="block text-sm mb-2">Sector</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          value={sector}
          onChange={(e) => setSector(e.target.value)} // <— important!
        >
          <option value="">— Choose a sector —</option>
          {sectors.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {sector && (
          <p className="mt-2 text-xs text-zinc-400">
            Selected: <span className="font-medium">{sector}</span>
          </p>
        )}
      </section>

      {/* Simple draft area (local-only for now) */}
      <section className="mt-8 grid gap-4">
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          placeholder="Draft title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="min-h-[220px] w-full rounded-md border border-zinc-700 bg-zinc-900 p-3"
          placeholder="Write or paste your content…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const id = crypto.randomUUID();
              const now = new Date().toISOString();
              const item = {
                id,
                title: title || "Untitled",
                content,
                sector: sector || null,
                createdAt: now,
                updatedAt: now,
              };
              const key = "drafts";
              const all: typeof item[] = JSON.parse(
                localStorage.getItem(key) || "[]"
              );
              all.unshift(item);
              localStorage.setItem(key, JSON.stringify(all));
              alert(`Saved “${item.title}”.`);
            }}
            className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Save draft (local)
          </button>

          <Link
            className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
            href={`/wizard${sector ? `?sector=${encodeURIComponent(sector)}` : ""}`}
          >
            Open Wizard
          </Link>
        </div>
      </section>
    </main>
  );
}
